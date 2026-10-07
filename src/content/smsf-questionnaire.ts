/**
 * SMSF & WEALTH AD QUESTIONNAIRE — wording for the SMSF ad landing page (/ad-3) and its own questionnaire.
 * Owner's wording (5 Oct 2026) and the owner's "smsf" ad design picture. Edit the words here.
 *
 * Flow: one page per ticked category (match box) → "a few quick questions" (SMSF now? when? optional note) → name →
 * summary (confirm) → in person or remote → postcode/suburb → short pause → "great news" box with email → mobile →
 * email the match details? → match page (/match). Each page counts as one step in the progress bar (max 5 milestones).
 */
import { BIZ_LANDING, BIZ_MODES, BIZ_Q, type BizCategory, type BizOption } from "./business-questionnaire";

// ("Not sure — help me choose" removed from every question, owner 7 Oct 2026)
const extras = (prefix: string): BizOption[] => [
  { id: `${prefix}_other`, label: "Other — tell us what you need", other: true },
];

/** Same shape as the business categories (title in the questionnaire, short box name and line on the match box). */
export const SMSF_CATEGORIES: BizCategory[] = [
  {
    id: "smsf_setup",
    title: "SMSF setup & accounting",
    desc: "Setting up and running your fund.",
    box: { title: "SMSF Setup & Accounting", desc: "Setup, annual accounts and admin" },
    tone: "blue",
    options: [
      { id: "establish", label: "Establishing an SMSF" },
      { id: "annual_accounts", label: "Annual accounts & tax return" },
      { id: "ongoing_admin", label: "Ongoing administration" },
      { id: "overdue", label: "Overdue returns or catch-up work" },
      { id: "change_accountant", label: "Changing accountants" },
      { id: "wind_up", label: "Winding up an SMSF" },
      ...extras("smsf_setup"),
    ],
  },
  {
    id: "smsf_audit",
    title: "SMSF audit & borrowing",
    desc: "Audits, compliance and SMSF loans.",
    box: { title: "SMSF Audit & Borrowing", desc: "Audits, compliance and SMSF loans" },
    tone: "green",
    options: [
      { id: "annual_audit", label: "Annual independent audit" },
      { id: "audit_issue", label: "Outstanding audit or compliance issue" },
      { id: "explore_borrowing", label: "Exploring SMSF borrowing" },
      { id: "existing_loan", label: "Accounting support for an existing loan" },
      { id: "refinance", label: "Refinancing an existing SMSF loan" },
      { id: "bare_trust", label: "Bare trust or borrowing-document assistance" },
      ...extras("smsf_audit"),
    ],
  },
  {
    id: "retirement",
    title: "Super & retirement planning",
    desc: "Your super, contributions and retirement.",
    box: { title: "Super & Retirement Planning", desc: "Contributions, pensions, retirement" },
    tone: "orange",
    options: [
      { id: "smsf_suits", label: "Advice on whether an SMSF suits me" },
      { id: "review_super", label: "Reviewing my existing super" },
      { id: "contributions", label: "Contribution planning" },
      { id: "prepare_retirement", label: "Preparing for retirement" },
      { id: "pension", label: "Starting or reviewing a pension" },
      { id: "ttr", label: "Transition-to-retirement advice" },
      ...extras("retirement"),
    ],
  },
  {
    id: "wealth",
    title: "Wealth & investment advice",
    desc: "Investment plans, portfolios and tax.",
    box: { title: "Wealth & Investment Advice", desc: "Investment plans and portfolios" },
    tone: "purple",
    options: [
      { id: "investment_plan", label: "Developing an investment plan" },
      { id: "review_investments", label: "Reviewing existing investments" },
      { id: "portfolio_advice", label: "Ongoing portfolio advice" },
      { id: "outside_super", label: "Investing outside super" },
      { id: "inheritance", label: "Managing an inheritance or lump sum" },
      { id: "investment_tax", label: "Coordinating investment and tax planning" },
      ...extras("wealth"),
    ],
  },
];

/** The short qualifying questions (owner, 5 Oct 2026). */
export const SMSF_HAVE = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
  { id: "considering", label: "Considering one" },
];
export const SMSF_WHEN = [
  { id: "asap", label: "As soon as possible" },
  { id: "month", label: "Within a month" },
  { id: "exploring", label: "Just exploring" },
];

export const SMSF_MODES = BIZ_MODES;

/** The landing page (owner's "smsf" design picture). Footer links and copyright are shared with the business page. */
export const SMSF_LANDING = {
  ...BIZ_LANDING,
  /** headline: line 1, then the green part and the navy end of line 2 */
  h1: ["Looking for", "SMSF or wealth", "advice?"],
  sub: "Let us do the heavy lifting and connect you with one local accountant to discuss your SMSF and advisory needs.",
  steps: [
    { icon: "doc", text: ["Tell us", "your needs"] },
    { icon: "pin", text: ["Enter your", "postcode"] },
    { icon: "people", text: ["Get matched", "with one accountant"] },
  ],
  benefits: [
    { icon: "pin", text: ["Local", "support"] },
    { icon: "people", text: ["One accountant", "per area"] },
    { icon: "shield", text: ["Free", "matching"] },
  ],
  script: ["The smarter way to plan", "your next chapter."],
  disclaimer: [
    "Your accountant handles accounting services and can discuss access to appropriately licensed financial advice.",
    "Matching is free. Professional fees are agreed separately. Financial advice requires an appropriately licensed adviser.",
  ],
};

/** The SMSF match box: home page box layout (owner, 5 Oct 2026), SMSF wording. */
export const SMSF_CARD = {
  eyebrow: "Your Accountant Match",
  title: ["Your SMSF & wealth", "match starts here."],
  sub: "One local accountant, never a list.",
  question: "What do you need help with?",
  hint: "Select all that apply.",
  start: "Start My Match",
  note: ["60 seconds", "Free", "No obligation"],
  footer: "Your details go to one local accountant only.",
  error: "Please select at least one option to continue.",
};

/** Every questionnaire page. {name} is the visitor's first name (owner's name rule, 5 Oct 2026). */
export const SMSF_Q = {
  ...BIZ_Q,
  badge: "Your SMSF Match in Progress",
  categoryHelp: "Select all that apply — we’ll use these to match you with a local accountant who looks after {category}.",
  qualify: {
    eyebrow: "A few quick questions",
    title: "Just a couple of quick questions",
    have: "Do you currently have an SMSF?",
    when: "When do you need help?",
    noteLabel: "Anything else you’d like your accountant to know? (optional)",
    notePlaceholder: "For example: a deadline, an ATO letter, or the size of the fund…",
  },
  summaryLabels: {
    about: "About you",
    have: "Currently have an SMSF",
    when: "Help needed",
    notes: "Note for your accountant",
  },
  errors: {
    ...BIZ_Q.errors,
    have: "Please tell us if you currently have an SMSF.",
    when: "Please tell us when you need help.",
  },
  found: { ...BIZ_Q.found, placeholder: "you@example.com" },
};

/** Match page (/match) wording that differs for SMSF customers (the rest is BIZ_MATCH). */
export const SMSF_MATCH = {
  titleEm: "SMSF accountant.",
  sub: "One local accountant. Ready to discuss your SMSF and super needs.",
  fit: {
    area: { title: "Your area", text: "A local partner for your postcode." },
    services: { title: "Relevant services", text: "The firm offers the SMSF services you selected." },
    experience: { title: "Experienced support", text: "{years} years working with SMSF clients." },
  },
  disclaimer: "Your enquiry is shared with this accountant only. Matching is free; professional fees are agreed separately. Your accountant can discuss access to appropriately licensed financial advice.",
};
