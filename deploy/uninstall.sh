#!/usr/bin/env bash
# Rimuove il sito Simplyx dalla VM: container, immagine, rete e file del proxy dedicati.
set -euo pipefail
cd "$(dirname "$0")/.."
SUDO=""; [[ $EUID -ne 0 ]] && SUDO="sudo"
docker compose down --rmi local --remove-orphans || true
for f in /etc/caddy/sites/simplyx-site.caddy /etc/nginx/sites-enabled/simplyx-site.conf /etc/nginx/sites-available/simplyx-site.conf /etc/nginx/conf.d/simplyx-site.conf; do
  [[ -e "$f" ]] && $SUDO rm -f "$f" && echo "Rimosso $f"
done
if systemctl is-active --quiet caddy 2>/dev/null; then $SUDO systemctl reload caddy; fi
if systemctl is-active --quiet nginx 2>/dev/null && $SUDO nginx -t 2>/dev/null; then $SUDO systemctl reload nginx; fi
echo "Sito rimosso. Gli altri servizi della VM non sono stati toccati."
