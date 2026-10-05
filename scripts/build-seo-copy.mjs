// Builds the rewritten SEO wording for every page: src/content/seo-copy.json (title, meta description and, for city and
// industry pages, the H1) and docs/seo-copy-log.md (old wording next to new, for review or rollback).
// Rules: titles 60 characters or fewer, meta descriptions 155 or fewer, one message everywhere ("matched to one of our
// partner accountants"), only the approved credential claim, no invented facts, figures or fees.
//   node scripts/build-seo-copy.mjs
import fs from "node:fs";

const types = JSON.parse(fs.readFileSync("data/extracted/page-types.json", "utf8"));
const old = (p) => JSON.parse(fs.readFileSync("data/extracted/pages/" + (p === "/" ? "_home" : p.replace(/^\//, "").replace(/\//g, "__")) + ".json", "utf8"));
const BRAND = "Your Accountant Match";
const withBrand = (t) => (`${t} | ${BRAND}`.length <= 60 ? `${t} | ${BRAND}` : t);
const MATCHED = "Matched to one of our partner accountants";
const CRED = "TPB-registered, CA ANZ, CPA Australia or IPA members";

// ---------- cities ----------
const CITY = {
  sydney: ["Sydney", "Sydney", "NSW", "property, finance and small business"],
  "newcastle-maitland": ["Newcastle & Maitland", "Newcastle", "NSW", "the port, mining services and trades"],
  melbourne: ["Melbourne", "Melbourne", "VIC", "hospitality, property and professional services"],
  geelong: ["Geelong", "Geelong", "VIC", "manufacturing, tourism and trades"],
  brisbane: ["Brisbane", "Brisbane", "QLD", "construction, property and small business"],
  "gold-coast": ["Gold Coast", "Gold Coast", "QLD", "tourism, hospitality and property investors"],
  "sunshine-coast": ["Sunshine Coast", "Sunshine Coast", "QLD", "tourism, trades and small business"],
  perth: ["Perth", "Perth", "WA", "mining services, construction and small business"],
  adelaide: ["Adelaide", "Adelaide", "SA", "defence, tech and healthcare"],
  hobart: ["Hobart", "Hobart", "TAS", "tourism, hospitality and small business"],
  launceston: ["Launceston", "Launceston", "TAS", "agriculture, hospitality and small business"],
  "canberra-queanbeyan": ["Canberra & Queanbeyan", "Canberra", "ACT", "government contractors and small business"],
  darwin: ["Darwin", "Darwin", "NT", "defence, mining services and tourism"],
};
const INDUSTRY = {
  "agriculture-primary-production": ["Agriculture & Primary Production", "farm tax, primary producer concessions and BAS"],
  "construction-tradies": ["Construction & Tradies", "subcontractor tax, BAS and payroll"],
  "medical-healthcare": ["Medical & Healthcare", "practice accounting, BAS and tax planning"],
  "professional-services": ["Professional Services", "firm accounting, trust structures and tax planning"],
  "real-estate-property": ["Real Estate & Property", "property tax, CGT and investor structures"],
  "retail-ecommerce": ["Retail & E-Commerce", "GST, inventory and online-sales bookkeeping"],
  "smsf-family-trusts": ["SMSF & Family Trusts", "SMSF set-up, compliance and trust accounting"],
  "transport-logistics": ["Transport & Logistics", "fuel tax credits, vehicle deductions and BAS"],
};

const fit = (opts, max) => opts.find((o) => o.length <= max) ?? opts[opts.length - 1];

// ---------- hand-written pages ----------
const HAND = {
  "/": ["Find a Vetted Local Accountant | Free Matching", "Tell us your area and what you need. You are matched to one of our partner accountants, all TPB-registered and CA ANZ, CPA Australia or IPA members. Free."],
  "/about": ["About Us: Free Accountant Matching in Australia", "Your Accountant Match is a free service that matches you to one of our partner accountants. Learn how matching works and how we vet our network."],
  "/contact": ["Contact Us | Free Accountant Matching", "Contact our Melbourne-based team by email or phone, or start now to be matched to one of our partner accountants in your area. Free, no obligation."],
  "/how-it-works": ["How Accountant Matching Works in 3 Steps", "Tell us your area and needs in 60 seconds. We match you by postcode to one of our partner accountants, who then contacts you directly. Free."],
  "/how-we-select-accountants": ["How We Vet and Select Our Accountants", "Every accountant in our network is TPB-registered and a member of CA ANZ, CPA Australia or the IPA. See our full vetting and selection process."],
  "/locations": ["Accountants by City: Sydney, Melbourne, Brisbane & More", "Find your city. Get matched to one of our partner accountants in Sydney, Melbourne, Brisbane, Perth, Adelaide and 8 more cities. Free matching."],
  "/guides": ["Accountant Guides: Find, Compare & Get Matched", "Guides to finding a tax accountant, bookkeeper, BAS agent or SMSF specialist, catching up on overdue tax, and what accountants cost. Matching is free."],
  "/blog": ["Tax & Accounting Blog for Australians", "Practical tax and accounting articles for Australians: BAS due dates, work-from-home deductions, sole trader tax tips, super caps and more."],
  "/privacy": ["Privacy Statement | Your Accountant Match", "How Your Accountant Match collects, uses and protects your information when you ask to be matched to one of our partner accountants."],
  "/terms": ["Terms of Use | Your Accountant Match", "Terms of use for Your Accountant Match, a free service that matches you to one of our partner accountants. Read how matching works and your rights."],
  // services
  "/accountant/advanced-reporting-specialist": ["Management Reporting Accountant: Free Matching", "Matched to one of our partner accountants for management accounts, forecasts, board reporting and AASB S2 sustainability reporting. Free, no obligation."],
  "/accountant/audit-assurance": ["Audit & Assurance Accountants: Free Matching", "Matched to one of our partner accountants for statutory, internal, special-purpose or grant-compliance audits. All TPB-registered. Free, no obligation."],
  "/accountant/bookkeeper": ["Bookkeeper Near Me: Free Local Matching", "Get matched to one of our partner accountants for bookkeeping in Xero, QuickBooks or MYOB: bank reconciliations, payroll and BAS. Free matching."],
  "/accountant/bookkeeping-bas": ["BAS Agent & Bookkeeping Near Me: Free Matching", "Matched to one of our partner accountants for BAS preparation and bookkeeping in Xero, QuickBooks or MYOB. Accurate, on-time lodgement. Free."],
  "/accountant/business-growth-adviser": ["Business Growth Adviser: Free Accountant Matching", "Matched to one of our partner accountants for financial modelling, pricing, cash-flow forecasting and growth advice that suits your goals. Free."],
  "/accountant/business-structures": ["Business Structure Advice: Sole Trader, Company, Trust", "Matched to one of our partner accountants for sole trader, company, trust or partnership setup. Protect assets and plan tax. Free, no obligation."],
  "/accountant/cloud-accounting": ["Xero, MYOB & QuickBooks Accountant: Free Matching", "Matched to one of our partner accountants to set up or tidy Xero, QuickBooks or MYOB so your books run smoothly. Free matching, no obligation."],
  "/accountant/cpa-accountant": ["CPA Accountant Near Me: Free Matching", "Matched to one of our partner accountants for audit, complex structuring and strategic advice. Every accountant is a CA ANZ, CPA Australia or IPA member."],
  "/accountant/payroll-compliance": ["Payroll & STP Accountant: Free Matching", "Matched to one of our partner accountants for super guarantee, Single Touch Payroll and Fair Work obligations. Avoid costly mistakes. Free."],
  "/accountant/personal-tax-support": ["Personal Tax Accountant Near Me: Free Matching", "Matched to one of our partner accountants for individual tax returns, CGT, investments and residency questions. All TPB-registered. Free matching."],
  "/accountant/property-smsf-specialist": ["Property in SMSF Specialist: Free Matching", "Matched to one of our partner accountants for property inside super: borrowing rules, contribution caps and audit. Free, no obligation."],
  "/accountant/registered-tax-agent": ["Registered Tax Agent Near Me: TPB-Registered", "Matched to one of our partner accountants, a TPB-registered tax agent, to lodge your returns and deal with the ATO for you. Free matching."],
  "/accountant/registration-services": ["Company, ABN & GST Registration: Free Matching", "Matched to one of our partner accountants to register a company, ABN, GST, business name, trust or SMSF, done right first time. Free matching."],
  "/accountant/small-business-accountant": ["Small Business Accountant Near Me: Free Matching", "Matched to one of our partner accountants for bookkeeping, tax planning and growth advice that fits your small business. Free, no obligation."],
  "/accountant/smsf-accountant": ["SMSF Accountant Near Me: Free Specialist Matching", "Matched to one of our partner accountants for SMSF set-up, compliance, audit, pensions and LRBA structuring. Free matching, no obligation."],
  "/accountant/succession-planning": ["Succession Planning Accountant: Free Matching", "Matched to one of our partner accountants for family handover, business sale or buy-sell agreements. Protect your value. Free, no obligation."],
  "/accountant/tax-accountant": ["Tax Accountant Near Me: TPB-Registered, Free Matching", "Matched to one of our partner accountants for tax returns, planning and ATO dealings. All TPB-registered. Answer a few questions. Free."],
  "/accountant/tax-deduction-expert": ["Tax Deduction Expert: Free Accountant Matching", "Matched to one of our partner accountants to maximise work expenses, investment property depreciation and CGT concessions. Free, no obligation."],
  // guides
  "/guide/accountant-for-companies-small-businesses": ["Accountant for Companies & Small Business: Free Match", "Matched to one of our partner accountants for company returns, BAS, payroll and advisory. All TPB-registered. Free matching, takes 60 seconds."],
  "/guide/accountant-for-sole-traders": ["Accountant for Sole Traders: Free Matching", "Matched to one of our partner accountants for sole trader tax returns, BAS, ABN and structure advice. All TPB-registered. Free matching."],
  "/guide/accountant-near-me": ["Accountant Near Me: Find a Vetted Local Accountant", "Searching 'accountant near me'? Get matched to one of our partner accountants in your suburb for tax, SMSF, bookkeeping or business. Free."],
  "/guide/accountant-vs-bookkeeper": ["Accountant vs Bookkeeper: Which Do You Need?", "Accountant vs bookkeeper explained: who lodges returns, who does BAS, who gives strategic advice. Then get matched free in 60 seconds."],
  "/guide/ato-audit-help": ["ATO Audit Help: Registered Tax Agent Support", "Facing an ATO audit or review? Get matched to one of our partner accountants experienced in audits, disputes and debt. Free matching."],
  "/guide/bas-agent-near-me": ["BAS Agent Near Me: Find a Registered Local Agent", "Searching 'BAS agent near me'? Get matched to one of our partner accountants for BAS preparation, GST, PAYG and lodgement. Free, 60 seconds."],
  "/guide/bookkeeper-near-me": ["Bookkeeper Near Me: Local Registered BAS Agents", "Searching 'bookkeeper near me'? Get matched to one of our partner accountants using Xero, QuickBooks or MYOB for bank recs, payroll and BAS."],
  "/guide/business-accountant-near-me": ["Business Accountant Near Me: Free Local Matching", "Looking for a business accountant? Get matched to one of our partner accountants for tax, BAS, bookkeeping and advisory. Free matching."],
  "/guide/how-much-does-an-accountant-cost": ["How Much Does an Accountant Cost in Australia? 2026", "Accountant costs in Australia explained: individual returns $200–$400, BAS $250–$400 a quarter, SMSF $1,500–$3,500. Get matched free."],
  "/guide/important-tax-dates": ["Important Tax Dates & Deadlines in Australia 2026", "Key Australian tax deadlines for 2026: individual returns, BAS due dates, super guarantee cutoffs, and company and trust deadlines."],
  "/guide/late-bas-help": ["Late BAS Help: Catch Up on Overdue BAS", "Behind on your BAS? Get matched to one of our partner accountants for overdue BAS, penalty remission and ATO payment plans. Free matching."],
  "/guide/overdue-tax-return-help": ["Overdue Tax Return Help: Catch Up on Late Returns", "Behind on your tax return? Get matched to one of our partner accountants for overdue returns, ATO penalties and payment plans. Free matching."],
  "/guide/smsf-accountant-near-me": ["SMSF Accountant Near Me: Find a Local Specialist", "Searching 'SMSF accountant near me'? Get matched to one of our partner accountants for fund set-up, annual returns, audit and compliance. Free."],
  "/guide/tax-accountant-near-me": ["Tax Accountant Near Me: Local Registered Tax Agents", "Need a tax accountant near you? Get matched to one of our partner accountants for returns, CGT, investment property and ATO dealings. Free."],
  // blog
  "/blog/bas-due-dates-2026": ["BAS Due Dates 2026: Monthly & Quarterly Lodgement", "Complete 2026 BAS due dates for monthly and quarterly lodgers, how registered agents get extra time, and how to avoid failure-to-lodge penalties."],
  "/blog/business-records-bookkeeping-2026": ["Business Records & Bookkeeping 2026: What to Keep", "What business records you must keep in 2026, the 5-year rule, digital records, and how good bookkeeping lowers audit risk."],
  "/blog/catch-up-overdue-tax-returns-2026": ["How to Catch Up on Overdue Tax Returns", "Behind on several years of tax returns? A practical guide to catching up, reducing failure-to-lodge penalties and dealing with the ATO."],
  "/blog/company-trust-return-deadlines-2026": ["Company & Trust Tax Return Deadlines 2026", "When company and trust tax returns are due in 2026, the 15 January date, trust distribution resolutions by 30 June, and agent extensions."],
  "/blog/company-vs-trust-vs-sole-trader-2026": ["Company vs Trust vs Sole Trader: Which Saves Tax?", "Compare sole trader, company and trust structures for 2026: tax rates, asset protection, compliance costs and when to restructure."],
  "/blog/gst-registration-threshold-2026": ["GST Registration Threshold 2026: When to Register", "The 2026 GST registration threshold: the $75,000 turnover limit, ride-share rules, voluntary registration and what happens if you register late."],
  "/blog/home-office-tax-deductions-2026": ["Working From Home Tax Deductions 2026: What to Claim", "Working from home deductions for 2025-26: the fixed-rate and actual cost methods, record-keeping rules and what you can and can't claim."],
  "/blog/negative-gearing-explained-2026": ["Negative Gearing Explained 2026: How It Works", "How negative gearing works in 2025-26: rental losses, deductible costs, the 2027 new-build limit, grandfathering and capital gains on sale."],
  "/blog/payday-super-deadlines-2026": ["Payday Super 2026: New Super Guarantee Deadlines", "From 1 July 2026 employers must pay super each payday. The 7-business-day rule, the super guarantee charge and how to comply."],
  "/blog/reduce-tax-sole-trader-2026": ["How to Reduce Tax as a Sole Trader in Australia 2026", "Practical, legitimate ways for Australian sole traders to reduce tax in 2026: deductions, structuring, super, prepayments and record-keeping."],
  "/blog/rental-property-deductions-2026": ["Rental Property Deductions 2026: What You Can Claim", "Rental property deductions for 2025-26: interest, repairs vs improvements, depreciation, travel restrictions and the records you must keep."],
  "/blog/super-contributions-cap-2026": ["Super Contribution Caps 2026: How Much Can You Add?", "Super caps for 2025-26: the $30,000 concessional cap, non-concessional caps, carry-forward and how to claim a personal deduction."],
  "/blog/tax-planning-strategies-2026": ["Tax Planning Strategies 2026: 8 Ways to Reduce Tax", "Eight legitimate tax planning strategies for 2026: super, asset write-offs, timing income, structuring and prepayments. Stay compliant."],
  "/blog/tax-return-deadlines-2026": ["Tax Return Deadlines 2026: Don't Miss 31 October", "2026 individual tax return deadlines: the 31 October cut-off, how registered tax agents get extensions to May, and late lodgement penalties."],
  "/blog/vehicle-car-deductions-2026": ["Vehicle & Car Tax Deductions 2026: Logbook vs Cents", "Claiming vehicle and car deductions in 2025-26: the cents-per-km rate, the logbook method, what counts as a car and the records to keep."],
  "/blog/work-related-deductions-2026": ["Work-Related Deductions 2026: Common Claims & Risks", "Work-related deductions for 2025-26: union fees, self-education, tools, clothing and the claim patterns that trigger ATO review letters."],
};

// ---------- build ----------
const out = {};
const log = [];
const problems = [];
const set = (p, title, description, h1) => {
  if (title.length > 60) problems.push(`${p}: title ${title.length}`);
  if (description.length > 155) problems.push(`${p}: description ${description.length}`);
  out[p] = { title, description, ...(h1 ? { h1 } : {}) };
};

for (const r of types) {
  const p = r.path;
  if (/admin|questionnaire|retired/.test(r.type)) continue;
  if (HAND[p]) {
    const [t, d] = HAND[p];
    set(p, t.length <= 60 ? t : t.slice(0, 60), d, p === "/" ? { first: "Looking for an accountant", highlight: "near you?", second: "We’ll find your match." } : undefined);
  } else if (r.type === "city") {
    const [name, short, state, focus] = CITY[r.city];
    const title = fit([`Accountants in ${name}, ${state} | ${BRAND}`, `Accountants in ${name}, ${state} | Free Matching`, `Accountants in ${name}, ${state}`], 60);
    const desc = fit([
      `${name}: ${focus}. ${MATCHED}, all ${CRED}. Free.`,
      `${name}: ${focus}. ${MATCHED}, all TPB-registered. Free matching.`,
      `${name}: ${focus}. ${MATCHED}. All TPB-registered. Free.`,
    ], 155);
    set(p, title, desc, { first: "Find a Vetted Accountant", highlight: `in ${name}`, second: MATCHED });
  } else if (r.type === "industry-city") {
    const [iname, ifocus] = INDUSTRY[r.industry];
    const [name, short, state] = CITY[r.city];
    const title = fit([`${iname} Accountants in ${short} | Free Matching`, `${iname} Accountants in ${short}`, `${iname} Accountant ${short}`], 60);
    const desc = fit([
      `${iname} accountants in ${short}: ${ifocus}. ${MATCHED}, all TPB-registered. Free.`,
      `${iname} accountants in ${short}: ${ifocus}. ${MATCHED}. Free matching.`,
      `${iname} accountants in ${short}: ${ifocus}. ${MATCHED}. Free.`,
      `${iname} accountants in ${short}: ${ifocus}. ${MATCHED}.`,
    ], 155);
    set(p, title, desc, { first: `${iname} Accountants`, highlight: `in ${name}`, second: MATCHED });
  } else {
    problems.push(`${p}: no wording defined`);
  }
  const o = old(p);
  log.push([p, o.title || "", out[p]?.title || "", o.metaDescription || "", out[p]?.description || ""]);
}

fs.mkdirSync("src/content", { recursive: true });
fs.writeFileSync("src/content/seo-copy.json", JSON.stringify(out, null, 1));
const md = ["# SEO wording log: old next to new", "", `Generated by \`scripts/build-seo-copy.mjs\`. ${log.length} pages. Titles 60 characters or fewer, descriptions 155 or fewer.`, ""];
for (const [p, ot, nt, od, nd] of log) md.push(`## ${p}`, `- Old title (${ot.length}): ${ot}`, `- New title (${nt.length}): ${nt}`, `- Old description (${od.length}): ${od}`, `- New description (${nd.length}): ${nd}`, out[p].h1 ? `- New H1: ${[out[p].h1.first, out[p].h1.highlight, out[p].h1.second].filter(Boolean).join(" / ")}` : "", "");
fs.writeFileSync("docs/seo-copy-log.md", md.join("\n"));
console.log(`${Object.keys(out).length} pages written`);
if (problems.length) { console.log("PROBLEMS:\n" + problems.join("\n")); process.exitCode = 1; }
