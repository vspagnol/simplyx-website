#!/usr/bin/env bash
# Aggiunge simplyx.it e www.simplyx.it al Caddy condiviso (contenitore simplyx-caddy), puntandoli al
# contenitore del sito già esistente. Aggiunge solo righe in fondo: non modifica i blocchi degli altri progetti.
#
#   bash deploy/publish-caddy.sh             # controlla e mostra cosa aggiungerebbe (non cambia nulla)
#   bash deploy/publish-caddy.sh --apply     # copia di sicurezza, aggiunta, verifica, ricarica
#   bash deploy/publish-caddy.sh --rollback  # rimette l'ultima copia di sicurezza e ricarica
set -euo pipefail
CADDY="simplyx-caddy"; SITE="simplyx-website-preview"; BK="/srv/simplyx/backups"
mode="${1:-check}"

FILE="$(docker inspect "$CADDY" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}')"
if [ -z "$FILE" ]; then
  DIR="$(docker inspect "$CADDY" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy"}}{{.Source}}{{end}}{{end}}')"
  [ -n "$DIR" ] && FILE="$DIR/Caddyfile"
fi
echo "File di Caddy sulla VM: ${FILE:-<non trovato>}"
[ -n "$FILE" ] && [ -f "$FILE" ] || { echo "STOP: non trovo il Caddyfile. Mandami: docker inspect $CADDY --format '{{json .Mounts}}'"; exit 1; }
[ -w "$FILE" ] || { echo "STOP: non ho i permessi di scrittura su $FILE. Rilancia lo stesso comando con sudo davanti."; exit 1; }
docker ps --format '{{.Names}}' | grep -qx "$SITE" || { echo "STOP: il contenitore $SITE non è attivo"; exit 1; }

validate() { docker exec "$CADDY" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; }
reload()   { docker exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; }

if [ "$mode" = "--rollback" ]; then
  last="$(ls -t "$BK"/Caddyfile-*.bak 2>/dev/null | head -1)"
  [ -n "$last" ] || { echo "Nessuna copia di sicurezza in $BK"; exit 1; }
  cat "$last" > "$FILE"
  validate && reload && echo "Ripristinato da $last e ricaricato."; exit 0
fi

if grep -qE '^(www\.)?simplyx\.it[ ,{]' "$FILE"; then echo "simplyx.it è già presente nel Caddyfile: non aggiungo nulla."; exit 0; fi
validate || { echo "STOP: il Caddyfile attuale non supera già la verifica. Non tocco nulla."; exit 1; }

BLOCK='
# SimplyX — sito corporate (produzione)
simplyx.it {
	encode zstd gzip
	reverse_proxy '"$SITE"':80
}
www.simplyx.it {
	redir https://simplyx.it{uri} permanent
}'
echo "Righe che verrebbero aggiunte in fondo:"; echo "$BLOCK"
if [ "$mode" != "--apply" ]; then echo; echo "Controllo riuscito, nulla è stato cambiato. Per procedere: bash deploy/publish-caddy.sh --apply"; exit 0; fi

mkdir -p "$BK"; bk="$BK/Caddyfile-$(date +%Y%m%d-%H%M%S).bak"
cp -p "$FILE" "$bk"; echo "Copia di sicurezza: $bk"
printf '%s\n' "$BLOCK" >> "$FILE"
if validate; then
  reload && echo "Fatto: Caddy ricaricato. Gli altri siti non sono stati toccati."
  echo "Il certificato HTTPS arriva da solo pochi minuti dopo il cambio DNS."
else
  cat "$bk" > "$FILE"; echo "STOP: la nuova configurazione non supera la verifica. Ho rimesso il file di prima, nulla è cambiato."; exit 1
fi
