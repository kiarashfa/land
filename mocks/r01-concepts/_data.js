// Shared placeholder data for Round 01 concept mocks.
// Only the first ten are real projects (from public GitHub descriptions);
// the rest are placeholders until the full list arrives. Tiers are guesses.
export const PROJECTS = [
  { name: 'PolymerAtlas', kind: 'Encyclopedia', line: 'The polymers that shaped the modern world', tier: 1 },
  { name: 'Markey',       kind: 'Encyclopedia', line: 'Production cars, with a wind tunnel on your GPU', tier: 1 },
  { name: 'Xefy',         kind: 'Encyclopedia', line: 'Recipes where every number is computed', tier: 1 },
  { name: 'eXir',         kind: 'Encyclopedia', line: 'Drinks, computed from structured data', tier: 1 },
  { name: 'Elysium',      kind: 'Experience',   line: 'A solitude experience on Mars', tier: 1 },
  { name: 'Kalculator',   kind: 'Tool',         line: 'A calculator that writes natural math', tier: 2 },
  { name: 'Perceptense',  kind: 'Course',       line: 'Intuition for numbers, scale and systems', tier: 1 },
  { name: 'ARMAG',        kind: 'Reference',    line: 'Firearms and cartridges, sourced', tier: 2 },
  { name: 'LaLista',      kind: 'Language',     line: 'Spanish, as it is spoken in Spain', tier: 2 },
  { name: 'Pseudoku',     kind: 'Game',         line: 'Macrodata refinement, as a puzzle', tier: 2 },
];
for (let i = PROJECTS.length; i < 25; i++) {
  PROJECTS.push({ name: `Project ${String(i + 1).padStart(2, '0')}`, kind: 'Placeholder', line: 'Waiting for the full list', tier: 3 });
}
