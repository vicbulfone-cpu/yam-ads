// SMSF ad page (/ad-3) desktop hero picture (owner, 9 Oct 2026; replaced twice the same day, "-v3"; 10 Oct 2026 "smsf hero"
// "-v4", then "smsf hero1" "-v5" and "-v6"; then the new "Untitled.jpg" (5140 x 3399, saved 10:44) "-v7"; then the re-saved "smsf hero1.png" (3884 x 1618, saved 11:00) "-v8"; "-v9" adds a very gradual fade over the sky only; "-v17" has no fade at all, owner 10 Oct 2026: "smsf hero pic remove all fade"; "-v18"/"-v19" the fade back over the sky, sea and clouds only; "-v20" right up to the boat's edges): the owner's
// picture from "hero section/ad landing pages/smsf". When the photo is taller than the hero frame, a 2.5:1 band is cut
// from it (TOP: its top edge in the photo's pixels, just above the couple's heads; their feet stay in), then scaled to
// 1983 x 793 and made into a WebP file in public/images/hero. The original is only read, never changed. Safe to re-run.
//   node scripts/make-smsf-hero.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(ROOT, "hero section", "ad landing pages", "smsf", "smsf hero1.png");
const dest = path.join(ROOT, "public", "images", "hero", "smsf-desk-v20-1983.webp");
const W = 1983, H = 793, TOP = 32; // smsf hero1 is nearly the frame's shape: 32px off the top, the same off the bottom
const meta = await sharp(src).metadata();
const bandH = Math.round(meta.width * H / W);
const framed = await sharp(src).extract({ left: 0, top: TOP, width: meta.width, height: bandH }).resize(W, H).png().toBuffer();

// "-v15" (owner, 10 Oct 2026): the man and woman sharpened. Only the couple (COUPLE: their box in the 1983 x 793 frame)
// is sharpened, blended in through a feathered mask (FEATHER px) so there is no visible edge; the rest is untouched.
// AMOUNT: how much of the sharpening is blended in ("-v16": 0.5, half of v15; owner, 10 Oct 2026).
const COUPLE = { left: 1500, top: 140, width: 440, height: 500 }, FEATHER = 30, AMOUNT = 0.5;
const sharpened = await sharp(framed).sharpen({ sigma: 1.1, m1: 0.6, m2: 2.5 })
  .extract(COUPLE).png().toBuffer();
const featherMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${COUPLE.width}" height="${COUPLE.height}">
  <rect x="${FEATHER}" y="${FEATHER}" width="${COUPLE.width - 2 * FEATHER}" height="${COUPLE.height - 2 * FEATHER}" rx="${FEATHER}" fill="#fff"/></svg>`);
const mask = await sharp(featherMask).blur(FEATHER / 2).extractChannel("red").linear(AMOUNT, 0).toBuffer();
const couple = await sharp(sharpened).removeAlpha().joinChannel(mask).png().toBuffer();
const base = await sharp(framed).composite([{ input: couple, left: COUPLE.left, top: COUPLE.top }]).png().toBuffer();

// Sky fade (owner, 10 Oct 2026, "-v9"): white over the sky only, strongest at the left edge and easing very gradually to
// nothing at the right edge (almost none near the mast and the couple). Full strength down to SKY_SOLID (rows of the
// 793px frame), gone by SKY_END, just above the horizon (about row 550), so the sea is untouched.
// LEFT: the strength at the left edge (0 = no fade, 1 = white).
// "-v10" (owner, 10 Oct 2026): lighter behind the words and icons. On screen the words span about 30-66% of the photo's
// width and the bow starts at about 66%, so the fade stays strong and even to 45%, then eases out quickly by 72%; and it
// reaches down to the horizon so it sits behind the three icons too.
// "-v11" (owner, 10 Oct 2026: v10 too light and not gradual enough): one smooth curve across the whole width, nothing at
// the right margin, building evenly to LEFT at the left margin (strength = LEFT * (1 - x) ^ CURVE).
// "-v12" (owner, 10 Oct 2026): the water faded evenly to match the sky: the same curve over the whole height, so sky and
// sea fade alike (no sky-only mask any more).
// "-v17" (owner, 10 Oct 2026: "smsf hero pic remove all fade"): no white fade was laid over the photo.
// "-v18" (owner, 10 Oct 2026: "apply a fade, starts from right margin and moves all the way to left margin, apply no fade effect
// to boat or people etc, only sky, water, clouds"): the v14 curve again, but only on the sky, sea and clouds (see SCENE below).
const LEFT = 0.76, CURVE = 1.25; // "-v13": slightly stronger (was 0.62), "-v14": a little more (was 0.7; owner, 10 Oct 2026)
// Where the fade may go (SCENE; "-v20", owner 10 Oct 2026: v19 missed a lot of sky and sea round the boat): every pixel that is
// sky or sea blue, right up to the edges of the boat, mast, ropes and people (and everything left of x = 1150, where there is
// only sky, clouds and sea). The parts of the boat and the couple that are blue themselves are outlined tightly and left out
// (1983 x 793 frame): the hull and deck (HULL), the mast (MAST), the woman's top and scarf (WOMAN_TOP) and the man's jeans (JEANS). The mask is
// softened by a couple of pixels so no outline shows.
const HULL = [[1385, 438], [1600, 418], [1880, 345], [1983, 330], [1983, 793], [1600, 793], [1560, 700], [1520, 650], [1470, 590],
  [1420, 530], [1385, 490]];
const MAST = [[1515, 0], [1562, 0], [1460, 428], [1418, 428]];
const WOMAN_TOP = [[1632, 268], [1700, 268], [1712, 392], [1628, 392]];
const JEANS = [[1688, 358], [1852, 358], [1862, 442], [1688, 442]]; // the man's jeans (the only blue part of him above the deck)
const poly = (pts) => `<polygon points="${pts.map((q) => q.join(",")).join(" ")}" fill="#fff"/>`;
const shapes = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/>${[HULL, MAST, WOMAN_TOP, JEANS].map(poly).join("")}</svg>`))
  .extractChannel("red").raw().toBuffer();
const { data: px } = await sharp(base).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const scene = Buffer.alloc(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x, r = px[i * 3], b = px[i * 3 + 2];
  const blue = b > 60 && b - r > 35; // sky or sea (the sea along the bottom is a dark blue)
  scene[i] = x < 1150 || (blue && shapes[i] <= 127) ? 255 : 0;
}
const sceneSoft = await sharp(scene, { raw: { width: W, height: H, channels: 1 } }).blur(1.2).extractChannel(0).raw().toBuffer();
if (process.env.SHOW_MASK) await sharp(sceneSoft, { raw: { width: W, height: H, channels: 1 } }).png().toFile(process.env.SHOW_MASK);
// the fade: nothing at the right margin, building evenly to LEFT at the left margin (strength = LEFT * (1 - x) ^ CURVE)
const out = Buffer.from(px);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x, k = LEFT * Math.pow(1 - x / (W - 1), CURVE) * (sceneSoft[i] / 255);
  for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.round(px[i * 3 + c] + (255 - px[i * 3 + c]) * k);
}
await sharp(out, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 80, effort: 6 }).toFile(dest);
console.log(path.relative(ROOT, dest), `${meta.width}x${meta.height}, band ${TOP}-${TOP + bandH}`, (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
