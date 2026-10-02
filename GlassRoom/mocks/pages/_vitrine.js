// Glass vitrines: a lacquer plinth, a glass case with a slim bronze frame, and a miniature room inside.
// Rooms are modelled in real metres (people 1.75 m) and shrunk into the case; lights are rescaled
// so a desk lamp still behaves like a desk lamp at 1:6 scale.
import * as T from '../vendor/three.r03.min.js';

export const tex = (w, h, draw, rep = [1, 1], srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h, c);
  const t = new T.CanvasTexture(c); if (srgb) t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 8; return t; };
export const grain = (g, w, h, a, seed = 1) => { const d = g.getImageData(0, 0, w, h); let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < d.data.length; i += 4) { const n = (r() - .5) * a; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; } g.putImageData(d, 0, 0); };
export const rng = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

// a little modelling kit; every helper adds to `parent` and returns the mesh
export function kit(parent){
  const k = {
    box(w, h, d, mat, x, y, z, { r = 0, ry = 0, rx = 0, rz = 0, seg = 2 } = {}){ const g = r ? new T.RoundedBoxGeometry(w, h, d, seg, r) : new T.BoxGeometry(w, h, d);
      const m = new T.Mesh(g, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = m.receiveShadow = true; parent.add(m); return m; },
    cyl(rt, rb, h, mat, x, y, z, { seg = 24, rx = 0, rz = 0, ry = 0, open = false } = {}){ const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg, 1, open), mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = m.receiveShadow = true; parent.add(m); return m; },
    sph(r, mat, x, y, z, sx = 1, sy = 1, sz = 1){ const m = new T.Mesh(new T.SphereGeometry(r, 24, 16), mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = m.receiveShadow = true; parent.add(m); return m; },
    plane(w, h, mat, x, y, z, { rx = 0, ry = 0 } = {}){ const m = new T.Mesh(new T.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.receiveShadow = true; parent.add(m); return m; },
    group(x = 0, y = 0, z = 0, ry = 0){ const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g); return g; },
  };
  return k;
}

// After a room is built in metres and scaled by s, bring its lights back to physical sense.
export function rescaleLights(room, s){
  room.traverse(o => {
    if (o.isPointLight || o.isSpotLight) { o.intensity *= s * s; o.distance *= s; if (o.shadow) { o.shadow.camera.near *= s; o.shadow.camera.far *= s; o.shadow.normalBias *= s; } }
    if (o.isRectAreaLight) { o.width *= s; o.height *= s; }
  });
}

const glass = new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .015, metalness: 0, transmission: 1, thickness: .008, ior: 1.5, envMapIntensity: 1.0, side: T.DoubleSide });
const glassEdge = new T.MeshPhysicalMaterial({ color: 0xa9d6c4, roughness: .08, transparent: true, opacity: .55, envMapIntensity: 2.5, emissive: 0x16241e });
const bronze = new T.MeshPhysicalMaterial({ color: 0x2a221b, metalness: 1, roughness: .32 });
const lacquer = new T.MeshPhysicalMaterial({ color: 0x0b0b0c, roughness: .32, clearcoat: 1, clearcoatRoughness: .08 });
const brass = new T.MeshPhysicalMaterial({ color: 0xcfa968, metalness: 1, roughness: .26 });

// The case. w, d: inner footprint; h: glass height; base: plinth height. Returns {group, stage, top}.
export function vitrine({ w = 1.66, d = 1.34, h = .5, base = .9, label = '' } = {}){
  const g = new T.Group(), K = kit(g), t = .006;
  K.box(w + .14, base, d + .14, lacquer, 0, base / 2, 0, { r: .012 });
  K.box(w + .15, .012, d + .15, brass, 0, base - .03, 0);
  K.box(w + .04, .025, d + .04, bronze, 0, base + .0125, 0);                       // case floor rim
  const stage = new T.Group(); stage.position.y = base + .0265; g.add(stage);
  // glass panes (front, back, sides, top) and their green edges
  const y0 = base + .025, yc = y0 + h / 2;
  [[w, h, 0, yc, d / 2, 0], [w, h, 0, yc, -d / 2, 0], [d, h, w / 2, yc, 0, Math.PI / 2], [d, h, -w / 2, yc, 0, Math.PI / 2]].forEach(([a, b, x, y, z, ry]) => {
    const m = new T.Mesh(new T.PlaneGeometry(a, b), glass); m.position.set(x, y, z); m.rotation.y = ry; m.renderOrder = 2; g.add(m); });
  const top = new T.Mesh(new T.PlaneGeometry(w, d), glass); top.rotation.x = -Math.PI / 2; top.position.y = y0 + h; top.renderOrder = 2; g.add(top);
  // frameless, museum style: only the glass edges catch the light (a faint green, as thick glass does)
  const e = .0045;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => K.box(e, h, e, glassEdge, sx * w / 2, yc, sz * d / 2));
  [-1, 1].forEach(sz => K.box(w, e, e, glassEdge, 0, y0 + h, sz * d / 2)); [-1, 1].forEach(sx => K.box(e, e, d, glassEdge, sx * w / 2, y0 + h, 0));
  g.traverse(o => { if (o.material === glassEdge) o.castShadow = false; });
  // engraved brass plate on the plinth front
  if (label) { const plate = new T.Mesh(new T.PlaneGeometry(.5, .07), new T.MeshPhysicalMaterial({ metalness: .7, roughness: .35, color: 0xffffff,
      map: tex(512, 72, (c, W, H) => { const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#e6c88e'); gr.addColorStop(1, '#a98446'); c.fillStyle = gr; c.fillRect(0, 0, W, H);
        c.fillStyle = '#2a1c0c'; c.font = '30px "Bodoni Moda", Didot, Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(label.toUpperCase().split('').join(' '), W / 2, H / 2 + 2); }) }));
    plate.position.set(0, base * .62, d / 2 + .071); g.add(plate); }
  return { group: g, stage, top: y0 + h, inner: { w, d, h } };
}

// Shared look-dev: a dark gallery around the cases (black stone, soft spot pools)
export const MATS = { glass, bronze, lacquer, brass };

// A dark gallery environment for reflections: black room, two tall softboxes and a faint ceiling strip.
// Glass then reads as glass (a few clean highlights) without a white haze over the room.
export function galleryEnv(renderer, { boxes = 5, strip = .5, warm = 0xfff1de } = {}){
  const s = new T.Scene(), dark = new T.MeshBasicMaterial({ color: 0x050505, side: T.BackSide });
  s.add(new T.Mesh(new T.BoxGeometry(30, 12, 30), dark));
  const panel = (w, h, x, y, z, ry, I) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(warm).multiplyScalar(I), side: T.DoubleSide })); m.position.set(x, y, z); m.rotation.y = ry; s.add(m); };
  panel(2.2, 5, -9, 3, 2, Math.PI / 2, boxes); panel(2.2, 5, 9, 3, -1, -Math.PI / 2, boxes * .8); panel(6, 1.2, 0, 3, -12, 0, boxes * .35);
  const top = new T.Mesh(new T.PlaneGeometry(10, .6), new T.MeshBasicMaterial({ color: new T.Color(warm).multiplyScalar(strip) })); top.rotation.x = Math.PI / 2; top.position.set(0, 5.9, 4); s.add(top);
  const pm = new T.PMREMGenerator(renderer), rt = pm.fromScene(s, .02); pm.dispose(); return rt.texture;
}
