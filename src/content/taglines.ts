/**
 * TAGLINES — the one place to edit marketing tagline wording and the rule that decides which page shows which.
 *
 * Pages never hold tagline text; they call taglineFor(path). The questionnaire, match pages and everything after
 * "Start my match" never call it, so they never show a tagline. Add a new line only with the owner's approval.
 * NOT YET APPROVED (do not add until a verified figure is supplied): "Did you know the right accountant could save you $X a year?"
 */
import { CITY_SLUGS } from "@/config/site.config";
import { PAGE_PATHS } from "@/lib/pages";

export const TAGLINES: Record<number, string> = {
  1: "Not all accountants are equal. Get matched with one who knows your situation.",
  2: "Paying too much tax? The right accountant pays for themselves.",
  3: "Your tax return is personal. Your accountant should be too.",
  4: "From SMSFs to sole traders: matched to a specialist, not a generalist.",
  5: "Stop guessing. Get matched with a local accountant in minutes.",
  6: "The right accountant doesn't cost money. They save it.",
  7: "Missed deductions are money left on the table. Get it back.",
  8: "One quick match. A year of better tax outcomes.",
  9: "Right accountant. Right specialty. Right around the corner.",
};

/** Pages that never show a tagline (legal pages; the questionnaire and match pages are separate routes and never ask). */
const NO_TAGLINE = new Set(["/privacy", "/terms"]);

/** General rotation: neighbouring pages in a list step through these, so one after another they differ. */
const ROTATION = [1, 2, 3, 6, 8, 5];

const SPECIALIST = /smsf|sole-trader|specialist/;
const INDIVIDUAL_TAX = /personal-tax|tax-accountant|tax-deduction|registered-tax-agent|tax-return|deduction/;

const MULTI = new Set(["accountant", "guide", "blog", "industry", "locations"]);
const kind = (p: string) => (p === "/" ? "home" : MULTI.has(p.split("/")[1]) ? p.split("/")[1] : "other");
/** Position of a page among pages of its own section (services, guides, blog, industry, other), in menu order. */
const indexInGroup = (p: string) => PAGE_PATHS.filter((x) => kind(x) === kind(p) && !NO_TAGLINE.has(x)).indexOf(p);

/** The tagline number for a page, or null when the page has none. */
export function taglineNumberFor(path: string): number | null {
  if (path === "/" || NO_TAGLINE.has(path)) return path === "/" ? 8 : null;
  const k = kind(path);
  if (k === "locations" && path !== "/locations") {
    const i = CITY_SLUGS.indexOf(path.split("/")[2] as (typeof CITY_SLUGS)[number]);
    return i % 2 === 0 ? 5 : 9; // location pages alternate, so neighbouring cities differ
  }
  if (SPECIALIST.test(path)) return 4;
  if (INDIVIDUAL_TAX.test(path)) return 7;
  const i = Math.max(indexInGroup(path), 0);
  // pages that sit outside the main groups (about, contact, hubs…) share one small rotation
  return ROTATION[(k === "industry" ? i + Math.floor(i / 13) : i) % ROTATION.length];
}

export function taglineFor(path: string): string | null {
  const n = taglineNumberFor(path);
  return n ? TAGLINES[n] : null;
}

/** The home page's second tagline, shown as a supporting line under the hero (the first sits above the closing call to action). */
export const HOME_HERO_TAGLINE = TAGLINES[1];
