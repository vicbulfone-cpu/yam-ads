import Link from "next/link";
import { howWeSelect } from "@/content/how-we-select";
import { CREDENTIAL } from "@/content/wording";

/**
 * Home page trust section (owner, 6 Oct 2026: "for SEO trust ... make look professional"): points to
 * /how-we-select-accountants using approved wording only: the page's title, the approved credential claim, the seven
 * check titles (src/content/how-we-select.ts), the cost line from the ad pages ("Matching is free. Accountant fees are
 * agreed separately.") and the site's referral-service disclaimer. Styles: ".sel-" in globals.css.
 */
const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="sel-tick">
    <circle cx="12" cy="12" r="11" fill="currentColor" />
    <path d="m7.4 12.3 3 3 6.2-6.6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HomeSelection() {
  return (
    <section aria-labelledby="home-selection" className="sel">
      <div className="container-page home-wide">
        <div className="sel-card">
          <div className="sel-head">
            <span className="sel-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2.4 4.4 5.3v5.8c0 4.7 3.1 8.7 7.6 10.1 4.5-1.4 7.6-5.4 7.6-10.1V5.3L12 2.4Z" fill="currentColor" />
                <path d="m8.6 11.9 2.4 2.4 4.4-4.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="sel-eyebrow">Vetted partner network</p>
              <h2 id="home-selection" className="sel-h2">{howWeSelect.title}</h2>
              <p className="sel-lead">{CREDENTIAL}</p>
            </div>
          </div>

          <ol className="sel-checks">
            {howWeSelect.checks.map((c) => (
              <li key={c.n}>
                <Check />
                <span>{c.title}</span>
              </li>
            ))}
            {/* the eighth tile: the link to the full page (completes the 4 + 4 grid on laptops) */}
            <li className="sel-tile-link">
              <Link href="/how-we-select-accountants">
                How We Select Accountants
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </li>
          </ol>

          <div className="sel-foot">
            <p className="sel-note">
              <strong>Matching is free. Accountant fees are agreed separately.</strong>{" "}
              Your Accountant Match is a referral service. Accounting and advisory services are provided by your matched firm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
