# 02 · How it works

Everything is plain ES modules and three.js (r186, vendored as one esbuild bundle in `mocks/vendor/three.r03.min.js`). There is no build step: each page is a standalone HTML file that imports the shared modules beside it.

## Files

| File | Job |
| --- | --- |
| `pages/_vitrine.js` | The case: lacquer plinth, brass band, frameless glass with green-tinted edges, engraved brass plate, and a `stage` group the room sits on. Also a small modelling kit (`kit()`), canvas textures (`tex()`, `grain()`), a seeded `rng()`, `rescaleLights()` and `galleryEnv()` (a dark room with softboxes turned into a reflection map). |
| `pages/_rooms.js` | One builder per room, keyed by slug (`pseudoku`, `lostimer`, `constyx`), plus `SCENE_NOTES` (the caption). Rooms are modelled in **real metres**. |
| `pages/_figures.js` | People: one rigged body painted into clothes by a shader (`paint`, `figure`), and living loops (`LIVE.typing`, `seated`, `talking`, `standing`, `handsBehind`, `eating`, `offering`, `kneel`). |
| `pages/_rig.js` | Posing: an aim-based rig for Mixamo skeletons (`makeRig`, `POSES`, `blend`, `over`) and `loadCharacter()` (loads once, clones per use with `SkeletonUtils`, scales to 1.75 m). |
| `pages/_ambients.js` | The surroundings for two layouts: *Travertine* (sunlit stone hall, used by the Specimen) and *Dusk* (sky, water and low sun, used by the Glass House). Also `loadHDR()`, which decodes the PNG HDRIs. *Atelier* is in there too but unused (and see the warning in `03`). |
| `pages/_data.js` | The landing site's project list. **Replace it** with the 40 titles. Pages currently call `byFamily('tributes')` to pick rooms. |
| `05-vitrines.html`, `06-specimen.html`, `07-glass-house.html` | The three layouts. Each builds a scene, adds cases or floors, sets up post-processing, and wires the captions and navigation in HTML. |

## The room contract

```js
// in _rooms.js
async function mytitle(){
  const W = 9, D = 7, H = 2.7;            // footprint and wall height in metres
  const g = new T.Group(), K = kit(g);    // build everything into g, origin = floor centre
  // ... floor, walls (back and left full height, front and right cut low), props, people, lights ...
  return { group: g, size: [W, D, H], update(t, dt){ /* animate people, screens, clocks */ } };
}
export const ROOMS = { ..., mytitle };
export const SCENE_NOTES = { ..., mytitle: 'Where it is · Title' };
```

- Axes: x to the right, y up, z towards the viewer. Origin at the centre of the floor.
- Cut-away convention: the back wall (−z) and left wall (−x) are full height. The front and right walls are a low 0.22 m kerb, so the camera can look in.
- People are 1.75 m tall standing. Seated figures are placed with `holder.position.y = -0.43` on a 0.5 m seat.
- `update(t, dt)` is called every frame with seconds since start. Keep it cheap: repaint canvas textures (screens, clocks) at most about 8 times a second.

## Scale and light (the important part)

The page shrinks each room into its case: `scale = caseWidth * 0.985 / W`, then calls `rescaleLights(room.group, scale)`.

- three.js lights are physical. A point or spot light's intensity is in candela and falls off with the square of distance. Shrinking a room 6× brings every lamp 6× closer, so the light gets 36× brighter. `rescaleLights` multiplies point and spot intensities by `s²` and their `distance` by `s`. It also scales shadow-camera near/far and `normalBias`.
- A RectAreaLight's intensity is luminance, which doesn't change with scale, but its width and height don't follow the parent's scale, so `rescaleLights` scales them.
- Values that looked right, at full scale before rescaling:
  - Ceiling panels: RectAreaLight 0.2–0.45, pointing down.
  - Key light: one SpotLight around 50–170 at 6–7 m, angle 0.6–0.8, penumbra 0.8–1, casting shadows (2048 map).
  - Lamps: PointLight 4–6.
  - Screen glow: PointLight about 1.2.
- White rooms blow out quickly. Keep wall albedo around `0xd6d6d2`–`0xeceee9` and lower the lights rather than the exposure.
- **This scaling scheme caused the size defects** (each room got its own scale). The fix, one scale for all rooms, is in `03`.

## The case

`vitrine({ w = 1.66, d = 1.34, h = 0.5, base = 0.9, label })` in world metres:

- **Plinth:** rounded black lacquer block (`base` tall) with a brass band, a bronze floor rim and an engraved brass plate (canvas texture) on the front.
- **Glass:** `MeshPhysicalMaterial` with `transmission: 1`, `roughness: 0.015`, `thickness: 0.008`, `ior: 1.5`, `side: DoubleSide`. Don't fake glass with `opacity`: that adds a white veil and kills reflections. Transmission costs one extra render of the opaque scene per frame, shared by all glass.
- **Frameless:** only 4.5 mm edge strips in a faint green (`glassEdge`), like thick museum glass. An earlier bronze frame cut across close-up views, so it was removed.
- **`stage`:** a group 1.5 mm above the rim, so the room's floor doesn't z-fight with the case floor.

## Reflections and environment

- **Dark gallery** (`05`): `galleryEnv(renderer)` builds a black box with two tall softboxes and a faint ceiling strip, then PMREMs it. The glass shows a few clean highlights instead of a white haze. A bright HDRI as the environment washed the cases out.
- **Travertine and Dusk** (`06`, `07`): from `_ambients.js`. For the Glass House, the glass gets a cloned material with `envMapIntensity: 0.45`, otherwise the sky near the sun glares on the side panes.
- HDRIs ship as `*.hdr.png` (see "Asset formats" below).

## People

- **Body:** Mixamo "X Bot" (`vendor/models/Xbot.gltf.json`). It is one rigged mannequin body for every person. It has a walk clip; everything else is posed procedurally.
- **Clothes:** `paint(root, look)` swaps materials for a shader that colours the body by zone, using the bind pose (a T-pose in metres: y up, arms along ±x, facing +z). The zones are:
  - shoes `y < 0.095`
  - trousers to `y 1.015`
  - jacket and sleeves, with an open V and an optional tie
  - skin above `1.47` near the centre, and on the hands
  - hair cap and optional long hair, and sunglasses (`glasses: true`)
- **Looks** are plain objects, e.g. `{ jacket: 0x2f3237, pants: 0x2a2c30, shirtIn: 0xe6e8ec, tie: 0x3b4a5c, hair: 0x2a1f17, long: false, skin: 0xd9a988 }`.
- **Poses:** `makeRig(holder)` collects the bones. `rig.apply(pose)` resets to rest, then aims each limb (spine, chest, neck, thighs, shins, feet, arms, forearms) along a direction given in the character's own frame. Poses are tiny objects such as `{ rArm: [-.2, -.85, .5], rFore: [.05, -.12, 1] }`, combined with `over(base, top)` and `blend([p, w], ...)`.
- **Living loops:** the `LIVE.*` functions add time-based variation: typing hands, head turns, gestures.
- **Walking:** `walker(holder)` plays the walk clip with root motion removed (x/z of the hips track zeroed), and `walkPath(holder, points, speed)` moves and turns the holder along a loop.
- The painted mannequin is the weakest part. See `03`, "Better people".

## Post-processing

Done per page with three's `EffectComposer`:

1. **`RenderPass`**.
2. **`GTAOPass`** (ambient occlusion). Radius 0.06 world units suits a case about 1.7 m wide; it gives the contact shadows that make miniatures believable.
3. **`BokehPass`** for depth of field. Each frame, focus is set to the distance from the camera to the active case. Aperture 0.004–0.006, max blur 0.005–0.006. Combined with a slightly high camera, this is what reads as "tilt-shift miniature".
4. **`UnrealBloomPass`**, kept subtle: threshold above 1, so only screens and lamps bloom.
5. **`OutputPass`**: ACES tone mapping. Exposure 0.95 in the dark gallery, about 0.62 at Dusk.

## The three layouts

- **Vitrines (`05`):**
  - Cases sit every 2.9 m along x on a polished black floor, against a dark wall with the family name in brass.
  - Each case gets a warm spot from above, plus a wash on the wall behind.
  - The camera eases between cases. The `zoom` state lerps the camera between an overview pose and a close pose.
  - The caption is HTML at the bottom left.
- **Specimen (`06`):**
  - One case in the Travertine hall, with the ambient's own plinth hidden.
  - Changing rooms runs `lift` from 0 to −1: the room slides 0.75 m down into the plinth, which hides it. Then the next room is attached and rises.
  - The camera orbits on drag and drifts when idle.
- **Glass House (`07`):**
  - A basalt footing in the Dusk water, then for each title a lacquer slab with a brass edge and the room, stacked up.
  - One glass skin wraps all floors.
  - The camera height follows the current floor. The floor list on the right acts as a lift panel.

## Performance

- Every light affects every material's shader, so lights add up across rooms. The Glass House with three rooms has about 20 lights. A 20-floor building needs a budget:
  - About 2–3 lights per room.
  - One shadow caster, shared where possible.
  - Rooms more than one floor away from the camera hidden (`visible = false`) and not updated.
  - Bake static lighting into lightmaps (see `03`).
- Glass transmission, GTAO and Bokeh each cost a full-screen pass. On phones, consider: no GTAO, a lower pixel ratio (1–1.5), fake glass, and only one live room.
- The mocks cap the pixel ratio at 1.5.

## Testing in a sandbox (headless)

```sh
cd mocks && python3 -m http.server 8766 --bind 127.0.0.1 &
cd ../tools/screenshots && npm install
BASE=http://127.0.0.1:8766 node shot.mjs "pages/05-vitrines.html?still&i=1" /tmp/v 4000 both
BASE=http://127.0.0.1:8766 FRAMES=2 node thumbs.mjs pages "05-vitrines:3000:?still&i=1&zoom"
```

- Headless Chromium uses SwiftShader, a software GPU. These pages take 5–15 s per frame there, so screenshots wait for `window.__frames` (the pages count frames).
- Software rendering hides some real-GPU bugs and causes others. Always check on a real machine too.

## Asset formats

The Claude artifact viewer (and some hosts) refuse `.exr` and `.glb`. So:

- **HDRIs** are stored as `name.hdr.png`, decoded by `loadHDR()`. The top half holds the colour clamped to 1 (gamma 2.2); the bottom half holds `log2(1 + colour) / 12`. Make new ones with `tools/assets/exr2png.mjs`. Sources are CC0 Poly Haven HDRIs via pmndrs/assets.
- **The figure** is `Xbot.gltf.json`: glTF JSON with its buffer embedded as base64. Make new ones with `tools/assets/glb2json.mjs`.
