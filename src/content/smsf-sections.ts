/**
 * SMSF AD PAGE (/ad-3): the personal tax page's sections with the owner's SMSF wording (9 Oct 2026), changed one
 * section at a time. Shown via SmsfAdPage.tsx.
 */
import { PERSONAL_RIGHT_FIT, PERSONAL_SERVICES, PERSONAL_WHY } from "./personal-sections";

/** hero headline (two lines: navy, then green) and the line under it (owner, 9 Oct 2026) */
export const SMSF_HERO = {
  h1: ["SMSF Accountants", "& Setup Specialists"], // two lines (owner, 9 Oct 2026)
  sub: "Get your Self-Managed Super Fund accounting and compliance sorted with the help of a trusted, local accountant. We'll match you with the right professional for your fund's exact needs.",
};

/** section 2 with the owner's SMSF wording (9 Oct 2026). Text only: each card keeps the icon of the personal card in
 *  the same place ("iconOf"). */
export const SMSF_SERVICES = {
  eyebrow: PERSONAL_SERVICES.eyebrow,
  h2: "SMSF & Superannuation Services",
  intro: "Whether you are setting up a new fund or managing an existing Self-Managed Super Fund, find an accountant who understands your compliance and reporting needs.",
  cards: [
    { iconOf: "Individual Tax Returns", title: "SMSF Tax Returns & Accounts", text: "Get help preparing annual financial statements and lodging your SMSF Annual Return (SAR) with the ATO." },
    { iconOf: "Tax Deductions", title: "New SMSF Setup & Establishment", text: "Find an accountant to assist with fund structuring, trust deeds, ABN/TFN applications, and corporate trustee setup." },
    { iconOf: "Rental Property Tax", title: "Independent Audit Coordination", text: "Seamlessly coordinate mandatory annual audits with ASIC-registered independent SMSF auditors." },
    { iconOf: "Investments & Shares", title: "Contributions & Pensions", text: "Guidance on accounting for concessional/non-concessional contributions, pension starts, and transition-to-retirement strategies." },
    { iconOf: "Contractor & Freelance Income", title: "Property & Investment Accounting", text: "Specialized accounting for funds holding residential or commercial real estate, LRBAs, term deposits, and shares." },
    { iconOf: "More Complex Tax Returns", title: "SMSF Compliance & ATO Support", text: "Stay compliant with superannuation laws, investment strategies, and rectify potential ATO compliance issues early." },
  ],
};

/** "Why Use an Accountant" with the owner's SMSF wording (9 Oct 2026). Text only: the label, badge and each point's
 *  icon stay as on the personal page (same order). */
const WHY_POINTS = [
  { title: "Understand your fund's tax and reporting obligations", text: "Get clear advice on ATO compliance, super laws, and reporting timelines for your SMSF." },
  { title: "Maximize fund tax concessions & allowable credits", text: "Ensure your fund correctly accesses the 15% concessional tax rate, franking credits, and CGT discounts." },
  { title: "Organise fund financial statements & records", text: "Keep accurate financial statements, member records, and asset valuations audit-ready throughout the year." },
  { title: "Prepare your annual SMSF financial accounts", text: "Get complete, accurate, and compliant balance sheets, income statements, and tax calculations." },
  { title: "Lodge your SMSF Annual Return (SAR) on time", text: "Have your fund's tax return and regulatory reporting prepared and lodged correctly with the ATO." },
  { title: "Coordinate mandatory independent SMSF audits", text: "Streamline the audit process by working with accountants who coordinate directly with ASIC-registered auditors." },
  { title: "Help you avoid common SMSF compliance mistakes", text: "Reduce the risk of regulatory breaches, unexpected penalty taxes, or disqualified trustee issues." },
  { title: "Explain how superannuation rule changes affect your fund", text: "Stay informed on contribution caps, pension thresholds, and legislative updates affecting super." },
  { title: "Provide tailored support for fund assets & setups", text: "Get administration support tailored to your fund’s assets—whether holding property, shares, or cash." },
  { title: "Help you respond to ATO super queries or audits", text: "Have complete peace of mind with professional support and representation if the ATO contacts your fund." },
];
export const SMSF_WHY = {
  ...PERSONAL_WHY,
  h2: "Why Use an Accountant for Your SMSF?",
  h2Accent: "SMSF?",
  intro: [
    "Finding the right SMSF accountant should be simple, fast and hassle-free. Your Accountant Match takes the guesswork out of choosing an accountant by connecting you with a professional suited to your fund's specific accounting and compliance needs. Skip the endless directory searches and get matched with an accountant who understands superannuation rules and ATO reporting requirements.",
    "Get expert help maintaining fund compliance, managing annual reporting, avoiding costly penalties and making SMSF administration easier. Less searching, less stress and more confidence that your super fund is in the right hands.",
  ],
  lead: "An experienced SMSF accountant can help you:",
  points: PERSONAL_WHY.points.map((p, i) => ({ ...p, ...WHY_POINTS[i] })),
};

/** "Who we help" with the owner's SMSF wording (9 Oct 2026). Text only: each tile keeps the icon of the personal tile
 *  in the same place ("iconOf"). */
export const SMSF_RIGHT_FIT = {
  ...PERSONAL_RIGHT_FIT,
  h2: "Find the Right Accountant for Your SMSF Needs",
  lead: "Not every Self-Managed Super Fund is the same.",
  text: "Whether you're establishing a new fund, managing direct property, or running a complex investment portfolio, Your Accountant Match helps you find an accountant suited to your fund's structure.",
  tiles: [
    { label: "New Fund Establishments", iconOf: "Employees" },
    { label: "Property & Real Estate Investors", iconOf: "Investors" },
    { label: "Share & Portfolio Investors", iconOf: "Landlords" },
    { label: "Existing SMSF Trustees", iconOf: "Contractors" },
    { label: "Funds in Retirement / Pension Phase", iconOf: "Self-employed" },
  ],
};
