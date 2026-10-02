# Rigged figures (mock use only)

Copied from the three.js repository's `examples/models/gltf/` for the Round 03 mocks.

| File | Source | Licence / note |
| --- | --- | --- |
| `Xbot.glb`, `Michelle.glb`, `Soldier.glb` | three.js examples (originally Mixamo) | Mixamo characters. Fine for mocks; production should use Kia's own Mixamo downloads (free with an Adobe account) or commissioned figures. |
| `kira.glb` | three.js examples (`kira.glb`, Draco decompressed with `@gltf-transform/cli`) | CC0 per the three.js example credits. |
| `rpm.glb` | three.js examples (Ready Player Me avatar) | Mock use only. Currently unused (it read as a caricature in the saleroom). |

Poses are made procedurally by `mocks/r03-pages/_rig.js` (aim-based FK); no Mixamo animation clips are required.
