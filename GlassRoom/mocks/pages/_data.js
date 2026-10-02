// Round 03 project data: the real list, now with `started` dates.
// `started` is the date of each repo's first commit (a stand-in until Kia confirms real dates).
// Families as Kia groups them; flagships spread across families on purpose (D-022).
// `roots` only where the project's README states the word fusion; `for` is the README's
// own "Made with ❤️ for …" line. Never derive a count from this list in any copy (D-018).
export const FAMILIES = [
  { id: 'encyclopedias', name: 'Encyclopedias' },
  { id: 'learning', name: 'Learning' },
  { id: 'tools', name: 'Tools' },
  { id: 'tributes', name: 'Screen tributes' },
  { id: 'film', name: 'Film' },
  { id: 'personal', name: 'Personal' },
];

export const PROJECTS = [
  { slug: 'polymeratlas', started: '2024-11-11', name: 'PolymerAtlas', family: 'encyclopedias', flagship: true, color: '#C9A55C',
    line: 'The polymers that made the modern world, each told inside the year it was first made.',
    roots: ['polymer', 'atlas'], for: 'everyone who has wondered what their world is made of' },
  { slug: 'xefy', started: '2026-08-06', name: 'Xefy', family: 'encyclopedias', flagship: true, color: '#B8432F',
    line: 'Recipes where every quantity, nutrition figure and timing is computed, never typed.',
    roots: null, for: 'those who find joy in every bite' },
  { slug: 'markey', started: '2026-08-17', name: 'Markey', family: 'encyclopedias', flagship: true, color: '#D0D5DC',
    line: 'Production cars, sourced or computed, with a real wind tunnel running on your GPU.',
    roots: ['marque', 'key'], for: 'those who find joy in every mile' },
  { slug: 'exir', started: '2026-08-19', name: 'eXir', family: 'encyclopedias', flagship: true, color: '#E9A63F',
    line: 'Drinks where every measure, dilution and strength is computed.',
    roots: null, for: 'those who find joy in every sip' },
  { slug: 'armag', started: '2026-08-26', name: 'ARMAG', family: 'encyclopedias', flagship: true, color: '#9AD4EA',
    line: 'Firearms and cartridges, laid out like a magazine, with real ballistics.',
    roots: ['arm', 'magazine'], for: 'those who respect every round' },
  { slug: 'perceptense', started: '2026-04-11', name: 'Perceptense', family: 'learning', flagship: false, color: '#7CC6CD',
    line: 'Bite-sized interactive modules for an intuition about everything.',
    roots: ['perception', 'sense'], for: 'curious minds' },
  { slug: 'galerium', started: '2026-07-04', name: 'Galerium', family: 'learning', flagship: true, color: '#C8A24B',
    line: 'A museum of art history: a night-sky timeline and a walkable gallery for every artist.',
    roots: ['gallery', 'museum'], for: 'people who read every placard' },
  { slug: 'lalista', started: '2026-07-18', name: 'LaLista', family: 'learning', flagship: true, color: '#4B9C8B',
    line: 'Spanish as it is spoken in Spain, one word and one rule at a time.',
    roots: ['la', 'lista'], for: 'a lot of ¿ and ¡' },
  { slug: 'morcypher', started: '2026-05-17', name: 'MorCypher', family: 'learning', flagship: false, color: '#F29A2E',
    line: 'A virtual telegraph key for sending, decoding and learning Morse code.',
    roots: ['Morse', 'cypher'], for: '— — ● ● ●   ● ● ● — —' },
  { slug: 'kalculator', started: '2026-05-24', name: 'Kalculator', family: 'tools', flagship: false, color: '#B06CF0',
    line: 'A calculator that writes natural math, solves, graphs and converts.',
    roots: ['Kia', 'calculator'], for: 'everyone who counts' },
  { slug: 'audioptix', started: '2026-05-03', name: 'AudiOptix', family: 'tools', flagship: false, color: '#E8C890',
    line: 'A music player and evolving visualizer for your own files.',
    roots: ['audio', 'optics'], for: 'music lovers' },
  { slug: 'lostimer', started: '2026-05-21', name: 'LOSTimer', family: 'tributes', flagship: false, color: '#3BD16F',
    line: 'The Swan Station countdown from LOST, as a working timer. Namaste.',
    roots: ['LOST', 'timer'], for: 'the LOST fandom' },
  { slug: 'pseudoku', started: '2026-06-04', name: 'Pseudoku', family: 'tributes', flagship: false, color: '#7FDFFF',
    line: "Sudoku inside Lumon's MDR terminal. Please enjoy each puzzle equally.",
    roots: ['pseudo', 'sudoku'], for: 'the Severance fandom' },
  { slug: 'constyx', started: '2026-07-11', name: 'ConStyx', family: 'tributes', flagship: false, color: '#00FF41',
    line: 'A focus terminal disguised as a digital rain cascade.',
    roots: ['Construct', 'Styx'], for: 'those who know there is no spoon' },
  { slug: 'drxrates', started: '2026-07-07', name: 'DrXRates', family: 'film', flagship: true, color: '#C9A86A',
    line: 'The Cinema Ledger: a personal film archive with a ten-part rating system.',
    roots: null, for: null },
  { slug: 'website', started: '2026-04-22', name: 'Personal site', family: 'personal', flagship: false, color: '#3CC7B8',
    line: "Kia's own site, with features built just for it.",
    roots: null, for: null },
];

export const FLAGSHIPS = PROJECTS.filter(p => p.flagship);
export const byFamily = id => PROJECTS.filter(p => p.family === id);
export const asset = (slug, file) => `../assets/projects/${slug}/${file}`;
export const byDate = () => [...PROJECTS].sort((a, b) => a.started.localeCompare(b.started));
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
