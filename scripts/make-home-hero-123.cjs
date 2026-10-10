// Home page hero (owner, 10 Oct 2026, noc): the owner's "hero pic 123.png" from "hero section/ad landing pages/home"
// (Perth skyline over the suburbs), framed as the earlier home pictures were (scripts/make-home-hero-z.cjs): scaled to
// fill the 1983 x 793 hero frame, the extra height trimmed from the top (plain sky). The original is only read, never
// changed. Safe to re-run.
//   node scripts/make-home-hero-123.cjs
const sharp = require('sharp');
const SRC = 'hero section/ad landing pages/home/hero pic 123.png', OUT = 'public/images/hero/home-123-v1-1983.webp',
  W = 1983, H = 793, SHIFT = 0;
(async () => {
  const { width: sw, height: sh } = await sharp(SRC).metadata();
  const h = Math.round(sh * W / sw);
  const scaled = await sharp(SRC).resize(W, h, { kernel: 'lanczos3' }).png().toBuffer();
  const info = await sharp(scaled).extract({ left: 0, top: h - H - SHIFT, width: W, height: H }).webp({ quality: 90 }).toFile(OUT);
  console.log(OUT, `${sw}x${sh} ->`, info.width, info.height, info.size);
})();
