// Testi del sito Simplyx (IT / EN). Modificare qui, poi `npm run build`.
const B = '#12B5FB', V = '#A99EFF';

export const LANGS = {
  it: { code: 'IT', name: 'Italiano', home: '/', portal: '/area-clienti/', locale: 'it_IT' },
  en: { code: 'EN', name: 'English', home: '/en/', portal: '/en/client-area/', locale: 'en_GB' }
};

export const HOME = {
  it: {
    metaTitle: 'Simplyx — Dal data center all’app',
    metaDesc: 'Simplyx progetta infrastrutture (data center, edge, reti, energia, IoT) e software (AI, SaaS, app mobile, marketplace). Soluzioni pronte per PMI e professionisti.',
    ticker: 'SISTEMI ONLINE · IT · OT · AI · CLOUD · EDGE',
    viewLabel: 'Scegli il tuo profilo', segAz: 'Aziende', segPmi: 'PMI e professionisti', navLabel: 'Principale',
    login: 'AREA CLIENTI', kpiLabel: 'In numeri',
    result: '[Risultato]', client: '[Cliente]', summary: '[sintesi del progetto]', readCase: 'Leggi il caso →',
    discover: 'Scopri le soluzioni →', perMonth: '/ mese + IVA', activate: 'Attiva online',
    review: '“[Recensione di un titolare: cosa è cambiato nella sua attività.]”',
    portalK: 'AREA CLIENTI', portalT: 'Tutti i tuoi servizi,\nin un unico pannello.',
    portalP: 'Cosa hai attivo, per quanto tempo e quando si rinnova. Paghi con carta, PayPal, Apple Pay e Google Pay, addebito SEPA o bonifico.',
    portalCta: 'Accedi all’area clienti →',
    portalItems: [{ k: 'SERVIZI', v: 'Acquistati e attivi' }, { k: 'PERIODO', v: 'Inizio, scadenza, giorni residui' }, { k: 'RINNOVI', v: 'Automatici o manuali' }, { k: 'PAGAMENTI', v: 'Carta e altri metodi' }],
    footTag: 'Infrastrutture e software,\nprogettati insieme.',
    footCols: [
      { h: 'AZIENDE', l: [['AI applicata', '#digital'], ['Piattaforme SaaS', '#digital'], ['Data center', '#infra'], ['Edge, IoT e reti', '#infra']] },
      { h: 'PMI', l: [['Saloni e centri estetici', '#settori'], ['B&B e affittacamere', '#settori'], ['Ristoranti e bar', '#settori'], ['Pacchetti e prezzi', '#pacchetti']] },
      { h: 'SIMPLYX', l: [['Casi studio', '#casi'], ['Area clienti', '@portal'], ['Contatti', '#contatti']] }
    ],
    legal: 'Privacy · Cookie · GDPR', skip: 'Vai al contenuto',
    az: {
      nav: [['Digital & AI', '#digital'], ['Infrastrutture', '#infra'], ['Prodotti', '#prodotti'], ['Casi studio', '#casi'], ['Contatti', '#contatti']],
      eyebrow: '// PER LE AZIENDE', title: 'Dal data center\nall’app.',
      sub: 'Progettiamo e gestiamo l’infrastruttura fisica — data center, edge, reti, energia e IoT — e ci costruiamo sopra il software: piattaforme SaaS, app mobile, marketplace e intelligenza artificiale. Un solo partner, dal rack al cliente finale.',
      c1: 'Lancia il tuo prodotto digitale →', c1h: '#digital', c2: 'Progetta la tua infrastruttura →', c2h: '#infra',
      kpis: [['[N]', 'progetti consegnati'], ['[N] kW', 'potenza IT gestita'], ['[N]', 'app e SaaS in produzione'], ['2', 'sedi · Milano e Napoli']],
      ctaK: '// PARLIAMONE', ctaT: 'Prenota una consulenza.', ctaA: 'Consulenza Digital & AI', ctaB: 'Consulenza Infrastrutture'
    },
    pmi: {
      nav: [['Settori', '#settori'], ['Pacchetti', '#pacchetti'], ['Come funziona', '#come'], ['Contatti', '#contatti']],
      eyebrow: '// PER PMI E PROFESSIONISTI', title: 'La tecnologia che lavora\nmentre tu lavori.',
      sub: 'Prenotazioni online, assistente su WhatsApp, sito web e Wi-Fi per la tua attività. Attivi online, paghi al mese, senza chiamare un tecnico.',
      c1: 'Scegli il tuo pacchetto →', c1h: '#pacchetti', c2: 'Trova la soluzione per il tuo settore', c2h: '#settori',
      kpis: [['[N]', 'attività che ci usano'], ['24/7', 'prenotazioni sempre aperte'], ['IT', 'dati ospitati in Italia'], ['[N] min', 'per attivare il servizio']],
      ctaK: '// HAI DUBBI?', ctaT: 'Ti richiamiamo noi.', ctaA: 'Scegli il pacchetto', ctaB: 'Richiedi una chiamata'
    },
    a: {
      s1k: '01 — COSA FACCIAMO', s1t: 'Due competenze, una sola regia: dall’energia che alimenta il rack all’app nelle mani del cliente.',
      stackAria: 'Lo stack Simplyx in cinque livelli, dal data center all’app',
      legD: 'Il software che i tuoi clienti vedono e usano.', legI: 'L’infrastruttura fisica su cui tutto gira, gestita da noi.', infraK: 'INFRASTRUTTURE',
      layers: [['L5', 'App, siti e marketplace', 'MOBILE · WEB', B], ['L4', 'AI e piattaforme SaaS', 'AGENTI · ML', B], ['L3', 'Cloud e sicurezza', 'GDPR · SOC', V], ['L2', 'Reti, edge e IoT', 'LAN · 5G · SENSORI', V], ['L1', 'Data center ed energia', 'RACK · UPS · COOLING', V]],
      dTitle: 'Costruiamo prodotti digitali che generano ricavi.', dMore: 'Esplora Digital & AI →',
      digital: [['AI applicata e agenti', 'assistenti, automazioni, ML'], ['Piattaforme SaaS', 'multi-tenant, in abbonamento'], ['App mobile', 'iOS e Android'], ['Siti web ed e-commerce', 'performance e SEO'], ['Marketplace', 'B2B e B2C']],
      iTitle: 'Progettiamo l’infrastruttura su cui gira tutto.', iMore: 'Esplora Infrastrutture →',
      infra: [['Data center', 'design, colocation, facility'], ['Edge computing', 'calcolo vicino ai dati'], ['Reti e sicurezza', 'LAN, WAN, cablaggi, firewall'], ['Energia e impianti', 'UPS, raffreddamento, efficienza'], ['IoT industriale', 'sensori e telemetria']],
      s2k: '02 — DOVE SI INCONTRANO', s2t: 'Dal sensore in campo\nalla dashboard sul telefono.',
      s2p: 'Edge e IoT sono il ponte tra le nostre due anime: raccogliamo i dati sul campo, li portiamo in sicurezza nel data center e li trasformiamo in servizi intelligenti. Nessun passaggio di consegne tra fornitori diversi.',
      flow: [['01', 'Sensori IoT', 'Raccolgono dati da impianti, edifici e macchine.', V], ['02', 'Nodo edge', 'Elabora in locale, a bassa latenza.', V], ['03', 'Rete sicura', 'Trasporta i dati cifrati e monitorati.', V], ['04', 'Data center', 'Li conserva su infrastruttura gestita.', V], ['05', 'Modelli AI', 'Li trasformano in previsioni e azioni.', B], ['06', 'App e dashboard', 'Li mettono in mano a chi decide.', B]],
      s3k: '03 — PRODOTTI SIMPLYX', s3t: 'Non solo progetti:\nprodotti nostri, in produzione.',
      products: [['SAAS · AI', 'IN PILOTA', 'Prenotazioni Saloni', 'Piattaforma di prenotazione per parrucchieri, saloni e centri estetici, con agente AI che gestisce gli appuntamenti su WhatsApp.', 'Richiedi una demo →'], ['[CATEGORIA]', '[STATO]', '[Nome prodotto]', '[Una riga su cosa fa e per chi.]', 'Scopri di più →'], ['[CATEGORIA]', '[STATO]', '[Nome prodotto]', '[Una riga su cosa fa e per chi.]', 'Scopri di più →']],
      s4k: '04 — CASI STUDIO', s4t: 'Risultati, non promesse.',
      cases: [['DATA CENTER · ENERGIA', V], ['IOT · EDGE · AI', V], ['SAAS · MOBILE', B]]
    },
    p: {
      s1k: '01 — IL TUO SETTORE', s1t: 'Soluzioni pronte, pensate per chi ha un’attività da mandare avanti.',
      sectors: [['01', 'Saloni e centri estetici', 'Agenda online, promemoria automatici e prenotazioni su WhatsApp.'], ['02', 'B&B e affittacamere', 'Sito con prenotazione diretta, check-in online e Wi-Fi per gli ospiti.'], ['03', 'Ristoranti e bar', 'Prenotazione tavoli, menu digitale e rete affidabile in sala.'], ['04', 'Studi professionali', 'Appuntamenti, posta e backup dei documenti in sicurezza.'], ['05', 'Negozi', 'Vetrina online, e-commerce e cassa collegata.']],
      s2k: '02 — PACCHETTI', s2t: 'Scegli, attiva, inizi a lavorare.', s2p: 'Abbonamento mensile, disdici quando vuoi. [Condizioni da confermare]',
      plans: [
        { n: 'START', badge: '', d: 'Per iniziare a ricevere prenotazioni online.', price: '[€ —]', f: ['Pagina di prenotazione', 'Agenda condivisa', 'Promemoria via email', 'Assistenza via chat'], hi: false },
        { n: 'PRO', badge: 'PIÙ SCELTO', d: 'Il cliente prenota da solo, anche su WhatsApp.', price: '[€ —]', f: ['Tutto di Start', 'Assistente AI su WhatsApp', 'Sito web con il tuo dominio', 'Promemoria via SMS e WhatsApp'], hi: true },
        { n: 'BUSINESS', badge: '', d: 'Per chi ha più sedi o una struttura ricettiva.', price: '[€ —]', f: ['Tutto di Pro', 'Più sedi e operatori', 'Wi-Fi gestito per gli ospiti', 'Assistenza prioritaria'], hi: false }
      ],
      payNote: 'PAGAMENTO CON CARTA · PAYPAL · APPLE PAY / GOOGLE PAY · SEPA · BONIFICO',
      s3k: '03 — COME FUNZIONA', s3t: 'Tre passi, nessun tecnico.',
      steps: [['01', 'Scegli il pacchetto', 'Indica il tuo settore e il pacchetto più adatto.'], ['02', 'Attiva e paga online', 'Crei l’account e paghi con il metodo che preferisci.'], ['03', 'Gestisci tutto dall’area clienti', 'Servizi, scadenze, rinnovi e fatture in un solo posto.']],
      s4k: '04 — PERCHÉ FIDARSI', s4t: 'Dietro ogni app, un’infrastruttura che gestiamo noi.',
      s4p: 'Gli stessi data center e le stesse reti che usiamo per le grandi aziende proteggono i dati dei tuoi clienti.',
      trust: [['DATI', 'Ospitati in Italia'], ['PRIVACY', 'Conforme al GDPR'], ['ASSISTENZA', 'In italiano, [orari]'], ['CONTRATTO', 'Mensile, senza vincoli']],
      quotes: ['[Nome] · [Salone, città]', '[Nome] · [B&B, città]', '[Nome] · [Attività, città]']
    }
  },
  en: {
    metaTitle: 'Simplyx — From the data center to the app',
    metaDesc: 'Simplyx designs infrastructure (data centers, edge, networks, energy, IoT) and software (AI, SaaS, mobile apps, marketplaces). Ready-made solutions for small businesses.',
    ticker: 'SYSTEMS ONLINE · IT · OT · AI · CLOUD · EDGE',
    viewLabel: 'Choose your profile', segAz: 'Enterprise', segPmi: 'Small business', navLabel: 'Main',
    login: 'CLIENT AREA', kpiLabel: 'In numbers',
    result: '[Result]', client: '[Client]', summary: '[project summary]', readCase: 'Read the case →',
    discover: 'See the solutions →', perMonth: '/ month + VAT', activate: 'Activate online',
    review: '“[A business owner’s review: what changed for their business.]”',
    portalK: 'CLIENT AREA', portalT: 'All your services,\nin one panel.',
    portalP: 'What you have active, for how long and when it renews. Pay by card, PayPal, Apple Pay and Google Pay, SEPA direct debit or bank transfer.',
    portalCta: 'Go to the client area →',
    portalItems: [{ k: 'SERVICES', v: 'Purchased and active' }, { k: 'TERM', v: 'Start, expiry, days left' }, { k: 'RENEWALS', v: 'Automatic or manual' }, { k: 'PAYMENTS', v: 'Card and other methods' }],
    footTag: 'Infrastructure and software,\ndesigned together.',
    footCols: [
      { h: 'ENTERPRISE', l: [['Applied AI', '#digital'], ['SaaS platforms', '#digital'], ['Data centers', '#infra'], ['Edge, IoT and networks', '#infra']] },
      { h: 'SMALL BUSINESS', l: [['Hair and beauty salons', '#settori'], ['B&Bs and guest houses', '#settori'], ['Restaurants and bars', '#settori'], ['Plans and pricing', '#pacchetti']] },
      { h: 'SIMPLYX', l: [['Case studies', '#casi'], ['Client area', '@portal'], ['Contact', '#contatti']] }
    ],
    legal: 'Privacy · Cookies · GDPR', skip: 'Skip to content',
    az: {
      nav: [['Digital & AI', '#digital'], ['Infrastructure', '#infra'], ['Products', '#prodotti'], ['Case studies', '#casi'], ['Contact', '#contatti']],
      eyebrow: '// FOR ENTERPRISE', title: 'From the data center\nto the app.',
      sub: 'We design and run the physical infrastructure — data centers, edge, networks, energy and IoT — and build the software on top: SaaS platforms, mobile apps, marketplaces and artificial intelligence. One partner, from the rack to your end customer.',
      c1: 'Launch your digital product →', c1h: '#digital', c2: 'Design your infrastructure →', c2h: '#infra',
      kpis: [['[N]', 'projects delivered'], ['[N] kW', 'IT power managed'], ['[N]', 'apps and SaaS live'], ['2', 'offices · Milan and Naples']],
      ctaK: '// LET’S TALK', ctaT: 'Book a consultation.', ctaA: 'Digital & AI consultation', ctaB: 'Infrastructure consultation'
    },
    pmi: {
      nav: [['Industries', '#settori'], ['Plans', '#pacchetti'], ['How it works', '#come'], ['Contact', '#contatti']],
      eyebrow: '// FOR SMALL BUSINESSES', title: 'Technology that works\nwhile you work.',
      sub: 'Online booking, a WhatsApp assistant, a website and Wi-Fi for your business. Activate online, pay monthly, no technician needed.',
      c1: 'Choose your plan →', c1h: '#pacchetti', c2: 'Find the solution for your industry', c2h: '#settori',
      kpis: [['[N]', 'businesses on board'], ['24/7', 'bookings always open'], ['IT', 'data hosted in Italy'], ['[N] min', 'to get started']],
      ctaK: '// QUESTIONS?', ctaT: 'We’ll call you back.', ctaA: 'Choose a plan', ctaB: 'Request a call'
    },
    a: {
      s1k: '01 — WHAT WE DO', s1t: 'Two skill sets, one control room: from the power feeding the rack to the app in your customer’s hands.',
      stackAria: 'The Simplyx stack in five layers, from data center to app',
      legD: 'The software your customers see and use.', legI: 'The physical infrastructure everything runs on, managed by us.', infraK: 'INFRASTRUCTURE',
      layers: [['L5', 'Apps, websites, marketplaces', 'MOBILE · WEB', B], ['L4', 'AI and SaaS platforms', 'AGENTS · ML', B], ['L3', 'Cloud and security', 'GDPR · SOC', V], ['L2', 'Networks, edge and IoT', 'LAN · 5G · SENSORS', V], ['L1', 'Data center and energy', 'RACK · UPS · COOLING', V]],
      dTitle: 'We build digital products that drive revenue.', dMore: 'Explore Digital & AI →',
      digital: [['Applied AI and agents', 'assistants, automation, ML'], ['SaaS platforms', 'multi-tenant, subscription'], ['Mobile apps', 'iOS and Android'], ['Websites and e-commerce', 'performance and SEO'], ['Marketplaces', 'B2B and B2C']],
      iTitle: 'We design the infrastructure everything runs on.', iMore: 'Explore Infrastructure →',
      infra: [['Data centers', 'design, colocation, facility'], ['Edge computing', 'compute close to the data'], ['Networks and security', 'LAN, WAN, cabling, firewalls'], ['Energy and plants', 'UPS, cooling, efficiency'], ['Industrial IoT', 'sensors and telemetry']],
      s2k: '02 — WHERE THEY MEET', s2t: 'From the sensor in the field\nto the dashboard on your phone.',
      s2p: 'Edge and IoT bridge our two sides: we collect data in the field, carry it securely to the data center and turn it into intelligent services. No hand-offs between different vendors.',
      flow: [['01', 'IoT sensors', 'Collect data from plants, buildings and machines.', V], ['02', 'Edge node', 'Processes locally, with low latency.', V], ['03', 'Secure network', 'Carries encrypted, monitored data.', V], ['04', 'Data center', 'Stores it on managed infrastructure.', V], ['05', 'AI models', 'Turn it into forecasts and actions.', B], ['06', 'Apps and dashboards', 'Put it in the hands of decision makers.', B]],
      s3k: '03 — SIMPLYX PRODUCTS', s3t: 'Not just projects:\nour own products, live.',
      products: [['SAAS · AI', 'PILOT', 'Salon Booking', 'Booking platform for hairdressers, beauty salons and spas, with an AI agent that handles appointments on WhatsApp.', 'Request a demo →'], ['[CATEGORY]', '[STATUS]', '[Product name]', '[One line on what it does and for whom.]', 'Learn more →'], ['[CATEGORY]', '[STATUS]', '[Product name]', '[One line on what it does and for whom.]', 'Learn more →']],
      s4k: '04 — CASE STUDIES', s4t: 'Results, not promises.',
      cases: [['DATA CENTER · ENERGY', V], ['IOT · EDGE · AI', V], ['SAAS · MOBILE', B]]
    },
    p: {
      s1k: '01 — YOUR INDUSTRY', s1t: 'Ready-made solutions for people with a business to run.',
      sectors: [['01', 'Hair and beauty salons', 'Online calendar, automatic reminders and WhatsApp booking.'], ['02', 'B&Bs and guest houses', 'Direct-booking website, online check-in and guest Wi-Fi.'], ['03', 'Restaurants and bars', 'Table booking, digital menu and reliable in-room network.'], ['04', 'Professional offices', 'Appointments, email and secure document backup.'], ['05', 'Shops', 'Online storefront, e-commerce and connected till.']],
      s2k: '02 — PLANS', s2t: 'Choose, activate, get to work.', s2p: 'Monthly subscription, cancel anytime. [Terms to be confirmed]',
      plans: [
        { n: 'START', badge: '', d: 'Start taking bookings online.', price: '[€ —]', f: ['Booking page', 'Shared calendar', 'Email reminders', 'Chat support'], hi: false },
        { n: 'PRO', badge: 'MOST POPULAR', d: 'Customers book on their own, even on WhatsApp.', price: '[€ —]', f: ['Everything in Start', 'AI assistant on WhatsApp', 'Website on your domain', 'SMS and WhatsApp reminders'], hi: true },
        { n: 'BUSINESS', badge: '', d: 'For multiple locations or guest accommodation.', price: '[€ —]', f: ['Everything in Pro', 'Multiple locations and staff', 'Managed guest Wi-Fi', 'Priority support'], hi: false }
      ],
      payNote: 'PAY BY CARD · PAYPAL · APPLE PAY / GOOGLE PAY · SEPA · BANK TRANSFER',
      s3k: '03 — HOW IT WORKS', s3t: 'Three steps, no technician.',
      steps: [['01', 'Pick your plan', 'Tell us your industry and choose the best fit.'], ['02', 'Activate and pay online', 'Create your account and pay the way you prefer.'], ['03', 'Manage it all in the client area', 'Services, expiry dates, renewals and invoices in one place.']],
      s4k: '04 — WHY TRUST US', s4t: 'Behind every app, infrastructure we run ourselves.',
      s4p: 'The same data centers and networks we run for large companies protect your customers’ data.',
      trust: [['DATA', 'Hosted in Italy'], ['PRIVACY', 'GDPR compliant'], ['SUPPORT', 'Italian and English, [hours]'], ['CONTRACT', 'Monthly, no lock-in']],
      quotes: ['[Name] · [Salon, city]', '[Name] · [B&B, city]', '[Name] · [Business, city]']
    }
  }
};
