// /ad-2 "An experienced accountant can help you:" box: the owner's tick picture (hero section/ad landing pages/
// personal tax/steps/tick.png, 9 Oct 2026) replaces the drawn green ticks. The PNG has a white background and no
// transparency, so the white becomes transparent (softly at the edges, with the white blend taken back out so no pale
// fringe is left), then the picture is trimmed to the tick and saved as a small transparent WebP in its own colours.
// Run: node scripts/make-personal-help-tick.mjs
import sharp from "sharp";

const SRC = "hero section/ad landing pages/personal tax/steps/tick.png";
const OUT = "public/images/ad-personal/help/tick.webp";

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  const a = Math.min(1, (255 - Math.min(r, g, b)) / 160); // 0 = white background, 1 = the tick
  const un = (c) => (a > 0 ? Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a))) : 0);
  out[o] = un(r); out[o + 1] = un(g); out[o + 2] = un(b); out[o + 3] = Math.round(a * 255);
}
await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim({ threshold: 1 })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(OUT);
console.log("wrote", OUT);
