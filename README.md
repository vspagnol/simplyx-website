# Sito Simplyx

Sito statico (IT / EN, vista Aziende e PMI, area clienti **demo**) servito da un container nginx isolato.

```
src/data.mjs          testi homepage (IT / EN)        ← si modifica qui
src/portal-data.mjs   testi area clienti (IT / EN)
src/site.css          stile
src/home.js           switch Aziende / PMI
src/portal.js         area clienti demo (nessun dato inviato)
src/build.mjs         genera dist/  →  npm run build
static/               font self-hosted (niente Google Fonts, ok GDPR), immagini, favicon
deploy/               nginx.conf, install.sh, uninstall.sh
compose.yaml          progetto Docker "simplyx-site"
```

## Isolamento sulla VM

- Progetto Docker a sé (`simplyx-site`) con rete propria `simplyx-site-net`: nessun collegamento ai container di SALONI, Mission Control o Orchestrator.
- Container in sola lettura, utente non-root, nessuna capability, `no-new-privileges`, 128 MB di RAM e mezza CPU.
- Pubblicato **solo** su `127.0.0.1:8091`: dall'esterno si raggiunge unicamente attraverso il reverse proxy.
- Da installare in una cartella propria (es. `/opt/simplyx-site`), **fuori** dal repo dell'Orchestrator.

## Installazione

```bash
git clone <URL-del-repo> /opt/simplyx-site && cd /opt/simplyx-site
./deploy/install.sh --domain new.simplyx.it            # 1) avvia il container, stampa la config del proxy
./deploy/install.sh --domain new.simplyx.it --apply    # 2) dopo averla controllata, la applica (backup + test + rollback)
```

- Anteprima: password richiesta all'avvio (utente `simplyx`), pagine marcate `noindex`.
- Messa online definitiva: `./deploy/install.sh --domain simplyx.it --public --apply`.
- DNS: record **A** del dominio verso l'IP pubblico della VM.
- Aggiornare dopo una modifica: `git pull && docker compose up -d --build`.
- Rimuovere tutto: `./deploy/uninstall.sh`.

Il proxy viene modificato **solo** se è Caddy o nginx installati sul sistema e solo con `--apply`:
viene aggiunto un file dedicato (`simplyx-site`), la configurazione viene validata e,
se il test fallisce, la modifica viene annullata. Se il proxy gira in un container
(Traefik, Caddy, nginx), lo script non lo tocca e lascia gli esempi in `deploy/out/`.

## Prompt per Claude Code sulla VM

> Installa il sito Simplyx dal repo `<URL>` in `/opt/simplyx-site`, **non** nel repo dell'Orchestrator.
> Leggi il README. Prima di cambiare il reverse proxy mostrami cosa c'è oggi
> (`docker ps`, `systemctl status caddy nginx`, porte 80/443) e chiedimi conferma.
> Lancia `./deploy/install.sh --domain new.simplyx.it` senza `--apply`, verifica con
> `curl -I http://127.0.0.1:8091/` (atteso 401) e solo dopo il mio ok applica il proxy.
> Non toccare container, reti o file di SALONI, Mission Control e Orchestrator.
> Alla fine aggiorna HANDOFF.md con cosa hai fatto.

## Da completare prima della messa online

- Testi tra parentesi quadre: numeri, prezzi dei pacchetti, contatti, P.IVA, recensioni, casi studio.
- Pagine Privacy e Cookie (il sito non usa cookie né tracciamento).
- Area clienti reale: oggi è una demo senza backend; login e pagamenti vanno collegati (es. gateway PCI-DSS).
