// Quicksilver engine: a three.js stage (one of the ambients) plus a ray-marched liquid-metal
// pass that composites with the scene through depth. Each project's sculpture is baked into a
// signed-distance texture so the liquid can pour into its true shape, then the crisp mesh
// "cools" in through a molten dissolve. Versions drive the uniforms; this file owns the plumbing.
import * as T from '../vendor/three.r03.min.js';
import { makeSculpture } from './_sculptures.js';
import { buildAmbient, PLINTH_TOP } from './_ambients.js';

const LIQUID_VS = `void main(){ gl_Position = vec4(position.xy, 0., 1.); }`;
const LIQUID_FS = `
precision highp sampler3D;
uniform vec4 uView; uniform mat4 uInvProj, uCamWorld; uniform float uTime;
uniform vec4 uA, uB; uniform float uK, uWob, uMorph, uHide, uFerro;
uniform sampler3D uSdf; uniform vec3 uBoxMin, uBoxMax, uObjPos; uniform float uObjRot, uObjScale;
uniform vec4 uPool; uniform vec3 uMag; uniform samplerCube uEnv; uniform vec3 uTint; uniform float uTintAmt, uEnvGain;
uniform vec4 uBound; uniform vec4 uS1, uS2; uniform float uSW; uniform mat4 projectionMatrix; uniform sampler2D uHdr; uniform float uHdrMix, uHdrGain;
float smin(float a, float b, float k){ float h = clamp(.5 + .5*(b-a)/k, 0., 1.); return mix(b, a, h) - k*h*(1.-h); }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa = p-a, ba = b-a; float h = clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
float sdObj(vec3 p){
  vec3 q = (p - uObjPos) / uObjScale; float c = cos(uObjRot), s = sin(uObjRot); q.xz = mat2(c, -s, s, c) * q.xz;
  vec3 e = uBoxMax - uBoxMin, cl = clamp((q - uBoxMin) / e, 0., 1.), qc = uBoxMin + cl * e;
  return (texture(uSdf, cl).r + length(q - qc)) * uObjScale;
}
float spikes(vec3 p){ // ferrofluid: cones gathered toward the magnet
  vec3 c = mix(uA.xyz, uB.xyz, .5); vec3 dir = normalize(p - c), md = normalize(uMag - c);
  float facing = pow(max(0., dot(dir, md)), 3.);
  vec2 sph = vec2(atan(dir.z, dir.x), acos(clamp(dir.y, -1., 1.))) * vec2(5.5, 7.);
  vec2 f = fract(sph) - .5; float cone = max(0., 1. - length(f) * 2.4);
  return cone * cone * facing;
}
float map(vec3 p){
  float w = sin(p.x*7.+uTime*1.7)*sin(p.y*8.-uTime*1.3)*sin(p.z*7.+uTime)*.022*uWob;
  float d = smin(length(p - uA.xyz) - uA.w, length(p - uB.xyz) - uB.w, uK) + w;
  if (uSW > 0.) { float s1 = sdCap(p, uS1.xyz, uS1.xyz + vec3(0., uS1.w, 0.), uSW * (1. + .25*sin(p.y*9. - uTime*7.)));
    float s2 = sdCap(p, uS2.xyz, uS2.xyz + vec3(0., uS2.w, 0.), uSW * (1. + .25*sin(p.y*9. - uTime*7.3 + 1.)));
    d = smin(d, min(s1, s2), .1); }
  if (uPool.w > 0.) { vec3 pp = (p - uPool.xyz) / vec3(1., .16, 1.); d = smin(d, (length(pp) - uPool.w) * .16, .1); }
  if (uFerro > 0.) d -= uFerro * .22 * spikes(p);
  if (uMorph > 0.) d = mix(d, sdObj(p), uMorph);
  return d + uHide;
}
vec3 nrm(vec3 p){ vec2 e = vec2(.0015, -.0015); return normalize(e.xyy*map(p+e.xyy) + e.yyx*map(p+e.yyx) + e.yxy*map(p+e.yxy) + e.xxx*map(p+e.xxx)); }
void main(){
  vec2 ndc = (gl_FragCoord.xy - uView.xy) / uView.zw * 2. - 1.;
  vec4 vp = uInvProj * vec4(ndc, 1., 1.); vp /= vp.w;
  vec3 ro = cameraPosition, rd = normalize((uCamWorld * vec4(vp.xyz, 0.)).xyz);
  vec3 oc = ro - uBound.xyz; float b = dot(oc, rd), c = dot(oc, oc) - uBound.w*uBound.w, h = b*b - c;
  if (h < 0.) discard;
  float t = max(0., -b - sqrt(h)), tEnd = -b + sqrt(h); bool hit = false;
  for (int i = 0; i < 110; i++) { float d = map(ro + rd*t); if (d < .0012) { hit = true; break; } t += d * .75; if (t > tEnd) break; }
  if (!hit) discard;
  vec3 p = ro + rd*t, n = nrm(p), r = reflect(rd, n);
  float fr = .62 + .38 * pow(1. - max(dot(n, -rd), 0.), 4.);
  vec3 env = texture(uEnv, r).rgb * uEnvGain;
  if (uHdrMix > 0.) { vec2 eq = vec2(atan(r.z, r.x) * .1591549 + .5, asin(clamp(r.y, -1., 1.)) * .3183099 + .5); env = mix(env, texture(uHdr, eq).rgb * uHdrGain, uHdrMix); }
  vec3 col = env * mix(vec3(.93, .94, .97), uTint, uTintAmt) * fr;
  col += vec3(1.) * pow(max(dot(r, normalize(vec3(.3, 1., .4))), 0.), 90.) * .6;
  vec4 clip = projectionMatrix * viewMatrix * vec4(p, 1.);
  gl_FragDepth = clip.z / clip.w * .5 + .5;
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// value noise used by the molten dissolve
const NOISE = `
float h3(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
  return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }`;

export function makeDissolvable(obj, uni){
  obj.traverse(o => { if (!o.isMesh) return;
    o.material = [].concat(o.material).map(m => { const c = m.clone();
      c.onBeforeCompile = sh => { sh.uniforms.uDis = uni.uDis; sh.uniforms.uEdge = uni.uEdge;
        sh.vertexShader = 'varying vec3 vDisP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vDisP = (modelMatrix * vec4(transformed, 1.)).xyz;');
        sh.fragmentShader = 'uniform float uDis; uniform vec3 uEdge; varying vec3 vDisP;\n' + NOISE + '\n' + sh.fragmentShader
          .replace('void main() {', 'void main() {\n float dn = vn(vDisP * 9.) * .7 + vn(vDisP * 31.) * .3; float dth = uDis * 1.12 - .06; if (dn > dth) discard;')
          .replace('#include <opaque_fragment>', '#include <opaque_fragment>\n gl_FragColor.rgb += uEdge * smoothstep(.05, 0., dth - dn) * step(.001, 1. - uDis) * 6.;'); };
      c.customProgramCacheKey = () => 'dissolve'; return c; });
    if (o.material.length === 1) o.material = o.material[0]; o.castShadow = true; o.receiveShadow = true; });
}

// Bake an unsigned distance field (minus a thin shell) of an object, in its own local frame.
export function bakeSDF(obj, N = 40){
  obj.updateMatrixWorld(true);
  const inv = new T.Matrix4().copy(obj.matrixWorld).invert(), geos = [];
  obj.traverse(o => { if (!o.isMesh || !o.geometry.attributes.position) return; let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    const ng = new T.BufferGeometry(); ng.setAttribute('position', g.attributes.position.clone()); ng.applyMatrix4(new T.Matrix4().multiplyMatrices(inv, o.matrixWorld)); geos.push(ng); });
  const merged = T.mergeGeometries(geos), bvh = new T.MeshBVH(merged);
  const box = new T.Box3().setFromBufferAttribute(merged.attributes.position).expandByScalar(.12), size = box.getSize(new T.Vector3());
  const data = new Uint16Array(N * N * N), p = new T.Vector3(), hit = {};
  for (let z = 0; z < N; z++) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    p.set(box.min.x + (x + .5) / N * size.x, box.min.y + (y + .5) / N * size.y, box.min.z + (z + .5) / N * size.z);
    bvh.closestPointToPoint(p, hit); data[x + y * N + z * N * N] = T.DataUtils.toHalfFloat(hit.distance - .016); }
  const tex = new T.Data3DTexture(data, N, N, N); tex.format = T.RedFormat; tex.type = T.HalfFloatType; tex.minFilter = tex.magFilter = T.LinearFilter; tex.unpackAlignment = 1; tex.needsUpdate = true;
  // half a voxel inset so the clamp-to-edge samples the cell centres
  const half = size.clone().divideScalar(N * 2);
  return { tex, min: box.min.clone().add(half), max: box.max.clone().sub(half) };
}

export async function createStage(canvas, { ambient = 'atelier', onAmbient } = {}){
  const mobile = innerWidth < 760;
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2)); renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 1, .05, 600);
  const ctx = { scene, renderer, camera };

  // liquid pass
  const U = { uView: { value: new T.Vector4() }, uInvProj: { value: new T.Matrix4() }, uCamWorld: { value: new T.Matrix4() }, uTime: { value: 0 },
    uA: { value: new T.Vector4(-.5, 1.1, 0, .2) }, uB: { value: new T.Vector4(.5, 1.1, 0, .2) }, uK: { value: .25 }, uWob: { value: 1 }, uMorph: { value: 0 }, uHide: { value: 0 }, uFerro: { value: 0 },
    uSdf: { value: null }, uBoxMin: { value: new T.Vector3() }, uBoxMax: { value: new T.Vector3() }, uObjPos: { value: new T.Vector3(0, PLINTH_TOP, 0) }, uObjRot: { value: 0 }, uObjScale: { value: 1 },
    uPool: { value: new T.Vector4(0, PLINTH_TOP, 0, 0) }, uMag: { value: new T.Vector3(0, 2, 2) }, uEnv: { value: null }, uTint: { value: new T.Color(1, 1, 1) }, uTintAmt: { value: 0 }, uEnvGain: { value: 1 },
    uBound: { value: new T.Vector4(0, 1.1, 0, 1.9) }, uS1: { value: new T.Vector4(-.3, .5, 0, 0) }, uS2: { value: new T.Vector4(.3, .5, 0, 0) }, uSW: { value: 0 }, uHdr: { value: null }, uHdrMix: { value: 0 }, uHdrGain: { value: 1 } };
  const liquid = new T.Mesh(new T.PlaneGeometry(2, 2), new T.ShaderMaterial({ uniforms: U, vertexShader: LIQUID_VS, fragmentShader: LIQUID_FS, depthTest: true, depthWrite: true }));
  liquid.frustumCulled = false; liquid.renderOrder = 1;
  const vp = new T.Vector4();
  liquid.onBeforeRender = (r, s, cam) => { r.getCurrentViewport(vp); U.uView.value.copy(vp); U.uInvProj.value.copy(cam.projectionMatrix).invert(); U.uCamWorld.value.copy(cam.matrixWorld); };
  scene.add(liquid);

  // reflections for the liquid come from the room itself
  const cubeRT = new T.WebGLCubeRenderTarget(256, { type: T.HalfFloatType, generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter });
  const cubeCam = new T.CubeCamera(.05, 600, cubeRT); cubeCam.position.set(0, 1.1, 0); U.uEnv.value = cubeRT.texture;

  // sculptures, baked once per project
  const holder = new T.Group(); holder.position.y = PLINTH_TOP; scene.add(holder);
  const disU = { uDis: { value: 1 }, uEdge: { value: new T.Color(1, .42, .12) } };
  const cache = new Map(); let current = null;
  function prepare(p){
    if (cache.has(p.slug)) return cache.get(p.slug);
    const obj = makeSculpture(p); const b = new T.Box3().setFromObject(obj), sz = b.getSize(new T.Vector3());
    obj.scale.setScalar((p.flagship ? 1.05 : .95) / Math.max(sz.y, sz.x * .85, sz.z * .85)); obj.updateMatrixWorld(true);
    const b2 = new T.Box3().setFromObject(obj); obj.position.y = -b2.min.y;
    const wrap = new T.Group(); wrap.add(obj); const sdf = bakeSDF(wrap); makeDissolvable(obj, disU);
    const entry = { obj: wrap, sdf, height: b2.max.y - b2.min.y }; cache.set(p.slug, entry); return entry;
  }
  function setProject(p){
    const e = prepare(p); if (current && current !== e) holder.remove(current.obj); holder.add(e.obj); current = e;
    U.uSdf.value = e.sdf.tex; U.uBoxMin.value.copy(e.sdf.min); U.uBoxMax.value.copy(e.sdf.max); U.uTint.value.set(p.color); return e;
  }

  // ambient
  let amb = null, building = null;
  async function setAmbient(id){
    building = id; const next = await buildAmbient(id, ctx); if (building !== id) { next.dispose(); return; }
    if (amb) amb.dispose(); amb = next; renderer.toneMappingExposure = amb.exposure;
    const hdr = scene.environment && scene.environment.isDataTexture && scene.environment.mapping === T.EquirectangularReflectionMapping ? scene.environment : null;
    U.uHdr.value = hdr; U.uHdrMix.value = hdr ? (amb.hdrMix ?? .5) : 0; U.uHdrGain.value = amb.hdrGain ?? 1; U.uEnvGain.value = amb.envGain ?? 1.3;
    bloom.strength = amb.bloom[0]; bloom.radius = amb.bloom[1]; bloom.threshold = amb.bloom[2];
    liquid.visible = false; holder.visible = false; cubeCam.update(renderer, scene); liquid.visible = true; holder.visible = true;
    onAmbient && onAmbient(id);
  }

  const composer = new T.EffectComposer(renderer); composer.addPass(new T.RenderPass(scene, camera));
  const bloom = new T.UnrealBloomPass(new T.Vector2(1, 1), .4, .5, .85); composer.addPass(bloom); composer.addPass(new T.OutputPass());
  function resize(){ const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.fov = w < h ? 46 : 30; camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();

  const project = v => { const q = v.clone().project(camera); return [(q.x * .5 + .5) * innerWidth, (-q.y * .5 + .5) * innerHeight]; };
  const stage = { renderer, scene, camera, U, disU, holder, setProject, prepare, setAmbient, project, get ambient(){ return amb; },
    frame(t){ U.uTime.value = t; if (amb) amb.update(t); if (current) { U.uObjRot.value = -holder.rotation.y; } composer.render(); } };
  await setAmbient(ambient);
  return stage;
}

// Ambient switcher chip shared by the versions (mock-only UI). Reads/writes a bare hash token.
export function ambientChip(el, stage, ids, names){
  el.innerHTML = ids.map((id, i) => `<button data-a="${id}">${names[i]}</button>`).join('');
  const mark = id => el.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.a === id));
  el.addEventListener('click', e => { const id = e.target.dataset && e.target.dataset.a; if (!id) return; mark(id); stage.setAmbient(id); try { history.replaceState(null, '', '#' + id); } catch (_) {} });
  mark(stage.ambient.id);
}
export const hashAmbient = (fallback, ids) => { const h = location.hash.slice(1); return ids.includes(h) ? h : fallback; };
export { PLINTH_TOP };
