#!/usr/bin/env bash
# Pulizia dopo il passaggio al sito nuovo. Da lanciare dal proprietario, un passo alla volta.
#
#   bash deploy/cleanup-old.sh                 # elenca cosa c'è e cosa verrebbe tolto (non cambia nulla)
#   bash deploy/cleanup-old.sh --apply-site    # toglie il vecchio sito (cartella + contenitore di scorta)
#   bash deploy/cleanup-old.sh --apply-codex   # toglie Codex dalla VM (processi, avvio automatico, cartella ~/.codex)
#
# Non tocca: il sito nuovo (website-new), Caddy, la Factory, Bellaria, Advoca, CRM, demo, test2, le copie in backups/.
set -euo pipefail
OLD_DIR="/srv/simplyx/website-vecchio"
OLD_C="simplyx-website-preview-old"
LIVE_C="simplyx-website-preview"
BK="/srv/simplyx/backups"
CODEX_DIR="$HOME/.codex"
mode="${1:-check}"

size() { [ -e "$1" ] && du -sh "$1" 2>/dev/null | cut -f1 || echo "-"; }
has_c() { docker ps -a --format '{{.Names}}' | grep -qx "$1"; }
codex_units() { systemctl --user list-unit-files 2>/dev/null | awk '{print $1}' | grep -i codex || true; }
codex_procs() { pgrep -u "$(id -u)" -af "$CODEX_DIR/|/codex( |$)|codex-code-mode-host" 2>/dev/null | grep -v -E "pgrep|cleanup-old" || true; }

report() {
  echo "== VECCHIO SITO =="
  echo "Cartella $OLD_DIR: $([ -d "$OLD_DIR" ] && echo "presente, $(size "$OLD_DIR")" || echo "assente")"
  [ -d /srv/simplyx/website ] && echo "ATTENZIONE: esiste di nuovo /srv/simplyx/website (qualcuno l'ha ricreata): NON viene toccata, dimmelo."
  echo "Contenitore di scorta $OLD_C: $(has_c "$OLD_C" && docker ps -a --filter "name=^${OLD_C}$" --format '{{.Status}}' || echo assente)"
  echo "Sito nuovo servito da: $(docker inspect "$LIVE_C" --format '{{range .Mounts}}{{if eq .Destination "/usr/share/nginx/html"}}{{.Source}}{{end}}{{end}}' 2>/dev/null || echo '?')"
  echo
  echo "== CODEX =="
  echo "Cartella $CODEX_DIR: $([ -d "$CODEX_DIR" ] && echo "presente, $(size "$CODEX_DIR")" || echo "assente")"
  echo "Processi attivi:"; codex_procs | cut -c1-110 | sed 's/^/  /'; [ -n "$(codex_procs)" ] || echo "  nessuno"
  echo "Avvio automatico (unità del tuo utente):"; codex_units | sed 's/^/  /'; [ -n "$(codex_units)" ] || echo "  nessuna"
  echo "Comando 'codex' installato: $(command -v codex 2>/dev/null || echo no)"
  echo "Pacchetto npm globale: $(npm ls -g --depth=0 2>/dev/null | grep -i codex || echo no)"
  if [ -r "$HOME/.ssh/authorized_keys" ]; then echo "Chiavi SSH ammesse sulla VM (solo l'etichetta, non la chiave):"; awk 'NF && $1 !~ /^#/ {print "  - " ($NF ~ /^AAAA/ ? "(senza etichetta)" : $NF)}' "$HOME/.ssh/authorized_keys"; fi
}

case "$mode" in
  check)
    report
    echo; echo "Nulla è stato cambiato."
    echo "Per togliere il vecchio sito:  bash deploy/cleanup-old.sh --apply-site"
    echo "Per togliere Codex:            bash deploy/cleanup-old.sh --apply-codex" ;;

  --apply-site)
    SRC="$(docker inspect "$LIVE_C" --format '{{range .Mounts}}{{if eq .Destination "/usr/share/nginx/html"}}{{.Source}}{{end}}{{end}}' 2>/dev/null || true)"
    case "$SRC" in /srv/simplyx/website-new/live) ;; *) echo "STOP: il sito online non risulta servito da website-new/live ($SRC). Non cancello nulla."; exit 1;; esac
    docker exec "$LIVE_C" test -f /usr/share/nginx/html/index.html || { echo "STOP: il sito nuovo non risponde. Non cancello nulla."; exit 1; }
    if [ -d "$OLD_DIR" ]; then
      mkdir -p "$BK"; a="$BK/website-vecchio-sorgente-$(date +%Y%m%d-%H%M%S).tar.gz"
      tar czf "$a" --exclude=node_modules --exclude=test-results -C "$(dirname "$OLD_DIR")" "$(basename "$OLD_DIR")"
      echo "Archivio del vecchio sorgente (senza node_modules): $a ($(size "$a"))"
      rm -rf -- "/srv/simplyx/website-vecchio"
      echo "Cartella $OLD_DIR cancellata."
    else echo "Cartella $OLD_DIR già assente."; fi
    if has_c "$OLD_C"; then
      [ "$(docker inspect "$OLD_C" --format '{{.State.Running}}')" = "false" ] || { echo "STOP: $OLD_C è in esecuzione, non lo tolgo."; exit 1; }
      docker rm "$OLD_C" >/dev/null && echo "Contenitore di scorta $OLD_C rimosso."
    else echo "Contenitore $OLD_C già assente."; fi
    echo "Fatto. Il sito nuovo non è stato toccato." ;;

  --apply-codex)
    for u in $(codex_units); do systemctl --user disable --now "$u" >/dev/null 2>&1 && echo "Avvio automatico spento: $u" || true; done
    pids="$(codex_procs | awk '{print $1}')"
    if [ -n "$pids" ]; then kill $pids 2>/dev/null || true; sleep 2; pids2="$(codex_procs | awk '{print $1}')"; [ -z "$pids2" ] || kill -9 $pids2 2>/dev/null || true; echo "Processi di Codex chiusi."; else echo "Nessun processo di Codex attivo."; fi
    if npm ls -g --depth=0 2>/dev/null | grep -qi "@openai/codex"; then npm uninstall -g @openai/codex >/dev/null 2>&1 && echo "Pacchetto npm @openai/codex disinstallato." || echo "Non sono riuscito a disinstallare il pacchetto npm (forse serve sudo): fallo a mano con: sudo npm uninstall -g @openai/codex"; fi
    if [ -d "$CODEX_DIR" ]; then rm -rf -- "$HOME/.codex"; echo "Cartella $CODEX_DIR cancellata (programma, accesso salvato e registri delle sessioni)."; else echo "Cartella $CODEX_DIR già assente."; fi
    sleep 1
    [ -z "$(codex_procs)" ] && echo "Controllo: nessun processo di Codex in esecuzione." || { echo "ATTENZIONE: un processo di Codex è ripartito:"; codex_procs | cut -c1-110; echo "Vuol dire che qualcosa lo rilancia da fuori (app collegata via SSH): mandami queste righe."; }
    command -v codex >/dev/null 2>&1 && echo "Nota: il comando 'codex' esiste ancora in $(command -v codex): mandami questa riga." || true
    echo "Fatto. Ricorda di scollegare la VM anche dall'app di Codex/ChatGPT (vedi istruzioni)." ;;

  *) sed -n '2,9p' "$0"; exit 1 ;;
esac
