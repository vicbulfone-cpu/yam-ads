/**
 * BUSINESS AD QUESTIONNAIRE — wording for the business ad landing page (/ad-1) and its own questionnaire.
 * Owner's wording (5 Oct 2026) and the owner's "business" ad design picture. Edit the words here.
 *
 * Flow: one page per ticked category → summary (confirm) → in person or remote → postcode/suburb → short pause →
 * "great news" box with email → mobile → name → email the match details? → match page (/match).
 */
import { CREDENTIAL } from "./wording";

export interface BizOption {
  id: string;
  label: string;
  /** shows a "tell us what you need" text box when ticked */
  other?: boolean;
  /** reveals the "Which software?" choice when ticked */
  software?: boolean;
}

export interface BizCategory {
  id: string;
  /** name on the match box and the questionnaire page */
  title: string;
  /** one line under the name on the match box */
  desc: string;
  /** shorter name and line shown on the match box, so each fits one line at the home page box's text size
   *  (as the home box does: "Personal Tax & Planning" for "Personal Tax Returns and Planning") */
  box: { title: string; desc: string };
  /** icon tone on the match box: matches the design picture */
  tone: "blue" | "green" | "orange" | "purple";
  options: BizOption[];
}

// ("Not sure — help me choose" removed from every question, owner 7 Oct 2026)
const extras = (prefix: string): BizOption[] => [
  { id: `${prefix}_other`, label: "Other — tell us what you need", other: true },
];

export const BIZ_CATEGORIES: BizCategory[] = [
  {
    id: "biz_tax",
    title: "Business tax & compliance",
    desc: "Returns, BAS, GST, PAYG and overdue lodgements.",
    box: { title: "Business Tax & Compliance", desc: "Tax returns, BAS, GST and PAYG" },
    tone: "blue",
    options: [
      { id: "sole_trader_return", label: "Sole trader tax return" },
      { id: "entity_return", label: "Company, partnership or trust tax return" },
      { id: "bas_gst", label: "BAS & GST" },
      { id: "payg", label: "PAYG instalments & withholding" },
      { id: "late_returns", label: "Late or overdue tax returns" },
      { id: "overdue_bas", label: "Overdue BAS & catch-up lodgements" },
      { id: "ato_enquiries", label: "ATO enquiries, notices or reviews" },
      ...extras("biz_tax"),
    ],
  },
  {
    id: "bookkeeping",
    title: "Bookkeeping & payroll",
    desc: "Bookkeeping, payroll, super and accounting software.",
    box: { title: "Bookkeeping & Payroll", desc: "Payroll, super and accounting software" },
    tone: "green",
    options: [
      { id: "ongoing_bookkeeping", label: "Ongoing bookkeeping" },
      { id: "catchup_bookkeeping", label: "Catch-up bookkeeping" },
      { id: "payroll_setup", label: "Payroll & employee setup" },
      { id: "stp", label: "Single Touch Payroll (STP)" },
      { id: "employee_super", label: "Employee superannuation" },
      { id: "software_setup", label: "Accounting software setup or migration", software: true },
      { id: "software_help", label: "Xero, MYOB or QuickBooks help", software: true },
      ...extras("bookkeeping"),
    ],
  },
  {
    id: "planning",
    title: "Tax planning & business structure",
    desc: "Tax planning, business structures and financial reporting.",
    box: { title: "Tax Planning & Structure", desc: "Structures, planning and reporting" },
    tone: "orange",
    options: [
      { id: "tax_planning", label: "Business tax planning" },
      { id: "choose_structure", label: "Choosing a business structure" },
      { id: "review_structure", label: "Reviewing or changing an existing structure" },
      { id: "entity_setup", label: "Company or trust setup" },
      { id: "financial_statements", label: "Financial statements & reporting" },
      { id: "depreciation", label: "Asset purchases & depreciation planning" },
      { id: "sale_succession_tax", label: "Business sale or succession tax planning" },
      ...extras("planning"),
    ],
  },
  {
    id: "advice",
    title: "Cash flow & business advice",
    desc: "Budgeting, cash flow and support for your next step.",
    box: { title: "Cash Flow & Advice", desc: "Budgeting, cash flow and growth" },
    tone: "purple",
    options: [
      { id: "cashflow_forecast", label: "Cash flow forecasting" },
      { id: "budgeting", label: "Budgeting & financial planning for my business" },
      { id: "profitability", label: "Improving profitability" },
      { id: "starting", label: "Starting a business" },
      { id: "growing", label: "Growing or expanding a business" },
      { id: "finance_prep", label: "Business finance preparation" },
      { id: "buy_sell", label: "Buying or selling a business" },
      { id: "succession", label: "Succession & exit planning" },
      ...extras("advice"),
    ],
  },
];

export const BIZ_SOFTWARE = ["Xero", "MYOB", "QuickBooks", "Other", "Help me choose"];

export const BIZ_MODES = [
  { id: "in_person", label: "In person", desc: "Meet face to face at their office." },
  { id: "remote", label: "Remotely", desc: "Phone, video and email." },
];

/** The landing page (owner's "business" design picture). */
export const BIZ_LANDING = {
  badge: "Free matching. No obligation.",
  h1: ["Looking for a", "business accountant", "near you?"],
  sub: "Let us do the heavy lifting and connect you with one local accountant for your business needs.",
  steps: ["Tell us your needs", "Enter your postcode", "Get matched with one accountant"],
  benefits: [
    { icon: "pin", text: ["Local", "expertise"] },
    { icon: "people", text: ["One accountant", "per area"] },
    { icon: "handshake", text: ["Free", "matching"] },
  ],
  script: ["The smarter way to find", "a business accountant."],
  disclaimer: "We provide the matching service. Your accountant provides the accounting services.",
  trust: [
    { icon: "shield", text: "Your details are never sold to multiple accountants." },
    { icon: "people", text: "One local accountant per area." },
    { icon: "thumb", text: "Your needs, your area, your accountant." },
  ],
  copyright: "Your Accountant Match",
  based: ["Based in Melbourne", "Connecting customers with accountants across Australia"],
  links: [
    { text: "How it works", href: "/how-it-works" },
    { text: "About us", href: "/about" },
    { text: "How we select accountants", href: "/how-we-select-accountants" },
    { text: "Contact & business details", href: "/contact" },
    { text: "Privacy", href: "/privacy" },
    { text: "Terms", href: "/terms" },
  ],
};

/** The business match box. */
export const BIZ_CARD = {
  eyebrow: "Your Accountant Match",
  title: ["Let’s find your", "business accountant."],
  sub: ["One local accountant.", "Matched to your needs."],
  question: "What does your business need?",
  hint: "Select all that apply.",
  start: "Start My Business Match",
  note: ["60 seconds", "Free", "No obligation"],
  footer: ["Your details go to one local accountant only.", "Matching is free. Accountant fees are agreed separately."],
  error: "Please select at least one option to continue.",
};

/** Every questionnaire page.
 *  RULE (owner, 5 Oct 2026): the name is asked straight after the service pages, and every question after that uses the
 *  visitor's first name. {name} below is replaced with it (e.g. "John, could I please have your mobile number…"). */
export const BIZ_Q = {
  badge: "Your Business Match in Progress",
  stepOf: "Step {n} of {total}",
  categoryOf: "Category {n} of {total}",
  categoryHelp: "Select all that apply — we’ll use these to match you with a local accountant who looks after {category}.",
  otherLabel: "Tell us what you need",
  otherPlaceholder: "A sentence or two is plenty…",
  softwareHeading: "Which software do you need help with?",
  back: "Back",
  next: "Next",
  errors: {
    category: "Please select at least one option to continue.",
    software: "Please choose a software option to continue.",
    other: "Please tell us a little about what you need.",
    mode: "Please choose an option to continue.",
    location: "Please choose your suburb from the list.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid Australian mobile number.",
    name: "Please enter your name.",
    emailMe: "Please choose yes or no.",
    send: "Something went wrong sending your details. Please try again.",
  },
  summary: {
    eyebrow: "Your summary",
    title: "{name}, here’s what you told us you need help with",
    text: "Please check your selections, {name}. You can change anything before we look for your accountant.",
    edit: "Change",
    softwarePrefix: "Software:",
    confirm: "Confirm and continue",
  },
  mode: {
    eyebrow: "How you’d like to work",
    title: "{name}, would you prefer this service in person or remotely?",
  },
  location: {
    eyebrow: "Your area",
    title: "{name}, which postcode or suburb do you need an accountant in?",
    label: "Postcode or suburb",
    placeholder: "e.g. 3166 or Hughesdale",
    loading: "Loading suburbs…",
    none: "No matching suburbs. Check the postcode or try the suburb name.",
    find: "Find my accountant",
  },
  searching: {
    title: "Searching for your local accountant, {name}…",
    near: "Checking our partner accountants near {place}",
  },
  found: {
    title: "Great news, {name} — we’ve found a local match for you.",
    text: "{name}, could I please have your email address so we can send you your match details",
    label: "Your email address",
    placeholder: "you@business.com.au",
    button: "Continue",
  },
  phone: {
    eyebrow: "Your mobile",
    title: "{name}, could I please have your mobile number so your accountant can reach you?",
    label: "Mobile number",
    placeholder: "04xx xxx xxx",
    note: "Your phone number is only shared with your matched accountant, who may call to better understand your needs before providing a quote.",
  },
  name: {
    eyebrow: "About you",
    title: "Hi, what is your name please",
    label: "Your name",
    /** light grey hint inside the box (owner, 7 Oct 2026) */
    placeholder: "First name only, that’s fine",
  },
  emailMe: {
    eyebrow: "Last step",
    title: "{name}, would you like your match details emailed to you?",
    yes: "Yes, email them to me",
    no: "No thanks",
    to: "We’ll send them to {email}.",
    submit: "Show my match",
    sending: "Preparing your match…",
  },
};

/** Browser-tab storage key: the customer's own answers, passed from the questionnaire to the match page. */
export const BIZ_MATCH_KEY = "yam:biz-match";

/** The match page (/match). */
/** Match page wording (owner's "match page" design, 7 Oct 2026). {first} = the accountant's first name, {years} = their
 *  years of experience, {email} = the customer's email. The other questionnaires override the words that differ. */
export const BIZ_MATCH = {
  complete: "Match complete",
  sampleTag: ["Illustrative profile", "Sample details"],
  titleLead: "Meet your",
  titleEm: "business accountant.",
  sub: "One local accountant. Ready to discuss your business needs.",
  emailed: "We’ve also emailed these details to {email}.",
  experience: "{years} years’ experience",
  sampleClaim: "(sample profile claim)",
  callLabel: "Call {first}",
  emailLabel: "Email {first}",
  webLabel: "Visit accountant’s website",
  selectedTitle: "Your selected services",
  fitTitle: "Why this looks like a good fit",
  fit: {
    area: { title: "Your area", text: "A local partner for your postcode." },
    services: { title: "Relevant services", text: "The firm offers the business services you selected." },
    experience: { title: "Experienced support", text: "{years} years working with business accounting clients." },
  },
  /** More detail in "Why this looks like a good fit" (owner, 7 Oct 2026), shared by every questionnaire. {place} = the
   *  customer's suburb, state and postcode; only true, already-approved statements. */
  fitMore: {
    areaPlace: "A local partner for your postcode: {place}.",
    servicesMore: "Your enquiry goes to someone who does this work every day.",
    mode: { title: "How you like to work", inPerson: "You’d like to meet in person at their office.", remote: "You’d like to work remotely, by phone, video and email." },
    registered: { title: "Professionally registered", text: CREDENTIAL },
    oneMatch: { title: "One accountant, not a list", text: "Your details go to this accountant only, so there are no calls from multiple firms." },
  },
  fitNote: "Service suitability and availability are confirmed directly with the accountant.",
  nextTitle: "Ready to take the next step?",
  nextLead: "Please feel free to contact your accountant directly for immediate assistance.",
  nextText: "Discuss your needs, confirm availability and agree on fees before proceeding.",
  contactDirect: "Contact {first} directly",
  sample: "Sample accountant shown — the real match appears here once the lead system is connected.",
  disclaimer: "Your enquiry is shared with this accountant only. Matching is free; accountant fees are agreed separately.",
};
