// Screenshot reali desktop e telefono in docs/screens/. Uso: npm run build && npm run shots [pagina...]
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
import { serve } from './serve.mjs';
const ROOT = new URL('..', import.meta.url).pathname;
const OUT = process.env.SHOTS_DIR || ROOT + 'docs/screens/';
const all = { home: '/', 'data-center': '/soluzioni/data-center/', ai: '/soluzioni/intelligenza-artificiale/', automation: '/soluzioni/business-automation/', managed: '/soluzioni/managed-services/', cybersecurity: '/soluzioni/cybersecurity/', energy: '/soluzioni/energy/', labs: '/labs/', save: '/save/', contatti: '/contatti/' };
const want = process.argv.slice(2);
const pages = Object.entries(all).filter(([k]) => !want.length || want.includes(k));
const scale = Number(process.env.SCALE || 1);
const srv = await serve(ROOT + 'dist');
const browser = await chromium.launch();
const profiles = { desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: scale }, mobile: { ...devices['iPhone 14'], ...(process.env.SCALE ? { deviceScaleFactor: scale } : {}) } };
for (const [pname, opts] of Object.entries(profiles)) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  for (const [name, path] of pages) {
    await page.goto(srv.url + path, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${OUT}${name}-${pname}-top.png` });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y); await page.waitForTimeout(120); }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(1100);
    await page.screenshot({ path: `${OUT}${name}-${pname}.png`, fullPage: true });
  }
  if (pname === 'mobile' && (!want.length || want.includes('home'))) {
    await page.goto(srv.url + '/', { waitUntil: 'networkidle' });
    await page.click('[data-burger]'); await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}menu-mobile.png` });
  }
  if (pname === 'desktop' && (!want.length || want.includes('home'))) {
    await page.goto(srv.url + '/', { waitUntil: 'networkidle' });
    await page.click('[data-menu]'); await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}menu-desktop.png` });
  }
  await ctx.close();
}
await browser.close(); srv.close();
console.log('Screenshot salvati in', OUT);
