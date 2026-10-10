import { HOME_WHO, HOME_WHO_TILES } from "@/content/home-who-we-help";
import { HOME_WHY_SERVICES } from "@/content/home-why-specialist";
import { SERVICE_ICONS } from "./HomeWhySpecialist";

/**
 * Home page, above "How it works" (owner, 10 Oct 2026, noc): "Who we help", the ad pages' "Find the Right Accountant…"
 * section across the four services. Laid out as the two sections above it (heading left, intro right behind a thin
 * divider; four cards across on large screens, two on tablets, one on phones), on the same mint: white cards with a
 * green top edge, the service's round green icon and name, then the five people it helps, each with a green tick.
 * Wording: src/content/home-who-we-help.ts. Styles: ".whof-" (and the ".whys-" / ".hsv-" heading and cards) in globals.css.
 */
export default function HomeWhoWeHelp() {
  return (
    <section aria-labelledby="home-who-we-help" className="whof">
      <div className="container-page home-wide">
        <div className="whys-head">
          <div>
            <p className="whys-eyebrow fs-eyebrow">{HOME_WHO.eyebrow}</p>
            <h2 id="home-who-we-help" className="whys-h2">
              {HOME_WHO.h2.slice(0, -HOME_WHO.h2Accent.length)}<span className="whys-accent">{HOME_WHO.h2Accent}</span>
            </h2>
          </div>
          <div className="whys-intro">
            <p><strong className="whof-lead"><span className="text-green-700">{HOME_WHO.leadGreen}</span>{HOME_WHO.lead.slice(HOME_WHO.leadGreen.length)}</strong> {HOME_WHO.text}</p>
          </div>
        </div>

        <ul className="whys-cards hsv-cards">
          {HOME_WHY_SERVICES.map((s) => (
            <li key={s.key} className="hsv-card">
              <div className="hsv-card-head">
                <span className="whys-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{SERVICE_ICONS[s.key]}</svg>
                </span>
                <h3 className="hsv-card-h">{s.name}</h3>
              </div>
              <ul className="whof-list">
                {HOME_WHO_TILES[s.key].map((label) => (
                  <li key={label} className="whof-item">
                    {/* the green arrow of "What we can help you with" (HomeServices.tsx) in place of the round tick (owner, 10 Oct 2026) */}
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="hsv-arrow">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                    {label}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
