// The owner's green tick (hero section/ad landing pages/personal tax/green tick.jpg, 9 Oct 2026) for the /ad-2
// "An experienced accountant can help you:" checklist. The JPG has a checkerboard drawn in place of transparency, so
// every pixel is kept by how green it is (green well above red and blue = tick; grey/white = background), the edges
// keep a soft alpha, and the result is trimmed and saved as a small transparent WebP.
// Run: node scripts/make-personal-tick.mjs
import sharp from "sharp";

const SRC = "hero section/ad landing pages/personal tax/green tick.jpg";
const OUT = "public/images/ad-personal/tick.webp";

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  const lead = g - Math.max(r, b); // the tick is ~120 here; the grey/white checkerboard is ~0
  const a = Math.max(0, Math.min(1, (lead - 20) / 70));
  // one solid brand green (#0e7a32, as the page's other ticks), shape from the alpha
  out[o] = 0x0e; out[o + 1] = 0x7a; out[o + 2] = 0x32; out[o + 3] = Math.round(a * 255);
}
await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim({ threshold: 1 })
  .resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(OUT);
console.log("wrote", OUT);
