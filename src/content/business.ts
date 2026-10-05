/**
 * BUSINESS DETAILS — the one place for the name and contact details shown in every footer and in the structured data,
 * so they are identical everywhere (AI search and directories trust consistent details).
 * Phone and ABN are left empty on purpose: add them here ONLY when the owner supplies real ones. Never invent them.
 * Use exactly the same name, address and phone on Google Business Profile, Bing Places and directories.
 */
export const BUSINESS = {
  name: "Your Accountant Match",
  email: "hello@youraccountantmatch.com.au",
  phone: "" as string, // e.g. "03 1234 5678" once confirmed
  abn: "" as string, // e.g. "12 345 678 901" once confirmed
};

/** Links every footer must carry, whatever the page's own old footer had (existing wording). */
export const REQUIRED_FOOTER_LINKS = [
  { text: "About", href: "/about" },
  { text: "Contact", href: "/contact" },
  { text: "How We Select Accountants", href: "/how-we-select-accountants" },
  { text: "Privacy", href: "/privacy" },
  { text: "Terms", href: "/terms" },
];
