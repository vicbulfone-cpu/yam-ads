// Registration ad page (/ad-4) desktop hero picture (owner, 10 Oct 2026): the owner's "registration hero" from
// "hero section/ad landing pages/registration" (it replaced "registration hero desktop" in "business tax" the same day; updated again 08:16 "-v3"; "-v4" slightly darker with a touch more contrast to take away the milky look, owner 10 Oct 2026),
// scaled to 1983px wide (the original is 3966px) and made into a WebP file in public/images/hero. The original is only read,
// never changed. Safe to re-run.
//   node scripts/make-registration-hero.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(ROOT, "hero section", "ad landing pages", "registration", "registration hero.png");
const dest = path.join(ROOT, "public", "images", "hero", "registration-desk-v5-1983.webp");
const meta = await sharp(src).metadata();
// DARKEN: brightness; CONTRAST: stretch around mid-grey (1 = unchanged)
const DARKEN = 0.91, CONTRAST = 1.11; // was 0.94 / 1.08 ("-v4"); a very slight step darker again (owner, 10 Oct 2026, "-v5")
await sharp(src).resize({ width: 1983 }).modulate({ brightness: DARKEN }).linear(CONTRAST, -128 * (CONTRAST - 1)).webp({ quality: 80, effort: 6 }).toFile(dest);
console.log(path.relative(ROOT, dest), `${meta.width}x${meta.height}`, (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
