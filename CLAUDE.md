# CLAUDE.md — Sito Simplyx (simplyx.it)

Regole permanenti per lo sviluppo agentico di questo repository. Prevalgono sulle istruzioni di una singola conversazione, salvo modifica del proprietario (Vincenzo Spagnoletti).

1. **Tutto resta qui.** Sulla VM il sito vive solo in `/opt/simplyx-site` (container `simplyx-site`, rete `simplyx-site-net`, porta solo `127.0.0.1:8091`). Niente viene creato o modificato fuori da questo albero.
2. **Altri progetti off-limits:** demo, test2, saloni, advoca-ai, invest-ai, crm e ogni altro progetto sull'host. Integrazioni (CRM, help desk) solo via API documentate.
3. **Infrastruttura host:** nessuna modifica a Caddy/nginx, DNS, SSH, firewall o Docker senza autorizzazione esplicita del proprietario per ogni modifica. L'installazione segue `deploy/install.sh` e il proprietario approva il passo `--apply`.
4. **Segreti:** nessun segreto in git, log o output. Solo `.env.example` con segnaposto.
5. **Grafica first (OWN-ALL-DESIGN-FIRST):** ogni pagina parte da un campione visivo approvato dal proprietario. Riferimento homepage: `design/campione-homepage/` (artifact https://claude.ai/artifact/8BfPm2ZSH3oT8nJsJdQnz2, v4).
6. **Messaggio approvato (27/10/2026):** "Applicazioni innovative. Infrastrutture solide. Un solo partner." La Simplyx Factory progetta e realizza applicazioni; Simplyx costruisce e mantiene l'infrastruttura (energia, reti, server). L'AI è uno strumento, non il protagonista.
7. **Struttura e fasi:** `docs/brief-struttura-sito.md` (pubblici × pilastri, vetrina, agente di qualifica senza domanda di budget, area clienti legata al CRM, Stripe, SDI).
8. **Ogni fase si chiude con test e report** in `docs/reports/`.
9. Lingue: IT ed EN subito, struttura pronta per altre; multi paese e multi valuta.
