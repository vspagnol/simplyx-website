# Metodo in quattro fasi, grafico e animato — 23/11/2026

**Richiesta del proprietario:** rendere più grafica e animata la sezione Discover, Design, Build, Evolve.

**Fatto.** Ogni fase è una scheda bianca con un disegno animato (radar, bozza della soluzione, blocchi che si posano, curva che cresce). Sopra le schede una linea di avanzamento percorre le quattro fasi e accende i numeri in sequenza, ogni dieci secondi. Tra una scheda e la successiva una freccia di connessione si accende al passaggio, la scheda della fase in corso si solleva, e sotto una linea di ritorno porta da Evolve a Discover («Miglioramento continuo»). Vale per la home e per le pagine delle soluzioni, che usano lo stesso blocco. Ridisegnata anche l'icona «Ottimizzare» (quadrante completo).

**Deciso.** Solo CSS e SVG, nessuna libreria. Le animazioni si fermano fuori schermo e non partono per chi ha chiesto meno movimento (in quel caso i numeri restano accesi e i disegni fermi). Le schede hanno fondo pieno: il testo non si sovrappone più alla rete animata dello sfondo.

**Rinviato.** Nessuna voce.

**Test.** 384 controlli superati; verifica a schermo a 1280, 820 e 390 px.

## Aggiunta delle 13:55 — «Tre modi per iniziare»

**Richiesta del proprietario:** movimento e animazione anche nelle tre schede Ottimizzare, Orientarsi, Realizzare.

**Fatto.** Al posto dell'icona piccola ogni scheda ha un disegno animato: costi che scendono (barre e freccia), bussola che trova la direzione, livelli che si posano uno sull'altro. Stesse regole del metodo: solo CSS e SVG, fermi fuori schermo e con «meno movimento».

**Test.** 384 controlli superati, due volte di seguito; verifica a schermo a 1280 e 390 px.
