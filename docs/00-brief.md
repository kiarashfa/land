# 00 · Brief

The authoritative record of what this site is for. Every later decision should be traceable to something here. Update it only when Kia changes the brief.

## One sentence

A landing site at `kiarashfa.github.io` that gathers every side project Kia has made under one roof, so that when Kia meets someone they can say "go here" and that person can explore, understand and open each project.

## Who it is for

| Audience | What they need |
| --- | --- |
| Curious public (primary) | People Kia meets in person, usually not technical. They arrive on a phone, from a typed URL, QR code or shared link. They need wonder in the first seconds and an obvious way into each project. |
| Creative-dev peers (secondary) | Awwwards / FWA-level people. They notice craft, novelty and technical ambition. |
| Not the audience | Recruiters and academia. The personal / research site (the `website` repo) does that job. This site is about hobby work: things Kia makes for the pleasure of it, things Kia wished existed. |

## What it must do

1. Showcase about 25 projects (the list grows). Every project is on GitHub, public, and deployed on GitHub Pages.
2. For each project: introduce it; tell the idea / story / reason behind it; name the challenges Kia deliberately explored, or what makes it special; link to the live project.
3. Each project gets its **own full page** with a real URL (not only an overlay). Kia's answer: "Separate full pages."
4. Several views over one data set are expected: chronological, by family, and others later. The data model must make a new view cheap.
5. A short About section and contact links.
6. Look "graphically astonishing": luxury, elegant, professional, state of the art, never a generic portfolio.

## Identity

- **Brand:** KiarashFa (the handle used almost everywhere).
- **Voice / nickname:** Kia (what everyone calls Kia).
- **Full name, footers:** Kiarash Farajzadehahary. *Open:* confirm the spelling; publications use "Farajzadehahary", and one answer typed "Farajzadehahry".
- **Monogram candidate:** KFA (also the name of Kia's licence: "KFA Source-Available License 1.0").
- **Person-first** presentation, not a studio and not a faceless collection.

## Taste signals so far

- Moods chosen: dark cinematic luxury, light museum / editorial, playful / tactile. Scientific instrument was not picked on its own.
- Visual quality matters more than speed scores. Lighthouse is explicitly not a goal; the site still has to work well on phones.
- Wants to compare three.js-based designs, hand-written shader designs and no-WebGL designs before locking the approach. For WebGL, prefers a hybrid with visuals plus reasonable performance.
- Sound: ambient + UI sound, **off by default**, behind a tasteful toggle.
- Language: English now, **i18n-ready** structure.
- Project visuals: undecided until seen in the concepts. Real screenshots or video loops and generative signatures are both of interest. Each project already has its own icon / favicon, which can be loaded from the project's own Pages site instead of being duplicated here.

## Working agreement

- Many rounds; research, planning and design come before code.
- Most design steps get 3–5 (sometimes 10, e.g. favicon) mock options to choose from. Taste mocks only need to look right; they do not need to work.
- Use multiple-choice questions to collect decisions, and stress-test the plan.
- **No mechanical automation pipeline for adding projects.** Every new project gets its own dedicated round in a future chat. The repo must instead be easy to extend by convention: clear naming, paths and documentation, so a future chat can repeat the same steps for project 26. See `CLAUDE.md`.
- Built in this repo (`kiarashfa/land`), then moved to the special `kiarashfa.github.io` repo when finished.
