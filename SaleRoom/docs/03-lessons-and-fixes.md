# 03 · Lessons and fixes

## Fix 1: the audience (Kia: "they are like dummies")

**Why it looks like that:**
- Every sitter is the same Mixamo "X Bot" mannequin: segmented joints, a smooth egg head, no face, no hair.
- They are recoloured with one dark suit material. Same body, same clothes, same posture, in rows: it reads as a store of mannequins.
- Their poses are static apart from the paddle raise and a small twist.

**What real looks like:** variety and life.
- **Bodies and faces:**
  - Use realistic rigged humans. Best fit: the **Microsoft Rocketbox Avatar Library** (about 115 rigged, realistic men and women in business and smart-casual clothes; MIT licence; FBX, convert to glTF with Blender or FBX2glTF).
  - Alternatives: MakeHuman (CC0 output) finished in Blender, or Mixamo characters (check the licence).
  - Mix ages, builds, heights and clothes. No two neighbours alike.
- **Silhouettes:** hair volume, jackets, dresses, scarves, glasses, a catalogue on a lap, a phone, a coat over a chair. At saleroom distance people are read by silhouette.
- **Life:**
  - idle animations (breathing, shifting weight, crossing legs)
  - heads turning toward the lot and toward each other
  - someone whispering, someone checking a phone, a latecomer walking in
  - the phone-bank staff at the side, who are very characteristic of real salerooms
  - Mixamo has seated idles and talking clips; retarget them to Rocketbox or Mixamo rigs.
- **Light on people:** a rim from the stage and soft fill. Faces should be readable in the front rows and fall into silhouette towards the back.
- **Budget:** about 30 skinned characters is heavy on phones.
  - Use LOD: full rigs in the front rows, simpler meshes or camera-facing impostors at the back.
  - Animate only what is in view.
  - Consider baking idle loops into vertex-animation textures.

## Fix 2: the auctioneer

The auctioneer is the same mannequin. They are the game's voice, so they deserve the best character in the room:
- a believable face and hands
- a few signature gestures: point to a bidder, open palm to the room, gavel strike
- lip or face movement when speaking (Rocketbox includes facial blendshapes on some characters)
- maybe a face lit by the lamp, seen closer in a dedicated camera shot during the reveal

## Fix 3: lots

The current lots are Kia's project sculptures (procedural, stylised). The game needs real items:
- Use high-quality glTF models (photogrammetry, CC0 or licensed) or photographs presented as objects: a painting on an easel, a framed print, a watch on a cushion, a bottle on a stand.
- The molten "cooling in" dissolve (`makeDissolvable`) came from the landing site's identity. For an auction game, a calmer reveal may suit better: a velvet cloth lifted, or the turntable rising through the stage. Ask Kia.

## Other defects

- **Mirror stone:** the stage uses three's `Reflector` (multisampled by default). On the landing site, a page combining `Reflector` with a custom shader that writes depth broke on Kia's real GPU while looking fine in the sandbox. This page renders correctly as is, but test on real GPUs if you add custom shaders, or replace the mirror with a cheaper polished material.
- **Timeline:** the "⋯" fold assumed nothing happened in 2025. With real data the ruler should be generated from the item dates.
- **Fonts:** the board falls back to system fonts when Google Fonts fail; self-host fonts in production.
- **Labels:** the brass plate reads "KIARASHFA · SALEROOM". Rename for the new project. Never use a real auction house's name.

## General lessons from the landing-site rounds

- Look at every frame by eye on desktop and phone sizes before showing Kia anything. Kia judges on execution.
- The sandbox renders with SwiftShader, which hides some real-GPU bugs. Test on a real GPU.
- Offset coplanar surfaces (at least 1 mm in world space) to avoid z-fighting stripes.
- Physical lights: intensities are candela; check exposure on both dark and bright materials.
- A bright HDRI environment makes everything glossy and grey. Keep environments dark and add light deliberately.
