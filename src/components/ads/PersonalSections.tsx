// The personal tax ad page's own sections (owner, 9 Oct 2026), straight under the hero and above the page's shared
// sections: Personal Tax Services (six cards), Why Use an Accountant (words + trust points, checklist card), both laid
// out as the owner's "z" picture with the home page's navy "Ready to meet your accountant?" bar between them, then
// Find the Right Accountant (Who we help). The page's own "How it works" was removed (the shared sections below have the home one), and
// the four personal tax questions are in the bottom FAQ. Wording: src/content/personal-sections.ts.
// Styles: ".pps-" in ads.css.
import Image from "next/image";
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import StartBar from "../sections/StartBar";
import PpsCardsReveal from "./PpsCardsReveal";
import { SERVICE_ICONS, PersonIcon, ChartIcon, HouseIcon, BriefcaseIcon, ScreenIcon } from "./PersonalServiceIcons";

/** "Who we help" cards: the owner's "r" folder icons (owner, 9 Oct 2026) */
const WHO_ICONS: Record<string, () => React.JSX.Element> = {
  Employees: PersonIcon, // individual_tax_returns.png
  Investors: ChartIcon, // investments_shares.png
  Landlords: HouseIcon, // rental_property_tax.png
  Contractors: BriefcaseIcon, // contractor_freelance_income.png
  "Self-employed": ScreenIcon, // tax_deductions.png
};
import { PERSONAL_SERVICES, PERSONAL_RIGHT_FIT, PERSONAL_WHY } from "@/content/personal-sections";

type Services = { eyebrow: string; h2: string; intro: string; cards: { title: string; text: string; /** use this personal card's icon */ iconOf?: string }[] };

type RightFit = Omit<typeof PERSONAL_RIGHT_FIT, "tiles"> & { tiles: { label: string; /** use this personal tile's icon */ iconOf?: string }[] };

/** services, why, fit: another ad page's own wording for sections 2, 3 and 4 (owner, 9 Oct 2026: the business page /ad-1) */
export default function PersonalSections({ services: S = PERSONAL_SERVICES, why: W = PERSONAL_WHY, fit: R = PERSONAL_RIGHT_FIT }: { services?: Services; why?: typeof PERSONAL_WHY; fit?: RightFit }) {
  return (
    <div className="pps">
      {/* SECTION 2: what we can help you with (swapped with section 3, owner 9 Oct 2026) */}
      <section className="pps-sec pps-services" aria-labelledby="pps-services-h">
        <div className="pps-wrap">
          <p className="pps-eyebrow">{S.eyebrow}</p>
          <h2 id="pps-services-h" className="pps-h2">{S.h2}</h2>
          <p className="pps-intro">{S.intro}</p>
          {/* the owner's round icons, animated in the "Why it matters" style (owner, 9 Oct 2026):
              PpsCardsReveal adds "wim-anim", then "is-in" to each card as it scrolls into view, once (".psi-" in ads.css) */}
          <ul className="pps-cards">
            {S.cards.map((c) => {
              const Icon = SERVICE_ICONS[c.iconOf ?? c.title];
              return (
                <li key={c.title} className="pps-card">
                  <span className="pps-svc-icon"><Icon /></span>
                  <div>
                    <h3 className="pps-h3">{c.title}</h3>
                    <p className="pps-card-text">{c.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <PpsCardsReveal />
        </div>
      </section>

      {/* the home page's navy "Ready to meet your accountant?" bar (owner, 9 Oct 2026), full width between sections 2 and 3, with its own words (owner, 9 Oct 2026);
          the gaps above and below it each equal the gap that was between them. Start opens the personal match box. */}
      <div className="pps-bar-gap pps-bar-gap--ideal"><StartBar startHref={`#${AD_MATCH_BOX_ID}`} buttonOnPhone={false} className="bar-align-how-row"
        title="Your Ideal Accountant Awaits" sub="Less searching. Better matching. Less hassle." buttonLabel="Find My Match" /></div>

      {/* SECTION 3: why use an accountant (owner's "z" layout: words + trust points left, checklist card right) */}
      <section className="pps-sec pps-why" aria-labelledby="pps-why-h">
        <div className="pps-wrap pps-why-grid">
          <div className="pps-why-text">
            <p className="pps-eyebrow pps-eyebrow-plain">{W.eyebrow}</p>
            <h2 id="pps-why-h" className="pps-h2 pps-why-h2">
              {W.h2.slice(0, -W.h2Accent.length)}<span className="pps-accent">{W.h2Accent}</span>
            </h2>
            {W.intro.map((t) => <p key={t} className="pps-intro">{t}</p>)}
            {/* (the three trust icons under the intro were removed, owner 9 Oct 2026) */}
          </div>
          {/* the owner's "s" design (9 Oct 2026): navy title bar with a green round badge and "HELP YOU:" in green; ten
              points in two columns, each a round green icon, a bold title and a line under it, a fine rule between rows */}
          <div className="pps-why-card">
            <div className="pps-why-card-bar">
              <Image src={W.badge} alt="" width={160} height={160} className="pps-why-card-badge" />
              <p className="pps-why-card-h">
                {W.lead.slice(0, -W.leadAccent.length)}<span className="pps-why-card-accent">{W.lead.slice(-W.leadAccent.length)}</span>
              </p>
            </div>
            <ul className="pps-helps">
              {W.points.map((p) => (
                <li key={p.title} className="pps-help">
                  {/* the owner's tick picture instead of each point's own icon (owner, 9 Oct 2026; scripts/make-personal-help-tick.mjs) */}
                  <Image src="/images/ad-personal/help/tick.webp" alt="" width={146} height={118} className="pps-help-tick" />
                  <span>
                    <strong className="pps-help-title">{p.title}</strong>
                    <span className="pps-help-text">{p.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* the same bar above "Who we help", with its own words (owner, 9 Oct 2026); the gaps above and below it each equal the gap that was there */}
      <div className="pps-bar-gap pps-bar-gap--fit"><StartBar startHref={`#${AD_MATCH_BOX_ID}`} buttonOnPhone={false} className="bar-align-how-row"
        title="Your Tax Accountant Is One Match Away." sub="Save time. Skip the guesswork. Find your match." /></div>

      {/* SECTION 4: find the right accountant, styled as section 3 (label with a line, heading, intro, pale cards) */}
      <section className="pps-sec pps-fit" aria-labelledby="pps-fit-h">
        <div className="pps-wrap">
          <p className="pps-eyebrow">{R.eyebrow}</p>
          <h2 id="pps-fit-h" className="pps-h2">{R.h2}</h2>
          <p className="pps-intro"><strong className="pps-fit-lead">{R.lead}</strong> {R.text}</p>
          {/* the people the sentence names, as cards (decorative: the sentence already says it) */}
          <ul className="pps-tiles" aria-hidden>
            {R.tiles.map((t) => {
              const Icon = WHO_ICONS[t.iconOf ?? t.label];
              return (
                <li key={t.label} className="pps-tile">
                  <span className="pps-tile-icon"><Icon /></span>
                  <span className="pps-h3">{t.label}</span>
                </li>
              );
            })}
          </ul>
          {/* the same animation as the services cards, as they scroll into view (owner, 9 Oct 2026) */}
          <PpsCardsReveal list=".pps-tiles" item=".pps-tile" />
        </div>
      </section>

      {/* the same bar at the end, straight above the shared "How it works", with its own words (owner, 9 Oct 2026); gaps as above */}
      <div className="pps-bar-gap pps-bar-gap--how"><StartBar startHref={`#${AD_MATCH_BOX_ID}`} buttonOnPhone={false} className="bar-align-how-row"
        title="Make Tax Time Easier." sub="The right expertise. Your area. Less hassle." /></div>

    </div>
  );
}
