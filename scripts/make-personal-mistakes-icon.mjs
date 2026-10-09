// /ad-2 "An experienced accountant can help you:" box: "Help you avoid common mistakes" had the same rising-chart icon
// as "Deal with more complex tax situations" (owner, 9 Oct 2026: same icon used twice). This draws its own icon in the
// same style as the owner's: a flat green circle (#087b12, sampled from the others) with a white line shield and tick.
// Run: node scripts/make-personal-mistakes-icon.mjs
import sharp from "sharp";

const SIZE = 160;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 160 160">
  <circle cx="80" cy="80" r="79.5" fill="#087b12"/>
  <g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M80 36 L110 47 V76 C110 97 97 111 80 121 C63 111 50 97 50 76 V47 Z"/>
    <path d="M66 79 L76 89 L95 68"/>
  </g>
</svg>`;
const dest = "public/images/ad-personal/help/08_avoid_mistakes_shield.webp";
await sharp(Buffer.from(svg)).webp({ quality: 90, alphaQuality: 100 }).toFile(dest);
console.log("wrote", dest);
