/**
 * SAMPLE ACCOUNTANT — shown on the match page (/ad-6) only while GoHighLevel is not connected (MOCK_GHL / no webhook).
 * Not a real person or firm. When GHL is connected (Stage 5) the real match details replace this, using the same fields.
 */
export type MatchDetails = {
  name: string;
  firm: string;
  photo?: string;
  phone?: string;
  email?: string;
  website?: string;
  blurb?: string;
  services?: string[];
};

export const SAMPLE_MATCH: MatchDetails = {
  name: "Sample Accountant",
  firm: "Sample Accounting Co.",
  photo: "/images/stock/general-woman-professional.webp",
  phone: "03 9000 0000",
  email: "accountant@example.com",
  website: "https://example.com",
  blurb:
    "A local accountant who looks after small businesses, sole traders and family companies: tax returns, BAS, bookkeeping and practical advice to help the business grow.",
  services: ["Business tax returns", "BAS & GST", "Bookkeeping & payroll", "Xero & MYOB", "Business structures", "Cash flow advice"],
};
