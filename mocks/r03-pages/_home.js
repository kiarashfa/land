// Shared bits for the Quicksilver home versions: sequence, the two fused words per name, and UI helpers.
import { PROJECTS, FAMILIES } from './_data.js';

// Where a name joins its two words (index into the name). Roots come from each README;
// the three marked "?" have no stated fusion yet, so Kia should supply them.
export const FUSE = {
  markey: { roots: ['marque', 'key'], at: 3 }, armag: { roots: ['arm', 'magazine'], at: 2 }, galerium: { roots: ['gallery', 'museum'], at: 5 },
  polymeratlas: { roots: ['polymer', 'atlas'], at: 7 }, lalista: { roots: ['la', 'lista'], at: 2 }, perceptense: { roots: ['perception', 'sense'], at: 7 },
  morcypher: { roots: ['Morse', 'cypher'], at: 3 }, kalculator: { roots: ['Kia', 'calculator'], at: 1 }, audioptix: { roots: ['audio', 'optics'], at: 4 },
  lostimer: { roots: ['LOST', 'timer'], at: 4 }, pseudoku: { roots: ['pseudo', 'sudoku'], at: 6 }, constyx: { roots: ['Construct', 'Styx'], at: 3 },
  website: { roots: ['Kiarash', 'Fa'], at: 7 },
  xefy: { roots: ['recipes', 'numbers'], at: 2, guess: true }, exir: { roots: ['elixir', 'numbers'], at: 1, guess: true }, drxrates: { roots: ['films', 'ratings'], at: 3, guess: true },
};
// The home shows every project, flagships first; nothing on screen counts them.
export const SEQUENCE = [...PROJECTS.filter(p => p.flagship), ...PROJECTS.filter(p => !p.flagship)];
export const family = p => FAMILIES.find(f => f.id === p.family).name;
export const splitName = p => { const f = FUSE[p.slug], n = p.name; return [n.slice(0, f.at), n.slice(f.at)]; };

export function rail(el, onPick){
  el.innerHTML = SEQUENCE.map((p, i) => `<button data-i="${i}">${p.name}</button>`).join('');
  el.addEventListener('click', e => { const i = e.target.dataset && e.target.dataset.i; if (i !== undefined) onPick(+i); });
  let last = -1; return i => { if (i === last) return; last = i; el.querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === i)); };
}
export const ease = t => t * t * (3 - 2 * t);
export const seg = (f, a, b) => Math.min(1, Math.max(0, (f - a) / (b - a)));
