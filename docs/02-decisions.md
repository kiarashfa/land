# 02 · Decision log

Every decision gets an ID. Status is **decided**, **leaning** (a recommendation awaiting Kia) or **open**. Never delete a row; supersede it and say which ID replaced it.

| ID | Topic | Status | Decision | Round |
| --- | --- | --- | --- | --- |
| D-001 | Purpose | decided | One roof for every side project, shareable in person ("go here"). Not a hiring site. | R01 |
| D-002 | Audience | decided | Curious public first, creative-dev peers second. | R01 |
| D-003 | Identity | decided | Person-first. Brand **KiarashFa**, voice **Kia**, full name (Kiarash Farajzadehahary, confirmed) in the footer, **KFA** as a monogram candidate. | R01 |
| D-004 | Structure | decided | Projects have tiers (ambitious vs small). One data model, many views (chronological, family, …), each view cheap to add. | R01 |
| D-005 | Scope | decided | Projects + short About + contact. | R01 |
| D-006 | Moods | decided | Explore dark cinematic luxury, light museum / editorial and playful / tactile. | R01 |
| D-007 | Rendering approach | open | Compare three.js, raw shader and no-WebGL designs in the mocks before locking anything. If WebGL: hybrid (visual-first, still performant). Lighthouse is not a goal. | R01 |
| D-008 | Sound | decided | Ambient + UI sound, off by default, behind a toggle. | R01 |
| D-009 | Language | decided | English now, i18n-ready content structure. | R01 |
| D-010 | Adding projects | decided | No automated discovery pipeline. Each new project gets its own round. The repo must be extendable by convention: naming, paths and docs. | R01 |
| D-011 | Project detail | decided | Separate full page per project, with a cinematic transition. | R01 |
| D-012 | Project visuals | superseded by D-021 | Decide after the concepts. Candidates: real screenshots / video loops, generative signature, designed emblem. Icons are loaded from each project's own Pages site. | R01 |
| D-013 | World concept | superseded by D-024 | Round 01 offered nine concepts. None chosen: Monomer, Prism, Complications, Latent, Atlas were *maybe*; Cabinet, Kinetic, Lens, Pebbles *no*. Kia asked for more 3D, more creative, more out of the box. | R01 |
| D-014 | Framework | leaning | Astro 7 static + Svelte 5 islands + TypeScript + Tailwind 4, as Kia proposed. Fits static GitHub Pages and per-project pages. Confirm in the architecture round. | R01 |
| D-015 | Trackers | leaning | No analytics and no trackers, matching the ethos of Kia's projects. | R01 |
| D-016 | Project URLs | leaning | Project pages live under a prefix (e.g. `/p/<slug>/` or `/works/<slug>/`), never at a top-level path that could collide with a project repo name. See risk R-02. | R01 |
| D-017 | Fonts | leaning | Self-host through the Astro Fonts API; no runtime request to Google. | R01 |
| D-018 | Counting | decided | Never state how many projects there are, in any copy. The main world must work for any number. | R02 |
| D-019 | Curated devices | decided | Finite devices (prism, ring, row) only hold curated sets: flagships on the home, one family on a family page. | R02 |
| D-020 | Framing | decided | Nothing academic or scientific about Kia's career. This is the maker / developer / designer side. | R02 |
| D-021 | Project objects | decided | Every project gets a bespoke sculpture designed for it (not an extruded icon). Its own round can refine it. | R02 |
| D-022 | Flagships | decided | PolymerAtlas, Xefy, Markey, eXir, ARMAG, DrXRates, LaLista, Galerium. Spread across families on purpose. | R02 |
| D-023 | Museums | decided | No museum worlds; Galerium already is one. More generally, avoid repeating Kia's own projects (PolymerAtlas compass, Galerium museum). | R02 |
| D-024 | World concept | open | Round 02 offers new 3D worlds plus a sculpture study. Awaiting Kia's verdicts. | R02 |
| D-025 | Mock history | decided | Mocks are never deleted; revisions are new files with `-v2`, `-v3`. | R02 |
| D-026 | Particle emblem | leaning | Particles condensing into a shape, driven by scroll, belongs on project pages as an effect, not as the main world. | R02 |
