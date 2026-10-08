// Home page hero (owner, 8 Oct 2026): the whole "hero home5.png" photo, scaled to the hero height (1983 x 793 frame),
// with a soft blurred continuation of the photo filling the right-hand strip (mostly behind the match box).
//   node scripts/make-home-hero.cjs
const sharp = require('sharp');
const SRC = 'hero section/ad landing pages/hero home5.png', OUT = 'public/images/hero/home-v19-1983.webp', W = 1983, H = 793;
(async () => {
  const { width: sw, height: sh } = await sharp(SRC).metadata();
  const pw = Math.min(W, Math.round(sw * H / sh)); // whole photo, scaled to the hero's height
  const photo = await sharp(SRC).resize(pw, H, { kernel: 'lanczos3' }).png().toBuffer();
  // feathered right edge so the photo melts into the blurred fill
  const feather = 160;
  const mask = Buffer.from(`<svg width="${pw}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="${1 - feather / pw}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="${pw}" height="${H}" fill="url(#g)"/></svg>`);
  const faded = await sharp(photo).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  // fill: the photo's right third stretched across the frame and softly blurred
  const fx = Math.round(sw * 2 / 3);
  const fill = await sharp(SRC).extract({ left: fx, top: 0, width: sw - fx, height: sh }).resize(W, H, { fit: 'fill' }).blur(30).png().toBuffer();
  const info = await sharp(fill).composite([{ input: faded, left: 0, top: 0 }]).removeAlpha().webp({ quality: 90 }).toFile(OUT);
  console.log(pw, info.size);
})();
