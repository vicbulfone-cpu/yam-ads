// Proves a change looks the same: screenshots every page (and the open questionnaires) at phone, tablet and computer
// widths, then compares two sets pixel by pixel.
//   node scripts/visual-compare.mjs shoot <dir> [port]     e.g. shoot .work/vis-before 3300
//   node scripts/visual-compare.mjs compare <dirA> <dirB>
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
const [, , mode, a, b = "3300"] = process.argv;
const PAGES = ["/", "/locations/melbourne", "/how-it-works", "/about", "/contact", "/privacy", "/terms", "/how-we-select-accountants",
  "/questionnaire", "/accountant-demo-x7k2", "/ad-1", "/ad-2", "/ad-3", "/ad-4", "/match", "/no-such-page"];
const WIDTHS = [[375, 812], [768, 1024], [1280, 800], [1536, 864]];
if (mode === "shoot") {
  fs.mkdirSync(a, { recursive: true });
  const br = await chromium.launch();
  for (const [w, h] of WIDTHS) {
    const ctx = await br.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", deviceScaleFactor: 1 });
    const pg = await ctx.newPage();
    const shot = async (name) => { await pg.waitForTimeout(400); await pg.screenshot({ path: path.join(a, `${name}-${w}.png`), fullPage: true, animations: "disabled" }); };
    for (const p of PAGES) {
      await pg.goto(`http://localhost:${b}${p}`, { waitUntil: "networkidle" }); await pg.evaluate(() => document.fonts.ready);
      // load lazy pictures, then back to the top
      const H = await pg.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 700) { await pg.evaluate((v) => scrollTo(0, v), y); await pg.waitForTimeout(40); }
      await pg.evaluate(() => scrollTo(0, 0));
      await shot((p.replace(/\//g, "_") || "_home").replace(/^_$/, "_home"));
    }
    // questionnaires open: home (site questionnaire), business, personal, SMSF
    const open = async (p, start, name) => {
      await pg.goto(`http://localhost:${b}${p}`, { waitUntil: "networkidle" }); await pg.evaluate(() => document.fonts.ready);
      await pg.locator("[data-match-card] .mc-row").nth(1).click();
      await pg.locator(start).first().click();
      await pg.waitForSelector("dialog[open]"); await pg.waitForTimeout(700);
      await pg.screenshot({ path: path.join(a, `q-${name}-${w}.png`), animations: "disabled" });
    };
    await open("/", "[data-match-card] [data-match-start]", "home");
    await open("/ad-1", "[data-match-card] .mc-start", "ad1");
    await open("/ad-2", "[data-match-card] .mc-start", "ad2");
    await open("/ad-3", "[data-match-card] .mc-start", "ad3");
    await ctx.close();
  }
  await br.close();
  console.log("shot", fs.readdirSync(a).length, "screens into", a);
} else if (mode === "compare") {
  const files = fs.readdirSync(a).filter((f) => f.endsWith(".png"));
  let same = 0; const diffs = [];
  for (const f of files) {
    if (!fs.existsSync(path.join(b, f))) { diffs.push(`${f}: missing in ${b}`); continue; }
    const [A, B] = await Promise.all([a, b].map((d) => sharp(path.join(d, f)).raw().toBuffer({ resolveWithObject: true })));
    if (A.info.width !== B.info.width || A.info.height !== B.info.height) { diffs.push(`${f}: size ${A.info.width}x${A.info.height} -> ${B.info.width}x${B.info.height}`); continue; }
    let n = 0;
    for (let i = 0; i < A.data.length; i += A.info.channels) if (Math.abs(A.data[i] - B.data[i]) > 8 || Math.abs(A.data[i + 1] - B.data[i + 1]) > 8 || Math.abs(A.data[i + 2] - B.data[i + 2]) > 8) n++;
    if (n === 0) same++; else diffs.push(`${f}: ${n} pixels differ (${(n / (A.info.width * A.info.height) * 100).toFixed(3)}%)`);
  }
  console.log(`${same} of ${files.length} screens identical`);
  if (diffs.length) console.log(diffs.join("\n"));
}
