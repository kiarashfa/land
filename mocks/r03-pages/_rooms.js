// Miniature rooms for the family vitrines, one per project, modelled in real metres.
// Each builder returns { group, size: [w, d, h], update(t, dt) }. Figures are painted scale people (_figures.js).
import * as T from '../vendor/three.r03.min.js';
import { kit, tex, grain, rng } from './_vitrine.js';
import { figure, LIVE } from './_figures.js';

const std = (color, roughness = .6, extra = {}) => new T.MeshStandardMaterial({ color, roughness, ...extra });
const phys = (color, roughness = .4, extra = {}) => new T.MeshPhysicalMaterial({ color, roughness, ...extra });

// ---------- shared props ----------
function officeChair(K, x, z, ry, color = 0x2b2d31){
  const g = K.group(x, 0, z, ry), k = kit(g), fab = std(color, .85), metal = phys(0x9a9ea4, .3, { metalness: 1 });
  k.box(.5, .08, .48, fab, 0, .47, 0, { r: .03 }); k.box(.46, .5, .06, fab, 0, .8, -.23, { r: .03, rx: -.08 });
  k.cyl(.025, .025, .36, metal, 0, .27, 0);
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2, l = k.box(.3, .025, .04, metal, Math.cos(a) * .15, .07, Math.sin(a) * .15); l.rotation.y = -a; k.sph(.025, std(0x111111, .5), Math.cos(a) * .29, .03, Math.sin(a) * .29); }
  [-1, 1].forEach(s => { k.box(.04, .03, .3, fab, s * .27, .66, .02); k.box(.025, .18, .025, metal, s * .27, .57, -.06); });
  return g;
}
function walkPath(holder, pts, speed){ // loop along a polyline, facing the way of travel
  let L = 0; const seg = pts.map((p, i) => { const q = pts[(i + 1) % pts.length], l = Math.hypot(q[0] - p[0], q[1] - p[1]); L += l; return l; });
  return t => { let s = (t * speed) % L, i = 0; while (s > seg[i]) { s -= seg[i]; i++; } const p = pts[i], q = pts[(i + 1) % pts.length], f = s / seg[i];
    holder.position.x = p[0] + (q[0] - p[0]) * f; holder.position.z = p[1] + (q[1] - p[1]) * f;
    const want = Math.atan2(q[0] - p[0], q[1] - p[1]); let d = want - holder.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); holder.rotation.y += d * .12; };
}
function walker(holder){ // Xbot's own walk clip, kept in place (we move the holder)
  const m = holder.children[0], clip = m.userData.clips.find(c => c.name === 'walk').clone();
  clip.tracks.forEach(tr => { if (/Hips\.position/.test(tr.name)) for (let i = 0; i < tr.values.length; i += 3) { tr.values[i] = 0; tr.values[i + 2] = 0; } });
  const mixer = new T.AnimationMixer(m); mixer.clipAction(clip).play(); return mixer;
}

// ---------- Pseudoku: Lumon's Macrodata Refinement floor (Severance) ----------
async function pseudoku(){
  const W = 10, D = 8, H = 2.6, g = new T.Group(), K = kit(g), live = [];
  // green carpet, white walls, a plain door, one picture
  const carpet = std(0xffffff, 1, { map: tex(512, 512, (c, w, h) => { c.fillStyle = '#3d6e57'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(${Math.random() < .5 ? '20,50,38' : '120,160,135'},${Math.random() * .25})`; c.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } }, [6, 5]) });
  K.box(W, .04, D, carpet, 0, -.02, 0);
  const wall = std(0xeceee9, .9), skirt = std(0xb9bdb8, .6);
  K.box(W, H, .14, wall, 0, H / 2, -D / 2 - .07); K.box(.14, H, D + .14, wall, -W / 2 - .07, H / 2, 0);
  K.box(W, .1, .02, skirt, 0, .05, -D / 2 + .01); K.box(.02, .1, D, skirt, -W / 2 + .01, .05, 0);
  // the low front and right walls of a cut-away
  K.box(W + .14, .22, .14, wall, 0, .11, D / 2 + .07); K.box(.14, .22, D + .28, wall, W / 2 + .07, .11, 0);
  const door = K.group(3.0, 0, -D / 2 + .02); { const k = kit(door); k.box(1.02, 2.12, .05, std(0xd9dcd6, .5), 0, 1.06, 0); k.box(.9, 2.04, .05, std(0xf2f3ef, .45), 0, 1.02, .02);
    k.box(.12, .62, .01, phys(0x1e2a2a, .05, { clearcoat: 1 }), .22, 1.42, .05); k.box(.12, .02, .03, phys(0xb9bcc0, .25, { metalness: 1 }), -.34, 1.0, .07); }
  const art = K.group(-W / 2 + .02, 1.5, -.6, Math.PI / 2); { const k = kit(art); k.box(1.4, .95, .04, std(0x1c1c1c, .4), 0, 0, 0);
    k.plane(1.26, .81, std(0xffffff, .8, { map: tex(256, 168, (c, w, h) => { c.fillStyle = '#e9e1cf'; c.fillRect(0, 0, w, h); c.fillStyle = '#58745f'; c.fillRect(0, h * .62, w, h * .38);
      c.fillStyle = '#c9b47d'; c.beginPath(); c.arc(w * .68, h * .36, 24, 0, Math.PI * 2); c.fill(); c.fillStyle = '#3a4c40'; c.beginPath(); c.moveTo(0, h * .7); c.quadraticCurveTo(w * .4, h * .35, w, h * .66); c.lineTo(w, h); c.lineTo(0, h); c.fill(); }) }), 0, 0, .025); }
  // the desk: one square table split four ways by a green cross of partitions
  const top = std(0xf1f2ee, .35), edge = std(0xc8ccc7, .5), fabric = std(0xffffff, .95, { map: tex(128, 128, (c, w, h) => { c.fillStyle = '#5b8a72'; c.fillRect(0, 0, w, h); grain(c, w, h, 26, 7); }, [3, 2]) });
  const cap = phys(0xd5d9db, .3, { metalness: .6 });
  [[0, Math.PI / 2], [0, 0]].forEach(([_, ry]) => { const p = K.box(3.1, 1.28, .05, fabric, 0, .64, 0, { ry }); K.box(3.12, .025, .07, cap, 0, 1.29, 0, { ry }); });
  const screens = [];
  for (let q = 0; q < 4; q++) {
    const quad = K.group(0, 0, 0, q * Math.PI / 2), k = kit(quad);
    k.box(1.5, .04, 1.5, top, .78, .72, .78); k.box(1.5, .02, .02, edge, .78, .7, 1.53); k.box(.04, .7, .04, edge, 1.49, .35, 1.49);
    // the terminal: a cream box with a deep screen, keyboard and trackball
    const tg = k.group(.78, .74, .62), term = kit(tg), cream = phys(0xe7e0cf, .45, { clearcoat: .4 });
    term.box(.42, .36, .34, cream, 0, .2, 0, { r: .03 }); term.box(.34, .3, .14, cream, 0, .18, -.2, { r: .04 });
    term.box(.34, .27, .02, std(0x15191a, .6), 0, .22, .17);
    const c = document.createElement('canvas'); c.width = 256; c.height = 200; const st = new T.CanvasTexture(c); st.colorSpace = T.SRGBColorSpace; screens.push({ c, st, seed: q * 31 + 3 });
    const scr = new T.Mesh(new T.PlaneGeometry(.29, .22), new T.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: st, emissiveIntensity: 1.25, roughness: .25 })); scr.position.set(0, .22, .182); tg.add(scr);
    k.box(.46, .03, .16, cream, .78, .755, 1.1, { r: .008 }); k.box(.4, .006, .12, std(0xcfc6b2, .7), .78, .773, 1.1);
    k.box(.12, .05, .12, cream, 1.2, .765, 1.12, { r: .01 }); k.sph(.035, phys(0x2b2b2b, .15, { clearcoat: 1 }), 1.2, .8, 1.12);
    officeChair(k, .78, 1.86, Math.PI);
    const mug = [0xf3f1ea, 0x2f5b7a, 0xc9b27a, 0x8a2f2a][q]; k.cyl(.04, .036, .1, phys(mug, .3, { clearcoat: .6 }), .3, .79, 1.0); k.cyl(.034, .034, .003, std(0x2a160b, .2), .3, .838, 1.0);
    k.box(.24, .015, .32, std([0x24425f, 0xe8e2d2, 0x5b2a24, 0x3b5e45][q], .7), 1.25, .75, .5, { ry: .2 * q - .3 });
    if (q === 0) { k.cyl(.035, .035, .02, std(0x2a2a2a, .4), .32, .75, .6); k.cyl(.012, .016, .1, phys(0xd8c38a, .3, { metalness: .8 }), .32, .81, .6); k.sph(.022, phys(0xd8c38a, .3, { metalness: .8 }), .32, .875, .6); }
  }
  // the refiners: Mark, Helly, Irving, Dylan; and Milchick doing his rounds
  const looks = [ { jacket: 0x2f3237, pants: 0x2a2c30, shirtIn: 0xe6e8ec, tie: 0x3b4a5c, hair: 0x2a1f17 },
    { jacket: 0x23272c, pants: 0x1f2226, shirtIn: 0xd9d4cc, hair: 0x7b2a17, long: true, skin: 0xe8c0a4 },
    { jacket: 0x2b3442, pants: 0x262b33, shirtIn: 0xeef0f2, tie: 0x6b2b2b, hair: 0xd6d3cc, skin: 0xd8ad90 },
    { jacket: 0x3a3a33, pants: 0x2c2c28, shirtIn: 0xe9e4da, hair: 0x1d1a17, skin: 0xb98563 } ];
  for (let q = 0; q < 4; q++) {
    const f = await figure(looks[q]), a = q * Math.PI / 2, lx = .78, lz = 1.8;
    f.position.set(lx * Math.cos(a) + lz * Math.sin(a), -.43, -lx * Math.sin(a) + lz * Math.cos(a)); f.rotation.y = a + Math.PI; g.add(f);
    live.push(t => LIVE.typing(f.userData.rig, t, q * 1.7));
  }
  const mil = await figure({ jacket: 0x1b1c20, pants: 0x1b1c20, shirtIn: 0xf1f1f1, tie: 0x111111, hair: 0x120d0a, skin: 0x6b4a36, shoe: 0x0c0c0c }); g.add(mil);
  const mixer = walker(mil), path = walkPath(mil, [[-3, 2.8], [-3, -2.6], [2.2, -2.6], [2.2, 2.8]], .62);
  // cold office light: big ceiling panels (area lights) and one shadow-casting key from above
  [[0, 0, 3.4, 3.4, .42], [0, 0, 9, 7, .12]].forEach(([x, z, w, d, I]) => {
    const L = new T.RectAreaLight(0xeaf6ff, I, w, d); L.position.set(x, H, z); L.lookAt(x, 0, z); g.add(L); });
  const key = new T.SpotLight(0xf1f8ff, 120, 14, .62, 1, 2); key.position.set(-1.6, 7, 2.6); key.target.position.set(0, 0, 0); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0002; key.shadow.normalBias = .03; key.shadow.radius = 4; g.add(key, key.target);
  // the numbers: drifting cyan digits, a few of them "scary"
  const drawScreen = (s, t) => { const c = s.c.getContext('2d'), r = rng(s.seed + Math.floor(t * 2)); c.fillStyle = '#031014'; c.fillRect(0, 0, 256, 200);
    c.fillStyle = '#7fdfff'; c.fillRect(0, 0, 256, 18); c.fillStyle = '#031014'; c.font = 'bold 12px monospace'; c.fillText('PSEUDOKU · Cold Harbor', 8, 13);
    c.font = '15px monospace'; for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) { const scary = r() < .08; c.fillStyle = scary ? '#d8fbff' : 'rgba(127,223,255,.82)';
      c.fillText(String(Math.floor(r() * 10)), 14 + i * 26 + (scary ? Math.sin(t * 6 + i) * 2 : 0), 42 + j * 24 + (scary ? Math.cos(t * 5 + j) * 2 : 0)); }
    c.fillStyle = '#7fdfff'; c.fillRect(8, 186, 240 * (.2 + .03 * Math.sin(t * .2)), 6); s.st.needsUpdate = true; };
  let lastDraw = -1;
  return { group: g, size: [W, D, H], update(t, dt){ live.forEach(f => f(t)); mixer.update(dt); path(t);
    if (t - lastDraw > .12) { lastDraw = t; screens.forEach(s => drawScreen(s, t)); } } };
}

// ---------- LOSTimer: the Swan station's computer room (LOST) ----------
async function lostimer(){
  const W = 7, D = 6, H = 2.7, g = new T.Group(), K = kit(g), live = [];
  const tiles = std(0xffffff, .55, { map: tex(256, 256, (c, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { c.fillStyle = (i + j) % 2 ? '#6a4c30' : '#8c6c45'; c.fillRect(i * 32, j * 32, 32, 32); }
    c.strokeStyle = 'rgba(30,20,10,.5)'; c.lineWidth = 1; for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32, h); c.moveTo(0, i * 32); c.lineTo(w, i * 32); c.stroke(); } grain(c, w, h, 30, 3); }, [11, 9]) });
  K.box(W, .04, D, tiles, 0, -.02, 0);
  // walls: 70s slat panelling below, painted concrete above, a run of pipes along the top
  const slat = std(0xffffff, .7, { map: tex(256, 128, (c, w, h) => { c.fillStyle = '#7a5530'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 8) { c.fillStyle = `rgba(${40 + Math.random() * 30},${25 + Math.random() * 15},10,.5)`; c.fillRect(x, 0, 2, h); } grain(c, w, h, 22, 5); }, [6, 1]) });
  const concrete = std(0xffffff, .92, { map: tex(256, 256, (c, w, h) => { c.fillStyle = '#b8b29a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(90,85,60,${Math.random() * .08})`; c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 10 + Math.random() * 40, 0, 7); c.fill(); } grain(c, w, h, 24, 9); }, [3, 1]) });
  K.box(W, 1.15, .12, slat, 0, .575, -D / 2 - .06); K.box(W, H - 1.15, .12, concrete, 0, 1.15 + (H - 1.15) / 2, -D / 2 - .06);
  K.box(.12, 1.15, D + .12, slat, -W / 2 - .06, .575, 0); K.box(.12, H - 1.15, D + .12, concrete, -W / 2 - .06, 1.15 + (H - 1.15) / 2, 0);
  K.box(W, .05, .03, std(0x3d2a17, .5), 0, 1.16, -D / 2 + .01); K.box(.03, .05, D, std(0x3d2a17, .5), -W / 2 + .01, 1.16, 0);
  K.box(W + .12, .22, .12, concrete, 0, .11, D / 2 + .06); K.box(.12, .22, D + .24, concrete, W / 2 + .06, .11, 0);
  const pipe = phys(0x6f7462, .45, { metalness: .6 });
  [[2.45, .09], [2.3, .06], [2.2, .05]].forEach(([y, r], i) => { K.cyl(r, r, W, pipe, 0, y, -D / 2 + .14 + i * .12, { rz: Math.PI / 2, seg: 16 }); });
  for (let x = -3; x <= 3; x += 1.5) K.box(.04, .3, .3, pipe, x, 2.36, -D / 2 + .2);
  // the octagonal Swan emblem, painted on the concrete
  K.plane(.7, .7, std(0xffffff, .9, { transparent: true, map: tex(256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(30,30,30,.85)'; c.lineWidth = 9; c.beginPath();
    for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI * 2 + Math.PI / 8; c.lineTo(w / 2 + Math.cos(a) * 110, h / 2 + Math.sin(a) * 110); } c.stroke();
    c.fillStyle = 'rgba(30,30,30,.85)'; c.beginPath(); c.ellipse(128, 140, 40, 22, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(150, 132); c.quadraticCurveTo(178, 92, 150, 80); c.lineWidth = 12; c.stroke(); }) }), -2.2, 1.85, -D / 2 + .005);
  // the computer on its desk, under the countdown clock
  const wood = std(0x5a3a20, .55), beige = phys(0xd8cdb0, .5, { clearcoat: .3 });
  K.box(1.8, .05, .8, wood, .3, .74, -D / 2 + .5); [[-.55, -.3], [1.15, -.3], [-.55, .3], [1.15, .3]].forEach(([x, z]) => K.box(.05, .72, .05, wood, x, .36, -D / 2 + .5 + z));
  K.box(.44, .1, .38, beige, .1, .82, -D / 2 + .48, { r: .02 }); K.box(.44, .36, .36, beige, .1, 1.05, -D / 2 + .42, { r: .03 });
  K.box(.46, .04, .18, beige, .1, .79, -D / 2 + .78, { r: .01 }); K.box(.4, .008, .13, std(0x3b3326, .6), .1, .812, -D / 2 + .78);
  const crt = document.createElement('canvas'); crt.width = 256; crt.height = 192; const crtT = new T.CanvasTexture(crt); crtT.colorSpace = T.SRGBColorSpace;
  const screen = new T.Mesh(new T.PlaneGeometry(.3, .23), new T.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: crtT, emissiveIntensity: 1.3, roughness: .2 })); screen.position.set(.1, 1.06, -D / 2 + .605); g.add(screen);
  const glow = new T.PointLight(0x7dff9a, 1.2, 2.2, 2); glow.position.set(.1, 1.06, -D / 2 + .9); g.add(glow);
  // the countdown clock: black flaps in a steel box
  const clk = document.createElement('canvas'); clk.width = 512; clk.height = 128; const clkT = new T.CanvasTexture(clk); clkT.colorSpace = T.SRGBColorSpace;
  K.box(1.0, .3, .16, phys(0x4b4f52, .4, { metalness: .7 }), .3, 1.9, -D / 2 + .1);
  const face = new T.Mesh(new T.PlaneGeometry(.92, .23), new T.MeshStandardMaterial({ map: clkT, roughness: .5, emissive: 0xffffff, emissiveMap: clkT, emissiveIntensity: .25 })); face.position.set(.3, 1.9, -D / 2 + .181); g.add(face);
  const beacon = K.sph(.06, new T.MeshStandardMaterial({ color: 0x400000, emissive: 0xff2010, emissiveIntensity: 0 }), .95, 2.12, -D / 2 + .15);
  const alarm = new T.PointLight(0xff2a14, 0, 5, 2); alarm.position.set(.95, 2.1, -D / 2 + .4); g.add(alarm);
  // a record player, DHARMA cans, a 70s couch and a lamp
  K.box(1.2, .6, .5, wood, -2.6, .3, -D / 2 + .3); K.box(.42, .08, .36, std(0x2e2a25, .4), -2.75, .64, -D / 2 + .3);
  K.cyl(.15, .15, .01, phys(0x0b0b0b, .2, { clearcoat: 1 }), -2.78, .69, -D / 2 + .3, { seg: 32 }); K.cyl(.04, .04, .012, std(0xd9b44a, .5), -2.78, .695, -D / 2 + .3);
  const shelf = K.group(-W / 2 + .2, 0, -1.0, Math.PI / 2), ks = kit(shelf); [.4, .85, 1.3, 1.75].forEach(y => ks.box(1.6, .03, .35, wood, 0, y, 0)); [-.8, .8].forEach(x => ks.box(.03, 1.8, .35, wood, x, .9, 0));
  const can = std(0xffffff, .4, { map: tex(64, 64, (c, w, h) => { c.fillStyle = '#f2efe6'; c.fillRect(0, 0, w, h); c.fillStyle = '#2d4f8a'; c.fillRect(0, 26, w, 12); }) });
  [.4, .85, 1.3].forEach((y, r) => { for (let i = 0; i < 9; i++) if ((i * 7 + r * 3) % 5) ks.cyl(.045, .045, .13, can, -.68 + i * .17, y + .08, (i % 2) * .08 - .04, { seg: 12 }); });
  const couch = K.group(1.6, 0, .7, -Math.PI / 2 - .4), kc = kit(couch), orange = std(0xa4572a, .85);
  kc.box(1.9, .42, .85, orange, 0, .21, 0, { r: .06 }); kc.box(1.9, .5, .22, orange, 0, .62, -.32, { r: .08 }); [-.95, .95].forEach(x => kc.box(.2, .55, .85, orange, x, .3, 0, { r: .08 }));
  K.cyl(.3, .3, .01, std(0x6b5a3a, .95), 0, .005, .8, { seg: 32 }).scale.set(4, 1, 2.5);
  const lampG = K.group(-1.2, 0, -D / 2 + .6), kl = kit(lampG); kl.cyl(.012, .012, 1.5, phys(0x9a8a6a, .3, { metalness: 1 }), 0, .75, 0); kl.cyl(.12, .2, .26, std(0xe6d3a3, .9, { side: T.DoubleSide }), 0, 1.55, 0, { open: true });
  const lamp = new T.PointLight(0xffb76a, 6, 4, 2); lamp.position.set(-1.2, 1.5, -D / 2 + .6); g.add(lamp);
  const pend = new T.PointLight(0xffc98a, 4, 6, 2); pend.position.set(-.7, 2.2, -1.0); g.add(pend);
  K.cyl(.02, .2, .14, std(0x2f3a2a, .5, { side: T.DoubleSide }), -.7, 2.32, -1.0, { open: true }); K.cyl(.004, .004, .4, std(0x111111, .5), -.7, 2.55, -1.0);
  // Desmond at the keys, Locke watching, Hurley on the couch
  const des = await figure({ shirt: 0x5e5f44, jacket: 0x5e5f44, shirtIn: 0x5e5f44, pants: 0x3a372f, hair: 0x4a3220, skin: 0xd9a988 }); des.position.set(.1, -.43, -D / 2 + 1.28); des.rotation.y = Math.PI; g.add(des);
  officeChair(K, .1, -D / 2 + 1.32, Math.PI, 0x4a3524);
  const loc = await figure({ shirt: 0x6e6c58, jacket: 0x6e6c58, shirtIn: 0x6e6c58, pants: 0x4e4637, hair: 0xd2a586, skin: 0xd2a586 }); loc.position.set(1.15, 0, -1.2); loc.rotation.y = Math.PI + .5; g.add(loc);
  const hur = await figure({ shirt: 0x9d3826, jacket: 0x9d3826, shirtIn: 0x9d3826, pants: 0x34465f, hair: 0x18110c, skin: 0xc39472 }); hur.scale.setScalar(1.03); { const ry = -Math.PI / 2 - .4; hur.position.set(1.6 - Math.sin(ry) * .12, -.5, .7 - Math.cos(ry) * .12); hur.rotation.y = ry; } g.add(hur);
  live.push(t => LIVE.typing(des.userData.rig, t, 0), t => LIVE.handsBehind(loc.userData.rig, t, 1), t => LIVE.eating(hur.userData.rig, t, 2));
  const key = new T.SpotLight(0xffe2b8, 70, 12, .7, 1, 2); key.position.set(-1.5, 6, 2.4); key.target.position.set(.2, 0, -1); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0002; key.shadow.normalBias = .03; g.add(key, key.target);
  const fill = new T.RectAreaLight(0xffd9a6, .18, 6, 5); fill.position.set(0, H, 0); fill.lookAt(0, 0, 0); g.add(fill);
  // the loop: the clock runs down, the alarm turns, Desmond types the numbers, back to 108
  const DIG = '0123456789';
  return { group: g, size: [W, D, H], update(t, dt){ live.forEach(f => f(t)); const cyc = (t % 40), secs = cyc < 34 ? Math.max(0, 260 - cyc * 7.5) : 108 * 60, warn = secs < 60 && cyc < 34;
    const m = Math.floor(secs / 60), sc = Math.floor(secs % 60), txt = String(m).padStart(3, '0') + String(sc).padStart(2, '0');
    const c = clk.getContext('2d'); c.fillStyle = '#111'; c.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 5; i++) { const x = 18 + i * 96 + (i > 2 ? 14 : 0); c.fillStyle = '#050505'; c.fillRect(x, 10, 82, 108); c.fillStyle = secs === 0 ? '#c11' : '#eee'; c.font = 'bold 86px Helvetica, Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt[i], x + 41, 68); c.fillStyle = 'rgba(0,0,0,.7)'; c.fillRect(x, 62, 82, 3); }
    clkT.needsUpdate = true; const on = warn ? (Math.sin(t * 9) > 0 ? 1 : 0) : 0; beacon.material.emissiveIntensity = on * 4; alarm.intensity = on * 3 * (g.scale.x ** 2);
    const p = crt.getContext('2d'); p.fillStyle = '#031a08'; p.fillRect(0, 0, 256, 192); p.fillStyle = '#7dff9a'; p.font = '20px monospace';
    const typed = '4 8 15 16 23 42'.slice(0, cyc > 26 && cyc < 34 ? Math.floor((cyc - 26) * 2.2) : 0); p.fillText('>: ' + typed + (Math.sin(t * 6) > 0 ? '_' : ''), 12, 40);
    for (let y = 0; y < 192; y += 3) { p.fillStyle = 'rgba(0,0,0,.18)'; p.fillRect(0, y, 256, 1); } crtT.needsUpdate = true; } };
}

// ---------- ConStyx: the Construct, white and endless (The Matrix) ----------
async function constyx(){
  const W = 8, D = 6, H = 3, g = new T.Group(), K = kit(g), live = [];
  const white = std(0xd9d9d5, .5), wallW = std(0xd6d6d2, .95);
  K.box(W, .04, D, white, 0, -.02, 0); K.box(W, H, .12, wallW, 0, H / 2, -D / 2 - .06); K.box(.12, H, D + .12, wallW, -W / 2 - .06, H / 2, 0);
  K.box(W + .12, .22, .12, wallW, 0, .11, D / 2 + .06); K.box(.12, .22, D + .24, wallW, W / 2 + .06, .11, 0);
  // two red leather club chairs
  const leather = phys(0x6a1012, .36, { clearcoat: .55, clearcoatRoughness: .3, sheen: .4, sheenColor: new T.Color(0xff6a5a) }), legWood = std(0x1d120b, .4);
  const chair = (x, z, ry) => { const c = K.group(x, 0, z, ry), k = kit(c); k.box(.92, .36, .86, leather, 0, .26, 0, { r: .08, seg: 4 }); k.box(.62, .13, .64, leather, 0, .5, .06, { r: .05, seg: 4 });
    k.box(.92, .5, .24, leather, 0, .74, -.32, { r: .1, seg: 4 }); [-.38, .38].forEach(sx => k.box(.2, .3, .84, leather, sx, .56, 0, { r: .09, seg: 4 }));
    [[-.38, -.36], [.38, -.36], [-.38, .36], [.38, .36]].forEach(([lx, lz]) => k.cyl(.025, .02, .09, legWood, lx, .045, lz, { seg: 10 })); return c; };
  chair(-1.0, .2, .55); chair(1.0, .2, -.55);
  // the old television, the code falling on it
  const tvG = K.group(0, 0, -1.25), kt = kit(tvG), walnut = std(0x4a2b16, .45);
  kt.box(.9, .62, .5, walnut, 0, .58, 0, { r: .03 }); [[-.38, -.18], [.38, -.18], [-.38, .18], [.38, .18]].forEach(([x, z]) => kt.cyl(.018, .01, .27, walnut, x, .135, z, { seg: 8 }));
  kt.box(.6, .46, .02, std(0x111111, .4), -.08, .6, .251);
  const rain = document.createElement('canvas'); rain.width = 192; rain.height = 144; const rainT = new T.CanvasTexture(rain); rainT.colorSpace = T.SRGBColorSpace;
  const tvs = new T.Mesh(new T.PlaneGeometry(.54, .4), new T.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: rainT, emissiveIntensity: 1.4, roughness: .15 })); tvs.position.set(-.08, .6, .263); tvG.add(tvs);
  [.62, .52].forEach(y => kt.cyl(.025, .025, .02, std(0xc9b48a, .3, { metalness: .8 }), .3, y, .26, { rx: Math.PI / 2 }));
  kt.sph(.05, std(0x222222, .4), 0, .9, 0, 1, .6, 1); [-1, 1].forEach(s2 => { const a = kt.cyl(.004, .004, .6, phys(0xcccccc, .2, { metalness: 1 }), s2 * .14, 1.16, 0); a.rotation.z = -s2 * .5; });
  const tvGlow = new T.PointLight(0x3dff6a, 1.4, 2.4, 2); tvGlow.position.set(-.08, .6, -.8); g.add(tvGlow);
  // a small table with two pills; the spoon on the floor
  K.cyl(.22, .22, .025, phys(0xffffff, .05, { transmission: .9, thickness: .02 }), 0, .55, .45, { seg: 40 }); K.cyl(.012, .012, .54, phys(0xc0c0c0, .2, { metalness: 1 }), 0, .27, .45); K.cyl(.14, .16, .015, phys(0xc0c0c0, .2, { metalness: 1 }), 0, .008, .45, { seg: 32 });
  K.cyl(.035, .03, .12, phys(0xffffff, .02, { transmission: 1, thickness: .02 }), .08, .62, .4);
  const morph = await figure({ jacket: 0x0d0d0f, shirt: 0x0d0d0f, shirtIn: 0x2a1c22, pants: 0x0d0d0f, hair: 0x5a3b2a, skin: 0x5a3b2a, glasses: true });
  morph.position.set(-.95, -.38, .26); morph.rotation.y = .55; g.add(morph);
  const neo = await figure({ jacket: 0x101012, shirt: 0x101012, shirtIn: 0x151515, pants: 0x101012, hair: 0x15100c, skin: 0xd8b49a });
  neo.position.set(.95, -.38, .26); neo.rotation.y = -.55; g.add(neo);
  const pill = (c) => { const m = new T.Mesh(new T.CapsuleGeometry(.012, .022, 4, 10), phys(c, .25, { clearcoat: 1, emissive: c, emissiveIntensity: .25 })); m.rotation.z = Math.PI / 2; g.add(m); return m; };
  const red = pill(0xd0161a), blue = pill(0x1a4ad0);
  const boy = await figure({ shirt: 0xe7e2d6, jacket: 0xe7e2d6, shirtIn: 0xe7e2d6, pants: 0xe7e2d6, shoe: 0xe7e2d6, hair: 0xe2b896, skin: 0xe2b896 }); boy.scale.setScalar(.72); boy.position.set(.15, -.38 * .72 - .05, 1.55); boy.rotation.y = Math.PI * .92; g.add(boy);
  const spoon = new T.Group(), silver = phys(0xe8e8ea, .12, { metalness: 1 }); { const h = new T.Mesh(new T.CylinderGeometry(.006, .009, .12, 8), silver); h.position.y = -.06; spoon.add(h);
    const top = new T.Group(); top.position.y = 0; spoon.add(top); const n = new T.Mesh(new T.CylinderGeometry(.006, .006, .04, 8), silver); n.position.y = .02; top.add(n);
    const b = new T.Mesh(new T.SphereGeometry(.022, 16, 10), silver); b.scale.set(1, 1.5, .35); b.position.y = .07; top.add(b); spoon.userData.top = top; } g.add(spoon);
  live.push(t => { LIVE.offering(morph.userData.rig, t, 0); morph.userData.rig.bones.LeftHand.getWorldPosition(red.position); morph.userData.rig.bones.RightHand.getWorldPosition(blue.position);
      g.worldToLocal(red.position); g.worldToLocal(blue.position); red.position.y += .03; blue.position.y += .03; },
    t => LIVE.seated(neo.userData.rig, t, 1),
    t => { boy.userData.rig.apply({ ...LIVE_KNEEL, neck: [Math.sin(t * .3) * .1, 1, .4] }, { hipsDrop: 0 }); const hnd = boy.userData.rig.bones.RightHand; hnd.getWorldPosition(spoon.position); g.worldToLocal(spoon.position); spoon.position.y += .03; spoon.userData.top.rotation.z = -(.3 + .9 * (.5 + .5 * Math.sin(t * .8))); });
  // high-key light: a huge soft overhead, a key for gentle shadows
  [[0, 0, 7, 5, .12]].forEach(([x, z, w, d, I]) => { const L = new T.RectAreaLight(0xffffff, I, w, d); L.position.set(x, H, z); L.lookAt(x, 0, z); g.add(L); });
  const key = new T.SpotLight(0xffffff, 55, 14, .75, 1, 2); key.position.set(-2.2, 7, 3.2); key.target.position.set(0, 0, 0); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0002; key.shadow.normalBias = .03; g.add(key, key.target);
  const glyph = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ0123456789'.split(''), drops = Array.from({ length: 16 }, (_, i) => ({ x: i * 12 + 4, y: Math.random() * 144, v: 30 + Math.random() * 50 }));
  let last = 0;
  return { group: g, size: [W, D, H], update(t, dt){ live.forEach(f => f(t));
    if (t - last > .07) { last = t; const c = rain.getContext('2d'); c.fillStyle = 'rgba(0,8,2,.35)'; c.fillRect(0, 0, 192, 144); c.font = '11px monospace';
      drops.forEach(d => { d.y = (d.y + d.v * .07) % 160; c.fillStyle = '#d6ffe0'; c.fillText(glyph[(Math.random() * glyph.length) | 0], d.x, d.y); c.fillStyle = '#00ff41'; c.fillText(glyph[(Math.random() * glyph.length) | 0], d.x, d.y - 12); }); rainT.needsUpdate = true; } } };
}
const LIVE_KNEEL = { spine: [0, 1, .12], chest: [0, 1, .1], neck: [0, 1, .3], lThigh: [.12, -1, .35], lShin: [0, -.1, -1], lFoot: [0, -.3, -1], rThigh: [-.12, -1, .35], rShin: [0, -.1, -1], rFoot: [0, -.3, -1],
  lArm: [.15, -.9, .45], lFore: [-.1, .1, 1], rArm: [-.15, -.85, .5], rFore: [.15, .45, 1] };

export const ROOMS = { pseudoku, lostimer, constyx };
// what each case shows, for the label under it
export const SCENE_NOTES = {
  pseudoku: 'Macrodata Refinement, Lumon · Severance',
  lostimer: 'The Swan station, 108 minutes · LOST',
  constyx: 'The Construct · The Matrix',
};
