// Home page hero (owner, 10 Oct 2026, noc): the owner's "heorz.png" from "hero section/ad landing pages/personal tax",
// framed as the old home picture was (scripts/make-home-hero.cjs): scaled to fill the 1983 x 793 hero frame, the extra
// height trimmed from the top (plain sky), moved down SHIFT image px. The old picture's "lighter view" step is not used:
// its mask shapes were drawn on the old photo. The original is only read, never changed. Safe to re-run.
//   node scripts/make-home-hero-z.cjs
const sharp = require('sharp');
const SRC = 'hero section/ad landing pages/personal tax/heorz.png', OUT = 'public/images/hero/home-z-v1-1983.webp',
  W = 1983, H = 793, SHIFT = 40;
(async () => {
  const { width: sw, height: sh } = await sharp(SRC).metadata();
  const h = Math.round(sh * W / sw);
  const scaled = await sharp(SRC).resize(W, h, { kernel: 'lanczos3' }).png().toBuffer();
  const info = await sharp(scaled).extract({ left: 0, top: h - H - SHIFT, width: W, height: H }).webp({ quality: 90 }).toFile(OUT);
  console.log(OUT, `${sw}x${sh} ->`, info.width, info.height, info.size);
})();
