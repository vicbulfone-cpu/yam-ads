// Home page hero (owner, 10 Oct 2026): the owner's super high quality "hero.png" from "hero section/ad landing pages/home"
// (Perth skyline over the suburbs, 7932 x 3172: exactly four times the 1983 x 793 hero frame, so nothing is cropped).
// Halved to 3966 x 1586 (twice the frame: sharp on high-resolution screens; Next.js serves at most 3840px wide) with a
// clean mitchell downscale (owner, 10 Oct 2026: lanczos3 left the tallest towers' edges looking too sharp; "-v2"), no sharpening or colour changes, saved as a quality 95 WebP with sharp's "smart" colour
// subsampling (keeps fine colour edges such as roofs against trees) so it keeps its look. The original is only read, never changed. Safe to re-run.
//   node scripts/make-home-hero-hq.cjs
const sharp = require('sharp');
const SRC = 'hero section/ad landing pages/home/hero.png', OUT = 'public/images/hero/home-hq-v3-3966.webp', W = 3966, H = 1586;
(async () => {
  const { width: sw, height: sh } = await sharp(SRC).metadata();
  const base = await sharp(SRC).resize(W, H, { kernel: 'mitchell', fit: 'cover', position: 'bottom' }).removeAlpha().raw().toBuffer();
  // The original has thin white sharpening halos around the city towers (owner, 10 Oct 2026: "the tallest building looks too
  // sharp around edges"). Over the skyline band only (BAND, fractions of the height, feathered), the photo is blended with a
  // softened copy so the halos melt into the sky; everything above and below is untouched.
  const BAND = [0.52, 0.58, 0.68, 0.74]; // fade in from, full from, full to, fade out by
  const soft = await sharp(base, { raw: { width: W, height: H, channels: 3 } }).blur(1.6).raw().toBuffer();
  const out = Buffer.alloc(base.length);
  for (let y = 0; y < H; y++) {
    const f = y / H;
    const k = f <= BAND[0] || f >= BAND[3] ? 0 : f < BAND[1] ? (f - BAND[0]) / (BAND[1] - BAND[0]) : f <= BAND[2] ? 1 : (BAND[3] - f) / (BAND[3] - BAND[2]);
    for (let i = y * W * 3, e = i + W * 3; i < e; i++) out[i] = Math.round(base[i] * (1 - k) + soft[i] * k);
  }
  const info = await sharp(out, { raw: { width: W, height: H, channels: 3 } })
    .webp({ quality: 95, smartSubsample: true, effort: 6 }).toFile(OUT);
  console.log(OUT, `${sw}x${sh} ->`, info.width, info.height, (info.size / 1024).toFixed(0) + ' KB');
})();
