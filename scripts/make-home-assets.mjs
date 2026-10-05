// Converts the owner's home page photos and icons (in "hero section/") into small web files in public/images/home/.
// Run: node scripts/make-home-assets.mjs
import fs from "node:fs";
import sharp from "sharp";

const SRC = "hero section/";
const OUT = "public/images/home/";
fs.mkdirSync(OUT + "icons", { recursive: true });

const photos = {
  "Untitledr44w3r4wr.png": "tradie-van",
  "hjyhjyhjy.png": "woman-laptop-home",
  "rthytryrytr.png": "woman-laptop-office",
  "tghtg.png": "couple-laptop",
  "fesesf.png": "house-front",
  "fwefwf.png": "client-meeting",
  "5y46y44.png": "city-desk-laptop",
  "uryuyu.png": "cafe-owner-man",
  "ewrwr.png": "cafe-owner-woman",
  "hrthrthrt.png": "rural-couple-portrait",
  "gtgeg.png": "rural-couple-fence",
  "hgjghjg.png": "retirees-coast",
  "Untitled.png": "family-walk",
  "rewsderwds.png": "couple-house",
  "frwwerewf.png": "team-meeting",
  "ukuykj.png": "market-team",
  "yjhrhgfdh.png": "family-table",
  "uyykiyu.png": "coast",
  "4.png": "tradie-drill-ute",
  "10.png": "woman-phone-sofa",
  "11.png": "accountant-client-desk",
  "12.png": "australia-map-pin",
};

const icons = {
  "save-time(1).png": "clock",
  "save-money(1).png": "wallet",
  "matched-to-you(1).png": "people",
  "wealth-advice(1).png": "bar-chart",
  "check.png": "check",
  "three-people-original-shape.png": "three-people-circle",
  "location-pin-original-shape.png": "pin-circle",
  "local-match(1).png": "pin-outline",
  "right-arrow(1).png": "arrow",
};

for (const [file, name] of Object.entries(photos)) {
  const info = await sharp(SRC + file)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(`${OUT}${name}.webp`);
  console.log(`${name}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}
for (const [file, name] of Object.entries(icons)) {
  if (!fs.existsSync(SRC + file)) { console.log("missing", file); continue; }
  const info = await sharp(SRC + file).trim().resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}icons/${name}.webp`);
  console.log(`icons/${name}.webp ${Math.round(info.size / 1024)}KB`);
}

// ---- logo 3 (owner, 4 Oct 2026, replaces logo 2): white background made transparent, trimmed, saved as logo-v7
{
  const { data, info } = await sharp(SRC + "logo 3.png").removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    let a = (255 - Math.min(r, g, b)) / 255;
    a = a < 0.06 ? 0 : Math.min(1, a * 1.35);
    if (a === 0) { rgba[j] = 255; rgba[j + 1] = 255; rgba[j + 2] = 255; rgba[j + 3] = 0; continue; }
    const un = (c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a)));
    rgba[j] = un(r); rgba[j + 1] = un(g); rgba[j + 2] = un(b); rgba[j + 3] = Math.round(a * 255);
  }
  const clear = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toBuffer();
  const meta = await sharp(clear).metadata();
  for (const w of [1200, 680]) await sharp(clear).resize({ width: w }).webp({ quality: 90, alphaQuality: 100 }).toFile(`public/images/brand/logo-v7-${w}.webp`);
  console.log(`logo 3: ${meta.width}x${meta.height} -> logo-v7-1200.webp (height ${Math.round((1200 * meta.height) / meta.width)})`);
}

// ---- link-sharing preview (1200x630) rebuilt with logo 3
{
  const mark = await sharp("public/images/brand/logo-v7-1200.webp").resize({ width: 960 }).png().toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#ffffff" } })
    .composite([{ input: mark, gravity: "center" }]).png({ compressionLevel: 9 }).toFile("public/images/brand/og-default.png");
  console.log("og-default.png rebuilt with logo 3");
}

// ---- home page logo (owner, 4 Oct 2026): vector "vectorizer-io_freesample.svg" -> public/images/brand/logo-home.svg
//      the off-white background layer is removed and the canvas is trimmed tightly around the logo
{
  let svg = fs.readFileSync(SRC + "vectorizer-io_freesample.svg", "utf8");
  const bg = svg.indexOf('fill="rgb(246,248,249)"');
  if (bg !== -1) {
    const start = svg.lastIndexOf("<g ", bg);
    const end = svg.indexOf("</g></g>", start) + "</g></g>".length;
    svg = svg.slice(0, start) + svg.slice(end);
  }
  const OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21700 7250" width="2170" height="725">';
  svg = svg.replace(/<svg[^>]*>/, OPEN).replace(/ style="[^"]*"/g, "").replace(/ id="[^"]*"/g, "");
  // measure the drawn area at 1px = 10 canvas units
  const { info } = await sharp(Buffer.from(svg), { density: 72 }).trim().toBuffer({ resolveWithObject: true });
  const pad = 20; // a hair of breathing room (canvas units) so no stroke edge is clipped
  const x = -info.trimOffsetLeft * 10 - pad, y = -info.trimOffsetTop * 10 - pad, w = info.width * 10 + 2 * pad, h = info.height * 10 + 2 * pad;
  svg = svg.replace(OPEN, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${Math.round(w / 10)}" height="${Math.round(h / 10)}">`);
  fs.writeFileSync("public/images/brand/logo-home.svg", svg);
  console.log(`logo-home.svg ${Math.round(w / 10)}x${Math.round(h / 10)} ${Math.round(svg.length / 1024)}KB`);
}

// ---- hero trust icon "thumbs up": rebuilt with breathing room so the fingers and cuff are not cut off (owner, 4 Oct 2026)
{
  const art = await sharp(SRC + "Untitled4.png").trim().toBuffer();
  const m = await sharp(art).metadata();
  const side = Math.round(Math.max(m.width, m.height) * 1.12);
  const padded = await sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: art, gravity: "center" }]).png().toBuffer();
  await sharp(padded).resize(160, 160).webp({ quality: 90, alphaQuality: 100 }).toFile("public/images/ui/hero-thumb-v2.webp");
  console.log("ui/hero-thumb-v2.webp");
}

// ---- home page hero picture for phones and tablets (owner, 4 Oct 2026)
{
  const info = await sharp(SRC + "mobile hero.png").webp({ quality: 88 }).toFile("public/images/hero/mobile-v1-1536.webp");
  console.log(`hero/mobile-v1-1536.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}

// ---- home page hero picture for tablets, laptops and desktops (owner, 4 Oct 2026): "hero no writing.png", near-lossless
{
  const info = await sharp(SRC + "hero no writing.png").removeAlpha().webp({ quality: 96, effort: 6 }).toFile("public/images/hero/home-desk-v2-1983.webp");
  console.log(`hero/home-desk-v2-1983.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}

// ---- site-wide logo (owner, 4 Oct 2026): "svg logo.svg" replaces logo-v7
{
  const info = await sharp(SRC + "svg logo.svg").resize({ width: 1200 }).webp({ quality: 90, alphaQuality: 100 }).toFile("public/images/brand/logo-v8-1200.webp");
  console.log(`brand/logo-v8-1200.webp ${info.width}x${info.height}`);
  await sharp(SRC + "svg logo.svg").resize({ width: 680 }).webp({ quality: 90, alphaQuality: 100 }).toFile("public/images/brand/logo-v8-680.webp");
  console.log(`brand/logo-v8-680.webp`);
  // Also copy the SVG itself for the home page/footer
  require("fs").copyFileSync(path.join(SRC, "svg logo.svg"), "public/images/brand/logo-svg.svg");
  console.log("brand/logo-svg.svg (for home page)");
}
