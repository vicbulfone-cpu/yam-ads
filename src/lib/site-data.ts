import { loadContent } from "./content";

export type CityLink = { slug: string; label: string };

/** The 13 city links as the old site's footer lists them (text and order from the old site). */
export function getCityLinks(): CityLink[] {
  const home = loadContent("/");
  const seen = new Set<string>();
  const out: CityLink[] = [];
  for (const n of home.mobile) {
    if (n.t === "link" && /^\/locations\/[^/]+$/.test(n.href)) {
      const slug = n.href.split("/")[2];
      if (!seen.has(slug)) { seen.add(slug); out.push({ slug, label: n.text }); }
    }
  }
  return out;
}

export type CtaBandWords = { title?: string; text?: string; label?: string; note?: string };

/** The old site's "Ready to find your accountant?" call-to-action wording (found on the blog articles). */
export function getCtaBandWords(): CtaBandWords | null {
  try {
    const nodes = loadContent("/blog/bas-due-dates-2026").mobile;
    const i = nodes.findIndex((n) => n.t === "h" && /^ready to find/i.test(n.text));
    if (i === -1) return null;
    const out: CtaBandWords = { title: (nodes[i] as { text: string }).text };
    const rest = nodes.slice(i + 1, i + 6);
    const ps = rest.filter((n) => n.t === "p") as { text: string }[];
    out.text = ps[0]?.text;
    out.note = ps[1]?.text;
    out.label = (rest.find((n) => n.t === "button") as { text: string } | undefined)?.text;
    return out;
  } catch {
    return null;
  }
}

/** "Melbourne (VIC)" -> "Melbourne" */
export const shortCityName = (label: string) => label.replace(/\s*\([A-Z ]+\)\s*$/, "");
