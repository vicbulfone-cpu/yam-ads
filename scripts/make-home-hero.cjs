// Home page hero (owner, 8 Oct 2026; rebuilt from the re-saved file 9 Oct 2026, v31 / light-v5): the "hero home5.png" photo scaled to fill the whole hero width (1983 x 793 frame),
// sharp all the way across (no blurred fill); the extra height is trimmed from the top, which is plain sky.
// SHIFT moves the picture down inside the frame (owner: 3mm, then 5mm more on 8 Oct 2026; about 5 image px per mm at 1440px wide): that much more sky
// shows at the top and that much less desk at the bottom.
// Two files: OUT (the ad pages) and OUT_HOME (the home page only), where the view through the window (sky, skyline and
// trees) is slightly lighter (owner, 8 Oct 2026). The window frame, plants, mug, chairs, laptop and desk are untouched.
// LIGHTEN is the brightness of the view; the mask shapes are in the source picture's pixels (1672 x 941).
//   node scripts/make-home-hero.cjs
const sharp = require('sharp');
const SRC = 'hero section/ad landing pages/hero home5.png', OUT = 'public/images/hero/home-v31-1983.webp',
  OUT_HOME = 'public/images/hero/home-light-v5-1983.webp', W = 1983, H = 793, SHIFT = 40, LIGHTEN = 1.1;
const VIEW_MASK = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect x="132" y="0" width="1182" height="772" fill="#fff"/>
  <polygon points="0,500 315,500 315,800 0,800" fill="#000"/>
  <rect x="198" y="700" width="210" height="80" fill="#000"/>
  <rect x="408" y="702" width="345" height="80" fill="#000"/>
  <polygon points="925,694 1212,648 1220,780 920,780" fill="#000"/>
</svg>`;
const frame = async (input, out) => {
  const { width: sw, height: sh } = await sharp(input).metadata();
  const h = Math.round(sh * W / sw);
  const scaled = await sharp(input).resize(W, h, { kernel: 'lanczos3' }).png().toBuffer();
  const info = await sharp(scaled).extract({ left: 0, top: h - H - SHIFT, width: W, height: H }).webp({ quality: 90 }).toFile(out);
  console.log(out, info.width, info.height, info.size);
};
(async () => {
  await frame(SRC, OUT);
  // home page: the lighter view, blended in through a softened mask so there are no hard edges
  const { width: sw, height: sh } = await sharp(SRC).metadata();
  const mask = await sharp(Buffer.from(VIEW_MASK(sw, sh))).blur(4).extractChannel('red').toBuffer();
  const light = await sharp(SRC).modulate({ brightness: LIGHTEN }).removeAlpha().joinChannel(mask).png().toBuffer();
  const home = await sharp(SRC).removeAlpha().composite([{ input: light }]).png().toBuffer();
  await frame(home, OUT_HOME);
})();
