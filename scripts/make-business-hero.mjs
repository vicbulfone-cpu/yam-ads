// Business ad page (/ad-1) desktop hero picture (owner, 9 Oct 2026): the owner's "home hero desktop" from
// "hero section/ad landing pages/business tax", made into a WebP file in public/images/hero. The original is only read,
// never changed. Kept at its full 3804px width (owner, 10 Oct 2026: "more crisp"; it was scaled to 1902px, which high-
// resolution laptop screens stretched back up) lightly sharpened and saved at quality 90. Safe to re-run.
//   node scripts/make-business-hero.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(ROOT, "hero section", "ad landing pages", "business tax", "home hero desktop.png");
const dest = path.join(ROOT, "public", "images", "hero", "business-desk-v3-3804.webp");
const meta = await sharp(src).metadata();
await sharp(src).sharpen({ sigma: 0.8, m1: 0.5, m2: 1.5 }).webp({ quality: 90, effort: 6 }).toFile(dest);
console.log(path.relative(ROOT, dest), `${meta.width}x${meta.height}`, (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
