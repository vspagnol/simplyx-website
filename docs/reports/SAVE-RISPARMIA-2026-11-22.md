# Report — Risparmia AI nella pagina SimplyX Save (22/11/2026)

Ramo: `redesign-2026-11`. Nulla è stato toccato sulla VM o su altri progetti.

## Fatto
- Pagina `/save/`: nuova sezione «Risparmia AI» tra «Come funziona» e «Ambiti», con lo schema animato dei costi (cinque aree → Risparmia AI → resoconto mensile, piano a 24 mesi, avvisi; le correzioni tornano sui contratti).
- Tre punti in evidenza: verifica iniziale senza costi; integrazione con il gestionale dopo un'analisi; si paga solo sul risparmio effettivo.
- Due link: Risparmia AI per le aziende (`https://risparmia-ai.com/aziende/`) e sito per privati e professionisti.

## Deciso
- Lo schema usa lo stesso motore degli schemi di Notoria, ma nei colori SimplyX (blu), perché Save è un servizio SimplyX.
- Nessuna percentuale e nessuna garanzia di risparmio nel testo (un test lo controlla).

## Da sapere
- risparmia-ai.com è collegato al dominio ma ancora nascosto ai motori di ricerca finché il proprietario non cambia il comando di build su Cloudflare.

## Test
12 pagine × 3 formati: 375 controlli superati, 0 falliti. Verifica a schermo su 1440 e 390.

## Aggiornamento: sezione in home
- Su richiesta del proprietario, la home ha ora una sezione «Risparmia AI» con lo stesso schema animato, tra Save e Notoria, su fondo chiaro con il pannello scuro. Porta a risparmia-ai.com/aziende e alla pagina Save.
- Test: 378 controlli superati, 0 falliti.
