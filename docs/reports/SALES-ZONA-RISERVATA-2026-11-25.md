# Simplyx Sales: zona riservata sul sito — 25/11/2026

**Richiesta del proprietario (25/11/2026, ore 09:06):** logo Simplyx con «Sales» accanto e pubblicazione sul sito Simplyx «in una zona nascosta con user e password» (utente e password indicati da lui in chat; qui non sono scritti).

**Fatto.**
- Pagina `/sales/`: testata con logo Simplyx e «Sales», richiesta di utente e password, poi la intranet di vendita versione 1 (Inizio, Metodo, Simplyx, Notoria AI, Risparmia AI, Regole; per ogni servizio: In breve, Chi cercare, Domande, Presentazione, Script, Obiezioni).
- Nascosta: nessun collegamento dalle pagine del sito, fuori da mappa e robots, `noindex, nofollow`.
- Protetta: sul sito arriva solo il file cifrato `src/sales/contenuti.enc.json` (AES-256-GCM, chiave PBKDF2-SHA256 da utente e password). `sales.js` non contiene testi né password; la pagina rispetta la stessa politica di sicurezza del resto del sito (nessuno script in linea).
- Nessuna modifica a nginx, Caddy o all'host: sono file statici in più.

**Deciso.**
- Il repository è pubblico: i testi in chiaro (`src/sales/contenuti.mjs`) restano fuori da git (`.gitignore`). La copia di riferimento dei testi è la pagina privata «Simplyx Sales» del proprietario.
- Per aggiornare i testi o cambiare password: `SALES_USER=… SALES_PASS=… node tools/sales-cifra.mjs`, poi build e pubblicazione.

**Limiti dichiarati al proprietario.**
- Una sola coppia utente/password per tutti: non è l'accesso personale per dipendente previsto per la intranet vera (Blocco 173 della Factory).
- La protezione vale quanto la password: con una password corta o facile da indovinare chi trova la pagina può entrare. Consigliata una password lunga.

**Rinviato.** Accesso personale, versione inglese, prezzi da una sola fonte, podcast, lead e provvigioni.

**Test.** 436 controlli superati con l'accesso vero provato (credenziali passate solo nell'ambiente), 417 senza credenziali; verifica a schermo a 390 e 1200 px.
