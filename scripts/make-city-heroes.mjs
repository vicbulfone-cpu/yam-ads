// Builds the hero pictures used on the home page and the 13 city pages:
//   public/images/hero/city-v4-N-1672.webp and city-v4-N-960.webp
//   N = 1…10 from assets/hero 1.png … hero 10.png, and N = 11 from assets/hero new.png
// Each picture is shown in full (16:9, no crop, 100% scale). The soft edges come from the page's CSS (.hero-soft-edges).
// Safe to re-run:  node scripts/make-city-heroes.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "images", "hero");
fs.mkdirSync(OUT, { recursive: true });

for (let n = 1; n <= 11; n++) {
  const src = path.join(ROOT, "assets", n === 11 ? "hero new.png" : `hero ${n}.png`);
  await sharp(src).webp({ quality: 80, effort: 5 }).toFile(path.join(OUT, `city-v4-${n}-1672.webp`));
  await sharp(src).resize({ width: 960 }).webp({ quality: 76, effort: 5 }).toFile(path.join(OUT, `city-v4-${n}-960.webp`));
  console.log(`hero ${n} done`);
}
