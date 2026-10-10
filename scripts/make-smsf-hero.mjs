// SMSF ad page (/ad-3) desktop hero picture (owner, 9 Oct 2026; replaced twice the same day, "-v3"; 10 Oct 2026 "smsf hero"
// "-v4", then "smsf hero1" "-v5" and "-v6"; then the new "Untitled.jpg" (5140 x 3399, saved 10:44) "-v7"; then the re-saved "smsf hero1.png" (3884 x 1618, saved 11:00) "-v8"; "-v9" adds a very gradual fade over the sky only): the owner's
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
const dest = path.join(ROOT, "public", "images", "hero", "smsf-desk-v16-1983.webp");
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
const LEFT = 0.76, CURVE = 1.25; // "-v13": slightly stronger (was 0.62), "-v14": a little more (was 0.7; owner, 10 Oct 2026)
const EASE = Array.from({ length: 11 }, (_, i) => [i / 10, Math.pow(1 - i / 10, CURVE)]);
const stops = EASE.map(([x, a]) => `<stop offset="${x}" stop-color="#fff" stop-opacity="${(a * LEFT).toFixed(3)}"/>`).join("");
const fade = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
  <linearGradient id="h" x1="0" x2="1" y1="0" y2="0">${stops}</linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#h)"/></svg>`;
await sharp(base).composite([{ input: Buffer.from(fade) }]).webp({ quality: 80, effort: 6 }).toFile(dest);
console.log(path.relative(ROOT, dest), `${meta.width}x${meta.height}, band ${TOP}-${TOP + bandH}`, (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
