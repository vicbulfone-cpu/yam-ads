// Builds the branded 1200x630 share image (public/images/brand/og-default.png) from the logo.
// Safe to re-run:  node scripts/make-og-image.mjs
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = await sharp(path.join(ROOT, "public/images/brand/logo-v3-1000.webp")).resize({ width: 880 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#ffffff" } })
  .composite([{ input: logo, gravity: "center" }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(ROOT, "public/images/brand/og-default.png"));
console.log("og-default.png written");
