// Mercury engine (Round 04). Mercury binds every page of the site:
//  • the liquid: a ray-marched pair of droplets that fuse and pour into a project's shape,
//  • the emblem: the project's sculpture in pure mercury (chrome), which can bloom into its real
//    colours through a molten front (only when you open a project),
//  • the room: the Atelier (dark gallery, softboxes) on capable machines, the void of Round 02 elsewhere.
// Rebuilt from Round 03 for robustness: no three.js Reflector and no RectAreaLights. Floor reflections are
// mirrored copies under a translucent floor, and the liquid reflects itself in the floor inside its own shader.
// A guard pass clears NaN and Inf before bloom, so one bad pixel can never spread into black blocks.
import * as T from '../vendor/three.r03.min.js';
import { makeSculpture } from './_sculptures.js';

export const PLINTH_TOP = .5;

// ---------- quality tiers ----------
export const TIERS = {
  high: { name: 'Atelier', dpr: 2, shadows: 2048, dust: 160, steps: 110, haze: true, room: 'atelier', bloomRes: 1 },
  mid: { name: 'Atelier, lighter', dpr: 1.5, shadows: 0, dust: 60, steps: 84, haze: true, room: 'atelier', bloomRes: .5 },
  low: { name: 'Void', dpr: 1, shadows: 0, dust: 0, steps: 64, haze: false, room: 'void', bloomRes: .5 },
};
export function readGPU(){
  try { const c = document.createElement('canvas'), gl = c.getContext('webgl2'); if (!gl) return { webgl2: false, name: '' };
    const ext = gl.getExtension('WEBGL_debug_renderer_info'), name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    const lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext(); return { webgl2: true, name }; } catch (e) { return { webgl2: false, name: '' }; }
}
// First guess from what the browser tells us; the page then times real frames and may step down.
export function guessTier(){
  const q = new URLSearchParams(location.search).get('tier'); if (TIERS[q]) return { tier: q, why: 'set in the address', locked: true };
  let saved = null; try { saved = localStorage.getItem('kfa-tier'); } catch (_) {}
  if (TIERS[saved]) return { tier: saved, why: 'your earlier choice', locked: true };
  const g = readGPU(), coarse = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 1000;
  if (!g.webgl2) return { tier: 'low', why: 'this browser has no WebGL 2' };
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(g.name)) return { tier: 'low', why: 'software graphics', gpu: g.name };
  if (coarse) return { tier: 'mid', why: 'a phone or tablet', gpu: g.name };
  const cores = navigator.hardwareConcurrency || 8, mem = navigator.deviceMemory || 8;
  if (cores <= 4 && mem <= 4) return { tier: 'mid', why: 'a lighter computer', gpu: g.name };
  return { tier: 'high', why: 'a capable graphics card', gpu: g.name };
}
export const saveTier = t => { try { localStorage.setItem('kfa-tier', t); } catch (_) {} };
// Average frame time over a short window of real frames (ms). `render` draws one frame.
export function timeFrames(render, { warm = 8, frames = 24, maxMs = 2600 } = {}){
  return new Promise(res => { const ts = []; let n = 0, t0 = performance.now(), last = t0;
    const step = now => { render(now); n++; if (n > warm) ts.push(now - last); last = now;
      if (n >= warm + frames || now - t0 > maxMs) { ts.sort((a, b) => a - b); res(ts.length ? ts[Math.floor(ts.length * .5)] : 999); } else requestAnimationFrame(step); };
    requestAnimationFrame(step); });
}

// ---------- the environment every reflection sees: a dark room with the Atelier's softboxes ----------
function envRoom(){
  const s = new T.Scene(); s.background = new T.Color(0x030303);
  const box = new T.Mesh(new T.BoxGeometry(26, 14, 26), new T.MeshBasicMaterial({ color: 0x060606, side: T.BackSide })); box.position.y = 6; s.add(box);
  const ceil = new T.Mesh(new T.PlaneGeometry(26, 26), new T.MeshBasicMaterial({ color: 0x232325 })); ceil.rotation.x = Math.PI / 2; ceil.position.y = 12.9; s.add(ceil);
  const lum = (w, h, I, x, y, z, ry = 0, rx = 0, col = 0xfff0de) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(col).multiplyScalar(I), side: T.DoubleSide })); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); s.add(m); };
  [[-4.4, 1], [4.4, 1], [-8.4, .6], [8.4, .6]].forEach(([x, k]) => lum(.55, 5.2, 7 * k, x, 3.2, -7));
  lum(1.1, 6, 3.2, -10, 3.2, 1.5, Math.PI / 2); lum(1.1, 6, 2.4, 10, 3.2, -.5, -Math.PI / 2);
  lum(4.2, 2.4, 4.5, 0, 6.6, -.4, 0, Math.PI / 2);
  lum(14, .4, .9, 0, .5, 9, Math.PI, 0, 0xd2dcff);
  const fl = new T.Mesh(new T.PlaneGeometry(40, 40), new T.MeshBasicMaterial({ color: 0x0b0b0c })); fl.rotation.x = -Math.PI / 2; s.add(fl);
  return s;
}
export function makeEnv(renderer){
  const room = envRoom(), pm = new T.PMREMGenerator(renderer), pmrem = pm.fromScene(room, .015).texture; pm.dispose();
  const rt = new T.WebGLCubeRenderTarget(256, { type: T.HalfFloatType, generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter });
  const cc = new T.CubeCamera(.1, 100, rt); cc.position.set(0, 1.1, 0); cc.update(renderer, room);
  return { pmrem, cube: rt.texture };
}

// ---------- the liquid ----------
const LIQUID_VS = `void main(){ gl_Position = vec4(position.xy, 0., 1.); }`;
const LIQUID_FS = `
precision highp sampler3D;
uniform vec4 uView; uniform mat4 uInvProj, uCamWorld; uniform float uTime;
uniform vec4 uA, uB; uniform float uK, uWob, uMorph, uHide;
uniform sampler3D uSdf; uniform vec3 uBoxMin, uBoxMax, uObjPos; uniform float uObjRot, uObjScale;
uniform samplerCube uEnv; uniform float uEnvGain; uniform vec4 uBound; uniform int uSteps; uniform float uMirrorY, uMirror;
uniform mat4 projectionMatrix;
float smin(float a, float b, float k){ float h = clamp(.5 + .5*(b-a)/k, 0., 1.); return mix(b, a, h) - k*h*(1.-h); }
float sdObj(vec3 p){
  vec3 q = (p - uObjPos) / uObjScale; float c = cos(uObjRot), s = sin(uObjRot); q.xz = mat2(c, -s, s, c) * q.xz;
  vec3 e = uBoxMax - uBoxMin, cl = clamp((q - uBoxMin) / e, 0., 1.), qc = uBoxMin + cl * e;
  return (texture(uSdf, cl).r + length(q - qc)) * uObjScale;
}
float map(vec3 p){
  float w = sin(p.x*7.+uTime*1.7)*sin(p.y*8.-uTime*1.3)*sin(p.z*7.+uTime)*.022*uWob;
  float d = smin(length(p - uA.xyz) - uA.w, length(p - uB.xyz) - uB.w, uK) + w;
  if (uMorph > 0.) d = mix(d, sdObj(p), uMorph);
  return d + uHide;
}
vec3 nrm(vec3 p){ vec2 e = vec2(.0015, -.0015); return normalize(e.xyy*map(p+e.xyy) + e.yyx*map(p+e.yyx) + e.yxy*map(p+e.yxy) + e.xxx*map(p+e.xxx) + 1e-6); }
bool march(vec3 ro, vec3 rd, out vec3 p){
  vec3 oc = ro - uBound.xyz; float b = dot(oc, rd), c = dot(oc, oc) - uBound.w*uBound.w, h = b*b - c;
  if (h < 0.) return false;
  float t = max(0., -b - sqrt(h)), tEnd = -b + sqrt(h);
  for (int i = 0; i < 128; i++) { if (i >= uSteps) break; p = ro + rd*t; float d = map(p); if (d < .0012) return true; t += d * .75; if (t > tEnd) return false; }
  return false;
}
vec3 shade(vec3 p, vec3 rd){
  vec3 n = nrm(p), r = reflect(rd, n);
  float fr = .62 + .38 * pow(1. - clamp(dot(n, -rd), 0., 1.), 4.);
  vec3 col = texture(uEnv, r).rgb * uEnvGain * vec3(.93, .94, .97) * fr;
  col += vec3(1.) * pow(max(dot(r, normalize(vec3(.3, 1., .4))), 0.), 90.) * .6;
  return col;
}
float depthOf(vec3 p){ vec4 clip = projectionMatrix * viewMatrix * vec4(p, 1.); return clip.z / clip.w * .5 + .5; }
void main(){
  vec2 ndc = (gl_FragCoord.xy - uView.xy) / uView.zw * 2. - 1.;
  vec4 vp = uInvProj * vec4(ndc, 1., 1.); vp /= vp.w;
  vec3 ro = cameraPosition, rd = normalize((uCamWorld * vec4(vp.xyz, 0.)).xyz), p, col;
  if (march(ro, rd, p)) { col = shade(p, rd); gl_FragDepth = depthOf(p); }
  else {
    // the floor is a dark mirror: follow the ray down, bounce once, and draw what it sees "behind" the floor
    if (uMirror <= 0. || rd.y >= -.001) discard;
    float tf = (uMirrorY - ro.y) / rd.y; if (tf <= 0.) discard;
    vec3 fp = ro + rd * tf, rd2 = reflect(rd, vec3(0., 1., 0.));
    if (!march(fp + rd2 * .002, rd2, p)) discard;
    col = shade(p, rd2) * uMirror; gl_FragDepth = depthOf(vec3(p.x, 2. * uMirrorY - p.y, p.z));
  }
  if (any(isnan(col)) || any(isinf(col))) col = vec3(0.);
  gl_FragColor = vec4(min(col, vec3(60.)), 1.);
}`;

// ---------- the emblem: pure mercury that can bloom into colour ----------
const NOISE = `
float h3(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
  return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }`;
export const mercuryMat = () => new T.MeshPhysicalMaterial({ color: 0xe6eaef, metalness: 1, roughness: .06, envMapIntensity: .8 });
// mode 'chrome': visible between the colour front and the setting front; 'colour': behind the colour front.
function patch(m, EU, mode){
  m.onBeforeCompile = sh => { Object.assign(sh.uniforms, EU);
    sh.vertexShader = 'varying vec3 vDisP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vDisP = position;');
    sh.fragmentShader = 'uniform float uSet, uColour; uniform vec3 uEdge; varying vec3 vDisP;\n' + NOISE + '\n' + sh.fragmentShader
      .replace('void main() {', `void main() {
  float dn = vn(vDisP * 9.) * .7 + vn(vDisP * 31.) * .3, ds = uSet * 1.12 - .06, dc = uColour * 1.12 - .06;
  ${mode === 'chrome' ? 'if (dn > ds || dn < dc) discard;' : 'if (dn > dc) discard;'}`)
      .replace('#include <opaque_fragment>', `#include <opaque_fragment>
  ${mode === 'chrome' ? 'gl_FragColor.rgb += vec3(.9, .95, 1.) * smoothstep(.04, 0., ds - dn) * step(.001, 1. - uSet) * 3.;'
                      : 'gl_FragColor.rgb += uEdge * smoothstep(.05, 0., dc - dn) * step(.001, 1. - uColour) * 5.;'}`); };
  m.customProgramCacheKey = () => 'merc-' + mode; return m;
}
// vDisP uses object-local positions, so the pattern sticks to each part even when parts move.
function dressed(obj, EU, mode){
  obj.traverse(o => { if (!o.isMesh) return; o.castShadow = o.receiveShadow = true;
    o.material = [].concat(o.material).map(src => patch(mode === 'chrome' ? mercuryMat() : src.clone(), EU, mode));
    if (o.material.length === 1) o.material = o.material[0]; });
  return obj;
}
function fitted(p){ // the sculpture sized to stand on the plinth, about one unit tall
  const obj = makeSculpture(p), b = new T.Box3().setFromObject(obj), sz = b.getSize(new T.Vector3());
  obj.scale.setScalar((p.flagship ? 1.05 : .95) / Math.max(sz.y, sz.x * .85, sz.z * .85)); obj.updateMatrixWorld(true);
  const b2 = new T.Box3().setFromObject(obj); obj.position.y = -b2.min.y; return { obj, height: b2.max.y - b2.min.y };
}
// Four instances: chrome and colour, plus their mirror images (each has its own animated parts).
export function makeEmblem(p, EU){
  const make = () => { const c = fitted(p), k = fitted(p); dressed(c.obj, EU, 'chrome'); dressed(k.obj, EU, 'colour');
    const g = new T.Group(); g.add(c.obj, k.obj); return { g, chrome: c.obj, colour: k.obj, height: c.height }; };
  const main = make(), mirror = make();
  mirror.g.traverse(o => { if (o.isMesh) o.castShadow = false; });
  const tick = t => [main.chrome, main.colour, mirror.chrome, mirror.colour].forEach(o => o.userData.tick && o.userData.tick(t));
  return { group: main.g, mirror: mirror.g, chrome: main.chrome, colour: main.colour, height: main.height, tick };
}

// Bake an unsigned distance field (minus a thin shell) of an object, in its own frame.
export function bakeSDF(obj, N = 40){
  obj.updateMatrixWorld(true);
  const inv = new T.Matrix4().copy(obj.matrixWorld).invert(), geos = [];
  obj.traverse(o => { if (!o.isMesh || !o.geometry.attributes.position) return; const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    const ng = new T.BufferGeometry(); ng.setAttribute('position', g.attributes.position.clone()); ng.applyMatrix4(new T.Matrix4().multiplyMatrices(inv, o.matrixWorld)); geos.push(ng); });
  const merged = T.mergeGeometries(geos), bvh = new T.MeshBVH(merged);
  const box = new T.Box3().setFromBufferAttribute(merged.attributes.position).expandByScalar(.12), size = box.getSize(new T.Vector3());
  const data = new Uint16Array(N * N * N), q = new T.Vector3(), hit = {};
  for (let z = 0; z < N; z++) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    q.set(box.min.x + (x + .5) / N * size.x, box.min.y + (y + .5) / N * size.y, box.min.z + (z + .5) / N * size.z);
    bvh.closestPointToPoint(q, hit); data[x + y * N + z * N * N] = T.DataUtils.toHalfFloat(hit.distance - .016); }
  const tex = new T.Data3DTexture(data, N, N, N); tex.format = T.RedFormat; tex.type = T.HalfFloatType; tex.minFilter = tex.magFilter = T.LinearFilter; tex.unpackAlignment = 1; tex.needsUpdate = true;
  const half = size.clone().divideScalar(N * 2);
  return { tex, min: box.min.clone().add(half), max: box.max.clone().sub(half) };
}

// ---------- rooms ----------
function canvasTex(w, h, draw, repeat = [1, 1]){ const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = 8; return t; }
function rng(seed){ let s = seed >>> 0 || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822519) + 0x9e3779b9 >>> 0) / 4294967296); }
function grain(g, w, h, amp, seed = 1){ const r = rng(seed), d = g.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { const n = (r() - .5) * amp; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; } g.putImageData(d, 0, 0); }
function beam(color, rt, rb, h, I){
  const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, 48, 1, true), new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    uniforms: { uC: { value: new T.Color(color) }, uI: { value: I } },
    vertexShader: `varying vec2 vU; varying vec3 vN, vV; void main(){ vU = uv; vec4 w = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-w.xyz); gl_Position = projectionMatrix * w; }`,
    fragmentShader: `uniform vec3 uC; uniform float uI; varying vec2 vU; varying vec3 vN, vV; void main(){ gl_FragColor = vec4(uC * uI * pow(abs(dot(vN, vV)), 1.6) * pow(vU.y, 1.4), 1.); }` }));
  m.renderOrder = 10; return m;
}
const lacquer = () => new T.MeshPhysicalMaterial({ color: 0x0a0a0b, roughness: .38, clearcoat: .8, clearcoatRoughness: .14 });
const brass = () => new T.MeshPhysicalMaterial({ color: 0xcfa968, metalness: 1, roughness: .25 });
function mirrorOf(group, y){ const m = group.clone(true); m.traverse(o => { if (o.isLight) o.visible = false; if (o.isMesh) o.castShadow = false; }); m.scale.y = -1; m.position.y = 2 * y; return m; }

// The Atelier: polished black stone, a plaster wall with four tall softboxes, a lacquer plinth, a hazy key.
function atelier(ctx, cfg){
  const { scene } = ctx, g = new T.Group(), still = new T.Group(); g.add(still);
  scene.background = new T.Color(0x060607); scene.fog = new T.FogExp2(0x060607, .035);
  const plaster = canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#16151a'; c.fillRect(0, 0, w, h); grain(c, w, h, 12, 7); }, [8, 3]);
  const wall = new T.Mesh(new T.PlaneGeometry(40, 14), new T.MeshStandardMaterial({ map: plaster, roughness: .95 })); wall.position.set(0, 7, -7); still.add(wall);
  [[-4.4, 1], [4.4, 1], [-8.4, .6], [8.4, .6]].forEach(([x, k]) => {
    const box = new T.Mesh(new T.PlaneGeometry(.55, 5.2), new T.MeshBasicMaterial({ color: new T.Color(1, .93, .84).multiplyScalar(1.25 * k), fog: false })); box.position.set(x, 3.2, -6.93); still.add(box);
    const frame = new T.Mesh(new T.BoxGeometry(.7, 5.4, .1), new T.MeshStandardMaterial({ color: 0x0b0b0c, roughness: .5 })); frame.position.set(x, 3.2, -7.04); still.add(frame);
    const wash = new T.SpotLight(0xffe9d2, 22 * k, 16, .5, 1, 1.4); wash.position.set(x, 3.2, -6.6); wash.target.position.set(x * .15, .5, 0); g.add(wash, wash.target); });
  const top = new T.Mesh(new T.PlaneGeometry(2.6, 1.2), new T.MeshBasicMaterial({ color: new T.Color(1, .96, .9).multiplyScalar(1.6) })); top.rotation.x = Math.PI / 2; top.position.set(0, 6.2, -.4); still.add(top);
  const pl = new T.Mesh(new T.CylinderGeometry(.62, .66, PLINTH_TOP, 96), lacquer()); pl.position.y = PLINTH_TOP / 2; pl.castShadow = pl.receiveShadow = true; still.add(pl);
  const seam = new T.Mesh(new T.TorusGeometry(.62, .006, 8, 160), brass()); seam.rotation.x = Math.PI / 2; seam.position.y = PLINTH_TOP - .04; still.add(seam);
  // the mirror world under a translucent stone floor
  g.add(mirrorOf(still, 0));
  const stoneT = canvasTex(1024, 1024, (c, w, h) => { c.fillStyle = '#0d0d0f'; c.fillRect(0, 0, w, h); const r = rng(4);
    for (let k = 0; k < 60; k++) { c.strokeStyle = `rgba(150,150,160,${.02 + r() * .04})`; c.lineWidth = .6 + r() * 1.5; c.beginPath(); let x = r() * w, y = r() * h; c.moveTo(x, y); for (let s = 0; s < 8; s++) { x += (r() - .4) * 160; y += (r() - .5) * 90; c.lineTo(x, y); } c.stroke(); }
    grain(c, w, h, 10, 2); }, [6, 6]);
  const floor = new T.Mesh(new T.CircleGeometry(30, 64), new T.MeshPhysicalMaterial({ map: stoneT, color: 0xffffff, transparent: true, opacity: .86, roughness: .22, clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: .28 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; floor.renderOrder = 2; g.add(floor);
  const spot = new T.SpotLight(0xfff1e0, 120, 14, .32, .7, 1.6); spot.position.set(.6, 6, 1.2); spot.target.position.set(0, PLINTH_TOP, 0);
  if (cfg.shadows) { spot.castShadow = true; spot.shadow.mapSize.set(cfg.shadows, cfg.shadows); spot.shadow.bias = -.0004; spot.shadow.radius = 4; }
  g.add(spot, spot.target); g.add(new T.HemisphereLight(0x2a2620, 0x050505, .45));
  let dust = null;
  if (cfg.haze) { const hz = beam(0xffe6c8, .9, 1.9, 6.2, .03); hz.position.set(.3, 3.4, .4); hz.rotation.z = -.1; g.add(hz); }
  if (cfg.dust) { const N = cfg.dust, p = new Float32Array(N * 3), r = rng(9); for (let i = 0; i < N; i++) { const a = r() * 6.28, rad = Math.sqrt(r()); p[i * 3] = Math.cos(a) * rad; p[i * 3 + 1] = r() * 6; p[i * 3 + 2] = Math.sin(a) * rad; }
    const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(p, 3));
    dust = new T.Points(dg, new T.PointsMaterial({ color: 0xffe4c4, size: .012, transparent: true, opacity: .5, blending: T.AdditiveBlending, depthWrite: false })); g.add(dust); }
  scene.add(g);
  return { id: 'atelier', group: g, mirrorY: 0, exposure: .9, bloom: [.22, .5, 1.05], envGain: 1.35, cam: { y: 1.3, look: .98 },
    update(t){ if (dust) dust.rotation.y = t * .02; } };
}
// The void (Round 02): black, a polished floor that fades out, the emblem standing on it.
function voidRoom(ctx){
  const { scene } = ctx, g = new T.Group(), Y = PLINTH_TOP;
  scene.background = new T.Color(0x050506); scene.fog = null;
  const fade = canvasTex(512, 512, (c, w, h) => { const gr = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, '#fff'); gr.addColorStop(.45, '#bbb'); gr.addColorStop(1, '#000'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const floor = new T.Mesh(new T.CircleGeometry(4.5, 64), new T.MeshPhysicalMaterial({ color: 0x0a0a0c, roughness: .18, clearcoat: 1, clearcoatRoughness: .05, transparent: true, opacity: .9, alphaMap: fade, envMapIntensity: .5 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = Y; floor.renderOrder = 2; g.add(floor);
  const key = new T.SpotLight(0xffffff, 40, 14, .4, 1, 1.6); key.position.set(.8, 6, 2.5); key.target.position.set(0, Y, 0); g.add(key, key.target);
  scene.add(g);
  return { id: 'void', group: g, mirrorY: Y, exposure: .95, bloom: [.2, .45, 1.0], envGain: 1.35, cam: { y: 1.3, look: .98 }, update(){} };
}

// A pool of mercury: a planar mirror (single-sampled) with travelling ripples, fading into the void.
const PoolShader = { name: 'MercuryPool', uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, uTime: { value: 0 } },
  vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW; void main(){ vUv = textureMatrix * vec4(position, 1.); vW = (modelMatrix * vec4(position, 1.)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; varying vec4 vUv; varying vec3 vW;
    void main(){ vec2 p = vW.xz; float r = length(p) + 1e-4; float k = r * 13. - uTime * 2.1;
      vec2 d = (p / r) * cos(k) * exp(-r * .42) * .016 + vec2(sin(p.y * 2.3 + uTime * .7), cos(p.x * 2.9 - uTime * .6)) * .0035;
      vec4 uv = vUv; uv.xy += d * uv.w;
      vec3 v = normalize(cameraPosition - vW); float fr = .78 + .22 * pow(1. - abs(v.y), 3.);
      vec3 col = texture2DProj(tDiffuse, uv).rgb * vec3(.86, .88, .92) * fr + vec3(.012) * (1. + sin(k) * exp(-r * .5));
      col *= smoothstep(9.5, 5.5, r);
      gl_FragColor = vec4(col, 1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }` };
function poolRoom(ctx){
  const { scene } = ctx, g = new T.Group();
  scene.background = new T.Color(0x040405); scene.fog = null;
  const pool = new T.Reflector(new T.CircleGeometry(10, 96), { textureWidth: 1024, textureHeight: 1024, clipBias: .003, shader: PoolShader, multisample: 0 });
  pool.rotation.x = -Math.PI / 2; g.add(pool);
  const pl = new T.Mesh(new T.CylinderGeometry(.5, .56, PLINTH_TOP, 96), lacquer()); pl.position.y = PLINTH_TOP / 2; g.add(pl);
  const seam = new T.Mesh(new T.TorusGeometry(.5, .006, 8, 160), brass()); seam.rotation.x = Math.PI / 2; seam.position.y = PLINTH_TOP - .04; g.add(seam);
  const key = new T.SpotLight(0xfff3e4, 60, 16, .45, 1, 1.5); key.position.set(1.2, 6, 3); key.target.position.set(0, PLINTH_TOP, 0); g.add(key, key.target);
  g.add(new T.HemisphereLight(0x2a2a30, 0x050505, .35));
  scene.add(g);
  return { id: 'pool', group: g, mirrorY: 0, mirrorClones: false, exposure: .95, bloom: [.24, .45, 1.0], envGain: 1.35, cam: { y: 1.3, look: .98 },
    update(t){ pool.material.uniforms.uTime.value = t; } };
}
const ROOMS = { atelier, void: voidRoom, pool: poolRoom };

// A pass that zeroes NaN/Inf and clamps fireflies before bloom.
const GuardShader = { uniforms: { tDiffuse: { value: null } }, vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); if (any(isnan(c)) || any(isinf(c))) c = vec4(0., 0., 0., 1.); gl_FragColor = vec4(min(c.rgb, vec3(80.)), c.a); }` };

// ---------- the stage ----------
export async function createStage(canvas, { tier = 'high', progress = () => {} } = {}){
  let cfg = TIERS[tier];
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, cfg.dpr)); renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 1, .05, 600), ctx = { scene, renderer, camera };
  progress(.15, 'Polishing the mercury');
  const env = makeEnv(renderer); scene.environment = env.pmrem;

  const U = { uView: { value: new T.Vector4() }, uInvProj: { value: new T.Matrix4() }, uCamWorld: { value: new T.Matrix4() }, uTime: { value: 0 },
    uA: { value: new T.Vector4(-.5, 1.1, 0, .2) }, uB: { value: new T.Vector4(.5, 1.1, 0, .2) }, uK: { value: .25 }, uWob: { value: 1 }, uMorph: { value: 0 }, uHide: { value: 0 },
    uSdf: { value: null }, uBoxMin: { value: new T.Vector3() }, uBoxMax: { value: new T.Vector3() }, uObjPos: { value: new T.Vector3(0, PLINTH_TOP, 0) }, uObjRot: { value: 0 }, uObjScale: { value: 1 },
    uEnv: { value: env.cube }, uEnvGain: { value: 1.35 }, uBound: { value: new T.Vector4(0, 1.1, 0, 1.9) }, uSteps: { value: cfg.steps }, uMirrorY: { value: 0 }, uMirror: { value: .16 } };
  const liquid = new T.Mesh(new T.PlaneGeometry(2, 2), new T.ShaderMaterial({ uniforms: U, vertexShader: LIQUID_VS, fragmentShader: LIQUID_FS, depthTest: true, depthWrite: true }));
  liquid.frustumCulled = false; liquid.renderOrder = 1;
  const vp = new T.Vector4();
  liquid.onBeforeRender = (r, s, cam) => { r.getCurrentViewport(vp); U.uView.value.copy(vp); U.uInvProj.value.copy(cam.projectionMatrix).invert(); U.uCamWorld.value.copy(cam.matrixWorld); };
  scene.add(liquid);

  // the emblem and its mirror image
  const EU = { uSet: { value: 1 }, uColour: { value: 0 }, uEdge: { value: new T.Color(1, .74, .42) } };
  const holder = new T.Group(); holder.position.y = PLINTH_TOP; scene.add(holder);
  const mholder = new T.Group(); mholder.scale.y = -1; scene.add(mholder);
  const cache = new Map(); let current = null;
  function prepare(p){
    if (cache.has(p.slug)) return cache.get(p.slug);
    const e = makeEmblem(p, EU); const wrap = new T.Group(); const probe = e.chrome.clone(); wrap.add(probe); e.sdf = bakeSDF(wrap); cache.set(p.slug, e); return e;
  }
  function setProject(p){
    const e = prepare(p); if (current && current !== e) { holder.remove(current.group); mholder.remove(current.mirror); }
    holder.add(e.group); mholder.add(e.mirror); current = e;
    U.uSdf.value = e.sdf.tex; U.uBoxMin.value.copy(e.sdf.min); U.uBoxMax.value.copy(e.sdf.max); return e;
  }

  // room
  let room = null, forced = null;
  function setRoom(name){
    if (room) { scene.remove(room.group); room.group.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
    room = ROOMS[name](ctx, cfg); renderer.toneMappingExposure = room.exposure; U.uEnvGain.value = room.envGain;
    U.uMirrorY.value = room.mirrorY; mholder.position.y = 2 * room.mirrorY - PLINTH_TOP; mholder.visible = room.mirrorClones !== false; U.uMirror.value = room.mirrorClones === false ? 0 : .16;
    bloom.strength = room.bloom[0]; bloom.radius = room.bloom[1]; bloom.threshold = room.bloom[2];
    scene.traverse(o => { if (o.isMesh && o.material) [].concat(o.material).forEach(m => m.needsUpdate = true); });
  }

  const composer = new T.EffectComposer(renderer); composer.addPass(new T.RenderPass(scene, camera));
  composer.addPass(new T.ShaderPass(GuardShader));
  const bloom = new T.UnrealBloomPass(new T.Vector2(1, 1), .24, .5, .9); composer.addPass(bloom); composer.addPass(new T.OutputPass());
  let shift = [0, 0];
  function resize(){ const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); composer.setSize(w, h);
    camera.aspect = w / h; camera.fov = w < h ? 46 : 30; applyShift(); }
  function applyShift(){ const w = innerWidth, h = innerHeight; if (shift[0] || shift[1]) camera.setViewOffset(w, h, shift[0] * w, shift[1] * h, w, h); else camera.clearViewOffset(); camera.updateProjectionMatrix(); }
  addEventListener('resize', resize);
  progress(.3, 'Lighting the room');
  setRoom(cfg.room); resize();

  const v = new T.Vector3();
  const stage = { renderer, scene, camera, U, EU, holder, mholder, liquid, prepare, setProject, composer, bloom,
    get room(){ return room; }, get tier(){ return tier; }, get current(){ return current; },
    // move the picture: positive x pushes the scene left (fraction of the width), positive y pushes it up
    setShift(x, y){ shift = [x, y]; applyShift(); },
    setTier(t){ tier = t; cfg = TIERS[t]; renderer.setPixelRatio(Math.min(devicePixelRatio, cfg.dpr)); U.uSteps.value = cfg.steps; resize(); setRoom(forced || cfg.room); },
    setRoomName(n){ forced = n; setRoom(n); },
    project(p){ const q = v.copy(p).project(camera); return [(q.x * .5 + .5) * innerWidth, (-q.y * .5 + .5) * innerHeight]; },
    frame(t){ U.uTime.value = t; room.update(t); if (current) { current.tick(t); U.uObjRot.value = -holder.rotation.y; mholder.rotation.y = holder.rotation.y; U.uObjPos.value.set(holder.position.x, PLINTH_TOP, holder.position.z); }
      composer.render(); },
  };
  return stage;
}
