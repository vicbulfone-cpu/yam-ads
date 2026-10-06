import Image from "next/image";
import Link from "next/link";
import { howWeSelect } from "@/content/how-we-select";
import { CREDENTIAL } from "@/content/wording";

/**
 * Home page trust section (owner, 6 Oct 2026: "for SEO trust ... make look professional"): points to
 * /how-we-select-accountants using approved wording only: the page's title, the approved credential claim, the seven
 * check titles (src/content/how-we-select.ts), the cost line from the ad pages ("Matching is free. Accountant fees are
 * agreed separately.") and the site's referral-service disclaimer.
 * Layout: the "Vetted partner network" heading and credential line on the left behind a thin divider (kept as it was);
 * on the right the owner's "how we" picture (hero section/ad landing pages, 6 Oct 2026): the seven checks as a grid of
 * green line icons (owner's icons, public/images/home/select-icons) with their titles, thin lines between the cells and
 * under each row, and a navy "See our selection process" button in the last cell. Four across on tablets and up, two
 * on phones. The full description of each check is on /how-we-select-accountants. The cost note sits under the grid.
 * Every word is real page text. Styles: ".sel-" in globals.css.
 */
const ICONS = [
  "01-identity-card", "02-professional-registration", "03-services-briefcase", "04-location-pin",
  "05-insurance-shield", "06-information-review", "07-customer-concerns",
].map((n) => `/images/home/select-icons/${n}.webp`);

export default function HomeSelection() {
  return (
    <section aria-labelledby="home-selection" className="sel">
      <div className="container-page home-wide sel-grid">
        <div className="sel-intro">
          <p className="sel-eyebrow fs-eyebrow">
            Vetted partner network
            <span aria-hidden="true" className="sel-eyebrow-rule" />
          </p>
          <h2 id="home-selection" className="sel-h2">
            <span className="block text-navy-900">How we select</span>
            <span className="block text-green-700">accountants</span>
          </h2>
          <p className="sel-lead">{CREDENTIAL}</p>
        </div>

        <div className="sel-right">
          <ul className="sel-checks">
            {howWeSelect.checks.map((k, i) => (
              <li key={k.n} className="sel-cell">
                <Image src={ICONS[i]} alt="" width={110} height={110} className="sel-icon" />
                <p className="sel-title">{k.title}</p>
              </li>
            ))}
            <li className="sel-cell sel-cell-cta">
              <Link href="/how-we-select-accountants" className="sel-cta">
                See our selection process
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </li>
          </ul>

          <p className="sel-note">
            <strong>Matching is free. Accountant fees are agreed separately.</strong>{" "}
            Your Accountant Match is a referral service. Accounting and advisory services are provided by your matched firm.
          </p>
        </div>
      </div>
    </section>
  );
}
