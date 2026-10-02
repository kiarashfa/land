// Ambients for the Quicksilver home (and its derivative pages).
// Each builds a real room around a plinth whose top sits at PLINTH_TOP, so every ambient frames the
// object identically. buildAmbient returns { group, update(t), bloom, exposure, background, dispose }.
import * as T from '../vendor/three.r03.min.js';

export const PLINTH_TOP = .5;
export const AMBIENTS = [
  { id: 'atelier', name: 'Atelier', line: 'A dark gallery: polished black stone, tall softboxes, a little haze.' },
  { id: 'dusk', name: 'Dusk', line: 'A basalt plinth rising from still black water under a dusk sky.' },
  { id: 'travertine', name: 'Travertine', line: 'A light stone hall with arched niches; sun through a mullioned window.' },
];

// HDRIs ship as split-range PNGs (`vendor/hdri/<name>.hdr.png`), so any static host can serve them:
// the top half is the colour clamped to 1 (gamma 2.2), the bottom half is log2(1 + colour) / 12.
// Converted from the CC0 EXRs beside them by tools/assets/exr2png.mjs.
const hdrCache = {};
export function loadHDR(name) {
  if (!hdrCache[name]) hdrCache[name] = new T.ImageLoader().loadAsync(`../vendor/hdri/${name}.hdr.png`).then(img => {
    const w = img.width, h = img.height / 2, c = document.createElement('canvas'); c.width = w; c.height = h * 2;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, w, h * 2).data, out = new Uint16Array(w * h * 4), one = T.DataUtils.toHalfFloat(1);
    for (let i = 0; i < w * h; i++) { for (let k = 0; k < 3; k++) { const lo = d[i * 4 + k], hi = d[(i + w * h) * 4 + k];
      out[i * 4 + k] = T.DataUtils.toHalfFloat(lo < 250 ? Math.pow(lo / 255, 2.2) : Math.pow(2, hi / 255 * 12) - 1); } out[i * 4 + 3] = one; }
    const t = new T.DataTexture(out, w, h, T.RGBAFormat, T.HalfFloatType); t.mapping = T.EquirectangularReflectionMapping; t.colorSpace = T.LinearSRGBColorSpace;
    t.minFilter = t.magFilter = T.LinearFilter; t.generateMipmaps = false; t.needsUpdate = true; return t; });
  return hdrCache[name];
}
const hdri = loadHDR;
function canvasTex(w, h, draw, repeat = [1, 1], srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); if (srgb) t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = 8; return t;
}
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822519) + 0x9e3779b9 >>> 0) / 4294967296); }
function noise(g, w, h, amp, seed = 1) { const r = rng(seed), d = g.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { const n = (r() - .5) * amp; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; } g.putImageData(d, 0, 0); }
const shadowy = m => { m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return m; };

// a soft additive light cone (haze in a beam)
function beam(color, radiusTop, radiusBottom, height, intensity) {
  const mat = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    uniforms: { uC: { value: new T.Color(color) }, uI: { value: intensity } },
    vertexShader: `varying vec2 vU; varying vec3 vN; varying vec3 vV; void main(){ vU = uv; vec4 w = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-w.xyz); gl_Position = projectionMatrix * w; }`,
    fragmentShader: `uniform vec3 uC; uniform float uI; varying vec2 vU; varying vec3 vN; varying vec3 vV;
      void main(){ float edge = pow(abs(dot(vN, vV)), 1.6); float fall = pow(vU.y, 1.4); gl_FragColor = vec4(uC * uI * edge * fall, 1.); }` });
  const m = new T.Mesh(new T.CylinderGeometry(radiusTop, radiusBottom, height, 48, 1, true), mat); m.renderOrder = 10; return m;
}

// ---------- Atelier ----------
async function atelier(ctx) {
  const { scene } = ctx, g = new T.Group();
  scene.environment = await hdri('studio'); scene.environmentIntensity = .35;
  scene.background = new T.Color(0x060607); scene.fog = new T.FogExp2(0x060607, .04);
  T.RectAreaLightUniformsLib.init();
  // polished black stone: a mirror under a semi-transparent stone skin
  const mirror = new T.Reflector(new T.CircleGeometry(30, 64), { textureWidth: 1024, textureHeight: 1024, color: 0x202024, clipBias: .002 });
  mirror.rotation.x = -Math.PI / 2; g.add(mirror);
  const stoneT = canvasTex(1024, 1024, (c, w, h) => { c.fillStyle = '#0d0d0f'; c.fillRect(0, 0, w, h); const r = rng(4);
    for (let k = 0; k < 60; k++) { c.strokeStyle = `rgba(150,150,160,${.02 + r() * .04})`; c.lineWidth = .6 + r() * 1.5; c.beginPath(); let x = r() * w, y = r() * h; c.moveTo(x, y); for (let s = 0; s < 8; s++) { x += (r() - .4) * 160; y += (r() - .5) * 90; c.lineTo(x, y); } c.stroke(); }
    noise(c, w, h, 10, 2); }, [6, 6]);
  const skin = new T.Mesh(new T.CircleGeometry(30, 64), new T.MeshPhysicalMaterial({ map: stoneT, transparent: true, opacity: .86, roughness: .22, clearcoat: 1, clearcoatRoughness: .08 }));
  skin.rotation.x = -Math.PI / 2; skin.position.y = .002; skin.receiveShadow = true; g.add(skin);
  // back wall of plaster with recessed softboxes
  const plaster = canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#16151a'; c.fillRect(0, 0, w, h); noise(c, w, h, 12, 7); }, [8, 3]);
  const wall = new T.Mesh(new T.PlaneGeometry(40, 14), new T.MeshStandardMaterial({ map: plaster, roughness: .95 })); wall.position.set(0, 7, -7); g.add(wall);
  [[-4.4, 1], [4.4, 1], [-8.4, .55], [8.4, .55]].forEach(([x, k]) => {
    const box = new T.Mesh(new T.PlaneGeometry(.55, 5.2), new T.MeshBasicMaterial({ color: new T.Color(1, .93, .84).multiplyScalar(1.25 * k) })); box.position.set(x, 3.2, -6.95); g.add(box);
    const frame = new T.Mesh(new T.BoxGeometry(.7, 5.4, .1), new T.MeshStandardMaterial({ color: 0x0b0b0c, roughness: .5 })); frame.position.set(x, 3.2, -7.0); g.add(frame);
    const rl = new T.RectAreaLight(0xffeedd, 4 * k, .55, 5.2); rl.position.set(x, 3.2, -6.8); rl.lookAt(x * .2, 1, 0); g.add(rl); });
  // overhead softbox and key spot with a soft shadow on the plinth
  const top = new T.Mesh(new T.PlaneGeometry(2.6, 1.2), new T.MeshBasicMaterial({ color: new T.Color(1, .96, .9).multiplyScalar(1.6) })); top.rotation.x = Math.PI / 2; top.position.set(0, 6.2, -.4); g.add(top);
  const spot = new T.SpotLight(0xfff1e0, 120, 14, .32, .7, 1.6); spot.position.set(.6, 6, 1.2); spot.target.position.set(0, PLINTH_TOP, 0); spot.castShadow = true;
  spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -.0004; spot.shadow.radius = 6; g.add(spot, spot.target);
  g.add(new T.HemisphereLight(0x2a2620, 0x050505, .4));
  const haze = beam(0xffe6c8, .9, 1.9, 6.2, .035); haze.position.set(.3, 3.4, .4); haze.rotation.z = -.1; g.add(haze);
  // plinth: black lacquer drum with a brass seam
  const lac = new T.MeshPhysicalMaterial({ color: 0x0a0a0b, roughness: .4, clearcoat: .7, clearcoatRoughness: .18 });
  const pl = new T.Mesh(new T.CylinderGeometry(.62, .66, PLINTH_TOP, 96), lac); pl.position.y = PLINTH_TOP / 2; g.add(pl);
  const seam = new T.Mesh(new T.TorusGeometry(.62, .006, 8, 160), new T.MeshPhysicalMaterial({ color: 0xcfa968, metalness: 1, roughness: .25 })); seam.rotation.x = Math.PI / 2; seam.position.y = PLINTH_TOP - .04; g.add(seam);
  shadowy(pl);
  // drifting dust in the beam
  const N = 160, p = new Float32Array(N * 3), r = rng(9); for (let i = 0; i < N; i++) { const a = r() * 6.28, rad = Math.sqrt(r()) * 1.0; p[i * 3] = Math.cos(a) * rad; p[i * 3 + 1] = r() * 6; p[i * 3 + 2] = Math.sin(a) * rad; }
  const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(p, 3));
  const dust = new T.Points(dg, new T.PointsMaterial({ color: 0xffe4c4, size: .012, transparent: true, opacity: .55, blending: T.AdditiveBlending, depthWrite: false })); g.add(dust);
  scene.add(g);
  return { group: g, plinth: pl, bloom: [.22, .5, .92], exposure: .9, hdrMix: .55, hdrGain: 1.4, envGain: 1.5, cam: { y: 1.3, look: .98 },
    update(t) { const a = dg.attributes.position.array; for (let i = 0; i < N; i++) { a[i * 3 + 1] += .0012; if (a[i * 3 + 1] > 6) a[i * 3 + 1] = 0; a[i * 3] += Math.sin(t * .3 + i) * .0004; } dg.attributes.position.needsUpdate = true; } };
}

// ---------- Dusk ----------
async function dusk(ctx) {
  const { scene, renderer } = ctx, g = new T.Group();
  const sky = new T.Sky(); sky.scale.setScalar(450); g.add(sky);
  const su = sky.material.uniforms; su.turbidity.value = 3.5; su.rayleigh.value = 1.6; su.mieCoefficient.value = .004; su.mieDirectionalG.value = .9;
  const sun = new T.Vector3().setFromSphericalCoords(1, T.MathUtils.degToRad(90 - 3.2), T.MathUtils.degToRad(238)); su.sunPosition.value.copy(sun);
  // environment lighting from the same sky
  const pm = new T.PMREMGenerator(renderer), skyScene = new T.Scene(), sky2 = new T.Sky(); sky2.scale.setScalar(450); Object.keys(su).forEach(k => sky2.material.uniforms[k].value = su[k].value); skyScene.add(sky2);
  scene.environment = pm.fromScene(skyScene, .02).texture; scene.environmentIntensity = .7; scene.background = null; scene.fog = null;
  const normals = canvasTex(512, 512, (c, w, h) => { const img = c.createImageData(w, h), r = rng(3), waves = Array.from({ length: 24 }, () => [r() * 6.28, 2 + r() * 14, r() * 6.28, .3 + r() * .7]);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let nx = 0, ny = 0; for (const [ang, f, ph, a] of waves) { const k = (x * Math.cos(ang) + y * Math.sin(ang)) / w * f * 6.28 + ph, d = Math.cos(k) * a; nx += d * Math.cos(ang); ny += d * Math.sin(ang); }
      const o = (y * w + x) * 4; img.data[o] = 128 + nx * 9; img.data[o + 1] = 128 + ny * 9; img.data[o + 2] = 255; img.data[o + 3] = 255; } c.putImageData(img, 0, 0); }, [1, 1], false);
  const water = new T.Water(new T.PlaneGeometry(400, 400), { textureWidth: 1024, textureHeight: 1024, waterNormals: normals, sunDirection: sun.clone().normalize(), sunColor: 0xffc58a, waterColor: 0x02080d, distortionScale: 1.1, fog: false });
  water.rotation.x = -Math.PI / 2; water.material.uniforms.size.value = 3.2; g.add(water);
  // basalt plinth with columnar facets
  const basalt = new T.MeshPhysicalMaterial({ color: 0x1a1a1c, roughness: .55, clearcoat: .35, clearcoatRoughness: .4, flatShading: true });
  const pg = new T.CylinderGeometry(.6, .72, PLINTH_TOP + .4, 7, 3); const pp = pg.attributes.position, r = rng(5);
  for (let i = 0; i < pp.count; i++) if (pp.getY(i) < (PLINTH_TOP + .4) / 2 - .01) { pp.setX(i, pp.getX(i) * (1 + (r() - .5) * .08)); pp.setZ(i, pp.getZ(i) * (1 + (r() - .5) * .08)); }
  pg.computeVertexNormals(); const pl = new T.Mesh(pg, basalt); pl.position.y = (PLINTH_TOP + .4) / 2 - .4; g.add(shadowy(pl));
  // the horizon stays empty: just water, sky and the plinth
  const key = new T.DirectionalLight(0xffb070, 3.2); key.position.copy(sun).multiplyScalar(30); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 80 }); key.shadow.bias = -.0005; g.add(key);
  g.add(new T.HemisphereLight(0x6a7fa8, 0x05070a, .45));
  const rim = new T.DirectionalLight(0x8fb0ff, .8); rim.position.set(3, 4, 6); g.add(rim);
  scene.add(g);
  return { group: g, plinth: pl, bloom: [.22, .45, .95], exposure: .42, envGain: 1.0, cam: { y: 1.25, look: 1.0 },
    update(t) { water.material.uniforms.time.value = t * .35; } };
}

// ---------- Travertine ----------
async function travertine(ctx) {
  const { scene } = ctx, g = new T.Group();
  scene.environment = await hdri('apartment'); scene.environmentIntensity = .55;
  scene.background = new T.Color(0xe9dfd0); scene.fog = new T.Fog(0xe9dfd0, 14, 40);
  const trav = (rep, seed) => canvasTex(1024, 1024, (c, w, h) => { const r = rng(seed); c.fillStyle = '#ddd0bb'; c.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) { const t = Math.sin(y * .02 + Math.sin(y * .003) * 4) * .5 + .5; c.fillStyle = `rgba(${150 + t * 40},${125 + t * 30},${95 + t * 20},${.05 + r() * .05})`; c.fillRect(0, y, w, 2); }
    for (let k = 0; k < 700; k++) { c.fillStyle = `rgba(120,100,70,${.15 + r() * .25})`; c.beginPath(); c.ellipse(r() * w, r() * h, 1 + r() * 5, .6 + r() * 1.4, 0, 0, 6.28); c.fill(); }
    noise(c, w, h, 10, seed); }, rep);
  const tiles = canvasTex(1024, 1024, (c, w, h) => { const base = trav([1, 1], 11).image; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { c.drawImage(base, i * w / 2, j * h / 2, w / 2, h / 2); }
    c.strokeStyle = 'rgba(120,100,75,.35)'; c.lineWidth = 3; for (let k = 0; k <= 2; k++) { c.beginPath(); c.moveTo(k * w / 2, 0); c.lineTo(k * w / 2, h); c.stroke(); c.beginPath(); c.moveTo(0, k * h / 2); c.lineTo(w, k * h / 2); c.stroke(); } }, [8, 8]);
  const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshPhysicalMaterial({ map: tiles, roughness: .5, clearcoat: .25, clearcoatRoughness: .3 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor);
  const wallMat = new T.MeshStandardMaterial({ map: trav([3, 1], 12), roughness: .85 });
  // back wall with three arched niches
  const W = 16, H = 7, back = new T.Shape(); back.moveTo(-W / 2, 0); back.lineTo(W / 2, 0); back.lineTo(W / 2, H); back.lineTo(-W / 2, H); back.lineTo(-W / 2, 0);
  [-4, 0, 4].forEach(x => { const a = new T.Path(), w = 1.7, h = 3.4; a.moveTo(x - w / 2, .9); a.lineTo(x - w / 2, .9 + h); a.absarc(x, .9 + h, w / 2, Math.PI, 0, true); a.lineTo(x + w / 2, .9); a.lineTo(x - w / 2, .9); back.holes.push(a);
    const niche = new T.Mesh(new T.BoxGeometry(w, h + w / 2, .02), wallMat); niche.position.set(x, .9 + (h + w / 2) / 2, -6.6); g.add(niche);
    const sill = new T.Mesh(new T.BoxGeometry(w + .2, .1, .7), wallMat); sill.position.set(x, .85, -6.25); g.add(shadowy(sill)); });
  const bw = new T.Mesh(new T.ExtrudeGeometry(back, { depth: .6, bevelEnabled: false, curveSegments: 32 }), wallMat); bw.position.z = -6.6; g.add(shadowy(bw));
  // left wall with a tall mullioned window; the sun comes through it
  const L = new T.Shape(); L.moveTo(-10, 0); L.lineTo(10, 0); L.lineTo(10, H); L.lineTo(-10, H); L.lineTo(-10, 0);
  const win = new T.Path(), wx = -1.2, ww = 2.4, wy = .8, wh = 4.2; win.moveTo(wx - ww / 2, wy); win.lineTo(wx + ww / 2, wy); win.lineTo(wx + ww / 2, wy + wh); win.absarc(wx, wy + wh, ww / 2, 0, Math.PI, false); win.lineTo(wx - ww / 2, wy); L.holes.push(win);
  const lw = new T.Mesh(new T.ExtrudeGeometry(L, { depth: .5, bevelEnabled: false, curveSegments: 32 }), wallMat); lw.rotation.y = Math.PI / 2; lw.position.set(-6, 0, 0); g.add(shadowy(lw));
  const mull = new T.MeshStandardMaterial({ color: 0x2b2620, roughness: .6, metalness: .3 });
  [[0, wy + wh / 2 + .3, .05, wh + 1.1], [0, wy + 1.4, ww, .05], [0, wy + 2.8, ww, .05], [0, wy + 4.0, ww, .05]].forEach(([x, y, w, h]) => { const b = new T.Mesh(new T.BoxGeometry(.06, h, w), mull); b.position.set(-5.75, y, -(wx + x)); g.add(shadowy(b)); });
  const sun = new T.DirectionalLight(0xffe2b8, 5.5); sun.position.set(-16, 9.5, 2.5); sun.target.position.set(0, 0, -.6); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 }); sun.shadow.bias = -.0003; sun.shadow.normalBias = .02; g.add(sun, sun.target);
  g.add(new T.HemisphereLight(0xfff4e6, 0xc9b79c, .9));
  const bounce = new T.PointLight(0xffd9a8, 6, 12, 1.5); bounce.position.set(1.5, .6, 1.5); g.add(bounce);
  const shaft = beam(0xfff0d6, .9, 1.3, 13, .045); shaft.position.set(-3, 4.2, -.8); shaft.rotation.set(0, 0, -1.03); g.add(shaft);
  // plinth: a travertine block with a chamfer
  const pl = new T.Mesh(new T.RoundedBoxGeometry(1.15, PLINTH_TOP, 1.15, 4, .03), new T.MeshStandardMaterial({ map: trav([1, 1], 14), roughness: .7 })); pl.position.y = PLINTH_TOP / 2; g.add(shadowy(pl));
  scene.add(g);
  return { group: g, plinth: pl, bloom: [.14, .4, .95], exposure: .95, hdrMix: .35, hdrGain: 1.2, envGain: 1.15, cam: { y: 1.35, look: 1.0 }, update() {} };
}

const BUILDERS = { atelier, dusk, travertine };
export async function buildAmbient(id, ctx) {
  const a = await BUILDERS[id](ctx); a.id = id;
  a.dispose = () => { ctx.scene.remove(a.group); a.group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => m.dispose && m.dispose()); if (o.dispose) o.dispose(); }); };
  return a;
}
