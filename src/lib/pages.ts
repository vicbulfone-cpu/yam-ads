// Routes built from the public page inventory; retired, admin, and questionnaire records stay out of this list.
import fs from "node:fs";
import path from "node:path";

type TypeRow = { path: string; type: string };
const SKIP_TYPES = new Set(["admin (not rebuilt)", "questionnaire", "retired location (redirect)"]);
const PAGE_ROWS = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "extracted", "page-types.json"), "utf8")) as TypeRow[];
const PRIVATE_PREFIXES = ["/api", "/match", "/accountant-demo-x7k2", "/questionnaire"];
const isPrivatePath = (p: string) => PRIVATE_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));

/** Every page the site builds: all pages in data/extracted/page-types.json except the admin pages, the old questionnaire
 *  redirect and the 12 retired location pages (those 301 to their city, see REDIRECTS). The 13 city pages are the only city pages.
 *  /how-we-select-accountants has its own route file, so it is not part of the catch-all. */
export const PAGE_PATHS: string[] = PAGE_ROWS
  .filter((r) => !SKIP_TYPES.has(r.type) && r.path !== "/how-we-select-accountants" && !isPrivatePath(r.path))
  .map((r) => r.path);

const INDEXABLE_EXTRAS = ["/how-we-select-accountants"];
const PUBLIC_PAGE_PATHS = [...new Set([...PAGE_PATHS, ...INDEXABLE_EXTRAS])];

/** Old URLs that no longer have a page: permanent redirect straight to the final page (no chains). */
export const REDIRECTS: { source: string; destination: string }[] = PAGE_ROWS
  .filter((r) => r.type === "retired location (redirect)")
  .map((r) => {
    const j = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "extracted", "pages", r.path.replace(/^\//, "").replace(/\//g, "__") + ".json"), "utf8"));
    return { source: r.path, destination: (j.finalPath as string) || "/locations" };
  });

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
export const isNoindex = (p: string) => isPrivatePath(p) || (STATUS[p] ? STATUS[p] === "noindex" : oldNoindex(p));

/** Built public pages that are allowed in search indexes and public discovery feeds. */
export const INDEXABLE_PATHS = PUBLIC_PAGE_PATHS.filter((p) => !isNoindex(p));

/** Every known path that is noindex (kept out of the sitemap; robots.txt blocks only the private areas). */
export const NOINDEX_PATHS = [...new Set([...PAGE_ROWS.map((r) => r.path), ...INDEXABLE_EXTRAS, ...Object.keys(STATUS)])].filter(isNoindex);
