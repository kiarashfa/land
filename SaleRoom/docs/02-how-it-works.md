# 02 · How it works

One standalone page, `mocks/pages/04-auction.html`, built on three.js r186 (vendored as one bundle, `mocks/vendor/three.r03.min.js`). There is no build step.

## Modules it uses

| File | Used for |
| --- | --- |
| `_data.js` | The landing site's project list, used as the lots, plus `byDate()` and `MONTHS`. **Replace it** with the game's item data. |
| `_sculptures.js` | `makeSculpture(project)`: a bespoke procedural 3D object per project, standing in for the lot. Replace with item models (glTF) or photographs on an easel or plinth. |
| `_qs.js` | Only `makeDissolvable(obj, uniforms)` is used: a shader patch that makes a mesh appear through a noise threshold with a glowing molten edge ("cooling in"). The rest of `_qs.js` is the landing site's liquid-metal engine; it is imported but unused here. |
| `_ambients.js` | Only `loadHDR(name)` is used, to decode `vendor/hdri/studio.hdr.png` into an environment map. |
| `_rig.js` | `loadCharacter('Xbot')` (load once, clone per use) and `makeRig()` / `POSES` for procedural posing of the auctioneer and the bidders. |

## The scene, piece by piece

Units are metres. y is up, the stage faces +z, and the camera sits at the back of the room.

- **Room:**
  - deep carpet under the seats
  - a black lacquer stage 0.5 m high, topped with "mirror stone": a three.js `Reflector` under a semi-transparent clearcoat skin
  - a back wall of 84 instanced walnut flutes between brass bands
  - a brass "SALEROOM" plate
  - fog to soften depth
- **Lot:**
  - stands on a 0.8 m lacquer plinth with a brass seam, with a turntable on top at about 0.22 rad/s
  - one shadow-casting spotlight from high above the audience, a hazy additive light cone (`beam` shader), and a soft rectangular key light from the front
  - each lot is scaled to about 1.0 m (1.12 m for flagships)
  - changing lot runs `out` (dissolve away, 0.9 s), `swap`, `in` (cool in, 1.6 s), then `hold` (auto-advance after 7 s)
- **Rostrum:** walnut lectern with a brass top band, a banker's lamp (point light) and a gavel. The auctioneer stands behind it, in a lectern pose; the gavel rises as each lot is knocked down.
- **Split-flap board:** a 14-cell canvas texture redrawn while flipping (random glyphs settling left to right), then left alone. It shows the lot's month.
- **Screen:** a lacquer frame with the lot's image (the project's `og.png`) and a caption line, plus a faint blue area light.
- **Audience:**
  - 4 rows × 8 velvet chairs with brass frames, an aisle in the middle, about 80% occupied
  - sitters are seated Xbot figures in a dark suit material
  - a chosen set of bidders raise numbered paddles when a new lot arrives; paddles follow the hand in world space and face the stage
  - the bidder set is filtered so paddles don't cover the card (left on desktop) or the rostrum
- **Camera:**
  - desktop: low at the back right, looking left so the lot sits right of centre, beside the catalogue card
  - portrait (phone): higher and further back, with the card at the bottom
- **Post-processing:** `RenderPass` → `BokehPass` (focus on the lot: 9.9 m desktop, 12.5 m phone; aperture 0.0018) → `UnrealBloomPass` (0.22, 0.5, threshold 0.93) → `OutputPass` (ACES).
- **HTML layer:**
  - header and nav
  - catalogue card: "Lot · date", name, family, Offered, For, Estimate ("Free · no account, no reserve"), and a link
  - a timeline ruler at the bottom with one bead per lot; the quiet 2025 is folded into a "⋯" gap
  - a scrim gradient for legibility

## Reusing it for the game

- **The stage is the game board.** The lot on the plinth, the board (it can show the estimate, a countdown, or "SOLD"), the screen (the catalogue photograph, a clue, a provenance document) and the card (the question and the answer) already form a complete stage.
- **The gavel moment is the reveal.** Gavel up, the hammer price flips onto the board, paddles drop, and the card explains why.
- **Bidders can be opponents.** Their paddles are already animated per person.

## Testing headless

```sh
cd mocks && python3 -m http.server 8767 --bind 127.0.0.1 &
cd ../tools/screenshots && npm install
BASE=http://127.0.0.1:8767 node shot.mjs "pages/04-auction.html?lot=4&still" /tmp/a 9000 both
BASE=http://127.0.0.1:8767 FRAMES=2 node thumbs.mjs pages "04-auction:3000:?lot=8&still"
```

- The sandbox renders with SwiftShader, a software GPU, at about 5–15 s per frame. Wait for `window.__frames`.
- Always check on real hardware too (see `03`).

## Asset formats

Some hosts (including the Claude artifact viewer) refuse `.exr` and `.glb`.
- HDRIs ship as `name.hdr.png`: the top half is the colour clamped to 1 (gamma 2.2), the bottom half is `log2(1 + colour) / 12`. Decode with `loadHDR()`; convert with `tools/assets/exr2png.mjs`.
- Rigged figures ship as glTF JSON with embedded buffers (`tools/assets/glb2json.mjs`).
