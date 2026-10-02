# 03 · Lessons and fixes

Read this before changing anything.

## Fix 1: the glass is shorter than the room (the Swan, and the Construct too)

**Symptom:** in the Swan station case (*LOST*), the room's walls poke up through the glass lid. Kia spotted it. The Construct has the same problem; it is less visible because its walls are white.

**Cause:** each page scales a room to fit the case **width**: `scale = 1.66 * 0.985 / W`. The case height is fixed at 0.5 m, so a narrow room gets a large scale and its walls grow taller than the glass.

| Room | W × D × H (m) | Scale | Wall height in case | Fits 0.5 m? | A person becomes |
| --- | --- | --- | --- | --- | --- |
| MDR (*Severance*) | 10 × 8 × 2.6 | 0.164 | 0.43 m | yes | 0.29 m |
| Swan (*LOST*) | 7 × 6 × 2.7 | 0.234 | 0.63 m | **no** | 0.41 m |
| Construct (*Matrix*) | 8 × 6 × 3.0 | 0.204 | 0.61 m | **no** | 0.36 m |

## Fix 2: the cases and floors are not the same size

This has the same cause. With a different scale per room, the figures differ by about 40% between cases, and in the Glass House every floor has a different height and depth.

**Fix for both: one room module and one model scale for every title.**

```js
// shared, e.g. in _vitrine.js
export const MODULE = { W: 9.6, D: 7.6, H: 2.8 };   // every room is built inside this box, in metres
export const SCALE = 1 / 6;                        // every room, every layout
export const CASE = { w: MODULE.W * SCALE + .02, d: MODULE.D * SCALE + .02, h: MODULE.H * SCALE + .03 };
// when adding a room:
console.assert(room.size[0] <= MODULE.W && room.size[1] <= MODULE.D && room.size[2] <= MODULE.H, 'room exceeds the module', room);
room.group.scale.setScalar(SCALE); rescaleLights(room.group, SCALE);
```

- A smaller set (a car interior, say) still sits in the same module, centred, with the rest of the floor dressed or kept dark.
- In the building, every floor then has the same height. Slab plus room makes about 0.5 m per floor at 1:6, so 20 floors come to about 10 m of model; the camera rides along it.
- Pick the scale once, early, and keep it forever. 1:6 gives about 0.29 m people in a 1.6 m case.

## More real: what Kia means by "not as real as I wanted"

The mocks read as clean architectural models. To read as *real miniatures* they need the following. Do one room until Kia says yes before doing 40.

**Geometry**
- No raw boxes. Every edge is bevelled (`RoundedBoxGeometry` or modelled bevels): real objects catch light on their edges.
- Real silhouettes for furniture: chair shells, tapered legs, cushions, cables, door frames with architraves, skirting with profiles.
- Density and clutter: papers, mugs, cables, books, plants, signage, the small things a set dresser adds. The references Kia liked were dense.
- Model props in Blender, or use CC0 photoscanned models (Poly Haven models). Avoid low-poly or stylised packs (Kenney, Quaternius): they look like toys.

**Materials**
- PBR textures (albedo, normal, roughness) on every surface: carpet pile, wood grain, plaster, laminate, fabric. ambientCG and Poly Haven textures are CC0.
- Wear and variation: dirt in corners, scuffs, roughness breakup. Perfectly uniform materials are what makes it look CG.

**Light**
- Bake the static light. Light the room in Blender (Cycles) and bake lightmaps and AO into the static geometry. Then add realtime light only for moving people and animated things. Real bounce light (global illumination) is the biggest single step toward realism.
- Practical lights should look like sources: lamps with visible bulbs, screens that light faces, window light with a soft shaft.
- Keep one shadow-casting key per room, with soft shadows.

**Camera and finish**
- A longer lens (fov 18–25°) from further away gives less distortion and looks more like a photographed model.
- Depth of field with a tilt-shift feel (already there); focus on the people.
- AgX tone mapping (`T.AgXToneMapping`) for gentler colour, an optional colour-grade LUT per title (`LUTPass`), a very light vignette and grain.

## Better people (the weakest part)

The mocks use one Mixamo mannequin painted by zones. It looks like a mannequin: visible joint segments, no faces, no hair volume, no clothing silhouettes.

Options, best first:
1. **Microsoft Rocketbox Avatar Library.** About 115 rigged, realistic humans in business and casual clothes, MIT licence (github.com/microsoft/Microsoft-Rocketbox). FBX; convert to glTF with Blender or FBX2glTF. Strong at miniature scale.
2. **MakeHuman.** Build bodies, clothes and hair, export (CC0 output), finish in Blender, export glTF.
3. **Mixamo characters and animations.** Free with an Adobe account; check the licence before redistributing the files themselves.
- Keep the posing tools (`_rig.js`) for custom poses, but prefer real animation clips for idles, typing, talking and walking. Mixamo animations retarget to any Mixamo-rigged body.
- Costume is how a viewer recognises a character: silhouette, hair, a signature prop or colour. **Avoid actor likenesses.** Evoke the character, not the actor. Ask Kia.
- Check every person for:
  - feet on the floor, not floating
  - no clipping into chairs
  - hands near what they hold
  - varied heights
  - a little life (breathing, head turns)

## Small defects in the current rooms

- **MDR:** the zone shader's jacket "V" and shoulders sometimes mis-colour; Milchick's walk path passes close to the chairs; the room feels sparse next to the references.
- **Swan:**
  - the walls exceed the case (fix 1)
  - the clock digits are hard to read from the default camera
  - Locke stands with his back to the viewer
- **Construct:**
  - the walls exceed the case (fix 1)
  - the white void reads as grey studio paper
  - the kneeling boy's pose is awkward
  - Morpheus's sunglasses read as a band
- **Specimen on phones:** the title pills crowd the caption; they were made scrollable, but recheck.

## General lessons from the landing-site rounds

- **Look at every frame.** One mock was called "a disaster" because it was never checked visually. Screenshot desktop and phone, at several states, before showing anything.
- **Software rendering is not the truth.** The sandbox renders with SwiftShader. A landing-site ambient that looked fine there was reported broken on Kia's real GPU. The likely cause: three's `Reflector`, which renders into a multisampled target by default, re-rendering a custom ray-marched shader that writes `gl_FragDepth`. Avoid exotic combinations or test them on real hardware.
- **Coplanar surfaces z-fight** (dark blocky stripes). Offset stacked surfaces by a millimetre or more in world space. The case stage is raised 1.5 mm for this reason.
- **Physical lights at small scale** blow out unless rescaled (see `02`). White rooms blow out first.
- **Faking glass with opacity** adds a white veil. Use transmission (`02`).
- **A bright environment map** makes glass haze over. Use a dark, mostly black environment with a few softboxes (`galleryEnv`).
- **Asset formats:** some hosts (including the Claude artifact viewer) refuse `.glb` and `.exr`. See `02`, "Asset formats".
