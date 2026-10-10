// The survey answers as HighLevel custom fields (owner, 10 Oct 2026). Every questionnaire (the site popup and the four ad
// pages) sends a "survey" object with the submitted lead: HighLevel field name → answer. The names below must match the
// field names created in the GHL sub-account (Settings → Custom Fields → Contacts, folder "Website Survey"); capital
// letters and apostrophe styles don't matter. src/lib/ghl.ts looks the fields up by name and fills them in.
// Lead Source, Survey Type, Website Lead ID, Ad Campaign, Google Click ID, UTM Source / Medium, Referral Code,
// Preferred Way to Meet and Email Match Details are filled in on the server from the rest of the lead.

export type Survey = Record<string, string | string[]>;

export const SF = {
  services: "Services Requested",
  personalNeeds: "Personal Tax Needs",
  overdue: "Overdue Returns Details",
  amend: "Amendment Details",
  adviceTopics: "Tax Advice Topics",
  returnIncludes: "Tax Return Includes",
  bizNeeded: "Business Services Needed",
  software: "Accounting Software",
  smsf: "SMSF Services Needed",
  registration: "Registration Services Needed",
  note: "Note for Accountant",
  // filled in on the server
  mode: "Preferred Way to Meet",
  emailMe: "Email Match Details",
  leadSource: "Lead Source",
  surveyType: "Survey Type",
  leadId: "Website Lead ID",
  campaign: "Ad Campaign",
  gclid: "Google Click ID",
  utm: "UTM Source / Medium",
  ref: "Referral Code",
} as const;

/** "Services Requested" options, one per service */
export const SERVICE_VALUE = {
  personal: "Personal Tax & Planning",
  business: "Business Services",
  smsf: "SMSF & Wealth Advisory",
  registration: "Registration Services",
} as const;

/** each business category's own field (its ticked options, one per line) */
export const BIZ_CATEGORY_FIELD: Record<string, string> = {
  biz_tax: "Business Tax and Compliance",
  bookkeeping: "Bookkeeping and Payroll",
  planning: "Tax Planning and Structure",
  advice: "Cash Flow and Business Advice",
};

type Cat = { id: string; title: string };
type Answer = { software?: string | null } | undefined;

/** Business, SMSF and registration answers as survey fields: the categories ticked and, for each, what was ticked in it. */
export function categorySurvey(service: "business" | "smsf" | "registration", cats: Cat[], labels: (c: Cat) => string[], answers: Record<string, Answer>): Survey {
  if (!cats.length) return {};
  if (service === "business") {
    const out: Survey = { [SF.bizNeeded]: cats.map((c) => c.title) };
    for (const c of cats) if (BIZ_CATEGORY_FIELD[c.id]) out[BIZ_CATEGORY_FIELD[c.id]] = labels(c).join("\n");
    const software = cats.map((c) => answers[c.id]?.software).find(Boolean);
    if (software) out[SF.software] = software;
    return out;
  }
  const text = cats.map((c) => `${c.title}: ${labels(c).join(", ")}`).join("\n");
  return { [service === "smsf" ? SF.smsf : SF.registration]: text };
}

/** Personal tax answers as survey fields */
export function personalSurvey(p: { needs: string[]; amendNote?: string; adviceTopics?: string[]; returnIncludes?: string[] }): Survey {
  const out: Survey = { [SF.personalNeeds]: p.needs };
  if (p.amendNote?.trim()) out[SF.amend] = p.amendNote.trim();
  if (p.adviceTopics?.length) out[SF.adviceTopics] = p.adviceTopics;
  if (p.returnIncludes?.length) out[SF.returnIncludes] = p.returnIncludes;
  return out;
}
