// /ad-2 "How it works" step icons cut into layers so their parts can move on their own (owner, 9 Oct 2026: the pen
// writes on the pad, the puzzle pieces join, the hands greet). Same sources, trim and size as
// scripts/make-personal-step-icons.mjs, so every layer is the full icon canvas and they stack exactly into the icon:
//   questionnaire: pad (the pad filled in where the pen covered it) + pen
//   accountant-match: blue piece + green piece + pin (the green pin and its two dashes)
//   connect-handshake: hands + tick (the green tick disc and its two dashes)
// Run: node scripts/make-personal-step-layers.mjs
import fs from "node:fs";
import sharp from "sharp";

const DIR = "hero section/ad landing pages/personal tax/steps";
const OUT = "public/images/ad-personal/steps";
fs.mkdirSync(OUT, { recursive: true });

async function load(name) {
  const t = await sharp(`${DIR}/${name}.png`).trim({ threshold: 10 }).toBuffer();
  const { data, info } = await sharp(t).resize(440, 440, { fit: "inside" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height };
}
async function save(img, buf, file) {
  const dest = `${OUT}/${file}.webp`;
  await sharp(buf, { raw: { width: img.W, height: img.H, channels: 4 } }).webp({ quality: 88, alphaQuality: 100 }).toFile(dest);
  console.log("wrote", dest);
}
/** a copy of the icon with only the pixels whose label passes keep() */
function pick(img, label, keep) {
  const out = Buffer.alloc(img.data.length);
  for (let p = 0; p < img.W * img.H; p++) if (keep(label[p])) img.data.copy(out, p * 4, p * 4, p * 4 + 4);
  return out;
}
/** labels the solid pixels (alpha > 40) into 8-connected parts of the same kind (kind(p) = class or -1), then gives
 *  every other visible pixel (soft edges) the label of its nearest labelled neighbour */
function parts(img, kind) {
  const { data, W, H } = img, N = W * H, label = new Int32Array(N).fill(-1);
  let n = 0;
  for (let s = 0; s < N; s++) {
    if (label[s] !== -1 || data[s * 4 + 3] <= 40 || kind(s) < 0) continue;
    const k = kind(s), stack = [s]; label[s] = n;
    while (stack.length) {
      const p = stack.pop(), x = p % W, y = (p / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy, q = ny * W + nx;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || label[q] !== -1 || data[q * 4 + 3] <= 40 || kind(q) !== k) continue;
        label[q] = n; stack.push(q);
      }
    }
    n++;
  }
  let front = []; for (let p = 0; p < N; p++) if (label[p] >= 0) front.push(p);
  while (front.length) {
    const next = [];
    for (const p of front) {
      const x = p % W, y = (p / W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, q = ny * W + nx;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || label[q] !== -1 || data[q * 4 + 3] === 0) continue;
        label[q] = label[p]; next.push(q);
      }
    }
    front = next;
  }
  const box = Array.from({ length: n }, () => ({ x0: 1e9, y0: 1e9, x1: -1, y1: -1, size: 0 }));
  for (let p = 0; p < N; p++) if (label[p] >= 0) {
    const b = box[label[p]], x = p % W, y = (p / W) | 0;
    b.x0 = Math.min(b.x0, x); b.y0 = Math.min(b.y0, y); b.x1 = Math.max(b.x1, x); b.y1 = Math.max(b.y1, y); b.size++;
  }
  return { label, box };
}

// ---- questionnaire: the pen lifted off the pad -------------------------------------------------------------------
{
  const img = await load("questionnaire"), { data, W, H } = img;
  const at = (x, y) => (y * W + x) * 4;
  // the pen's axis from its coloured (navy/green) pixels right of the pad's lines
  const pts = [];
  for (let y = 0; y < H; y++) for (let x = 300; x < W; x++) {
    const i = at(x, y); if (data[i + 3] > 200 && Math.min(data[i], data[i + 1], data[i + 2]) < 160) pts.push([x, y]);
  }
  const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length, my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  let sxx = 0, syy = 0, sxy = 0; for (const [x, y] of pts) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my); }
  const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy), ux = Math.cos(ang), uy = Math.sin(ang);
  const T = (x, y) => (x - mx) * ux + (y - my) * uy, D = (x, y) => -(x - mx) * uy + (y - my) * ux;
  // the pen's width along its length: the coloured pixels anywhere near the axis (the clip included)
  const lo = new Map(), hi = new Map();
  let tLow = 1e9;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = at(x, y); if (data[i + 3] <= 200 || Math.min(data[i], data[i + 1], data[i + 2]) >= 160) continue;
    const t = Math.round(T(x, y)), d = D(x, y);
    if (Math.abs(d) > 42 || t < -200 || t > 140) continue;
    if (x < 300 && Math.abs(d) > 14) continue; // the pad's lines left of the pen
    lo.set(t, Math.min(lo.get(t) ?? 1e9, d)); hi.set(t, Math.max(hi.get(t) ?? -1e9, d));
    tLow = Math.min(tLow, t);
  }
  // the white point below the last coloured slice narrows to the tip
  const tipLen = 24;
  const span = (t) => {
    const k = Math.round(t);
    if (lo.has(k)) return [lo.get(k), hi.get(k)];
    for (let j = 1; j <= 3; j++) { if (lo.has(k + j)) return [lo.get(k + j), hi.get(k + j)]; if (lo.has(k - j)) return [lo.get(k - j), hi.get(k - j)]; }
    if (k < tLow && k >= tLow - tipLen) { const w = 9 * (1 - (tLow - k) / tipLen) + 2.5; return [-w, w]; }
    return null;
  };
  // pen coverage per pixel: 1 inside its outline plus 3px (its soft edge and outline), then a 1.5px fade
  const cover = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const s = span(T(x, y)); if (!s) continue;
    const d = D(x, y), inside = Math.min(d - (s[0] - 4.5), (s[1] + 4.5) - d);
    cover[y * W + x] = Math.max(0, Math.min(1, inside / 1.5));
  }
  // the pad's right and bottom edges (straight, slightly tilted; measured above and left of the pen)
  const rows = []; for (let y = 10; y <= 110; y += 2) { let r = -1; for (let x = 0; x < W; x++) if (data[at(x, y) + 3] > 128) r = x; rows.push([y, r]); }
  const fit = (P) => { const n = P.length, a = P.reduce((s, p) => s + p[0], 0) / n, b = P.reduce((s, p) => s + p[1], 0) / n;
    const k = P.reduce((s, p) => s + (p[0] - a) * (p[1] - b), 0) / P.reduce((s, p) => s + (p[0] - a) ** 2, 0); return (v) => b + k * (v - a); };
  const rightX = fit(rows);
  const cols = []; for (let x = 120; x <= 240; x += 2) { let b = -1; for (let y = 0; y < H; y++) if (data[at(x, y) + 3] > 128) b = y; cols.push([x, b]); }
  const bottomY = fit(cols);
  const pen = Buffer.alloc(data.length), pad = Buffer.from(data);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = cover[y * W + x]; if (!c) continue;
    const i = at(x, y);
    data.copy(pen, i, i, i + 4); pen[i + 3] = Math.round(data[i + 3] * c);
    // behind the pen: the pad's white where the pad is, else nothing
    const inPad = Math.max(0, Math.min(1, Math.min(rightX(y) - x, bottomY(x) - y) + 0.5));
    // the whole cut is refilled (no trace of the pen's outline is left on the pad)
    pad[i] = 250; pad[i + 1] = 251; pad[i + 2] = 252; pad[i + 3] = Math.round(253 * inPad);
  }
  console.log("pen axis", (ang * 180 / Math.PI).toFixed(1) + "deg", "tip end t", tLow);
  await save(img, pad, "questionnaire-pad");
  await save(img, pen, "questionnaire-pen");
}

// ---- accountant-match: the blue piece, the green piece, the pin -------------------------------------------------
{
  const img = await load("accountant-match"), { data } = img;
  const kind = (p) => { const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2]; return b > g + 15 ? 0 : g > b + 15 ? 1 : -1; };
  const { label, box } = parts(img, kind);
  const big = box.map((b, i) => [b.size, i]).sort((a, b) => b[0] - a[0]);
  const ids = big.slice(0, 2).map((e) => e[1]);
  const blue = ids.find((i) => box[i].x0 < 50), green = ids.find((i) => i !== blue);
  console.log("puzzle parts", box.length, "blue", JSON.stringify(box[blue]), "green", JSON.stringify(box[green]));
  await save(img, pick(img, label, (l) => l === blue), "accountant-match-blue");
  await save(img, pick(img, label, (l) => l === green), "accountant-match-green");
  await save(img, pick(img, label, (l) => l >= 0 && l !== blue && l !== green), "accountant-match-pin");
}

// ---- connect-handshake: the hands, the tick -----------------------------------------------------------------------
{
  const img = await load("connect-handshake");
  const { label, box } = parts(img, () => 0);
  const top = new Set(box.map((b, i) => [b, i]).filter(([b]) => b.y1 < 120).map(([, i]) => i));
  console.log("handshake parts", box.length, "tick parts", [...top].map((i) => JSON.stringify(box[i])).join(" "));
  await save(img, pick(img, label, (l) => l >= 0 && !top.has(l)), "connect-handshake-hands");
  await save(img, pick(img, label, (l) => top.has(l)), "connect-handshake-tick");
}
