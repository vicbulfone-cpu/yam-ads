// Home hero (owner, 10 Oct 2026: "make sure no fade effect under" the steps line "touches landscape and buildings"): a mask of
// the home hero photo's sky (public/images/hero/home-hq-v6-3966.webp, whose sky is one flat colour), white where the photo is
// sky and clear on the buildings, trees and houses, with a soft one-pixel edge. The hero's fades are drawn through it
// (".desk-hero-wash" in globals.css, placed by HeroGap.tsx), so they lighten only the sky. Re-run if the home photo changes.
//   node scripts/make-home-sky-mask.mjs
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(ROOT, "public", "images", "hero", "home-hq-v6-3966.webp");
const dest = path.join(ROOT, "public", "images", "hero", "home-sky-mask.png");
const W = 1983; // half size is plenty for a mask
const SKY = [117, 204, 247], NEAR = 10, FAR = 28; // within NEAR of the sky colour: sky; from FAR: not sky
const { data, info } = await sharp(src).resize(W).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const a = Buffer.alloc(info.width * info.height);
for (let i = 0; i < a.length; i++) {
  const d = Math.hypot(data[i * 3] - SKY[0], data[i * 3 + 1] - SKY[1], data[i * 3 + 2] - SKY[2]);
  a[i] = d <= NEAR ? 255 : d >= FAR ? 0 : Math.round((255 * (FAR - d)) / (FAR - NEAR));
}
// below the skyline nothing counts as sky (bits of water or roofs the colour of the sky)
const cols = new Int32Array(info.width).fill(info.height);
for (let x = 0; x < info.width; x++) for (let y = 0; y < info.height; y++) if (a[y * info.width + x] < 128) { cols[x] = y; break; }
for (let x = 0; x < info.width; x++) for (let y = cols[x] + 2; y < info.height; y++) a[y * info.width + x] = 0;
const white = Buffer.alloc(info.width * info.height * 3, 255);
await sharp(white, { raw: { width: info.width, height: info.height, channels: 3 } }).joinChannel(a, { raw: { width: info.width, height: info.height, channels: 1 } }).png({ compressionLevel: 9, palette: true }).toFile(dest);
console.log(path.relative(ROOT, dest), info.width + "x" + info.height);
