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
| `docs/references/` | Reference material from Kia (e.g. the risograph "live boxes" spec). |
| `mocks/` | Design mocks, one folder per round. `mocks/index.html` is the gallery. |
| `tools/screenshots/` | Headless screenshot and thumbnail scripts for checking mocks. |
| `tools/assets/` | Converters that turn EXR and GLB into files any static host serves. |
| `GlassRoom/`, `SaleRoom/` | Spin-off projects handed off in R04 (self-contained, with their own README and docs). Not part of the landing site. |

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
7. **Mercury binds every page** (R04): Quicksilver only, Converge for the words, emblems pure mercury until a project's page.

## Conventions

- Mock rounds live in `mocks/rNN-<topic>/` with files `NN-<name>.html`, thumbnails in `thumbs/NN-<name>.jpg`, and shared data in `_data.js`. From R02 on, `_data.js` holds the real project list (families, flagships, colours) and `_sculptures.js` the per-project 3D objects.
- Project icons and preview images copied from each repo live in `mocks/assets/projects/<slug>/` for mock use only. The real site should load icons from each project's own Pages site.
- Mock pages are standalone HTML. Third-party code is vendored in `mocks/vendor/` (CDNs are blocked in the sandbox, and the artifact viewer only allows a few CDNs). `three.bundle.min.js` is three.js r186 plus the addons used, built with esbuild (R01–R02). `three.r03.min.js` (R03 on) adds GTAO, Bokeh, Reflector, Water, Sky, GLTF/EXR loaders, SkeletonUtils, RectAreaLight and three-mesh-bvh. Keep old bundles; older rounds depend on them.
- `mocks/vendor/hdri/` holds CC0 HDRIs; `mocks/vendor/models/` holds rigged figures for mocks only (see its README for licences). The artifact host refuses `.exr` and `.glb`, so pages load `<name>.hdr.png` (via `loadHDR` in `_ambients.js`) and `Xbot.gltf.json`; convert new assets with `tools/assets/` (`exr2png.mjs`, `glb2json.mjs`).
- Every mock has a small `.mockbar` link back to the gallery naming the concept and its tech.
- `08-riso-boxes.html` is deliberately self-contained (inline data, system fonts, Canvas 2D, one request), following `docs/references/riso-boxes-spec.md`.
- `_dev-*` files are scratch pages (git-ignored), e.g. `r02-worlds/_dev-sheet.html` renders every sculpture in one contact sheet, and `r03-pages/_dev-vitrine.html?room=<slug>` renders one glass case.
- Round 04 (current) lives in `mocks/r04-mercury/`: `_mercury.js` (the engine: liquid, pure-mercury emblems with a colour bloom, rooms `atelier` / `void` / `pool`, tiers, frame timing, NaN guard), `_ui.css` (shared look, loading veil, project sections, gallery), `_detail.js` (placeholder copy, five canvas "screenshots", gallery lightbox), `_page.js` (shared start-up for project pages), `_home.js` (fusions). Pages take `?tier=high|mid|low`, `?still`, `?open=<slug>` / `?p=<slug>`, `?at=`, `?ch=`, `?s=`, `?veil`.
- Mercury rule (D-040): emblems are pure mercury everywhere except a project's own page, where they bloom into colour.
- Round 03 shared modules in `mocks/r03-pages/`: `_qs.js` (liquid-metal engine, SDF bake, molten dissolve), `_ambients.js` (Atelier, Dusk, Travertine; each returns its `plinth`), `_home.js` (word fusions), `_rig.js` (aim-based posing for Mixamo skeletons), `_figures.js` (painted figures and living loops), `_vitrine.js` (glass case, modelling kit, light rescaling, gallery environment), `_rooms.js` (one miniature room per project, built in real metres).
- A new family room = a builder in `_rooms.js` keyed by the project slug, plus a line in `SCENE_NOTES`. Model in metres with people 1.75 m tall; `rescaleLights` fixes light intensities after the room is shrunk into a case.
- Heavy pages take `?still` (a settled frame) and `?i=` / `?lot=` / `?at=` to pick a state, so screenshots and thumbnails are reproducible.
- The gallery is authored in `mocks/_gallery-body.html` (the Artifact page source, no `<html>` wrapper). `mocks/index.html` is generated from it for GitHub Pages / local viewing. Edit the body file, then regenerate.
- Respect `prefers-reduced-motion` in every mock and page.
- Future project pages live under a URL prefix (`/p/<slug>/`), never at a top-level path that could match a project repo name (risk R-02).

## Checking mocks in the sandbox

```sh
cd mocks && python3 -m http.server 8765 --bind 127.0.0.1 &   # serve
cd tools/screenshots && npm install                           # once
node shot.mjs r01-concepts/01-monomer.html /tmp/x 3000 both   # desktop + phone PNGs and console errors
node thumbs.mjs r01-concepts 01-monomer:6000                  # gallery thumbnail
FRAMES=2 node thumbs.mjs r03-pages "04-auction:3000:?lot=8&still"   # heavy page: query string, wait for frames
```

Headless Chromium uses SwiftShader, so WebGL works but slowly (the Round 03 pages take 5–15 s per frame); `window.__frames` counts rendered frames. The server's background task stops after two hours; restart it when needed. Google Fonts sometimes fail through the proxy, and `thumbs.mjs` retries.

## Published artifacts

- Concept gallery (all rounds): https://claude.ai/artifact/5vmR8Qnvnu34VbqrQZ4nFZ (republish from `mocks/_gallery-body.html` with `root: mocks` and the round's files).
