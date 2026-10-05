// Second extraction pass: keeps the STRUCTURE of every old page (headings, paragraphs with their
// links, lists, link/button labels, and which items sit together in the same card or grid), so the
// new design can lay the very same words out in a new way. No words are retyped by hand.
//
// Output: data/structured/<slug>.json  — { path, sections:[{id, tag, nodes:[...]}], fixed:[...] }
//
// Node types:  h {l,html,text}  p {html,text}  list {ordered,items:[{html,text}]}
//              link {href,text}  button {text}  text {html,text}  table {rows}  img {src,alt}
// Every node also carries  c (card id) and g (grid id) — nodes sharing a grid but with different
// card ids were separate boxes side by side in the old design.
//
// Run:  node scripts/extract-structure.mjs      (after `npm run extract` has built .work/source-build/dist)

import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, ".work", "source-build", "dist");
const OUT = path.join(ROOT, "data", "structured");
const PORT = 4174;
const CONCURRENCY = 4;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml" };
const serve = () =>
  http.createServer((req, res) => {
    let f = path.join(DIST, decodeURIComponent(req.url.split("?")[0]));
    if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, "index.html");
    res.setHeader("Content-Type", MIME[path.extname(f)] || "application/octet-stream");
    fs.createReadStream(f).pipe(res);
  }).listen(PORT);

const slugOf = (p) => (p === "/" ? "_home" : p.replace(/^\/|\/$/g, "").replace(/[\/?=&]/g, "__"));

// ---- runs inside the browser ------------------------------------------------------------------
async function inPage() {
  const INLINE = new Set(["A", "STRONG", "B", "EM", "I", "SPAN", "BR", "SUP", "SUB", "SMALL", "MARK", "U", "ABBR", "TIME", "CODE", "WBR"]);
  const SKIP = new Set(["SCRIPT", "STYLE", "SVG", "NOSCRIPT", "TEMPLATE", "PATH", "LINE", "POLYLINE", "CIRCLE", "RECT", "G", "DEFS", "LINEARGRADIENT", "STOP"]);
  const SECTION_TAGS = new Set(["SECTION", "HEADER", "FOOTER", "MAIN", "ARTICLE", "ASIDE", "NAV"]);
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const norm = (s) => s.replace(/\s+/g, " ").trim();

  // An element counts as inline only if it is an inline tag AND is actually displayed inline
  // (a <span> styled as a block is treated as a block, so card layouts keep their structure).
  const isInlineEl = (el) => INLINE.has(el.tagName) && /^inline/.test(getComputedStyle(el).display);
  const hidden = (el) => {
    const cs = getComputedStyle(el);
    return cs.display === "none" || cs.visibility === "hidden";
  };
  const fixedPos = (el) => getComputedStyle(el).position === "fixed";

  // Inline HTML limited to links, strong, em and line breaks.
  function inlineHtml(el, inHeading = /^H[1-6]$/.test(el.tagName)) {
    let out = "";
    for (const n of el.childNodes) {
      if (n.nodeType === 3) out += esc(n.textContent);
      else if (n.nodeType === 1) {
        if (SKIP.has(n.tagName.toUpperCase()) || hidden(n)) continue;
        const t = n.tagName;
        if (t === "BR") out += "<br>";
        else if (t === "A") out += `<a href="${esc(n.getAttribute("href") || "")}">${inlineHtml(n)}</a>`;
        else if (t === "STRONG" || t === "B") out += `<strong>${inlineHtml(n)}</strong>`;
        else if (t === "EM" || t === "I") out += `<em>${inlineHtml(n)}</em>`;
        else {
          // A block-level child (e.g. a <span> styled display:block) needs a space (or a line break in
          // headings) around it, otherwise neighbouring words run together ("anAccountant").
          const d = getComputedStyle(n).display;
          const blocky = !/^inline/.test(d) && d !== "contents";
          const inner = inlineHtml(n, inHeading);
          const sep = blocky ? (inHeading ? "<br>" : " ") : "";
          out += sep + inner + sep;
        }
      }
    }
    return out
      .replace(/[ \t\r\n]+/g, " ")
      .replace(/ ?<br> ?/g, "<br>")
      .replace(/(<br>){2,}/g, "<br>")
      .replace(/^(<br>)+|(<br>)+$/g, "")
      .trim();
  }
  const textOf = (el) => norm(el.innerText || el.textContent || "");
  // The separate visible pieces of text inside an element (e.g. a tile's title and its description).
  const leafParts = (el) => {
    const leaves = [...el.querySelectorAll("*")].filter(
      (e) => !SKIP.has(e.tagName.toUpperCase()) && !hidden(e) && ![...e.children].some((k) => !SKIP.has(k.tagName.toUpperCase()) && k.tagName !== "BR" && !/^inline/.test(getComputedStyle(k).display))
    );
    const parts = [...new Set(leaves.map(textOf).filter(Boolean))];
    return parts.length > 1 ? parts : undefined;
  };

  // Card / grid detection: an element is a "card" when it has 2+ siblings with the same tag and class.
  let cardCounter = 0, gridCounter = 0, sectionCounter = 0;
  const cardId = new WeakMap(), gridId = new WeakMap();
  function annotate(root) {
    for (const el of root.querySelectorAll("*")) {
      const p = el.parentElement;
      if (!p || SKIP.has(el.tagName.toUpperCase()) || el.tagName === "LI") continue;
      if (INLINE.has(el.tagName) || /^H[1-6]$/.test(el.tagName) || el.tagName === "P") continue;
      const same = [...p.children].filter((s) => s.tagName === el.tagName && s.className === el.className);
      if (same.length >= 2 && textOf(el)) {
        if (!gridId.has(p)) gridId.set(p, ++gridCounter);
        cardId.set(el, ++cardCounter);
      }
    }
  }

  // FAQ accordions: open every question one at a time (some close each other) and remember its answer.
  // Handles Radix accordions (button + aria-controls panel) and the site's own <dl><dt><button>/<dd> lists.
  const faqAnswers = new Map();
  const answerFor = (btn) => {
    const id = btn.getAttribute("aria-controls");
    if (id) return document.getElementById(id);
    const dt = btn.closest("dt");
    const dd = dt?.nextElementSibling;
    if (dd && dd.tagName === "DD") return dd;
    // <div><button>Question?</button><div>Answer</div></div>
    const sib = btn.nextElementSibling;
    return sib && sib.tagName !== "BUTTON" ? sib : null;
  };
  const faqButtons = [...document.querySelectorAll("#root button")].filter((b) => b.hasAttribute("aria-controls") || b.closest("dt") || textOf(b).endsWith("?"));
  for (const btn of faqButtons) {
    let panel = answerFor(btn);
    if (!panel || hidden(panel) || !textOf(panel)) {
      btn.click();
      await new Promise((r) => setTimeout(r, 160));
      panel = answerFor(btn);
    }
    if (panel && textOf(panel)) faqAnswers.set(btn, { html: inlineHtml(panel), text: textOf(panel) });
  }

  const nodes = [];
  const fixed = [];
  let cur = { id: 0, tag: "loose" };
  const ctx = { card: null, grid: null };

  const base = () => ({ s: cur.id, c: ctx.card, g: ctx.grid });
  const push = (n) => nodes.push({ ...base(), ...n });

  function walk(el) {
    for (const child of el.children) {
      const T = child.tagName;
      if (SKIP.has(T.toUpperCase())) continue;
      if (hidden(child)) continue;
      if (fixedPos(child)) { const t = textOf(child); if (t) fixed.push(t); continue; }
      if (T === "IMG") { push({ t: "img", src: child.currentSrc || child.getAttribute("src"), alt: child.getAttribute("alt") }); continue; }

      const savedCard = ctx.card, savedGrid = ctx.grid, savedSec = cur;
      if (cardId.has(child)) { ctx.card = cardId.get(child); ctx.grid = gridId.get(child.parentElement) ?? ctx.grid; }
      if (SECTION_TAGS.has(T) && ["SECTION", "HEADER", "FOOTER", "MAIN", "ARTICLE", "ASIDE"].includes(T)) {
        cur = { id: ++sectionCounter, tag: T.toLowerCase() };
        nodes.push({ t: "sec", s: cur.id, tag: cur.tag, id: child.id || null });
      }

      if (/^H[1-6]$/.test(T)) push({ t: "h", l: Number(T[1]), html: inlineHtml(child), text: textOf(child) });
      else if (T === "P") { const html = inlineHtml(child); if (html) push({ t: "p", html, text: textOf(child) }); }
      else if (T === "UL" || T === "OL") {
        const items = [...child.children].filter((li) => li.tagName === "LI" && !hidden(li)).map((li) => ({ html: inlineHtml(li), text: textOf(li) })).filter((i) => i.text);
        if (items.length) push({ t: "list", ordered: T === "OL", items });
      } else if (T === "TABLE") {
        push({ t: "table", rows: [...child.querySelectorAll("tr")].map((tr) => [...tr.children].map((c) => textOf(c))) });
      } else if (T === "A" && [...child.querySelectorAll("*")].every((e) => SKIP.has(e.tagName.toUpperCase()) || isInlineEl(e))) {
        const t = textOf(child);
        if (t) push({ t: "link", href: child.getAttribute("href"), text: t, html: inlineHtml(child), parts: leafParts(child) });
      } else if (T === "A") {
        // A whole card wrapped in a link: keep its href on the card by emitting a marker, then recurse.
        push({ t: "cardlink", href: child.getAttribute("href") });
        walk(child);
      } else if (T === "BUTTON") {
        const t = textOf(child);
        if (faqAnswers.has(child)) { const a = faqAnswers.get(child); push({ t: "faq", q: t, a: a.html, aText: a.text }); }
        else if (t) {
          // `parts` = the button's separate pieces of text (e.g. a card's title and its description)
          const leaves = [...child.querySelectorAll("*")].filter(
            (e) => !SKIP.has(e.tagName.toUpperCase()) && ![...e.children].some((k) => !SKIP.has(k.tagName.toUpperCase()) && k.tagName !== "BR" && !/^inline/.test(getComputedStyle(k).display))
          );
          push({ t: "button", text: t, lines: (child.innerText || "").split("\n").map(norm).filter(Boolean), parts: leaves.map(textOf).filter(Boolean) });
        }
      } else if (["INPUT", "SELECT", "TEXTAREA", "LABEL", "FORM"].includes(T)) {
        if (T === "LABEL") { const t = textOf(child); if (t) push({ t: "label", text: t }); }
        else if (T === "FORM") walk(child);
        else push({ t: "field", type: child.getAttribute("type") || T.toLowerCase(), placeholder: child.getAttribute("placeholder"), name: child.getAttribute("name") });
      } else {
        // Generic container: if everything inside is inline, treat it as one text node; otherwise recurse.
        const kids = [...child.children].filter((k) => !SKIP.has(k.tagName.toUpperCase()) && !hidden(k));
        const allInline = kids.every((k) => isInlineEl(k));
        const directText = [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (kids.length === 0 || (allInline && (directText || kids.length))) {
          const html = inlineHtml(child);
          if (textOf(child)) push({ t: "text", html, text: textOf(child), parts: leafParts(child) });
        } else {
          // Mixed: capture loose direct text nodes first (rare), then recurse into the elements.
          if (directText) {
            const loose = [...child.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => norm(n.textContent)).join(" ");
            if (loose) push({ t: "text", html: esc(loose), text: loose });
          }
          walk(child);
        }
      }
      ctx.card = savedCard; ctx.grid = savedGrid;
      if (!(SECTION_TAGS.has(T))) cur = savedSec; else cur = savedSec;
    }
  }

  const root = document.querySelector("#root");
  annotate(root);
  walk(root);
  return { nodes, fixed };
}

async function expandAll(page) {
  for (let r = 0; r < 4; r++) {
    const n = await page.evaluate(() => {
      const els = [...document.querySelectorAll('#root button[aria-expanded="false"][data-state="closed"], #root [data-radix-collection-item][data-state="closed"]')];
      els.forEach((e) => e.click());
      return els.length;
    });
    if (!n) break;
    await page.waitForTimeout(250);
  }
}

async function main() {
  const index = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "extracted", "index.json"), "utf8"));
  let todo = index.filter((i) => !i.error).map((i) => i.path);
  if (process.env.ONLY) todo = todo.filter((p) => process.env.ONLY.split(",").map((x) => (x === "home" ? "/" : x.startsWith("/") ? x : "/" + x)).includes(p));
  fs.mkdirSync(OUT, { recursive: true });
  const server = serve();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let next = 0, done = 0;
  async function worker() {
    while (next < todo.length) {
      const p = todo[next++];
      const page = await ctx.newPage();
      const rec = { path: p };
      try {
        await page.goto(`http://localhost:${PORT}${p}`, { waitUntil: "networkidle", timeout: 45000 });
        await page.waitForFunction(() => (document.querySelector("#root")?.textContent || "").trim().length > 300, null, { timeout: 15000 });
        await page.waitForTimeout(1200);
        Object.assign(rec, await page.evaluate(inPage));
        // Second pass at phone width: captures content that only exists in the mobile layout.
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForTimeout(900);
        const m = await page.evaluate(inPage);
        rec.mobile = m.nodes;
      } catch (e) { rec.error = String(e.message || e); }
      await page.close();
      fs.writeFileSync(path.join(OUT, slugOf(p) + ".json"), JSON.stringify(rec));
      console.log(`${String(++done).padStart(3)}/${todo.length} ${p}${rec.error ? " ERROR " + rec.error.slice(0, 120) : ""}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();
  server.close();
  console.log("Done.");
}
main();
