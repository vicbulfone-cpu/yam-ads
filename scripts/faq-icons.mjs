// Home FAQ icons: the owner's PNGs (hero section/ad landing pages) -> WebP with the near-white background made transparent.
// Flood fill from the picture's edges, so white parts inside an icon (the clock face, paper) stay solid.
// Usage: node scripts/faq-icons.mjs
import sharp from "sharp";
const SRC = "hero section/ad landing pages/";
const MAP = { "01-clock": "01-clock", "02-credentials-shield": "02-shield", "03-coins": "03-coins", "04-document-folder": "04-document",
  "05-phone": "05-phone", "06-gears": "06-gears", "07-people": "07-people", "08-map-location-pin": "08-location-pin",
  "09-clipboard": "09-clipboard", "10-large-map-illustration": "10-map-large" };
for (const [from, to] of Object.entries(MAP)) {
  const { data, info } = await sharp(`${SRC}${from}.png`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const out = Buffer.alloc(w * h * 4);
  const light = (i) => Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
  const bg = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (bg[p] || light(p) < 228) continue;
    bg[p] = 1;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) stack.push(p - 1); if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w); if (y < h - 1) stack.push(p + w);
  }
  for (let p = 0; p < w * h; p++) {
    out[p * 4] = data[p * 3]; out[p * 4 + 1] = data[p * 3 + 1]; out[p * 4 + 2] = data[p * 3 + 2];
    // background: fully clear when near white, soft edge (228-248) for shadows and anti-aliasing
    out[p * 4 + 3] = bg[p] ? Math.round(255 * Math.max(0, Math.min(1, (248 - light(p)) / 20))) : 255;
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 }).webp({ quality: 88, alphaQuality: 90 })
    .toFile(`public/images/home/faq-icons/${to}.webp`).then((i) => console.log(to, i.width, i.height, i.size));
}
