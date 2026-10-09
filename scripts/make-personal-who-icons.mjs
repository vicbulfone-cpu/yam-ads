// The owner's five round icons for /ad-2's "Who we help" cards (hero section/ad landing pages/personal tax/*.png,
// 9 Oct 2026): each green circle is cropped to the box round its green pixels and masked to that circle, so anything
// outside it is transparent. Run: node scripts/make-personal-who-icons.mjs
import sharp from "sharp";

const DIR = "hero section/ad landing pages/personal tax";
const ICONS = { employees: "employees", investors: "investors", landlords: "landlords", contractors: "contractors", "self-employed": "self_employed" };
const SIZE = 192;
const mask = Buffer.from(`<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2 - 0.5}" fill="#fff"/></svg>`);

for (const [out, src] of Object.entries(ICONS)) {
  const file = `${DIR}/${src}.png`;
  const { data, info } = await sharp(file).flatten({ background: "#ffffff" }).raw().toBuffer({ resolveWithObject: true });
  let [x0, y0, x1, y1] = [info.width, info.height, 0, 0];
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    if (data[i + 1] - Math.max(data[i], data[i + 2]) > 60) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  const dest = `public/images/ad-personal/who-${out}.webp`;
  await sharp(file).flatten({ background: "#ffffff" })
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .resize(SIZE, SIZE, { fit: "fill" })
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(dest);
  console.log("wrote", dest, { x0, y0, x1, y1 });
}
