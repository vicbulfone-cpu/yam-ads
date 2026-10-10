/**
 * HOME PAGE "Why Use a Specialist Accountant?" (owner, 10 Oct 2026, noc): straight under the hero. Laid out like the ad
 * pages' "Why Use…" section (eyebrow, heading with green words, two intro paragraphs), the intro reworded to be about
 * accounting in general, then the four services, each with six of its ad page's ten "can help you" points (same words):
 * the six that name what people search for most (tax return, deductions, BAS, bookkeeping, SMSF audit, ABN, company
 * setup, ATO audits…). Shown by HomeWhySpecialist.tsx.
 */
import { PERSONAL_WHY } from "./personal-sections";

export const HOME_WHY = {
  eyebrow: "Accounting, made easier",
  h2: "Why Use a Specialist Accountant?",
  h2Accent: "Specialist Accountant?",
  intro: [
    "Finding the right accountant should be simple, fast and hassle-free. Your Accountant Match takes the guesswork out of choosing an accountant by connecting you with a local professional suited to your exact tax and accounting needs. Skip the endless directory searches and get matched with an accountant who understands your situation and ATO compliance.",
    "Get expert help meeting your obligations, avoiding costly mistakes and making tax time easier. Less searching, less stress and more confidence that your accounting is in expert hands.",
  ],
  lead: "An experienced specialist can help you:",
};

const personal = (n: number) => ({ title: PERSONAL_WHY.points[n].title, text: PERSONAL_WHY.points[n].text });

/** each service's six points, word for word from its ad page (src/content/*-sections.ts) */
export const HOME_WHY_SERVICES: { key: string; name: string; who: string; points: { title: string; text: string }[] }[] = [
  {
    key: "personal",
    name: "Personal Tax",
    who: "Individuals, investors & landlords",
    // personal-sections.ts: deductions, tax return, lodging, complex (property/investments), ATO, obligations; then one
    // point of its own, so the card (shorter lines than the others) fills its box like the other three (owner, 10 Oct 2026, noc)
    points: [personal(1), personal(3), personal(4), personal(5), personal(9), personal(0),
      { title: "Maximise your tax refund", text: "Get the best legitimate result from your return, with nothing missed and nothing overclaimed." }],
  },
  {
    key: "business",
    name: "Business Tax & BAS",
    who: "Sole traders, companies & trusts",
    points: [
      { title: "Identify applicable business deductions & write-offs", text: "Make sure you claim every eligible business expense, asset depreciation and tax offset." },
      { title: "Prepare your business tax returns & BAS", text: "Get complete, accurate and fully compliant tax returns and Business Activity Statements." },
      { title: "Lodge on time with the ATO", text: "Have your business tax returns, BAS and payroll reports lodged correctly to avoid ATO penalties." },
      { title: "Organise your financial & accounting records", text: "Set up efficient bookkeeping systems, manage record-keeping and get your accounts ready for tax time." },
      { title: "Manage complex business structures", text: "Get specialized support for companies, family trusts, partnerships or multi-entity operations." },
      { title: "Help you respond to ATO queries or audits", text: "Have complete peace of mind with professional representation if the ATO contacts your business." },
    ],
  },
  {
    key: "smsf",
    name: "SMSF & Super",
    who: "Trustees & self-managed super funds",
    points: [
      { title: "Prepare your annual SMSF financial accounts", text: "Get complete, accurate, and compliant balance sheets, income statements, and tax calculations." },
      { title: "Lodge your SMSF Annual Return (SAR) on time", text: "Have your fund's tax return and regulatory reporting prepared and lodged correctly with the ATO." },
      { title: "Coordinate mandatory independent SMSF audits", text: "Streamline the audit process by working with accountants who coordinate directly with ASIC-registered auditors." },
      { title: "Maximize fund tax concessions & allowable credits", text: "Ensure your fund correctly accesses the 15% concessional tax rate, franking credits, and CGT discounts." },
      { title: "Help you avoid common SMSF compliance mistakes", text: "Reduce the risk of regulatory breaches, unexpected penalty taxes, or disqualified trustee issues." },
      { title: "Help you respond to ATO super queries or audits", text: "Have complete peace of mind with professional support and representation if the ATO contacts your fund." },
    ],
  },
  {
    key: "registration",
    name: "Business Registration",
    who: "ABN, business name & company setup",
    points: [
      { title: "Choose the right legal structure", text: "Decide whether setting up as a Sole Trader, Pty Ltd Company, Partnership, or Trust is best for your goals." },
      { title: "Prepare and submit registration applications", text: "Get complete, accurate, and compliant applications for your ABN, business name, and company incorporation." },
      { title: "Lodge on time with ASIC and the ATO", text: "Ensure all business setups and tax registrations are lodged correctly from day one without regulatory delays." },
      { title: "Understand your registration obligations", text: "Get clear advice on which tax registrations, licenses, and business structures apply to your situation." },
      { title: "Handle complex multi-entity setups", text: "Get specialized support for corporate trustees, discretionary family trusts, or multi-shareholder company setups." },
      { title: "Help you avoid costly setup errors", text: "Reduce the risk of incorrect ownership structures, legal errors, or administrative penalties down the line." },
    ],
  },
];
