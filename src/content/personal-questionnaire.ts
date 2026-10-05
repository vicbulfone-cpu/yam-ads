/**
 * PERSONAL AD QUESTIONNAIRE — wording for the personal tax ad landing page (/ad-2) and its own questionnaire.
 * Owner's wording (5 Oct 2026) and the owner's "personal" ad design picture. Edit the words here.
 *
 * Flow: one main reason (match box, or "Not sure — help me choose" inside the questionnaire) → its follow-up page →
 * "Does your return include any of these?" (return preparation only) → name → summary (confirm, optional note) →
 * in person or remote → postcode/suburb → short pause → "great news" box with email → mobile → email the match details?
 * → match page (/ad-6). Each page counts as one step in the progress bar.
 */
import { BIZ_LANDING, BIZ_MODES, BIZ_Q } from "./business-questionnaire";

export type NeedId = "this_year" | "overdue" | "amend" | "planning" | "unsure";

export interface PersonalNeed {
  id: Exclude<NeedId, "unsure">;
  /** name in the questionnaire and summary */
  title: string;
  /** name on the match box (as in the design picture) */
  box: string;
  /** one line under the name on the "help me choose" page */
  help: string;
  tone: "blue" | "green" | "orange" | "purple";
}

export const PERSONAL_NEEDS: PersonalNeed[] = [
  { id: "this_year", title: "This year’s tax return", box: "This year’s tax return", help: "You need to lodge your return for the latest financial year.", tone: "blue" },
  { id: "overdue", title: "Overdue or multiple returns", box: "Overdue or multiple tax returns", help: "You’ve missed one or more years and want to catch up.", tone: "green" },
  { id: "amend", title: "Amend a lodged return", box: "Amend a lodged tax return", help: "Something was missed or wrong on a return you’ve already lodged.", tone: "orange" },
  { id: "planning", title: "Tax planning or advice", box: "Tax planning or advice", help: "You’d like advice before you act — property, capital gains, income or deductions.", tone: "purple" },
];

/** "Help me choose" page: the extra choice for visitors who still can't pick one. */
export const STILL_UNSURE = { id: "unsure" as const, title: "I’m still not sure", help: "No problem — your accountant will help you work out what you need." };

/** Main reasons that prepare a return: these get the "Does your return include any of these?" page. */
export const RETURN_NEEDS: NeedId[] = ["this_year", "overdue", "amend", "unsure"];

/** Australian financial years, newest completed year first (1 July – 30 June), e.g. "2025–26". */
export function financialYears(count: number, now = new Date()) {
  const lastEnd = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1; // July onwards: the year just ended
  return Array.from({ length: count }, (_, i) => {
    const end = lastEnd - i;
    return { id: `fy${end}`, label: `${end - 1}–${String(end).slice(2)}`, desc: `1 July ${end - 1} – 30 June ${end}` };
  });
}

export const YES_NO_UNSURE = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
  { id: "unsure", label: "Not sure" },
];

export const ADVICE_TOPICS = [
  { id: "investment_property", label: "Investment property" },
  { id: "capital_gains", label: "Capital gains" },
  { id: "income_deductions", label: "Income and deductions" },
  { id: "other", label: "Other — tell us what you need", other: true },
  { id: "unsure", label: "Not sure — help me choose" },
];

export const RETURN_ITEMS = [
  { id: "salary", label: "Salary or wages" },
  { id: "investment_property", label: "Investment property" },
  { id: "shares", label: "Shares, ETFs or managed funds" },
  { id: "crypto", label: "Cryptocurrency" },
  { id: "sale", label: "Sale of property or investments" },
  { id: "sole_trader", label: "Sole trader or side-business income" },
  { id: "overseas", label: "Overseas income" },
  { id: "unsure", label: "Not sure" },
];

export const PERSONAL_MODES = BIZ_MODES;

/** The landing page (owner's "personal" design picture). Footer wording is shared with the business page. */
export const PERSONAL_LANDING = {
  ...BIZ_LANDING,
  /** headline: the middle part is green */
  h1: ["Looking for a ", "personal tax accountant", " near you?"],
  sub: "Let us do the heavy lifting and connect you with one local accountant for your tax return.",
  benefits: [
    { icon: "pin", text: ["Local", "accountants"] },
    { icon: "people", text: ["One accountant", "per area"] },
    { icon: "shield", text: ["Free", "matching"] },
  ],
  script: ["The smarter way", "to get your tax sorted."],
  disclaimer: ["We provide the matching service.", "Your accountant provides the tax services."],
};

/** The personal match box. */
export const PERSONAL_CARD = {
  title: ["Your personal tax match", "starts here"],
  map: "Australia wide",
  /** the word in [ ] is drawn green */
  band: ["Your enquiry goes to ", "one", " local accountant, never a list."],
  question: "What do you need help with?",
  hint: "Choose one option to get started.",
  unsure: "Not sure — help me choose",
  start: "Start My Tax Match",
  note: "Takes about 60 seconds. Free and no obligation.",
  footer: "Matching is free. Accountant fees are agreed separately.",
  error: "Please choose one option to continue.",
};

/** Every questionnaire page. {name} is the visitor's first name (owner's name rule, 5 Oct 2026). */
export const PERSONAL_Q = {
  ...BIZ_Q,
  badge: "Your Tax Match in Progress",
  choose: {
    eyebrow: "Let’s work it out",
    title: "What do you need help with?",
    text: "Choose the one that sounds closest — your accountant can help with the rest.",
  },
  thisYear: {
    eyebrow: "Your tax return",
    year: "Which financial year?",
    first: "Is this your first tax return?",
  },
  overdue: {
    eyebrow: "Overdue or multiple returns",
    years: "Which financial years need lodging?",
    hint: "Select all that apply.",
    earlier: "Earlier years",
    unsure: "Not sure",
  },
  amend: {
    eyebrow: "Amend a lodged return",
    year: "Which financial year?",
    earlier: "Earlier year",
    unsure: "Not sure",
    noteLabel: "What needs correcting? (optional)",
    notePlaceholder: "A short description is plenty…",
  },
  planning: {
    eyebrow: "Tax planning or advice",
    title: "What would you like advice about?",
    hint: "Select all that apply.",
  },
  income: {
    eyebrow: "Your return",
    title: "Does your return include any of these?",
    hint: "Select all that apply.",
  },
  notes: {
    label: "Anything else your accountant should know? (optional)",
    placeholder: "For example: a deadline, an ATO letter, or anything that’s changed this year…",
  },
  summaryLabels: {
    need: "What you need",
    details: "Details",
    income: "Your return includes",
    year: "Financial year",
    first: "First tax return",
    years: "Years to lodge",
    correcting: "What needs correcting",
    advice: "Advice about",
    notes: "Note for your accountant",
  },
  errors: {
    ...BIZ_Q.errors,
    need: "Please choose one option to continue.",
    year: "Please choose a financial year.",
    first: "Please tell us if this is your first tax return.",
    years: "Please choose at least one financial year.",
    topics: "Please choose at least one option to continue.",
    income: "Please choose at least one option, or “Not sure”.",
  },
  found: { ...BIZ_Q.found, placeholder: "you@example.com" },
};

/** Match page (/ad-6) wording that differs for personal tax customers (the rest is BIZ_MATCH). */
export const PERSONAL_MATCH = {
  title: "Meet your local tax accountant",
  next: [
    "Your accountant reviews what you need.",
    "They may call to understand your situation better before giving a quote.",
    "You decide whether to go ahead. Matching is free and there’s no obligation.",
  ],
};
