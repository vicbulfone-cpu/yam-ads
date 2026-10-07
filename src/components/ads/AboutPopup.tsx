import { ABOUT_POPUP as A } from "@/content/about-popup";
import { Check, Pin, Shield, Star } from "../ui/Icons";
import { PeopleOutline } from "./BizIcons";

/**
 * The "About" popup's content on the ad pages (owner, 7 Oct 2026): the owner's About Us wording, laid out in the site's
 * style (also the whole /about page, src/components/AboutPage.tsx). Story and promise first, then a navy expertise band with the 19+ figure, then the four reasons as cards.
 * Styles: ".abp" in ads.css. Wording: src/content/about-popup.ts.
 */
const WHY_ICONS: Record<string, React.ReactNode> = {
  local: <Pin width={24} height={24} />,
  privacy: <Shield width={24} height={24} />,
  network: <PeopleOutline className="h-6 w-6" />,
  roots: <Star width={24} height={24} />,
};

/** `level`: the popup uses h3 (under its "About Us" h2); the /about page uses h2 (under its h1). */
export default function AboutPopup({ level = 3 }: { level?: 2 | 3 }) {
  const H = level === 2 ? "h2" : "h3";
  const H4 = level === 2 ? "h3" : "h4";
  return (
    <div className="abp">
      <section className="abp-intro">
        {/* /about page (owner, 7 Oct 2026): "Shouldn't Be a Game of Chance" in green; the ad pages' popup is unchanged */}
        <H className="abp-h">
          {level === 2 && A.intro.heading.includes("Shouldn't") ? (
            <>
              {A.intro.heading.slice(0, A.intro.heading.indexOf("Shouldn't"))}
              <span className="text-green-700">{A.intro.heading.slice(A.intro.heading.indexOf("Shouldn't"))}</span>
            </>
          ) : (
            A.intro.heading
          )}
        </H>
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
          <H className="abp-h abp-h-light">{A.expertise.heading}</H>
          {A.expertise.paragraphs.map((p) => <p key={p} className="abp-p">{p}</p>)}
        </div>
      </section>

      <section className="abp-why">
        <H className="abp-h">{A.why.heading}</H>
        <ul className="abp-cards">
          {A.why.items.map((w) => (
            <li key={w.id} className="abp-card">
              <span aria-hidden className="abp-card-icon">{WHY_ICONS[w.id]}</span>
              <H4 className="abp-card-title">{w.title}</H4>
              <p className="abp-card-text">{w.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
