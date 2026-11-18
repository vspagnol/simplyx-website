// Generatore statico del sito SimplyX. Uso: `npm run build` → cartella dist/
// Variabili: SITE_URL (default https://simplyx.it), NOINDEX=1 (anteprima), LINKS=index (link con index.html, per aprire i file senza server)
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE, NAV, HOME, METHOD, SAVE, LABS, CONTACT, PRIVACY, SOLUTIONS } from './content.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = ROOT + 'dist/';
const SITE_URL = (process.env.SITE_URL || 'https://simplyx.it').replace(/\/$/, '');
const NOINDEX = process.env.NOINDEX === '1';
const INDEX_LINKS = process.env.LINKS === 'index';
const HASH_ASSETS = process.env.LINKS !== 'index';

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(ROOT + 'static/img', DIST + 'img', { recursive: true });
mkdirSync(DIST + 'fonts');
cpSync(ROOT + 'static/fonts/inter-var-latin.woff2', DIST + 'fonts/inter-var-latin.woff2');
for (const f of ['favicon.ico', 'favicon.png']) cpSync(ROOT + 'static/' + f, DIST + f);

function emit(dir, name, ext) {
  const buf = readFileSync(`${ROOT}src/${name}.${ext}`);
  const h = HASH_ASSETS ? '.' + createHash('sha256').update(buf).digest('hex').slice(0, 10) : '';
  mkdirSync(DIST + dir, { recursive: true });
  const out = `${dir}/${name}${h}.${ext}`;
  writeFileSync(DIST + out, buf);
  return out;
}
const CSS = emit('css', 'site', 'css');
const JS = emit('js', 'site', 'js');
const BOOT = emit('js', 'boot', 'js');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SOL = Object.fromEntries(SOLUTIONS.map((s) => [s.slug, s]));
const solPath = (slug) => `soluzioni/${slug}/`;

// ---- icone (linea, 24px) ----
const IC = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>',
  server: '<rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><path d="M8 7h.01M8 17h.01"/>',
  network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-6 5M12 12l6 5"/>',
  cloud: '<path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17.2 9.1 4.5 4.5 0 0 1 17 18H7z"/>',
  shield: '<path d="M12 3l7 3v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2 2M14 9l2 2"/>',
  eye: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  chat: '<path d="M5 5h14v10H10l-5 4z"/><path d="M9 9h6M9 12h4"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  plug: '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0V8zM12 16v5"/>',
  flow: '<rect x="3" y="4" width="6" height="5" rx="1.2"/><rect x="15" y="4" width="6" height="5" rx="1.2"/><rect x="9" y="15" width="6" height="5" rx="1.2"/><path d="M9 6.5h6M18 9v3a2 2 0 0 1-2 2h-1M6 9v3a2 2 0 0 0 2 2h1"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.3L4 8.5M4 4v4.5h4.5M4 13a8 8 0 0 0 14.3 4.3L20 15.5M20 20v-4.5h-4.5"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1.2"/><path d="M5 9v10h14V9M10 13h4"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.8c1.9.7 3 2.5 3 5.2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  battery: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21.5 10.5v3M7 10.5v3M10.5 10.5v3"/>',
  gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-6"/><path d="M12 17h.01"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 12.5l9 5 9-5M3 16.5l9 5 9-5"/>',
  wind: '<path d="M3 9h10a2.5 2.5 0 1 0-2.5-2.5M3 13h15a2.5 2.5 0 1 1-2.5 2.5M3 17h7"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16z"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.5-8.5"/><path d="M14.5 6.5L17 4a4 4 0 0 0-5.5 5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  pin: '<path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  tel: '<path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>'
};
const icon = (n, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${IC[n] || IC.spark}</svg>`;

// ---- pagina ----
function ctx(path, opts = {}) {
  const depth = path ? path.split('/').filter(Boolean).length : 0;
  const root = opts.absolute ? '/' : (depth ? '../'.repeat(depth) : './');
  const href = (target = '', hash) => {
    let u = root + target;
    if (INDEX_LINKS) u += 'index.html';
    return u + (hash ? '#' + hash : '');
  };
  return { path, root, href, asset: (p) => root + p };
}

function photo(c, name, alt, { sizes = '100vw', lazy = true, cls = '' } = {}) {
  return `<img${cls ? ` class="${cls}"` : ''} src="${c.asset(`img/photos/${name}-1536.webp`)}" srcset="${c.asset(`img/photos/${name}-800.webp`)} 800w, ${c.asset(`img/photos/${name}-1536.webp`)} 1536w" sizes="${sizes}" width="1536" height="864" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}>`;
}

function head(c, { title, desc, image = 'img/og-image.jpg', jsonld = [], preload, noindex }) {
  const url = SITE_URL + '/' + c.path;
  const robots = NOINDEX || noindex ? '<meta name="robots" content="noindex, nofollow">\n' : '';
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${robots}<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="it" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta name="theme-color" content="#000000">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SimplyX">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${c.asset('favicon.ico')}" sizes="any">
<link rel="icon" type="image/png" href="${c.asset('favicon.png')}">
<link rel="apple-touch-icon" href="${c.asset('img/apple-touch-icon.png')}">
<link rel="preload" href="${c.asset('fonts/inter-var-latin.woff2')}" as="font" type="font/woff2" crossorigin>
${preload ? `<link rel="preload" as="image" href="${c.asset(`img/photos/${preload}-1536.webp`)}" imagesrcset="${c.asset(`img/photos/${preload}-800.webp`)} 800w, ${c.asset(`img/photos/${preload}-1536.webp`)} 1536w" imagesizes="100vw">\n` : ''}<link rel="stylesheet" href="${c.asset(CSS)}">
<script src="${c.asset(BOOT)}"></script>
<script src="${c.asset(JS)}" defer></script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>`;
}

function nav(c, active) {
  const item = (n) => {
    if (n.menu) return `<li class="has-menu"><button type="button" class="nav-link" aria-expanded="false" aria-controls="menu-soluzioni" data-menu>${n.label}${icon('chevron', 'ic chev')}</button></li>`;
    const cur = active === n.path && !n.hash ? ' aria-current="page"' : '';
    return `<li><a class="nav-link" href="${c.href(n.path, n.hash)}"${cur}>${n.label}</a></li>`;
  };
  return `<a class="skip" href="#contenuto">Vai al contenuto</a>
<header class="nav" data-nav>
<div class="nav-bar">
<a class="brand" href="${c.href('')}" aria-label="SimplyX — pagina iniziale"><img src="${c.asset('img/logo-header.png')}" width="520" height="129" alt="SimplyX"></a>
<nav class="nav-main" aria-label="Principale"><ul>${NAV.map(item).join('')}</ul></nav>
<a class="btn btn-sm btn-blue nav-cta" href="${c.href('contatti/')}">Parliamone</a>
<button type="button" class="burger" aria-label="Apri il menu" aria-expanded="false" aria-controls="menu-mobile" data-burger><span></span><span></span></button>
</div>
<div class="mega" id="menu-soluzioni" hidden>
<div class="mega-in">
<p class="mega-k">Soluzioni</p>
<ul class="mega-list">${SOLUTIONS.map((s) => `<li><a href="${c.href(solPath(s.slug))}"${active === solPath(s.slug) ? ' aria-current="page"' : ''}><span class="mega-t">${esc(s.name)}</span><span class="mega-d">${esc(s.short)}</span></a></li>`).join('')}</ul>
</div>
</div>
<div class="mobile" id="menu-mobile" hidden>
<nav aria-label="Menu">
<p class="mega-k">Soluzioni</p>
<ul class="mobile-sol">${SOLUTIONS.map((s) => `<li><a href="${c.href(solPath(s.slug))}">${esc(s.name)}</a></li>`).join('')}</ul>
<ul class="mobile-main">${NAV.filter((n) => !n.menu).map((n) => `<li><a href="${c.href(n.path, n.hash)}">${n.label}</a></li>`).join('')}</ul>
<a class="btn btn-blue btn-block" href="${c.href('contatti/')}">Parliamone</a>
</nav>
</div>
</header>`;
}

function footer(c) {
  const year = new Date().getFullYear();
  return `<footer class="foot">
<div class="wrap">
<div class="foot-grid">
<div class="foot-col foot-brand"><p class="foot-name">SimplyX</p><p>${esc(SITE.tagline)}</p></div>
<div class="foot-col"><p class="foot-h">Soluzioni</p><ul>${SOLUTIONS.map((s) => `<li><a href="${c.href(solPath(s.slug))}">${esc(s.name)}</a></li>`).join('')}</ul></div>
<div class="foot-col"><p class="foot-h">SimplyX</p><ul><li><a href="${c.href('labs/')}">SimplyX Labs</a></li><li><a href="${c.href('save/')}">SimplyX Save</a></li><li><a href="${c.href('', 'metodo')}">Metodo</a></li><li><a href="${c.href('contatti/')}">Contatti</a></li></ul></div>
<div class="foot-col"><p class="foot-h">Contatti</p><ul><li><a href="mailto:${SITE.email}">${SITE.email}</a></li><li><a href="tel:${SITE.phoneHref}">${SITE.phone}</a></li><li><a href="https://wa.me/${SITE.whatsappHref}" rel="noopener">WhatsApp ${SITE.whatsapp}</a></li></ul></div>
<div class="foot-col"><p class="foot-h">Sedi</p><ul>${SITE.offices.map((o) => `<li>${o.city} — ${o.street}, ${o.zip}</li>`).join('')}</ul></div>
</div>
<div class="foot-legal"><p>© ${year} ${SITE.legal} · P. IVA ${SITE.vat} · PEC ${SITE.pec}</p><p><a href="${c.href('privacy/')}">Privacy e cookie</a></p></div>
</div>
</footer>`;
}

const page = (c, meta, active, body) => `${head(c, meta)}
<body>
${nav(c, active)}
<main id="contenuto">
${body}
</main>
${footer(c)}
</body>
</html>
`;

const ORG = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'SimplyX', legalName: SITE.legal, url: SITE_URL + '/',
  logo: SITE_URL + '/img/logo-wordmark.png', email: SITE.email, telephone: SITE.phone, vatID: 'IT' + SITE.vat,
  address: SITE.offices.map((o) => ({ '@type': 'PostalAddress', streetAddress: o.street, postalCode: o.zip, addressLocality: o.city, addressRegion: o.region, addressCountry: 'IT' }))
};
const crumbs = (list) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: list.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE_URL + '/' + p })) });
const faqLd = (faq) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

// ---- blocchi condivisi ----
const sectionHead = (eyebrow, title, sub, tag = 'h2') => `<div class="sec-head reveal">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<${tag} class="h2">${esc(title)}</${tag}>${sub ? `<p class="lead">${esc(sub)}</p>` : ''}</div>`;

const faqBlock = (faq) => `<section class="sec sec-white"><div class="wrap wrap-narrow">${sectionHead('Domande frequenti', 'Le risposte, in chiaro.')}
<div class="faq reveal">${faq.map((f) => `<details><summary><span>${esc(f.q)}</span>${icon('plus', 'ic faq-ic')}</summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`).join('')}</div></div></section>`;

const ctaBlock = (c, title, sub, topic) => `<section class="cta-band"><div class="cta-media">${photo(c, 'network', '', { sizes: '100vw' })}</div>
<div class="wrap cta-in reveal"><h2 class="h2">${esc(title)}</h2><p class="lead">${esc(sub)}</p>
<div class="btn-row"><a class="btn btn-blue" href="${c.href('contatti/')}${topic ? '?tema=' + topic : ''}">Scrivici${icon('arrow', 'ic')}</a><a class="btn btn-ghost-light" href="tel:${SITE.phoneHref}">Chiama ${SITE.phone}</a></div></div></section>`;

const tile = (c, s, cls = '') => `<a class="tile ${cls} reveal" href="${c.href(solPath(s.slug))}">
${photo(c, s.img, '', { sizes: '(min-width: 900px) 50vw, 100vw' })}
<span class="tile-txt"><span class="tile-t">${esc(s.name)}</span><span class="tile-d">${esc(s.short)}</span></span>
<span class="tile-go">Scopri di più${icon('chevron', 'ic')}</span></a>`;

const labCard = (c, p, rv = true) => `<article class="lab${rv ? ' reveal' : ''}"><div class="lab-img"><img src="${c.asset(`img/labs/${p.img}.webp`)}" alt="${esc(p.alt)}" width="1200" height="800" loading="lazy" decoding="async"></div>
<div class="lab-txt"><p class="lab-meta"><span>${esc(p.kind)}</span><span class="badge badge-${p.status === 'Realizzato' ? 'ok' : 'wip'}">${esc(p.status)}</span></p><h3>${esc(p.name)}</h3><p>${esc(p.d)}</p></div></article>`;

const methodBlock = () => `<ol class="method">${METHOD.map((m) => `<li class="reveal"><span class="method-n">${m.n}</span><h3>${m.t}</h3><p>${esc(m.d)}</p></li>`).join('')}</ol>`;

// ---- home ----
function renderHome() {
  const c = ctx('');
  const h = HOME;
  const body = `<section class="hero hero-home">
<div class="hero-media" data-parallax>${photo(c, 'hero', h.hero.alt, { lazy: false })}</div>
<div class="wrap hero-in">
<p class="eyebrow hero-fade">${esc(h.hero.eyebrow)}</p>
<h1 class="h1 hero-fade">${h.hero.title.map(esc).join('<br>')} <span class="grad">${esc(h.hero.titleAccent)}</span></h1>
<p class="lead hero-fade">${esc(h.hero.sub)}</p>
<div class="btn-row hero-fade"><a class="btn btn-blue" href="${c.href('contatti/')}">${h.hero.cta1}${icon('arrow')}</a><a class="btn btn-ghost-light" href="#soluzioni">${h.hero.cta2}</a></div>
</div>
</section>

<section class="sec sec-white statement"><div class="wrap wrap-narrow reveal"><p class="statement-lead">${esc(h.statement.lead)}</p><p class="statement-body">${esc(h.statement.body)}</p></div></section>

<section class="sec sec-grey" id="soluzioni"><div class="wrap">${sectionHead(h.solutions.eyebrow, h.solutions.title, h.solutions.sub)}
<div class="tiles">${SOLUTIONS.map((s, i) => tile(c, s, i < 2 ? 'tile-half' : i < 5 ? 'tile-third' : 'tile-full')).join('\n')}</div></div></section>

<section class="sec sec-white" id="percorsi"><div class="wrap">${sectionHead(h.paths.eyebrow, h.paths.title)}
<div class="cards cards-3">${h.paths.items.map((p) => `<article class="card card-grey reveal">${icon(p.icon, 'ic ic-lg')}<h3>${esc(p.t)}</h3><p>${esc(p.d)}</p><a class="link" href="${c.href(p.path, p.hash)}">${esc(p.link)}${icon('chevron')}</a></article>`).join('')}</div></div></section>

<section class="sec sec-black" id="labs"><div class="wrap">${sectionHead(h.labs.eyebrow, h.labs.title, h.labs.sub)}</div>
<div class="rail reveal" tabindex="0" role="region" aria-label="Prodotti dei SimplyX Labs"><div class="rail-in">${LABS.items.map((p) => labCard(c, p, false)).join('')}</div></div>
<div class="wrap"><p class="sec-foot reveal"><a class="link link-light" href="${c.href('labs/')}">${h.labs.link}${icon('chevron')}</a></p></div></section>

<section class="sec sec-grey" id="save"><div class="wrap split">
<div class="split-txt reveal"><p class="eyebrow">${h.save.eyebrow}</p><h2 class="h2">${esc(h.save.title)}</h2><p class="lead">${esc(h.save.sub)}</p>
<ol class="steps-mini">${SAVE.steps.map((s, i) => `<li><span>${i + 1}</span>${esc(s.t)}</li>`).join('')}</ol>
<a class="btn btn-dark" href="${c.href('save/')}">${h.save.link}${icon('arrow')}</a></div>
<div class="split-img reveal">${photo(c, 'team', h.save.alt, { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
</div></section>

<section class="sec sec-white" id="metodo"><div class="wrap">${sectionHead(h.method.eyebrow, h.method.title, h.method.sub)}${methodBlock()}</div></section>

${ctaBlock(c, h.cta.title, h.cta.sub)}`;
  const web = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SimplyX', url: SITE_URL + '/', inLanguage: 'it' };
  return page(c, { title: h.metaTitle, desc: h.metaDesc, jsonld: [ORG, web], preload: 'hero' }, '', body);
}

// ---- pagina soluzione ----
function renderSolution(s) {
  const c = ctx(solPath(s.slug));
  const body = `<section class="hero hero-page">
<div class="hero-media" data-parallax>${photo(c, s.img, s.alt, { lazy: false })}</div>
<div class="wrap hero-in">
<nav class="crumbs hero-fade" aria-label="Percorso"><ol><li><a href="${c.href('')}">Home</a></li><li><a href="${c.href('', 'soluzioni')}">Soluzioni</a></li><li aria-current="page">${esc(s.name)}</li></ol></nav>
<h1 class="h1 hero-fade">${esc(s.title)}</h1>
<p class="lead hero-fade">${esc(s.lead)}</p>
<div class="btn-row hero-fade"><a class="btn btn-blue" href="${c.href('contatti/')}?tema=${s.slug}">Parliamone${icon('arrow')}</a><a class="btn btn-ghost-light" href="#cosa-facciamo">Cosa facciamo</a></div>
</div>
</section>

<section class="sec sec-white statement"><div class="wrap wrap-narrow reveal"><p class="statement-lead">${esc(s.intro.h)}</p>${s.intro.p.map((p) => `<p class="statement-body">${esc(p)}</p>`).join('')}</div></section>

<section class="sec sec-grey" id="cosa-facciamo"><div class="wrap">${sectionHead('Cosa facciamo', 'Tutto quello che serve, da un solo partner.')}
<div class="cards cards-3">${s.caps.map((k) => `<article class="card card-white reveal">${icon(k.icon, 'ic ic-lg')}<h3>${esc(k.t)}</h3><p>${esc(k.d)}</p></article>`).join('')}</div></div></section>

${s.deep.map((d, i) => `<section class="sec ${i ? 'sec-black' : 'sec-white'}"><div class="wrap split${i ? ' split-rev' : ''}">
<div class="split-txt reveal"><p class="eyebrow">${esc(d.k)}</p><h2 class="h2">${esc(d.h)}</h2>${d.p.map((p) => `<p class="lead">${esc(p)}</p>`).join('')}
<ul class="checks">${d.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul></div>
<div class="split-img reveal">${photo(c, i ? (s.img3 || s.img) : s.img2, i ? (s.alt3 || s.alt) : s.alt2, { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
</div></section>`).join('\n')}

<section class="sec sec-grey"><div class="wrap">${sectionHead('Metodo', 'Dall\'idea al risultato. Senza frammentazione.', 'Lo stesso percorso per ogni progetto, grande o piccolo.')}${methodBlock()}</div></section>

${faqBlock(s.faq)}

<section class="sec sec-grey"><div class="wrap">${sectionHead('Continua', 'Soluzioni che lavorano insieme.')}
<div class="tiles">${s.related.map((r) => tile(c, SOL[r], 'tile-third')).join('\n')}</div></div></section>

${ctaBlock(c, 'Parliamo del tuo progetto.', 'Raccontaci dove sei e dove vuoi arrivare. Ti rispondiamo con idee concrete.', s.slug)}`;
  const service = { '@context': 'https://schema.org', '@type': 'Service', name: s.name, description: s.metaDesc, areaServed: 'IT', provider: { '@type': 'Organization', name: 'SimplyX', url: SITE_URL + '/' }, url: SITE_URL + '/' + c.path };
  return page(c, { title: s.metaTitle, desc: s.metaDesc, preload: s.img, jsonld: [service, crumbs([['Home', ''], ['Soluzioni', '#soluzioni'], [s.name, c.path]]), faqLd(s.faq)] }, c.path, body);
}

// ---- intestazione chiara per pagine interne ----
const pageHead = (c, eyebrow, title, lead, name) => `<section class="phead"><div class="wrap">
<nav class="crumbs crumbs-dark hero-fade" aria-label="Percorso"><ol><li><a href="${c.href('')}">Home</a></li><li aria-current="page">${esc(name)}</li></ol></nav>
<p class="eyebrow hero-fade">${esc(eyebrow)}</p><h1 class="h1 hero-fade">${esc(title)}</h1>${lead ? `<p class="lead hero-fade">${esc(lead)}</p>` : ''}</div></section>`;

function renderSave() {
  const c = ctx('save/');
  const s = SAVE;
  const body = `${pageHead(c, s.eyebrow, s.title, s.lead, 'Save')}
<section class="sec sec-white sec-tight"><div class="wrap"><div class="wide-img reveal">${photo(c, 'team', s.alt, { lazy: false, sizes: '(min-width: 1200px) 1120px, 100vw' })}</div></div></section>
<section class="sec sec-white"><div class="wrap">${sectionHead('Come funziona', 'Tre passi per riprendere il controllo.')}
<div class="cards cards-3">${s.steps.map((k, i) => `<article class="card card-grey reveal"><span class="card-n">${i + 1}</span><h3>${esc(k.t)}</h3><p>${esc(k.d)}</p></article>`).join('')}</div></div></section>
<section class="sec sec-grey"><div class="wrap">${sectionHead('Ambiti', s.areas.title, 'Sei voci che di solito nessuno guarda insieme.')}
<div class="cards cards-3">${s.areas.items.map((k) => `<article class="card card-white reveal">${icon(k.icon, 'ic ic-lg')}<h3>${esc(k.t)}</h3><p>${esc(k.d)}</p></article>`).join('')}</div></div></section>
<section class="sec sec-black"><div class="wrap">${sectionHead('Principi', s.principles.title)}
<div class="cards cards-3">${s.principles.items.map((k) => `<article class="card card-dark reveal"><h3>${esc(k.t)}</h3><p>${esc(k.d)}</p></article>`).join('')}</div></div></section>
${faqBlock(s.faq)}
${ctaBlock(c, 'Vuoi sapere dove stai spendendo troppo?', 'Partiamo da un primo incontro: ci dici cosa hai, ti diciamo cosa serve per l\'analisi.', 'save')}`;
  return page(c, { title: s.metaTitle, desc: s.metaDesc, jsonld: [crumbs([['Home', ''], ['SimplyX Save', c.path]]), faqLd(s.faq)] }, 'save/', body);
}

function renderLabs() {
  const c = ctx('labs/');
  const l = LABS;
  const body = `<section class="phead phead-dark"><div class="wrap">
<nav class="crumbs hero-fade" aria-label="Percorso"><ol><li><a href="${c.href('')}">Home</a></li><li aria-current="page">Labs</li></ol></nav>
<p class="eyebrow hero-fade">${l.eyebrow}</p><h1 class="h1 hero-fade">${esc(l.title)}</h1><p class="lead hero-fade">${esc(l.lead)}</p></div></section>
<section class="sec sec-black sec-tight"><div class="wrap"><div class="labs-grid">${l.items.map((p) => labCard(c, p)).join('')}</div><p class="note reveal">${esc(l.note)}</p></div></section>
<section class="sec sec-white"><div class="wrap">${sectionHead('Perché', l.how.title)}
<div class="cards cards-3">${l.how.items.map((k) => `<article class="card card-grey reveal">${icon(k.icon, 'ic ic-lg')}<h3>${esc(k.t)}</h3><p>${esc(k.d)}</p></article>`).join('')}</div></div></section>
${ctaBlock(c, 'Hai un prodotto in mente?', 'Lo progettiamo e lo costruiamo con lo stesso metodo che usiamo per i nostri.', 'software')}`;
  return page(c, { title: l.metaTitle, desc: l.metaDesc, jsonld: [crumbs([['Home', ''], ['SimplyX Labs', c.path]])] }, 'labs/', body);
}

function renderContact() {
  const c = ctx('contatti/');
  const k = CONTACT;
  const body = `${pageHead(c, k.eyebrow, k.title, k.lead, 'Contatti')}
<section class="sec sec-white sec-tight"><div class="wrap contact">
<form class="form reveal" data-contact data-to="${SITE.email}" novalidate>
<div class="field"><label for="f-nome">Nome e cognome</label><input id="f-nome" name="nome" type="text" autocomplete="name" required></div>
<div class="field"><label for="f-azienda">Azienda <span class="opt">(facoltativo)</span></label><input id="f-azienda" name="azienda" type="text" autocomplete="organization"></div>
<div class="field"><label for="f-tel">Telefono <span class="opt">(facoltativo)</span></label><input id="f-tel" name="telefono" type="tel" autocomplete="tel"></div>
<div class="field"><label for="f-tema">Di cosa vuoi parlare?</label><select id="f-tema" name="tema">${k.topics.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}</select></div>
<div class="field field-full"><label for="f-msg">Messaggio</label><textarea id="f-msg" name="messaggio" rows="5" required></textarea></div>
<p class="form-err" role="alert" hidden>Inserisci nome e messaggio per preparare la richiesta.</p>
<div class="field-full"><button class="btn btn-blue" type="submit">Prepara la richiesta${icon('arrow')}</button></div>
<p class="form-note field-full">${esc(k.formNote)} ${esc(k.privacyNote)} <a href="${c.href('privacy/')}">Privacy</a>.</p>
<p class="form-ok field-full" role="status" hidden>Email pronta nella tua app di posta. Se non si è aperta, <a data-fallback href="mailto:${SITE.email}">scrivi a ${SITE.email}</a>.</p>
</form>
<aside class="contact-side reveal" aria-label="Recapiti">
<ul class="contact-list">
<li>${icon('mail')}<div><p class="contact-k">Email</p><a href="mailto:${SITE.email}">${SITE.email}</a></div></li>
<li>${icon('tel')}<div><p class="contact-k">Telefono</p><a href="tel:${SITE.phoneHref}">${SITE.phone}</a></div></li>
<li>${icon('chat')}<div><p class="contact-k">WhatsApp</p><a href="https://wa.me/${SITE.whatsappHref}" rel="noopener">${SITE.whatsapp}</a></div></li>
${SITE.offices.map((o) => `<li>${icon('pin')}<div><p class="contact-k">${o.city}</p><p>${o.street}<br>${o.zip} ${o.city}</p></div></li>`).join('')}
</ul>
</aside>
</div></section>`;
  const ld = { '@context': 'https://schema.org', '@type': 'ContactPage', name: k.metaTitle, url: SITE_URL + '/contatti/' };
  return page(c, { title: k.metaTitle, desc: k.metaDesc, jsonld: [ORG, ld, crumbs([['Home', ''], ['Contatti', c.path]])] }, 'contatti/', body);
}

function renderPrivacy() {
  const c = ctx('privacy/');
  const p = PRIVACY;
  const body = `${pageHead(c, 'Informativa', p.title, '', 'Privacy')}
<section class="sec sec-white sec-tight"><div class="wrap wrap-narrow prose"><p class="draft">${esc(p.draft)}</p>${p.sections.map((s) => `<h2>${esc(s.h)}</h2>${s.p.map((t) => `<p>${esc(t)}</p>`).join('')}`).join('')}</div></section>`;
  return page(c, { title: p.metaTitle, desc: p.metaDesc, noindex: true }, 'privacy/', body);
}

function render404() {
  const c = ctx('', { absolute: true });
  const body = `<section class="phead phead-center"><div class="wrap"><p class="eyebrow">Errore 404</p><h1 class="h1">Questa pagina non c'è.</h1><p class="lead">Forse è stata spostata. Riparti dalla pagina iniziale o scrivici.</p>
<div class="btn-row btn-row-center"><a class="btn btn-blue" href="${c.href('')}">Torna alla home</a><a class="btn btn-ghost-dark" href="${c.href('contatti/')}">Contatti</a></div></div></section>`;
  return page(c, { title: 'Pagina non trovata — SimplyX', desc: 'La pagina cercata non esiste.', noindex: true }, null, body);
}

// ---- scrittura ----
const pages = [['', renderHome()], ['save/', renderSave()], ['labs/', renderLabs()], ['contatti/', renderContact()], ['privacy/', renderPrivacy()], ...SOLUTIONS.map((s) => [solPath(s.slug), renderSolution(s)])];
for (const [p, html] of pages) {
  mkdirSync(DIST + p, { recursive: true });
  writeFileSync(DIST + p + 'index.html', html);
}
writeFileSync(DIST + '404.html', render404());
const today = new Date().toISOString().slice(0, 10);
writeFileSync(DIST + 'sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(([p]) => p !== 'privacy/').map(([p]) => `<url><loc>${SITE_URL}/${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(DIST + 'robots.txt', NOINDEX ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`Sito generato: ${pages.length + 1} pagine in dist/ (SITE_URL=${SITE_URL}${NOINDEX ? ', NOINDEX' : ''})`);
