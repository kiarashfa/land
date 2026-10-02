# SaleRoom

A luxury auction saleroom, rendered in the browser with three.js. Each item takes the stage in turn under one spotlight.

This folder is a hand-off. The scene started as the "Chronology" page of Kia's landing site (KiarashFa, Round 03), where each of Kia's projects was offered as a lot. Kia decided to turn it into a separate project: **a game and website that teaches people the value of things**, or tests how well they understand what an item is worth. It should be educational and gamified, in the spirit of Kia's project *Perceptense* (bite-sized interactive modules that build intuition).

Everything here is a design mock, not production code. Read the docs before building on it.

## Start here

1. `docs/01-brief.md`: Kia's words, the project, Kia's feedback (the audience looked like dummies), and the open questions.
2. `docs/03-lessons-and-fixes.md`: what to fix first and why.
3. `docs/04-game-design.md`: game loops, learning design and content model, as proposals to put to Kia.
4. `docs/02-how-it-works.md`: the scene, piece by piece, and how to reuse it.

## Run it

```sh
cd mocks && python3 -m http.server 8767 --bind 127.0.0.1
# open http://127.0.0.1:8767/
```

Open `pages/04-auction.html` on a computer with a real graphics card. Useful URL parameters:
- `?lot=4` starts at the fifth lot.
- `?still` freezes a settled frame (lot in, board flipped, paddles up) for screenshots.
- `?cam=x,y,z,lx,ly,lz` overrides the camera (debugging).
- `?nobokeh` turns off depth of field.

Controls: wheel or arrow keys move between lots; click a bead on the timeline to jump; it auto-advances every 7 seconds.

## What is in the folder

```
SaleRoom/
  README.md
  docs/
    01-brief.md              the new project, Kia's words, feedback, open questions
    02-how-it-works.md       scene anatomy: room, stage, lot, rostrum, board, screen, audience, post
    03-lessons-and-fixes.md  the audience problem and other defects; how to make it real
    04-game-design.md        proposals: game loops, value lessons, scoring, content model
  mocks/
    index.html               local index
    pages/04-auction.html    the saleroom, plus the modules it imports (_*.js) and a thumbnail
    vendor/                  three.js r186 bundle, HDRIs (PNG and EXR), the rigged figure (glTF JSON and GLB)
    assets/projects/         preview images of Kia's projects, shown on the saleroom screen (mock content)
  tools/
    screenshots/             headless screenshots and thumbnails (Playwright)
    assets/                  converters: EXR to web PNG, GLB to glTF JSON
```

## Ground rules carried over from the landing-site project

- Kia is the owner. Use "Kia" in copy and docs, and don't assume pronouns; write around them.
- Design comes before code. Work in rounds: research, mocks with 3–5 real alternatives, ask Kia (multiple choice where possible), record decisions, commit.
- **Never delete a mock.** Revise with `NN-name-v2.html` and keep the old file and thumbnail.
- No analytics and no trackers.
- Check every page by eye on desktop and phone before showing it.
- Kia's bar: luxurious, elegant, very 3D, never childish or toy-like.

## Status

- One working mock of the saleroom. In it:
  - lots turn on a lacquer plinth and cool in from molten metal
  - a split-flap board shows the date
  - an auctioneer raises the gavel, and seated bidders lift numbered paddles
  - a screen shows the lot's image
  - a timeline sits along the bottom
- Kia's verdict: "not bad", but **the audience is very bad: they look like dummies**. Fixing the people is the first job (see `docs/03-lessons-and-fixes.md`).
- No game logic, no item data, no build yet.
