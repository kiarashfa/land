// Project-page content for the Round 04 mocks: placeholder copy for one demo project (Xefy),
// five stand-in "screenshots" drawn on canvas, the shared sections, the gallery lightbox and the loading veil.
// The copy is invented for layout only; Kia will supply the real stories and challenges.
import { PROJECTS, FAMILIES, fmtDate } from './_data.js';
import { FUSE, nameHTML, rootsText } from './_home.js';

export const pick = () => { const s = new URLSearchParams(location.search).get('p'); return PROJECTS.find(p => p.slug === s) || PROJECTS.find(p => p.slug === 'xefy'); };
export const familyName = p => FAMILIES.find(f => f.id === p.family).name;
export const siteURL = p => `https://kiarashfa.github.io/${p.slug === 'website' ? 'website' : p.name}/`;

const DEMO = {
  xefy: {
    idea: 'A recipe book that does its own arithmetic. Change the servings, the units or the size of the tin, and every quantity, every nutrition figure and every timing on the page is worked out again from the ingredients themselves.',
    story: ['It began with a loaf that never rose: a recipe scaled up by hand, one number missed. Xefy treats a recipe as data rather than prose, so that nothing is ever typed twice and nothing can quietly disagree with anything else.',
      'The name is a small joke in two languages: xef is how Catalan spells chef, and the y makes it a place, the way a bakery is a place.'],
    challenges: [
      ['Every number is derived', 'Quantities, nutrition and timings all come from one source of truth per recipe. Change one thing and the page recomputes, so the recipe can never contradict itself.'],
      ['Scaling that respects cooking', 'Eggs do not come in 0.37s and a cake does not bake twice as long in a tin twice as big. Each ingredient carries its own rounding and each step its own rule for time.'],
      ['Nutrition from first principles', 'Figures are summed from ingredient data, with losses for trimming and cooking, never copied from a label.'],
      ['A kitchen-proof page', 'Large type, step-by-step mode with timers, and a layout that works on a phone propped against a flour jar.'],
    ],
    special: 'It is the encyclopedia where the numbers are the point: you can trust them because none of them was typed.',
    stack: 'Plain HTML, CSS and JavaScript · computed at build and in the browser · no account, no ads',
  },
};
export function copy(p){
  if (DEMO[p.slug]) return DEMO[p.slug];
  return { idea: p.line, story: ['Placeholder: the story of this project will come from Kia. This paragraph only shows how much room a short story takes on the page.'],
    challenges: [['A first challenge', 'Placeholder text describing a problem Kia chose to explore and what made it hard.'], ['A second challenge', 'Placeholder text, two or three lines long, so the layout can be judged with real proportions.'], ['A third challenge', 'Placeholder text for the last challenge.']],
    special: 'Placeholder: what makes this project special to Kia.', stack: 'Placeholder' };
}

// ---------- the standard sections ----------
export function headHTML(p){
  return `<div class="kick">${familyName(p)}${p.flagship ? ' · Flagship' : ''} · since ${fmtDate(p.started)}</div>
  <h1 class="pname">${nameHTML(p)}</h1><div class="roots">${rootsText(p)}</div>
  <p class="lede">${p.line}</p>
  <div class="ctas"><a class="btn primary" href="${siteURL(p)}" target="_blank" rel="noopener">Open ${p.name} ↗</a><a class="btn" href="https://github.com/kiarashfa/${p.name}" target="_blank" rel="noopener">Source</a></div>`;
}
export function bodyHTML(p, { gallery = true } = {}){
  const c = copy(p);
  return `<section class="sec"><h2>The idea</h2><p>${c.idea}</p></section>
  <section class="sec"><h2>The story</h2>${c.story.map(s => `<p>${s}</p>`).join('')}</section>
  <section class="sec"><h2>The challenges</h2><ol class="chal">${c.challenges.map(([t, d], i) => `<li><span class="n">${['I', 'II', 'III', 'IV', 'V', 'VI'][i]}</span><div><b>${t}</b><span>${d}</span></div></li>`).join('')}</ol></section>
  ${gallery ? `<section class="sec"><h2>Gallery</h2><div class="gal" data-gal></div></section>` : ''}
  <section class="sec"><h2>In short</h2><dl class="facts"><dt>Made for</dt><dd>${p.for ? 'Those ' + p.for.replace(/^those /, '') : 'Anyone curious'}</dd><dt>Special</dt><dd>${c.special}</dd><dt>Built with</dt><dd>${c.stack}</dd><dt>Since</dt><dd>${fmtDate(p.started)}</dd></dl></section>
  <p class="note">Placeholder copy and screens for layout only; the real story, challenges and screenshots come from Kia.</p>`;
}

// ---------- five stand-in screenshots, drawn on canvas ----------
const LIGHT = new Set(['xefy', 'markey']);
const TXT = {
  xefy: { title: 'Roast chicken, lemon & rosemary', items: ['Whole chicken · 1.6 kg', 'Lemons · 2', 'Rosemary · 4 sprigs', 'Garlic · 1 head', 'Olive oil · 30 ml', 'Sea salt · 9 g'],
    table: [['Energy', '612 kcal', .62], ['Protein', '48 g', .8], ['Fat', '41 g', .55], ['Carbohydrate', '6 g', .1], ['Fibre', '1.4 g', .12], ['Salt', '2.2 g', .37]],
    steps: [['Bring to room temperature', 0, 30], ['Heat the oven', 10, 20], ['Season and stuff', 30, 10], ['Roast', 40, 80], ['Rest', 120, 15], ['Carve', 135, 8]],
    cards: ['Roast chicken', 'Lemon tart', 'Focaccia', 'Risotto bianco', 'Tarte tatin', 'Gazpacho'] },
};
function rr(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function shot(p, kind){
  const W = 1200, H = 750, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const light = LIGHT.has(p.slug), bg = light ? '#f7f3ec' : '#0f1012', ink = light ? '#1d1a16' : '#ecebe8', mute = light ? '#8a8378' : '#8d9096', line = light ? '#e4ddd1' : '#26282c', card = light ? '#ffffff' : '#17181b', acc = p.color;
  const t = TXT[p.slug] || { title: p.name, items: ['First item', 'Second item', 'Third item', 'Fourth item', 'Fifth item', 'Sixth item'], table: [['One', '62%', .62], ['Two', '80%', .8], ['Three', '55%', .55], ['Four', '10%', .1], ['Five', '12%', .12], ['Six', '37%', .37]],
    steps: [['Step one', 0, 30], ['Step two', 10, 20], ['Step three', 30, 10], ['Step four', 40, 80], ['Step five', 120, 15], ['Step six', 135, 8]], cards: ['Entry', 'Entry', 'Entry', 'Entry', 'Entry', 'Entry'] };
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  // app bar
  c.fillStyle = acc; rr(c, 40, 28, 34, 34, 8); c.fill(); c.fillStyle = ink; c.font = '600 22px Georgia, serif'; c.fillText(p.name, 88, 53);
  c.fillStyle = mute; c.font = '15px system-ui, sans-serif'; ['Browse', 'Search', 'About'].forEach((s, i) => c.fillText(s, W - 300 + i * 90, 52));
  c.fillStyle = line; c.fillRect(40, 84, W - 80, 1);
  const sans = (sz, w = 400) => `${w} ${sz}px system-ui, -apple-system, Segoe UI, sans-serif`;
  if (kind === 0) { // a recipe/entry page
    const g = c.createLinearGradient(40, 120, 640, 700); g.addColorStop(0, light ? '#e9b27c' : '#2a2d33'); g.addColorStop(.55, acc); g.addColorStop(1, light ? '#5e2a17' : '#0b0c0e');
    c.fillStyle = g; rr(c, 40, 120, 600, 590, 14); c.fill();
    c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.ellipse(340, 430, 190, 120, -.2, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.ellipse(300, 400, 80, 40, -.3, 0, 7); c.fill();
    c.fillStyle = ink; c.font = '600 40px Georgia, serif'; const words = t.title.split(' '); let line1 = '', y = 170; words.forEach(w => { if (c.measureText(line1 + w).width > 480) { c.fillText(line1, 680, y); y += 48; line1 = ''; } line1 += w + ' '; }); c.fillText(line1, 680, y);
    c.fillStyle = mute; c.font = sans(15); c.fillText('SERVES', 680, y + 52); c.fillStyle = ink; c.font = sans(26, 600); c.fillText('4', 760, y + 56);
    c.strokeStyle = line; c.lineWidth = 1.5; [800, 846].forEach((x, i) => { c.beginPath(); c.arc(x, y + 47, 16, 0, 7); c.stroke(); c.fillStyle = ink; c.font = sans(20); c.fillText(i ? '+' : '−', x - 6, y + 54); });
    t.items.forEach((s, i) => { const yy = y + 110 + i * 54; c.fillStyle = line; c.fillRect(680, yy + 18, 480, 1); const [a, b] = s.split(' · '); c.fillStyle = ink; c.font = sans(18); c.fillText(a, 680, yy); if (b) { c.fillStyle = acc; c.font = sans(18, 600); c.fillText(b, 1160 - c.measureText(b).width, yy); } });
  } else if (kind === 1) { // a figures table
    c.fillStyle = ink; c.font = '600 34px Georgia, serif'; c.fillText(p.slug === 'xefy' ? 'Nutrition per serving' : 'Figures', 40, 150);
    c.fillStyle = mute; c.font = sans(15); c.fillText(p.slug === 'xefy' ? 'Summed from the ingredients, after cooking losses. Nothing typed.' : 'Placeholder data', 40, 184);
    t.table.forEach(([a, b, v], i) => { const yy = 240 + i * 74; c.fillStyle = card; rr(c, 40, yy, W - 80, 58, 10); c.fill(); c.fillStyle = ink; c.font = sans(19, 500); c.fillText(a, 66, yy + 36);
      c.fillStyle = line; rr(c, 380, yy + 24, 560, 10, 5); c.fill(); c.fillStyle = acc; rr(c, 380, yy + 24, 560 * v, 10, 5); c.fill(); c.fillStyle = ink; c.font = sans(19, 600); c.fillText(b, W - 66 - c.measureText(b).width, yy + 36); });
  } else if (kind === 2) { // a timeline
    c.fillStyle = ink; c.font = '600 34px Georgia, serif'; c.fillText(p.slug === 'xefy' ? 'The timeline' : 'Timeline', 40, 150);
    c.fillStyle = mute; c.font = sans(15); c.fillText(p.slug === 'xefy' ? 'Parallel steps, planned backwards from the moment it is served.' : 'Placeholder', 40, 184);
    for (let m = 0; m <= 150; m += 30) { const x = 360 + m * 5; c.fillStyle = line; c.fillRect(x, 220, 1, 470); c.fillStyle = mute; c.font = sans(13); c.fillText(m + ' min', x - 16, 214); }
    t.steps.forEach(([a, s, d], i) => { const yy = 250 + i * 72; c.fillStyle = ink; c.font = sans(17, 500); c.fillText(a, 40, yy + 24); c.fillStyle = i === 3 ? acc : (light ? '#d8cbb6' : '#3a3d43'); rr(c, 360 + s * 5, yy, Math.max(30, d * 5), 36, 8); c.fill(); });
  } else if (kind === 3) { // a grid of entries
    c.fillStyle = card; rr(c, 40, 120, W - 80, 64, 32); c.fill(); c.fillStyle = mute; c.font = sans(18); c.fillText(p.slug === 'xefy' ? 'Search: lemon' : 'Search', 76, 160);
    t.cards.forEach((s, i) => { const x = 40 + (i % 3) * 380, y = 220 + Math.floor(i / 3) * 255, g = c.createLinearGradient(x, y, x + 360, y + 160);
      g.addColorStop(0, acc); g.addColorStop(1, light ? '#f0d9b8' : '#1a1c20'); c.fillStyle = card; rr(c, x, y, 360, 235, 12); c.fill(); c.fillStyle = g; rr(c, x, y, 360, 160, 12); c.fill(); c.fillRect(x, y + 140, 360, 20);
      c.fillStyle = ink; c.font = '600 21px Georgia, serif'; c.fillText(s, x + 18, y + 198); c.fillStyle = mute; c.font = sans(14); c.fillText(['45 min · serves 4', '1 h 20 · serves 8', '2 h · 1 tray', '35 min · serves 4', '1 h · serves 6', '15 min · serves 4'][i], x + 18, y + 222); });
  } else { // step-by-step with a timer
    c.fillStyle = ink; c.font = '600 120px Georgia, serif'; c.fillText('4', 80, 300); c.fillStyle = mute; c.font = sans(16); c.fillText('STEP 4 OF 6', 84, 340);
    c.fillStyle = ink; c.font = '400 38px Georgia, serif'; ['Roast at 200 °C until the', 'juices run clear at the', 'thickest part of the thigh.'].forEach((s, i) => c.fillText(p.slug === 'xefy' ? s : 'Placeholder instruction', 80, 430 + i * 50));
    c.strokeStyle = line; c.lineWidth = 14; c.beginPath(); c.arc(900, 400, 170, 0, 7); c.stroke(); c.strokeStyle = acc; c.beginPath(); c.arc(900, 400, 170, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * .62); c.stroke();
    c.fillStyle = ink; c.font = '600 64px system-ui, sans-serif'; c.fillText('49:36', 812, 422); c.fillStyle = mute; c.font = sans(16); c.fillText('REMAINING', 852, 460);
  }
  return cv.toDataURL('image/jpeg', .86);
}
const CAPS = ['The page', 'The figures', 'The timeline', 'Browsing', 'Step by step'];
const shotCache = new Map();
export function shots(p){ if (!shotCache.has(p.slug)) shotCache.set(p.slug, [0, 1, 2, 3, 4].map(k => ({ src: shot(p, k), cap: CAPS[k] }))); return shotCache.get(p.slug); }

// fill every [data-gal] in root with the five shots, and wire a lightbox
export function mountGallery(root, p){
  const list = shots(p);
  root.querySelectorAll('[data-gal]').forEach(el => { el.innerHTML = list.map((s, i) => `<button data-i="${i}" aria-label="Enlarge: ${s.cap}"><img src="${s.src}" alt="${p.name}: ${s.cap} (placeholder screen)"><figcaption>${s.cap}</figcaption></button>`).join(''); });
  let lb = document.querySelector('.lb'); if (!lb) { lb = document.createElement('div'); lb.className = 'lb'; lb.innerHTML = '<img alt=""><p></p>'; document.body.appendChild(lb); lb.onclick = () => lb.classList.remove('on'); }
  root.addEventListener('click', e => { const b = e.target.closest('[data-gal] button'); if (!b) return; const s = list[+b.dataset.i]; lb.querySelector('img').src = s.src; lb.querySelector('p').textContent = s.cap; lb.classList.add('on'); });
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });
}

// the loading veil (its markup is inline in each page so it shows before any script runs)
export function veil(){
  const el = document.getElementById('ld'), bar = el.querySelector('.ld-bar i'), line = el.querySelector('.ld-line'), tierEl = el.querySelector('.ld-tier');
  return { set(p, text){ bar.style.width = Math.round(p * 100) + '%'; if (text) line.textContent = text; }, tier(html){ tierEl.innerHTML = html; }, done(){ bar.style.width = '100%'; setTimeout(() => el.classList.add('done'), 250); } };
}
export const VEIL = `<div class="ld" id="ld" role="status" aria-live="polite"><div class="ld-in"><div class="ld-drop"><i></i></div><div class="ld-mk">Kiarash<i>Fa</i></div><div class="ld-line">Warming the mercury</div><div class="ld-bar"><i></i></div><div class="ld-tier">&nbsp;</div></div></div>`;
