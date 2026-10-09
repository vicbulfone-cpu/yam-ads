// The owner's three step icons for /ad-2's "How it works" (hero section/ad landing pages/personal tax/steps, 9 Oct
// 2026): questionnaire, puzzle with pin, handshake. Each is trimmed to its drawing (transparent edges cut off), then
// saved as a small WebP with its transparency. Run: node scripts/make-personal-step-icons.mjs
import fs from "node:fs";
import sharp from "sharp";

const DIR = "hero section/ad landing pages/personal tax/steps";
const OUT = "public/images/ad-personal/steps";
const FILES = ["questionnaire", "accountant-match", "connect-handshake"];
fs.mkdirSync(OUT, { recursive: true });
for (const f of FILES) {
  const trimmed = await sharp(`${DIR}/${f}.png`).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  const dest = `${OUT}/${f}.webp`;
  await sharp(trimmed.data).resize(440, 440, { fit: "inside" }).webp({ quality: 88, alphaQuality: 100 }).toFile(dest);
  const m = await sharp(dest).metadata();
  console.log("wrote", dest, m.width, "x", m.height);
}
