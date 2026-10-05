// Screenshot one section: node scripts/shot-section.mjs <out.png> <port> <path> <width> "<heading text>"
import { chromium } from "playwright";
const [, , out, port, p, w, text] = process.argv;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: Number(w), height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(`http://localhost:${port}${p === "home" ? "/" : p}`, { waitUntil: "networkidle" });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(50); }
const sec = page.locator("section", { has: page.locator("h2", { hasText: text }) }).first();
await sec.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await sec.screenshot({ path: out });
await b.close();
