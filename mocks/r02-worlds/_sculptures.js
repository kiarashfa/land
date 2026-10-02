// Bespoke procedural sculptures, one per project (D-021).
// Each returns a THREE.Group standing on y = 0, about one unit tall, footprint within r ≈ 0.55.
// group.userData.tick(t) animates moving parts (bars, rain, screens) when a world calls it.
// `style` swaps the whole material set so worlds can restyle every object at once:
//   'luxe' (default PBR: gold, silver, enamel, glass), 'chrome' (all mirror), 'paper' (matte white), 'ink' (black lacquer).
import * as T from '../vendor/three.bundle.min.js';

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
  // A silver cloche lifted off a porcelain plate, light escaping from the dish beneath.
  xefy(M, P) {
    const g = new T.Group();
    g.add(mesh(lathe([[0, 0], [.42, 0], [.46, .012], [.47, .03], [.40, .03], [.12, .022], [0, .022]]), M.porcelain()));
    const dish = mesh(new T.SphereGeometry(.13, 48, 24, 0, TAU, 0, Math.PI / 2), M.glow(0xffb36b)); dish.scale.y = .55; dish.position.y = .025; g.add(dish);
    const dome = new T.Group();
    const prof = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI / 2; prof.push([Math.cos(a) * .36, Math.sin(a) * .34]); }
    prof.unshift([.37, -.005]);
    dome.add(mesh(lathe(prof), M.silver()));
    dome.add(mesh(new T.SphereGeometry(.035, 32, 16), M.silver()).translateY(.36));
    dome.add(mesh(new T.CylinderGeometry(.012, .02, .03, 16), M.silver()).translateY(.335));
    dome.position.set(-.02, .3, -.16); dome.rotation.set(-.62, 0, .14); g.add(dome);
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
  // A glass orb holding an iris: perception through a lens.
  perceptense(M, P) {
    const g = new T.Group();
    g.add(mesh(new T.SphereGeometry(.3, 64, 48), M.glass()).translateY(.42));
    const iris = new T.Group();
    iris.add(mesh(new T.CylinderGeometry(.15, .15, .012, 64), M.enamel(new T.Color(P.color).getHex())));
    iris.add(mesh(new T.CylinderGeometry(.06, .06, .016, 48), M.lacquer()));
    iris.add(mesh(new T.TorusGeometry(.152, .008, 12, 96), M.gold()).rotateX(Math.PI / 2));
    iris.rotation.x = Math.PI / 2; iris.position.set(0, .42, .02); g.add(iris);
    g.add(mesh(new T.TorusGeometry(.13, .02, 16, 96), M.gold()).rotateX(Math.PI / 2).translateZ(-.13));
    g.add(plinth(M, .15, .1).translateY(.05));
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
  // A brass telegraph key on a lacquered base, paper tape running out of it.
  morcypher(M, P) {
    const g = new T.Group();
    g.add(mesh(new T.BoxGeometry(.7, .06, .32), M.wood()).translateY(.03));
    g.add(mesh(new T.BoxGeometry(.6, .015, .06), M.brass()).translateY(.068));
    [-.12, .12].forEach(z => g.add(mesh(new T.CylinderGeometry(.018, .022, .12, 20), M.brass()).translateY(.12).translateX(-.05).translateZ(z * .5)));
    const lever = new T.Group();
    lever.add(mesh(new T.BoxGeometry(.56, .025, .04), M.brass()).translateX(.08));
    lever.add(mesh(new T.CylinderGeometry(.06, .07, .03, 32), M.rubber()).translateX(.33).translateY(.04));
    lever.add(mesh(new T.CylinderGeometry(.05, .05, .045, 32), M.lacquer()).translateX(.33).translateY(.065));
    lever.position.set(-.05, .17, 0); lever.rotation.z = -.05; g.add(lever);
    g.add(mesh(new T.CylinderGeometry(.03, .03, .04, 20), M.brass()).translateX(.26).translateY(.1));
    const tape = canvasTex(1024, 32, (c, w, h) => { c.fillStyle = '#f4efe2'; c.fillRect(0, 0, w, h); c.fillStyle = P.color;
      const code = '-- ...  ... -- / -.- .. .-'; let x = 20; for (const ch of code) { if (ch === '.') { c.beginPath(); c.arc(x, h / 2, 6, 0, TAU); c.fill(); x += 22; } else if (ch === '-') { c.fillRect(x - 6, h / 2 - 6, 34, 12); x += 46; } else x += 26; } });
    const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push(v3(-.35 - t * .35, .065 - t * .06 + Math.sin(t * 3) * .02, -.12 + t * .25 + Math.sin(t * 6) * .04)); }
    const curve = new T.CatmullRomCurve3(pts), ribbon = new T.BufferGeometry(), pos = [], uv = [], idx = [];
    for (let i = 0; i <= 80; i++) { const t = i / 80, p = curve.getPoint(t); pos.push(p.x, p.y - .012, p.z, p.x, p.y + .012, p.z); uv.push(t, 0, t, 1); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    ribbon.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); ribbon.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); ribbon.setIndex(idx); ribbon.computeVertexNormals();
    g.add(new T.Mesh(ribbon, new T.MeshStandardMaterial({ map: tape, side: T.DoubleSide, roughness: .8 })));
    g.scale.setScalar(1.15);
    return g;
  },
  // One oversized key, the equals sign, in Kalculator's violet.
  kalculator(M, P) {
    const g = new T.Group();
    const keyMat = new T.MeshPhysicalMaterial({ color: new T.Color(P.color), roughness: .3, clearcoat: 1, clearcoatRoughness: .1, flatShading: true });
    const cap = new T.Mesh(new T.CylinderGeometry(.25, .33, .24, 4, 1), keyMat); cap.rotation.y = Math.PI / 4; cap.position.y = .2; cap.castShadow = true; g.add(cap);
    const face = new T.Mesh(new T.PlaneGeometry(.352, .352), new T.MeshPhysicalMaterial({ color: 0xc99bf7, roughness: .35, clearcoat: 1 })); face.rotation.x = -Math.PI / 2; face.position.y = .321; g.add(face);
    [-.05, .05].forEach(z => g.add(mesh(new T.RoundedBoxGeometry(.18, .025, .045, 3, .01), M.enamel(0x2b0f4a)).translateY(.332).translateZ(z)));
    g.add(mesh(new T.CylinderGeometry(.05, .05, .08, 4), M.lacquer()).translateY(.04));
    g.add(mesh(new T.RoundedBoxGeometry(.6, .03, .6, 3, .012), M.lacquer()).translateY(.015));
    g.rotation.y = .35; g.scale.setScalar(1.3); const w = new T.Group(); w.add(g); return w;
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
  xefy: 'A silver cloche lifting off a glowing dish, the moment a plate arrives.',
  markey: 'A streamliner in aluminium with the wind tunnel\'s airflow passing over it.',
  exir: 'A crystal coupe holding amber, with a twist of peel on the rim.',
  armag: 'A single cartridge in brass and copper, standing to attention. Respect every round.',
  perceptense: 'A glass orb holding an iris: seeing things clearly through a lens.',
  galerium: 'A gilded doorway left ajar, warm light behind it.',
  lalista: 'Spanish opens its questions and exclamations: ¡ and ¿ as two enamel monoliths.',
  morcypher: 'A brass telegraph key, with the paper tape still running.',
  kalculator: 'One oversized key, the equals sign, in Kalculator\'s violet.',
  audioptix: 'A vinyl disc ringed by golden bars that move with the music.',
  lostimer: 'The Swan Station counter, flaps reading 108. Push the button.',
  pseudoku: 'Lumon\'s cream workstation, its screen full of scary numbers.',
  constyx: 'A black monolith on a black river, digital rain falling inside it.',
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
