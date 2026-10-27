// Genera il sito statico in ./dist  (node src/build.mjs)
import { mkdirSync, writeFileSync, cpSync, rmSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HOME, LANGS } from './data.mjs';
import { PORTAL } from './portal-data.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = ROOT + 'dist/';
const SITE_URL = (process.env.SITE_URL || 'https://simplyx.it').replace(/\/$/, '');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const B = '#12B5FB', V = '#A99EFF';
const check = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#12B5FB" stroke-width="2.2" aria-hidden="true" style="flex:none;margin-top:2px"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
const lock = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>';

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(ROOT + 'static', DIST, { recursive: true });
mkdirSync(DIST + 'css', { recursive: true });
mkdirSync(DIST + 'js', { recursive: true });

// file con hash nel nome per una cache lunga
function emit(dir, name, ext, content) {
  const h = createHash('sha256').update(content).digest('hex').slice(0, 10);
  const file = `${name}.${h}.${ext}`;
  writeFileSync(DIST + dir + '/' + file, content);
  return `/${dir}/${file}`;
}
const CSS = emit('css', 'site', 'css', readFileSync(ROOT + 'src/site.css'));
const HOMEJS = emit('js', 'home', 'js', readFileSync(ROOT + 'src/home.js'));
const PORTALJS = emit('js', 'portal', 'js', readFileSync(ROOT + 'src/portal.js'));

function head(lang, title, desc, path, alt) {
  const L = LANGS[lang];
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#02040A">
<link rel="canonical" href="${SITE_URL}${path}">
${Object.keys(alt).map((k) => `<link rel="alternate" hreflang="${k}" href="${SITE_URL}${alt[k]}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${SITE_URL}${alt.it}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE_URL}${path}">
<meta property="og:image" content="${SITE_URL}/img/og-image.jpg">
<meta property="og:locale" content="${L.locale}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preload" href="/fonts/michroma-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${CSS}">
</head>`;
}

function langSwitch(lang, kind) {
  return `<div class="lang" role="group" aria-label="Lingua / Language">${Object.entries(LANGS).map(([k, L]) =>
    `<a href="${L[kind]}" hreflang="${k}" lang="${k}" aria-label="${L.name}"${k === lang ? ' aria-current="true"' : ''} data-keep-view>${L.code}</a>`).join('')}</div>`;
}

const both = (fn, t) => `<div data-view="aziende">${fn(t.az)}</div><div data-view="pmi" hidden>${fn(t.pmi)}</div>`;

function renderHome(lang) {
  const t = HOME[lang], L = LANGS[lang], a = t.a, p = t.p;
  const link = (h) => (h === '@portal' ? L.portal : h);
  const streams = [[7, 6.5, -1], [15, 9, -4], [23, 7.5, -2.5], [31, 11, -6], [41, 8, -3], [58, 10, -7], [67, 7, -.5], [76, 9.5, -5], [85, 6.8, -2], [93, 12, -8]]
    .map(([l, d, dl]) => `<span class="stream" style="left:${l}%;animation-duration:${d}s;animation-delay:${dl}s"></span>`).join('');

  const body = `
<body>
<div class="circuit">
<a class="skip" href="#main">${esc(t.skip)}</a>
<div class="topbar"><div class="wrap"><span><span class="dot pulse"></span>${esc(t.ticker)}</span><span>MILANO — NAPOLI</span></div></div>

<header class="site-header"><div class="wrap">
<a class="logo" href="${L.home}" aria-label="Simplyx"><img src="/img/logo-header.png" width="520" height="129" alt="Simplyx — Innovation. Simplified."></a>
<div class="seg" role="group" aria-label="${esc(t.viewLabel)}">
<button type="button" data-set-view="aziende" aria-pressed="true">${esc(t.segAz)}</button>
<button type="button" data-set-view="pmi" aria-pressed="false">${esc(t.segPmi)}</button>
</div>
<nav class="nav" aria-label="${esc(t.navLabel)}">${both((v) => v.nav.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join(''), t).replace(/<div data-view="(\w+)"( hidden)?>/g, '<span data-view="$1"$2 style="display:contents">').replace(/<\/div>/g, '</span>')}</nav>
<div class="tools">${langSwitch(lang, 'home')}<a class="portal-btn" href="${L.portal}">${lock}${esc(t.login)}</a></div>
</div></header>

<main id="main">
<section id="top" class="hero herofx scan">
<div class="fxlayer" aria-hidden="true">
<div class="dust"></div><div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div>
${streams}
<div class="floor"></div>
<span class="hudtxt" style="left:24px;top:28px">SYS.CORE // v.2026</span>
<span class="hudtxt" style="right:24px;top:28px">NODE MI-01 · NA-01</span>
<span class="hudtxt" style="left:24px;bottom:28px">LAT 40.84 N · 14.25 E</span>
<span class="hudtxt" style="right:24px;bottom:28px">UPLINK ● SECURE</span>
</div>
<div class="wrap hero-inner">
<img class="hero-logo" src="/img/logo-wordmark.png" width="1240" height="308" alt="Simplyx — Innovation. Simplified." fetchpriority="high">
${both((h) => `<div class="eyebrow">${esc(h.eyebrow)}</div>
<h1>${esc(h.title)}</h1>
<p class="sub">${esc(h.sub)}</p>
<div class="ctas"><a class="btn btn-primary" href="${h.c1h}">${esc(h.c1)}</a><a class="btn btn-ghost hud" href="${h.c2h}">${esc(h.c2)}</a></div>`, t)}
</div>
</section>

<section class="kpis" aria-label="${esc(t.kpiLabel)}"><div class="wrap">
${both((h) => `<div style="display:contents">${h.kpis.map(([v, l]) => `<div class="kpi"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('')}</div>`, t).replace(/<div data-view="(\w+)"( hidden)?>/g, '<div data-view="$1"$2 style="display:contents">')}
</div></section>

<div data-view="aziende">
<section class="wrap sec">
<div class="kicker">${esc(a.s1k)}</div>
<h2 class="h2" style="margin-bottom:48px;max-width:900px">${esc(a.s1t)}</h2>
<div class="card hud stack" role="img" aria-label="${esc(a.stackAria)}">
<div class="layers">${a.layers.map(([c, n, tg, col]) => `<div class="layer"><span class="mono" style="font-size:12px;color:${col}">${c}</span><span class="n">${esc(n)}</span><span class="t">${esc(tg)}</span></div>`).join('')}</div>
<div class="legend">
<div><span class="bar" style="background:${B}"></span><div><div class="mono" style="font-size:12px;letter-spacing:.14em;color:${B}">DIGITAL &amp; AI · L4–L5</div><div style="color:var(--muted);margin-top:6px">${esc(a.legD)}</div></div></div>
<div><span class="bar" style="background:#8C7CFF"></span><div><div class="mono" style="font-size:12px;letter-spacing:.14em;color:${V}">${esc(a.infraK)} · L1–L3</div><div style="color:var(--muted);margin-top:6px">${esc(a.legI)}</div></div></div>
</div></div>
</section>

<section class="wrap" style="padding-top:60px;padding-bottom:40px"><div class="grid g-340" style="gap:24px">
<article id="digital" class="card hud pillar"><div class="mono" style="font-size:12px;letter-spacing:.18em;color:${B}">DIGITAL &amp; AI</div><h3>${esc(a.dTitle)}</h3>
<ul>${a.digital.map(([x, s]) => `<li><span>${esc(x)}</span><span>${esc(s)}</span></li>`).join('')}</ul><a href="#prodotti" style="font-weight:600;color:${B}">${esc(a.dMore)}</a></article>
<article id="infra" class="card hud pillar infra"><div class="mono" style="font-size:12px;letter-spacing:.18em;color:${V}">${esc(a.infraK)}</div><h3>${esc(a.iTitle)}</h3>
<ul>${a.infra.map(([x, s]) => `<li><span>${esc(x)}</span><span>${esc(s)}</span></li>`).join('')}</ul><a href="#casi" style="font-weight:600;color:${V}">${esc(a.iMore)}</a></article>
</div></section>

<section class="vlines sec-band"><div class="wrap">
<div class="kicker">${esc(a.s2k)}</div>
<h2 class="h2 pre" style="margin-bottom:18px">${esc(a.s2t)}</h2>
<p class="lead" style="max-width:700px;margin-bottom:52px">${esc(a.s2p)}</p>
<div class="horizon" style="margin-bottom:28px" aria-hidden="true"></div>
<ol class="grid g-170 flow" style="gap:10px">${a.flow.map(([n, x, s, c], i) => `<li style="border:1px solid ${i === 5 ? B : (c === B ? 'rgba(18,181,251,.3)' : 'rgba(140,124,255,.3)')}"><span class="mono" style="font-size:12px;color:${c}">${n}</span><span class="t">${esc(x)}</span><span class="s">${esc(s)}</span></li>`).join('')}</ol>
</div></section>

<section id="prodotti" class="wrap sec">
<div class="kicker">${esc(a.s3k)}</div>
<h2 class="h2 pre" style="margin-bottom:44px">${esc(a.s3t)}</h2>
<div class="grid g-300">${a.products.map(([k, st, x, s, cta]) => `<article class="card hud prod"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="tag">${esc(k)}</span><span class="badge">${esc(st)}</span></div><h3>${esc(x)}</h3><p>${esc(s)}</p><a href="#contatti">${esc(cta)}</a></article>`).join('')}</div>
</section>

<section id="casi" class="wrap sec" style="padding-top:80px">
<div class="kicker">${esc(a.s4k)}</div>
<h2 class="h2" style="margin-bottom:44px">${esc(a.s4t)}</h2>
<div class="grid g-300" style="gap:24px">${a.cases.map(([tag, c]) => `<article class="case" style="border-top:2px solid ${c}"><span class="mono" style="font-size:12px;color:${c}">${esc(tag)}</span><span class="r">${esc(t.result)}</span><span style="font-size:17px;color:var(--soft)">${esc(t.client)} — ${esc(t.summary)}</span><a href="#contatti" style="font-weight:600">${esc(t.readCase)}</a></article>`).join('')}</div>
</section>
</div>

<div data-view="pmi" hidden>
<section id="settori" class="wrap sec">
<div class="kicker">${esc(p.s1k)}</div>
<h2 class="h2" style="margin-bottom:44px">${esc(p.s1t)}</h2>
<div class="grid g-220" style="gap:14px">${p.sectors.map(([n, x, s]) => `<a href="#pacchetti" class="card hud sector"><span class="tag">${n}</span><span class="t">${esc(x)}</span><span class="s">${esc(s)}</span><span class="go">${esc(t.discover)}</span></a>`).join('')}</div>
</section>

<section id="pacchetti" class="vlines sec-band"><div class="wrap">
<div class="kicker">${esc(p.s2k)}</div>
<h2 class="h2" style="margin-bottom:14px">${esc(p.s2t)}</h2>
<p class="lead" style="margin-bottom:48px">${esc(p.s2p)}</p>
<div class="grid g-300" style="gap:18px">${p.plans.map((pl) => `<article class="card hud plan${pl.hi ? ' hi' : ''}">
<div style="display:flex;justify-content:space-between;align-items:center"><span class="name">${esc(pl.n)}</span>${pl.badge ? `<span class="pbadge">${esc(pl.badge)}</span>` : ''}</div>
<p style="color:var(--muted);min-height:48px">${esc(pl.d)}</p>
<div style="display:flex;align-items:baseline;gap:8px"><span class="price">${esc(pl.price)}</span><span style="color:var(--dim);font-size:14px">${esc(t.perMonth)}</span></div>
<ul style="display:flex;flex-direction:column;gap:12px">${pl.f.map((f) => `<li>${check}${esc(f)}</li>`).join('')}</ul>
<a class="btn ${pl.hi ? 'btn-primary' : 'btn-ghost'} cta" href="${L.portal}">${esc(t.activate)}</a></article>`).join('')}</div>
<p class="mono" style="margin-top:22px;font-size:14px;color:var(--dim)">${esc(p.payNote)}</p>
</div></section>

<section id="come" class="wrap sec">
<div class="kicker">${esc(p.s3k)}</div>
<h2 class="h2" style="margin-bottom:44px">${esc(p.s3t)}</h2>
<ol class="grid g-260" style="gap:18px">${p.steps.map(([n, x, s]) => `<li class="step"><span class="n">${n}</span><span class="t">${esc(x)}</span><span class="s">${esc(s)}</span></li>`).join('')}</ol>
</section>

<section class="wrap sec" style="padding-top:80px">
<div class="card hud" style="padding:40px;display:flex;flex-wrap:wrap;gap:36px">
<div style="flex:1 1 380px;min-width:0"><div class="kicker">${esc(p.s4k)}</div><h2 class="h2" style="font-size:clamp(22px,2.6vw,34px);line-height:1.3;margin-bottom:16px">${esc(p.s4t)}</h2><p class="lead" style="font-size:17px">${esc(p.s4p)}</p></div>
<ul class="grid g-2" style="flex:1 1 360px;gap:12px">${p.trust.map(([k, v]) => `<li class="info"><div class="k">${esc(k)}</div><div style="font-size:15px">${esc(v)}</div></li>`).join('')}</ul>
</div>
<div class="grid g-300" style="gap:18px;margin-top:18px">${p.quotes.map((q) => `<figure class="quote"><blockquote>${esc(t.review)}</blockquote><figcaption>${esc(q)}</figcaption></figure>`).join('')}</div>
</section>
</div>

<section class="wrap" style="padding-top:80px;padding-bottom:80px">
<div class="vlines hud panel">
<div><div class="kicker">${esc(t.portalK)}</div><h2 class="h2 pre" style="font-size:clamp(22px,2.6vw,34px);line-height:1.3;margin-bottom:16px">${esc(t.portalT)}</h2><p class="lead" style="font-size:17px;margin-bottom:28px">${esc(t.portalP)}</p><a class="btn btn-primary" href="${L.portal}">${esc(t.portalCta)}</a></div>
<ul class="grid g-2" style="gap:12px">${t.portalItems.map((i) => `<li class="info"><div class="k">${esc(i.k)}</div><div style="font-size:15px">${esc(i.v)}</div></li>`).join('')}</ul>
</div>
</section>

<section id="contatti" class="vlines contact" style="border-top:1px solid var(--line)">
<div class="horizon" aria-hidden="true"></div>
<div class="wrap">
${both((h) => `<div style="display:flex;flex-wrap:wrap;gap:44px;justify-content:space-between;align-items:flex-end;width:100%">
<div style="flex:1 1 520px;min-width:0"><div class="kicker">${esc(h.ctaK)}</div><h2 style="font-family:var(--display);font-weight:400;font-size:clamp(28px,4vw,54px);line-height:1.15">${esc(h.ctaT)}</h2>
<p class="lead" style="margin-top:20px">Milano · Napoli — <a href="mailto:[email@simplyx.it]">[email@simplyx.it]</a> — [+39 000 000 0000]</p></div>
<div style="display:flex;flex-wrap:wrap;gap:14px"><a class="btn btn-primary" href="${h.c1h}">${esc(h.ctaA)}</a><a class="btn btn-ghost hud" href="mailto:[email@simplyx.it]">${esc(h.ctaB)}</a></div></div>`, t).replace(/<div data-view="(\w+)"( hidden)?>/g, '<div data-view="$1"$2 style="width:100%">')}
</div>
</section>
</main>

<footer class="site-footer">
<div class="wrap cols">
<div class="col" style="gap:16px"><img src="/img/logo-header.png" width="200" height="50" alt="Simplyx" style="height:auto"><span class="pre" style="color:var(--dim);line-height:1.6">${esc(t.footTag)}</span></div>
${t.footCols.map((c) => `<div class="col"><span class="h">${esc(c.h)}</span>${c.l.map(([x, h]) => `<a href="${link(h)}">${esc(x)}</a>`).join('')}</div>`).join('')}
</div>
<div class="wrap legal"><span>© 2026 Simplyx · P.IVA [00000000000]</span><span>${esc(t.legal)}</span></div>
</footer>
</div>
<script src="${HOMEJS}" defer></script>
</body>
</html>`;
  const alt = { it: LANGS.it.home, en: LANGS.en.home };
  return head(lang, t.metaTitle, t.metaDesc, L.home, alt) + body;
}

function renderPortal(lang) {
  const t = PORTAL[lang], L = LANGS[lang];
  const alt = { it: LANGS.it.portal, en: LANGS.en.portal };
  const streams = [[10, 7, -2], [27, 10, -5], [49, 8, -1], [71, 11, -7], [88, 6.5, -3]]
    .map(([l, d, dl]) => `<span class="stream" style="left:${l}%;animation-duration:${d}s;animation-delay:${dl}s"></span>`).join('');
  const data = JSON.stringify({ lang, t, home: L.home }).replace(/</g, '\\u003c');
  return head(lang, t.metaTitle, t.loginList.join('. '), L.portal, alt).replace('<head>', '<head>\n<meta name="robots" content="noindex">') + `
<body>
<div class="circuit" style="min-height:100vh">
<section id="login" class="login">
<div class="login-art herofx">
<div class="fxlayer" aria-hidden="true"><div class="ring r1" style="width:720px;height:720px;top:42%"></div><div class="ring r2" style="width:500px;height:500px;top:42%"></div>${streams}<div class="floor" style="height:22%;opacity:.5"></div></div>
<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><a href="${L.home}" aria-label="${esc(t.backSite)}"><img src="/img/logo-header.png" width="520" height="129" alt="Simplyx — Innovation. Simplified." style="height:52px;width:auto;display:block"></a>${langSwitch(lang, 'portal')}</div>
<div><div class="kicker" style="letter-spacing:.2em;margin-bottom:22px">${esc(t.loginK)}</div><h1>${esc(t.loginT)}</h1>
<ul style="margin-top:36px;display:flex;flex-direction:column;gap:14px;color:var(--muted);font-size:16px">${t.loginList.map((x) => `<li style="display:flex;gap:12px;align-items:center"><span style="width:6px;height:6px;background:var(--blue);flex:none"></span>${esc(x)}</li>`).join('')}</ul></div>
<div class="mono" style="display:flex;align-items:center;font-size:12px;letter-spacing:.1em;color:var(--dim)"><span class="dot pulse"></span>${esc(t.secure)}</div>
</div>
<div class="login-form-wrap">
<form class="form hud" id="loginForm" aria-labelledby="signInT" novalidate>
<div><h2 id="signInT" style="font-family:var(--display);font-weight:400;font-size:24px;margin-bottom:8px">${esc(t.signIn)}</h2><p style="color:var(--dim);font-size:15px">${esc(t.signInSub)}</p></div>
<div class="field"><label class="label" for="em">EMAIL</label><input class="input" id="em" type="email" placeholder="${esc(t.emailPh)}" autocomplete="off"></div>
<div class="field"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><label class="label" for="pw">PASSWORD</label><a href="#" style="font-size:14px">${esc(t.forgot)}</a></div><input class="input" id="pw" type="password" placeholder="••••••••••" autocomplete="off"></div>
<label class="check"><input type="checkbox">${esc(t.remember)}</label>
<button class="btn btn-primary" type="submit">${esc(t.signInBtn)}</button>
<div class="divider">${esc(t.or)}</div>
<button class="btn btn-ghost" type="button" data-login>${esc(t.sso)}</button>
<p style="color:var(--dim);font-size:14px">${esc(t.noAcc)} <a href="${L.home}">${esc(t.noAccLink)}</a></p>
</form>
</div>
</section>
<div id="app" hidden></div>
</div>
<script type="application/json" id="portal-data">${data}</script>
<script src="${PORTALJS}" defer></script>
</body>
</html>`;
}

for (const lang of Object.keys(LANGS)) {
  const L = LANGS[lang];
  mkdirSync(DIST + L.home, { recursive: true });
  writeFileSync(DIST + L.home + 'index.html', renderHome(lang));
  mkdirSync(DIST + L.portal, { recursive: true });
  writeFileSync(DIST + L.portal + 'index.html', renderPortal(lang));
}

writeFileSync(DIST + '404.html', head('it', 'Pagina non trovata — Simplyx', 'Pagina non trovata', '/404', { it: '/', en: '/en/' }) + `
<body><div class="circuit herofx" style="min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px">
<div style="position:relative;z-index:1"><img src="/img/logo-header.png" width="520" height="129" alt="Simplyx" style="width:260px;height:auto"><p class="kicker" style="margin-top:40px">// ERROR 404</p>
<h1 style="font-family:var(--display);font-weight:400;font-size:clamp(24px,4vw,40px);margin:12px 0 28px">Pagina non trovata · Page not found</h1>
<a class="btn btn-primary" href="/">Torna alla home</a> <a class="btn btn-ghost" href="/en/">Go to home</a></div></div></body></html>`);

writeFileSync(DIST + 'robots.txt', process.env.NOINDEX === '1' ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nDisallow: /area-clienti/\nDisallow: /en/client-area/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
writeFileSync(DIST + 'sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${['it', 'en'].map((l) => `<url><loc>${SITE_URL}${LANGS[l].home}</loc><xhtml:link rel="alternate" hreflang="it" href="${SITE_URL}/"/><xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en/"/></url>`).join('\n')}\n</urlset>\n`);
console.log('Build OK →', DIST, '| SITE_URL =', SITE_URL, '| NOINDEX =', process.env.NOINDEX === '1');
