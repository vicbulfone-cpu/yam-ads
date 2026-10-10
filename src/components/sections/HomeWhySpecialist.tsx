import Image from "next/image";
import { HOME_WHY, HOME_WHY_SERVICES } from "@/content/home-why-specialist";

/**
 * Home page, under "What we can help you with" (owner, 10 Oct 2026, noc): "Why Use a Specialist Accountant?", in the look of the ad
 * pages' "Why Use…" section (mint band, plain green label, navy heading ending in green, the ad pages' green tick).
 * The heading and label on the left, the two intro paragraphs on the right behind a thin divider (as "How it works");
 * then "An experienced specialist can help you:" and the four services as white cards, each with a navy title bar and
 * six ticked points. Four across on large screens, two on tablets and small laptops, one on phones.
 * (The hero gap moved to HomeServices.tsx, which now sits straight under the hero, owner 10 Oct 2026.)
 * Wording: src/content/home-why-specialist.ts. Styles: ".whys-" in globals.css.
 */

/** each service's line icon (24 x 24, stroked), also used by HomeServices.tsx */
export const SERVICE_ICONS: Record<string, React.ReactNode> = {
  // person
  personal: <><circle cx="12" cy="8" r="3.6" /><path d="M4.8 20c.9-3.6 3.6-5.6 7.2-5.6s6.3 2 7.2 5.6" /></>,
  // briefcase
  business: <><rect x="3" y="7.5" width="18" height="12" rx="2" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12.5h18" /></>,
  // nest egg on a rising bar
  smsf: <><path d="M4 20h16" /><path d="M7 20v-5M12 20v-8M17 20v-11" /><path d="m5.5 9.5 4-3.5 3.5 2.5L19 4" /><path d="M15.5 4H19v3.5" /></>,
  // document with a tick
  registration: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="m9 14 2 2 4-4" /></>,
};

export default function HomeWhySpecialist() {
  return (
    <section aria-labelledby="home-why-specialist" className="whys">
      <div className="container-page home-wide">
        <div className="whys-head">
          <div>
            <p className="whys-eyebrow fs-eyebrow">{HOME_WHY.eyebrow}</p>
            <h2 id="home-why-specialist" className="whys-h2">
              {HOME_WHY.h2.slice(0, -HOME_WHY.h2Accent.length)}<span className="whys-accent">{HOME_WHY.h2Accent}</span>
            </h2>
          </div>
          <div className="whys-intro">
            {HOME_WHY.intro.map((t) => <p key={t}>{t}</p>)}
          </div>
        </div>

        <p className="whys-lead">{HOME_WHY.lead}</p>
        <ul className="whys-cards">
          {HOME_WHY_SERVICES.map((s) => (
            <li key={s.key} className="whys-card">
              <div className="whys-card-bar">
                <span className="whys-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{SERVICE_ICONS[s.key]}</svg>
                </span>
                <div>
                  <h3 className="whys-card-h">{s.name}</h3>
                  <p className="whys-card-who">{s.who}</p>
                </div>
              </div>
              <ul className="whys-points">
                {s.points.map((p) => (
                  <li key={p.title} className="whys-point">
                    <Image src="/images/ad-personal/help/tick.webp" alt="" width={146} height={118} className="whys-tick" />
                    <span>
                      <strong className="whys-point-title">{p.title}</strong>
                      <span className="whys-point-text">{p.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {/* ("Find My Specialist" button and "Free matching • No obligation" removed, owner 10 Oct 2026: the navy bar below has a button) */}
      </div>
    </section>
  );
}
