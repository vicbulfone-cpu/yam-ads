// Builds the web files for the new hero (owner's design, 4 Oct 2026) from the supplied artwork in "hero section/":
//   new logo.jpg                  -> public/images/brand/logo-v5-1200.webp, logo-v5-680.webp (white background made transparent)
//                                    and the 1200x630 share image public/images/brand/og-default.png
//   new hero pic.png              -> public/images/hero/desk-v5-1983.webp (hero background, kept at full size and high quality)
//   icon artwork                  -> public/images/ui/hero-*.webp (160px)
// Safe to re-run:  node scripts/make-hero-assets.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "hero section");
const out = (...p) => path.join(ROOT, "public", "images", ...p);
for (const d of ["brand", "hero", "ui"]) fs.mkdirSync(out(d), { recursive: true });

// ---- 1. logo: white JPEG background -> transparent (each pixel's whiteness becomes transparency, colours are kept)
{
  const { data, info } = await sharp(path.join(SRC, "new logo.jpg")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    let a = (255 - Math.min(r, g, b)) / 255; // 0 = white paper, 1 = full ink
    a = a < 0.06 ? 0 : Math.min(1, a * 1.35); // drop JPEG speckle, firm up the ink
    if (a === 0) { rgba[j] = 255; rgba[j + 1] = 255; rgba[j + 2] = 255; rgba[j + 3] = 0; continue; }
    const un = (c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a))); // remove the white that was mixed in
    rgba[j] = un(r); rgba[j + 1] = un(g); rgba[j + 2] = un(b); rgba[j + 3] = Math.round(a * 255);
  }
  const clear = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toBuffer();
  const meta = await sharp(clear).metadata();
  for (const w of [1200, 680]) await sharp(clear).resize({ width: w }).webp({ quality: 90, alphaQuality: 100 }).toFile(out("brand", `logo-v5-${w}.webp`));
  console.log(`logo: ${meta.width}x${meta.height} -> logo-v5-1200.webp (height ${Math.round((1200 * meta.height) / meta.width)}), logo-v5-680.webp`);
  const og = await sharp(clear).resize({ width: 960 }).png().toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#ffffff" } })
    .composite([{ input: og, gravity: "center" }]).png({ compressionLevel: 9 }).toFile(out("brand", "og-default.png"));
  console.log("og-default.png written");
}

// ---- 2. hero background
// full size, near-lossless: the site then serves it at high quality (see images.qualities in next.config.ts).
// The file name carries a version (v5) because pictures are cached by browsers for a year: a new picture needs a new name.
// The handwriting painted on the picture ("The smarter way to find an accountant.") is royal blue in the artwork; it is
// recoloured to the headline navy (#073265) so it matches the H1. Only the blue ink inside the lettering area changes.
{
  const { data, info } = await sharp(path.join(SRC, "new hero pic.png")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const k = info.width / 1983;
  const box = { x0: Math.round(530 * k), x1: Math.round(905 * k), y0: Math.round(415 * k), y1: Math.round(590 * k) };
  const INK = [5, 8, 113], NAVY = [7, 50, 101]; // INK = the lettering colour measured in the artwork
  for (let y = box.y0; y < box.y1; y++) for (let x = box.x0; x < box.x1; x++) {
    const i = (y * info.width + x) * 3;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const t = Math.max(0, Math.min(1, (b - Math.max(r, g) - 45) / 70)); // how much blue ink is in this pixel
    if (!t) continue;
    for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round(data[i + c] + t * (NAVY[c] - INK[c]))));
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 96, effort: 6 }).toFile(out("hero", "desk-v7-1983.webp"));
}
console.log("hero background: desk-v7-1983.webp");

// ---- 3. icons (trimmed, 160px)
const ICONS = {
  "hero-pin": "location-pin-original-shape.png",
  "hero-people": "three-people-original-shape.png",
  "hero-handshake": "Untitled2.png",
  "hero-people-plain": "three-person-recreated-solid-green.png",
  "hero-shield": "Untitled3.png",
  "hero-thumb": "Untitled4.png",
};
for (const [name, file] of Object.entries(ICONS)) {
  const info = await sharp(path.join(SRC, file)).trim().resize({ width: 160, height: 160, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 90, alphaQuality: 100 }).toFile(out("ui", `${name}.webp`));
  console.log(`${name}.webp ${info.width}x${info.height}`);
}

// ---- 4. Australia map for the match box, cut from the owner's match box design ("hero section/match box design.png").
//         The "AUSTRALIA WIDE" lettering is painted out (it is real text on the page) and the white background made transparent.
{
  const design = path.join(SRC, "match box design.png");
  if (fs.existsSync(design)) {
    const box = { left: 986, top: 34, width: 252, height: 220 };
    const blank = await sharp({ create: { width: 180, height: 26, channels: 3, background: "#ffffff" } }).png().toBuffer();
    const { data, info } = await sharp(design).extract(box).composite([{ input: blank, left: 0, top: 182 }]).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const rgba = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      let a = (255 - Math.min(r, g, b)) / 255;
      a = a < 0.05 ? 0 : Math.min(1, a * 1.15);
      if (a === 0) { rgba[j] = 255; rgba[j + 1] = 255; rgba[j + 2] = 255; rgba[j + 3] = 0; continue; }
      const un = (c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a)));
      rgba[j] = un(r); rgba[j + 1] = un(g); rgba[j + 2] = un(b); rgba[j + 3] = Math.round(a * 255);
    }
    const info2 = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toFile(out("ui", "australia-map.webp"));
    console.log(`australia-map.webp ${info2.width}x${info2.height}`);
  }
}

// ---- 5. Match box map with location pins (owner's design for the top of the match box, "match box top design.png").
//         The pale map is cut from the design and enlarged; the pins are redrawn as sharp shapes on top of it.
{
  const design = path.join(SRC, "match box top design.png");
  if (fs.existsSync(design)) {
    const K = 4; // enlargement
    const box = { left: 698, top: 12, width: 170, height: 163 };
    const { data, info } = await sharp(design).extract(box).resize({ width: box.width * K, kernel: "lanczos3" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const rgba = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      let a = (255 - Math.min(r, g, b)) / 255;
      a = a < 0.06 ? 0 : Math.min(1, a * 1.2);
      if (a === 0) { rgba[j] = 255; rgba[j + 1] = 255; rgba[j + 2] = 255; rgba[j + 3] = 0; continue; }
      const un = (c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a)));
      rgba[j] = un(r); rgba[j + 1] = un(g); rgba[j + 2] = un(b); rgba[j + 3] = Math.round(a * 255);
    }
    // pin positions (centre of each pin's round head), measured on the design at 4x, relative to the cut-out
    const pins = [[443, 88], [272, 240], [489, 285], [676, 232], [760, 290], [752, 398], [706, 452], [637, 530], [517, 452], [175, 345], [202, 402], [669, 633]]
      .map(([x, y]) => [x - (box.left - 665) * K, y - box.top * K]);
    const pin = ([x, y]) => `<path d="M${x} ${y + 34}C${x - 9} ${y + 20} ${x - 18} ${y + 12} ${x - 18} ${y}a18 18 0 1 1 36 0c0 12-9 20-18 34Z" fill="#0b5a1c"/><circle cx="${x}" cy="${y}" r="6.5" fill="#fff"/>`;
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}">${pins.map(pin).join("")}</svg>`);
    const info2 = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).composite([{ input: svg }]).webp({ quality: 92, alphaQuality: 100 }).toFile(out("ui", "australia-map-v2.webp"));
    console.log(`australia-map-v2.webp ${info2.width}x${info2.height}`);
  }
}

// ---- 6. Match box map WITHOUT pins, to sit behind the words "Australia Wide" (owner's picture "match box map label
//         design.png"). The picture is tiny, so only its outline is used: enlarged, given a clean edge and filled with
//         the same mint green (lighter in the middle, as drawn). The words are real text on the page, not part of the file.
{
  const design = path.join(SRC, "match box map label design.png");
  if (fs.existsSync(design)) {
    const K = 6;
    const box = { left: 11, top: 8, width: 109, height: 104 };
    const { data, info } = await sharp(design).extract(box).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const ink = Buffer.alloc(info.width * info.height); // how far each pixel is from white (the map and its lettering)
    for (let i = 0, j = 0; i < data.length; i += 3, j++) ink[j] = Math.min(255, (255 - Math.min(data[i], data[i + 1], data[i + 2])) * 4);
    const W = info.width * K, H = info.height * K;
    const soft = await sharp(ink, { raw: { width: info.width, height: info.height, channels: 1 } }).resize({ width: W, height: H, kernel: "cubic" }).blur(2.2).raw().toBuffer({ resolveWithObject: true });
    const step = soft.info.channels; // sharp may hand back more than one channel
    const alpha = Buffer.alloc(W * H);
    for (let i = 0; i < W * H; i++) alpha[i] = Math.max(0, Math.min(255, (soft.data[i * step] - 96) * 6)); // clean, slightly soft edge
    // the lettering in the supplied picture leaves pale specks in the middle of the map: fill that area solid
    for (let y = 190; y < 385; y++) for (let x = 100; x < 562; x++) alpha[y * W + x] = 255;
    const fill = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="46%" r="62%"><stop offset="0" stop-color="#d3f8d6"/><stop offset="0.62" stop-color="#bff5cb"/><stop offset="1" stop-color="#93e9b4"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)).removeAlpha().raw().toBuffer();
    const info2 = await sharp(fill, { raw: { width: W, height: H, channels: 3 } }).joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } }).webp({ quality: 92, alphaQuality: 100 }).toFile(out("ui", "australia-map-v3.webp"));
    console.log(`australia-map-v3.webp ${info2.width}x${info2.height}`);
  }
}
