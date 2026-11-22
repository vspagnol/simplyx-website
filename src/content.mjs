// Testi del sito SimplyX (italiano). Si modifica qui, poi `npm run build`.
// Regole: niente numeri, clienti, certificazioni o testimonianze inventati. L'AI è uno strumento, non il protagonista.

export const SITE = {
  name: "SimplyX",
  legal: "SimplyX S.r.l.s.",
  vat: "10864421218",
  pec: "simplyxsrls@arubapec.it",
  email: "contatti@simplyx.it",
  phone: "+39 081 286 532 31",
  phoneHref: "+3908128653231",
  whatsapp: "+39 375 5454 980",
  whatsappHref: "393755454980",
  offices: [
    { city: "Napoli", street: "Via Domenico Cimarosa 89", zip: "80127", region: "NA" },
    { city: "Milano", street: "Viale Monza 1", zip: "20125", region: "MI" }
  ],
  tagline: "Dall'energia all'intelligenza. Un solo partner."
};

export const NAV = [
  { label: "Soluzioni", menu: true },
  { label: "Labs", path: "labs/" },
  { label: "Save", path: "save/" },
  { label: "Notoria", path: "notoria/" },
  { label: "Metodo", path: "", hash: "metodo" },
  { label: "Contatti", path: "contatti/" }
];

export const HOME = {
  metaTitle: "SimplyX — Dall'energia all'intelligenza. Un solo partner.",
  metaDesc: "SimplyX progetta, realizza e gestisce data center, reti, energia, software e intelligenza artificiale per aziende e professionisti. Un solo partner, a Napoli e Milano.",
  hero: {
    eyebrow: "Energia · Infrastrutture · Software · AI",
    title: ["Dall'energia", "all'intelligenza."],
    titleAccent: "Un solo partner.",
    sub: "Progettiamo, realizziamo e gestiamo la tecnologia della tua azienda: dall'impianto che la alimenta al software che la fa crescere.",
    cta1: "Parliamone", cta2: "Scopri le soluzioni",
    alt: "Città sul mare al crepuscolo con torri verdi, tetti fotovoltaici, pale eoliche sulle colline e un data center illuminato"
  },
  statement: {
    lead: "La tecnologia funziona quando ogni livello parla con l'altro.",
    body: "Energia, data center, reti, software e intelligenza artificiale di solito arrivano da fornitori diversi, che non si parlano. SimplyX li progetta insieme: una sola regia, un solo responsabile, un solo interlocutore."
  },
  solutions: {
    eyebrow: "Soluzioni",
    title: "Sei soluzioni. Un solo nome.",
    sub: "Ogni soluzione SimplyX lavora da sola o insieme alle altre. Scegli da dove partire: al resto pensiamo quando serve."
  },
  paths: {
    eyebrow: "Da dove vuoi partire?",
    title: "Tre modi per iniziare.",
    items: [
      { icon: "gauge", t: "Ottimizzare", d: "Spendi troppo in energia, connettività, licenze o cloud? Mappiamo i costi tecnologici e troviamo dove risparmiare, senza perdere qualità.", link: "Scopri SimplyX Save", path: "save/" },
      { icon: "compass", t: "Orientarsi", d: "Hai un'idea o un problema ma non sai quale strada prendere? Ti aiutiamo a capire cosa serve davvero, in parole semplici, prima di investire.", link: "Parla con noi", path: "contatti/" },
      { icon: "layers", t: "Realizzare", d: "Sai già cosa ti serve? Progettiamo e costruiamo impianti, infrastrutture, software e automazioni, e li seguiamo anche dopo la consegna.", link: "Vedi le soluzioni", path: "", hash: "soluzioni" }
    ]
  },
  labs: {
    eyebrow: "SimplyX Labs",
    title: "Non parliamo solo di innovazione. La creiamo.",
    sub: "Nei Labs costruiamo prodotti nostri, con lo stesso metodo che usiamo per i clienti. È qui che mettiamo alla prova quello che proponiamo.",
    link: "Entra nei Labs"
  },
  save: {
    eyebrow: "SimplyX Save",
    title: "La tecnologia deve creare valore. Non solo costi.",
    sub: "Un percorso in tre passi per riprendere il controllo della spesa tecnologica: energia, connettività, licenze, cloud e contratti.",
    link: "Come funziona Save",
    alt: "Due professionisti analizzano dei grafici su un tablet durante una riunione di lavoro"
  },
  notoria: {
    eyebrow: "SimplyX Notoria",
    title: "Da nome qualunque a nome noto.",
    sub: "Ti prepariamo il sito senza costi e ogni mese ti facciamo trovare: Google, scheda dell'attività, recensioni, social e campagne.",
    link: "Scopri Notoria"
  },
  method: {
    eyebrow: "Metodo",
    title: "Dall'idea al risultato. Senza frammentazione.",
    sub: "Quattro fasi, un solo gruppo di lavoro. Sai sempre a che punto siamo e chi risponde."
  },
  cta: {
    title: "La prossima evoluzione inizia da una conversazione.",
    sub: "Raccontaci dove sei e dove vuoi arrivare. Ti rispondiamo con idee concrete, non con un catalogo.",
    btn: "Scrivici", btn2: "Chiama",
    alt: "Cavi in fibra ottica ordinati su un pannello di rete"
  }
};

export const METHOD = [
  { n: "01", t: "Discover", d: "Ascoltiamo, misuriamo e guardiamo i dati: obiettivi, vincoli, costi e stato attuale. Niente proposte prima di aver capito." },
  { n: "02", t: "Design", d: "Disegniamo la soluzione con tempi, costi e responsabilità chiari. La vedi e la approvi prima che parta il lavoro." },
  { n: "03", t: "Build", d: "Realizziamo per fasi brevi, con consegne che puoi verificare. Impianti, infrastruttura e software avanzano insieme." },
  { n: "04", t: "Evolve", d: "Dopo la consegna restiamo: gestione, misure e miglioramenti continui, perché la tecnologia non si ferma al collaudo." }
];

export const SAVE = {
  metaTitle: "SimplyX Save — Riduci i costi tecnologici della tua azienda",
  metaDesc: "SimplyX Save mappa la spesa tecnologica (energia, connettività, licenze, cloud), trova le opportunità di risparmio e le tiene sotto controllo nel tempo.",
  eyebrow: "SimplyX Save",
  title: "La tecnologia deve creare valore. Non solo costi.",
  lead: "Bollette, connettività, licenze, cloud, contratti di assistenza: voci che crescono un po' ogni anno e che nessuno guarda più nell'insieme. Save le rimette in ordine.",
  alt: "Due professionisti analizzano dei grafici su un tablet durante una riunione di lavoro",
  steps: [
    { icon: "search", t: "Mappiamo la spesa", d: "Raccogliamo contratti, bollette e fatture e costruiamo un quadro unico: cosa paghi, a chi, per cosa e fino a quando." },
    { icon: "spark", t: "Troviamo le opportunità", d: "Confrontiamo consumi reali e condizioni contrattuali. Ti indichiamo cosa rinegoziare, cosa spegnere, cosa sostituire e cosa conviene lasciare com'è." },
    { icon: "chart", t: "Monitoriamo nel tempo", d: "Il risparmio va mantenuto. Teniamo sotto controllo scadenze, consumi e rinnovi, e ti avvisiamo prima che un costo riparta." }
  ],
  areas: {
    title: "Dove guardiamo",
    items: [
      { icon: "bolt", t: "Energia", d: "Profili di consumo, potenza impegnata, fasce orarie, autoproduzione." },
      { icon: "network", t: "Connettività e telefonia", d: "Linee dati, fonia, mobile, sedi e collegamenti tra sedi." },
      { icon: "doc", t: "Licenze software", d: "Abbonamenti inutilizzati, doppioni, piani sovradimensionati." },
      { icon: "cloud", t: "Cloud e hosting", d: "Risorse accese senza motivo, dimensionamento, alternative." },
      { icon: "wrench", t: "Assistenza e manutenzione", d: "Contratti sovrapposti, livelli di servizio non allineati ai bisogni." },
      { icon: "server", t: "Hardware e impianti", d: "Apparati a fine vita che consumano più di quanto rendono." }
    ]
  },
  principles: {
    title: "Come lavoriamo in Save",
    items: [
      { t: "Partiamo dai tuoi documenti", d: "Usiamo contratti, bollette e dati di consumo reali, non stime generiche." },
      { t: "Ogni proposta ha un perché", d: "Per ogni voce ti spieghiamo cosa cambierebbe, quanto impegno richiede e quali rischi comporta." },
      { t: "Decidi tu", d: "Nessun cambio di fornitore e nessuna disdetta senza la tua approvazione." }
    ]
  },
  faq: [
    { q: "Quanto tempo serve per la prima analisi?", a: "Dipende da quanti contratti e sedi ci sono e da quanto è facile recuperare i documenti. Dopo un primo incontro ti diciamo tempi e materiale necessario." },
    { q: "Dobbiamo cambiare fornitori per risparmiare?", a: "Non per forza. Spesso il risparmio arriva da una rinegoziazione, da un piano diverso con lo stesso fornitore o dallo spegnere ciò che non si usa." },
    { q: "Save riguarda solo l'energia?", a: "No. L'energia è una delle voci, insieme a connettività, licenze, cloud, assistenza e hardware. Il valore sta proprio nel guardarle insieme." },
    { q: "Che dati vi servono?", a: "Contratti, fatture e bollette degli ultimi mesi e, dove disponibili, i dati di consumo. Li trattiamo in modo riservato e solo per l'analisi." }
  ]
};

export const NOTORIA = {
  url: "https://notoria-ai.com",
  urlLabel: "notoria-ai.com",
  metaTitle: "SimplyX Notoria — Sito gratuito e marketing ogni mese",
  metaDesc: "SimplyX Notoria fa trovare la tua azienda: sito preparato senza costi e, ogni mese, Google, scheda dell'attività, recensioni, social e campagne.",
  eyebrow: "SimplyX Notoria",
  title: "Da nome qualunque a nome noto.",
  lead: "Notoria AI è il servizio SimplyX che fa trovare la tua azienda. Ti prepariamo il sito senza costi e ogni mese curiamo quello che serve per farti notare: Google, scheda dell'attività, recensioni, social e campagne.",
  canvasAlt: "Animazione: una rete di punti in movimento compone la parola notoria",
  band: {
    title: "Fatti notare.",
    sub: "Notorio vuol dire conosciuto da tutti. È quello che vogliamo per la tua azienda, nella tua zona o nel tuo mercato.",
    cta: "Vai al sito di Notoria AI"
  },
  steps: [
    { t: "Ti prepariamo il sito", d: "Partiamo da quello che di te si trova già in rete: nome, indirizzo, orari, servizi. Ti mandiamo un'anteprima vera, già con il tuo nome sopra." },
    { t: "Lo guardi e lo approvi", d: "Ci dici cosa cambiare. Finché non ti convince, non firmi e non paghi nulla." },
    { t: "Ti facciamo trovare", d: "Il sito va online e comincia il lavoro di ogni mese, con un resoconto chiaro di quello che abbiamo fatto." }
  ],
  services: {
    title: "Cosa facciamo ogni mese",
    sub: "Scegli solo quello che ti serve. Il resto lo puoi aggiungere quando vuoi.",
    items: [
      { icon: "search", t: "Sito e Google", d: "Un sito veloce e curato, scritto perché chi ti cerca capisca subito cosa fai e come contattarti." },
      { icon: "pin", t: "Scheda Google e recensioni", d: "Orari, foto e servizi sempre aggiornati. Ti aiutiamo a chiedere le recensioni e a rispondere." },
      { icon: "chat", t: "Post sui social", d: "Un piano di post ogni mese per LinkedIn, Instagram, Facebook e YouTube. Li approvi tu prima che escano." },
      { icon: "spark", t: "Campagne mirate", d: "Annunci su Google e sui social per la tua zona o il tuo settore, con un tetto di spesa deciso da te." },
      { icon: "mail", t: "Email e WhatsApp", d: "Messaggi ai tuoi clienti per novità, promemoria e offerte, solo a chi ha dato il consenso." },
      { icon: "chart", t: "Resoconto mensile", d: "Ogni mese sai cosa abbiamo fatto, quante persone ti hanno trovato e quante ti hanno contattato." }
    ]
  },
  who: {
    title: "Per chi è",
    items: [
      { t: "Attività e negozi", d: "Ristoranti, saloni, negozi, strutture ricettive: chi vive di clienti della zona e vuole essere trovato da chi passa di lì." },
      { t: "Professionisti e studi", d: "Chi lavora sulla fiducia e ha bisogno di una presenza seria, aggiornata e facile da trovare." },
      { t: "PMI e grandi aziende", d: "Chi ha già un sito, magari vecchio o lento, e vuole rifarlo e farlo lavorare senza un reparto interno." }
    ]
  },
  faq: [
    { q: "Il sito è davvero gratuito?", a: "Sì. Ti prepariamo il sito senza costi e lo vedi prima di decidere. Paghi un canone mensile solo se scegli di andare online con noi: il canone copre il lavoro di ogni mese." },
    { q: "Devo firmare qualcosa per vedere l'anteprima?", a: "No. Guardi l'anteprima, ci dici cosa cambiare e decidi con calma. Finché non ti convince, non firmi e non paghi nulla." },
    { q: "Garantite la prima posizione su Google?", a: "No, e nessuno può farlo seriamente. Ti promettiamo un lavoro fatto bene e un resoconto chiaro ogni mese, con i numeri veri." },
    { q: "Che rapporto c'è tra Notoria AI e SimplyX?", a: "Notoria AI è un servizio di SimplyX, con un sito e un marchio propri. Le persone, il metodo e i contatti sono gli stessi." }
  ]
};

export const LABS = {
  metaTitle: "SimplyX Labs — I prodotti che costruiamo",
  metaDesc: "Nei SimplyX Labs nascono prodotti digitali nostri: Bellaria AI, Advoca AI, InvestAI, Curaria AI e Casa di Melo. È qui che mettiamo alla prova il nostro metodo.",
  eyebrow: "SimplyX Labs",
  title: "Non parliamo solo di innovazione. La creiamo.",
  lead: "I Labs sono il nostro laboratorio di prodotto: idee che diventano software reale, con design curato e tecnologia solida. Quello che impariamo qui lo portiamo nei progetti dei clienti.",
  note: "I prodotti indicati come «in sviluppo» o «concept» non sono ancora disponibili al pubblico.",
  items: [
    { slug: "bellaria", img: "bellaria-mock", name: "Bellaria AI", kind: "Gestionale e app", status: "In sviluppo", d: "Agenda, prenotazioni e relazione con i clienti per saloni, barbieri e centri estetici: un gestionale per chi lavora e un'app per chi prenota.", alt: "Schermate di Bellaria AI su computer e telefono" },
    { slug: "advoca", img: "advoca", name: "Advoca AI", kind: "Software per studi legali", status: "In sviluppo", d: "Pratiche, scadenze e documenti in un solo posto, con un assistente che prepara bozze. A decidere è sempre l'avvocato.", alt: "Ingresso di uno studio legale con il marchio Advoca AI su una parete in vetro" },
    { slug: "invest", img: "invest", name: "InvestAI", kind: "Laboratorio dati", status: "In sviluppo", d: "Un progetto di ricerca su analisi dei dati di mercato e strumenti di supporto alle decisioni. Non è un servizio di consulenza finanziaria.", alt: "Marchio InvestAI: un diamante verde su fondo scuro" },
    { slug: "curaria", img: "curaria", name: "Curaria AI", kind: "Concept per farmacie", status: "Concept", d: "Un'idea in fase di studio: semplificare il lavoro quotidiano della farmacia e il rapporto con chi entra dalla porta.", alt: "Farmacista al banco che serve una cliente in una farmacia luminosa" },
    { slug: "melo", img: "melo", name: "Casa di Melo", kind: "Sito e guida digitale", status: "Realizzato", d: "Sito e guida per gli ospiti di una casa vacanze a Napoli: meteo, mappa dei consigli e tutte le informazioni utili, in più lingue.", alt: "Due telefoni con il sito di Casa di Melo: la vista sul golfo di Napoli e la pagina del meteo" }
  ],
  how: {
    title: "Perché abbiamo un laboratorio",
    items: [
      { icon: "spark", t: "Proviamo su di noi", d: "Metodi, strumenti e scelte tecniche passano prima dai nostri prodotti, poi dai tuoi." },
      { icon: "eye", t: "Design prima di tutto", d: "Ogni prodotto parte da come si usa e da come appare. La tecnologia viene dopo, e lavora per questo." },
      { icon: "layers", t: "Basi riutilizzabili", d: "Quello che costruiamo una volta bene diventa una base per il progetto successivo: meno tempo, meno rischi." }
    ]
  }
};

export const CONTACT = {
  metaTitle: "Contatti — Parla con SimplyX, a Napoli e Milano",
  metaDesc: "Parla con SimplyX: email, telefono, WhatsApp e sedi di Napoli e Milano. Raccontaci il tuo progetto, ti rispondiamo con idee concrete.",
  eyebrow: "Contatti",
  title: "Parliamone.",
  lead: "Raccontaci in due righe cosa ti serve. Ti rispondiamo con idee concrete e con i prossimi passi.",
  topics: [
    ["save", "Risparmiare sulla spesa"],
    ["notoria", "Sito e marketing (Notoria)"],
    ["energy", "Energia e impianti"],
    ["data-center", "Rete o data center"],
    ["software", "Software o app"],
    ["intelligenza-artificiale", "AI e automazione"],
    ["business-automation", "Automazione dei processi"],
    ["managed-services", "Servizi gestiti"],
    ["cybersecurity", "Cybersecurity"],
    ["altro", "Altro"]
  ],
  formNote: "Il modulo non invia nulla in automatico: prepara un'email nella tua app di posta, che puoi rileggere e inviare tu.",
  privacyNote: "I dati che ci scrivi servono solo a risponderti."
};

export const PRIVACY = {
  metaTitle: "Privacy e cookie — SimplyX",
  metaDesc: "Informativa sul trattamento dei dati personali e sull'uso dei cookie del sito SimplyX.",
  title: "Privacy e cookie",
  draft: "Bozza in attesa di revisione legale. Prima della pubblicazione su simplyx.it il testo va completato e approvato.",
  sections: [
    { h: "Chi tratta i dati", p: ["Il titolare del trattamento è SimplyX S.r.l.s., P. IVA 10864421218, con sedi in Via Domenico Cimarosa 89, 80127 Napoli e Viale Monza 1, 20125 Milano. Email: contatti@simplyx.it — PEC: simplyxsrls@arubapec.it."] },
    { h: "Quali dati raccogliamo", p: ["Il sito non richiede registrazione. Se ci scrivi per email, telefono o WhatsApp, trattiamo i dati che ci comunichi (ad esempio nome, azienda, recapiti e contenuto del messaggio) solo per risponderti.", "Il modulo di contatto non invia dati ai nostri sistemi: prepara un'email nella tua app di posta, che scegli tu se inviare."] },
    { h: "Cookie", p: ["Il sito non usa cookie di profilazione né strumenti di tracciamento di terze parti. Font, immagini e script sono serviti direttamente dal nostro dominio."] },
    { h: "Per quanto tempo", p: ["Conserviamo le richieste ricevute per il tempo necessario a gestirle e per gli eventuali obblighi di legge. [Da completare con i tempi di conservazione.]"] },
    { h: "I tuoi diritti", p: ["Puoi chiederci in ogni momento accesso, rettifica, cancellazione, limitazione od opposizione al trattamento scrivendo a contatti@simplyx.it. Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali."] }
  ]
};

export const SOLUTIONS = [
  {
    slug: "data-center", brand: "SimplyX Data Center", kicker: "Infrastrutture", focus: "", name: "Data Center", short: "Sale server, edge e reti progettate per durare.",
    img: "datacenter", img2: "network",
    alt: "Corridoio di un data center con armadi rack illuminati di blu e l'insegna SimplyX sulla parete di fondo",
    alt2: "Cavi in fibra ottica ordinati su un pannello di rete",
    img3: "energy-room", alt3: "Locale tecnico luminoso con armadi di accumulo e quadri elettrici allineati",
    metaTitle: "Data Center — Progettazione, realizzazione e gestione | SimplyX",
    metaDesc: "SimplyX progetta, realizza e gestisce sale server, data center ed edge: alimentazione, raffreddamento, cablaggio, reti e monitoraggio. Un solo responsabile.",
    title: "Data center progettati per durare.",
    lead: "Dalla sala server aziendale al sito edge: progettiamo, realizziamo e gestiamo l'infrastruttura fisica su cui gira il tuo lavoro. Alimentazione, raffreddamento, reti e monitoraggio, pensati insieme.",
    intro: { h: "L'infrastruttura non si vede. Finché non si ferma.", p: ["Un data center è un equilibrio tra energia, raffreddamento, spazio e connettività. Se uno di questi elementi è dimensionato male, gli altri ne pagano il prezzo: in consumi, in affidabilità o in costi di adeguamento.", "Per questo lavoriamo sull'insieme. Chi progetta l'impianto elettrico parla con chi disegna la rete e con chi gestirà i sistemi: lo stesso gruppo, dall'inizio alla fine."] },
    caps: [
      { icon: "compass", t: "Progettazione e dimensionamento", d: "Analisi dei carichi attuali e futuri, layout della sala, scelta dell'architettura più adatta: sala interna, colocation o soluzione mista." },
      { icon: "bolt", t: "Alimentazione e continuità", d: "Distribuzione elettrica, UPS, gruppi elettrogeni e ridondanze, proporzionati a quanto può costarti un fermo." },
      { icon: "wind", t: "Raffreddamento ed efficienza", d: "Sistemi di raffreddamento e gestione dei flussi d'aria per tenere stabili le temperature e bassi i consumi." },
      { icon: "network", t: "Cablaggio e reti", d: "Cablaggio strutturato in rame e fibra, apparati di rete, segmentazione e collegamenti tra sedi." },
      { icon: "cube", t: "Edge e sale tecniche", d: "Piccoli siti vicini a dove nascono i dati: stabilimenti, punti vendita, sedi periferiche. Compatti, sicuri, gestibili da remoto." },
      { icon: "eye", t: "Monitoraggio e gestione", d: "Sensori, allarmi e cruscotti per sapere in ogni momento come stanno energia, temperatura e apparati." }
    ],
    deep: [
      { k: "Approccio", h: "Si parte dai carichi, non dai cataloghi.", p: ["Prima di parlare di prodotti misuriamo: quanta potenza serve oggi, quanta ne servirà, quali servizi non possono fermarsi e per quanto tempo. Da qui nasce un progetto proporzionato, che non ti fa pagare ridondanze inutili e non ti lascia scoperto dove conta."], bullets: ["Rilievo dell'esistente e dei consumi reali", "Scenari di crescita e relativi costi", "Progetto con tempi, fasi e responsabilità"] },
      { k: "Ammodernamento", h: "Rinnovare senza fermare il lavoro.", p: ["Molte sale server sono cresciute per aggiunte successive. Le riportiamo in ordine per fasi, pianificando gli interventi in modo da ridurre al minimo i fermi: cablaggio, alimentazione, raffreddamento e apparati, un passo alla volta."], bullets: ["Piano di migrazione concordato", "Interventi nelle finestre che scegli tu", "Documentazione aggiornata a fine lavori"] }
    ],
    faq: [
      { q: "Lavorate solo su grandi data center?", a: "No. Seguiamo anche sale server aziendali, armadi di rete e piccoli siti edge. Il metodo è lo stesso: cambia la scala." },
      { q: "È possibile ammodernare una sala esistente senza spegnerla?", a: "In molti casi sì, lavorando per fasi e pianificando gli interventi critici nelle finestre concordate. Lo valutiamo insieme dopo un sopralluogo." },
      { q: "Meglio una sala interna o la colocation?", a: "Dipende da carichi, competenze interne, connettività e costi dell'energia. Confrontiamo le alternative con numeri tuoi, senza una risposta preconfezionata." },
      { q: "Vi occupate anche della gestione dopo la consegna?", a: "Sì. Con i Managed Services possiamo seguire monitoraggio, manutenzione e aggiornamenti, con livelli di servizio definiti nel contratto." }
    ],
    related: ["energy", "managed-services", "cybersecurity"]
  },
  {
    slug: "intelligenza-artificiale", brand: "SimplyX AI", kicker: "Intelligenza Artificiale", focus: "", name: "Intelligenza Artificiale", short: "AI applicata al lavoro vero, con le persone al comando.",
    img: "ai", img2: "team",
    alt: "Primo piano di un processore con la scritta AI incisa, su una scheda elettronica scura",
    alt2: "Due professionisti analizzano dei grafici su un tablet durante una riunione di lavoro",
    img3: "automation", alt3: "Una professionista al lavoro davanti a un monitor con un flusso di automazione SimplyX",
    metaTitle: "Intelligenza Artificiale per le aziende | SimplyX",
    metaDesc: "SimplyX porta l'intelligenza artificiale nei processi aziendali: assistenti, analisi di documenti, ricerca sulla conoscenza interna e previsioni. Con privacy e controllo umano.",
    title: "Intelligenza artificiale, applicata al lavoro vero.",
    lead: "L'AI è uno strumento, non un fine. La portiamo dove toglie lavoro ripetitivo e aiuta a decidere meglio, integrandola nei sistemi che usi già e lasciando alle persone l'ultima parola.",
    intro: { h: "Meno dimostrazioni, più risultati.", p: ["Quasi tutte le aziende hanno provato un assistente AI. Poche lo hanno portato dentro i processi, dove serve: nei documenti da leggere, nelle richieste a cui rispondere, nei dati da interpretare.", "Noi partiamo da un problema concreto e misurabile, costruiamo una soluzione piccola che funziona e la facciamo crescere solo se porta valore."] },
    caps: [
      { icon: "chat", t: "Assistenti e agenti", d: "Assistenti che rispondono a clienti e colleghi, raccolgono richieste e svolgono compiti definiti, con regole chiare su cosa possono fare." },
      { icon: "doc", t: "Analisi di documenti", d: "Lettura, classificazione ed estrazione di dati da contratti, fatture, pratiche e moduli, con verifica umana dove serve." },
      { icon: "search", t: "Ricerca sulla conoscenza aziendale", d: "Risposte basate sui tuoi documenti e sulle tue procedure, con l'indicazione della fonte da cui arrivano." },
      { icon: "chart", t: "Previsioni e analisi", d: "Modelli che aiutano a prevedere domanda, consumi o anomalie a partire dai dati che hai già." },
      { icon: "plug", t: "Integrazione nei tuoi sistemi", d: "L'AI lavora dentro gestionale, CRM, posta e WhatsApp: non un altro strumento da aprire, ma una funzione in più." },
      { icon: "shield", t: "Regole, privacy e controllo", d: "Accessi, registri delle attività e limiti d'uso definiti fin dall'inizio, in linea con GDPR e regolamento europeo sull'AI." }
    ],
    deep: [
      { k: "Approccio", h: "Prima il problema, poi il modello.", p: ["Scegliamo insieme un caso d'uso circoscritto, definiamo come misurarne il risultato e costruiamo un primo prototipo sui tuoi dati. Se funziona lo portiamo in produzione; se non funziona lo sai presto, e con una spesa contenuta."], bullets: ["Caso d'uso e misura del risultato definiti prima", "Prototipo verificabile sui tuoi dati", "Messa in produzione con monitoraggio di qualità e costi"] },
      { k: "Responsabilità", h: "Dati al sicuro, persone al comando.", p: ["Decidiamo con te quali dati può vedere l'AI e quali no, e dove vengono elaborati. Nelle attività delicate l'AI propone e una persona conferma: bozze, suggerimenti e sintesi, mai decisioni prese da sola."], bullets: ["Servizi configurati perché i tuoi dati non vengano usati per addestrare modelli di terzi", "Conferma umana sui passaggi critici", "Tracciabilità di chi ha fatto cosa"] }
    ],
    faq: [
      { q: "Da dove conviene cominciare?", a: "Da un'attività ripetitiva, frequente e facile da misurare: ad esempio lo smistamento delle richieste o la lettura di documenti ricorrenti. Un primo risultato concreto vale più di un grande piano." },
      { q: "I nostri dati vengono usati per addestrare modelli?", a: "Configuriamo i servizi in modo che questo non avvenga e lo verifichiamo nei contratti dei fornitori. Dove serve, valutiamo modelli ospitati su infrastruttura dedicata." },
      { q: "Dobbiamo avere già i dati in ordine?", a: "Aiuta, ma non è indispensabile. Parte del lavoro iniziale è capire quali dati ci sono, in che stato sono e cosa serve sistemare." },
      { q: "L'AI sostituirà le persone del nostro gruppo?", a: "L'obiettivo dei nostri progetti è togliere lavoro ripetitivo e lasciare alle persone le attività in cui servono giudizio, relazione ed esperienza." }
    ],
    related: ["business-automation", "data-center", "cybersecurity"]
  },
  {
    slug: "business-automation", brand: "SimplyX Automation", kicker: "Automazione dei processi", focus: "low", name: "Business Automation", short: "Processi più semplici, meno lavoro manuale.",
    img: "automation", img2: "team",
    alt: "Una professionista al lavoro davanti a un monitor con un flusso di automazione SimplyX",
    alt2: "Due professionisti analizzano dei grafici su un tablet durante una riunione di lavoro",
    metaTitle: "Business Automation — Automazione dei processi aziendali | SimplyX",
    metaDesc: "SimplyX automatizza i processi aziendali: flussi di ordini, documenti e approvazioni, integrazione tra gestionale, CRM, e-commerce e WhatsApp, portali e app su misura.",
    title: "Meno lavoro manuale. Più tempo per ciò che conta.",
    lead: "Copia e incolla tra programmi, fogli di calcolo che girano per email, approvazioni che si perdono. Colleghiamo i tuoi sistemi e automatizziamo i passaggi ripetitivi, senza stravolgere il modo in cui lavori.",
    intro: { h: "L'automazione migliore è quella che non si nota.", p: ["Ogni azienda ha attività che si ripetono uguali centinaia di volte: inserire un ordine, inviare un sollecito, archiviare un documento, aggiornare un cliente. Sono le prime candidate all'automazione.", "Non serve cambiare tutto. Spesso basta far parlare tra loro gli strumenti che già hai e aggiungere il pezzo che manca."] },
    caps: [
      { icon: "search", t: "Mappatura dei processi", d: "Osserviamo come si lavora davvero, passaggio per passaggio, e individuiamo dove si perde tempo e dove nascono gli errori." },
      { icon: "flow", t: "Automazione dei flussi", d: "Ordini, preventivi, solleciti, pratiche: i passaggi ripetitivi partono da soli, con controlli e avvisi quando serve una persona." },
      { icon: "plug", t: "Integrazione tra sistemi", d: "Gestionale, CRM, e-commerce, posta, WhatsApp e fogli di calcolo collegati, così il dato si inserisce una volta sola." },
      { icon: "doc", t: "Documenti e approvazioni", d: "Generazione, firma, archiviazione e approvazione dei documenti con percorsi chiari e tracciati." },
      { icon: "phone", t: "Portali e app su misura", d: "Quando lo strumento giusto non esiste lo costruiamo: portali per clienti e fornitori, app per chi lavora sul campo." },
      { icon: "chart", t: "Cruscotti e misure", d: "Indicatori semplici per vedere tempi, volumi e colli di bottiglia, e capire se l'automazione sta rendendo." }
    ],
    deep: [
      { k: "Approccio", h: "Un processo alla volta, con risultati che si vedono.", p: ["Partiamo dal processo che pesa di più, lo semplifichiamo prima di automatizzarlo e lo mettiamo in uso in poche settimane. Poi misuriamo e passiamo al successivo. Così il progetto si ripaga strada facendo."], bullets: ["Priorità in base a tempo perso ed errori", "Prima semplificare, poi automatizzare", "Rilasci brevi, verificabili da chi li usa"] },
      { k: "Persone", h: "Costruito con chi lo userà.", p: ["Un'automazione funziona se chi lavora la sente utile. Coinvolgiamo le persone fin dall'analisi, formiamo il gruppo e lasciamo sempre una via manuale per i casi fuori standard."], bullets: ["Formazione semplice e pratica", "Gestione delle eccezioni prevista dall'inizio", "Documentazione chiara di ogni flusso"] }
    ],
    faq: [
      { q: "Dobbiamo cambiare il gestionale?", a: "Di solito no. Lavoriamo con gli strumenti che hai, collegandoli tra loro. Se un sistema è davvero un limite te lo diciamo, con alternative e costi." },
      { q: "Quali processi conviene automatizzare per primi?", a: "Quelli frequenti, ripetitivi e con regole chiare: inserimento ordini, solleciti, onboarding di clienti e fornitori, reportistica periodica." },
      { q: "Cosa succede quando un caso non rientra nelle regole?", a: "L'automazione si ferma e avvisa una persona. Le eccezioni sono previste nel progetto, non lasciate al caso." },
      { q: "Usate anche l'intelligenza artificiale?", a: "Quando serve: ad esempio per leggere documenti non strutturati o smistare richieste scritte in linguaggio naturale. Dove bastano regole semplici, usiamo regole semplici." }
    ],
    related: ["intelligenza-artificiale", "managed-services", "cybersecurity"]
  },
  {
    slug: "managed-services", brand: "SimplyX Managed", kicker: "Servizi gestiti", focus: "low", name: "Managed Services", short: "Sistemi, reti e cloud gestiti ogni giorno.",
    img: "managed", img2: "datacenter",
    alt: "Un tecnico di spalle osserva tre monitor con i cruscotti di controllo SimplyX",
    alt2: "Corridoio di un data center con armadi rack illuminati di blu e l'insegna SimplyX sulla parete di fondo",
    img3: "network", alt3: "Cavi in fibra ottica ordinati su un pannello di rete",
    metaTitle: "Managed Services — Gestione IT, reti e cloud | SimplyX",
    metaDesc: "SimplyX gestisce ogni giorno sistemi, reti, cloud e postazioni: monitoraggio, assistenza, aggiornamenti, backup e rapporti con i fornitori, con livelli di servizio chiari.",
    title: "La tua tecnologia, sempre sotto controllo.",
    lead: "Ci prendiamo cura ogni giorno di sistemi, reti, cloud e postazioni di lavoro. Tu hai un solo numero da chiamare e un quadro chiaro di come stanno le cose.",
    intro: { h: "Gestire bene costa meno che riparare.", p: ["La maggior parte dei problemi IT dà segnali prima di diventare un fermo: un disco che si riempie, un aggiornamento saltato, un backup che non si completa. Vederli in tempo fa la differenza.", "Con i servizi gestiti l'IT smette di essere un'emergenza ricorrente e diventa un servizio con regole, tempi e responsabilità definite."] },
    caps: [
      { icon: "eye", t: "Monitoraggio di sistemi e reti", d: "Controllo dello stato di server, apparati, collegamenti e servizi, con avvisi quando qualcosa esce dai valori attesi." },
      { icon: "chat", t: "Assistenza agli utenti", d: "Un punto di contatto unico per le richieste di chi lavora: problemi, accessi, nuove postazioni." },
      { icon: "refresh", t: "Aggiornamenti e manutenzione", d: "Patch di sicurezza, aggiornamenti e manutenzione pianificati, per non rincorrere i problemi." },
      { icon: "archive", t: "Backup e ripristino", d: "Copie verificate dei dati e prove di ripristino periodiche: un backup vale solo se si riesce a recuperare." },
      { icon: "cloud", t: "Cloud e server", d: "Gestione di ambienti cloud, server e servizi di posta e collaborazione, con attenzione a costi e dimensionamento." },
      { icon: "users", t: "Fornitori e licenze", d: "Seguiamo noi i rapporti con operatori, produttori e rivenditori, e teniamo in ordine scadenze e licenze." }
    ],
    deep: [
      { k: "Servizio", h: "Regole chiare, scritte prima.", p: ["Cosa è incluso, in quali orari, con quali tempi di risposta e chi fa cosa: lo definiamo nel contratto, su misura per te. Niente sorprese in fattura e niente zone grigie quando serve intervenire."], bullets: ["Perimetro e livelli di servizio concordati", "Un referente che conosce la tua azienda", "Resoconti periodici comprensibili"] },
      { k: "Evoluzione", h: "Non solo tenere acceso: migliorare.", p: ["Chi gestisce ogni giorno i tuoi sistemi vede cosa conviene cambiare. Ti proponiamo con regolarità interventi per ridurre rischi e costi, in ordine di priorità, e li decidiamo insieme."], bullets: ["Inventario aggiornato di apparati e servizi", "Piano di rinnovo per ciò che è a fine vita", "Proposte motivate, con costi e benefici"] }
    ],
    faq: [
      { q: "Abbiamo già una persona IT interna: ha senso?", a: "Sì. Possiamo affiancarla occupandoci di monitoraggio, attività ricorrenti e competenze specialistiche, lasciandole più tempo per i progetti." },
      { q: "In quali orari siete disponibili?", a: "Orari e tempi di intervento si definiscono nel contratto, in base a quanto è critico ogni servizio per la tua attività." },
      { q: "Gestite anche sistemi che non avete installato voi?", a: "Sì. Partiamo da una fase di presa in carico in cui documentiamo l'esistente e segnaliamo eventuali rischi da sistemare." },
      { q: "Come si calcola il costo?", a: "In base al perimetro: numero di postazioni, server, sedi e livello di servizio richiesto. Dopo un primo incontro ricevi una proposta chiara, con cosa è incluso e cosa no." }
    ],
    related: ["cybersecurity", "data-center", "business-automation"]
  },
  {
    slug: "cybersecurity", brand: "SimplyX Secure", kicker: "Cybersecurity", focus: "pos-r low", name: "Cybersecurity", short: "Protezione concreta, che non rallenta il lavoro.",
    img: "cybersecurity", img2: "managed",
    alt: "Una mano inserisce una chiave di sicurezza in un portatile che mostra il marchio SimplyX e uno scudo",
    alt2: "Un tecnico di spalle osserva tre monitor con i cruscotti di controllo SimplyX",
    img3: "network", alt3: "Cavi in fibra ottica ordinati su un pannello di rete",
    metaTitle: "Cybersecurity per aziende e studi professionali | SimplyX",
    metaDesc: "SimplyX protegge aziende e studi professionali: valutazione del rischio, accessi e identità, reti e dispositivi, backup e continuità, formazione delle persone, supporto su NIS2 e GDPR.",
    title: "Sicurezza che non rallenta il lavoro.",
    lead: "Proteggere un'azienda non significa comprare più prodotti. Significa sapere cosa conta davvero, chiudere le porte più esposte ed essere pronti a ripartire se qualcosa va storto.",
    intro: { h: "La sicurezza è un'abitudine, non un acquisto.", p: ["La maggior parte degli incidenti parte da cose semplici: una password riutilizzata, un'email convincente, un aggiornamento rimandato, un backup mai provato.", "Per questo lavoriamo prima sulle basi, con misure proporzionate alla tua realtà, e poi sui livelli successivi. Con un linguaggio che capisce anche chi non è un tecnico."] },
    caps: [
      { icon: "search", t: "Valutazione del rischio", d: "Una fotografia di cosa è esposto, cosa è critico e cosa accadrebbe in caso di fermo, con priorità chiare." },
      { icon: "key", t: "Identità e accessi", d: "Autenticazione a più fattori, chiavi di sicurezza, gestione delle password e dei permessi: chi può entrare, e dove." },
      { icon: "shield", t: "Reti e dispositivi", d: "Protezione di computer, telefoni, server e rete, con segmentazione e controllo di ciò che entra ed esce." },
      { icon: "archive", t: "Backup e continuità", d: "Copie isolate e piani di ripristino provati, per tornare operativi in tempi noti anche dopo un attacco." },
      { icon: "users", t: "Formazione delle persone", d: "Sessioni brevi e pratiche per riconoscere email e richieste sospette. Le persone sono la prima difesa." },
      { icon: "doc", t: "Supporto alla conformità", d: "Ti aiutiamo a orientarti tra NIS2 e GDPR e a tradurre gli obblighi in misure tecniche e organizzative." }
    ],
    deep: [
      { k: "Approccio", h: "Prima le basi. Fatte bene.", p: ["Accessi protetti, aggiornamenti regolari, backup verificati, persone informate: sono misure poco spettacolari e molto efficaci. Le mettiamo in ordine, poi valutiamo insieme cosa aggiungere in base al rischio reale."], bullets: ["Priorità in base a impatto e probabilità", "Misure proporzionate a dimensione e settore", "Un piano a tappe, con costi chiari"] },
      { k: "Continuità", h: "Pronti anche per il giorno peggiore.", p: ["Nessuna difesa è perfetta. Prepariamo con te cosa fare in caso di incidente: chi chiamare, cosa isolare, da dove ripartire. Un piano scritto e provato riduce i tempi di fermo e gli errori fatti sotto pressione."], bullets: ["Procedura di risposta agli incidenti", "Prove di ripristino periodiche", "Ruoli e contatti definiti in anticipo"] }
    ],
    faq: [
      { q: "Siamo una piccola azienda: siamo davvero un bersaglio?", a: "Molti attacchi sono automatici e non scelgono per dimensione. Le realtà piccole sono spesso più esposte proprio perché meno protette. Le misure di base sono alla portata di tutti." },
      { q: "Da dove si comincia?", a: "Da una valutazione semplice: cosa hai, cosa è esposto, cosa succederebbe se si fermasse. Da lì nasce un elenco di priorità, non un elenco di prodotti." },
      { q: "La NIS2 ci riguarda?", a: "Dipende da settore, dimensione e ruolo nella filiera dei tuoi clienti. Ti aiutiamo a capirlo e, se serve, a impostare le misure richieste. Per gli aspetti legali lavoriamo insieme ai tuoi consulenti." },
      { q: "Il backup basta contro un ransomware?", a: "È indispensabile ma non sufficiente: deve essere isolato, verificato e accompagnato da un piano di ripristino. E conviene comunque ridurre le possibilità che l'attacco riesca." }
    ],
    related: ["managed-services", "data-center", "intelligenza-artificiale"]
  },
  {
    slug: "energy", brand: "SimplyX Energy", kicker: "Energia", focus: "pos-r", name: "Energy", short: "Produrre, accumulare e consumare meglio.",
    img: "energy", img2: "energy-room",
    alt: "Pannelli fotovoltaici su un tetto al tramonto, con un armadio di accumulo SimplyX in primo piano",
    alt2: "Locale tecnico luminoso con armadi di accumulo e quadri elettrici allineati",
    img3: "hero", alt3: "Città sostenibile sul mare al crepuscolo, con tetti fotovoltaici e un data center illuminato",
    metaTitle: "Energy — Fotovoltaico, accumulo, continuità ed efficienza | SimplyX",
    metaDesc: "SimplyX aiuta le aziende a consumare meglio: analisi dei consumi, fotovoltaico, accumulo, continuità elettrica, monitoraggio ed efficienza degli impianti.",
    title: "L'energia come vantaggio, non solo come costo.",
    lead: "Ogni tecnologia parte da una presa di corrente. Ti aiutiamo a capire come consumi, a produrre e accumulare dove conviene e a non fermarti quando la rete manca.",
    intro: { h: "Si risparmia davvero solo su ciò che si misura.", p: ["Molte aziende conoscono l'importo della bolletta ma non sanno dove e quando consumano. Senza questa informazione ogni investimento, dal fotovoltaico all'accumulo, è una scommessa.", "Partiamo dai dati di consumo, li leggiamo insieme e costruiamo un percorso: prima ciò che costa poco e rende subito, poi gli interventi più importanti."] },
    caps: [
      { icon: "chart", t: "Analisi dei consumi", d: "Lettura dei profili di carico per capire dove, quando e perché consumi, e quali sprechi si possono eliminare." },
      { icon: "sun", t: "Fotovoltaico", d: "Valutazione e progettazione di impianti dimensionati sui tuoi consumi reali, non sulla superficie disponibile." },
      { icon: "battery", t: "Accumulo", d: "Sistemi di accumulo per usare di più l'energia che produci e ridurre i picchi di prelievo dalla rete." },
      { icon: "bolt", t: "Continuità elettrica", d: "UPS e sistemi di emergenza per i carichi che non possono fermarsi: sistemi informatici, linee, impianti critici." },
      { icon: "eye", t: "Monitoraggio energetico", d: "Misure in tempo reale e cruscotti semplici, per vedere consumi e produzione e accorgersi subito delle anomalie." },
      { icon: "gauge", t: "Efficienza degli impianti", d: "Interventi su illuminazione, climatizzazione e apparati che consumano più di quanto dovrebbero." }
    ],
    deep: [
      { k: "Approccio", h: "Prima i dati, poi gli impianti.", p: ["Un impianto dimensionato male produce energia che non usi o non copre i momenti in cui ti serve. Per questo partiamo dalle curve di consumo e confrontiamo più scenari, con costi e tempi di rientro spiegati in modo trasparente."], bullets: ["Analisi dei consumi su dati reali", "Scenari a confronto, con ipotesi dichiarate", "Progetto e realizzazione seguiti da un solo responsabile"] },
      { k: "Insieme al digitale", h: "Energia e tecnologia, progettate insieme.", p: ["Data center, sale server e impianti produttivi sono i punti in cui energia e digitale si incontrano. Chi li progetta separatamente paga due volte. Noi li guardiamo come un unico sistema, dal contatore al software che lo controlla."], bullets: ["Continuità pensata per i carichi informatici", "Monitoraggio integrato con i sistemi aziendali", "Collegamento diretto con SimplyX Save"] }
    ],
    faq: [
      { q: "Conviene il fotovoltaico per la nostra azienda?", a: "Dipende da quanto e quando consumi, dallo spazio disponibile e dalle condizioni del tuo contratto. Te lo diciamo dopo aver guardato i tuoi dati, con ipotesi chiare." },
      { q: "L'accumulo serve sempre?", a: "No. Ha senso quando produzione e consumo non coincidono o quando vuoi ridurre i picchi. In altri casi è meglio investire altrove, e te lo diciamo." },
      { q: "Vi occupate anche di incentivi e pratiche?", a: "Ti aiutiamo a orientarti tra le opportunità disponibili al momento del progetto e a coordinare i professionisti coinvolti. Le condizioni cambiano nel tempo e vanno verificate caso per caso." },
      { q: "Che differenza c'è tra Energy e SimplyX Save?", a: "Save guarda tutta la spesa tecnologica, energia compresa, per trovare risparmi. Energy entra nel merito degli impianti: produzione, accumulo, continuità ed efficienza." }
    ],
    related: ["data-center", "managed-services", "business-automation"]
  }
];
