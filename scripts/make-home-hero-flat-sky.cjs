// Home hero photo with one flat sky colour (owner, 10 Oct 2026: "make all of sky same colour as behind words 'Local accountants
// in your area'"). Reads the home hero photo (public/images/hero/home-hq-v3-3966.webp, made by make-home-hero-hq.cjs) and sets
// every sky pixel to the colour behind those words (averaged over where they sit on a 1920px screen): rgb(117, 203, 247).
// The sky is found by filling down from the top edge through pixels that change only gradually (the sky's own gradient); the
// fill stops at the towers' and trees' edges. The pixels on those edges get part of the same colour shift so no light or dark
// rim shows round the skyline. Everything below the sky is untouched. Safe to re-run.
//   node scripts/make-home-hero-flat-sky.cjs
const sharp = require('sharp');
const SRC = 'public/images/hero/home-hq-v3-3966.webp', OUT = 'public/images/hero/home-hq-v4-3966.webp';
const TARGET = [117, 203, 247];
const STEP = 7; // largest colour change between neighbouring sky pixels (sum of R, G, B differences, slightly smoothed copy)
const LOW = Math.round(0.76 * 1586); // never below this row (just under the lowest point of the horizon)
(async () => {
  const { data: img, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const soft = await sharp(img, { raw: { width: W, height: H, channels: 3 } }).blur(1.2).raw().toBuffer();
  const diff = (a, b) => Math.abs(soft[a * 3] - soft[b * 3]) + Math.abs(soft[a * 3 + 1] - soft[b * 3 + 1]) + Math.abs(soft[a * 3 + 2] - soft[b * 3 + 2]);
  // fill from the whole top row
  const sky = new Uint8Array(N);
  const stack = [];
  for (let x = 0; x < W; x++) { sky[x] = 1; stack.push(x); }
  while (stack.length) {
    const p = stack.pop(), x = p % W;
    for (const q of [p - W, p + W, x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1]) {
      if (q < 0 || q >= N || sky[q]) continue;
      if (q < LOW * W && diff(p, q) <= STEP && soft[q * 3 + 2] + 8 >= soft[q * 3]) { sky[q] = 1; stack.push(q); }
    }
  }
  // small holes inside the sky (compression specks) count as sky
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const p = y * W + x;
    if (!sky[p] && sky[p - W] && sky[p + W] && sky[p - 1] && sky[p + 1]) sky[p] = 1;
  }
  // colour shift: sky pixels become the target exactly; edge pixels next to the sky take part of the shift of the nearest sky
  // pixel (0.55 one pixel away, 0.2 two pixels away)
  const out = Buffer.from(img);
  const shift = new Float32Array(N * 3), has = new Float32Array(N);
  for (let p = 0; p < N; p++) if (sky[p]) {
    has[p] = 1;
    for (let c = 0; c < 3; c++) { shift[p * 3 + c] = TARGET[c] - img[p * 3 + c]; out[p * 3 + c] = TARGET[c]; }
  }
  for (const weight of [0.55, 0.2]) {
    const next = [];
    for (let p = 0; p < N; p++) {
      if (has[p]) continue;
      const x = p % W; let n = 0; const s = [0, 0, 0];
      for (const q of [p - W, p + W, x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1]) {
        if (q < 0 || q >= N || !has[q]) continue;
        n++; for (let c = 0; c < 3; c++) s[c] += shift[q * 3 + c];
      }
      if (n) next.push([p, s.map((v) => v / n)]);
    }
    for (const [p, s] of next) {
      has[p] = 1;
      for (let c = 0; c < 3; c++) { shift[p * 3 + c] = s[c]; out[p * 3 + c] = Math.max(0, Math.min(255, Math.round(img[p * 3 + c] + s[c] * weight))); }
    }
  }
  let count = 0, lowest = 0;
  for (let p = 0; p < N; p++) if (sky[p]) { count++; lowest = Math.max(lowest, Math.floor(p / W)); }
  const res = await sharp(out, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 95, smartSubsample: true, effort: 6 }).toFile(OUT);
  console.log(OUT, res.width, res.height, (res.size / 1024).toFixed(0) + ' KB', `sky ${(100 * count / N).toFixed(1)}% of the photo, lowest sky row ${(lowest / H).toFixed(3)}`);
})();
