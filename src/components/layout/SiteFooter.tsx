import Link from "next/link";
import type { Node } from "@/lib/content";
import { BUSINESS } from "@/content/business";
import { AD_LANDING_PAGES } from "@/lib/pages";

const HOME_FOOTER_COLUMNS: { title: string; links: { text: string; href?: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { text: "About", href: "/about" },
      { text: "How It Works", href: "/how-it-works" },
      { text: "Contact", href: "/contact" },
    ],
  },
  // (the "Locations" column held only Melbourne; removed with that page, owner 6 Oct 2026)
  {
    title: "Information",
    links: [
      { text: "Privacy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
      { text: "How We Select Accountants", href: "/how-we-select-accountants" },
    ],
  },
];

/** Links to the four ad landing pages, each named as its page, under the heading "Services" (owner, 6 Oct 2026). */
const AD_COLUMN = { title: "Services", links: AD_LANDING_PAGES.map((a) => ({ text: a.name, href: a.path })) };

/** Home page footer, laid out as in the owner's "home page 2" picture. */
function HomeFooter({ showAds }: { showAds?: boolean }) {
  const columns = showAds ? [...HOME_FOOTER_COLUMNS, AD_COLUMN] : HOME_FOOTER_COLUMNS;
  return (
    <footer className="border-t border-line bg-[#f7f9fb]">
      <div className="container-page pb-6 pt-12 md:pt-14">
        <div className={`grid gap-10 ${showAds ? "md:grid-cols-[1.3fr_0.7fr_1fr_1.3fr]" : "md:grid-cols-[1.4fr_0.8fr_1fr]"}`}>
          <div>
            <p className="text-[1.45rem] font-extrabold tracking-tight text-navy-900">
              Your Accountant <span className="text-green-700">Match</span>
            </p>
            {/* letter spacing set so this line is exactly as wide as "Your Accountant Match" above (owner, 6 Oct 2026); the negative
                right margin cancels the spacing after the last letter */}
            <p className="mt-1 mr-[-0.1445em] text-[0.62rem] font-bold uppercase tracking-[0.1445em] text-navy-900/70">Smarter matching. Better outcomes.</p>
            <p className="mt-4 max-w-[17rem] text-[0.88rem] leading-relaxed text-body">Connecting Australians with one local accountant who suits their needs.</p>
            <p className="mt-3 text-[0.88rem]">
              <a href={`mailto:${BUSINESS.email}`} className="font-semibold text-navy-900 transition hover:text-green-700">{BUSINESS.email}</a>
              {BUSINESS.phone && <><br /><a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`} className="font-semibold text-navy-900 transition hover:text-green-700">{BUSINESS.phone}</a></>}
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[0.85rem] font-extrabold text-navy-900">{col.title}</p>
              <ul className={`mt-2 ${col.title === "Locations" ? "grid grid-flow-col grid-rows-7 gap-x-6" : ""}`}>
                {col.links.map((l) => (
                  <li key={l.text}>
                    {l.href ? (
                      <Link href={l.href} className="inline-flex min-h-9 items-center text-[0.86rem] text-body transition hover:text-green-700 md:min-h-7">{l.text}</Link>
                    ) : (
                      <span className="inline-flex min-h-9 items-center text-[0.86rem] text-body md:min-h-7">{l.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-5 text-[0.78rem] text-muted md:flex-row md:justify-between">
          <p>&copy; Your Accountant Match. All rights reserved.</p>
          <p>Your Accountant Match is a referral service. Accounting and advisory services are provided by your matched firm. Accountant fees are agreed separately.</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Every site page uses the home page footer, "Services" column included (owner, 7 Oct 2026). The ad landing pages and
 * /match keep their own AdFooter (ads/AdChrome.tsx). The props are kept so existing callers need no change.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SiteFooter(_props: { nodes?: Node[]; variant?: "home"; showAds?: boolean }) {
  return <HomeFooter showAds />;
}
