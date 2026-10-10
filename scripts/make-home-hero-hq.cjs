// Home page hero (owner, 10 Oct 2026): the owner's super high quality "hero.png" from "hero section/ad landing pages/home"
// (Perth skyline over the suburbs, 7932 x 3172: exactly four times the 1983 x 793 hero frame, so nothing is cropped).
// Halved to 3966 x 1586 (twice the frame: sharp on high-resolution screens; Next.js serves at most 3840px wide) with a
// clean lanczos3 downscale, no sharpening or colour changes, saved as a quality 95 WebP with sharp's "smart" colour
// subsampling (keeps fine colour edges such as roofs against trees) so it keeps its look. The original is only read, never changed. Safe to re-run.
//   node scripts/make-home-hero-hq.cjs
const sharp = require('sharp');
const SRC = 'hero section/ad landing pages/home/hero.png', OUT = 'public/images/hero/home-hq-v1-3966.webp', W = 3966, H = 1586;
(async () => {
  const { width: sw, height: sh } = await sharp(SRC).metadata();
  const info = await sharp(SRC).resize(W, H, { kernel: 'lanczos3', fit: 'cover', position: 'bottom' })
    .webp({ quality: 95, smartSubsample: true, effort: 6 }).toFile(OUT);
  console.log(OUT, `${sw}x${sh} ->`, info.width, info.height, (info.size / 1024).toFixed(0) + ' KB');
})();
