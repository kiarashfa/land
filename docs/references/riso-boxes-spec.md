# Reference · "Live boxes" risograph spec

Kia shared this in Round 02 as the prompt used for another, non-public project (a scene-by-scene Moby Dick). It is the reference for the **Riso Boxes** concept (`mocks/r02-worlds/08-riso-boxes.html`). Kia's adaptation for this site: each box represents one project, and the build is free to use Astro and the rest of the stack rather than a single HTML file.

The original reference site (Kevin Ngo's "a small light", made with Claude Opus 5) is blocked from the cloud sandbox, so the mock was built from the text alone.

## The spec, as Kia wrote it

> Open https://a-small-light-three.vercel.app/ and study it for a while: the overview, the tour, a close-up of a room. Kevin Ngo made it with Claude Opus 5: "I made a website with 25 mini rooms (boxes), each with Claude keeping people company. It's all JavaScript in one HTML file. There are no images, fonts or libraries. Every room, person, and ink dot is drawn in code." Your build uses the same format and the same print technique, with each box representing one project. But you are more free (no need to limit it to one JS and HTML, use the Astro and other things I mentioned before) Canvas 2D only, no WebGL. The only text anywhere is the chapter card (requirement 10), set in system font stacks. The page must load with exactly one network request, itself. A simulated risograph print. Every colour is a halftone dot screen of one of four spot inks on warm cream paper, overprinted with multiply so the secondary colours come only from overlaps. Each ink has its own screen angle and its own slight misregistration offset. Dots get small jitter, solids get random ink dropout, and objects knock out what is behind them the way a printer's knock-out does. Hand-drawn linework that boils. Every line wobbles, and lines taper. Bake each scene in three variants with different wobble seeds and cycle them at about 3 Hz, so the linework breathes like hand animation on twos. All randomness is seeded, so the same scene draws the same way on every load. Light is ink. Lamp pools, the try-works fire, the corposants and moonlight are stepped halftone rings, never smooth gradients. Isometric dollhouse dioramas. Each scene is a cut-away isometric slab, like a dollhouse with the near walls removed: a room ashore, a slice of the Pequod's deck and rigging, a patch of open sea with whaleboats. All scenes sit together on one printed sheet, packed into a single block like a poster, with registration crop marks, edge crosshair targets and an ink swatch strip in the margins. Realistic people, not stick figures. Every figure is a properly proportioned, illustrated human body: head, neck, shoulders, torso, hips and limbs drawn as solid, tapering volumes with real anatomy, then dressed in period clothing with weight and folds. Faces carry features when you zoom in: brows, noses, beards, Queequeg's tattoos. Draw the bodies, clothing and shading in the same risograph inks as everything else, so the people look printed in the same hand as the ship. Line figures, stick limbs, or circle heads on single-line bodies are a fail. Figures share one skeleton with keyframed pose clips (walk, haul, row, sit, point, climb, sleep, harpoon, pray, and so on), the body volumes deform with the joints, and they follow paths through their scene on a loop. It prints in, then tours. The sheet appears first, with scenes painting in progressively as if coming off the press. After a few seconds the camera eases into the first scene, holds, and moves through the book in order. Any input pauses the tour and then it resumes. Drag to pan with inertia, scroll to zoom anchored on the cursor, pinch on touch, double-click a scene to fly to it, arrow keys and +/- work, and 0 fits the sheet. Apart from the chapter card there is no UI and there are no labels.

## What the Round 02 mock covers, and what it does not yet

| Requirement | Mock status |
| --- | --- |
| Canvas 2D only, one request, system fonts, chapter card as the only text | Done |
| Four spot inks, own screen angles, misregistration, multiply overprint | Done |
| Dot jitter, solid dropout, knock-outs | Done |
| Boiling, tapered linework; three seeded bakes cycled at 3 Hz | Done (linework on its own solid plate) |
| Light as stepped halftone rings | Done |
| Cut-away isometric dollhouse rooms, one per project | Done (first-pass props) |
| Sheet with crop marks, crosshair targets, ink swatch strip | Done |
| Prints in, then tours; input pauses; pan, zoom, pinch, double-click, keys | Done |
| Realistic people on one skeleton with pose clips | Partial: proportioned tapering volumes, clothing and faces; three-key loops, no walking paths yet |
| Faces legible at close zoom | Partial: needs re-baking at higher resolution when zoomed |
