import Image from "next/image";
import { HOME_SERVICES, HOME_SERVICE_CARDS } from "@/content/home-services";
import { HOME_WHY_SERVICES } from "@/content/home-why-specialist";
import { SERVICE_ICONS } from "./HomeWhySpecialist";
import HeroGap from "./HeroGap";
import IconSequence from "../ui/IconSequence";

/**
 * Home page, straight under the hero (owner, 10 Oct 2026, noc): "What we can help you with", the ad pages' services
 * section scaled back to the four services. Laid out as "Why Use a Specialist Accountant?" below it (heading left, intro
 * right behind a thin divider; four cards across on large screens, two on tablets, one on phones), but lighter so the
 * two read apart: a white band, white cards with a green top edge, the service's round green icon and name, then four
 * of its services, each a small green arrow, a bold name and its line.
 * It sits where "How it works" used to start, so it carries the hero gap (HeroGap: 3cm under the hero on laptops and
 * desktops). Wording: src/content/home-services.ts. Styles: ".hsv-" in globals.css.
 */
export default function HomeServices() {
  return (
    <section aria-labelledby="home-services" className="hsv">
      <HeroGap cm={3} />
      <div className="container-page home-wide">
        <div className="whys-head">
          <div>
            <p className="whys-eyebrow fs-eyebrow">{HOME_SERVICES.eyebrow}</p>
            <h2 id="home-services" className="whys-h2">
              {HOME_SERVICES.h2.slice(0, -HOME_SERVICES.h2Accent.length)}<span className="whys-accent">{HOME_SERVICES.h2Accent}</span>
            </h2>
          </div>
          <div className="whys-intro">
            <p>{HOME_SERVICES.intro}</p>
          </div>
        </div>

        <ul className="whys-cards hsv-cards">
          {HOME_WHY_SERVICES.map((s) => (
            <li key={s.key} className="hsv-card">
              <div className="hsv-card-head">
                <span className="whys-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{SERVICE_ICONS[s.key]}</svg>
                </span>
                <div>
                  <h3 className="hsv-card-h">{s.name}</h3>
                  <p className="hsv-card-who">{s.who}</p>
                </div>
              </div>
              <ul className="hsv-list">
                {HOME_SERVICE_CARDS[s.key].map((c) => (
                  <li key={c.title} className="hsv-item">
                    {/* the "Why Use a Specialist Accountant?" tick in place of the arrow (owner, 10 Oct 2026) */}
                    <Image src="/images/ad-personal/help/tick.webp" alt="" width={146} height={118} className="whys-tick" />
                    <div>
                      <h4 className="hsv-item-title">{c.title}</h4>
                      <p className="hsv-item-text">{c.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {/* the four icons pop in one by one, 1 second after the page is scrolled to them, 2 seconds in all (owner, 10 Oct 2026) */}
        <IconSequence list=".hsv-cards" item=".hsv-card" slot={600} />
      </div>
    </section>
  );
}
