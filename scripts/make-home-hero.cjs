// Home page hero (owner, 8 Oct 2026): the "hero home5.png" photo scaled to fill the whole hero width (1983 x 793 frame),
// sharp all the way across (no blurred fill); the extra height is trimmed from the top, which is plain sky.
//   node scripts/make-home-hero.cjs
const sharp = require('sharp');
const SRC = 'hero section/ad landing pages/hero home5.png', OUT = 'public/images/hero/home-v20-1983.webp', W = 1983, H = 793;
(async () => {
  const info = await sharp(SRC).resize(W, H, { fit: 'cover', position: 'bottom', kernel: 'lanczos3' }).webp({ quality: 90 }).toFile(OUT);
  console.log(info.width, info.height, info.size);
})();
