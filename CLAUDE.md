# CLAUDE.md

Working memory for every Claude session on this repo. Read this first, then `docs/`.

## What this is

The future `kiarashfa.github.io`: a landing site that gathers all of Kia's side projects (about 25, all public GitHub repos deployed on GitHub Pages). Each project gets an introduction, its story, the challenges explored, and a link out. It is being designed in rounds, and will move to the special `kiarashfa.github.io` repo when finished.

- Owner: Kiarash Farajzadehahary ("Kia"; brand **KiarashFa**; monogram candidate **KFA**).
- Audience: the curious public Kia meets in person (phone first), then creative-dev peers. Not recruiters.
- Bar: graphically astonishing, luxury, elegant, state of the art. Never a generic portfolio.

## Where things are

| Path | Contents |
| --- | --- |
| `docs/00-brief.md` | The brief: purpose, audience, identity, taste. Authoritative. |
| `docs/01-research.md` | Role models, tech landscape with versions, techniques. |
| `docs/02-decisions.md` | Decision log (D-xxx). Update it at the end of every round. |
| `docs/03-stress-test.md` | Risks (R-xxx) and mitigations, plus sandbox environment notes. |
| `docs/04-roadmap.md` | Round plan and inputs needed from Kia. |
| `mocks/` | Design mocks, one folder per round. `mocks/index.html` is the gallery. |
| `tools/screenshots/` | Headless screenshot and thumbnail scripts for checking mocks. |

The production Astro app does not exist yet; it arrives in the architecture round (R06).

## How we work

- **Rounds.** Each round: research → mocks or work → ask Kia (multiple-choice questions where possible) → update the decision log → commit and push. Design comes before code.
- **Mocks** offer 3–5 real alternatives (up to about 10 for things like favicons). Taste mocks only need to look right; do not spend effort making them functional. Vary the approach as well as the colour: metaphor, mood, rendering tech.
- **Label the tech honestly.** three.js draws through WebGL or WebGPU; it is not an alternative to WebGL. Use the labels three.js / raw shader / Canvas 2D / CSS / physics engine.
- **Adding a project is a round, not a pipeline.** Kia rejected automated discovery. Every new project gets its own conversation, so the repo must stay easy to extend by convention: predictable names, paths and docs. The playbook (`docs/ADDING-A-PROJECT.md`) will be written in the architecture round; keep it current afterwards.
- Use "Kia" in copy and docs. Do not assume pronouns for Kia; write around them.
- No analytics or trackers (matches the ethos of Kia's projects).

## Hard rules from Kia (do not break)

1. **Never count the projects** in copy or titles ("25 projects", "five encyclopedias"). Every main world must work for any number of projects. Fixed-size devices (a prism, a ring) only hold curated sets: flagships, or one family.
2. **Nothing academic.** No PhD, research, ML or polymer framing. This is the maker / developer / designer side.
3. **Do not repeat Kia's own projects.** No museums (Galerium is one), no compass dials (PolymerAtlas). Read the project READMEs before proposing a world.
4. **Each project gets a bespoke sculpture** (see `mocks/r02-worlds/_sculptures.js`), not an extruded icon.
5. **Never delete a mock.** Revise by adding `NN-name-v2.html`; keep the old file and its thumbnail.
6. Kia's bar: very 3D, creative, out of the box, luxurious. Rejected in R01: cards in a grid, chaotic motion, a big type list with a magnifier, childish physics toys.

## Conventions

- Mock rounds live in `mocks/rNN-<topic>/` with files `NN-<name>.html`, thumbnails in `thumbs/NN-<name>.jpg`, and shared data in `_data.js`. From R02 on, `_data.js` holds the real project list (families, flagships, colours) and `_sculptures.js` the per-project 3D objects.
- Project icons and preview images copied from each repo live in `mocks/assets/projects/<slug>/` for mock use only. The real site should load icons from each project's own Pages site.
- Mock pages are standalone HTML. Third-party code is vendored in `mocks/vendor/` (CDNs are blocked in the sandbox, and the artifact viewer only allows a few CDNs). `three.bundle.min.js` is three.js r186 plus the addons used, built with esbuild.
- Every mock has a small `.mockbar` link back to the gallery naming the concept and its tech.
- The gallery is authored in `mocks/_gallery-body.html` (the Artifact page source, no `<html>` wrapper). `mocks/index.html` is generated from it for GitHub Pages / local viewing. Edit the body file, then regenerate.
- Respect `prefers-reduced-motion` in every mock and page.
- Future project pages live under a URL prefix (`/p/<slug>/`), never at a top-level path that could match a project repo name (risk R-02).

## Checking mocks in the sandbox

```sh
cd mocks && python3 -m http.server 8765 --bind 127.0.0.1 &   # serve
cd tools/screenshots && npm install                           # once
node shot.mjs r01-concepts/01-monomer.html /tmp/x 3000 both   # desktop + phone PNGs and console errors
node thumbs.mjs r01-concepts 01-monomer:6000                  # gallery thumbnail
```

Headless Chromium uses SwiftShader, so WebGL works but slowly; `window.__frames` counts rendered frames. Google Fonts sometimes fail through the proxy, and `thumbs.mjs` retries.

## Published artifacts

- Concept gallery (all rounds): https://claude.ai/artifact/5vmR8Qnvnu34VbqrQZ4nFZ (republish from `mocks/_gallery-body.html` with `root: mocks` and the round's files).
