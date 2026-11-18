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
