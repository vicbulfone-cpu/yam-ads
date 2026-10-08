// Personal tax ad page (/ad-2) service card icons (owner's green line icons in "hero section", 9 Oct 2026), made into
// small WebP files in public/images/ad-personal. The originals are only read, never changed. Safe to re-run.
//   node scripts/make-personal-icons.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "hero section");
const OUT = path.join(ROOT, "public", "images", "ad-personal");
fs.mkdirSync(OUT, { recursive: true });

const ICONS = {
  "tax-return": "tax-planning.png", // document
  deductions: "save-money(1).png", // wallet
  "rental-property": "property-tax.png", // house
  investments: "capital-gains.png", // rising chart
  contractor: "business-accounting.png", // briefcase
  complex: "financial-reporting.png", // bar chart
};
for (const [name, file] of Object.entries(ICONS)) {
  const dest = path.join(OUT, `${name}.webp`);
  await sharp(path.join(SRC, file)).resize(160, 160).webp({ quality: 90, alphaQuality: 100 }).toFile(dest);
  console.log(path.relative(ROOT, dest), (fs.statSync(dest).size / 1024).toFixed(1) + " KB");
}
