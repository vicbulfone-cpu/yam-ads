/**
 * PERSONAL TAX AD PAGE (/ad-2): the owner's sections 2-6 (9 Oct 2026), shown straight under the hero and above the
 * page's existing sections (which stay for now; the owner will delete or edit them later). Wording exactly as supplied.
 * Shown by src/components/ads/PersonalSections.tsx.
 */

export const PERSONAL_SERVICES = {
  eyebrow: "What we can help you with",
  h2: "Personal Tax Services",
  intro: "Whether you have a straightforward tax return or more complex financial circumstances, find an accountant who understands what you need.",
  cards: [
    { icon: "/images/ad-personal/tax-return.webp", title: "Individual Tax Returns", text: "Get help preparing and lodging your annual personal tax return." },
    { icon: "/images/ad-personal/deductions.webp", title: "Tax Deductions", text: "Find an accountant who can help you understand deductions relevant to your circumstances." },
    { icon: "/images/ad-personal/rental-property.webp", title: "Rental Property Tax", text: "Help with rental income, expenses and tax considerations for investment properties." },
    { icon: "/images/ad-personal/investments.webp", title: "Investments & Shares", text: "Accounting assistance for investment income and capital gains considerations." },
    { icon: "/images/ad-personal/contractor.webp", title: "Contractor & Freelance Income", text: "Find support if you earn income outside traditional employment." },
    { icon: "/images/ad-personal/complex.webp", title: "More Complex Tax Returns", text: "Get help when your tax affairs involve multiple income sources, investments or property." },
  ],
};

export const PERSONAL_RIGHT_FIT = {
  eyebrow: "Who we help", // new label, styled as "What we can help you with" (owner, 9 Oct 2026)
  h2: "Find the Right Accountant for Your Tax Needs",
  lead: "Not every tax return is the same.",
  text: "Whether you're an employee, investor, landlord, contractor or self-employed, Your Accountant Match helps you find an accountant suited to your circumstances.",
  /** desktops only (owner's "personal example" picture, 9 Oct 2026): tiles naming the people in the sentence above
   *  (employee, investor, landlord, contractor, self-employed); decorative, as the sentence already says it */
  // icons: the owner's "r" folder pictures, drawn by PersonalServiceIcons.tsx (WHO_ICONS in PersonalSections.tsx)
  tiles: [
    { label: "Employees" },
    { label: "Investors" },
    { label: "Landlords" },
    { label: "Contractors" },
    { label: "Self-employed" },
  ],
};

export const PERSONAL_WHY = {
  /** owner's "z" layout (9 Oct 2026): label, heading (last words in green), a short intro on
   *  the left; the checklist in a white card on the right. The label is new wording; the intro is the owner's. */
  eyebrow: "Tax time, made easier",
  h2: "Why Use an Accountant for Your Tax Return?",
  h2Accent: "Tax Return?",
  // owner's wording, two paragraphs (9 Oct 2026)
  intro: [
    "Finding the right tax accountant should be simple, fast and hassle-free. Your Accountant Match takes the guesswork out of choosing an accountant by connecting you with a professional suited to your individual tax needs. Skip the endless directory searches and get matched with an accountant who understands your circumstances.",
    "Get expert help identifying eligible deductions, avoiding costly mistakes and making tax time easier. Less searching, less stress and more confidence that your tax return is in the right hands.",
  ],
  lead: "An experienced accountant can help you:",
  /** the owner's "s" design (9 Oct 2026): ten points, each with its round icon, a bold title and a line under it
   *  (titles and lines word for word from the design; icons made by scripts/make-personal-help-icons.mjs) */
  badge: "/images/ad-personal/help/01_experienced_accountant.webp",
  leadAccent: "HELP YOU:",
  points: [
    { icon: "/images/ad-personal/help/02_tax_obligations.webp", title: "Understand your tax obligations", text: "Get clear advice on what you need to do, based on your circumstances." },
    { icon: "/images/ad-personal/help/03_deductions.webp", title: "Identify applicable deductions", text: "Make sure you claim everything you’re entitled to." },
    { icon: "/images/ad-personal/help/04_organise_records.webp", title: "Organise your tax information", text: "Know what records to keep and how to get everything ready." },
    { icon: "/images/ad-personal/help/05_prepare_return.webp", title: "Prepare your tax return", text: "Get a complete, accurate and compliant tax return." },
    { icon: "/images/ad-personal/help/06_lodge_return.webp", title: "Lodge your return", text: "Have your tax return prepared and lodged correctly and on time." },
    { icon: "/images/ad-personal/help/07_complex_situations.webp", title: "Deal with more complex tax situations", text: "Get support for multiple income sources, investments or property." },
    { icon: "/images/ad-personal/help/08_avoid_mistakes_shield.webp" /* own shield icon: the design's chart was also used for "complex tax situations" (owner, 9 Oct 2026; scripts/make-personal-mistakes-icon.mjs) */, title: "Help you avoid common mistakes", text: "Reduce the risk of errors that could cost you money." },
    { icon: "/images/ad-personal/help/09_tax_rule_changes.webp", title: "Explain how changes in tax rules may affect you", text: "Stay informed and plan ahead with up-to-date advice." },
    { icon: "/images/ad-personal/help/10_tailored_advice.webp", title: "Provide advice tailored to your circumstances", text: "Get personalised advice based on your income, investments and goals." },
    { icon: "/images/ad-personal/help/11_ato_support.webp", title: "Help you respond to ATO questions or requests", text: "Have peace of mind with professional support if the ATO contacts you." },
  ],
};

/** shown in the page's bottom FAQ, after the shared questions (owner, 9 Oct 2026; FAQSection "extra") */
export const PERSONAL_FAQ = {
  h2: "Personal Tax Questions",
  items: [
    { q: "How do I find a personal tax accountant?", a: "Your Accountant Match helps you find an accountant based on the type of personal tax assistance you require." },
    { q: "Can an accountant help with my tax deductions?", a: "Yes. An accountant can help you understand deductions that may apply to your individual circumstances." },
    { q: "Can an accountant help with rental property tax?", a: "Yes. Accountants commonly assist property investors with rental income, expenses and related tax considerations." },
    { q: "Can an accountant help with a complicated tax return?", a: "Yes. An accountant may be particularly useful where your tax affairs involve investments, property, capital gains or multiple income sources." },
  ],
};
