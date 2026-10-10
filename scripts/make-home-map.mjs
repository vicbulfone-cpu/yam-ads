// Home page "Meet Your Accountant Match" picture (owner, 10 Oct 2026): the owner's "Untitled.png" from
// "hero section/ad landing pages/c" (a navy map of Australia with the green network, pins and icons), in place of the
// tradie photo on the home page only. Made into a WebP file in public/images/home. The original is only read, never
// changed. Safe to re-run.
//   node scripts/make-home-map.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(ROOT, "hero section", "ad landing pages", "c", "Untitled.png");
const dest = path.join(ROOT, "public", "images", "home", "network-map-1600.webp");
const meta = await sharp(src).metadata();
await sharp(src).resize({ width: 1600 }).webp({ quality: 88, effort: 6 }).toFile(dest);
const out = await sharp(dest).metadata();
console.log(path.relative(ROOT, dest), `${meta.width}x${meta.height} -> ${out.width}x${out.height}`, (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
