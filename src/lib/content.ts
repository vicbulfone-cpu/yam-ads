// Loads the extracted content of the old site (data/structured/<slug>.json) at BUILD time.
// Pages never contain hand-typed copy: every word they show comes through here.
import fs from "node:fs";
import path from "node:path";
import { applyWordingDeep } from "@/content/wording";

export type Inline = string; // sanitised HTML: only <a href>, <strong>, <em>, <br>
export type Node =
  | { t: "sec"; s: number; tag: string; id: string | null }
  | { t: "h"; l: number; html: Inline; text: string; s: number; c: number | null; g: number | null }
  | { t: "p"; html: Inline; text: string; s: number; c: number | null; g: number | null }
  | { t: "text"; html: Inline; text: string; parts?: string[]; s: number; c: number | null; g: number | null }
  | { t: "list"; ordered: boolean; items: { html: Inline; text: string }[]; s: number; c: number | null; g: number | null }
  | { t: "link"; href: string; text: string; html: Inline; parts?: string[]; s: number; c: number | null; g: number | null }
  | { t: "cardlink"; href: string; s: number; c: number | null; g: number | null }
  | { t: "button"; text: string; lines?: string[]; parts?: string[]; s: number; c: number | null; g: number | null }
  | { t: "faq"; q: string; a: Inline; aText: string; s: number; c: number | null; g: number | null }
  | { t: "table"; rows: string[][]; s: number; c: number | null; g: number | null }
  | { t: "label"; text: string; s: number; c: number | null; g: number | null }
  | { t: "field"; type: string; placeholder: string | null; name: string | null; s: number; c: number | null; g: number | null }
  | { t: "img"; src: string; alt: string | null; s: number; c: number | null; g: number | null };

export type Content = { path: string; nodes: Node[]; mobile: Node[]; fixed: string[] };

const DIR = path.join(process.cwd(), "data", "structured");
export const slugOf = (p: string) => (p === "/" ? "_home" : p.replace(/^\/|\/$/g, "").replace(/[\/?=&]/g, "__"));

const cache = new Map<string, Content>();
export function loadContent(pagePath: string): Content {
  const slug = slugOf(pagePath);
  let c = cache.get(slug);
  if (!c) {
    const file = path.join(DIR, slug + ".json");
    if (!fs.existsSync(file)) throw new Error(`No extracted content for ${pagePath} (${file})`);
    c = JSON.parse(fs.readFileSync(file, "utf8")) as Content;
    applyWordingDeep(c); // site-wide wording updates (src/content/wording.ts)
    cache.set(slug, c);
  }
  return c;
}

/** A section = everything between two <section>/<header>/<footer>/<main> boundaries. */
export type Section = { id: number; tag: string; nodes: Exclude<Node, { t: "sec" }>[] };

export function toSections(nodes: Node[]): Section[] {
  const out: Section[] = [];
  let cur: Section = { id: 0, tag: "loose", nodes: [] };
  for (const n of nodes) {
    if (n.t === "sec") {
      if (cur.nodes.length) out.push(cur);
      cur = { id: n.s, tag: n.tag, nodes: [] };
    } else {
      // Nodes carry the section id they belonged to; a nested section's content keeps flowing here.
      cur.nodes.push(n);
    }
  }
  if (cur.nodes.length) out.push(cur);
  return out;
}

export const plain = (html: string) => html.replace(/<br>/g, " ").replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

/* ------------------------------------------------------------------------------------------------
   Phone and desktop versions of the OLD pages differ in a few places (mostly shared blocks). The new site
   has one responsive page, so we use the PHONE wording (what Google indexes first) and add any desktop-only
   words that are not just a re-wording of something already there. Differences are listed by
   scripts/compare-views.mjs → docs/mobile-desktop-differences.md.
   ------------------------------------------------------------------------------------------------ */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const textOfNode = (n: Node): string[] =>
  n.t === "list" ? n.items.map((i) => i.text) : n.t === "faq" ? [n.q, n.aText] : "text" in n && typeof n.text === "string" ? [n.text] : [];

function shingles(s: string, k = 3) {
  const w = norm(s).split(" ");
  const out = new Set<string>();
  for (let i = 0; i + k <= w.length; i++) out.add(w.slice(i, i + k).join(" "));
  return out;
}

export function mergeViews(c: Content): Node[] {
  const mobile = c.mobile;
  const mobileText = norm(mobile.flatMap(textOfNode).join(" | "));
  const mobileShingles = new Set<string>();
  for (const n of mobile) for (const t of textOfNode(n)) shingles(t).forEach((x) => mobileShingles.add(x));
  const coverage = (texts: string[]) => {
    const sh = texts.flatMap((t) => [...shingles(t)]);
    return sh.length ? sh.filter((x) => mobileShingles.has(x)).length / sh.length : 1;
  };

  // A whole desktop section that is mostly a re-wording of phone text is skipped (no duplicate blocks).
  const bySection = new Map<number, Node[]>();
  for (const n of c.nodes) {
    if (n.t === "sec" || n.t === "img") continue;
    const k = "s" in n ? n.s : 0;
    if (!bySection.has(k)) bySection.set(k, []);
    bySection.get(k)!.push(n);
  }
  const skipSections = new Set<number>();
  for (const [k, arr] of bySection) {
    if (k === 0) continue;
    const texts = arr.flatMap(textOfNode);
    if (texts.length >= 2 && coverage(texts) >= 0.5) skipSections.add(k);
  }

  const out = [...mobile];
  const isInMobile = (n: Node) => textOfNode(n).every((t) => norm(t).length === 0 || mobileText.includes(norm(t)));
  let anchorText: string | null = null;
  const pending: Node[] = [];
  const flush = () => {
    if (!pending.length) return;
    let at = -1;
    if (anchorText) at = out.findIndex((m) => textOfNode(m).some((t) => norm(t) === anchorText));
    if (at === -1) {
      const f = out.findIndex((m) => m.t === "sec" && m.tag === "footer");
      at = (f === -1 ? out.length : f) - 1;
    }
    out.splice(at + 1, 0, ...pending.splice(0));
  };
  for (const n of c.nodes) {
    if (n.t === "sec" || n.t === "img") continue;
    const ts = textOfNode(n);
    if (ts.length === 0) continue;
    if (isInMobile(n)) { flush(); anchorText = norm(ts[0]); continue; }
    if ("s" in n && skipSections.has(n.s)) continue;
    if (coverage(ts) >= 0.6) continue;
    const copy = JSON.parse(JSON.stringify(n)) as Node & { s?: number; c?: number | null; g?: number | null };
    if (typeof copy.s === "number") copy.s += 10000;
    if (copy.c != null) copy.c += 10000;
    if (copy.g != null) copy.g += 10000;
    pending.push(copy);
  }
  flush();
  return out;
}

/** Starts a new section at every heading (h1/h2, or an h3 with a small label above it) that is not inside a card. */
export function splitOnHeadings(sections: Section[]): Section[] {
  const out: Section[] = [];
  const isUpperLabel = (n: Section["nodes"][number]) => n.t === "text" && n.text.length > 2 && n.text === n.text.toUpperCase() && n.text.split(" ").length <= 7;
  for (const s of sections) {
    let cur: Section = { ...s, nodes: [] };
    let hasHeading = false;
    for (let i = 0; i < s.nodes.length; i++) {
      const n = s.nodes[i];
      const next = s.nodes[i + 1];
      const startsGroup = (n.t === "h" && n.c == null && (n.l <= 2 || (i > 0 && isUpperLabel(s.nodes[i - 1])))) && s.nodes[i - 2]?.t !== "cardlink";
      // a label that follows a card link belongs to the NEXT card of the same group, so it must not start a new section
      const labelStart = isUpperLabel(n) && next?.t === "h" && n.c == null && s.nodes[i - 1]?.t !== "cardlink";
      if ((labelStart || (startsGroup && !(i > 0 && isUpperLabel(s.nodes[i - 1])))) && hasHeading && cur.nodes.length) {
        out.push(cur);
        cur = { ...s, nodes: [] };
        hasHeading = false;
      }
      cur.nodes.push(n);
      if (n.t === "h" && n.c == null) hasHeading = true;
    }
    if (cur.nodes.length) out.push(cur);
  }
  return out;
}

/** Heading HTML on one line: the old headings were broken into stacked spans; the words are unchanged. */
export const oneLine = (html: string) => html.replace(/<br>/g, " ").replace(/\s+/g, " ").trim();

/** Heading words: the original-case text, with word spacing taken from what the visitor saw on the old page. */
export function headingWords(h: { html: string; text: string }): string {
  const flat = plain(h.html).replace(/\s+/g, " ").trim();
  return flat.toLowerCase() === h.text.replace(/\s+/g, " ").trim().toLowerCase() ? flat : h.text.replace(/\s+/g, " ").trim();
}

/**
 * Hub pages (blog, guides) group several article cards under a category heading inside one grid.
 * Each category becomes its own section so it can show its heading, intro and article cards in order.
 */
export function explodeLinkGroups(sections: Section[]): Section[] {
  type SN = Section["nodes"][number];
  const out: Section[] = [];
  for (const s of sections) {
    let cur: Section = { ...s, nodes: [] };
    const nodes = s.nodes;
    let i = 0;
    while (i < nodes.length) {
      const n = nodes[i];
      if (n.g != null) {
        let j = i;
        while (j < nodes.length && nodes[j].g === n.g) j++;
        const run = nodes.slice(i, j);
        const cards = new Map<number | null, SN[]>();
        for (const x of run) {
          if (!cards.has(x.c)) cards.set(x.c, []);
          cards.get(x.c)!.push(x);
        }
        const all = [...cards.values()];
        if (all.length >= 1 && all.some((card) => card.some((x) => x.t === "cardlink"))) {
          if (cur.nodes.length) out.push(cur);
          for (const card of all) out.push({ ...s, nodes: card.map((x) => ({ ...x, c: null, g: null }) as SN) });
          cur = { ...s, nodes: [] };
        } else {
          cur.nodes.push(...run);
        }
        i = j;
        continue;
      }
      cur.nodes.push(n);
      i++;
    }
    if (cur.nodes.length) out.push(cur);
  }
  return out;
}
