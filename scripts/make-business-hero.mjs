// Business ad page (/ad-1) desktop hero picture (owner, 9 Oct 2026): the owner's "home hero desktop" from
// "hero section/ad landing pages/business tax", made into a WebP file in public/images/hero. The original is only read,
// never changed. Scaled to 1902px wide (the owner's 10 Oct 2026 file is 3804px). Safe to re-run.
//   node scripts/make-business-hero.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(ROOT, "hero section", "ad landing pages", "business tax", "home hero desktop.png");
const dest = path.join(ROOT, "public", "images", "hero", "business-desk-v2-1902.webp");
const meta = await sharp(src).metadata();
await sharp(src).resize({ width: 1902 }).webp({ quality: 80, effort: 6 }).toFile(dest);
console.log(path.relative(ROOT, dest), `${meta.width}x${meta.height}`, (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
