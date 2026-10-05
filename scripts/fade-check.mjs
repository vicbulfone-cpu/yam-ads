// Run with the dev site on port 3217: node scripts/fade-check.mjs
// Business page: with vs without the new fades (line under headline + handwriting) and with vs without ALL fades.
// Reports: headline area changed; letters of headline / line / steps changed; arrow changed; fades visible.
import { chromium } from "playwright";
import sharp from "sharp";
const b = await chromium.launch();
const raw = async (buf) => { const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true }); return { data, w: info.width, ch: info.channels }; };
const px = (I, x, y) => { const i = (y * I.w + x) * I.ch; return [I.data[i], I.data[i + 1], I.data[i + 2]]; };
const diff = (p, q) => Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1]), Math.abs(p[2] - q[2]));
const ink = (q) => Math.max(q[0], q[1], q[2]) < 75; // solid centres of navy/dark-green letters
for (const [w, h] of [[1280, 800], [1366, 768], [1536, 864], [1920, 1080], [375, 812]]) {
  const pg = await b.newPage({ viewport: { width: w, height: h } });
  await pg.goto("http://localhost:3217/ad-1", { waitUntil: "networkidle" }); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
  const rect = (s) => pg.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: Math.floor(r.left), y: Math.floor(r.top + scrollY), w: Math.ceil(r.width), h: Math.ceil(r.height) }; }, s);
  const R = { h1: await rect(".bz-h1"), sub: await rect(".bz-sub"), st: await rect(".bz-steps"), sc: await rect(".bz-script") };
  const A = await raw(await pg.screenshot({ fullPage: true }));
  await pg.addStyleTag({ content: ".fade-behind::before, .fade-behind::after { display: none !important; }" }); await pg.waitForTimeout(200);
  const Z = await raw(await pg.screenshot({ fullPage: true })); // no fades at all
  const count = (r, f) => { let n = 0; for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) if (f(x, y)) n++; return n; };
  const areaChanged = (r) => count(r, (x, y) => diff(px(A, x, y), px(Z, x, y)) > 2);
  const inkChanged = (r) => count(r, (x, y) => ink(px(Z, x, y)) && diff(px(A, x, y), px(Z, x, y)) > 6);
  const arrowBox = { x: R.sc.x + Math.floor(R.sc.w * 0.35), y: R.sc.y, w: Math.floor(R.sc.w * 0.65) + 160, h: R.sc.h + 140 };
  const isArrow = (q) => q[1] > 70 && q[1] < 170 && q[0] < 70 && q[2] < 100 && q[1] > q[0] + 50;
  const arrowChanged = count(arrowBox, (x, y) => x < A.w && isArrow(px(Z, x, y)) && diff(px(A, x, y), px(Z, x, y)) > 2);
  console.log(`${w}x${h}: headline area changed ${areaChanged(R.h1)} | letters changed: headline ${inkChanged(R.h1)}, line ${inkChanged(R.sub)}, steps ${inkChanged(R.st)} | arrow changed ${arrowChanged} | fade behind line ${areaChanged(R.sub) > 50}, behind handwriting ${areaChanged(R.sc) > 50}`);
  await pg.close();
}
await b.close();
