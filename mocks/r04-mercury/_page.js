// Shared start-up for the project-page mocks: loading veil, quality tier, stage, the project, the room switch.
import { createStage, guessTier, saveTier, timeFrames } from './_mercury.js';
import { veil, pick } from './_detail.js';

const LABEL = { high: ['Atelier', 'your graphics card can carry the room'], mid: ['Atelier, lighter', 'tuned for this device'], low: ['The void', 'the light version, for a smooth ride'] };
export async function boot(canvas, { liquid = false, force } = {}){
  const V = veil(), G = guessTier(); V.set(.06, 'Warming the mercury');
  const say = (t, why) => V.tier(`<b>${LABEL[t][0]}</b> · ${why || LABEL[t][1]}`); say(G.tier, G.why === 'a capable graphics card' ? null : G.why);
  await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]);
  const stage = await createStage(canvas, { tier: G.tier, progress: (p, s) => V.set(p, s) }), p = pick();
  if (force) stage.setRoomName && stage.setRoomName(force);
  stage.liquid.visible = liquid; if (!liquid) stage.U.uHide.value = 2;
  V.set(.55, 'Casting ' + p.name); const entry = stage.setProject(p);
  V.set(.7, 'Compiling the light'); if (stage.renderer.compileAsync) await stage.renderer.compileAsync(stage.scene, stage.camera).catch(() => {});
  return { stage, p, entry, V, G, say,
    async settle(frame){ // a short look at real frame times; step down if the room is too heavy
      if (!G.locked && stage.tier !== 'low' && !new URLSearchParams(location.search).has('still')) { V.set(.85, 'Measuring this screen');
        const ms = await timeFrames(frame); if (ms > 40 && stage.tier === 'high') { stage.setTier('mid'); say('mid', 'stepped down to keep it smooth'); } if (ms > 60) { stage.setTier('low'); say('low', 'stepped down to keep it smooth'); } }
      V.set(1, 'Ready'); },
  };
}
export function roomSwitch(el, stage){
  const draw = () => { el.innerHTML = [['high', 'Atelier'], ['low', 'Void']].map(([t, n]) => `<button data-t="${t}" class="${(stage.tier === 'low') === (t === 'low') ? 'on' : ''}">${n}</button>`).join(''); };
  el.onclick = e => { const t = e.target.dataset && e.target.dataset.t; if (!t || t === stage.tier) return; stage.setTier(t); saveTier(t); draw(); }; draw(); return draw;
}
