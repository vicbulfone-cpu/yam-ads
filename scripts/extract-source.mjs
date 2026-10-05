// Extracts every page of the OLD site (/source) so words are never retyped by hand.
//
// How it works:
//   1. Serves the already-built old site from .work/source-build/dist (a working copy of /source,
//      so /source itself is never touched) with a single-page-app fallback.
//   2. Visits every URL in the old sitemap (plus the extra routes in EXTRA_ROUTES) in a real browser.
//   3. Waits for the page to finish rendering, opens every collapsed accordion, then records:
//      URL, title, meta description, canonical, robots, hreflang, social tags, JSON-LD,
//      heading order, content blocks, images, internal links and the full text.
//   4. Writes data/extracted/pages/<slug>.json and data/extracted/index.json.
//
// Run:  npm run extract        (after building the working copy; see docs/plan.md)

import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, ".work", "source-build", "dist");
const SITEMAP = path.join(ROOT, "source", "public", "sitemap.xml");
const OUT = path.join(ROOT, "data", "extracted");
const PORT = 4173;
const CONCURRENCY = 4;

// Routes that exist in the old router but are not in the sitemap. They are recorded
// so the inventory is complete (they are classed as "excluded" later, not rebuilt).
const EXTRA_ROUTES = [
  "/ghl-redirect",
  "/admin-login",
  "/admin-dashboard",
  "/locations/rockhampton",
  "/locations/coffs-harbour",
  "/locations/wagga-wagga",
  "/locations/shepparton-mooroopna",
  "/locations/port-macquarie",
  "/locations/warragul-drouin",
  "/locations/traralgon-morwell",
  "/locations/dubbo",
  "/locations/wollongong",
  "/locations/ballarat",
  "/locations/bendigo",
  "/locations/shellharbour-area",
];

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml",
  ".woff2": "font/woff2", ".woff": "font/woff",
};

function serveDist() {
  return http
    .createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      let file = path.join(DIST, urlPath);
      if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        file = path.join(DIST, "index.html"); // single-page-app fallback
      }
      res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
      fs.createReadStream(file).pipe(res);
    })
    .listen(PORT);
}

function readSitemapPaths() {
  const xml = fs.readFileSync(SITEMAP, "utf8");
  const paths = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => {
    const u = new URL(m[1]);
    return u.pathname + u.search;
  });
  return [...new Set(paths)];
}

const slugOf = (p) => (p === "/" ? "_home" : p.replace(/^\/|\/$/g, "").replace(/[\/?=&]/g, "__"));

// Runs inside the browser page.
function inPage() {
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  const meta = (sel, attr = "content") => document.querySelector(sel)?.getAttribute(attr) ?? null;

  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
    level: Number(h.tagName[1]),
    text: clean(h.textContent),
  }));

  // Content blocks: each <section>, <article>, <header>, <main>, <footer> that is not nested in another block.
  const blockEls = [...document.querySelectorAll("#root header, #root section, #root article, #root footer, #root main, #root aside")];
  const topBlocks = blockEls.filter((el) => !blockEls.some((o) => o !== el && o.contains(el)));
  const blocks = topBlocks.map((el, i) => ({
    index: i,
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    heading: clean(el.querySelector("h1,h2,h3")?.textContent) || null,
    images: el.querySelectorAll("img").length,
    text: clean(el.textContent),
  }));

  const images = [...document.querySelectorAll("#root img")].map((img) => ({
    src: img.currentSrc || img.getAttribute("src"),
    alt: img.getAttribute("alt"),
    width: img.getAttribute("width"),
    height: img.getAttribute("height"),
  }));

  const links = [...document.querySelectorAll("#root a[href]")].map((a) => ({
    href: a.getAttribute("href"),
    text: clean(a.textContent),
  }));

  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
    try { return JSON.parse(s.textContent); } catch { return s.textContent; }
  });

  const root = document.querySelector("#root");
  return {
    finalPath: location.pathname + location.search,
    title: document.title,
    metaDescription: meta('meta[name="description"]'),
    canonical: meta('link[rel="canonical"]', "href"),
    robots: [...document.querySelectorAll('meta[name="robots"],meta[name="googlebot"]')].map((m) => m.getAttribute("content")),
    hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => ({ lang: l.getAttribute("hreflang"), href: l.getAttribute("href") })),
    og: Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map((m) => [m.getAttribute("property"), m.getAttribute("content")])),
    twitter: Object.fromEntries([...document.querySelectorAll('meta[name^="twitter:"]')].map((m) => [m.getAttribute("name"), m.getAttribute("content")])),
    jsonLd,
    headings,
    blocks,
    images,
    links,
    // textContent includes text hidden by CSS (e.g. mobile-only or desktop-only copies);
    // innerText is only what is visible at the 1440px desktop viewport used here.
    allText: clean(root?.textContent),
    visibleText: clean(root?.innerText),
  };
}

// Opens every collapsed accordion so hidden answers are captured too.
async function expandAll(page) {
  let opened = 0;
  for (let round = 0; round < 4; round++) {
    const n = await page.evaluate(() => {
      const els = [...document.querySelectorAll('#root button[aria-expanded="false"][data-state="closed"], #root [data-radix-collection-item][data-state="closed"]')];
      els.forEach((e) => e.click());
      return els.length;
    });
    if (!n) break;
    opened += n;
    await page.waitForTimeout(250);
  }
  return opened;
}

async function extractOne(context, base, pathname) {
  const page = await context.newPage();
  const started = Date.now();
  const result = { path: pathname, extractedAt: new Date().toISOString() };
  try {
    const resp = await page.goto(base + pathname, { waitUntil: "networkidle", timeout: 45000 });
    result.httpStatusOfShell = resp?.status() ?? null;
    await page.waitForFunction(() => (document.querySelector("#root")?.textContent || "").trim().length > 300, null, { timeout: 15000 });
    await page.waitForTimeout(1200); // let useDocumentMeta and lazy routes settle
    result.accordionsOpened = await expandAll(page);
    Object.assign(result, await page.evaluate(inPage));
    result.redirectedTo = result.finalPath !== pathname ? result.finalPath : null;
  } catch (e) {
    result.error = String(e.message || e);
  } finally {
    result.ms = Date.now() - started;
    await page.close();
  }
  return result;
}

async function main() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    console.error("Missing .work/source-build/dist — build the working copy first (see docs/plan.md).");
    process.exit(1);
  }
  const sitemapPaths = readSitemapPaths();
  const all = [...sitemapPaths, ...EXTRA_ROUTES.filter((p) => !sitemapPaths.includes(p))];
  const inSitemap = new Set(sitemapPaths);
  console.log(`Sitemap URLs: ${sitemapPaths.length}; extra routes: ${all.length - sitemapPaths.length}`);

  fs.mkdirSync(path.join(OUT, "pages"), { recursive: true });
  const server = serveDist();
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const base = `http://localhost:${PORT}`;

  const index = [];
  let next = 0;
  async function worker() {
    while (next < all.length) {
      const p = all[next++];
      const r = await extractOne(context, base, p);
      r.inSitemap = inSitemap.has(p);
      fs.writeFileSync(path.join(OUT, "pages", slugOf(p) + ".json"), JSON.stringify(r, null, 2));
      index.push({
        path: p, slug: slugOf(p), inSitemap: r.inSitemap, title: r.title ?? null, redirectedTo: r.redirectedTo ?? null,
        error: r.error ?? null, words: r.allText ? r.allText.split(" ").length : 0,
      });
      console.log(`${String(index.length).padStart(3)}/${all.length} ${p}${r.error ? "  ERROR " + r.error : ""}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  index.sort((a, b) => a.path.localeCompare(b.path));
  fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));

  await browser.close();
  server.close();
  console.log(`Done. ${index.length} pages, ${index.filter((i) => i.error).length} errors.`);
}

main();
