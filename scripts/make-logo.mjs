// Builds every logo file the site uses from the supplied artwork: assets/this is final logo.png
//   public/images/brand/logo-1000.webp, logo-680.webp, logo-340.webp  (header, footer)
//   src/app/icon.png, src/app/apple-icon.png, src/app/favicon.ico        (browser tab / home-screen icon = the leaf)
// The supplied PNG has an opaque white background, which shows up as a faint box on tinted or blurred areas.
// The white is converted to transparency ("colour to alpha" with soft edges); the artwork itself is unchanged.
// Safe to re-run:  node scripts/make-logo.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "assets", "this is final logo.png");
const BRAND = path.join(ROOT, "public", "images", "brand");
const APP = path.join(ROOT, "src", "app");

// 1. white -> transparent, keeping edges smooth
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.from(data);
for (let i = 0; i < info.width * info.height; i++) {
  const o = i * 4;
  const r = data[o], g = data[o + 1], b = data[o + 2];
  const m = Math.min(r, g, b);
  const a = Math.max(0, Math.min(1, (238 - m) / 68)); // fully opaque below 170, fully transparent from 238 (kills faint off-white noise)
  if (a >= 1) { out[o + 3] = 255; continue; }
  if (a <= 0) { out[o + 3] = 0; continue; }
  // un-mix the white so edge pixels keep their true colour
  const k = 255 * (1 - a);
  out[o] = Math.max(0, Math.min(255, Math.round((r - k) / a)));
  out[o + 1] = Math.max(0, Math.min(255, Math.round((g - k) / a)));
  out[o + 2] = Math.max(0, Math.min(255, Math.round((b - k) / a)));
  out[o + 3] = Math.round(a * 255);
}
const keyed = sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
const keyedPng = await keyed.clone().trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 }).png().toBuffer(); // trimmed: no empty margin around the artwork

// 2. header / footer logo files
for (const w of [1000, 680, 340]) {
  const dest = path.join(BRAND, `logo-v3-${w}.webp`);
  await sharp(keyedPng).resize({ width: w }).webp({ quality: 92, alphaQuality: 100, effort: 5 }).toFile(dest);
  console.log(path.relative(ROOT, dest), (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
}

// 3. the leaf mark for the browser tab / home screen: only the three leaf shapes (the script "Y" and the
//    letters beside them are removed), found as connected shapes in the artwork.
const W = info.width, H = info.height;
const solid = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) solid[i] = Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) < 200 ? 1 : 0;
const label = new Int32Array(W * H);
const keep = new Uint8Array(W * H);
let nLabels = 0;
for (let start = 0; start < W * H; start++) {
  if (!solid[start] || label[start]) continue;
  nLabels++;
  const stack = [start]; label[start] = nLabels;
  const members = [start]; let maxx = 0, minx = W;
  while (stack.length) {
    const p = stack.pop(); const x = p % W;
    if (x > maxx) maxx = x; if (x < minx) minx = x;
    for (const q of [p - 1, p + 1, p - W, p + W]) {
      if (q < 0 || q >= W * H || Math.abs((q % W) - x) > 1) continue;
      if (solid[q] && !label[q]) { label[q] = nLabels; stack.push(q); members.push(q); }
    }
  }
  // the leaf shapes are the large shapes lying entirely in the left 350px of the logo
  if (members.length > 5000 && maxx < 350) for (const p of members) keep[p] = 1;
}
// grow the kept area by 3px so smooth edge pixels are not lost
let grown = keep;
for (let pass = 0; pass < 3; pass++) {
  const next = new Uint8Array(grown);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const p = y * W + x;
    if (!grown[p] && (grown[p - 1] || grown[p + 1] || grown[p - W] || grown[p + W])) next[p] = 1;
  }
  grown = next;
}
const leafPixels = Buffer.from(out);
for (let i = 0; i < W * H; i++) if (!grown[i]) leafPixels[i * 4 + 3] = 0;
const leafWhole = await sharp(leafPixels, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
const leafRaw = await sharp(leafWhole).extract({ left: 0, top: 40, width: 360, height: 510 }).png().toBuffer();
const leaf = await sharp(leafRaw).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 }).png().toBuffer();
const square = async (size, pad, bg) => {
  // bg given (apple icon) = solid colour behind the leaf; otherwise transparent
  const fill = bg ? { ...bg, alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 0 };
  const inner = await sharp(leaf)
    .resize({ width: size - pad * 2, height: size - pad * 2, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: fill } })
    .composite([{ input: inner, left: pad, top: pad }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

fs.writeFileSync(path.join(APP, "icon.png"), await square(512, 24));
fs.writeFileSync(path.join(APP, "apple-icon.png"), await square(180, 18, { r: 255, g: 255, b: 255 }));

// favicon.ico (PNG-compressed entries: 16, 32, 48)
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => square(s, Math.max(1, Math.round(s * 0.05)))));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = pngs.map((p, i) => {
  const e = Buffer.alloc(16);
  e[0] = sizes[i] === 256 ? 0 : sizes[i]; e[1] = sizes[i] === 256 ? 0 : sizes[i];
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(p.length, 8); e.writeUInt32LE(offset, 12);
  offset += p.length;
  return e;
});
fs.writeFileSync(path.join(APP, "favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));
console.log("icons written: src/app/icon.png, apple-icon.png, favicon.ico");
