// GLB -> glTF JSON with the binary buffer embedded as base64, so hosts that refuse .glb can serve it as .json.
// usage: node glb2json.mjs in.glb out.gltf.json
import fs from 'node:fs';
const [inp, out] = process.argv.slice(2), b = fs.readFileSync(inp);
const dv = new DataView(b.buffer, b.byteOffset, b.byteLength); let o = 12, json, bin;
while (o < b.length) { const len = dv.getUint32(o, true), type = dv.getUint32(o + 4, true), chunk = b.subarray(o + 8, o + 8 + len); if (type === 0x4E4F534A) json = JSON.parse(chunk.toString('utf8')); else if (type === 0x004E4942) bin = chunk; o += 8 + len; }
json.buffers[0].uri = 'data:application/octet-stream;base64,' + Buffer.from(bin).toString('base64');
fs.writeFileSync(out, JSON.stringify(json)); console.log(out, (fs.statSync(out).size / 1e6).toFixed(2) + ' MB');
