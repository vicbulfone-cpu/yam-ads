import Image from "next/image";
import Link from "next/link";
import { QUESTIONNAIRE_URL } from "@/config/site.config";

/** Home page: "Tax & Accounting Insights" — four article cards (same photos as the article pages). */

const articles = [
  {
    tag: "Tax basics",
    title: "Keeping your tax records organised",
    excerpt: "Simple tips to stay on top of your records and make tax time easier.",
    href: "/articles/keeping-your-tax-records-organised",
    image: "/images/home/house-front.webp",
    alt: "Neat single-storey Australian home with a tidy front garden",
  },
  {
    tag: "Working with an accountant",
    title: "What to prepare before meeting an accountant",
    excerpt: "Find out what information to have ready so you get the most from your first meeting.",
    href: "/articles/what-to-prepare-before-meeting-an-accountant",
    image: "/images/home/client-meeting.webp",
    alt: "Accountant smiling across the desk at a client during a first meeting",
  },
  {
    tag: "Business tools",
    title: "Choosing accounting software for your business",
    excerpt: "Compare popular options and find the right fit for your business needs.",
    href: "/articles/choosing-accounting-software-for-your-business",
    image: "/images/home/city-desk-laptop.webp",
    alt: "Laptop and pot plant on a desk overlooking a city skyline across the water",
  },
  {
    tag: "Small business",
    title: "Planning ahead for tax time",
    excerpt: "Practical steps to prepare early and reduce stress when tax time rolls around.",
    href: "/articles/planning-ahead-for-tax-time",
    image: "/images/home/cafe-owner-man.webp",
    alt: "Smiling cafe owner in a striped apron at his counter",
  },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function InsightsSection() {
  return (
    <section id="insights" className="bg-[#eaf8ef] py-16 md:py-20">
      <div className="container-page home-wide">
        <p className="inline-flex rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-green-700 fs-eyebrow">Latest insights</p>
        <h2 className="mt-4 text-[1.85rem] leading-[1.1]! text-navy-900 sm:text-[2.1rem] lg:text-[2.3rem] fs-h2">
          Tax &amp; Accounting <span className="text-green-700">Insights</span>
        </h2>
        <p className="mt-3 text-[1rem] text-navy-900/85 fs-lead">Practical articles on tax, business, super and accounting.</p>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[1.5vw]">
          {articles.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="group flex h-full flex-col overflow-hidden rounded-[1rem] bg-white shadow-[0_10px_28px_-16px_rgba(7,50,101,0.3)] transition duration-300 motion-reduce:transition-none hoverable:hover:-translate-y-1 hoverable:hover:shadow-[0_18px_36px_-14px_rgba(7,50,101,0.35)]"
              >
                <div className="relative aspect-[1.55/1]">
                  <Image src={a.image} alt={a.alt} fill sizes="(min-width:1024px) 21vw, (min-width:640px) 46vw, 92vw" className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.03em] text-green-700 shadow-sm lg:text-[clamp(0.66rem,0.7vw,1.05rem)]">{a.tag}</span>
                </div>
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4 lg:px-[1.3vw] lg:pb-[1.3vw] lg:pt-[1vw]">
                  <h3 className="text-[1.05rem] leading-[1.2]! text-navy-900 fs-card">{a.title}</h3>
                  <p className="mt-1.5 text-[0.86rem] leading-snug text-navy-900/75 fs-sm">{a.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[0.85rem] font-bold text-green-700 fs-sm">
                    Read article <span className="transition-transform group-hover:translate-x-1"><Arrow /></span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-10">
          <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-[0.98rem] font-bold text-green-700 fs-body underline decoration-green-200 decoration-2 underline-offset-[6px] hover:decoration-green-600">
            Explore all articles <Arrow />
          </Link>
          <Link href={QUESTIONNAIRE_URL} className="btn btn-primary btn-fluid">
            Find My Accountant <span className="btn-arrow" aria-hidden="true"><Arrow /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
