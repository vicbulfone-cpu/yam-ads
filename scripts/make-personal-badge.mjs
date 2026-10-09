// The owner's round icon (hero section/ad landing pages/personal tax/w.png, 9 Oct 2026) for the badge left of
// "An experienced accountant can help you:" on /ad-2. The picture is a green circle on white: it is cropped to the
// circle (the box round its green pixels) and masked to that circle, so the white outside becomes transparent.
// Run: node scripts/make-personal-badge.mjs
import sharp from "sharp";

const SRC = "hero section/ad landing pages/personal tax/w.png";
const OUT = "public/images/ad-personal/checklist-badge.webp";
const SIZE = 160;

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
let [x0, y0, x1, y1] = [info.width, info.height, 0, 0];
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  const i = (y * info.width + x) * 3;
  if (data[i + 1] - Math.max(data[i], data[i + 2]) > 60) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
}
const mask = Buffer.from(`<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2 - 0.5}" fill="#fff"/></svg>`);
await sharp(SRC)
  .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
  .resize(SIZE, SIZE, { fit: "fill" })
  .ensureAlpha()
  .composite([{ input: mask, blend: "dest-in" }])
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(OUT);
console.log("wrote", OUT, { x0, y0, x1, y1 });
