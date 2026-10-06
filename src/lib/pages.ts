// Routes for the scaled-back YAM ads site: the kept pages from the public page inventory plus the ad landing pages.
import fs from "node:fs";
import path from "node:path";

type TypeRow = { path: string; type: string };
const PAGE_ROWS = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "extracted", "page-types.json"), "utf8")) as TypeRow[];
const PRIVATE_PREFIXES = ["/api", "/match", "/accountant-demo-x7k2", "/questionnaire"];
const isPrivatePath = (p: string) => PRIVATE_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));

/** YAM ads is a scaled-back copy of the main site (owner, 5 Oct 2026). Only these content pages are kept from the old site;
 *  /how-we-select-accountants and /questionnaire have their own route files. Add a path here to bring a page back.
 *  /locations/melbourne was removed (owner, 6 Oct 2026) and permanently redirects to the home page (next.config.ts). */
const KEPT_PAGES = ["/", "/how-it-works", "/about", "/contact", "/privacy", "/terms"];

/** The four Google Ads landing pages (noindex, ad traffic only). `name` is each page's title (before
 *  " | Your Accountant Match") and its link text in the home page footer, so the two always match. */
export const AD_LANDING_PAGES = [
  { path: "/ad-1", name: "Find a Business Accountant Near You" },
  { path: "/ad-2", name: "Personal Tax Accountant Near You" },
  { path: "/ad-3", name: "SMSF & Wealth Accountant Near You" },
  { path: "/ad-4", name: "Business & Company Registration Help" },
];
export const AD_PAGES = AD_LANDING_PAGES.map((a) => a.path);
/** An ad landing page's name, from its path. */
export const adPageName = (p: string) => AD_LANDING_PAGES.find((a) => a.path === p)?.name ?? "";

/** Every content page the catch-all route builds. */
export const PAGE_PATHS: string[] = [
  ...PAGE_ROWS.map((r) => r.path).filter((p) => KEPT_PAGES.includes(p)),
  ...AD_PAGES,
];

const INDEXABLE_EXTRAS = ["/how-we-select-accountants"];
const PUBLIC_PAGE_PATHS = [...new Set([...PAGE_PATHS, ...INDEXABLE_EXTRAS])];

/** True when an internal link points at a page this site has; pages use it to leave out links to anything else. */
export const isLivePage = (href: string) => PUBLIC_PAGE_PATHS.includes(href.replace(/[?#].*$/, "").replace(/(.)\/$/, "$1"));

export type PageType = "homepage" | "city" | "industry-city" | "service" | "guide" | "article (blog)" | "other";

export function typeOf(p: string): PageType {
  if (p === "/") return "homepage";
  if (/^\/locations\/[^/]+$/.test(p)) return "city";
  if (/^\/industry\//.test(p)) return "industry-city";
  if (p.startsWith("/accountant/")) return "service";
  if (p.startsWith("/guide/")) return "guide";
  if (p.startsWith("/blog/")) return "article (blog)";
  return "other";
}

/** City slug for city and industry pages (used to pick the landmark picture). */
export function cityOf(p: string): string | null {
  let m = p.match(/^\/locations\/([^/]+)$/);
  if (m) return m[1];
  m = p.match(/^\/industry\/[^/]+\/([^/]+)$/);
  return m ? m[1] : null;
}

/** Extracted metadata retained from the old site, including any reciprocal language alternates. */
export function oldMeta(p: string) {
  const slug = p === "/" ? "_home" : p.replace(/^\/|\/$/g, "").replace(/[\/?=&]/g, "__");
  const file = path.join(process.cwd(), "data", "extracted", "pages", slug + ".json");
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as {
    title?: string;
    metaDescription?: string;
    canonical?: string;
    robots?: string[];
    hreflang?: { lang: string; href: string }[];
  };
}

/** seo/index-status.json (page path -> "index" | "noindex") is the ONE place that decides indexing.
 *  A page missing from the file falls back to the old site's robots tag. */
const STATUS_FILE = path.join(process.cwd(), "seo", "index-status.json");
const STATUS: Record<string, "index" | "noindex"> = fs.existsSync(STATUS_FILE) ? JSON.parse(fs.readFileSync(STATUS_FILE, "utf8")) : {};
const oldNoindex = (p: string) => Boolean(oldMeta(p)?.robots?.some((value) => /noindex/i.test(value)));
// ad landing pages are always noindex (ad traffic only), whatever the file says
export const isNoindex = (p: string) => isPrivatePath(p) || AD_PAGES.includes(p) || (STATUS[p] ? STATUS[p] === "noindex" : oldNoindex(p));

/** Built public pages that are allowed in search indexes and public discovery feeds. */
export const INDEXABLE_PATHS = PUBLIC_PAGE_PATHS.filter((p) => !isNoindex(p));

/** Every known path that is noindex (kept out of the sitemap; robots.txt blocks only the private areas). */
export const NOINDEX_PATHS = [...new Set([...PAGE_ROWS.map((r) => r.path), ...INDEXABLE_EXTRAS, ...Object.keys(STATUS)])].filter(isNoindex);
