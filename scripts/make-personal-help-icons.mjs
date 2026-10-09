// The owner's round icons for /ad-2's "An experienced accountant can help you:" box (hero section/ad landing pages/
// personal tax/s, 9 Oct 2026): 01 is the badge in the title bar, 02-11 the ten points. Each green circle is cropped to
// itself and masked round, then saved as a small WebP. Run: node scripts/make-personal-help-icons.mjs
import fs from "node:fs";
import sharp from "sharp";

const DIR = "hero section/ad landing pages/personal tax/s";
const OUT = "public/images/ad-personal/help";
const SIZE = 160;
fs.mkdirSync(OUT, { recursive: true });
const mask = Buffer.from(`<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2 - 0.5}" fill="#fff"/></svg>`);
for (const f of fs.readdirSync(DIR).filter((f) => /^\d\d_.*\.png$/.test(f))) {
  const { data, info } = await sharp(`${DIR}/${f}`).flatten({ background: "#ffffff" }).raw().toBuffer({ resolveWithObject: true });
  let [x0, y0, x1, y1] = [info.width, info.height, 0, 0];
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    if (data[i + 1] - Math.max(data[i], data[i + 2]) > 60) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  const dest = `${OUT}/${f.replace(/\.png$/, ".webp")}`;
  await sharp(`${DIR}/${f}`).ensureAlpha()
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .resize(SIZE, SIZE, { fit: "fill" })
    .composite([{ input: mask, blend: "dest-in" }])
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(dest);
  console.log("wrote", dest);
}
