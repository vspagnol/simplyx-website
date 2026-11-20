#!/usr/bin/env bash
# Stacca il sito nuovo dalla cartella del vecchio progetto.
# Oggi il contenitore simplyx-website-preview serve /srv/simplyx/website/dist, che il vecchio progetto
# riscrive quando viene ricostruito. Questo script ricrea lo stesso contenitore (stesso nome, stessa rete,
# stessa immagine) facendogli servire una cartella che appartiene solo al sito nuovo: website-new/live.
# Non tocca Caddy, DNS né altri contenitori. Il contenitore di prima viene fermato e conservato per il ritorno.
#
#   bash deploy/own-container.sh             # controlla e mostra cosa farebbe (non cambia nulla)
#   bash deploy/own-container.sh --apply     # esegue (il sito resta fermo pochi secondi)
#   bash deploy/own-container.sh --rollback  # rimette il contenitore di prima
set -euo pipefail
C="simplyx-website-preview"; OLD="${C}-old"
here="$(cd "$(dirname "$0")/.." && pwd)"
LIVE="$here/live"
mode="${1:-check}"

exists() { docker ps -a --format '{{.Names}}' | grep -qx "$1"; }

if [ "$mode" = "--rollback" ]; then
  exists "$OLD" || { echo "Non c'è un contenitore di prima ($OLD) da rimettere."; exit 1; }
  docker rm -f "$C" >/dev/null 2>&1 || true
  docker rename "$OLD" "$C" && docker start "$C" >/dev/null
  echo "Rimesso il contenitore di prima (serve di nuovo /srv/simplyx/website/dist)."; exit 0
fi

exists "$C" || { echo "STOP: il contenitore $C non esiste."; exit 1; }
SRC="$(docker inspect "$C" --format '{{range .Mounts}}{{if eq .Destination "/usr/share/nginx/html"}}{{.Source}}{{end}}{{end}}')"
IMG="$(docker inspect "$C" --format '{{.Config.Image}}')"
NETS="$(docker inspect "$C" --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}')"
PORTS="$(docker inspect "$C" --format '{{json .HostConfig.PortBindings}}')"
COMPOSE="$(docker inspect "$C" --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' 2>/dev/null || true)"
echo "Contenitore:        $C"
echo "Immagine:           $IMG"
echo "Reti:               $NETS"
echo "Cartella servita:   $SRC"
echo "Porte pubblicate:   $PORTS"
[ -n "$COMPOSE" ] && [ "$COMPOSE" != "<no value>" ] && echo "ATTENZIONE: creato da un file compose ($COMPOSE). Se qualcuno rilancia quel compose, torna la cartella vecchia."

if [ "$SRC" = "$LIVE" ]; then echo "Già a posto: il contenitore serve $LIVE. Nulla da fare."; exit 0; fi
[ "$SRC" = "/srv/simplyx/website/dist" ] || { echo "STOP: cartella servita inattesa. Non tocco nulla: mandami queste righe."; exit 1; }
[ "$PORTS" = "{}" ] || [ "$PORTS" = "null" ] || { echo "STOP: il contenitore pubblica porte sull'host, caso non previsto. Mandami queste righe."; exit 1; }
[ -n "${NETS// /}" ] || { echo "STOP: nessuna rete trovata."; exit 1; }
exists "$OLD" && { echo "STOP: esiste già $OLD (un tentativo precedente). Fai prima --rollback oppure dimmelo."; exit 1; }
[ -f "$here/dist/index.html" ] || { echo "STOP: manca dist/. Esegui prima: npm run build"; exit 1; }
echo "Nuova cartella:     $LIVE  ($(find "$here/dist" -type f | wc -l) file)"
if [ "$mode" != "--apply" ]; then echo; echo "Controllo riuscito, nulla è stato cambiato. Per procedere: bash deploy/own-container.sh --apply"; exit 0; fi

mkdir -p "$LIVE"
find "$LIVE" -mindepth 1 -delete
cp -a "$here/dist/." "$LIVE/"

first="${NETS%% *}"
docker stop "$C" >/dev/null
docker rename "$C" "$OLD"
if docker run -d --name "$C" --restart unless-stopped --network "$first" -v "$LIVE:/usr/share/nginx/html:ro" "$IMG" >/dev/null; then
  for n in $NETS; do [ "$n" = "$first" ] || docker network connect "$n" "$C"; done
  sleep 2
  if docker exec "$C" test -f /usr/share/nginx/html/index.html; then
    echo "Fatto. Il sito nuovo ora ha una cartella sua: il vecchio progetto non può più sovrascriverlo."
    echo "Il contenitore di prima è fermo e conservato come $OLD. Per tornare indietro: bash deploy/own-container.sh --rollback"
    echo "D'ora in poi, per aggiornare il sito: git pull && npm run build && bash deploy/swap-preview.sh --apply"
    exit 0
  fi
fi
echo "Qualcosa non è andato: rimetto il contenitore di prima."
docker rm -f "$C" >/dev/null 2>&1 || true
docker rename "$OLD" "$C" && docker start "$C" >/dev/null
echo "Ripristinato. Nulla è cambiato."; exit 1
