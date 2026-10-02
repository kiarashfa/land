// Render a project's sculpture as a flat white silhouette, seen from the front.
// Returns a mask sampler (for Shadow Play) and a canvas with alpha (for Tunnel Book).
import * as T from '../vendor/three.bundle.min.js';
import { makeSculpture } from './_sculptures.js';

export function silhouette(renderer, project, size = 256, rotY = 0) {
  const obj = makeSculpture(project, 'paper'); obj.rotation.y = rotY;
  const scene = new T.Scene(); scene.add(obj);
  scene.overrideMaterial = new T.MeshBasicMaterial({ color: 0xffffff, side: T.DoubleSide });
  obj.updateMatrixWorld(true);
  const box = new T.Box3().setFromObject(obj), c = box.getCenter(new T.Vector3()), s = box.getSize(new T.Vector3());
  const half = Math.max(s.x, s.y) * .54;
  const cam = new T.OrthographicCamera(-half, half, half, -half, .01, 20); cam.position.set(c.x, c.y, 10); cam.lookAt(c.x, c.y, 0);
  const rt = new T.WebGLRenderTarget(size, size);
  const prevTarget = renderer.getRenderTarget(), prevClear = renderer.getClearColor(new T.Color()), prevAlpha = renderer.getClearAlpha(), prevScissor = renderer.getScissorTest();
  renderer.setScissorTest(false); renderer.setRenderTarget(rt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, cam);
  const px = new Uint8Array(size * size * 4); renderer.readRenderTargetPixels(rt, 0, 0, size, size, px);
  renderer.setRenderTarget(prevTarget); renderer.setClearColor(prevClear, prevAlpha); renderer.setScissorTest(prevScissor); rt.dispose();
  const mask = new Uint8Array(size * size); for (let i = 0; i < size * size; i++) mask[i] = px[i * 4] > 100 ? 1 : 0;
  // world-free helpers in unit space: u, v in [-1, 1], v up
  const inside = (u, v) => { const x = Math.floor((u * .5 + .5) * size), y = Math.floor((v * .5 + .5) * size); return x >= 0 && y >= 0 && x < size && y < size && mask[y * size + x] === 1; };
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
  const g = canvas.getContext('2d'), img = g.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const m = mask[y * size + x], o = ((size - 1 - y) * size + x) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = 255; img.data[o + 3] = m * 255; }
  g.putImageData(img, 0, 0);
  return { inside, canvas, aspect: s.x / s.y, size };
}
