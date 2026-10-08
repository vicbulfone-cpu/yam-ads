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
  h2: "Find the Right Accountant for Your Tax Needs",
  lead: "Not every tax return is the same.",
  text: "Whether you're an employee, investor, landlord, contractor or self-employed, Your Accountant Match helps you find an accountant suited to your circumstances.",
  close: ["Tell us what you need.", "We'll do the matching."],
  cta: "Find My Accountant",
  /** desktops only (owner's "personal example" picture, 9 Oct 2026): tiles naming the people in the sentence above
   *  (employee, investor, landlord, contractor, self-employed); decorative, as the sentence already says it */
  tiles: [
    { icon: "/images/ad-personal/person.webp", label: "Employees" },
    { icon: "/images/ad-personal/investments.webp", label: "Investors" },
    { icon: "/images/ad-personal/rental-property.webp", label: "Landlords" },
    { icon: "/images/ad-personal/contractor.webp", label: "Contractors" },
    { icon: "/images/ad-personal/self-employed.webp", label: "Self-employed" },
  ],
};

export const PERSONAL_WHY = {
  h2: "Why Use an Accountant for Your Tax Return?",
  lead: "An experienced accountant can help you:",
  points: [
    "Understand your tax obligations",
    "Identify applicable deductions",
    "Organise your tax information",
    "Prepare your tax return",
    "Lodge your return",
    "Deal with more complex tax situations",
  ],
};

export const PERSONAL_HOW = {
  eyebrow: "How it works",
  h2: "Finding Your Accountant Is Simple",
  steps: [
    { title: "Tell us what you need", text: "Choose personal tax and tell us about the help you're looking for." },
    { title: "Enter your postcode", text: "We'll use your location as part of the matching process." },
    { title: "Meet your match", text: "Connect with one accountant suited to your requirements." },
  ],
  cta: "Find My Tax Accountant",
};

export const PERSONAL_FAQ = {
  h2: "Personal Tax Questions",
  items: [
    { q: "How do I find a personal tax accountant?", a: "Your Accountant Match helps you find an accountant based on the type of personal tax assistance you require." },
    { q: "Can an accountant help with my tax deductions?", a: "Yes. An accountant can help you understand deductions that may apply to your individual circumstances." },
    { q: "Can an accountant help with rental property tax?", a: "Yes. Accountants commonly assist property investors with rental income, expenses and related tax considerations." },
    { q: "Can an accountant help with a complicated tax return?", a: "Yes. An accountant may be particularly useful where your tax affairs involve investments, property, capital gains or multiple income sources." },
  ],
};
