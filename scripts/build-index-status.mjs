// Builds seo/index-status.json: the ONE file that decides which pages are indexed ("index") or not ("noindex").
// Sitemap, robots.txt, each page's robots tag and scripts/seo-audit.mjs all read it.
// First run seeds it from the old site's robots tags; later runs keep every value you changed and only add new pages.
// To take a page live or off: edit its value in seo/index-status.json, then run `npm run seo-status` (adds new pages) and rebuild.
// Only pages this site actually builds are listed (src/lib/pages.ts: the kept content pages and the ad landing pages);
// pages that no longer exist drop out. Ad landing pages are always noindex (ad traffic only).
import fs from "node:fs";
import { AD_PAGES, PAGE_PATHS } from "../src/lib/pages.ts";

const FILE = "seo/index-status.json";
const rows = JSON.parse(fs.readFileSync("data/extracted/page-types.json", "utf8"));
const SKIP = new Set(["admin (not rebuilt)", "questionnaire", "retired location (redirect)"]);
const ALWAYS_NOINDEX = ["/questionnaire", "/match", "/accountant-demo-x7k2", ...AD_PAGES];
const EXTRA_INDEX = ["/how-we-select-accountants"]; // has its own route file, not in PAGE_PATHS
const built = new Set([...PAGE_PATHS, ...EXTRA_INDEX]);
const prior = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : {};
const next = {};

const slug = (p) => (p === "/" ? "_home" : p.replace(/^\//, "").replace(/\//g, "__"));
for (const r of rows) {
  if (SKIP.has(r.type) || !built.has(r.path)) continue;
  const f = `data/extracted/pages/${slug(r.path)}.json`;
  const robots = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")).robots ?? [] : [];
  const seeded = robots.some((v) => /noindex/i.test(v)) ? "noindex" : "index";
  next[r.path] = prior[r.path] ?? seeded;
}
for (const p of EXTRA_INDEX) next[p] = prior[p] ?? "index";
for (const p of ALWAYS_NOINDEX) next[p] = "noindex"; // never indexable, whatever the file says
fs.writeFileSync(FILE, JSON.stringify(Object.fromEntries(Object.entries(next).sort()), null, 2) + "\n");
const n = Object.values(next);
console.log(`${FILE}: ${n.filter((v) => v === "index").length} index, ${n.filter((v) => v === "noindex").length} noindex`);
