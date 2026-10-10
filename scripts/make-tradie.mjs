// Home "match intro" tradie picture for tablets and up, used site-wide (owner, 10 Oct 2026): the owner's "tradie" from
// "hero section/ad landing pages", scaled to 1532px wide (the original is 3064px) and made into a WebP file in
// public/images/home. The original is only read, never changed. Safe to re-run.
//   node scripts/make-tradie.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(ROOT, "hero section", "ad landing pages", "tradie.png");
const dest = path.join(ROOT, "public", "images", "home", "tradie-ute-driveway-v2.webp");
const meta = await sharp(src).metadata();
await sharp(src).resize({ width: 1532 }).webp({ quality: 80, effort: 6 }).toFile(dest);
console.log(path.relative(ROOT, dest), `${meta.width}x${meta.height}`, (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
