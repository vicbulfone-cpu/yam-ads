// Takes screenshots of pages of the running site at phone, tablet and desktop widths.
//   node scripts/shots.mjs <outDir> <port> <path>[,<path>...] [widths e.g. 375,768,1280] [full|top]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
const [, , outDir, port, paths, widthsArg = "375,768,1280", mode = "full"] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const w of widthsArg.split(",").map(Number)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 812 : w < 1000 ? 1024 : 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
  for (const p of paths.split(",")) {
    const url = `http://localhost:${port}${p === "home" ? "/" : p.startsWith("/") ? p : "/" + p}`;
    const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(1200);
    // scroll through so lazy images and scroll animations render
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const name = (p === "home" || p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "_")) + `-${w}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: mode === "full" });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(w, p, resp?.status(), "height", h, over > 1 ? "HORIZONTAL OVERFLOW " + over + "px" : "ok", errors.length ? "ERRORS: " + errors.join(" | ") : "");
    errors.length = 0;
  }
  await ctx.close();
}
await browser.close();
