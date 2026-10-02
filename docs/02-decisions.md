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
| D-024 | World concept | decided | One idea per page instead of one world: Quicksilver for the home (D-028), the Trophy Shelf reworked as an auction for the chronology (D-030), the Riso boxes reworked as glass cases for the families (D-031). Rejected: Objects page (cards again), Shadow Play (shadows did not read), Mobile (a baby's cot), Prism II (ugly), Tunnel Book (worst execution), Antique Shop (not luxurious). | R02 → R03 |
| D-025 | Mock history | decided | Mocks are never deleted; revisions are new files with `-v2`, `-v3`. | R02 |
| D-026 | Particle emblem | leaning | Particles condensing into a shape, driven by scroll, belongs on project pages as an effect, not as the main world. | R02 |
| D-027 | Riso reference | decided | Kia's "live boxes" risograph prompt is kept verbatim in `docs/references/riso-boxes-spec.md` as the spec for that direction. | R02 |
| D-028 | Home | decided | Quicksilver: two droplets carry the two words of a project's name, fuse, pour into its object and cool into the sculpture. Round 03 offers three versions (Converge, Pour, Magnet) for Kia to choose or mix. | R03 |
| D-029 | Atmosphere | superseded by D-041 | The home must sit in a place, never a void. Three ambients are built once and shared by every page: Atelier (dark gallery), Dusk (still water, low sun), Travertine (sunlit stone hall). Awaiting Kia's choice. | R03 |
| D-030 | Chronology | superseded by D-039 | The Saleroom: each project is a lot on the home's lacquer plinth, in order of its date; a split-flap board, a rostrum, a seated audience, a ruler-like timeline with the quiet years folded. Awaiting Kia's verdict. | R03 |
| D-031 | Families | superseded by D-039 | Glass cases holding small living rooms, one per project, realistic rather than cartoonish. Round 03 offers three layouts: a row of vitrines, one case in daylight, a glass house with one floor per project. Shown with Screen tributes first. | R03 |
| D-032 | Shared language | decided | Every page reuses the same materials (black lacquer, brass, walnut, glass), the same molten "cooling in" for objects, and the same type families, so the pages feel like one place. | R03 |
| D-033 | Object revisions | leaning | Xefy: a roast chicken on the platter. Perceptense: a brass balance weighing a feather (the eye was rejected). MorCypher: taller, not longer. Kalculator: a real desk calculator with an oversized purple "=" in the site's colour. ConStyx: a bent spoon in front of the rain. | R03 |
| D-034 | Project dates | decided | Each project's date is its repo's first commit, confirmed by Kia, except LaLista (May 2025) and DrXRates (June 2024), where the idea came first. Month-only dates are allowed (`started: '2025-05'`). | R03 → R04 |
| D-035 | Fusion words | decided | Xefy = chef + y (xef is chef in Catalan); eXir = elixir (with its X); DrXRates = Director + X. | R03 → R04 |
| D-036 | People in scenes | leaning | One rigged body (Mixamo Xbot) posed in code (`_rig.js`) and dressed by a paint shader (`_figures.js`), read like a model maker's painted figures: faceless on purpose, so they never look uncanny. | R03 |
| D-037 | Third-party assets | decided | HDRIs are CC0 (Poly Haven via pmndrs/assets). The Mixamo figures come from the three.js examples and are for mocks only; production uses Kia's own Mixamo downloads or commissioned figures. See `mocks/vendor/models/README.md`. | R03 |
| D-038 | Screen tributes | decided | Fan tributes stay tributes: rooms evoke the shows (Lumon's MDR floor, the Swan station, the Construct) with colours, furniture and props, without copying logos or likenesses. | R03 |
| D-039 | Spin-offs | decided | The glass cases with living rooms become a separate project, **GlassRoom** (Kia's top 20 series and top 20 films), and the saleroom becomes **SaleRoom** (a game about the value of things). Both are handed off as self-contained folders at the repo root with full guides. Neither is part of the landing site any more. | R04 |
| D-040 | Mercury | decided | Mercury is the binding element of every page. The home uses Converge (two words ride two droplets and fuse). Emblems are pure mercury, as in Round 02, and only bloom into their real colours on the way into a project's page. | R04 |
| D-041 | Room and quality | leaning | The home sits in the Atelier on capable machines and in the Round 02 void elsewhere. A loading screen guesses the tier from the GPU, times real frames and steps down if needed; the visitor can switch. Phones get a lighter Atelier. | R04 |
| D-042 | Atelier rebuild | decided | The Round 03 Atelier was reported broken on Kia's GPU. Cause found: softbox panels coplanar with their frames (z-fighting on real GPUs). The R04 engine also drops Reflector and RectAreaLights from the Atelier and guards against NaN pixels before bloom. | R04 |
| D-043 | Project page | open | Five designs offered, all with a five-shot gallery and placeholder text for Xefy: Arrival (continuous from the home), The Lot (auctioneer's patter), Exploded View, Reflections (mercury pool) and Mercury Dust (the latent idea, in mercury). Awaiting Kia. | R04 |
