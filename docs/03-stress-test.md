# 03 · Stress test

Things that can go wrong, and what we will do about them. Each risk has an ID so decisions can point at it.

## Platform: GitHub Pages

| ID | Risk | Mitigation |
| --- | --- | --- |
| R-01 | **Static hosting only**: no server, no custom headers, so no COOP/COEP and therefore no `SharedArrayBuffer` (affects some multithreaded WASM physics). | Use single-threaded Rapier / matter.js builds. Everything is built at deploy time. |
| R-02 | **Path collisions.** The user site serves `/`, and every project repo with Pages serves `/<RepoName>/` under the same domain. A top-level folder here with the same name as a repo (e.g. `/xefy/`) makes one of them unreachable, and GitHub does not clearly document which one wins. | All project pages live under a prefix (`/p/`); no other top-level route may equal a repo name. Keep a check script that compares top-level routes with the repo list. |
| R-03 | **Moving `land` into `kiarashfa.github.io`.** The base path changes from `/land/` (preview) to `/` (final). | Make `base` an environment variable in the Astro config from day one. For the move itself, the simplest path is to rename the old `kiarashfa.github.io` repo (or archive its content), then rename `land` to `kiarashfa.github.io`, which keeps history. To be decided at the end. |
| R-04 | Pages limits: 1 GB site, soft 100 GB/month bandwidth. | Video loops must be short, compressed (AV1 + H.264 fallback), and lazy-loaded. Budget roughly 30–60 MB of media in total. |
| R-05 | The current `kiarashfa.github.io` is a redirect to the personal site. Old links and bookmarks will now land on the new site. | Link the personal / research site clearly from About. |

## Audience and context

| ID | Risk | Mitigation |
| --- | --- | --- |
| R-06 | **First visit is on a phone**, often with mobile data, right after meeting Kia. A heavy 3D scene that takes 8 seconds to start loses them. | Phone-first design for the home. A poster frame (still image) shows instantly, and the WebGL world fades in when ready. Every concept must have a deliberate portrait layout, not a squeezed desktop. |
| R-07 | **Link previews.** People will paste the URL into WhatsApp, Telegram or iMessage. Without Open Graph images it looks like nothing. | Build-time OG image for the home and for every project page, in the site's visual language. |
| R-08 | Non-technical visitors may not realise things are interactive ("drag the chain"). | One clear affordance per scene. Every world needs an always-visible plain path into the projects (an Index). |
| R-09 | URL is long to say aloud ("kiarashfa dot github dot io"). | Consider a QR card or a custom domain later. A custom domain is possible on Pages and would also make old project URLs move; decide deliberately. |

## Graphics

| ID | Risk | Mitigation |
| --- | --- | --- |
| R-10 | WebGPU unavailable on some devices; WebGL2 on very old ones. | three.js `WebGPURenderer` falls back to WebGL2 automatically. Below that, the static poster plus the plain index is the fallback. |
| R-11 | Phones overheat or drain battery on continuous rendering. | Render on demand when idle; cap pixel ratio at 2 (1.5 on phones); pause when the tab is hidden or the canvas is off screen. |
| R-12 | `prefers-reduced-motion`. | Every scene has a still or near-still mode. Already respected in the Round 01 mocks. |
| R-13 | Text inside WebGL is invisible to screen readers and search engines. | Hybrid: real HTML text for every name, description and link; WebGL decorates. |
| R-23 | **Heavy scenes.** The Round 03 pages render rigged figures, area lights, shadows, GTAO and depth of field; the saleroom and the glass house draw many lights at once. | Production: render on demand, bake static lighting into textures where possible, drop GTAO and DOF on phones, cap lights per room, load rooms lazily, and keep a still image for very old devices. |
| R-24 | **Execution quality.** Round 02 showed that ideas fail on execution (Tunnel Book). | Every mock is checked frame by frame on desktop and phone before it is shown; thumbnails are taken from verified states (`?still`, `?at=`). |
| R-25 | **Sandbox hides GPU bugs.** SwiftShader rendered the R03 Atelier fine while Kia's GPU did not. | Avoid coplanar faces (offset at least 1 mm), avoid exotic render paths (Reflector + custom depth-writing shaders), guard NaNs before bloom, and ask Kia to check on real hardware. |
| R-14 | Concept clichés (prism ↔ Pink Floyd, particle clouds, toy physics). | Named in each concept card. Push for the version only Kia could have (polymer chains, computed encyclopedias, etc.). |

## Content and maintenance

| ID | Risk | Mitigation |
| --- | --- | --- |
| R-15 | 25 stories and challenge write-ups is a lot of writing; quality may vary. | A fixed per-project template (idea, story, challenges, what makes it special, links) and one project per round, with Claude drafting from the repo README and Kia editing. |
| R-16 | Future chats lose context. | `CLAUDE.md` plus these docs are the memory. Keep the decision log and the "add a project" playbook current. |
| R-17 | Project icons and screenshots drift as projects change. | Icons are loaded from each project's own Pages site (same origin after the move, so no CORS problems even inside WebGL). Screenshots get a capture date and are refreshed in that project's round. |
| R-18 | Fonts with restrictive licences. | Google Fonts / Fontsource (OFL) only, unless Kia buys a licence for a commercial face. |
| R-19 | Name spelling. | Resolved: "Farajzadehahary". |
| R-20 | Licence of this site's own code. | Deferred: Kia will add a licence later. |
| R-21 | **Repeating Kia's own work.** Kia has built a compass dial (PolymerAtlas) and a walkable 3D museum (Galerium); concepts that echo them are rejected. | Before proposing a world, check it against every project in the brief, read its README, and say so if it overlaps. |
| R-22 | **Counting creeps back in.** Fixed-size compositions (a ring of N, a prism of N lines) silently assume a count. | Every world states how it holds 16 and 100 projects. Fixed-size devices only for curated sets. |

## Environment notes (for Claude sessions)

- From the cloud sandbox, `*.github.io`, cdnjs, jsdelivr and unpkg are blocked; the npm registry and Google Fonts are reachable. Vendor libraries from npm instead of linking CDNs, and expect Google Fonts to fail occasionally in headless screenshots.
- Headless Chromium uses SwiftShader (software WebGL2). It renders correctly but slowly, so time-based animations look less advanced in screenshots than on a real GPU.
