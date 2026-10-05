import Link from "next/link";
import { QUESTIONNAIRE_URL } from "@/config/site.config";

/*
 * "The right expertise starts with the right match." (home page)
 *
 * Owner exception: instead of the generic labels in the reference picture,
 * the list shows EVERY service page on the site (type "service" in
 * data/extracted/page-types.json). Each short name is taken from that page's
 * own H1 in data/extracted/pages/accountant__<slug>.json (the "Find ... Near
 * You" wrapper removed), so no service is invented.
 */
const services = [
  { name: "Tax Accountant", href: "/accountant/tax-accountant" },
  { name: "Personal Tax Return Accountant", href: "/accountant/personal-tax-support" },
  { name: "Small Business Accountant", href: "/accountant/small-business-accountant" },
  { name: "SMSF Accountant", href: "/accountant/smsf-accountant" },
  { name: "Bookkeeper", href: "/accountant/bookkeeper" },
  { name: "Bookkeeping and BAS Help", href: "/accountant/bookkeeping-bas" },
  { name: "Payroll and Compliance Support", href: "/accountant/payroll-compliance" },
  { name: "Business Structuring Advice", href: "/accountant/business-structures" },
  { name: "Registration Services", href: "/accountant/registration-services" },
  { name: "Registered Tax Agent", href: "/accountant/registered-tax-agent" },
  { name: "Certified Practising Accountant", href: "/accountant/cpa-accountant" },
  { name: "Tax Deduction Expert", href: "/accountant/tax-deduction-expert" },
  { name: "Property and SMSF Specialist", href: "/accountant/property-smsf-specialist" },
  { name: "Cloud Accounting Support", href: "/accountant/cloud-accounting" },
  { name: "Business Growth Adviser", href: "/accountant/business-growth-adviser" },
  { name: "Advanced Reporting Specialist", href: "/accountant/advanced-reporting-specialist" },
  { name: "Audit and Assurance Services", href: "/accountant/audit-assurance" },
  { name: "Succession Planning Advice", href: "/accountant/succession-planning" },
];

/** Solid green circle with a white tick (matches the reference pills). */
function CheckCircle() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="shrink-0 lg:h-auto lg:w-[clamp(1.5rem,1.6vw,2.4rem)]">
      <circle cx="12" cy="12" r="12" fill="#00873a" />
      <path d="M7 12.4l3.2 3.2L17 8.8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function ServicesGrid() {
  return (
    <section className="container-page home-wide py-16 md:py-20" aria-labelledby="expertise-heading">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-[3vw] lg:items-start">
        {/* Left: heading, paragraph, button */}
        <div className="lg:pt-4">
          <h2
            id="expertise-heading"
            className="text-[1.85rem] leading-[1.1]! text-navy-900 sm:text-[2.1rem] lg:text-[2.3rem] fs-h2"
          >
            The <span className="text-green-700">right expertise</span>
            <br />
            starts with the <span className="text-green-700">right match.</span>
          </h2>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-navy-900/85 lg:max-w-[38vw] fs-body">
            We match you with a local accountant who has the specific expertise for your situation. From
            tax returns to SMSF and business advice, you&rsquo;ll be connected with an accountant who
            understands your needs.
          </p>
          <div className="mt-8">
            <Link href={QUESTIONNAIRE_URL} className="btn btn-primary btn-lg btn-fluid">
              Find My Accountant
              <span className="btn-arrow">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>

        {/* Right: every service page as a soft pill with a green tick */}
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-[0.75vw]">
          {services.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="flex min-h-11 items-center gap-3 rounded-xl border border-[#ece6d6] bg-[#fffcf3] px-3.5 py-1.5 text-[0.88rem] font-medium lg:min-h-[clamp(2.75rem,3vw,4.4rem)] lg:px-[1vw] fs-sm text-navy-900 shadow-[0_1px_2px_rgba(7,50,101,0.04)] transition duration-200 hoverable:hover:-translate-y-0.5 hoverable:hover:border-green-600/40 hoverable:hover:shadow-[0_10px_24px_-12px_rgba(7,50,101,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                <CheckCircle />
                <span>{s.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
