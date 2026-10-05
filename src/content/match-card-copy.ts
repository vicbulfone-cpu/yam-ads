/**
 * MATCH BOX WORDING (owner's design picture, 5 Oct 2026). Edit the words here.
 *
 * The four services themselves come from the questionnaire (old site wording). `rows` only changes what a service is
 * CALLED on the match box; the questionnaire still receives the original service name, so matching is unaffected.
 */
export const MATCH_CARD_COPY = {
  /** Small capitals above the heading. */
  eyebrow: "Your Accountant Match",
  /** Heading on the navy panel, two lines. */
  title: ["Let’s find your", "accountant."],
  sub: "One local accountant. Matched to your needs.",
  question: "What do you need help with?",
  hint: "Select a service to get started.",
  /** Small print under the Start button, separated by dots. */
  note: ["60 seconds", "Free", "No obligation"],
  /** Mint band along the bottom of the box. */
  footer: "Your details go to one local accountant only.",
  /** Display names on the match box, by the service's original name. */
  rows: {
    "Personal Tax Returns and Planning": { title: "Personal Tax & Planning", desc: "Returns, investments and tax planning" },
    "Business Services": { title: "Business Services", desc: "Tax, BAS, bookkeeping and payroll" },
    "SMSF and Financial Planning": { title: "SMSF & Wealth Advisory", desc: "Superannuation and retirement planning" },
    "Registration Services": { title: "Registration Services", desc: "Company, ABN, GST and business names" },
  } as Record<string, { title: string; desc: string }>,
};
