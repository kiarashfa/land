# 01 · Research

Snapshot taken in Round 01 (October 2026). Versions are the npm `latest` tags at that date; re-check before building.

## Role models

What each one teaches us, not what to copy.

| Site / studio | Why it matters | Lesson for us |
| --- | --- | --- |
| **Igloo Inc** (abeto + Bureaux), Awwwards Site of the Year 2024 | Procedurally grown ice crystals, an entire UI rendered in WebGL, volume data compressed smaller than an image. Stack: three.js, **Svelte**, GSAP, Houdini, Blender. | Svelte + three.js is a proven SOTY stack. Procedural generation scales without hand-modelling, which suits a list that grows. |
| **Messenger** (abeto), Awwwards Site of the Year 2025 | A tiny WebGL planet you walk around to deliver messages. | One small, complete world beats a large empty one. Charm and character count as much as polish. |
| **Lusion** (v3) | Heavy WebGL that stays navigable; case studies remain the focus. | Spectacle must never hide the content. Every project must stay one tap away. |
| **Active Theory** | Real-time particles and immersive rooms, built on their own Hydra framework. | Owning the engine layer gives a consistent feel across pages. |
| **Bruno Simon** (bruno-simon.io) | A drivable physics world, the most-cited 3D portfolio since 2019. | Physics creates delight, but the "toy car portfolio" is now a cliché to avoid. |
| **Samsy** (samsy.ninja) | WebGPU city at 120+ fps. | WebGPU is production-ready and worth it for heavy particle or compute work. |

Sources: [Awwwards Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/), [Igloo Inc case study](https://www.awwwards.com/igloo-inc-case-study.html), [Igloo Inc techniques](https://www.webgpu.com/showcase/igloo-inc-procedural-crystals/), [Messenger](https://www.awwwards.com/messenger.html), [Lusion v3](https://www.awwwards.com/sites/lusion-v3), [Active Theory](https://www.webgpu.com/showcase/active-theory-portfolio/), [Best three.js sites 2026](https://www.utsubo.com/blog/best-threejs-websites-2026).

## Kia's own body of work

Read from each repo's README in Round 02. The full list with families and flagships is in `00-brief.md`.

Things the work has in common, useful for design:

- **Every name fuses two words.** Markey = marque + key; ARMAG = arm + magazine; Perceptense = perception + sense; MorCypher = Morse + cypher; Kalculator = Kia + calculator; AudiOptix = audio + optics; LOSTimer = LOST + timer; Pseudoku = pseudo + sudoku; ConStyx = Construct + Styx; Galerium = gallery + museum; LaLista = "the list" and "the clever one". The fusion of two things into one is Kia's naming signature, and a strong motif for the site.
- **A shared closing line.** Each README ends "Made with ❤️ for …": "those who find joy in every bite / sip / mile", "those who respect every round", "curious minds", "people who read every placard", "everyone who counts", "the LOST fandom". A ready-made voice for the site.
- **A shared ethic.** Free, no ads, no accounts, nothing to subscribe to; data stays in your browser; numbers are sourced or computed, never typed.
- **Screen tributes** (LOST's Swan Station, Severance's Lumon MDR terminal, the Matrix's digital rain) show a love of retro-futurist terminals and fandom detail.
- **Already built by Kia, so not to be repeated:** a compass dial (PolymerAtlas home), a walkable 3D museum with doors, spotlights and gilded frames (Galerium), a music visualizer (AudiOptix), Matrix rain (ConStyx).
- **Each project has a strong icon and colour:** PolymerAtlas compass rose (gold on black), Xefy chef's toque (brick red on cream), Markey flaming wheel (ink), eXir cocktail glass (amber), ARMAG magazine mark (ice blue on black), Perceptense eye (teal), Galerium golden doors (navy and gold), LaLista ¡¿ (teal and orange), MorCypher signal arc (orange), Kalculator K= (pink to violet), AudiOptix note (gold on black), LOSTimer Dharma mark (white on black, green), Pseudoku Lumon globe (cyan on navy), ConStyx 0 (matrix green), DrXRates play disc (gold), website KF (teal).

## Technology landscape (October 2026)

| Layer | Choice to evaluate | Version | Notes |
| --- | --- | --- | --- |
| Framework | **Astro** | 7.3 | Rust compiler, Vite 8 / Rolldown, static output. Content collections with typed schemas suit one-folder-per-project. Client router with view transitions for cinematic page changes; `transition:persist` can keep one WebGL canvas alive across pages. |
| UI islands | **Svelte** + `@astrojs/svelte` | 5.57 / 9.0 | Runes; tiny runtime. |
| Language | **TypeScript** | 7.0 | Go-native compiler. |
| Styling | **Tailwind CSS** | 4.3 | CSS-first config (`@theme`), so design tokens live in CSS. |
| 3D | **three.js** | r186 | `WebGPURenderer` is production-ready with automatic WebGL2 fallback; shaders written once in TSL compile to WGSL or GLSL. `WebGLRenderer` stays the safe default for classic materials. |
| 3D in Svelte | Threlte | 8.6 | Declarative three.js for Svelte 5 with a WebGPU path. For one bespoke scene, plain imperative three.js inside a Svelte component is often simpler and faster. Decide in the architecture round. |
| Raw shaders | WebGL2 / WGSL by hand | n/a | Best for full-screen 2D effects (Prism, Atlas, Lens): a few kilobytes and very fast. |
| Physics | **Rapier** (`@dimforge/rapier2d/3d-compat`) | 0.21 | Rust → WASM, 2D and 3D, deterministic. The modern successor to what Nape did for Flash and Haxe; Nape itself has been unmaintained for about a decade. matter.js (0.20) is the light pure-JS 2D option used in the Pebbles mock. |
| Motion | **GSAP** | 3.15 | Free for all uses since April 2025, including SplitText, MorphSVG and ScrollTrigger (free to use, not open source). |
| Scroll | Lenis | 1.3 | Smooth scroll that plays well with GSAP. |
| Sequencing | Theatre.js | 0.7 | Visual timeline editor for camera choreography; optional. |
| Text in WebGL | troika-three-text | 0.52 | SDF text for type inside 3D scenes. |
| Fonts | Astro Fonts API | stable since Astro 6 | Downloads Google / Fontsource fonts at build time and self-hosts them, with fallbacks and preloads. No runtime call to Google. |
| Audio | Web Audio API (optionally Tone.js) | n/a | Ambient bed + UI sounds, started only after a user gesture (browser rule, and Kia wants it off by default anyway). |
| Hosting | GitHub Pages via GitHub Actions | n/a | `withastro/action` builds and deploys. |

Sources: [Astro 7](https://astro.build/blog/astro-7/), [Astro 6 (fonts API stable)](https://astro.build/blog/astro-6/), [three.js WebGPU renderer](https://threejs.org/manual/en/webgpurenderer.html), [three.js in 2026](https://www.utsubo.com/blog/threejs-2026-what-changed), [Threlte WebGPU](https://threlte.xyz/docs/learn/advanced/webgpu/), [GSAP is free](https://x.com/greensock/status/1917618886796574918), [Rapier](https://rapier.rs/).

## Techniques shortlist

Ideas used in the Round 01 mocks, plus ones held in reserve.

- **Physical materials** (MeshPhysicalMaterial): transmission, iridescence, clearcoat, sheen, for glass, pearl and lacquer. Used in Monomer and Kinetic.
- **Verlet bead-spring chains** with excluded volume (a coarse-grained polymer model). Monomer.
- **Analytic light**: beams, dispersion, spectral colour (Zucconi's fit of the visible spectrum). Prism.
- **Procedural engraving**: rose-engine guilloché, radiolarian plates, contour lines and coastal ripples. Complications, Cabinet, Atlas.
- **GPU particle morphing** between point sets (cloud ↔ emblem). Latent.
- **Lens / refraction post-process** over rendered type, with chromatic aberration. Lens.
- **Rigid-body physics** with irregular convex hulls. Pebbles.
- In reserve: reaction-diffusion (Gray–Scott) growth, SDF ray-marching, WebGPU compute fluids, Gaussian splats, MSDF text, sound-reactive shaders, cross-document view transitions.
