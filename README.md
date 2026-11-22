# Sito SimplyX

Sito corporate statico. Nessuna dipendenza per la build oltre a Node 22.

```
npm run build            # genera dist/ (SITE_URL=https://simplyx.it)
npm run build:preview    # come sopra, ma non indicizzabile (anteprima)
npm test                 # controlli Playwright + accessibilità (serve: npm i)
npm run shots            # screenshot desktop e telefono in docs/screens/
```

- Testi: `src/content.mjs` · Struttura: `src/build.mjs` · Stile: `src/site.css` · Script: `src/site.js`
- Foto: originali in `assets-src/`, ottimizzate con `python3 tools/images.py` in `static/img/photos/`
- Contenitore: `Dockerfile` + `compose.yaml` (solo `127.0.0.1:8091`), regole in `CLAUDE.md`
- Versione precedente: `legacy/v1/` · Report: `docs/reports/`

## Pubblicazione su Cloudflare (in prova dal 22/11/2026)

Il sito è statico e può essere servito da Cloudflare al posto del contenitore sulla VM. Finché il dominio non viene spostato, la VM resta com'è.

| Impostazione su Cloudflare | Valore |
|---|---|
| Repository | `vspagnol/simplyx-website` |
| Ramo di produzione | `redesign-2026-11` |
| Comando di build (prova, nascosto ai motori) | `npm run build:preview` |
| Comando di build (dominio vero) | `npm run build` |
| Comando di deploy | `npx wrangler deploy` |

Le intestazioni di sicurezza e di cache stanno in `dist/_headers`, generato da `src/build.mjs` con le stesse regole di `deploy/nginx.conf`.
Prima di spostare `simplyx.it`: copiare su Cloudflare tutti i record della posta (MX, SPF, DKIM, DMARC) e verificarli.
