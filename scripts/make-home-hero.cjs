// Home page hero (owner, 8 Oct 2026): the "hero home5.png" photo scaled to fill the whole hero width (1983 x 793 frame),
// sharp all the way across (no blurred fill); the extra height is trimmed from the top, which is plain sky.
// SHIFT moves the picture down inside the frame (owner: 3mm, about 15 image px at 1440px wide): that much more sky
// shows at the top and that much less desk at the bottom.
//   node scripts/make-home-hero.cjs
const sharp = require('sharp');
const SRC = 'hero section/ad landing pages/hero home5.png', OUT = 'public/images/hero/home-v21-1983.webp', W = 1983, H = 793, SHIFT = 15;
(async () => {
  const { width: sw, height: sh } = await sharp(SRC).metadata();
  const h = Math.round(sh * W / sw);
  const scaled = await sharp(SRC).resize(W, h, { kernel: 'lanczos3' }).png().toBuffer();
  const info = await sharp(scaled).extract({ left: 0, top: h - H - SHIFT, width: W, height: H }).webp({ quality: 90 }).toFile(OUT);
  console.log(info.width, info.height, info.size);
})();
