// Personal tax ad page (/ad-2) hero pictures (owner, 9 Oct 2026): the owner's "personal hero pic" (desktop) and
// "personal hero pic mobile" (phones and tablets) from "hero section/ad landing pages/personal tax", made into WebP files
// in public/images/hero (desktop photo replaced by the owner 9 Oct 2026, 07:31 "-v2", 07:34 "-v3", 07:39 "-v4", 09:33 "personal hero piclarge" "-v5"; 10 Oct 2026 "personal hero" "-v6", scaled from 3966px). The originals are only read, never changed. Safe to re-run.
//   node scripts/make-personal-hero.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "hero section", "ad landing pages", "personal tax");
const OUT = path.join(ROOT, "public", "images", "hero");

const jobs = [
  { file: "personal hero.png", name: "personal-desk-v6", widths: [1983] },
  { file: "personal hero pic mobile.png", name: "personal-mobile", widths: [941] },
];
for (const j of jobs) {
  const src = path.join(SRC, j.file);
  const meta = await sharp(src).metadata();
  for (const w of j.widths) {
    const dest = path.join(OUT, `${j.name}-${w}.webp`);
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(dest);
    console.log(path.relative(ROOT, dest), `${meta.width}x${meta.height}`, (fs.statSync(dest).size / 1024).toFixed(0) + " KB");
  }
}
