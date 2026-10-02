// Make 1440x900 JPEG thumbnails for a round's gallery, retrying when Google Fonts fail to load.
// usage: node thumbs.mjs <round-dir> <name[:waitMs[:hash]]> ...
//   e.g. node thumbs.mjs r01-concepts 01-monomer:6000 05-latent:2500:emblem
//   a third part starting with '?' is a query string instead: 04-auction:4000:?lot=8&still
//   heavy scenes: FRAMES=2 waits for that many rendered frames (window.__frames); screenshots may take minutes
// Writes to mocks/<round-dir>/thumbs/<name>.jpg. Serve mocks/ on BASE first (see shot.mjs).
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
const [,, round, ...list] = process.argv;
const BASE = process.env.BASE || 'http://127.0.0.1:8765';
const outDir = fileURLToPath(new URL(`../../mocks/${round}/thumbs/`, import.meta.url));
const exe = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,localhost' } : undefined;
const browser = await chromium.launch({ executablePath: exe, proxy, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const item of list) {
  const [file, wait = '2500', hash = ''] = item.split(':');
  for (let attempt = 0; attempt < 4; attempt++) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
    const page = await ctx.newPage(); let fontFail = false;
    page.on('requestfailed', r => { if (/fonts\.(googleapis|gstatic)/.test(r.url())) fontFail = true; });
    const suffix = !hash ? '' : hash.startsWith('?') ? hash : '#' + hash;
    await page.goto(`${BASE}/${round}/${file}.html${suffix}`, { waitUntil: 'load', timeout: 60000 }).catch(() => fontFail = true);
    await page.waitForTimeout(+wait);
    if (process.env.FRAMES) await page.waitForFunction(n => (window.__frames || 0) >= n, +process.env.FRAMES, { timeout: 240000 }).catch(() => {});
    if (fontFail && attempt < 3) { await ctx.close(); continue; }
    await page.screenshot({ path: `${outDir}${file}.jpg`, type: 'jpeg', quality: 78, timeout: 180000 });
    console.log(file, 'ok', fontFail ? '(font fallback)' : '');
    await ctx.close(); break;
  }
}
await browser.close();
