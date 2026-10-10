/**
 * HOME PAGE "What we can help you with" (owner, 10 Oct 2026, noc): straight under the hero, above "Why Use a Specialist
 * Accountant?". The ad pages' services section scaled back: a general intro (not about any one service), then the four
 * services, each with four of its ad page's six service cards (same words): the four whose names are searched for most
 * (tax return, deductions, BAS, bookkeeping, SMSF setup and audit, ABN, business name, company setup…).
 * Shown by HomeServices.tsx; the service names and icons are shared with HomeWhySpecialist (home-why-specialist.ts).
 */
import { PERSONAL_SERVICES } from "./personal-sections";
import { BUSINESS_SERVICES } from "./business-sections";
import { SMSF_SERVICES } from "./smsf-sections";
import { REG_SERVICES } from "./registration-sections";

export const HOME_SERVICES = {
  eyebrow: PERSONAL_SERVICES.eyebrow,
  h2: "Tax & Accounting Services",
  h2Accent: "Services",
  intro: "Whether you need your personal tax return done, ongoing business accounting, support for your SMSF or help setting up a new business, find a local specialist who understands what you need.",
};

const pick = (cards: { title: string; text: string }[], titles: string[]) =>
  titles.map((t) => {
    const c = cards.find((x) => x.title === t);
    if (!c) throw new Error(`home-services: no service card "${t}"`);
    return { title: c.title, text: c.text };
  });

/** keyed as HOME_WHY_SERVICES (same names, "who" lines and icons) */
export const HOME_SERVICE_CARDS: Record<string, { title: string; text: string }[]> = {
  personal: pick(PERSONAL_SERVICES.cards, ["Individual Tax Returns", "Tax Deductions", "Rental Property Tax", "Investments & Shares"]),
  business: pick(BUSINESS_SERVICES.cards, ["Company & Business Tax Returns", "BAS & GST Compliance", "Bookkeeping & Payroll", "Tax Planning & Advisory"]),
  smsf: pick(SMSF_SERVICES.cards, ["SMSF Tax Returns & Accounts", "New SMSF Setup & Establishment", "Independent Audit Coordination", "Contributions & Pensions"]),
  registration: pick(REG_SERVICES.cards, ["ABN & TFN Registrations", "Business Name Registration", "Company Setup (Pty Ltd)", "GST & PAYG Withholding Setup"]),
};
