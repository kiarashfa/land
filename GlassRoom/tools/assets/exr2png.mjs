// EXR -> one PNG holding two 8-bit halves (no alpha): top = colour clamped to 1 (gamma 2.2), bottom = log2(1 + colour) / 12,
// which reaches 4095 in about 3% steps. Decoded by loadHDR() in mocks/r03-pages/_ambients.js.
// usage: node exr2png.mjs in.exr out.hdr.png   (run npm install here once, for pngjs)
import fs from 'node:fs';
import { PNG } from 'pngjs';
const T = await import(new URL('../../mocks/vendor/three.r03.min.js', import.meta.url).href);
const [inp, out] = process.argv.slice(2), buf = fs.readFileSync(inp);
const L = new T.EXRLoader(); L.setDataType(T.FloatType);
const r = L.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)), { width: w, height: h, data } = r, ch = data.length / (w * h);
const png = new PNG({ width: w, height: h * 2, colorType: 2 }); let max = 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * ch;
  for (let c = 0; c < 3; c++) { const v = Math.max(0, data[i + c]); max = Math.max(max, v);
    const lo = Math.round(Math.pow(Math.min(1, v), 1 / 2.2) * 255), hi = Math.round(Math.min(1, Math.log2(1 + v) / 12) * 255);
    png.data[((y * w + x) * 4) + c] = lo; png.data[(((y + h) * w + x) * 4) + c] = hi; }
  png.data[(y * w + x) * 4 + 3] = 255; png.data[((y + h) * w + x) * 4 + 3] = 255; }
fs.writeFileSync(out, PNG.sync.write(png, { colorType: 2 })); console.log(out, w + 'x' + h, 'max', max.toFixed(1), (fs.statSync(out).size / 1e6).toFixed(2) + ' MB');
