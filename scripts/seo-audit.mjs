// SEO audit: crawls every page in the sitemap on a running site and checks the basics.
//   npm run build && npx next start -p 3300      (in another window)
//   node scripts/seo-audit.mjs http://localhost:3300 [--write]     (--write saves docs/seo-report.md)
// Checks per page: 200 status, title, meta description, self-referencing canonical, robots tag, one H1 (report only),
// lang="en-AU", server-rendered content, valid JSON-LD, visible FAQ/schema parity, Open Graph + Twitter tags, images without alt attribute, broken internal links, no localhost
// addresses; then robots.txt, sitemap, llms.txt, lowercase redirects and a real 404.
import fs from "node:fs";
import { applyWording } from "../src/content/wording.ts";
import { MATCH_CARD_COPY } from "../src/content/match-card-copy.ts";
import { HERO_COPY } from "../src/content/hero-copy.ts";

const BASE = (process.argv[2] || "http://localhost:3300").replace(/\/$/, "");
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://youraccountantmatch.com.au";
const write = process.argv.includes("--write");

const get = (p, opt = {}) => fetch(BASE + p, { redirect: "manual", ...opt });
const text = async (p) => (await get(p)).text();

const sitemapXml = await text("/sitemap.xml");
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const paths = urls.map((u) => new URL(u).pathname);
const known = new Set(paths);
const redirectsSeen = new Map();
const norm = (t) => t.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;|&rsquo;|’/g, "'").replace(/[^a-z0-9]/gi, "").toLowerCase();
const plainText = (html) => html
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/<\/(?:p|div|li|ul|ol|h[1-6]|summary|section|article)>/gi, " ")
  .replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, "\"")
  .replace(/&#x27;|&#39;|&rsquo;|’/g, "'")
  .replace(/\s+/g, " ")
  .trim();
const slugFile = (p) => "data/extracted/pages/" + (p === "/" ? "_home" : p.replace(/^\//, "").replace(/\//g, "__")) + ".json";
const outline = { extra: 0, missing: 0 };
const schemaCounts = { faq: 0, service: 0, breadcrumbs: 0 };
const copy = JSON.parse(fs.readFileSync("src/content/seo-copy.json", "utf8"));
const BANNED = [/only one accountant/i, /one vetted/i, /one suitable/i, /peak bodies/i, /where the firm lodges/i, /introduces one participating/i];

const problems = []; // hard failures
const notes = []; // report-only
const add = (arr, p, msg) => arr.push({ p, msg });
const titles = new Map();
const descs = new Map();
let linkCount = 0;

for (const p of paths) {
  const res = await get(p);
  if (res.status !== 200) { add(problems, p, `status ${res.status}`); continue; }
  const h = await res.text();
  const one = (re) => (h.match(re) || [])[1];
  const title = one(/<title>([^<]*)<\/title>/);
  const desc = one(/<meta name="description" content="([^"]*)"/);
  const canon = one(/<link rel="canonical" href="([^"]*)"/);
  const robots = one(/<meta name="robots" content="([^"]*)"/);
  if (!title) add(problems, p, "no title");
  if (!desc) add(problems, p, "no meta description");
  if ((canon || "").replace(/\/$/, "") !== (SITE + (p === "/" ? "" : p))) add(problems, p, `canonical is ${canon}`);
  if (/noindex/i.test(robots || "")) add(problems, p, "page is noindex but listed in sitemap");
  if (!/<html[^>]*lang="en-AU"/.test(h)) add(problems, p, "html lang is not en-AU");
  if (/localhost/.test(h)) add(problems, p, "contains a localhost address");
  if (!/property="og:title"/.test(h) || !/property="og:image"/.test(h) || !/name="twitter:card"/.test(h)) add(problems, p, "missing Open Graph / Twitter tags");
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!ld.length) add(problems, p, "no JSON-LD");
  let graph = [];
  for (const m of ld) {
    try {
      const parsed = JSON.parse(m[1]);
      const g = parsed["@graph"] || [];
      graph.push(...g);
      const types = g.map((n) => n["@type"]);
      if (!types.includes("Organization") || !types.includes("WebSite")) add(problems, p, "JSON-LD missing Organization/WebSite");
      if (types.some((t) => /LocalBusiness|ProfessionalService/.test(t))) add(problems, p, "JSON-LD uses a LocalBusiness type");
    } catch { add(problems, p, "invalid JSON-LD"); }
  }
  const organization = graph.find((n) => n["@type"] === "Organization");
  if (organization?.slogan !== "Smarter Matching. Better Outcomes.") add(problems, p, "Organization schema is missing the approved slogan");
  const service = graph.find((n) => n["@type"] === "Service");
  if (/^\/(accountant\/|locations\/|industry\/)/.test(p) || p === "/") {
    if (!service) add(problems, p, "missing accountant matching Service schema");
  }
  if (service) {
    schemaCounts.service++;
    if (service.provider?.["@id"] !== `${SITE}/#organization`) add(problems, p, "Service provider is not Your Accountant Match");
  }
  const crumbs = graph.find((n) => n["@type"] === "BreadcrumbList");
  if (p !== "/" && !crumbs) add(problems, p, "missing BreadcrumbList schema");
  if (crumbs) schemaCounts.breadcrumbs++;
  const faq = graph.find((n) => n["@type"] === "FAQPage");
  // where a page marks its FAQ questions (data-faq-question), only those boxes are FAQs; other open/close boxes on the
  // page (e.g. the home page's "How we select accountants" checks) are not
  const allDetails = [...h.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/gi)].map((m) => m[1]);
  const markedDetails = allDetails.filter((d) => /\bdata-faq-question\b/.test(d));
  const faqDetails = markedDetails.length ? markedDetails : allDetails;
  const summaryCount = markedDetails.length || [...h.matchAll(/<summary\b/g)].length;
  if (faq) {
    schemaCounts.faq++;
    if (!faq.mainEntity?.length || faq.mainEntity.length !== summaryCount) add(problems, p, `FAQ schema has ${faq.mainEntity?.length ?? 0} answers but ${summaryCount} visible questions`);
    const visibleFaqs = faqDetails.map((detail) => {
      // a card may hold extra visible text (number, short line); then the question and answer are the elements marked
      // data-faq-question / data-faq-answer, and only those are compared with the FAQPage structured data
      const marked = (attr, html) => (html.match(new RegExp(`<([a-z0-9]+)\\b[^>]*\\b${attr}\\b[^>]*>([\\s\\S]*?)<\\/\\1>`, "i")) || [])[2];
      const summaryHtml = (detail.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i) || [])[1] || "";
      const summary = marked("data-faq-question", summaryHtml) ?? summaryHtml;
      const answer = marked("data-faq-answer", detail) ?? detail.slice(detail.indexOf("</summary>") + "</summary>".length);
      return { question: norm(plainText(summary)), answer: norm(plainText(answer)) };
    });
    for (const [i, entry] of (faq.mainEntity || []).entries()) {
      const visible = visibleFaqs[i];
      if (!visible || norm(entry.name || "") !== visible.question || norm(entry.acceptedAnswer?.text || "") !== visible.answer) {
        add(problems, p, `FAQ question/answer ${i + 1} differs from its visible text`);
      }
    }
  } else if (summaryCount > 0) {
    add(problems, p, `${summaryCount} visible FAQ questions have no FAQPage schema`);
  }
  if (/^\/accountant\/|^\/locations\/[^/]+$/.test(p) && !/aria-label="Quick answer"/.test(h)) add(problems, p, "missing server-rendered Quick Answer block");
  const sourceHreflang = JSON.parse(fs.readFileSync(slugFile(p), "utf8")).hreflang || [];
  for (const alt of sourceHreflang) {
    if (!h.includes(`hreflang="${alt.lang}"`) || !h.includes(`href="${alt.href.replace(/&/g, "&amp;")}"`)) add(problems, p, `missing hreflang alternate ${alt.lang}`);
  }
  const noAlt = (h.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (noAlt) add(problems, p, `${noAlt} image(s) with no alt attribute`);
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) add(notes, p, `${h1} H1 headings`);
  if (title) { titles.set(title, [...(titles.get(title) || []), p]); if (title.length > 60) add(notes, p, `title is ${title.length} characters`); }
  if (desc) { descs.set(desc, [...(descs.get(desc) || []), p]); if (desc.length > 160) add(notes, p, `meta description is ${desc.length} characters`); }

  // heading outline must match the old page (the design must not add or remove headings)
  if (p === "/how-we-select-accountants") { /* owner-supplied wording, checked by hand */ } else try {
    const src = JSON.parse(fs.readFileSync(slugFile(p), "utf8")).headings || [];
    const srcSet = new Set(src.map((x) => norm(applyWording(x.text))));
    // owner-approved heading wording (4 Oct 2026): the match box heading on every page, and the home page headline
    srcSet.add(norm(MATCH_CARD_COPY.title.before + MATCH_CARD_COPY.title.green + MATCH_CARD_COPY.title.after));
    if (p === "/") srcSet.add(norm(HERO_COPY.home.h1.before + HERO_COPY.home.h1.green + HERO_COPY.home.h1.after));
    if (copy[p]?.h1) { srcSet.add(norm(copy[p].h1.first + (copy[p].h1.highlight || "") + (copy[p].h1.second || ""))); }
    const got = [...h.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({ level: +m[1], text: norm(m[2]) })).filter((x) => x.text);
    const gotSet = new Set(got.map((x) => x.text));
    const srcList = [...srcSet];
    // a heading is also fine when the old page (phone version) has the same words with a longer ending
    const extra = got.filter((x) => !srcSet.has(x.text) && !srcList.some((s) => s.length > 15 && (x.text.startsWith(s) || s.startsWith(x.text))));
    const missing = src.filter((x) => norm(x.text) && !gotSet.has(norm(x.text)));
    if (extra.length) { outline.extra += extra.length; add(problems, p, `${extra.length} heading(s) not in the old page: ${extra.slice(0, 3).map((x) => "h" + x.level + " " + x.text.slice(0, 40)).join("; ")}`); }
    if (missing.length) { outline.missing += missing.length; add(notes, p, `${missing.length} old heading(s) not found in the new page: ${missing.slice(0, 2).map((x) => norm(x.text).slice(0, 40)).join("; ")}`); }
  } catch { /* no source data */ }
  // wording rules: the old "one match" / old credential phrases must be gone
  const visible = h.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ");
  for (const re of BANNED) if (re.test(visible)) add(problems, p, `old wording still present: ${re}`);
  const exp = copy[p];
  if (exp && (h.match(/<title>([^<]*)<\/title>/) || [])[1]?.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'") !== exp.title) add(problems, p, "title is not the rewritten title");
  // valid HTML basics: duplicate ids, one title / description, clean links (no tracking parameters in the HTML)
  const ids = [...h.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) add(problems, p, `duplicate id(s): ${[...new Set(dup)].slice(0, 3).join(", ")}`);
  if ((h.match(/<title>/g) || []).length !== 1 || (h.match(/<meta name="description"/g) || []).length !== 1) add(problems, p, "not exactly one title and one meta description");
  if (/href="[^"]*[?&](utm_[a-z]+|gclid|ref)=/i.test(h)) add(problems, p, "a link in the HTML carries a tracking parameter");
  // internal links
  for (const m of h.matchAll(/<a [^>]*href="(\/[^"#?]*)[^"]*"/g)) {
    linkCount++;
    const href = m[1].replace(/\/$/, "") || "/";
    if (known.has(href) || /^\/(_next|images|api|llms\.txt|sitemap\.xml|robots\.txt|how-we-select-accountants|questionnaire|match|accountant-demo)/.test(href)) continue;
    if (!redirectsSeen.has(href)) { const r = await get(href); redirectsSeen.set(href, r.status); }
    const st = redirectsSeen.get(href);
    if (st >= 400) add(problems, p, `broken internal link ${href} (${st})`);
    else if (st >= 300) add(notes, p, `internal link ${href} redirects (${st})`);
  }
}
for (const [t, ps] of titles) if (ps.length > 1) add(notes, ps.join(", "), `same title: "${t}"`);
for (const [d, ps] of descs) if (ps.length > 1) add(notes, ps.join(", "), `same meta description (${d.slice(0, 50)}…)`);

// site-level checks
const site = [];
const robotsTxt = await text("/robots.txt");
site.push(["robots.txt blocks /api/ and lists the sitemap", /Disallow: \/api\//.test(robotsTxt) && /Sitemap:/.test(robotsTxt)]);
site.push(["robots.txt names all required AI crawlers", ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Bingbot", "Applebot-Extended"].every((b) => robotsTxt.includes(b))]);
site.push(["robots.txt blocks hidden and noindex areas", ["/match", "/accountant-demo-x7k2", "/questionnaire"].every((p) => robotsTxt.includes(`Disallow: ${p}`))]);
const status = JSON.parse(fs.readFileSync("seo/index-status.json", "utf8"));
const wantIndexed = Object.keys(status).filter((p) => status[p] === "index" && !/^\/(match|accountant-demo|questionnaire)/.test(p)).sort();
site.push(["sitemap matches seo/index-status.json (index pages only)", JSON.stringify([...paths].sort()) === JSON.stringify(wantIndexed)]);
site.push(["sitemap excludes hidden and noindex routes", !paths.some((p) => /^\/(match|accountant-demo-x7k2|questionnaire|ghl-redirect)(\/|$)/.test(p))]);
site.push(["llms.txt exists", (await get("/llms.txt")).status === 200]);
const llmsTxt = await text("/llms.txt");
site.push(["llms.txt does not reveal hidden routes", !/accountant-demo-x7k2|\/match\/|\/questionnaire/.test(llmsTxt)]);
const gb = await fetch(BASE + "/how-it-works", { headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" } });
site.push(["Googlebot receives the real page (200, has its H1)", gb.status === 200 && /<h1/.test(await gb.text())]);
const bb = await fetch(BASE + "/how-it-works", { headers: { "User-Agent": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" } });
site.push(["Bingbot receives the real page (200)", bb.status === 200]);
const rq = await get("/How-It-Works?gclid=abc&utm_source=x");
site.push(["redirects keep gclid / utm query strings", (rq.headers.get("location") || "").includes("gclid=abc")]);
const up = await get("/How-It-Works");
site.push([`upper-case URL /How-It-Works redirects to lowercase (${up.status})`, [301, 308].includes(up.status) && (up.headers.get("location") || "").endsWith("/how-it-works")]);
for (const b of ["Amazonbot", "Applebot", "DuckAssistBot", "Meta-ExternalAgent", "MistralAI-User", "CCBot"]) site.push([`robots.txt names ${b}`, robotsTxt.includes(b)]);
const nf = await get("/no-such-page-xyz");
site.push(["unknown URL returns a real 404", nf.status === 404]);

const failed = site.filter((s) => !s[1]);
const lines = [];
lines.push(`# SEO audit — ${new Date().toISOString().slice(0, 10)}`, "", `Pages crawled (from sitemap): **${paths.length}** · internal links checked: ${linkCount}`, "");
lines.push(`Heading outline vs old pages: ${outline.extra} extra heading(s), ${outline.missing} old heading(s) not found.`, "");
lines.push(`Structured data totals: ${schemaCounts.service} Service pages · ${schemaCounts.breadcrumbs} BreadcrumbList pages · ${schemaCounts.faq} FAQPage blocks (visible answers checked).`, "");
lines.push(`## Result: ${problems.length + failed.length === 0 ? "PASS" : "FAIL"}`, "", `- Page problems: ${problems.length}`, `- Site-level failures: ${failed.length}`, `- Report-only notes (wording / titles, not changed): ${notes.length}`, "");
if (problems.length) { lines.push("## Problems", ""); for (const x of problems) lines.push(`- \`${x.p}\` — ${x.msg}`); lines.push(""); }
lines.push("## Site-level checks", "", ...site.map(([n, ok]) => `- ${ok ? "PASS" : "FAIL"} — ${n}`), "");
lines.push("## Recommendations for Vic (wording) — report only, nothing changed", "");
const group = {};
for (const x of notes) { const k = x.msg.replace(/\d+/g, "N").replace(/".*"/, "…").replace(/\(.*\)/, ""); (group[k] = group[k] || []).push(x); }
for (const [k, list] of Object.entries(group)) {
  lines.push(`### ${k} (${list.length})`, "");
  for (const x of list.slice(0, 60)) lines.push(`- \`${x.p}\` — ${x.msg}`);
  if (list.length > 60) lines.push(`- …and ${list.length - 60} more`);
  lines.push("");
}
const out = lines.join("\n");
console.log(out.split("\n").slice(0, 40).join("\n"));
console.log(`\nproblems=${problems.length} siteFailures=${failed.length} notes=${notes.length}`);
if (write) fs.writeFileSync("docs/seo-report.md", out);
process.exitCode = problems.length + failed.length ? 1 : 0;
