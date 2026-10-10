// Home hero photo with one flat sky colour (owner, 10 Oct 2026: "make all of sky same colour as behind words 'Local accountants
// in your area'"). Reads the home hero photo (public/images/hero/home-hq-v3-3966.webp, made by make-home-hero-hq.cjs) and sets
// every sky pixel to the colour behind those words (averaged over where they sit on a 1920px screen): rgb(117, 203, 247).
// The sky is found by filling down from the top edge through pixels that change only gradually (the sky's own gradient); the
// fill stops at the towers' and trees' edges. The pixels on those edges get part of the same colour shift so no light or dark
// rim shows round the skyline. Everything below the sky is untouched. Safe to re-run.
//   node scripts/make-home-hero-flat-sky.cjs
const sharp = require('sharp');
const SRC = 'public/images/hero/home-hq-v3-3966.webp', OUT = 'public/images/hero/home-hq-v5-3966.webp';
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
  // "-v5" (owner, 10 Oct 2026, noc: "landscape buildings that are very square, tone down so they look like the other buildings"):
  // the two boxy buildings in the suburbs, the bright white apartment block by the river and the long flat red roof, are blended
  // (feathered, FEATHER px) with a softened copy of the photo: a little blur (their hard edges), less saturation and contrast, and a
  // light distance haze, so they sit back like the houses round them. TONE: each one's box in the 3966 x 1586 photo and strengths.
  const TONE = [
    // pick: which pixels in the box are the building (only those are toned, so the trees, river and towers round it are untouched)
    { l: 1306, t: 1178, r: 1480, b: 1266, haze: 0.28, sat: 0.6, contrast: 0.72, dim: 0.9, close: 6, // the white apartment block
      pick: (R, G, B) => R + G + B > 480 && Math.max(R, G, B) - Math.min(R, G, B) < 45 },
    { l: 2470, t: 1266, r: 2860, b: 1312, haze: 0.18, sat: 0.55, contrast: 0.8, dim: 0.94, close: 2, // the long flat red roof
      pick: (R, G, B) => R > 120 && R > G + 35 && R > B + 35 },
  ];
  const FEATHER = 8; // the box's own soft edge; the building's outline is softened by MASK_BLUR px
  const MASK_BLUR = 1.2;
  const softened = await sharp(out, { raw: { width: W, height: H, channels: 3 } }).blur(1.1).raw().toBuffer();
  const HAZE = [150, 168, 182]; // the blue-grey of the distant haze along the river
  for (const z of TONE) {
    let mean = [0, 0, 0], n = 0; // the region's average colour, for the contrast change
    for (let y = z.t; y < z.b; y++) for (let x = z.l; x < z.r; x++) { const i = (y * W + x) * 3; for (let c = 0; c < 3; c++) mean[c] += softened[i + c]; n++; }
    mean = mean.map((v) => v / n);
    // the building's pixels in the box, with small gaps (its windows, a pole across the roof) closed: grown by "close" px, then
    // shrunk back, then softened
    const bw = z.r - z.l + 2 * FEATHER, bh = z.b - z.t + 2 * FEATHER, ox = z.l - FEATHER, oy = z.t - FEATHER;
    let m = new Uint8Array(bw * bh);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) { const i = ((y + oy) * W + x + ox) * 3; m[y * bw + x] = z.pick(out[i], out[i + 1], out[i + 2]) ? 1 : 0; }
    const morph = (src, grow) => { const o = new Uint8Array(bw * bh); for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) { let v = grow ? 0 : 1; for (let dy = -z.close; dy <= z.close && v !== (grow ? 1 : 0); dy++) for (let dx = -z.close; dx <= z.close; dx++) { const yy = y + dy, xx = x + dx; const q = yy < 0 || yy >= bh || xx < 0 || xx >= bw ? 0 : src[yy * bw + xx]; if (grow ? q : !q) { v = grow ? 1 : 0; break; } } o[y * bw + x] = v; } return o; };
    m = morph(morph(m, true), false);
    const mSoft = await sharp(Buffer.from(m.map((v) => v * 255)), { raw: { width: bw, height: bh, channels: 1 } }).blur(MASK_BLUR).extractChannel(0).raw().toBuffer();
    for (let y = z.t - FEATHER; y < z.b + FEATHER; y++) for (let x = z.l - FEATHER; x < z.r + FEATHER; x++) {
      const d = Math.min(x - (z.l - FEATHER), z.r + FEATHER - x, y - (z.t - FEATHER), z.b + FEATHER - y) / (2 * FEATHER);
      const w = Math.max(0, Math.min(1, d)), k = w * w * (3 - 2 * w) * (mSoft[(y - oy) * bw + (x - ox)] / 255);
      if (!k) continue;
      const i = (y * W + x) * 3, s0 = [softened[i], softened[i + 1], softened[i + 2]];
      const grey = 0.299 * s0[0] + 0.587 * s0[1] + 0.114 * s0[2];
      for (let c = 0; c < 3; c++) {
        let v = grey + (s0[c] - grey) * z.sat; // less colour
        v = mean[c] + (v - mean[c]) * z.contrast; // less contrast
        v = (v * z.dim) * (1 - z.haze) + HAZE[c] * z.haze; // a little darker, then the distance haze
        out[i + c] = Math.max(0, Math.min(255, Math.round(out[i + c] * (1 - k) + v * k)));
      }
    }
  }
  const res = await sharp(out, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 95, smartSubsample: true, effort: 6 }).toFile(OUT);
  console.log(OUT, res.width, res.height, (res.size / 1024).toFixed(0) + ' KB', `sky ${(100 * count / N).toFixed(1)}% of the photo, lowest sky row ${(lowest / H).toFixed(3)}`);
})();
