// SMSF ad page (/ad-3) desktop hero picture (owner, 9 Oct 2026; replaced twice the same day, "-v3"): the owner's "Untitled" from
// "hero section/ad landing pages/smsf", made into a WebP file in public/images/hero. The original is only read, never
// changed. Safe to re-run.
//   node scripts/make-smsf-hero.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(ROOT, "hero section", "ad landing pages", "smsf", "Untitled.jpg");
const dest = path.join(ROOT, "public", "images", "hero", "smsf-desk-v3-1024.webp");
const meta = await sharp(src).metadata();
await sharp(src).webp({ quality: 85, effort: 6 }).toFile(dest);
console.log(path.relative(ROOT, dest), `${meta.width}x${meta.height}`, (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
