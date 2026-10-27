#!/usr/bin/env bash
# Installa il sito Simplyx come progetto Docker isolato sulla VM.
#
#   ./deploy/install.sh --domain new.simplyx.it            # anteprima protetta da password (default)
#   ./deploy/install.sh --domain new.simplyx.it --apply    # configura anche il reverse proxy (con backup e rollback)
#   ./deploy/install.sh --domain simplyx.it --public       # pubblico: senza password e indicizzabile
#
# Non tocca altri container, reti o file della VM, tranne il file del proxy
# dedicato al sito quando si usa --apply (sempre con backup e test della config).
set -euo pipefail

DOMAIN=""; PORT="8091"; APPLY=0; PUBLIC=0; PROXY="auto"; USER_NAME="simplyx"
here="$(cd "$(dirname "$0")/.." && pwd)"; cd "$here"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain) DOMAIN="$2"; shift 2;;
    --port) PORT="$2"; shift 2;;
    --apply) APPLY=1; shift;;
    --public) PUBLIC=1; shift;;
    --proxy) PROXY="$2"; shift 2;;
    --user) USER_NAME="$2"; shift 2;;
    -h|--help) sed -n '2,10p' "$0"; exit 0;;
    *) echo "Opzione sconosciuta: $1" >&2; exit 2;;
  esac
done
[[ -n "$DOMAIN" ]] || { echo "Serve --domain (es. new.simplyx.it)" >&2; exit 2; }
[[ "$DOMAIN" =~ ^[a-zA-Z0-9.-]+$ ]] || { echo "Dominio non valido" >&2; exit 2; }
[[ "$PORT" =~ ^[0-9]+$ ]] || { echo "Porta non valida" >&2; exit 2; }

say(){ printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }
warn(){ printf '\033[1;33m! %s\033[0m\n' "$*"; }
SUDO=""; [[ $EUID -ne 0 ]] && SUDO="sudo"

say "Controlli preliminari"
command -v docker >/dev/null || { echo "Docker non trovato" >&2; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "Serve il plugin 'docker compose'" >&2; exit 1; }
if ss -ltn 2>/dev/null | awk '{print $4}' | grep -qE "[:.]${PORT}\$"; then
  if ! docker ps --format '{{.Names}} {{.Ports}}' | grep -q "simplyx-site-web.*:${PORT}->"; then
    echo "La porta ${PORT} è già usata da un altro servizio. Scegline un'altra con --port" >&2; exit 1
  fi
fi

say "Configurazione"
mkdir -p auth
if [[ $PUBLIC -eq 1 ]]; then
  rm -f auth/auth.conf auth/htpasswd
  NOINDEX=0; echo "Sito pubblico: nessuna password, indicizzabile."
else
  NOINDEX=1
  if [[ ! -s auth/htpasswd ]]; then
    read -r -s -p "Scegli la password per l'anteprima (utente: ${USER_NAME}): " PW; echo
    [[ ${#PW} -ge 10 ]] || { echo "Usa almeno 10 caratteri" >&2; exit 1; }
    HASH="$(printf '%s' "$PW" | openssl passwd -apr1 -stdin)"; unset PW
    printf '%s:%s\n' "$USER_NAME" "$HASH" > auth/htpasswd
  else
    echo "Password già presente in auth/htpasswd (per cambiarla, cancella il file e rilancia)."
  fi
  printf 'auth_basic "Simplyx preview";\nauth_basic_user_file /etc/nginx/auth/htpasswd;\n' > auth/auth.conf
  chmod 644 auth/htpasswd auth/auth.conf   # letti da nginx (uid 101) nel container; la cartella resta del deploy
fi
cat > .env <<EOF
SITE_URL=https://${DOMAIN}
NOINDEX=${NOINDEX}
SITE_PORT=${PORT}
EOF

say "Build e avvio del container (progetto Docker: simplyx-site)"
docker compose up -d --build
for i in $(seq 1 30); do
  curl -fsS "http://127.0.0.1:${PORT}/healthz" >/dev/null 2>&1 && break; sleep 1
done
curl -fsS "http://127.0.0.1:${PORT}/healthz" >/dev/null || { echo "Il container non risponde"; docker compose logs --tail 50; exit 1; }
code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}/")
echo "Container attivo su 127.0.0.1:${PORT} (home → HTTP ${code}; 401 = password attiva)"

say "Reverse proxy"
detect() {
  if docker ps --format '{{.Image}}' | grep -qiE '(^|/)traefik'; then echo traefik; return; fi
  if docker ps --format '{{.Image}}' | grep -qiE '(^|/)caddy'; then echo caddy-docker; return; fi
  if docker ps --format '{{.Image}}' | grep -qiE 'nginx-proxy|(^|/)nginx'; then echo nginx-docker; return; fi
  if systemctl is-active --quiet caddy 2>/dev/null; then echo caddy; return; fi
  if systemctl is-active --quiet nginx 2>/dev/null; then echo nginx; return; fi
  echo none
}
[[ "$PROXY" == "auto" ]] && PROXY="$(detect)"
echo "Proxy rilevato: ${PROXY}"
mkdir -p deploy/out

CADDY_SNIPPET="${DOMAIN} {
	encode zstd gzip
	reverse_proxy 127.0.0.1:${PORT}
}
"
NGINX_SNIPPET="server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
"
printf '%s' "$CADDY_SNIPPET" > deploy/out/caddy-simplyx-site.caddy
printf '%s' "$NGINX_SNIPPET" > deploy/out/nginx-simplyx-site.conf

case "$PROXY" in
  caddy)
    if [[ $APPLY -eq 1 ]]; then
      CF=/etc/caddy/Caddyfile; TS=$(date +%Y%m%d-%H%M%S)
      $SUDO mkdir -p /etc/caddy/sites
      if ! grep -qE '^\s*import\s+/etc/caddy/sites/\*' "$CF"; then
        $SUDO cp "$CF" "$CF.bak-$TS"
        printf '\nimport /etc/caddy/sites/*\n' | $SUDO tee -a "$CF" >/dev/null
      fi
      $SUDO cp deploy/out/caddy-simplyx-site.caddy /etc/caddy/sites/simplyx-site.caddy
      if $SUDO caddy validate --config "$CF" --adapter caddyfile >/dev/null 2>&1; then
        $SUDO systemctl reload caddy && echo "Caddy aggiornato (HTTPS automatico)."
      else
        warn "Config Caddy non valida: annullo."; $SUDO rm -f /etc/caddy/sites/simplyx-site.caddy
        [[ -f "$CF.bak-$TS" ]] && $SUDO cp "$CF.bak-$TS" "$CF"; exit 1
      fi
    else echo "Da aggiungere al Caddyfile (oppure rilancia con --apply):"; cat deploy/out/caddy-simplyx-site.caddy; fi;;
  nginx)
    if [[ $APPLY -eq 1 ]]; then
      if [[ -d /etc/nginx/sites-available ]]; then T=/etc/nginx/sites-available/simplyx-site.conf; L=/etc/nginx/sites-enabled/simplyx-site.conf
      else T=/etc/nginx/conf.d/simplyx-site.conf; L=""; fi
      $SUDO cp deploy/out/nginx-simplyx-site.conf "$T"; [[ -n "$L" ]] && $SUDO ln -sf "$T" "$L"
      if $SUDO nginx -t 2>/dev/null; then
        $SUDO systemctl reload nginx && echo "Nginx aggiornato."
        if command -v certbot >/dev/null; then $SUDO certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --redirect --register-unsafely-without-email || warn "Certificato non emesso: controlla che il DNS punti alla VM e rilancia."
        else warn "certbot non installato: HTTPS da configurare."; fi
      else
        warn "Config nginx non valida: annullo."; $SUDO rm -f "$T" ${L:+"$L"}; exit 1
      fi
    else echo "Da aggiungere a nginx (oppure rilancia con --apply):"; cat deploy/out/nginx-simplyx-site.conf; fi;;
  traefik|caddy-docker|nginx-docker)
    warn "Il proxy gira in un container: non lo modifico in automatico per non toccare SALONI e gli altri servizi."
    echo "Aggiungi una rotta verso http://host.docker.internal:${PORT} (o l'IP del gateway Docker) per ${DOMAIN}."
    echo "Esempi pronti in deploy/out/.";;
  none)
    warn "Nessun reverse proxy trovato. Il sito risponde solo in locale su 127.0.0.1:${PORT}."
    echo "Consigliato: installare Caddy e rilanciare con --proxy caddy --apply.";;
esac

say "Fatto"
echo "• Container:  docker compose -p simplyx-site ps   |   log: docker compose logs -f"
echo "• Anteprima:  https://${DOMAIN}  $( [[ $PUBLIC -eq 1 ]] && echo '(pubblico)' || echo "(utente: ${USER_NAME})")"
echo "• DNS:        record A di ${DOMAIN} → IP pubblico della VM"
echo "• Rimozione:  ./deploy/uninstall.sh"
