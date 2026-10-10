/**
 * HOME PAGE "Who we help" (owner, 10 Oct 2026, noc): above "How it works". The ad pages' "Find the Right Accountant…"
 * section, with a general intro (not about any one service), then the four services, each with the five people its ad
 * page names (same words, src/content/*-sections.ts). Shown by HomeWhoWeHelp.tsx.
 */
import { PERSONAL_RIGHT_FIT } from "./personal-sections";
import { BUSINESS_RIGHT_FIT } from "./business-sections";
import { SMSF_RIGHT_FIT } from "./smsf-sections";
import { REG_RIGHT_FIT } from "./registration-sections";

export const HOME_WHO = {
  eyebrow: PERSONAL_RIGHT_FIT.eyebrow,
  h2: "Find the Right Accountant for Your Needs",
  h2Accent: "Your Needs",
  lead: "Not every tax or accounting need is the same.",
  text: "Whether you're an employee or investor, a sole trader or company director, an SMSF trustee or starting a new business, Your Accountant Match helps you find a specialist suited to your circumstances.",
};

/** keyed as HOME_WHY_SERVICES (same names, "who" lines and icons) */
export const HOME_WHO_TILES: Record<string, string[]> = {
  personal: PERSONAL_RIGHT_FIT.tiles.map((t) => t.label),
  business: BUSINESS_RIGHT_FIT.tiles.map((t) => t.label),
  smsf: SMSF_RIGHT_FIT.tiles.map((t) => t.label),
  registration: REG_RIGHT_FIT.tiles.map((t) => t.label),
};
