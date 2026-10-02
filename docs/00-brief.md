# 00 · Brief

The authoritative record of what this site is for. Every later decision should be traceable to something here. Update it only when Kia changes the brief.

## One sentence

A landing site at `kiarashfa.github.io` that gathers every side project Kia has made under one roof, so that when Kia meets someone they can say "go here" and that person can explore, understand and open each project.

## Who it is for

| Audience | What they need |
| --- | --- |
| Curious public (primary) | People Kia meets in person, usually not technical. They arrive on a phone, from a typed URL, QR code or shared link. They need wonder in the first seconds and an obvious way into each project. |
| Creative-dev peers (secondary) | Awwwards / FWA-level people. They notice craft, novelty and technical ambition. |
| Not the audience | Recruiters and academia. The personal site (the `website` repo) covers research and career. |

## Hard rules (from Kia, Round 01 feedback)

1. **Never count the projects.** No "25 projects", "twenty-five things", "five encyclopedias" in any copy or title. The number changes constantly and means nothing. The main world must work for any number of projects, 16 or 100.
2. **Finite devices only for curated sets.** A prism, a ring or a fixed row can hold a curated selection (flagships on the home, one family on a family page), never the whole collection.
3. **Not academic, not scientific.** This site is the developer / designer / maker side of Kia. No PhD, research, machine-learning or polymer framing. (PolymerAtlas is the only project with a polymer subject, and it is just one project.) Ideas that *look* scientific are still allowed if they are not about the career.
4. **No museums.** Galerium is already Kia's walkable 3D art museum, and PolymerAtlas already has a compass dial. Avoid worlds that repeat Kia's own projects.
5. **Each project gets a bespoke sculpture** (a new object designed for it), not an extruded copy of its icon.
6. **Mocks are never deleted.** A changed mock gets a new version file (`-v2`), and the old one stays.

## What it must do

1. Showcase every project. All are public repos deployed on GitHub Pages under `kiarashfa.github.io/<Repo>/`.
2. For each project: introduce it; tell the idea / story / reason behind it; name the challenges Kia deliberately explored, or what makes it special; link to the live project. Kia will supply stories and challenges later.
3. Each project gets its **own full page** with a real URL.
4. Several views over one data set: chronological, by family, and others later. The data model must make a new view cheap.
5. A short About section and contact links.
6. Look graphically astonishing: luxury, elegant, state of the art, very 3D, creative and out of the box. Never a generic portfolio, never cards in a grid, never a lazy typographic list.

## The projects (October 2026)

Families as Kia groups them. Flagships are marked ★; they are spread across families on purpose.

| Family | Project | Repo | One line (from its README) |
| --- | --- | --- | --- |
| Encyclopedias | ★ PolymerAtlas (Atlas of Polymers) | `PolymerAtlas` | The polymers that made the modern world, each told inside the year it was first made. |
| | ★ Xefy | `Xefy` | Recipes where every quantity, nutrition figure and timing is computed, never typed. |
| | ★ Markey | `Markey` | Production cars, sourced or computed, with a real wind tunnel running on your GPU. |
| | ★ eXir | `eXir` | Drinks where every measure, dilution and strength is computed. |
| | ★ ARMAG | `ARMAG` | Firearms and cartridges, laid out like a magazine, with real ballistics. |
| Learning | Perceptense | `perceptense` | Bite-sized interactive modules for an intuition about everything. |
| | ★ Galerium | `Galerium` | A museum of art history: a night-sky timeline and a walkable 3D gallery for every artist. |
| | ★ LaLista | `LaLista` | Spanish as it is spoken in Spain: vocabulary with real audio and a grammar of workbooks. |
| | MorCypher | `morcypher` | A virtual telegraph key for sending, decoding and learning Morse code. |
| Tools | Kalculator | `Kalculator` | A calculator that renders natural math, solves, graphs and converts. |
| | AudiOptix | `audioptix` | A music player and evolving visualizer for your own files. |
| Screen tributes | LOSTimer | `LOSTimer` | The Swan Station countdown from LOST, as a working timer. |
| | Pseudoku | `pseudoku` | Sudoku inside Lumon's MDR terminal from Severance. |
| | ConStyx | `constyx` | A focus terminal disguised as the Matrix's digital rain. |
| Film | ★ DrXRates (The Cinema Ledger) | `DrXRates` | A personal film archive with a ten-part rating system. |
| Personal | website | `website` | Kia's personal site, which has unique features of its own. |

## Identity

- **Brand:** KiarashFa (the handle used almost everywhere).
- **Voice / nickname:** Kia (what everyone calls Kia).
- **Full name, footers:** Kiarash Farajzadehahary (spelling confirmed).
- **Monogram candidate:** KFA.
- **Person-first** presentation, not a studio and not a faceless collection.
- **Licence of this repo:** not decided; Kia will add one later.

## Taste signals so far

- Moods: dark cinematic luxury, light museum / editorial, playful / tactile (refined, never childish).
- Round 01 verdicts: Monomer *maybe* (graphics), Prism *maybe* (the idea of curiosity entering and projects coming out), Complications *maybe* (best execution, but not original to Kia), Latent *maybe* (particles condensing into an emblem, as a scroll effect on project pages rather than the main show), Atlas *maybe* (objects of different sizes, each with its own emblem). Cabinet, Kinetic, Lens and Pebbles were rejected as generic, chaotic, lazy or childish.
- Visual quality matters more than speed scores. Lighthouse is not a goal; it still has to work on phones.
- Sound: ambient + UI sound, **off by default**, behind a toggle.
- Language: English now, **i18n-ready** structure.
- Round 02 verdicts: Quicksilver is the home ("neat, clean and original", since many project names fuse two words), but it felt like it floated in a void. Trophy Shelf becomes the chronology, as a super-luxury auction where each item takes the stage. The Riso boxes become the families, as realistic glass boxes with living people inside. Kia loved the Riso recreation of Severance's office with its split desks. Rejected: the Objects page (cards again), Shadow Play (the shadows did not read), Mobile ("for babies"), Prism II (ugly), Tunnel Book (a disaster, so check every mock visually). The Antique Shop and the first Trophy Shelf were called ugly.
- Reference for the families: glass-box dioramas by Ryan Sael (a data centre, a river lab, an apartment cut-away), made with Claude: dense props, soft real light, tilt-shift depth of field, a glass case on a dark base with small labels.
- Kalculator's colour is its site's purple (#B06CF0).

## Working agreement

- Many rounds; research, planning and design come before code.
- Most design steps get several mock options. Taste mocks only need to look right.
- Use multiple-choice questions to collect decisions, and stress-test the plan.
- **No automation pipeline for adding projects.** Every new project gets its own round. The repo must be easy to extend by convention, so a future chat can repeat the same steps. See `CLAUDE.md`.
- Built in this repo (`kiarashfa/land`), then moved to the special `kiarashfa.github.io` repo when finished.
