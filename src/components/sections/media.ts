// Picks a picture for a card / tile from its own words, using the stock photos in public/images/stock.
// Only files that exist are used, so the site never shows a broken image.
import fs from "node:fs";
import path from "node:path";
import { firstUnused } from "./picture-registry";

const DIR = path.join(process.cwd(), "public", "images", "stock");
let files: string[] | null = null;
/** Stock photos the owner has asked us not to use (people who appear to be African American or mixed-race, 3 Oct 2026).
 *  They stay on disk but are never shown. */
const EXCLUDED = new Set([
  "topic-payroll", "general-consultation", "general-handshake", "general-couple-finances",
  "general-owner-laptop", "general-team-office", "general-home-office",
]);
const available = () => {
  if (!files) files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".webp")).map((f) => f.replace(/\.webp$/, "")).filter((n) => !EXCLUDED.has(n)) : [];
  return files;
};

// [pattern in the card's words, stock picture names in order of preference]
const RULES: [RegExp, string[]][] = [
  [/famil|household|parent|couples?/i, ["general-family-kitchen-table", "general-couple-finances"]],
  [/small business|sole trader|owner/i, ["industry-retail", "general-owner-laptop"]],
  [/charit|not-for-profit|community/i, ["general-team-office", "general-handshake"]],
  [/land tax|stamp duty|investment property|property|real estate|negative gearing|landlord/i, ["industry-real-estate", "topic-investing"]],
  [/payroll|employee|wages|superannuation guarantee|payday/i, ["topic-payroll", "general-team-office"]],
  [/\bbas\b|\bgst\b|bookkeep|activity statement/i, ["topic-bas-gst", "topic-bookkeeping"]],
  [/smsf|self-managed|retire|pension|wealth|estate|succession/i, ["industry-smsf", "general-couple-finances"]],
  [/audit|assurance|compliance|vetting|verified|checks?\b|atos?\b/i, ["topic-audit", "general-documents-signing"]],
  [/company|trust|partnership|structure|sole trader/i, ["topic-business-structures", "general-consultation"]],
  [/new business|start-?up|registration|abn|asic|tfn|set up|setup|founder/i, ["topic-new-business", "general-laptop-coffee"]],
  [/cloud|software|xero|myob|reporting|dashboard|digital/i, ["topic-cloud-accounting", "general-laptop-coffee"]],
  [/construction|tradie|builder|trade|development/i, ["industry-construction"]],
  [/agricultur|farm|rural|primary production|grazier|crop/i, ["industry-agriculture"]],
  [/medical|health|clinic|dental|allied/i, ["industry-medical"]],
  [/retail|e-?commerce|shop|store|hospitality|cafe/i, ["industry-retail"]],
  [/transport|logistics|freight|truck|courier/i, ["industry-transport"]],
  [/professional|consult|finance|fintech|tech|legal|engineer/i, ["industry-professional", "general-team-office"]],
  [/invest|shares|crypto|capital gain|cgt/i, ["topic-investing", "topic-tax-planning"]],
  [/tax return|tax\b|deduction|ato\b|lodge|deadline/i, ["topic-tax-return", "topic-tax-planning"]],
  [/plan/i, ["topic-tax-planning"]],
  [/call|phone|contact|callback/i, ["general-phone-call"]],
  [/match|connect|local|area|accountant/i, ["general-consultation", "general-handshake"]],
];

const GENERAL = () => available().filter((n) => n.startsWith("general-"));

/** Returns a public path like "/images/stock/topic-tax-return.webp", or null when every stock photo has already been shown on this page
 *  (the same photo is never shown twice on one page, see picture-registry.ts). */
export function pictureFor(words: string, index = 0): string | null {
  const have = new Set(available());
  if (have.size === 0) return null;
  const cands: string[] = [];
  for (const [rx, names] of RULES) if (rx.test(words)) cands.push(...names.filter((n) => have.has(n)));
  const pool = GENERAL();
  const all = pool.length ? pool : [...have];
  for (let k = 0; k < all.length; k++) cands.push(all[(index + k) % all.length]);
  cands.push(...have);
  return firstUnused(cands.map((n) => `/images/stock/${n}.webp`));
}

/** Several different pictures (for the rolling banner). */
export function bannerPictures(max = 14): string[] {
  const all = available();
  const order = [...all.filter((n) => n.startsWith("general-")), ...all.filter((n) => n.startsWith("industry-")), ...all.filter((n) => n.startsWith("topic-"))];
  const out: string[] = [];
  for (const n of order) { if (out.length >= max) break; const f = firstUnused([`/images/stock/${n}.webp`]); if (f) out.push(f); }
  return out;
}
