# GlassRoom

Small living rooms inside glass cases, rendered in the browser with three.js.

This folder is a hand-off. The idea started as the "Families" page of Kia's landing site (KiarashFa, Round 03). Kia liked it enough to make it a separate project: **a website for Kia's top 20 TV series and top 20 films of all time**, where each title gets its own room under glass.

Everything here is a design mock, not production code. It works and you can open it, but it was built to judge the look quickly. Read the docs before building on it.

## Start here

1. Read `docs/01-brief.md`: what Kia wants, Kia's feedback on these mocks, and the open questions.
2. Read `docs/03-lessons-and-fixes.md` **before you change anything**: it lists the known defects, why they happen and how to fix them.
3. Read `docs/02-how-it-works.md` for the architecture, and `docs/04-room-recipe.md` when you build a room.

## Run it

```sh
cd mocks && python3 -m http.server 8766 --bind 127.0.0.1
# then open http://127.0.0.1:8766/
```

Any static server works. Open the pages on a computer with a real graphics card first; they are heavy.

| Page | What it shows | Useful URL parameters |
| --- | --- | --- |
| `pages/05-vitrines.html` | **The Vitrines.** A row of frameless glass cases on lacquer plinths in a dark gallery. Arrows move between cases; "Look closer" (or a tap) leans in until the room reads as a miniature (tilt-shift). | `?i=1` pick a case, `?zoom` start close, `?still` freeze time for screenshots |
| `pages/06-specimen.html` | **The Specimen.** One case in a sunlit stone hall. Choosing another title sinks the room into the plinth and lifts the next one up, like a museum lift. Drag to walk around it. | `?i=1`, `?th=0.8` camera angle, `?still` |
| `pages/07-glass-house.html` | **The Glass House.** One glass building standing in still water at dusk; every floor is a room. Scroll or swipe to ride between floors. This is the seed of Kia's "20-storey building". | `?i=1` pick a floor, `?still` |

The rooms in the mocks are TV tributes from Kia's own projects: Lumon's Macrodata Refinement floor (*Severance*), the Swan station (*LOST*) and the Construct (*The Matrix*). They are good test cases because they are already TV and film.

## What is in the folder

```
GlassRoom/
  README.md                 this file
  docs/
    01-brief.md             the new project, Kia's words, feedback, open questions
    02-how-it-works.md      architecture: case, rooms, scale, light, glass, figures, post-processing
    03-lessons-and-fixes.md known defects with causes and fixes; what "more real" means in practice
    04-room-recipe.md       step by step: how to build one room well, with a checklist
  mocks/
    index.html              local index of the three pages
    pages/                  the three pages and their shared modules (_*.js), thumbnails
    vendor/                 three.js r186 bundle, HDRIs (PNG and EXR), the rigged figure (glTF JSON and GLB)
  tools/
    screenshots/            headless Chromium screenshots and thumbnails (Playwright)
    assets/                 converters: EXR to a web PNG, GLB to glTF JSON
```

## Ground rules carried over from the landing-site project

- Kia is the owner. Use "Kia" in copy and docs, and don't assume pronouns; write around them.
- Design comes before code. Work in rounds: research, mocks with 3–5 real alternatives, ask Kia (multiple choice where possible), record decisions, commit.
- **Never delete a mock.** Revise by adding `NN-name-v2.html` and keep the old file and its thumbnail.
- No analytics and no trackers.
- **Check every page visually** on desktop and phone sizes before showing it. Kia judges execution harshly, and earlier rounds failed on looks, not ideas.
- The landing site never counts its projects. That rule belonged to that site. A "top 20" list counts by nature, so ask Kia how numbers should appear.

## Status

- Working mocks of three layouts, with three rooms.
- Known defects, fixes not yet applied (see `docs/03-lessons-and-fixes.md`):
  - In the Swan and Construct cases, the glass case is shorter than the room walls.
  - The cases and floors are different sizes because each room was scaled differently.
  - The rooms are not realistic enough for Kia.
  - The figures look like mannequins.
- No data model yet for the 40 titles, no routing, no build. The landing site's planned stack is Astro + Svelte + TypeScript + Tailwind with three.js; confirm with Kia before choosing.
