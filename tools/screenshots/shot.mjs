// Screenshot one page at desktop and/or phone size and print console errors.
// Serve the folder first, e.g.:  python3 -m http.server 8765 --bind 127.0.0.1  (run inside mocks/)
// usage: node shot.mjs <path-under-server> <out-prefix> [waitMs=2500] [both|d|m]
// env:   BASE=http://127.0.0.1:8765  FULL=1 (full page)  NOMOUSE=1 (do not move the pointer)
//        CHROME=/path/to/chrome (defaults to the cloud sandbox's Chromium)
import { chromium } from 'playwright-core';
const [,, rel, out, waitMs = '2500', mode = 'both'] = process.argv;
const BASE = process.env.BASE || 'http://127.0.0.1:8765';
const exe = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,localhost' } : undefined;
const browser = await chromium.launch({ executablePath: exe, proxy, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const sizes = mode === 'both' ? [['d', 1440, 900], ['m', 390, 844]] : mode === 'm' ? [['m', 390, 844]] : [['d', 1440, 900]];
for (const [tag, w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text().slice(0, 200)); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('requestfailed', r => errs.push('reqfail: ' + r.url().slice(0, 90) + ' ' + (r.failure() && r.failure().errorText)));
  await page.goto(`${BASE}/${rel}`, { waitUntil: 'load' });
  if (!process.env.NOMOUSE) await page.mouse.move(w * 0.62, h * 0.45);
  await page.waitForTimeout(+waitMs);
  if (!process.env.NOMOUSE) await page.mouse.move(w * 0.6, h * 0.5, { steps: 8 });
  await page.waitForTimeout(400);
  errs.push('frames=' + await page.evaluate(() => window.__frames || 0));
  await page.screenshot({ path: `${out}-${tag}.png`, fullPage: !!process.env.FULL });
  console.log(tag, '\n  ' + errs.slice(0, 12).join('\n  '));
  await ctx.close();
}
await browser.close();
