/**
 * SAMPLE ACCOUNTANT — shown on the match page (/match) only while GoHighLevel is not connected (MOCK_GHL / no webhook).
 * Not a real person or firm (a made-up name and placeholder details). When GHL is connected (Stage 5) the real match details replace this, using the same fields.
 */
export type MatchDetails = {
  name: string;
  firm: string;
  photo?: string;
  /** e.g. "Business accounting" (shown with the location under the firm) */
  specialty?: string;
  /** e.g. "Melbourne VIC" */
  location?: string;
  /** years of experience (the "20 years' experience" pill and the "Experienced support" line) */
  years?: number;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  hours?: string;
  blurb?: string;
  services?: string[];
};

export const SAMPLE_MATCH: MatchDetails = {
  name: "Daniel Harper",
  firm: "Harper Accounting",
  photo: "/images/home/accountant-portrait.webp", // the owner's own photo (accountant at his desk), cropped
  specialty: "Business accounting",
  location: "Melbourne VIC",
  years: 20,
  phone: "03 XXXX XXXX",
  email: "daniel@example.com",
  website: "https://www.example.com",
  address: "[Office address], Melbourne VIC",
  hours: "Monday–Friday, 9 am–5 pm",
  blurb:
    "A local accountant who looks after small businesses, sole traders and family companies: tax returns, BAS, bookkeeping and practical advice to help the business grow.",
  services: ["Business tax returns", "BAS & GST", "Bookkeeping & payroll", "Xero & MYOB", "Business structures", "Cash flow advice"],
};

/** The same sample accountant as shown after the personal tax questionnaire (/ad-2). */
export const SAMPLE_MATCH_PERSONAL: MatchDetails = {
  ...SAMPLE_MATCH,
  specialty: "Personal tax",
  blurb:
    "A local accountant who looks after individuals and families: tax returns, overdue and amended returns, investment property, shares and crypto, and practical tax planning.",
  services: ["Individual tax returns", "Overdue returns", "Amended returns", "Investment property", "Shares & crypto", "Tax planning"],
};

/** The same sample accountant as shown after the SMSF & wealth questionnaire (/ad-3). */
export const SAMPLE_MATCH_SMSF: MatchDetails = {
  ...SAMPLE_MATCH,
  specialty: "SMSF & super",
  blurb:
    "A local accountant who looks after self-managed super funds: setup, annual accounts and tax returns, audits, SMSF borrowing and retirement planning, working alongside licensed advisers where advice is needed.",
  services: ["SMSF setup", "SMSF accounts & tax returns", "SMSF audits", "SMSF borrowing", "Super & retirement planning", "Investment & tax planning"],
};

/** The same sample accountant as shown after the registration questionnaire (/ad-4). */
export const SAMPLE_MATCH_REGISTRATION: MatchDetails = {
  ...SAMPLE_MATCH,
  specialty: "Business setup & registrations",
  blurb:
    "A local accountant who helps people start and set up their business: company and trust setup, ABN, GST, PAYG and TFN registrations, business names and choosing the right structure.",
  services: ["Company registration", "ABN & GST registration", "PAYG withholding", "Business names", "Trust setup", "Business structures"],
};
