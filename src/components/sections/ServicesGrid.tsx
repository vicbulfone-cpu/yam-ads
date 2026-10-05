import Link from "next/link";
import { QUESTIONNAIRE_URL } from "@/config/site.config";

/*
 * "The right expertise starts with the right match." (home page)
 *
 * The services accountants in the network offer, shown as plain pills (this site has no separate service pages).
 */
const services = [
  "Tax Accountant", "Personal Tax Return Accountant", "Small Business Accountant", "SMSF Accountant", "Bookkeeper",
  "Bookkeeping and BAS Help", "Payroll and Compliance Support", "Business Structuring Advice", "Registration Services",
  "Registered Tax Agent", "Certified Practising Accountant", "Tax Deduction Expert", "Property and SMSF Specialist",
  "Cloud Accounting Support", "Business Growth Adviser", "Advanced Reporting Specialist", "Audit and Assurance Services",
  "Succession Planning Advice",
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

        {/* Right: every service as a soft pill with a green tick */}
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-[0.75vw]">
          {services.map((name) => (
            <li
              key={name}
              className="flex min-h-11 items-center gap-3 rounded-xl border border-[#ece6d6] bg-[#fffcf3] px-3.5 py-1.5 text-[0.88rem] font-medium lg:min-h-[clamp(2.75rem,3vw,4.4rem)] lg:px-[1vw] fs-sm text-navy-900 shadow-[0_1px_2px_rgba(7,50,101,0.04)]"
            >
              <CheckCircle />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
