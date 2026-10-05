// SEO helpers: page metadata (title, description, canonical, robots, Open Graph, Twitter) and JSON-LD structured data.
// Titles, descriptions and robots tags are the old site's, word for word. Only the web address is corrected:
// the old export was captured from a local copy, so some canonicals/og:urls said http://localhost:4173.
import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site.config";
import { BUSINESS } from "@/content/business";
import seoCopy from "@/content/seo-copy.json";
import { applyWording } from "@/content/wording";
import { cityOf, typeOf, INDEXABLE_PATHS, isNoindex } from "@/lib/pages";
import { loadContent } from "@/lib/content";

type OldPage = {
  title?: string;
  metaDescription?: string;
  canonical?: string;
  robots?: string[];
  hreflang?: { lang: string; href: string }[];
  og?: Record<string, string>;
  jsonLd?: Record<string, unknown>[];
  extractedAt?: string;
};

const SITE_NAME = "Your Accountant Match";
/** Branded share image (1200x630), built by scripts/make-og-image.mjs. */
export const OG_IMAGE = `${SITE_URL}/images/brand/og-default.png`;

export const pageUrl = (p: string) => SITE_URL + (p === "/" ? "/" : p);

const fileFor = (p: string) =>
  path.join(process.cwd(), "data", "extracted", "pages", (p === "/" ? "_home" : p.replace(/^\/|\/$/g, "").replace(/[\/?=&]/g, "__")) + ".json");

export function oldPage(p: string): OldPage | null {
  const f = fileFor(p);
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf8")) as OldPage) : null;
}

/** Replaces the local-copy address (http://localhost:4173) with the real site address. */
const fixHost = (s: string) => s.replace(/http:\/\/localhost:\d+/g, SITE_URL);

type Copy = { title: string; description: string; h1?: { first: string; highlight?: string; second?: string } };
/** Rewritten title, description and (city / industry pages) H1, from scripts/build-seo-copy.mjs. */
export const copyFor = (p: string): Copy | undefined => (seoCopy as Record<string, Copy>)[p];

export function pageMetadata(p: string): Metadata {
  const m = oldPage(p);
  if (!m) return {};
  const url = pageUrl(p);
  const c = copyFor(p);
  const title = c?.title ?? m.og?.["og:title"] ?? m.title;
  const description = c?.description ?? m.og?.["og:description"] ?? m.metaDescription;
  const languages = Object.fromEntries(
    (m.hreflang ?? [])
      .filter((item) => item.lang && item.href)
      .map((item) => [item.lang, fixHost(item.href)]),
  );
  return {
    title: c?.title ?? m.title,
    description: c?.description ?? m.metaDescription,
    // self-referencing canonical on the clean URL (tracking parameters such as ?utm_ / ?gclid / ?ref= never change it)
    alternates: { canonical: url, ...(Object.keys(languages).length ? { languages } : {}) },
    // a page that already had a robots tag keeps it exactly; a page with none allows rich previews
    robots: isNoindex(p) ? (m.robots?.some((v) => /noindex/i.test(v)) ? m.robots[0] : { index: false, follow: true }) : m.robots?.some((v) => /noindex/i.test(v)) ? { index: true, follow: true } : m.robots?.[0] ?? { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_AU",
      title,
      description,
      url,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}

const DROP = new Set(["Organization", "WebSite", "BreadcrumbList", "ProfessionalService", "LocalBusiness"]);

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const servicePaths = new Set(INDEXABLE_PATHS.filter((p) => ["homepage", "city", "industry-city", "service"].includes(typeOf(p))));
const readable = (p: string) => p === "/" ? "Home" : p.split("/").filter(Boolean).at(-1)!.split("-").map((s) => {
  const upper = new Set(["abn", "bas", "cpa", "gst", "smsf", "xero", "myob", "ato"]);
  return upper.has(s.toLowerCase()) ? s.toUpperCase() : s.charAt(0).toUpperCase() + s.slice(1);
}).join(" ");

function breadcrumbFor(p: string): Record<string, unknown> | null {
  if (p === "/") return null;
  const parents = INDEXABLE_PATHS
    .filter((candidate) => candidate !== "/" && p.startsWith(`${candidate}/`))
    .sort((a, b) => a.length - b.length);
  const paths = ["/", ...parents, p];
  const unique = [...new Set(paths)];
  return {
    "@type": "BreadcrumbList",
    itemListElement: unique.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: readable(item),
      item: pageUrl(item),
    })),
  };
}

/** One JSON-LD graph per page: accurate site identity plus page-specific, visible content. */
export function jsonLdFor(p: string): Record<string, unknown> {
  const m = oldPage(p);
  const home = oldPage("/");
  const org = home?.jsonLd
    ?.flatMap((x) => (x["@graph"] as Record<string, unknown>[] | undefined) ?? [x])
    .find((n) => n["@type"] === "Organization");
  const nodes: Record<string, unknown>[] = [];
  if (org) {
    nodes.push({
      ...org,
      "@id": `${SITE_URL}/#organization`,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/brand/logo-v8-1200.webp` },
      slogan: "Smarter Matching. Better Outcomes.",
      ...(BUSINESS.phone ? { telephone: BUSINESS.phone } : {}),
      ...(BUSINESS.abn ? { taxID: BUSINESS.abn } : {}),
      contactPoint: org.contactPoint
        ? { ...org.contactPoint, email: BUSINESS.email }
        : { "@type": "ContactPoint", contactType: "customer service", email: BUSINESS.email, areaServed: "AU", availableLanguage: ["en"] },
    });
  }
  nodes.push({
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: "en-AU",
    slogan: "Smarter Matching. Better Outcomes.",
    description: "A national accountant matching and referral service that connects people and businesses with partner accountants. Your Accountant Match is not an accounting firm.",
    publisher: { "@id": `${SITE_URL}/#organization` },
  });
  const hasVisibleFaq = loadContent(p).mobile.some((item) => item.t === "faq")
    || loadContent(p).nodes.some((item) => item.t === "faq");
  for (const item of m?.jsonLd ?? []) {
    const list = (item["@graph"] as Record<string, unknown>[] | undefined) ?? [item];
    for (const n of list) {
      const type = String(n["@type"]);
      if (DROP.has(type) || (type === "FAQPage" && !hasVisibleFaq)) continue;
      if (type === "Service") {
        nodes.push({
          ...n,
          "@id": n["@id"] ?? `${pageUrl(p)}#service`,
          provider: { "@id": ORGANIZATION_ID },
        });
      } else {
        nodes.push(n);
      }
    }
  }
  const crumb = breadcrumbFor(p);
  if (crumb) nodes.push(crumb);
  if (servicePaths.has(p) && !nodes.some((node) => node["@type"] === "Service")) {
    nodes.push({
      "@type": "Service",
      "@id": `${pageUrl(p)}#service`,
      name: `Accountant matching${cityOf(p) ? ` in ${readable(`/${cityOf(p)}`)}` : ""}`,
      serviceType: "Accountant matching and referral",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "Australia" },
      url: pageUrl(p),
    });
  }
  return JSON.parse(applyWording(fixHost(JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }))));
}
