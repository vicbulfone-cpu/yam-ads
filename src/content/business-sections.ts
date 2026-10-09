/**
 * BUSINESS AD PAGE (/ad-1): the personal tax page's sections with the owner's business wording (9 Oct 2026), changed
 * one section at a time. Text only: each card keeps the icon of the personal card in the same place ("iconOf").
 * Shown by src/components/ads/PersonalSections.tsx and the FAQ (AdHomeSections) via BusinessAdPage.tsx.
 */
import { PERSONAL_RIGHT_FIT, PERSONAL_SERVICES, PERSONAL_WHY } from "./personal-sections";

/** hero headline (three lines: navy, then two green, as the personal page) and the line under it (owner, 9 Oct 2026) */
export const BUSINESS_HERO = {
  h1: ["Business Tax", "Accountants &", "BAS Services"],
  sub: "Get your business tax, BAS, and accounting sorted with the help of a trusted, local accountant. We'll match you with the right professional for your business needs.",
};

export const BUSINESS_SERVICES = {
  eyebrow: PERSONAL_SERVICES.eyebrow,
  h2: "Business Tax & BAS Services",
  intro: "Whether you need annual company tax returns, regular BAS lodgements, or ongoing financial support, find an accountant who understands your business.",
  cards: [
    { iconOf: "Individual Tax Returns", title: "Company & Business Tax Returns", text: "Get help preparing and lodging tax returns for sole traders, Pty Ltd companies, partnerships, and trusts." },
    { iconOf: "Tax Deductions", title: "BAS & GST Compliance", text: "Find an accountant to handle your Business Activity Statements, GST reporting, and ATO lodgements on time." },
    { iconOf: "Rental Property Tax", title: "Bookkeeping & Payroll", text: "Assistance with day-to-day bookkeeping, Single Touch Payroll (STP), and setting up Xero or MYOB." },
    { iconOf: "Investments & Shares", title: "Sole Trader & Contractor Tax", text: "Tailored accounting support for sole traders and freelancers managing business expenses and income." },
    { iconOf: "Contractor & Freelance Income", title: "Business Structure & Setup", text: "Guidance on choosing, setting up, or restructuring as a Sole Trader, Company (Pty Ltd), or Trust." },
    { iconOf: "More Complex Tax Returns", title: "Tax Planning & Advisory", text: "Proactive advice on business tax strategies, cash flow planning, and legal expense write-offs." },
  ],
};

/** "Why Use an Accountant" with the owner's business wording (9 Oct 2026). Text only: the label, badge and each
 *  point's icon stay as on the personal page (same order). */
const WHY_POINTS = [
  { title: "Understand your business tax obligations", text: "Get clear advice on company tax, BAS, GST and payroll rules based on your entity structure." },
  { title: "Identify applicable business deductions & write-offs", text: "Make sure you claim every eligible business expense, asset depreciation and tax offset." },
  { title: "Organise your financial & accounting records", text: "Set up efficient bookkeeping systems, manage record-keeping and get your accounts ready for tax time." },
  { title: "Prepare your business tax returns & BAS", text: "Get complete, accurate and fully compliant tax returns and Business Activity Statements." },
  { title: "Lodge on time with the ATO", text: "Have your business tax returns, BAS and payroll reports lodged correctly to avoid ATO penalties." },
  { title: "Manage complex business structures", text: "Get specialized support for companies, family trusts, partnerships or multi-entity operations." },
  { title: "Help you avoid costly accounting mistakes", text: "Reduce the risk of reporting errors, non-compliance penalties or missed reporting deadlines." },
  { title: "Explain how tax rule changes affect your business", text: "Stay informed on legislative updates, small business concessions and future tax planning." },
  { title: "Provide tailored business growth & cash flow advice", text: "Get actionable insights based on your commercial goals, profit margins and revenue streams." },
  { title: "Help you respond to ATO queries or audits", text: "Have complete peace of mind with professional representation if the ATO contacts your business." },
];
export const BUSINESS_WHY = {
  ...PERSONAL_WHY,
  h2: "Why Use an Accountant for Your Business Tax?",
  h2Accent: "Business Tax?",
  intro: [
    "Finding the right business tax accountant should be simple, fast and hassle-free. Your Accountant Match takes the guesswork out of choosing an accountant by connecting you with a professional suited to your business accounting needs. Skip the endless directory searches and get matched with an accountant who understands your structure and industry.",
    "Get expert help identifying eligible business write-offs, maintaining BAS compliance, avoiding costly mistakes and making tax time easier. Less searching, less stress and more confidence that your business accounting is in the right hands.",
  ],
  lead: "An experienced business accountant can help you:",
  points: PERSONAL_WHY.points.map((p, i) => ({ ...p, ...WHY_POINTS[i] })),
};

/** "Who we help" with the owner's business wording (9 Oct 2026). Text only: each tile keeps the icon of the personal
 *  tile in the same place ("iconOf"). */
export const BUSINESS_RIGHT_FIT = {
  ...PERSONAL_RIGHT_FIT,
  h2: "Find the Right Accountant for Your Business Needs",
  lead: "Not every business has the same accounting requirements.",
  text: "Whether you're a sole trader, small business owner, company director, partner, or trust trustee, Your Accountant Match helps you find an accountant suited to your exact business structure and industry.",
  tiles: [
    { label: "Sole Traders", iconOf: "Employees" },
    { label: "Small Businesses", iconOf: "Investors" },
    { label: "Pty Ltd Companies", iconOf: "Landlords" },
    { label: "Partnerships", iconOf: "Contractors" },
    { label: "Family Trusts", iconOf: "Self-employed" },
  ],
};

/** the four business questions replacing the personal ones (owner, 9 Oct 2026: questions from the owner's list 2;
 *  answers are general information only, no advice, figures or dates) */
export const BUSINESS_FAQ = {
  items: [
    { q: "How do I find a business tax accountant?", a: "Your Accountant Match helps you find an accountant based on your business structure and the type of business tax or accounting help you need." },
    { q: "Can an accountant help with BAS and GST lodgements?", a: "Yes. Many accountants prepare and lodge Business Activity Statements and help businesses keep their GST reporting accurate and on time." },
    { q: "Can an accountant handle bookkeeping and payroll?", a: "Yes. Many accountants offer bookkeeping and payroll support, including Single Touch Payroll and setting up accounting software such as Xero or MYOB." },
    { q: "Can an accountant assist with company and trust tax returns?", a: "Yes. Accountants commonly prepare and lodge tax returns for Pty Ltd companies, trusts and partnerships, as well as for sole traders." },
  ],
};
