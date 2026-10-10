// Home hero sky extension (owner, 10 Oct 2026: "move home hero pic down 1.5cm and extend skyline above"): the top rows of the
// owner's "hero.png" (plain sky), averaged down to a thin strip (no blur, which darkened its ends) that globals.css stretches over the
// 1.5cm above the lowered photo. The original is only read, never changed. Safe to re-run.
//   node scripts/make-home-hero-sky.cjs
const sharp = require('sharp');
const SRC = 'hero section/ad landing pages/home/hero.png', OUT = 'public/images/hero/home-hq-sky-strip.webp';
(async () => {
  const { width } = await sharp(SRC).metadata();
  const info = await sharp(SRC).extract({ left: 0, top: 0, width, height: 16 }).resize(1983, 4, { fit: 'fill', kernel: 'cubic' })
    .webp({ quality: 95, smartSubsample: true }).toFile(OUT);
  console.log(OUT, info.width, info.height, info.size);
})();
