/**
 * REGISTRATION AD PAGE (/ad-4): the personal tax page's sections with the owner's registration wording (9 Oct 2026),
 * changed one section at a time. Shown via RegistrationAdPage.tsx.
 */
import { PERSONAL_RIGHT_FIT, PERSONAL_SERVICES, PERSONAL_WHY } from "./personal-sections";

/** hero headline (two lines: navy, then green, as the SMSF page) and the line under it (owner, 9 Oct 2026) */
export const REG_HERO = {
  h1: ["Business & Company", "Registration Services"],
  sub: "Get your ABN, TFN, business name, and company setup sorted with the help of a trusted, local specialist. We'll match you with the right professional for your registration needs.",
};

/** section 2 with the owner's registration wording (9 Oct 2026). Text only: each card keeps the icon of the personal
 *  card in the same place ("iconOf"). */
export const REG_SERVICES = {
  eyebrow: PERSONAL_SERVICES.eyebrow,
  h2: "Business & Company Registration Services",
  intro: "Whether you are starting a new business, setting up a company, or registering for tax requirements, find a specialist who understands your setup needs.",
  cards: [
    { iconOf: "Individual Tax Returns", title: "ABN & TFN Registrations", text: "Get fast, accurate help applying for your Australian Business Number (ABN) and Tax File Number (TFN)." },
    { iconOf: "Tax Deductions", title: "Business Name Registration", text: "Reserve and register your official national business name with ASIC hassle-free." },
    { iconOf: "Rental Property Tax", title: "Company Setup (Pty Ltd)", text: "Complete company incorporation, ASIC registrations, legal governance, and share structure setups." },
    { iconOf: "Investments & Shares", title: "GST & PAYG Withholding Setup", text: "Register your business for GST, PAYG withholding, and Single Touch Payroll (STP) readiness with the ATO." },
    { iconOf: "Contractor & Freelance Income", title: "Trust & Partnership Establishments", text: "Expert guidance on drafting trust deeds, applying for trust ABNs, or structuring partnership agreements." },
    { iconOf: "More Complex Tax Returns", title: "Business Structure Advisory", text: "Get tailored professional advice on choosing the right legal entity—Sole Trader, Company, or Trust—before you launch." },
  ],
};

/** "Why Use an Accountant" with the owner's registration wording (9 Oct 2026). Text only: the label, badge and each
 *  point's icon stay as on the personal page (same order). */
const WHY_POINTS = [
  { title: "Understand your registration obligations", text: "Get clear advice on which tax registrations, licenses, and business structures apply to your situation." },
  { title: "Choose the right legal structure", text: "Decide whether setting up as a Sole Trader, Pty Ltd Company, Partnership, or Trust is best for your goals." },
  { title: "Organise required business details", text: "Gather and prepare director information, shareholder details, business addresses, and consent forms smoothly." },
  { title: "Prepare and submit registration applications", text: "Get complete, accurate, and compliant applications for your ABN, business name, and company incorporation." },
  { title: "Lodge on time with ASIC and the ATO", text: "Ensure all business setups and tax registrations are lodged correctly from day one without regulatory delays." },
  { title: "Handle complex multi-entity setups", text: "Get specialized support for corporate trustees, discretionary family trusts, or multi-shareholder company setups." },
  { title: "Help you avoid costly setup errors", text: "Reduce the risk of incorrect ownership structures, legal errors, or administrative penalties down the line." },
  { title: "Explain ongoing compliance responsibilities", text: "Stay informed on annual ASIC review fees, company solvency declarations, and ATO reporting obligations." },
  { title: "Provide tailored advice for business launch", text: "Get personalised guidance on bank account setups, software choices (Xero/MYOB), and tax account readiness." },
  { title: "Help you respond to ASIC or ATO setup queries", text: "Have complete peace of mind with professional support if ASIC or the ATO requests additional verification." },
];
export const REG_WHY = {
  ...PERSONAL_WHY,
  h2: "Why Use a Specialist for Your Business Registration?",
  h2Accent: "Business Registration?",
  intro: [
    "Finding the right registration specialist should be simple, fast and hassle-free. Your Accountant Match takes the guesswork out of launching a business by connecting you with a professional suited to your exact legal and accounting needs. Skip the endless directory searches and get matched with a specialist who understands business setup and ASIC/ATO compliance.",
    "Get expert help choosing the right business structure, avoiding costly registration errors, and making setup easier. Less searching, less stress and more confidence that your business registration is in expert hands.",
  ],
  lead: "An experienced specialist can help you:",
  points: PERSONAL_WHY.points.map((p, i) => ({ ...p, ...WHY_POINTS[i] })),
};

/** "Who we help" with the owner's registration wording (9 Oct 2026). Text only: each tile keeps the icon of the
 *  personal tile in the same place ("iconOf"). */
export const REG_RIGHT_FIT = {
  ...PERSONAL_RIGHT_FIT,
  h2: "Find the Right Specialist for Your Registration Needs",
  lead: "Not every business registration process is the same.",
  text: "Whether you're starting out as a sole trader, incorporating a new Pty Ltd company, or establishing a family trust, Your Accountant Match helps you find a specialist suited to your setup.",
  tiles: [
    { label: "New Business Entrants & Sole Traders", iconOf: "Employees" },
    { label: "Company Directors & Pty Ltd Startups", iconOf: "Investors" },
    { label: "Trustees & Family Trusts", iconOf: "Landlords" },
    { label: "Partnerships & Joint Ventures", iconOf: "Contractors" },
    { label: "Established Businesses Restructuring", iconOf: "Self-employed" },
  ],
};
