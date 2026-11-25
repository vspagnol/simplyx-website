// Controlli automatici del sito generato. Uso: npm run build && npm test
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { serve } from './serve.mjs';
const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const ROOT = new URL('..', import.meta.url).pathname;
const DIST = ROOT + 'dist/';

const pages = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = d + f; if (statSync(p).isDirectory()) walk(p + '/'); else if (f === 'index.html') pages.push('/' + d.slice(DIST.length)); } })(DIST);
pages.sort();

let pass = 0; const fails = [];
const check = (ok, name, detail = '') => { if (ok) pass++; else fails.push(`${name}${detail ? ' — ' + detail : ''}`); };

const srv = await serve(DIST);
const browser = await chromium.launch();
const sizes = { 'telefono 390': { ...devices['iPhone 14'], deviceScaleFactor: 1 }, 'tablet 768': { viewport: { width: 768, height: 1024 } }, 'desktop 1440': { viewport: { width: 1440, height: 900 } } };
const links = new Set();

for (const [label, opts] of Object.entries(sizes)) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  for (const path of pages) {
    const tag = `[${label}] ${path}`;
    errors.length = 0;
    const res = await page.goto(srv.url + path, { waitUntil: 'networkidle' });
    check(res.status() === 200, `${tag} risponde 200`);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 600) { await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y); await page.waitForTimeout(40); }
    await page.waitForTimeout(label.startsWith('desktop') ? 1300 : 300);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
      title: document.title, desc: document.querySelector('meta[name=description]')?.content || '',
      lang: document.documentElement.lang, canonical: !!document.querySelector('link[rel=canonical]'),
      noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
      broken: [...document.images].filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
      hidden: [...document.querySelectorAll('.reveal')].filter((e) => !e.classList.contains('in')).length,
      hrefs: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      abs: [...document.querySelectorAll('a[href]')].map((a) => a.href),
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return true; } catch { return false; } })
    }));
    check(info.overflow <= 0, `${tag} nessuno scorrimento orizzontale`, `${info.overflow}px`);
    check(info.h1 === 1, `${tag} un solo h1`, String(info.h1));
    check(info.noAlt === 0, `${tag} immagini con testo alternativo`, String(info.noAlt));
    check(info.broken.length === 0, `${tag} immagini caricate`, info.broken.join(', '));
    check(info.hidden === 0, `${tag} tutti i blocchi compaiono allo scorrimento`, String(info.hidden));
    check(errors.length === 0, `${tag} nessun errore in console o di rete`, errors.join(' | '));
    if (label.startsWith('desktop')) {
      check(info.title.length >= 20 && info.title.length <= 75, `${tag} titolo SEO`, `${info.title.length} caratteri`);
      check(info.desc.length >= 80 && info.desc.length <= 185, `${tag} descrizione SEO`, `${info.desc.length} caratteri`);
      check(info.lang === 'it' && info.canonical, `${tag} lingua e canonical`);
      check(info.ld.every(Boolean), `${tag} dati strutturati validi`);
      info.abs.filter((u) => u.startsWith(srv.url)).forEach((u) => links.add(u.split('#')[0].split('?')[0]));
      await page.evaluate(AXE);
      const axe = await page.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] }));
      check(axe.violations.length === 0, `${tag} accessibilità (axe, WCAG A/AA)`, axe.violations.map((v) => `${v.id} ×${v.nodes.length}`).join(', '));
    }
  }
  // menu
  await page.goto(srv.url + '/', { waitUntil: 'networkidle' });
  if (label.startsWith('desktop')) {
    await page.click('[data-menu]');
    check(await page.isVisible('#menu-soluzioni'), `[${label}] il menu Soluzioni si apre`);
    await page.keyboard.press('Escape');
    check(!(await page.isVisible('#menu-soluzioni')), `[${label}] Esc chiude il menu`);
    await page.click('[data-menu]');
    await page.click('#menu-soluzioni a[href*="cybersecurity"]');
    await page.waitForURL('**/soluzioni/cybersecurity/');
    check(true, `[${label}] dal menu si arriva a Cybersecurity`);
  } else {
    await page.click('[data-burger]');
    check(await page.isVisible('#menu-mobile'), `[${label}] il menu mobile si apre`);
    await page.click('#menu-mobile a[href*="energy"]');
    await page.waitForURL('**/soluzioni/energy/');
    check(true, `[${label}] dal menu mobile si arriva a Energy`);
  }
  // SimplyX Notoria: l'animazione disegna la scritta e la pagina porta al sito del servizio
  await page.goto(srv.url + '/notoria/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  const noto = await page.evaluate(() => { const b = document.querySelector('[data-noto]'), cv = b.querySelector('canvas'), d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 40) n++; const r = cv.getBoundingClientRect(); return { n, dentro: r.left >= 0 && r.right <= innerWidth + 1, link: [...document.querySelectorAll('a[href="https://notoria-ai.com"]')].length }; });
  check(noto.n > 800, `[${label}] l'animazione di Notoria disegna i puntini`, String(noto.n));
  check(noto.dentro, `[${label}] l'animazione di Notoria resta dentro lo schermo`);
  check(noto.link >= 2, `[${label}] la pagina Notoria porta a notoria-ai.com`);
  const integ = await page.evaluate(() => ({ loghi: [...document.querySelectorAll('.ovali img')].map((i) => { i.loading = 'eager'; return !!(i.alt || i.parentNode.textContent.trim()); }), schemi: [...document.querySelectorAll('.flusso')].map((f) => [f.querySelectorAll('.fili path').length, [...f.querySelectorAll('.nodo,.chips li,.verso,.rit')].filter((e) => { const r = e.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).length, (f.getAttribute('aria-label') || '').length > 40]), link: document.querySelectorAll('a[href="https://notoria-ai.com/aziende/"]').length, testo: document.querySelector('main').textContent }));
  check(integ.loghi.length === 9 && integ.loghi.every(Boolean), `[${label}] Notoria: nove loghi con il loro nome`, String(integ.loghi.length));
  check(integ.schemi.length === 2 && integ.schemi[0][0] === 6 && integ.schemi[1][0] === 1 && integ.schemi.every((x) => x[1] === 0 && x[2]), `[${label}] Notoria: i due schemi sono disegnati, dentro lo schermo e descritti`, JSON.stringify(integ.schemi));
  check(integ.link === 1 && !/partner|certificat/i.test(integ.testo), `[${label}] Notoria: link alla pagina aziende e nessuna parola da evitare`);
  await page.goto(srv.url + '/contatti/?tema=notoria', { waitUntil: 'networkidle' });
  check((await page.inputValue('#f-tema')) === 'notoria', `[${label}] il tema Notoria arriva già selezionato`);
  // SimplyX Save: schema dei costi e collegamento a Risparmia AI
  await page.goto(srv.url + '/save/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const sv = await page.evaluate(() => { const f = document.querySelector('#risparmia .flusso'); return { fili: f.querySelectorAll('.fili path').length, fuori: [...f.querySelectorAll('.nodo,.rit')].filter((e) => { const r = e.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).length, alt: (f.getAttribute('aria-label') || '').length > 40, link: document.querySelectorAll('a[href="https://risparmia-ai.com/aziende/"]').length, testo: document.querySelector('#risparmia').textContent }; });
  check(sv.fili === 9 && sv.fuori === 0 && sv.alt, `[${label}] Save: lo schema dei costi è disegnato, dentro lo schermo e descritto`, JSON.stringify([sv.fili, sv.fuori]));
  check(sv.link === 1 && !/\d\s?%|garanti/i.test(sv.testo), `[${label}] Save: link a Risparmia AI e nessuna percentuale promessa`);
  await page.goto(srv.url + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const hr = await page.evaluate(() => { const f = document.querySelector('#risparmia .flusso'); return f ? [f.querySelectorAll('.fili path').length, document.querySelectorAll('#risparmia a[href="https://risparmia-ai.com/aziende/"]').length] : null; });
  const hn = await page.evaluate(() => { const f = document.querySelector('#notoria .flusso'); return f ? [f.querySelectorAll('.fili path').length, [...f.querySelectorAll('.nodo,.rit')].filter((e) => { const r = e.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).length, document.querySelectorAll('#notoria a[href$="notoria/#integrazioni"]').length] : null; });
  check(hn && hn[0] === 6 && hn[1] === 0 && hn[2] === 1, `[${label}] home: integrazioni di Notoria con lo schema e il link`, JSON.stringify(hn));
  check(hr && hr[0] === 9 && hr[1] === 1, `[${label}] home: sezione Risparmia AI con lo schema e il link`, JSON.stringify(hr));
  // modulo contatti
  await page.goto(srv.url + '/contatti/?tema=cybersecurity', { waitUntil: 'networkidle' });
  check((await page.inputValue('#f-tema')) === 'cybersecurity', `[${label}] il tema arriva già selezionato`);
  await page.evaluate(() => document.querySelector('[data-contact]').setAttribute('data-no-open', ''));
  await page.click('[data-contact] button[data-via=email]');
  check(await page.isVisible('.form-err'), `[${label}] modulo vuoto: messaggio di errore`);
  await page.fill('#f-nome', 'Mario Rossi'); await page.fill('#f-msg', 'Vorrei un incontro.');
  await page.click('[data-contact] button[data-via=wa]');
  const wa = await page.getAttribute('[data-contact]', 'data-mailto');
  check(!!wa && wa.startsWith('https://wa.me/393755454980?text=') && decodeURIComponent(wa).includes('Mario Rossi'), `[${label}] il modulo prepara il messaggio WhatsApp`);
  await page.click('[data-contact] button[data-via=email]');
  const mailto = await page.getAttribute('[data-contact]', 'data-mailto');
  check(!!mailto && mailto.startsWith('mailto:info@simplyx.it?subject=') && decodeURIComponent(mailto).includes('Mario Rossi') && decodeURIComponent(mailto).includes('Cybersecurity'), `[${label}] il modulo prepara l'email corretta`);
  check(await page.isVisible('.form-ok'), `[${label}] conferma visibile dopo l'invio`);
  // Simplyx Sales: zona riservata. La password non sta nei test: l'accesso vero si prova solo con SALES_USER e SALES_PASS nell'ambiente.
  await page.goto(srv.url + '/sales/', { waitUntil: 'networkidle' });
  await page.fill('#u', 'sales'); await page.fill('#p', 'password-sbagliata-di-prova');
  await page.click('#accesso button');
  await page.waitForSelector('#err:not([hidden])');
  check((await page.isHidden('#app')) && (await page.isHidden('#nav')), `[${label}] Sales: con la password sbagliata non si entra`);
  if (process.env.SALES_USER && process.env.SALES_PASS) {
    await page.fill('#u', process.env.SALES_USER); await page.fill('#p', process.env.SALES_PASS);
    await page.click('#accesso button');
    await page.waitForSelector('#app .vista');
    check((await page.locator('#nav a').count()) === 6 && (await page.locator('h1').count()) === 1, `[${label}] Sales: dopo l'accesso compaiono le sei sezioni`);
    await page.click('#nav a[href="#notoria"]'); await page.click('[data-scheda=presenta]');
    check((await page.locator('.copione').count()) === 2 && (await page.textContent('#app')).includes('30 secondi'), `[${label}] Sales: presentazione di Notoria da 30 secondi e 2 minuti`);
    await page.click('#nav a[href="#simplyx"]'); await page.click('[data-scheda=breve]');
    check((await page.textContent('#app')).includes('Impianti elettrici e meccanici'), `[${label}] Sales: Simplyx comprende impianti elettrici e meccanici`);
    const so = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(so <= 0, `[${label}] Sales: nessuno scorrimento orizzontale dopo l'accesso`, `${so}px`);
    if (label.startsWith('desktop')) { await page.evaluate(AXE); const ax = await page.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })); check(ax.violations.length === 0, `[${label}] Sales: accessibilità dopo l'accesso`, ax.violations.map((v) => `${v.id} ×${v.nodes.length}`).join(', ')); }
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForSelector('#app .vista');
    check(await page.isVisible('#esci'), `[${label}] Sales: ricaricando la pagina si resta dentro`);
    await page.click('#esci'); await page.waitForSelector('#accesso');
    check(await page.isHidden('#app'), `[${label}] Sales: «Esci» riporta alla richiesta di password`);
  }
  await ctx.close();
}

// collegamenti interni e pagina 404
const ctx = await browser.newContext();
for (const u of links) { const r = await ctx.request.get(u); check(r.status() === 200, `collegamento interno ${u.replace(srv.url, '')}`, String(r.status())); }
// Simplyx Sales: sul sito arrivano solo testi cifrati, e nessuna pagina pubblica porta lì
const salesFiles = ['index.html', 'sales.js', 'sales.css', 'contenuti.enc.json'].map((f) => readFileSync(DIST + 'sales/' + f, 'utf8')).join('\n');
check(!/taci|anteprima gratuita|Controllo gratuito|100 €|provvigion/i.test(salesFiles) && !/simplyx['"]?\s*[,;)]?\s*\/\/ ?password/i.test(salesFiles), 'Sales: nessun testo riservato in chiaro nei file pubblicati');
check(!readFileSync(DIST + 'sitemap.xml', 'utf8').includes('/sales') && !readFileSync(DIST + 'robots.txt', 'utf8').includes('sales') && !pages.filter((p) => p !== '/sales/').some((p) => /href="[^"]*\/?sales\//.test(readFileSync(DIST + p.slice(1) + 'index.html', 'utf8'))), 'Sales: fuori da mappa e robots, nessun collegamento dalle pagine pubbliche');
check(readFileSync(DIST + 'sales/index.html', 'utf8').includes('noindex, nofollow'), 'Sales: pagina non indicizzabile');
const nf = await ctx.request.get(srv.url + '/non-esiste/');
check(nf.status() === 404 && (await nf.text()).includes('Questa pagina non'), 'pagina 404 personalizzata');
for (const f of ['sitemap.xml', 'robots.txt']) check((await ctx.request.get(srv.url + '/' + f)).status() === 200, `${f} presente`);
// senza JavaScript il contenuto resta visibile
const nojs = await browser.newContext({ javaScriptEnabled: false });
const p2 = await nojs.newPage(); await p2.goto(srv.url + '/');
check(await p2.evaluate(() => getComputedStyle(document.querySelector('.reveal')).opacity === '1'), 'senza JavaScript il contenuto è visibile');
// animazioni ridotte
const rm = await browser.newContext({ reducedMotion: 'reduce' });
const p3 = await rm.newPage(); await p3.goto(srv.url + '/');
check(await p3.evaluate(() => [...document.querySelectorAll('.reveal')].every((e) => e.classList.contains('in'))), 'con animazioni ridotte tutto è subito visibile');

await browser.close(); srv.close();
console.log(`\n${pages.length} pagine × ${Object.keys(sizes).length} formati — ${pass} controlli superati, ${fails.length} falliti`);
if (fails.length) { console.log(fails.map((f) => '  ✗ ' + f).join('\n')); process.exit(1); }
