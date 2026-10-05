// Converts the original pictures in /assets (large PNGs) into small WebP files in /public/images.
// Safe to re-run. /assets is only read, never changed.
//   City pictures  -> public/images/cities/<slug>-1600.webp and -800.webp
//   Hero picture   -> public/images/brand/hero-1916.webp and -960.webp
//   Logo           -> see scripts/make-logo.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "assets");
const OUT = path.join(ROOT, "public", "images");

// slug -> file the user supplied
const CITIES = {
  sydney: "sydney.png", "newcastle-maitland": "newcastle midland.png", melbourne: "melbourne.png", geelong: "geelong.png",
  brisbane: "brisbane.png", "gold-coast": "gold coast.png", "sunshine-coast": "sunshine coast.png", perth: "perth.png",
  adelaide: "adelaide.png", hobart: "hobart.png", launceston: "launceston.png",
  "canberra-queanbeyan": "Canberra – Queanbeyan.png", darwin: "darwin.png",
};

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0) + " KB";
async function webp(src, dest, width, quality) {
  await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(dest);
  console.log(path.relative(ROOT, dest), kb(dest));
}

for (const [slug, file] of Object.entries(CITIES)) {
  const src = path.join(ASSETS, file);
  await webp(src, path.join(OUT, "cities", `${slug}-1600.webp`), 1600, 62);
  await webp(src, path.join(OUT, "cities", `${slug}-800.webp`), 800, 58);
}
// The hero pictures are built by scripts/make-city-heroes.mjs.
// The logo and browser icons are built by scripts/make-logo.mjs (it also makes the white background transparent).
