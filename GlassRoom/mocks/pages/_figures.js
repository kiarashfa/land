// Painted scale figures for the vitrines: one rigged body (Xbot) dressed by a zone shader.
// Clothes are painted from the bind pose (a T-pose in metres: y up, arms along x, facing +z),
// like the hand-painted figures in a model maker's diorama. Faces stay plain on purpose.
import * as T from '../vendor/three.r03.min.js';
import { loadCharacter, makeRig, POSES, over, blend } from './_rig.js';

const ZONES = /* glsl */`
  vec3 zoneColor(vec3 p){
    float ax = abs(p.x);
    vec3 c = uPants;
    if (p.y < .095) c = uShoe;
    else if (p.y > 1.015 || ax > .2) c = uShirt;
    if (p.y > .98 && p.y < 1.03 && ax < .2) c = uBelt;
    if (ax > .2 && p.y > 1.28) c = ax > .66 ? uSkin : (ax > .6 && uCuff > .5 ? uShirtIn : uJacket);
    if (ax <= .2 && p.y > 1.015 && p.y < 1.5) {
      c = uJacket;
      float v = step(abs(p.x), (p.y - 1.24) * .32);                       // the open V of a jacket
      if (p.z > .05 && v > .5) c = uShirtIn;
      if (p.z > .06 && ax < .022 && p.y > 1.22 && p.y < 1.47 && uTie.r + uTie.g + uTie.b > 0.) c = uTie;
    }
    if (p.y >= 1.47 && ax < .1) c = uSkin;
    if (p.y > 1.69 || (p.y > 1.56 && p.z < -.035) || (uLong > .5 && p.y > 1.36 && p.z < -.02 && ax < .14 && p.y > 1.36)) c = uHair;
    if (uLong > .5 && p.y > 1.52 && ax > .075 && ax < .13 && p.z < .04) c = uHair;
    if (uGlasses > .5 && p.y > 1.622 && p.y < 1.648 && p.z > .05 && ax < .072) c = vec3(.012);
    return c;
  }`;

export function paint(root, look){
  const U = {
    uShoe: { value: new T.Color(look.shoe ?? 0x141414) }, uPants: { value: new T.Color(look.pants ?? 0x2b2f36) },
    uShirt: { value: new T.Color(look.shirt ?? look.jacket ?? 0x3a3f48) }, uJacket: { value: new T.Color(look.jacket ?? look.shirt ?? 0x3a3f48) },
    uShirtIn: { value: new T.Color(look.shirtIn ?? 0xe9e6df) }, uTie: { value: new T.Color(look.tie ?? 0x000000) }, uBelt: { value: new T.Color(look.belt ?? 0x111111) },
    uSkin: { value: new T.Color(look.skin ?? 0xd9a988) }, uHair: { value: new T.Color(look.hair ?? 0x2a1d14) },
    uLong: { value: look.long ? 1 : 0 }, uCuff: { value: look.cuff ? 1 : 0 }, uGlasses: { value: look.glasses ? 1 : 0 },
  };
  const mat = new T.MeshStandardMaterial({ roughness: .78, metalness: 0 });
  mat.onBeforeCompile = s => {
    Object.assign(s.uniforms, U);
    s.vertexShader = 'varying vec3 vBind;\n' + s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vBind = position;');
    s.fragmentShader = 'varying vec3 vBind;\n' + Object.keys(U).map(k => `uniform ${['uLong', 'uCuff', 'uGlasses'].includes(k) ? 'float' : 'vec3'} ${k};`).join('\n') + ZONES + '\n' +
      s.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= zoneColor(vBind);');
  };
  mat.customProgramCacheKey = () => 'paintedFigure';
  root.traverse(o => { if (o.isMesh) { o.material = mat; o.castShadow = o.receiveShadow = true; } });
  return U;
}

// A dressed figure with a rig; `pose(t)` is called each frame by the room.
export async function figure(look){
  const holder = await loadCharacter('Xbot'); paint(holder, look);
  const rig = makeRig(holder); holder.userData.rig = rig; return holder;
}

// small library of living loops (t in seconds, ph a per-figure phase)
export const LIVE = {
  typing: (rig, t, ph) => { const a = Math.sin(t * 9 + ph) * .06, b = Math.sin(t * 7.3 + ph * 2) * .06;
    rig.apply(over(POSES.sit, { ...POSES.type, lFore: [-.25, -.15 + a, 1], rFore: [.25, -.15 + b, 1], neck: [Math.sin(t * .4 + ph) * .12, 1, .22] }), { twist: Math.sin(t * .23 + ph) * .05 }); },
  seated: (rig, t, ph) => rig.apply(over(POSES.sit, { neck: [Math.sin(t * .3 + ph) * .25, 1, .1], chest: [0, 1, -.06] }), { twist: Math.sin(t * .2 + ph) * .06 }),
  talking: (rig, t, ph) => { const g = Math.sin(t * 1.7 + ph); rig.apply(over(POSES.sit, { chest: [0, 1, -.08], neck: [Math.sin(t * .5 + ph) * .2, 1, .12],
    rArm: [-.35, -.6, .55], rFore: [-.25 + g * .15, .35 + g * .2, 1] }), { twist: Math.sin(t * .4 + ph) * .08 }); },
  standing: (rig, t, ph) => rig.apply(over(POSES.stand, { neck: [Math.sin(t * .35 + ph) * .3, 1, .05], spine: [Math.sin(t * .5 + ph) * .02, 1, .02] })),
  handsBehind: (rig, t, ph) => rig.apply(over(POSES.stand, { lArm: [.12, -1, -.35], lFore: [-.6, -.1, -.6], rArm: [-.12, -1, -.35], rFore: [.6, -.1, -.6], neck: [Math.sin(t * .3 + ph) * .35, 1, .05] })),
  eating: (rig, t, ph) => { const b = Math.max(0, Math.sin(t * .9 + ph)) ** 3; rig.apply(over(POSES.sit, { chest: [0, 1, .05], neck: [0, 1, .15 + b * .1],
    lArm: [.2, -.9, .4], lFore: [-.3, .1, 1], rArm: [-.25, -.7 + b * .5, .5], rFore: [.2 - b * .3, .1 + b * 1.2, 1 - b * .6] })); },
  offering: (rig, t, ph) => { const b = Math.sin(t * .6 + ph) * .04; rig.apply(over(POSES.sit, { spine: [0, 1, .16], chest: [0, 1, .14], neck: [0, 1, .05],
    lArm: [.2, -.85, .5], lFore: [-.05, -.12 + b, 1], rArm: [-.2, -.85, .5], rFore: [.05, -.12 - b, 1] })); },
  kneel: (rig, t, ph) => rig.apply({ ...POSES.sit, lThigh: [.15, -.2, 1], lShin: [0, -.15, -1], rThigh: [-.15, -.2, 1], rShin: [0, -.15, -1], lFoot: [0, -1, -.2], rFoot: [0, -1, -.2],
    rArm: [-.1, -.8, .7], rFore: [0, .2, 1], lArm: [.1, -.8, .7], lFore: [0, .1, 1], neck: [0, 1, .35] }),
};
export { POSES, over, blend };
