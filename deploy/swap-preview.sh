#!/usr/bin/env bash
# Mette il nuovo sito nell'anteprima esistente (contenitore simplyx-website-preview), senza toccare
# Caddy, DNS, il contenitore o altri progetti: sostituisce solo i file della cartella che il contenitore già serve.
#
#   bash deploy/swap-preview.sh            # controlla e mostra cosa farebbe (non cambia nulla)
#   bash deploy/swap-preview.sh --apply    # copia di sicurezza + sostituzione
#   bash deploy/swap-preview.sh --rollback # rimette l'ultima copia di sicurezza
set -euo pipefail
C="simplyx-website-preview"
here="$(cd "$(dirname "$0")/.." && pwd)"
BK="/srv/simplyx/backups"
mode="${1:-check}"

SRC="$(docker inspect "$C" --format '{{range .Mounts}}{{if eq .Destination "/usr/share/nginx/html"}}{{.Source}}{{end}}{{end}}')"
echo "Il contenitore $C serve la cartella: ${SRC:-<non trovata>}"
[ -n "$SRC" ] || { echo "STOP: non trovo la cartella servita. Mandami: docker inspect $C --format '{{json .Mounts}}'"; exit 1; }
case "$SRC" in
  /srv/simplyx/website/dist|/srv/simplyx/website/dist/|"$here/live") ;;
  *) echo "STOP: cartella inattesa (né /srv/simplyx/website/dist né $here/live). Non tocco nulla: mandami questa riga."; exit 1;;
esac
[ -w "$SRC" ] || { echo "STOP: non ho i permessi di scrittura su $SRC"; exit 1; }

if [ "$mode" = "--rollback" ]; then
  last="$(ls -t "$BK"/website-dist-*.tar.gz 2>/dev/null | head -1)"
  [ -n "$last" ] || { echo "Nessuna copia di sicurezza in $BK"; exit 1; }
  find "$SRC" -mindepth 1 -delete
  tar xzf "$last" -C "$SRC"
  echo "Ripristinato da $last"; exit 0
fi

[ -f "$here/dist/index.html" ] || { echo "STOP: manca dist/. Esegui prima: npm run build:preview"; exit 1; }
echo "Nuovo sito: $(find "$here/dist" -type f | wc -l) file, $(du -sh "$here/dist" | cut -f1)"
echo "Sito attuale: $(find "$SRC" -type f | wc -l) file, $(du -sh "$SRC" | cut -f1)"
if [ "$mode" != "--apply" ]; then echo "Controllo riuscito, nulla è stato cambiato. Per procedere: bash deploy/swap-preview.sh --apply"; exit 0; fi

mkdir -p "$BK"
bk="$BK/website-dist-$(date +%Y%m%d-%H%M%S).tar.gz"
tar czf "$bk" -C "$SRC" .
echo "Copia di sicurezza: $bk"
find "$SRC" -mindepth 1 -delete
cp -a "$here/dist/." "$SRC/"
echo "Fatto. Apri l'anteprima e ricarica la pagina. Per tornare indietro: bash deploy/swap-preview.sh --rollback"
