// A tiny posing rig for Mixamo-style skeletons (Xbot, Michelle, Ready Player Me).
// Poses are written as limb directions in the character's own frame (x right, y up, z forward);
// each frame the skeleton is reset to rest and every limb is aimed, root to tips.
import * as T from '../vendor/three.r03.min.js';

const CHAINS = [ // [bone, child-that-sets-its-direction, pose key]
  ['Spine', 'Spine2', 'spine'], ['Spine2', 'Neck', 'chest'], ['Neck', 'Head', 'neck'],
  ['LeftUpLeg', 'LeftLeg', 'lThigh'], ['LeftLeg', 'LeftFoot', 'lShin'], ['LeftFoot', 'LeftToeBase', 'lFoot'],
  ['RightUpLeg', 'RightLeg', 'rThigh'], ['RightLeg', 'RightFoot', 'rShin'], ['RightFoot', 'RightToeBase', 'rFoot'],
  ['LeftArm', 'LeftForeArm', 'lArm'], ['LeftForeArm', 'LeftHand', 'lFore'], ['RightArm', 'RightForeArm', 'rArm'], ['RightForeArm', 'RightHand', 'rFore'],
];
export const POSES = {
  stand: { spine: [0, 1, .02], chest: [0, 1, 0], neck: [0, 1, .05], lThigh: [.04, -1, 0], lShin: [0, -1, -.02], lFoot: [0, -.5, 1], rThigh: [-.04, -1, 0], rShin: [0, -1, -.02], rFoot: [0, -.5, 1],
    lArm: [.18, -1, .02], lFore: [.08, -1, .12], rArm: [-.18, -1, .02], rFore: [-.08, -1, .12] },
  sit: { spine: [0, 1, .06], chest: [0, 1, .02], neck: [0, 1, .08], lThigh: [.06, -.08, 1], lShin: [0, -1, .08], lFoot: [0, -.3, 1], rThigh: [-.06, -.08, 1], rShin: [0, -1, .08], rFoot: [0, -.3, 1],
    lArm: [.12, -1, .3], lFore: [-.05, -.35, 1], rArm: [-.12, -1, .3], rFore: [.05, -.35, 1] },
  sitPaddle: { rArm: [-.16, 1, .14], rFore: [-.04, 1, .06], neck: [0, 1, .12] },
  type: { spine: [0, 1, .18], chest: [0, 1, .1], neck: [0, 1, .2], lArm: [.18, -.9, .45], lFore: [-.25, -.15, 1], rArm: [-.18, -.9, .45], rFore: [.25, -.15, 1] },
  lectern: { spine: [0, 1, .05], lArm: [.2, -.9, .45], lFore: [-.1, -.3, 1], rArm: [-.35, -.55, .55], rFore: [-.1, .4, 1] },
  gavelUp: { rArm: [-.35, .2, .6], rFore: [0, 1, .2] },
  point: { rArm: [-.25, .05, 1], rFore: [-.15, .1, 1] },
  phone: { rArm: [-.2, -.6, .5], rFore: [.1, 1, .1], neck: [-.1, 1, .05] },
};

export function makeRig(root){
  const bones = {};
  root.traverse(o => { if (o.isBone) bones[o.name.replace(/^mixamorig:?/, '')] = o; });
  const rest = new Map(); Object.values(bones).forEach(b => rest.set(b, b.quaternion.clone()));
  const restHips = bones.Hips ? bones.Hips.position.clone() : null;
  const qa = new T.Quaternion(), qw = new T.Quaternion(), qp = new T.Quaternion(), a = new T.Vector3(), b = new T.Vector3(), d = new T.Vector3(), rq = new T.Quaternion();
  function aim(bone, tip, dir){
    bone.updateWorldMatrix(true, false); tip.updateWorldMatrix(false, false);
    bone.getWorldPosition(a); tip.getWorldPosition(b); const cur = b.sub(a).normalize();
    d.set(...dir).normalize().applyQuaternion(rq);
    qa.setFromUnitVectors(cur, d); bone.getWorldQuaternion(qw); qw.premultiply(qa);
    bone.parent.getWorldQuaternion(qp); bone.quaternion.copy(qp.invert().multiply(qw)); bone.updateMatrixWorld(true);
  }
  return {
    bones,
    // pose: a POSES entry or a blend of several {key: weight}; hipsDrop lowers the pelvis (sitting)
    apply(pose, { hipsDrop = 0, twist = 0 } = {}){
      for (const [bn, q] of rest) bn.quaternion.copy(q);
      if (restHips) bones.Hips.position.copy(restHips);
      root.updateMatrixWorld(true); root.getWorldQuaternion(rq);
      if (hipsDrop && bones.Hips) { bones.Hips.position.y -= hipsDrop / (root.scale.y || 1) / (bones.Hips.parent.scale ? bones.Hips.parent.scale.y : 1); }
      for (const [bn, tip, key] of CHAINS) { const dir = pose[key]; if (dir && bones[bn] && bones[tip]) aim(bones[bn], bones[tip], dir); }
      if (twist && bones.Spine2) { bones.Spine2.rotateY(twist); bones.Spine2.updateMatrixWorld(true); }
    },
  };
}
export const blend = (...ps) => { const out = {}; ps.forEach(([p, w]) => Object.entries(p).forEach(([k, v]) => { const o = out[k] || (out[k] = [0, 0, 0, 0]); o[0] += v[0] * w; o[1] += v[1] * w; o[2] += v[2] * w; o[3] += w; }));
  Object.keys(out).forEach(k => { const o = out[k]; out[k] = [o[0] / o[3], o[1] / o[3], o[2] / o[3]]; }); return out; };
export const over = (base, top) => ({ ...base, ...top });

// load a character once, clone it many times (skinned meshes need SkeletonUtils.clone)
const cache = {};
export async function loadCharacter(name){
  if (!cache[name]) cache[name] = new T.GLTFLoader().loadAsync(`../vendor/models/${name}.glb`);
  const g = await cache[name]; const m = T.SkeletonUtils.clone(g.scene);
  m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; if (o.material) o.material = o.material.clone(); } });
  m.updateMatrixWorld(true); const box = new T.Box3().setFromObject(m, true); const h = box.max.y - box.min.y; m.scale.multiplyScalar(1.75 / h); m.userData.clips = g.animations;
  const holder = new T.Group(); holder.add(m); m.position.y = -box.min.y * (1.75 / h); return holder;
}
