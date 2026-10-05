// Australian photo library for the home page (public/images/au, described in data/au-photos-*.json), plus the stock photos
// that were confirmed Australian (data/stock-images.json). Every photo was checked for an Australian look and an ordinary,
// approachable feel; credits are in docs/image-credits-au.md.
// Rule: a photo is never shown twice on one page (see picture-registry.ts); when none is left, null is returned and the
// card simply has no photo instead of repeating one.
import fs from "node:fs";
import path from "node:path";
import { firstUnused, isUsed } from "./picture-registry";

export type AuPhoto = { file: string; theme: string; alt: string; focus?: string; peopleCount?: number; group: string; pageUrl?: string };

/** Photo groups kept for the rolling banner (places); everything else feeds the cards. */
const BANNER_GROUPS = new Set(["place", "city"]);

let cache: AuPhoto[] | null = null;
export function auPhotos(): AuPhoto[] {
  if (cache) return cache;
  const root = process.cwd();
  const dir = path.join(root, "data");
  const out: AuPhoto[] = [];
  const seenIds = new Set<string>();
  const idOf = (u?: string) => u?.match(/(\d{5,})\/?$/)?.[1] ?? u ?? "";
  const add = (p: Omit<AuPhoto, "group">, group: string) => {
    if (!fs.existsSync(path.join(root, "public", p.file))) return;
    const id = idOf(p.pageUrl);
    if (id && seenIds.has(id)) return; // the same photo under another name
    if (id) seenIds.add(id);
    out.push({ ...p, group });
  };
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter((n) => /^au-photos-.*\.json$/.test(n)).sort()) {
      for (const p of JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as AuPhoto[]) add(p, f.replace(/^au-photos-|\.json$/g, ""));
    }
    // stock photos confirmed Australian join as a last resort
    const stockFile = path.join(dir, "stock-images.json");
    if (fs.existsSync(stockFile)) {
      for (const s of JSON.parse(fs.readFileSync(stockFile, "utf8")) as { file: string; alt: string; australian?: boolean; pageUrl?: string }[]) {
        if (s.australian) add({ file: s.file, theme: s.alt, alt: s.alt, pageUrl: s.pageUrl }, "stock");
      }
    }
  }
  return (cache = out);
}

const cardPool = () => auPhotos().filter((p) => !BANNER_GROUPS.has(p.group));
const bannerPool = () => auPhotos().filter((p) => BANNER_GROUPS.has(p.group));
const text = (p: AuPhoto) => `${p.theme} ${p.alt} ${p.file}`.toLowerCase();

/** Picks (and claims) the first not-yet-shown Australian photo whose theme / description / file name matches. */
export function auFind(rx: RegExp): { file: string } | undefined {
  const hits = [...cardPool(), ...bannerPool()].filter((p) => rx.test(text(p))).map((p) => p.file);
  const file = firstUnused(hits);
  return file ? { file } : undefined;
}

// [pattern in a card's words, pattern for the photo it should get]
const RULES: [RegExp, RegExp][] = [
  [/famil|household|parent|kids|children/i, /family|kids|children/],
  [/retire|smsf|self-managed|pension|wealth|estate|succession|super/i, /retire|older|senior|elderly/],
  [/rural|farm|agricultur|primary production|grazier|crop/i, /farm|rural|paddock|tractor|stockmen|vineyard/],
  [/construction|tradie|builder|trade|electric|plumb|development/i, /tradie|trade|builder|electric|plumb|mechanic/],
  [/retail|shop|store|boutique|florist|e-?commerce/i, /florist|retail|boutique|shop|market|bakery/],
  [/cafe|hospitality|restaurant|food/i, /cafe|barista|coffee/],
  [/hair|beauty|salon|personal service/i, /hairdress|barber|beauti|salon/],
  [/clean|landscap|mobile|transport|logistics|freight|courier|van/i, /clean|landscap|van|mobile|truck/],
  [/payroll|employee|team|wages|staff/i, /team|staff|colleague/],
  [/small business|sole trader|owner|business/i, /business owner|workshop|shop|paperwork|sole|owner/],
  [/new business|start-?up|registration|abn|asic|founder/i, /online|parcel|home-based|start/],
  [/invest|property|rental|shares|crypto|capital gain/i, /couple|home|suburb|house/],
  [/audit|assurance|compliance|vetting|verified|checks?\b/i, /meeting|client|advis|desk/],
  [/call|phone|contact|callback|match|connect/i, /meeting|handshake|conversation|advis/],
  [/tax|deduction|ato\b|lodge|deadline|return|bas\b|gst|bookkeep/i, /paperwork|laptop|desk|home office|kitchen/],
];

/** A photo for a card, chosen from its words; never one this page has already shown (null when none is left). */
export function auPictureFor(words: string, index = 0): string | null {
  const cards = cardPool();
  const cands: string[] = [];
  for (const [wordRx, photoRx] of RULES) if (wordRx.test(words)) cands.push(...cards.filter((p) => photoRx.test(text(p))).map((p) => p.file));
  for (let k = 0; k < cards.length; k++) cands.push(cards[(index + k) % cards.length].file);
  cands.push(...bannerPool().map((p) => p.file));
  return firstUnused(cands);
}

/** Next unused photo in a plain rotation (card photos first, then place photos). */
export function auRotating(index: number): string | null {
  const cards = cardPool();
  const cands: string[] = [];
  for (let k = 0; k < cards.length; k++) cands.push(cards[(index * 3 + k) % cards.length].file);
  cands.push(...bannerPool().map((p) => p.file));
  return firstUnused(cands);
}

/** Pictures for the rolling banner: place and city photos, claimed so no card repeats them. */
export function auBannerPictures(max = 14): string[] {
  const out: string[] = [];
  for (const p of bannerPool()) {
    if (out.length >= max) break;
    const f = firstUnused([p.file]);
    if (f) out.push(f);
  }
  return out;
}

/** How many Australian photos this page has not shown yet (used to keep some back for the sections further down). */
export function auRemaining(): number {
  return auPhotos().filter((p) => !isUsed(p.file)).length;
}

/**
 * Claims up to n unused photos, taking turns between the preferred groups (so a cluster mixes people and desk shots), then
 * topping up from the other card photos. Never returns a photo this page has already shown.
 */
export function auGroupPhotos(groups: string[], n: number): string[] {
  const lists = groups.map((g) => auPhotos().filter((p) => p.group === g).map((p) => p.file));
  const rest = cardPool().map((p) => p.file);
  const out: string[] = [];
  for (let round = 0; out.length < n && round < 12; round++) {
    for (const list of lists) {
      if (out.length >= n) break;
      const f = firstUnused(list.slice(round, round + 1).length ? list.slice(round) : []);
      if (f) out.push(f);
    }
  }
  while (out.length < n) {
    const f = firstUnused(rest);
    if (!f) break;
    out.push(f);
  }
  return out;
}
