# 04 · Room recipe

How to build one room for one title. Budget about a day per room for the first few, less once the kit grows.

## 1. Choose the moment

- Pick **one place and one moment** that anyone who loved the title recognises instantly, and that spoils nothing important.
- Write the moment down in one line, the way it will appear on the label, e.g. *"The Swan station, 108 minutes · LOST"*.
- List the **3–5 signature elements** that make it recognisable, in order of importance. Examples from the mocks:
  - **MDR:** green carpet, the split desk with four terminals, white emptiness, the refiners typing, Milchick walking.
  - **Swan:** the countdown clock, the green-screen terminal, 70s panelling and pipes, the alarm, the numbers.
  - **Construct:** pure white void, two red leather chairs, an old TV, the pills, the spoon.
- Avoid real logos and actor likenesses. Evoke them with colour, costume, props and light.

## 2. Block it out in the module

- Work inside the shared module (`MODULE` = 9.6 × 7.6 × 2.8 m; see `03`, fix 1) at real size: people 1.75 m tall, doors 2.1 m, desks 0.74 m, seats 0.47 m.
- Keep the cut-away convention: back and left walls full height; front and right walls a low kerb.
- Set the camera to the page's default view and check the composition from there: the signature elements must read from the overview, not only close up.

## 3. Materials

- Floors and walls get PBR textures with variation. Never use a flat colour on a large surface.
- Bevel every edge. Add skirting, frames, trims and switch plates.
- Add clutter in layers: furniture, then objects on furniture, then small things on objects.

## 4. People

- Choose the characters (usually 2–4) and give each a costume read: silhouette, colours, hair, one prop.
- Pose them with real clips where possible, or with the rig (`_rig.js`) plus a living loop (`_figures.js`).
- Add one moving person (walking or gesturing) per room if it suits the moment. Motion catches the eye.

## 5. Light

- One key (a soft spot, casting shadows), practicals that look like sources (lamps, screens, windows), and a gentle fill.
- Use real-scale values, then let `rescaleLights` handle the shrinking (see `02` for numbers).
- Better: bake static light in Blender and keep realtime light for moving things.
- Check that the room isn't blown out on a white surface and isn't muddy in the corners.

## 6. Life

- Animate what the title is about: a clock counting, screens changing, rain, a flickering bulb.
- Repaint canvas textures at most about 8 times a second. Keep `update(t, dt)` cheap.
- Respect `prefers-reduced-motion`: keep a calm, near-still state.

## 7. Check before showing anyone

- [ ] The room fits the module; walls are below the glass lid in every layout.
- [ ] People are the same size as in every other room.
- [ ] No z-fighting stripes (offset stacked surfaces by at least 1 mm in world space).
- [ ] Exposure right in all three layouts (dark gallery, daylight hall, dusk tower).
- [ ] Shadows present and soft; contact shadows where things meet the floor (GTAO).
- [ ] Recognisable at the overview distance and rich at the close zoom.
- [ ] `?still` gives a good, settled frame for the thumbnail.
- [ ] Screenshots at desktop (1440 × 900) and phone (390 × 844) sizes, inspected by eye.
- [ ] Performance: about 2–3 lights, 1 shadow caster; frame time checked on a mid-range laptop.

## 8. Register it

- Add the builder to `ROOMS` in `_rooms.js` under the title's slug, and a caption to `SCENE_NOTES`.
- Add the title to the data file (title, year, kind: series or film, rank, a line from Kia, link).
- Take thumbnails with `tools/screenshots/thumbs.mjs`.
