/**
 * REGISTRATION AD QUESTIONNAIRE — wording for the registration ad landing page (/ad-4) and its own questionnaire.
 * Owner's wording (6 Oct 2026) and the owner's "registration" ad design picture. Edit the words here.
 *
 * Flow: one page per ticked category (match box) → new or existing business? (+ optional note) → name → summary (confirm)
 * → in person or remote → postcode/suburb → short pause → "great news" box with email → mobile → email the match
 * details? → match page (/match). Each page counts as one step in the progress bar (max 5 milestones).
 */
import { BIZ_LANDING, BIZ_MODES, BIZ_Q, type BizCategory, type BizOption } from "./business-questionnaire";

const other = (prefix: string): BizOption => ({ id: `${prefix}_other`, label: "Other — tell us what you need", other: true });

/** Same shape as the business categories (title in the questionnaire, short box name and line on the match box). */
export const REG_CATEGORIES: BizCategory[] = [
  {
    id: "company",
    title: "Company registration",
    desc: "New companies and corporate trustees.",
    box: { title: "Company Registration", desc: "New company or corporate trustee" },
    tone: "blue",
    options: [
      { id: "new_company", label: "Register a new company" },
      { id: "corporate_trustee", label: "Set up a corporate trustee company" },
      { id: "sole_to_company", label: "Move from sole trader to a company" },
      { id: "company_plus_tax", label: "Company registration plus ABN and tax registrations" },
      other("company"),
    ],
  },
  {
    id: "abn_tax",
    title: "ABN & tax registrations",
    desc: "ABN, GST, PAYG withholding and TFN.",
    box: { title: "ABN & Tax Registrations", desc: "ABN, GST, PAYG and TFN" },
    tone: "green",
    options: [
      { id: "abn", label: "Apply for an ABN" },
      { id: "gst", label: "Register for GST" },
      { id: "payg", label: "Register for PAYG withholding—as an employer" },
      { id: "tfn", label: "Apply for a business or trust TFN" },
      { id: "review_regs", label: "Review or update existing registrations" },
      { id: "abn_tax_unsure", label: "Help choosing which registrations I need" },
      other("abn_tax"),
    ],
  },
  {
    id: "business_name",
    title: "Business name registration",
    desc: "Register, renew, transfer or update a name.",
    box: { title: "Business Name Registration", desc: "Register, renew or transfer" },
    tone: "orange",
    options: [
      { id: "new_name", label: "Register a new business name" },
      { id: "renew_name", label: "Renew an existing business name" },
      { id: "transfer_name", label: "Transfer a business name" },
      { id: "update_name", label: "Update business-name details" },
      { id: "name_plus_abn", label: "Business name plus ABN application" },
      other("business_name"),
    ],
  },
  {
    id: "structure",
    title: "Business structure & setup",
    desc: "Choosing and setting up the right structure.",
    box: { title: "Business Structure & Setup", desc: "Sole trader, partnership or trust" },
    tone: "purple",
    options: [
      { id: "choose_structure", label: "Help choosing a business structure" },
      { id: "sole_trader", label: "Set up as a sole trader" },
      { id: "partnership", label: "Set up a partnership" },
      { id: "trust", label: "Set up a trust" },
      { id: "review_structure", label: "Review or change my existing structure" },
      { id: "full_setup", label: "Complete new-business setup—multiple registrations" },
      other("structure"),
    ],
  },
];

/** "Is this a new or existing business?" (owner, 6 Oct 2026). */
export const REG_STAGE = [
  { id: "new", label: "New" },
  { id: "existing", label: "Existing" },
];

export const REG_MODES = BIZ_MODES;

/** The landing page (owner's "registration" design picture). Footer links and copyright are shared with the business page. */
export const REG_LANDING = {
  ...BIZ_LANDING,
  /** headline lines; words between asterisks are green */
  h1: ["Starting a *business* or", "need *registrations?*"],
  sub: "Let us do the heavy lifting and connect you with one local accountant to help get your registrations sorted.",
  steps: ["Tell us your needs", "Enter your postcode", "Get matched with one accountant"],
  benefits: [
    { icon: "people", text: ["Local", "support"] },
    { icon: "person", text: ["One accountant", "per area"] },
    { icon: "shield", text: ["Free", "matching"] },
  ],
  script: ["The smarter way", "to get started."],
  disclaimer: "We provide the matching service. Your accountant provides the accounting services. Matching is free. Accountant and government fees may apply.",
};

/** The registration match box: home page box layout (owner, 5 Oct 2026), registration wording. */
export const REG_CARD = {
  eyebrow: "Your Accountant Match",
  title: ["Your registration", "match starts here."],
  // the design's "Your enquiry goes to one local accountant, never a list." wraps on tablets/small laptops and changes the
  // box size, so shortened as on Ads 2 and 3 (box rule: same size as the home box)
  sub: "One local accountant, never a list.",
  question: "What do you need help with?",
  hint: "Select all that apply.",
  start: "Start My Match",
  note: ["60 seconds", "Free", "No obligation"],
  // the design's "Matching is free. Accountant and government fees may apply." is in the page's small print instead (it
  // wraps in the mint band on small laptops and changes the box size)
  footer: "Your details go to one local accountant only.",
  error: "Please select at least one option to continue.",
};

/** Every questionnaire page. {name} is the visitor's first name (owner's name rule, 5 Oct 2026). */
export const REG_Q = {
  ...BIZ_Q,
  badge: "Your Registration Match in Progress",
  categoryHelp: "Select all that apply — we’ll use these to match you with a local accountant who can help with {category}.",
  qualify: {
    eyebrow: "One quick question",
    title: "Is this a new or existing business?",
    noteLabel: "Anything else your accountant should know? (optional)",
    notePlaceholder: "For example: a deadline, your business type, or registrations you already have…",
  },
  summaryLabels: {
    about: "About your business",
    stage: "New or existing",
    notes: "Note for your accountant",
  },
  errors: {
    ...BIZ_Q.errors,
    stage: "Please tell us if this is a new or existing business.",
  },
  found: {
    ...BIZ_Q.found,
    title: "Great news, {name} — we’ve found your perfect local match in {place}.",
    text: "Now we just need your email address to send you your match details.",
    placeholder: "you@example.com",
  },
  phone: {
    ...BIZ_Q.phone,
    title: "Thank you {name}, now your mobile number please so your accountant can reach you.",
  },
};

/** Match page (/match) wording that differs for registration customers (the rest is BIZ_MATCH). */
export const REG_MATCH = {
  titleEm: "accountant.",
  sub: "One local accountant. Ready to discuss setting up your business.",
  fit: {
    area: { title: "Your area", text: "A local partner for your postcode." },
    services: { title: "Relevant services", text: "The firm offers the registration services you selected." },
    experience: { title: "Experienced support", text: "{years} years working with new and growing businesses." },
  },
  disclaimer: "Your enquiry is shared with this accountant only. Matching is free; accountant fees are agreed separately and government fees may apply.",
};
