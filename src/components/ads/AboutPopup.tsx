import { ABOUT_POPUP as A } from "@/content/about-popup";
import { Check, Pin, Shield, Star } from "../ui/Icons";
import { PeopleOutline } from "./BizIcons";

/**
 * The "About" popup's content on the ad pages (owner, 7 Oct 2026): the owner's About Us wording, laid out in the site's
 * style. Story and promise first, then a navy expertise band with the 19+ figure, then the four reasons as cards.
 * Styles: ".abp" in ads.css. Wording: src/content/about-popup.ts.
 */
const WHY_ICONS: Record<string, React.ReactNode> = {
  local: <Pin width={24} height={24} />,
  privacy: <Shield width={24} height={24} />,
  network: <PeopleOutline className="h-6 w-6" />,
  roots: <Star width={24} height={24} />,
};

export default function AboutPopup() {
  return (
    <div className="abp">
      <section className="abp-intro">
        <h3 className="abp-h">{A.intro.heading}</h3>
        <p className="abp-lead">{A.intro.lead}</p>
        <p className="abp-statement">{A.intro.statement}</p>
        <p className="abp-p">{A.intro.body}</p>
        <p className="abp-promise">
          <span aria-hidden className="abp-promise-icon"><Check width={18} height={18} strokeWidth={3} /></span>
          <span>{A.intro.promise}</span>
        </p>
      </section>

      <section className="abp-expertise">
        <div className="abp-figure" aria-hidden>
          <span className="abp-figure-num">{A.expertise.figure}</span>
          <span className="abp-figure-label">{A.expertise.figureLabel}</span>
        </div>
        <div>
          <h3 className="abp-h abp-h-light">{A.expertise.heading}</h3>
          {A.expertise.paragraphs.map((p) => <p key={p} className="abp-p">{p}</p>)}
        </div>
      </section>

      <section className="abp-why">
        <h3 className="abp-h">{A.why.heading}</h3>
        <ul className="abp-cards">
          {A.why.items.map((w) => (
            <li key={w.id} className="abp-card">
              <span aria-hidden className="abp-card-icon">{WHY_ICONS[w.id]}</span>
              <h4 className="abp-card-title">{w.title}</h4>
              <p className="abp-card-text">{w.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
