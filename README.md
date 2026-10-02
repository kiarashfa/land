# KiarashFa · land

The next landing site for **kiarashfa.github.io**: one place for every side project by Kiarash Farajzadehahary (Kia). It is being designed in rounds here, then moved to the `kiarashfa.github.io` repository.

## Status

Round 01 (brief, research, world concepts) is done and waiting for feedback. No production code yet.

- Concept gallery: open `mocks/index.html` (serve the `mocks/` folder locally), or the published artifact linked in `CLAUDE.md`.
- Brief and decisions: [`docs/`](docs/).

## Viewing the mocks locally

```sh
cd mocks
python3 -m http.server 8000
# then open http://localhost:8000
```

The mocks are standalone HTML with vendored libraries (three.js r186, matter.js 0.20) in `mocks/vendor/`. They need an internet connection for Google Fonts only.

## Layout

```
docs/               brief, research, decisions, stress test, roadmap
mocks/              design rounds (rNN-topic/), gallery, vendored libs
tools/screenshots/  headless screenshot helpers for checking mocks
CLAUDE.md           working memory for Claude sessions
```
