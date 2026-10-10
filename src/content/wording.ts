// Site-wide wording updates, applied to every page's text when it is loaded (and to the structured data, so FAQ markup
// always matches what visitors read). The original extracted text in /data is never edited; change or remove a rule here
// to change or undo it.
//
// Message used everywhere: visitors are "matched to one of our partner accountants".
// Approved credential claim: "Every accountant in our network is TPB-registered and a member of CA ANZ, CPA Australia or the IPA."

export const CREDENTIAL = "Every accountant in our network is TPB-registered and a member of CA ANZ, CPA Australia or the IPA.";

/** SMSF licensing (owner, 10 Oct 2026): since 1 July 2016 an accountant giving SMSF advice must hold an Australian Financial
 *  Services Licence (AFSL, limited or full) or be an authorised representative of a licensee (ASIC, INFO 216), and every SMSF
 *  audit must be done by an ASIC-registered SMSF auditor (SIS Act; ASIC RG 243). Shown on the home page ("How we select
 *  accountants") and the SMSF ad page. The owner checks these before an accountant joins (ASIC's Professional Registers). */
export const SMSF_LICENCE = "Where SMSF advice is involved, we also check the accountant holds an Australian Financial Services Licence (AFSL), or is authorised under one, as ASIC requires.";
export const SMSF_AUDITOR = "Your fund's yearly independent audit is carried out by an ASIC-registered SMSF auditor.";

type Rule = [RegExp, string];

export const RULES: Rule[] = [
  // ---- one match → matched to one of our partner accountants ----
  [/we[’']ll match you with only one accountant from our partner network in your area/g, "you’ll be matched to one of our partner accountants in your area"],
  [/we match you with one vetted accountant in our network who understands/g, "you’re matched to one of our partner accountants who understands"],
  [/We match you with an accountant that fits your needs/g, "You’re matched to one of our partner accountants"],
  [/We match you with a vetted local accountant/g, "You’re matched to one of our partner accountants"],
  [/we will match you with a vetted [^,.]*? accountant whose/g, "you will be matched to one of our partner accountants whose"],
  [/We match you to an accountant who works in the part of/g, "You’re matched to one of our partner accountants who work in the part of"],
  [/we match you with trusted .+? accounting specialists who get/g, "you’re matched to one of our partner accountants who get"],
  [/we[’']ll match you with a vetted accountant from our partner network whose/g, "you’ll be matched to one of our partner accountants whose"],
  [/get matched with a vetted accountant suited to/g, "get matched to one of our partner accountants suited to"],
  [/only to match you with a suitable accountant in our network/g, "only to match you to one of our partner accountants"],
  [/beyond the single firm you are matched with/g, "beyond the partner accountant you are matched to"],

  [/we[’']ll match you with one (?:suitable )?vetted accountant/g, "you’ll be matched to one of our partner accountants"],

  // ---- privacy: one matched accountant only (owner, 7 Oct 2026: "edit privacy page accordingly", to match the new
  //      How we select accountants wording "shared only with your single best match—never blasted to multiple providers") ----
  [/To match you with an accountant in our network who understands your needs and individual requirements\./g,
    "To connect you directly with one local partner accountant who specialises in the help you asked for."],
  [/Your information is never shared with multiple firms simultaneously\./g,
    "Your information is kept private and shared only with your single matched accountant. It is never sent to multiple providers."],
  [/Last updated: January 2026/g, "Last updated: October 2026"],

  // ---- credentials ----
  // "Every / All / Our … accountants hold active membership with recognised peak bodies (such as CPA Australia or the NTAA) and registration with the TPB."
  [/(?:Every|All|Our)[^.]*?active membership with recognised peak bodies \(such as CPA Australia or the NTAA\) and registration with the Tax Practitioners Board \(TPB\)\./g, CREDENTIAL],
  [/We verify professional memberships and registrations before a firm is listed — CPA Australia, the National Tax (?:&|&amp;) Accountants' Association \(NTAA\), and Tax Practitioners Board \(TPB\) registration where the firm lodges returns or BAS for a fee\./g, `We verify professional memberships and registrations before an accountant joins our network. ${CREDENTIAL}`],
];

export function applyWording(s: string): string {
  let out = s;
  for (const [re, to] of RULES) out = out.replace(re, to);
  return out;
}

/** Applies the rules to every text field of a loaded page (in place). */
const TEXT_KEYS = new Set(["html", "text", "aText", "a", "q", "alt", "placeholder"]);
export function applyWordingDeep(x: unknown): void {
  if (Array.isArray(x)) {
    for (let i = 0; i < x.length; i++) {
      if (typeof x[i] === "string") x[i] = applyWording(x[i]);
      else applyWordingDeep(x[i]);
    }
  } else if (x && typeof x === "object") {
    const o = x as Record<string, unknown>;
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (typeof v === "string") {
        if (TEXT_KEYS.has(k)) o[k] = applyWording(v);
      } else if (k === "parts" || k === "lines" || k === "fixed") {
        applyWordingDeep(v);
      } else applyWordingDeep(v);
    }
  }
}
