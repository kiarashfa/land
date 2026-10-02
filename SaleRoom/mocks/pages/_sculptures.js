// Bespoke procedural sculptures, one per project (D-021). Round 03 revision (v2):
// Xefy gets a roast on the plate, Perceptense becomes a balance, MorCypher grows taller,
// Kalculator is a real calculator with a big purple equals key, ConStyx gains a bent spoon.
// Each returns a THREE.Group standing on y = 0, about one unit tall, footprint within r ≈ 0.55.
// group.userData.tick(t) animates moving parts (bars, rain, screens) when a world calls it.
// `style` swaps the whole material set so worlds can restyle every object at once:
//   'luxe' (default PBR: gold, silver, enamel, glass), 'chrome' (all mirror), 'paper' (matte white), 'ink' (black lacquer).
import * as T from '../vendor/three.r03.min.js';

const TAU = Math.PI * 2;
const v2 = (x, y) => new T.Vector2(x, y);
const v3 = (x, y, z) => new T.Vector3(x, y, z);

function materials(style) {
  const cache = {};
  const phys = (k, o) => cache[k] || (cache[k] = new T.MeshPhysicalMaterial(o));
  if (style === 'paper') {
    const p = new T.MeshStandardMaterial({ color: 0xf2eee6, roughness: .92, metalness: 0 });
    const d = new T.MeshStandardMaterial({ color: 0xdcd6cb, roughness: .95 });
    return { gold: () => p, silver: () => p, brass: () => p, copper: () => p, enamel: () => p, lacquer: () => d, glass: () => p,
      liquid: () => d, porcelain: () => p, screen: () => d, glow: () => p, rubber: () => d, wood: () => d };
  }
  if (style === 'chrome') {
    const c = new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: .04 });
    return { gold: () => c, silver: () => c, brass: () => c, copper: () => c, enamel: () => c, lacquer: () => c, glass: () => c,
      liquid: () => c, porcelain: () => c, screen: () => c, glow: () => c, rubber: () => c, wood: () => c };
  }
  if (style === 'ink') {
    const k = new T.MeshPhysicalMaterial({ color: 0x0c0c0d, roughness: .18, clearcoat: 1, clearcoatRoughness: .05 });
    const g = new T.MeshPhysicalMaterial({ color: 0xd8b36c, metalness: 1, roughness: .2 });
    return { gold: () => g, silver: () => k, brass: () => g, copper: () => k, enamel: () => k, lacquer: () => k, glass: () => k,
      liquid: () => k, porcelain: () => k, screen: () => k, glow: () => g, rubber: () => k, wood: () => k };
  }
  return {
    gold: () => phys('gold', { color: 0xdcb46e, metalness: 1, roughness: .17, clearcoat: .3 }),
    silver: () => phys('silver', { color: 0xe4e7ea, metalness: 1, roughness: .1 }),
    brass: () => phys('brass', { color: 0xc59a52, metalness: 1, roughness: .28 }),
    copper: () => phys('copper', { color: 0xc8764a, metalness: 1, roughness: .22 }),
    enamel: c => phys('en' + c, { color: c, metalness: 0, roughness: .28, clearcoat: 1, clearcoatRoughness: .08 }),
    lacquer: () => phys('lacquer', { color: 0x0b0b0c, metalness: .1, roughness: .25, clearcoat: 1, clearcoatRoughness: .05 }),
    glass: () => phys('glass', { color: 0xf4f8ff, metalness: 0, roughness: .02, transmission: 1, thickness: .2, ior: 1.5, specularIntensity: 1, envMapIntensity: 2.4, clearcoat: 1, iridescence: .25, sheen: .4, sheenColor: 0xdfe8ff }),
    liquid: c => phys('liq' + c, { color: c, metalness: 0, roughness: .05, transmission: .6, thickness: .4, ior: 1.36, attenuationColor: c, attenuationDistance: .8, emissive: c, emissiveIntensity: .35 }),
    porcelain: () => phys('porc', { color: 0xf1ede6, metalness: 0, roughness: .32, clearcoat: .6 }),
    screen: tex => new T.MeshBasicMaterial({ map: tex, toneMapped: false }),
    glow: c => phys('glow' + c, { color: c, emissive: c, emissiveIntensity: 1.6, roughness: .4 }),
    rubber: () => phys('rubber', { color: 0x141414, roughness: .7 }),
    wood: () => phys('wood', { color: 0x2a1a12, roughness: .45, clearcoat: .7 }),
  };
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; t.userData = { c, g };
  return t;
}
const mesh = (geo, mat, cast = true) => { const m = new T.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = true; return m; };
const lathe = (pts, seg = 96) => new T.LatheGeometry(pts.map(p => v2(p[0], p[1])), seg);
const tube = (pts, r, seg = 200, closed = false) => new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p => v3(...p)), closed), seg, r, 12, closed);
function plinth(M, r = .3, h = .05) { return mesh(new T.CylinderGeometry(r, r * 1.04, h, 64), M.lacquer()); }

const BUILD = {
  // A globe wound from one continuous gold wire, tilted on a lacquer stand.
  polymeratlas(M) {
    const g = new T.Group(), R = .36, pts = [];
    for (let i = 0; i <= 900; i++) { const t = i / 900, ph = .04 + t * (Math.PI - .08), th = t * TAU * 14; pts.push([R * Math.sin(ph) * Math.cos(th), R * Math.cos(ph), R * Math.sin(ph) * Math.sin(th)]); }
    const globe = new T.Group(); globe.add(mesh(tube(pts, .0065, 1800), M.gold()));
    const meridian = mesh(new T.TorusGeometry(R + .035, .007, 12, 160), M.silver()); meridian.rotation.y = Math.PI / 2; globe.add(meridian);
    globe.rotation.z = .41; globe.position.y = .62; g.add(globe);
    const arm = mesh(new T.TorusGeometry(R + .035, .012, 12, 120, Math.PI), M.silver()); arm.position.y = .62; arm.rotation.z = Math.PI / 2 + .41; g.add(arm);
    g.add(mesh(new T.CylinderGeometry(.012, .016, .22, 16), M.silver()).translateY(.15));
    g.add(plinth(M, .17, .04).translateY(.02));
    return g;
  },
  // A silver cloche lifted off a porcelain platter: a glazed roast chicken underneath, with lemon and rosemary.
  xefy(M, P) {
    const g = new T.Group();
    g.add(mesh(lathe([[0, 0], [.46, 0], [.5, .014], [.52, .036], [.44, .036], [.14, .026], [0, .026]]), M.porcelain()));
    // roasted skin: a canvas texture with darker caramelised patches
    const skin = canvasTex(512, 256, (c, w, h) => { c.fillStyle = '#a4521c'; c.fillRect(0, 0, w, h);
      for (let k = 0; k < 900; k++) { const x = Math.random() * w, y = Math.random() * h, r = 2 + Math.random() * 14; c.fillStyle = `rgba(${90 + Math.random() * 60},${35 + Math.random() * 25},${10},${.08 + Math.random() * .18})`; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
      for (let k = 0; k < 400; k++) { const x = Math.random() * w, y = Math.random() * h; c.fillStyle = `rgba(255,${190 + Math.random() * 50},120,${.08 + Math.random() * .1})`; c.beginPath(); c.arc(x, y, 1 + Math.random() * 4, 0, TAU); c.fill(); } });
    const roast = new T.MeshPhysicalMaterial({ map: skin, roughness: .38, clearcoat: .8, clearcoatRoughness: .25, sheen: .6, sheenColor: new T.Color(0xffc27a), sheenRoughness: .5 });
    const lump = (geo, amp, f) => { const p = geo.attributes.position, v = new T.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = Math.sin(v.x * f) * Math.sin(v.y * f * 1.3 + 1.7) * Math.sin(v.z * f * .9 + .4); v.multiplyScalar(1 + n * amp); p.setXYZ(i, v.x, v.y, v.z); } geo.computeVertexNormals(); return geo; };
    const bird = new T.Group();
    const body = mesh(lump(new T.SphereGeometry(.2, 64, 48), .05, 23), roast); body.scale.set(1.15, .72, .9); body.position.y = .13; bird.add(body);
    const breast = mesh(lump(new T.SphereGeometry(.13, 48, 32), .04, 30), roast); breast.scale.set(1.2, .8, 1.05); breast.position.set(.06, .19, 0); bird.add(breast);
    [-1, 1].forEach(sd => {
      const thigh = mesh(lump(new T.SphereGeometry(.085, 40, 28), .05, 35), roast); thigh.scale.set(1.25, .85, .9); thigh.position.set(-.1, .15, sd * .12); thigh.rotation.z = .4; bird.add(thigh);
      const leg = mesh(new T.CapsuleGeometry(.032, .12, 8, 20), roast); leg.position.set(-.2, .2, sd * .09); leg.rotation.set(sd * .25, 0, 1.1); bird.add(leg);
      const bone = mesh(new T.CylinderGeometry(.012, .014, .05, 16), M.porcelain()); bone.position.set(-.27, .25, sd * .075); bone.rotation.set(sd * .25, 0, 1.1); bird.add(bone);
      const frill = mesh(new T.CylinderGeometry(.03, .017, .045, 18, 1, true), new T.MeshStandardMaterial({ color: 0xfaf7f0, roughness: .9, side: T.DoubleSide })); frill.position.set(-.3, .265, sd * .07); frill.rotation.set(sd * .25, 0, 1.1); bird.add(frill);
      const wing = mesh(lump(new T.SphereGeometry(.07, 32, 20), .06, 40), roast); wing.scale.set(1.4, .55, .7); wing.position.set(.08, .12, sd * .17); wing.rotation.x = sd * .5; bird.add(wing);
    });
    bird.position.set(.03, .02, 0); bird.rotation.y = .5; bird.scale.setScalar(1.35); g.add(bird);
    // lemon halves and rosemary sprigs on the platter
    const lemonCut = canvasTex(256, 256, (c, w) => { c.fillStyle = '#f6e27a'; c.beginPath(); c.arc(128, 128, 126, 0, TAU); c.fill(); c.fillStyle = '#fbf3c8'; c.beginPath(); c.arc(128, 128, 112, 0, TAU); c.fill();
      for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; c.fillStyle = '#f3d24a'; c.beginPath(); c.moveTo(128, 128); c.arc(128, 128, 104, a + .05, a + TAU / 10 - .05); c.fill(); } c.fillStyle = '#fbf3c8'; c.beginPath(); c.arc(128, 128, 14, 0, TAU); c.fill(); });
    [[.36, .22, .3], [.4, -.1, -.2], [-.36, -.28, .9]].forEach(([x, z, r]) => { const L = new T.Group();
      const rind = mesh(new T.SphereGeometry(.06, 32, 16, 0, TAU, 0, Math.PI / 2), new T.MeshPhysicalMaterial({ color: 0xf2cc2e, roughness: .45, clearcoat: .5 })); rind.rotation.x = Math.PI; L.add(rind);
      const face = mesh(new T.CircleGeometry(.06, 32), new T.MeshStandardMaterial({ map: lemonCut, roughness: .6 })); face.rotation.x = -Math.PI / 2; face.position.y = .0005; L.add(face);
      L.position.set(x, .05, z); L.rotation.set(-.25, r, .2); g.add(L); });
    const herb = new T.MeshStandardMaterial({ color: 0x3e5e2e, roughness: .7 });
    [[-.2, .27, .5], [.18, -.3, 2.4], [-.36, .05, 1.4]].forEach(([x, z, r]) => { const sp = new T.Group(); sp.add(mesh(new T.CylinderGeometry(.004, .005, .2, 6), new T.MeshStandardMaterial({ color: 0x5a4a2a })).rotateZ(Math.PI / 2));
      for (let k = 0; k < 16; k++) { const lf = mesh(new T.CapsuleGeometry(.0045, .03, 4, 6), herb); const t = k / 16 - .5; lf.position.set(t * .19, .006, (k % 2 ? 1 : -1) * .012); lf.rotation.set(Math.PI / 2, 0, (k % 2 ? .7 : -.7)); sp.add(lf); }
      sp.position.set(x, .045, z); sp.rotation.y = r; g.add(sp); });
    // the cloche, lifted and tilted back
    const dome = new T.Group();
    const prof = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI / 2; prof.push([Math.cos(a) * .4, Math.sin(a) * .38]); }
    prof.unshift([.41, -.005]);
    dome.add(mesh(lathe(prof), M.silver()));
    dome.add(mesh(new T.SphereGeometry(.038, 32, 16), M.silver()).translateY(.4));
    dome.add(mesh(new T.CylinderGeometry(.013, .022, .03, 16), M.silver()).translateY(.372));
    dome.position.set(-.08, .5, -.34); dome.rotation.set(-.85, 0, .1); g.add(dome);
    return g;
  },
  // A fastback coupe in polished aluminium, the wind tunnel's streamlines hugging its roof.
  markey(M) {
    const g = new T.Group();
    const body = new T.Shape(); body.moveTo(-.56, .11);
    body.bezierCurveTo(-.59, .17, -.5, .2, -.38, .215); body.bezierCurveTo(-.25, .228, -.16, .236, -.1, .248);
    body.lineTo(.36, .258); body.bezierCurveTo(.46, .25, .53, .23, .565, .2); body.bezierCurveTo(.58, .17, .575, .12, .55, .11); body.lineTo(-.56, .11);
    const bg = new T.ExtrudeGeometry(body, { depth: .28, bevelEnabled: true, bevelThickness: .06, bevelSize: .045, bevelSegments: 8, curveSegments: 40 }); bg.translate(0, 0, -.14);
    g.add(mesh(bg, M.silver()));
    const cab = new T.Shape(); cab.moveTo(-.13, .24); cab.bezierCurveTo(-.05, .3, .02, .335, .12, .337); cab.bezierCurveTo(.24, .336, .34, .3, .42, .25); cab.lineTo(-.13, .24);
    const cg = new T.ExtrudeGeometry(cab, { depth: .2, bevelEnabled: true, bevelThickness: .035, bevelSize: .03, bevelSegments: 6, curveSegments: 32 }); cg.translate(0, 0, -.1);
    g.add(mesh(cg, new T.MeshPhysicalMaterial({ color: 0x0d1117, metalness: .3, roughness: .05, clearcoat: 1 })));
    [[-.33, .2], [.33, .2], [-.33, -.2], [.33, -.2]].forEach(([x, z]) => { const w = mesh(new T.CylinderGeometry(.088, .088, .06, 40), M.rubber()); w.rotation.x = Math.PI / 2; w.position.set(x, .088, z); g.add(w);
      const hub = mesh(new T.CylinderGeometry(.05, .05, .064, 24), M.gold()); hub.rotation.x = Math.PI / 2; hub.position.set(x, .088, z); g.add(hub); });
    const top = x => { const pts = body.getPoints(60).concat(cab.getPoints(40)); let y = .11; pts.forEach(p => { if (Math.abs(p.x - x) < .03) y = Math.max(y, p.y); }); return y; };
    for (let k = 0; k < 6; k++) { const z = (k - 2.5) * .06, off = .035 + k % 3 * .03, pts = [];
      for (let i = 0; i <= 44; i++) { const x = -.85 + i / 44 * 1.75, inside = x > -.6 && x < .6; const lead = Math.max(0, 1 - Math.abs(x + .6) * 4) * .05;
        pts.push([x, (inside ? top(x) : .16) + off + lead + (x > .6 ? (x - .6) * -.05 : 0), z]); }
      g.add(mesh(tube(pts, .0022, 120), M.enamel(0x9fd0ff), false)); }
    g.add(mesh(new T.BoxGeometry(1.35, .02, .62), M.lacquer()).translateY(.01));
    return g;
  },
  // A crystal coupe holding amber, with a twist of peel on the rim.
  exir(M, P) {
    const g = new T.Group();
    const glass = [[0, 0], [.2, 0], [.21, .012], [.03, .03], [.022, .1], [.02, .36], [.05, .4], [.2, .47], [.31, .56], [.33, .6], [.32, .6], [.29, .56], [.18, .48], [.04, .415], [0, .41]];
    g.add(mesh(lathe(glass), M.glass()));
    const liq = []; for (let i = 0; i <= 12; i++) { const t = i / 12; liq.push([.04 + t * .245, .418 + t * t * .12]); } liq.push([0, .538]); liq.unshift([0, .418]);
    g.add(mesh(lathe(liq), M.liquid(new T.Color(P.color).getHex()), false));
    const peel = []; for (let i = 0; i <= 60; i++) { const t = i / 60, a = t * TAU * 2.2; peel.push([.3 + Math.cos(a) * .03, .62 - t * .22, Math.sin(a) * .03 + .02]); }
    g.add(mesh(tube(peel, .009, 120), M.enamel(0xe58a2a)));
    g.scale.setScalar(1.35);
    return g;
  },
  // A rifle cartridge: brass case, copper bullet, standing to attention.
  armag(M) {
    const g = new T.Group();
    const c = [[0, 0], [.105, 0], [.11, .01], [.11, .04], [.088, .05], [.088, .065], [.112, .075], [.106, .58], [.098, .6], [.064, .66], [.062, .75], [0, .75]];
    g.add(mesh(lathe(c), M.brass()));
    const b = [[0, .74], [.06, .74]]; for (let i = 1; i <= 20; i++) { const t = i / 20; b.push([.06 * Math.cos(t * Math.PI / 2) ** .7, .74 + t * .3]); }
    g.add(mesh(lathe(b), M.copper()));
    g.add(mesh(new T.CylinderGeometry(.028, .028, .006, 32), M.copper()).translateY(.003));
    g.position.y = .02; const w = new T.Group(); w.add(g); w.add(plinth(M, .2, .03).translateY(.015)); return w;
  },
  // An antique brass balance: a feather and a gold weight held level. A sense of how much things are.
  perceptense(M, P) {
    const g = new T.Group(), brass = M.brass(), teal = M.enamel(new T.Color(P.color).getHex());
    g.add(mesh(new T.CylinderGeometry(.2, .23, .05, 64), M.wood()).translateY(.025));
    g.add(mesh(new T.CylinderGeometry(.13, .16, .03, 64), brass).translateY(.065));
    g.add(mesh(lathe([[0, 0], [.05, 0], [.035, .05], [.024, .1], [.02, .58], [.032, .6], [.032, .63], [0, .63]], 48), brass).translateY(.08));
    g.add(mesh(new T.SphereGeometry(.035, 24, 16), teal).translateY(.735));
    const beam = new T.Group(); beam.position.y = .7;
    const bar = mesh(new T.CylinderGeometry(.009, .009, .74, 24), brass); bar.rotation.z = Math.PI / 2; beam.add(bar);
    beam.add(mesh(new T.ConeGeometry(.025, .12, 4), brass).translateY(.06).rotateZ(Math.PI));
    const pointer = mesh(new T.CylinderGeometry(.004, .004, .2, 8), brass); pointer.position.y = -.1; beam.add(pointer);
    [-1, 1].forEach(sd => {
      const end = new T.Group(); end.position.x = sd * .37; beam.add(end);
      end.add(mesh(new T.SphereGeometry(.016, 16, 12), brass));
      for (let k = 0; k < 3; k++) { const a = k / 3 * TAU, chain = mesh(new T.CylinderGeometry(.0025, .0025, .34, 6), brass);
        chain.position.set(Math.cos(a) * .045, -.17, Math.sin(a) * .045); chain.rotation.set(Math.sin(a) * .14, 0, -Math.cos(a) * .14); end.add(chain); }
      const pan = mesh(lathe([[0, 0], [.1, .006], [.13, .03], [.128, .033], [.098, .01], [0, .004]], 48), brass); pan.position.y = -.345; end.add(pan);
      if (sd < 0) { const w = mesh(new T.CylinderGeometry(.035, .04, .06, 32), M.gold()); w.position.y = -.31; end.add(w); const knob = mesh(new T.SphereGeometry(.016, 16, 12), M.gold()); knob.position.y = -.27; end.add(knob); }
      else { // a white feather
        const vane = new T.Shape(); vane.moveTo(0, 0); vane.bezierCurveTo(.07, .08, .1, .26, .03, .42); vane.bezierCurveTo(-.01, .46, -.06, .26, -.035, .1); vane.lineTo(0, 0);
        const f = mesh(new T.ShapeGeometry(vane, 24), new T.MeshStandardMaterial({ color: 0xf6f3ec, roughness: .9, side: T.DoubleSide }));
        f.add(mesh(new T.CylinderGeometry(.003, .004, .46, 6), new T.MeshStandardMaterial({ color: 0xd8cfbd })).translateY(.2));
        f.position.set(-.02, -.33, 0); f.rotation.set(0, .5, -.35); end.add(f); }
    });
    beam.rotation.z = .0; g.add(beam);
    g.userData.tick = t => { beam.rotation.z = Math.sin(t * .9) * .025; beam.children.forEach(c => { if (c.position.x) c.rotation.z = -beam.rotation.z; }); };
    return g;
  },
  // A gilded arch, its two leaves swung open onto warm light.
  galerium(M) {
    const g = new T.Group(), W = .32, H = .5, R = W / 2, m = .06;
    const arch = (w, h, r, cx = 0) => { const sh = new T.Shape(); sh.moveTo(cx - w / 2, 0); sh.lineTo(cx - w / 2, h); sh.absarc(cx, h, r, Math.PI, 0, true); sh.lineTo(cx + w / 2, 0); sh.lineTo(cx - w / 2, 0); return sh; };
    const outer = arch(W + m * 2, H, R + m); const hole = arch(W, H, R); outer.holes.push(hole);
    g.add(mesh(new T.ExtrudeGeometry(outer, { depth: .07, bevelEnabled: true, bevelSize: .01, bevelThickness: .01, bevelSegments: 3, curveSegments: 48 }), M.gold()).translateZ(-.035));
    const light = new T.Mesh(new T.ShapeGeometry(arch(W, H, R), 48), new T.MeshBasicMaterial({ color: 0xffe3a8, toneMapped: false })); light.position.z = -.03; g.add(light);
    const leafShape = new T.Shape(); leafShape.moveTo(0, 0); leafShape.lineTo(W / 2, 0); leafShape.lineTo(W / 2, H + R); leafShape.absarc(W / 2, H, R, Math.PI / 2, Math.PI, false); leafShape.lineTo(0, 0);
    [-1, 1].forEach(s => { const lg = new T.ExtrudeGeometry(leafShape, { depth: .012, bevelEnabled: false, curveSegments: 24 }); if (s > 0) lg.scale(-1, 1, 1);
      const leaf = mesh(lg, M.gold()); leaf.position.set(s * W / 2, 0, -.006); leaf.rotation.y = s * .78; g.add(leaf); });
    const step = mesh(new T.BoxGeometry(W + m * 2 + .14, .05, .3), M.enamel(0x1b2140)); step.position.y = -.025; g.add(step);
    g.position.y = .05; const w = new T.Group(); w.add(g); w.scale.setScalar(1.15); return w;
  },
  // Spanish opens its exclamations and questions: ¡ and ¿ as two monoline enamel glyphs.
  lalista(M) {
    const g = new T.Group(), teal = M.enamel(0x4b9c8b), amber = M.enamel(0xc47f25), r = .05;
    g.add(mesh(new T.SphereGeometry(.062, 32, 24), teal).translateY(.82).translateX(-.2));
    g.add(mesh(new T.CapsuleGeometry(r, .44, 8, 24), teal).translateY(.37).translateX(-.2));
    const qx = .1;
    g.add(mesh(new T.SphereGeometry(.062, 32, 24), amber).translateY(.82).translateX(qx));
    g.add(mesh(new T.CapsuleGeometry(r, .1, 8, 24), amber).translateY(.6).translateX(qx));
    const arc = 1.45 * Math.PI, hook = mesh(new T.TorusGeometry(.15, r, 20, 96, arc), amber); hook.rotation.z = Math.PI / 2; hook.position.set(qx + .15 * 0, .4, 0);
    hook.position.x = qx; hook.position.y = .55 - .15; g.add(hook);
    const end = Math.PI / 2 + arc; g.add(mesh(new T.SphereGeometry(r, 24, 16), amber).translateX(qx + Math.cos(end) * .15).translateY(.4 + Math.sin(end) * .15));
    g.add(mesh(new T.BoxGeometry(.78, .04, .3), M.porcelain()).translateY(.02).translateX(-.04));
    return g;
  },
  // A full telegraph set: the brass key in front, the sounder on its coils behind, a tall reel of tape.
  morcypher(M, P) {
    const g = new T.Group(), brass = M.brass(), copper = M.copper(), wood = M.wood();
    g.add(mesh(new T.BoxGeometry(.8, .07, .36), wood).translateY(.035));
    g.add(mesh(new T.BoxGeometry(.82, .012, .38), brass).translateY(.075));
    // the key (front)
    const key = new T.Group(); key.position.set(.06, .08, .1); g.add(key);
    key.add(mesh(new T.BoxGeometry(.42, .02, .07), brass).translateY(.01));
    [-.03, .03].forEach(z => key.add(mesh(new T.CylinderGeometry(.013, .016, .09, 16), brass).translateY(.055).translateX(-.08).translateZ(z)));
    const lever = new T.Group(); lever.position.set(-.08, .1, 0); key.add(lever);
    lever.add(mesh(new T.BoxGeometry(.4, .018, .032), brass).translateX(.1));
    lever.add(mesh(new T.CylinderGeometry(.045, .05, .025, 32), M.rubber()).translateX(.3).translateY(.03));
    lever.add(mesh(new T.CylinderGeometry(.04, .04, .035, 32), M.lacquer()).translateX(.3).translateY(.055));
    // the sounder (back): two copper coils under a brass armature on a tall frame
    const snd = new T.Group(); snd.position.set(-.14, .08, -.08); g.add(snd);
    snd.add(mesh(new T.BoxGeometry(.3, .03, .14), brass).translateY(.015));
    const coilTex = canvasTex(64, 256, (c, w, h) => { for (let y = 0; y < h; y += 3) { c.fillStyle = y % 6 ? '#b8683a' : '#7e3f1e'; c.fillRect(0, y, w, 3); } });
    coilTex.wrapS = coilTex.wrapT = T.RepeatWrapping; coilTex.repeat.set(4, 2);
    [-.06, .06].forEach(x => { const coil = mesh(new T.CylinderGeometry(.045, .045, .2, 32), new T.MeshPhysicalMaterial({ map: coilTex, metalness: .6, roughness: .35 })); coil.position.set(x, .13, 0); snd.add(coil);
      snd.add(mesh(new T.CylinderGeometry(.05, .05, .015, 32), M.lacquer()).translateX(x).translateY(.235)); });
    [-.13, .13].forEach(x => snd.add(mesh(new T.BoxGeometry(.02, .38, .03), brass).translateX(x).translateY(.2)));
    snd.add(mesh(new T.BoxGeometry(.3, .022, .04), brass).translateY(.39));
    const arm = mesh(new T.BoxGeometry(.24, .018, .05), brass); arm.position.y = .27; snd.add(arm);
    snd.add(mesh(new T.CylinderGeometry(.01, .01, .14, 12), brass).translateY(.32).translateX(.1));
    // tape reel standing at the left end, tape running to the front
    const reel = new T.Group(); reel.position.set(-.33, .3, .05); g.add(reel);
    [-.022, .022].forEach(z => { const fl = mesh(new T.TorusGeometry(.15, .012, 12, 64), M.gold()); fl.position.z = z; reel.add(fl); for (let k = 0; k < 6; k++) { const sp = mesh(new T.BoxGeometry(.008, .29, .006), M.gold()); sp.rotation.z = k / 6 * Math.PI; sp.position.z = z; reel.add(sp); } });
    reel.add(mesh(new T.CylinderGeometry(.09, .09, .04, 48), new T.MeshStandardMaterial({ color: 0xf4efe2, roughness: .85 })).rotateX(Math.PI / 2));
    reel.add(mesh(new T.CylinderGeometry(.015, .015, .07, 16), brass).rotateX(Math.PI / 2));
    g.add(mesh(new T.BoxGeometry(.02, .24, .02), brass).translateX(-.33).translateY(.18).translateZ(.05));
    const tape = canvasTex(1024, 32, (c, w, h) => { c.fillStyle = '#f4efe2'; c.fillRect(0, 0, w, h); c.fillStyle = P.color;
      const code = '-- ...  ... -- / -.- .. .-'; let x = 20; for (const ch of code) { if (ch === '.') { c.beginPath(); c.arc(x, h / 2, 6, 0, TAU); c.fill(); x += 22; } else if (ch === '-') { c.fillRect(x - 6, h / 2 - 6, 34, 12); x += 46; } else x += 26; } });
    const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push(v3(-.33 + t * .65, .19 - t * .1 + Math.sin(t * 3) * .015, .05 + t * .22)); }
    const curve = new T.CatmullRomCurve3(pts), ribbon = new T.BufferGeometry(), pos = [], uv = [], idx = [];
    for (let i = 0; i <= 80; i++) { const t = i / 80, p = curve.getPoint(t); pos.push(p.x, p.y - .014, p.z, p.x, p.y + .014, p.z); uv.push(t, 0, t, 1); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    ribbon.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); ribbon.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); ribbon.setIndex(idx); ribbon.computeVertexNormals();
    g.add(new T.Mesh(ribbon, new T.MeshStandardMaterial({ map: tape, side: T.DoubleSide, roughness: .8 })));
    g.userData.tick = t => { lever.rotation.z = (Math.sin(t * 9) > .3 ? -.04 : 0); arm.rotation.z = lever.rotation.z * .5; reel.rotation.z = -t * .4; };
    g.scale.setScalar(1.1);
    return g;
  },
  // A real desk calculator in graphite, its equals key blown up and glossy in Kalculator's purple.
  kalculator(M, P) {
    const g = new T.Group(), W = .46, D = .62;
    const bodyMat = new T.MeshPhysicalMaterial({ color: 0x2a2a2e, roughness: .42, clearcoat: .5, clearcoatRoughness: .3 });
    // wedge body, higher at the back
    const side = new T.Shape(); side.moveTo(-D / 2, 0); side.lineTo(D / 2, 0); side.lineTo(D / 2, .05); side.lineTo(-D / 2, .1); side.lineTo(-D / 2, 0);
    const bg = new T.ExtrudeGeometry(side, { depth: W, bevelEnabled: true, bevelThickness: .012, bevelSize: .012, bevelSegments: 4 }); bg.translate(0, 0, -W / 2); bg.rotateY(-Math.PI / 2);
    g.add(mesh(bg, bodyMat));
    const tilt = Math.atan2(.05, D), top = new T.Group(); top.position.y = .075 + .012; top.rotation.x = tilt; g.add(top);
    // display
    const lcd = canvasTex(512, 128, (c, w, h) => { c.fillStyle = '#c9d2c2'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(40,48,36,.9)'; c.font = '600 64px Georgia, serif'; c.textAlign = 'right'; c.fillText('√2 × √2 = 2', w - 24, 86);
      c.fillStyle = 'rgba(40,48,36,.25)'; c.font = '22px monospace'; c.textAlign = 'left'; c.fillText('Kalculator', 18, 30); });
    top.add(mesh(new T.BoxGeometry(W * .86, .012, .12), M.lacquer()).translateZ(-D * .36));
    const screen = new T.Mesh(new T.PlaneGeometry(W * .8, .095), new T.MeshStandardMaterial({ map: lcd, roughness: .3 })); screen.rotation.x = -Math.PI / 2; screen.position.set(0, .0065, -D * .36); top.add(screen);
    // key grid: 4 columns x 5 rows of domed keys
    const keyMat = new T.MeshPhysicalMaterial({ color: 0x3a3a3f, roughness: .45, clearcoat: .4 }), opMat = new T.MeshPhysicalMaterial({ color: 0xc9c4ba, roughness: .4, clearcoat: .4 });
    const keyGeo = new T.CylinderGeometry(.03, .033, .022, 32);
    const LABELS = [['C', '÷', '×', '−'], ['7', '8', '9', '+'], ['4', '5', '6', '%'], ['1', '2', '3', ''], ['0', '.', '', '']];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { if (c >= 2 && r >= 3) continue;
      const x = (c - 1.5) * .1, z = -D * .18 + r * .085, m = (c === 3 || r === 0) ? opMat : keyMat; const k = mesh(keyGeo, m); k.position.set(x, .011, z); top.add(k);
      const lt = canvasTex(64, 64, (g2, w, h) => { g2.fillStyle = (c === 3 || r === 0) ? '#c9c4ba' : '#3a3a3f'; g2.fillRect(0, 0, w, h); g2.fillStyle = (c === 3 || r === 0) ? '#2a2a2e' : '#f1ede6'; g2.font = '600 34px Helvetica, Arial, sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText(LABELS[r][c], 32, 34); });
      const face = new T.Mesh(new T.CircleGeometry(.029, 32), new T.MeshPhysicalMaterial({ map: lt, roughness: .4, clearcoat: .4 })); face.rotation.x = -Math.PI / 2; face.position.set(x, .0225, z); top.add(face); }
    // the oversized equals key, spilling over the edge
    const eqMat = new T.MeshPhysicalMaterial({ color: new T.Color(P.color), roughness: .12, clearcoat: 1, clearcoatRoughness: .05, iridescence: .45, iridescenceIOR: 1.4, sheen: .5, sheenColor: new T.Color(0xf472b6) });
    const eq = mesh(new T.RoundedBoxGeometry(.16, .11, .22, 8, .05), eqMat); eq.position.set(.165, .05, D * .2); top.add(eq);
    const bars = new T.MeshStandardMaterial({ color: 0xffffff, roughness: .25 });
    [-.03, .03].forEach(z => { const b = mesh(new T.RoundedBoxGeometry(.09, .016, .03, 3, .007), bars); b.position.set(.165, .108, D * .2 + z); top.add(b); });
    // propped on a small easel so its face meets the viewer
    const easel = new T.Group(); easel.add(g); g.rotation.x = 1.0; g.position.set(0, .29, -.12);
    const stand = mesh(new T.BoxGeometry(.04, .42, .02), M.lacquer()); stand.position.set(0, .2, -.3); stand.rotation.x = -.42; easel.add(stand);
    easel.add(mesh(new T.BoxGeometry(.6, .03, .5), M.lacquer()).translateY(.015).translateZ(-.12));
    easel.rotation.y = -.3; const w = new T.Group(); w.add(easel); easel.scale.setScalar(1.15); return w;
  },
  // Sound made visible: a vinyl disc ringed by golden bars that breathe with the music.
  audioptix(M) {
    const g = new T.Group();
    const disc = new T.Group();
    disc.add(mesh(new T.CylinderGeometry(.3, .3, .012, 96), M.lacquer()));
    disc.add(mesh(new T.CylinderGeometry(.1, .1, .014, 64), M.gold()));
    disc.add(mesh(new T.CylinderGeometry(.012, .012, .03, 16), M.silver()));
    const bars = [], n = 72;
    for (let i = 0; i < n; i++) { const a = i / n * TAU, b = mesh(new T.BoxGeometry(.012, 1, .012), M.gold()); b.geometry.translate(0, .5, 0);
      b.position.set(Math.cos(a) * .32, 0, Math.sin(a) * .32); b.rotation.set(0, -a, -Math.PI / 2); disc.add(b); bars.push(b); }
    disc.rotation.x = Math.PI / 2 - .5; disc.position.y = .5; g.add(disc);
    g.add(mesh(new T.CylinderGeometry(.01, .014, .3, 16), M.silver()).translateY(.15));
    g.add(plinth(M, .14, .03).translateY(.015));
    g.userData.tick = t => bars.forEach((b, i) => { const h = .03 + .09 * Math.abs(Math.sin(t * 2.2 + i * .37) * Math.sin(t * 1.3 + i * .11)); b.scale.set(1, h, 1); });
    g.userData.tick(0);
    return g;
  },
  // The Swan Station counter: a steel housing with split flaps reading 108.
  lostimer(M) {
    const g = new T.Group();
    g.add(mesh(new T.RoundedBoxGeometry(.9, .32, .2, 4, .03), M.silver()).translateY(.2));
    const digits = ['1', '0', '8', '0', '0'];
    digits.forEach((d, i) => {
      const tex = canvasTex(128, 192, (c, w, h) => { c.fillStyle = i > 2 ? '#d9d4c7' : '#121212'; c.fillRect(0, 0, w, h); c.fillStyle = i > 2 ? '#121212' : '#f2efe6';
        c.font = 'bold 150px Helvetica, Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(d, w / 2, h / 2 + 8); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, h / 2 - 2, w, 4); });
      const flap = new T.Mesh(new T.PlaneGeometry(.13, .2), new T.MeshStandardMaterial({ map: tex, roughness: .5 }));
      flap.position.set(-.32 + i * .15 + (i > 2 ? .03 : 0), .2, .101); g.add(flap);
    });
    g.add(mesh(new T.BoxGeometry(.95, .02, .26), M.lacquer()).translateY(.03));
    [-1, 1].forEach(s => g.add(mesh(new T.CylinderGeometry(.015, .015, .02, 16), M.lacquer()).translateY(.04).translateX(s * .4)));
    return g;
  },
  // Lumon's MDR workstation: a cream terminal, its screen full of numbers.
  pseudoku(M, P) {
    const g = new T.Group(), cream = M.enamel(0xe8e2d0);
    g.add(mesh(new T.RoundedBoxGeometry(.56, .44, .44, 5, .06), cream).translateY(.36));
    const scr = canvasTex(512, 384, (c, w, h) => { c.fillStyle = '#071723'; c.fillRect(0, 0, w, h); c.fillStyle = P.color; c.font = '28px Courier New, monospace'; c.textAlign = 'center';
      for (let y = 0; y < 8; y++) for (let x = 0; x < 10; x++) { c.globalAlpha = .45 + ((x * 7 + y * 3) % 5) * .12; c.fillText(String((x * 3 + y * 7) % 10), 30 + x * 50, 60 + y * 42); }
      c.globalAlpha = 1; c.strokeStyle = P.color; c.lineWidth = 2; c.strokeRect(12, 12, w - 24, h - 24); });
    const screen = new T.Mesh(new T.PlaneGeometry(.42, .31), M.screen(scr)); screen.position.set(0, .37, .221); g.add(screen);
    g.add(mesh(new T.BoxGeometry(.6, .05, .24), cream).translateY(.025).translateZ(.34).rotateX(.08));
    g.add(mesh(new T.SphereGeometry(.035, 24, 16), M.lacquer()).translateY(.06).translateZ(.34).translateX(.24));
    g.add(mesh(new T.BoxGeometry(.3, .14, .3), cream).translateY(.07));
    g.userData.tick = t => { scr.offset.y = 0; };
    return g;
  },
  // A black monolith on a black river; the digital rain falls inside it.
  constyx(M, P) {
    const g = new T.Group();
    const cols = 24, drops = Array.from({ length: cols }, (_, i) => (i * 37) % 40);
    const rain = canvasTex(256, 640, (c, w, h) => { c.fillStyle = '#000'; c.fillRect(0, 0, w, h); });
    const draw = t => { const { g: c } = rain.userData, w = 256, h = 640; c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(0, 0, w, h); c.font = '18px monospace';
      for (let i = 0; i < cols; i++) { const y = ((drops[i] + t * (6 + (i % 5))) % 40) * 18; c.fillStyle = '#c9ffd6'; c.fillText(String.fromCharCode(0x30a0 + ((i * 13 + Math.floor(t * 9)) % 90)), i * 10.6, y); c.fillStyle = P.color; c.fillText(String.fromCharCode(0x30a0 + ((i * 7 + Math.floor(t * 5)) % 90)), i * 10.6, y - 18); }
      rain.needsUpdate = true; };
    for (let k = 0; k < 40; k++) draw(k * .1);
    g.add(mesh(new T.BoxGeometry(.32, .9, .1), M.lacquer()).translateY(.47));
    const face = new T.Mesh(new T.PlaneGeometry(.28, .86), M.screen(rain)); face.position.set(0, .47, .051); g.add(face);
    const river = mesh(new T.CylinderGeometry(.45, .45, .01, 96), new T.MeshPhysicalMaterial({ color: 0x020403, metalness: .2, roughness: .05, clearcoat: 1 }));
    river.position.y = .005; g.add(river);
    // there is no spoon: a silver spoon standing up from a small base, its upper half bent towards the viewer
    const spoon = new T.Group(), silver = M.silver(), B = 1.0;
    const hpts = []; for (let i = 0; i <= 30; i++) { const t = i / 30, a = Math.max(0, t - .5) / .5 * B, L = .2;
      hpts.push(t <= .5 ? [0, t * L, 0] : [(1 - Math.cos(a)) / B * (t - .5) * L * 1.6, .5 * L + Math.sin(a) / B * (t - .5) * L, 0]); }
    spoon.add(mesh(tube(hpts, .0055, 60), silver));
    const tip = new T.Vector3(...hpts[30]), dir = new T.Vector3(Math.sin(B), Math.cos(B), 0), up = new T.Vector3(0, 0, -1);
    const bowl = mesh(new T.SphereGeometry(.065, 32, 16, 0, TAU, 0, .95), new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: .06, side: T.DoubleSide }));
    bowl.geometry.scale(.62, .45, 1.15); const xAxis = new T.Vector3().crossVectors(up, dir);
    bowl.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(xAxis, up, dir)); bowl.position.copy(tip).addScaledVector(dir, .06).addScaledVector(up, -.016); spoon.add(bowl);
    spoon.scale.setScalar(2.1); spoon.position.set(-.04, .075, .24); spoon.rotation.y = 0; g.add(spoon);
    g.add(mesh(new T.CylinderGeometry(.09, .1, .07, 40), M.lacquer()).translateY(.04).translateZ(.24));
    g.userData.tick = t => draw(t);
    return g;
  },
  // A 35 mm reel with film running off it: the ledger of everything watched.
  drxrates(M) {
    const g = new T.Group();
    const s = new T.Shape(); s.absarc(0, 0, .34, 0, TAU, false);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .3, h = new T.Path(); h.absarc(Math.cos(a) * .19, Math.sin(a) * .19, .075, 0, TAU, true); s.holes.push(h); }
    const hub = new T.Path(); hub.absarc(0, 0, .03, 0, TAU, true); s.holes.push(hub);
    const reel = mesh(new T.ExtrudeGeometry(s, { depth: .03, bevelEnabled: true, bevelSize: .006, bevelThickness: .006, curveSegments: 64 }), M.silver());
    reel.position.set(0, .45, -.015); g.add(reel);
    const core = mesh(new T.CylinderGeometry(.27, .27, .022, 96), M.lacquer()); core.rotation.x = Math.PI / 2; core.position.set(0, .45, 0); g.add(core);
    const film = canvasTex(64, 1024, (c, w, h) => { c.fillStyle = '#2a1f14'; c.fillRect(0, 0, w, h); c.fillStyle = '#d9c29a';
      for (let y = 6; y < h; y += 22) { c.fillRect(4, y, 8, 12); c.fillRect(w - 12, y, 8, 12); } c.fillStyle = 'rgba(201,168,106,.55)'; for (let y = 0; y < h; y += 90) c.fillRect(16, y + 6, w - 32, 78); });
    film.wrapS = film.wrapT = T.RepeatWrapping;
    const pts = []; for (let i = 0; i <= 50; i++) { const t = i / 50; pts.push(v3(.3 + t * .32, .45 - t * .44 + Math.sin(t * 4) * .03, .02 + Math.sin(t * 5) * .08)); }
    const curve = new T.CatmullRomCurve3(pts), geo = new T.BufferGeometry(), pos = [], uv = [], idx = [];
    for (let i = 0; i <= 100; i++) { const t = i / 100, p = curve.getPoint(t); pos.push(p.x, p.y, p.z - .03, p.x, p.y, p.z + .03); uv.push(0, t * 3, 1, t * 3); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    g.add(new T.Mesh(geo, new T.MeshStandardMaterial({ map: film, side: T.DoubleSide, roughness: .35, metalness: .2 })));
    g.add(mesh(new T.BoxGeometry(.16, .1, .12), M.lacquer()).translateY(.05));
    g.add(mesh(new T.CylinderGeometry(.015, .015, .32, 16), M.silver()).translateY(.25));
    return g;
  },
  // A round mirror on a stand: the one project that is about Kia.
  website(M, P) {
    const g = new T.Group();
    const mirror = new T.Group();
    mirror.add(mesh(new T.CylinderGeometry(.27, .27, .01, 96), new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: .0 })).rotateX(Math.PI / 2));
    mirror.add(mesh(new T.TorusGeometry(.275, .022, 16, 120), M.enamel(new T.Color(P.color).getHex())));
    mirror.add(mesh(new T.TorusGeometry(.252, .006, 12, 120), M.gold()));
    mirror.position.y = .55; mirror.rotation.y = -.35; g.add(mirror);
    g.add(mesh(new T.CylinderGeometry(.012, .012, .3, 16), M.gold()).translateY(.15));
    g.add(plinth(M, .14, .04).translateY(.02));
    return g;
  },
};

// Why each object: shown in the sculpture study.
export const WHY = {
  polymeratlas: 'One continuous gold wire wound into a globe: a long chain that becomes a world.',
  xefy: 'A silver cloche lifted off a glazed roast chicken, with lemon and rosemary.',
  markey: 'A streamliner in aluminium with the wind tunnel\'s airflow passing over it.',
  exir: 'A crystal coupe holding amber, with a twist of peel on the rim.',
  armag: 'A single cartridge in brass and copper, standing to attention. Respect every round.',
  perceptense: 'An antique balance holding a feather level with a gold weight: a sense of how much things are.',
  galerium: 'A gilded doorway left ajar, warm light behind it.',
  lalista: 'Spanish opens its questions and exclamations: ¡ and ¿ as two enamel monoliths.',
  morcypher: 'A full telegraph set: brass key, sounder on copper coils, and a reel of tape still running.',
  kalculator: 'A real desk calculator whose equals key is blown up in Kalculator purple.',
  audioptix: 'A vinyl disc ringed by golden bars that move with the music.',
  lostimer: 'The Swan Station counter, flaps reading 108. Push the button.',
  pseudoku: 'Lumon\'s cream workstation, its screen full of scary numbers.',
  constyx: 'A black monolith on a black river, digital rain falling inside it, and a spoon that bends.',
  drxrates: 'A 35 mm reel with film running off it: the ledger of everything watched.',
  website: 'A round mirror. The one project that is about Kia.',
};

export function makeSculpture(project, style = 'luxe') {
  const M = materials(style), build = BUILD[project.slug];
  const g = build ? build(M, project) : new T.Group();
  const outer = g.userData.tick ? g : new T.Group().add(g);
  if (!outer.userData.tick) outer.userData.tick = () => {};
  outer.userData.slug = project.slug;
  return outer;
}
