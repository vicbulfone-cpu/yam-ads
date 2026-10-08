// The personal tax ad page's sections 2-6 (owner, 9 Oct 2026), straight under the hero and above the page's existing
// sections: Personal Tax Services (six cards), Find the Right Accountant (navy band + button), Why Use an Accountant
// (checklist), How it works (three numbered steps + button) and Personal Tax Questions (FAQ). Wording:
// src/content/personal-sections.ts. Buttons are #match-box links: AdBoxPopup opens the personal match box (every size).
// The FAQ boxes use the site's FAQ box look (".sel-" in globals.css) without the home FAQ's structured-data markers.
// Styles: ".pps-" in ads.css.
import Image from "next/image";
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import { PERSONAL_SERVICES as S, PERSONAL_RIGHT_FIT as R, PERSONAL_WHY as W, PERSONAL_HOW as H, PERSONAL_FAQ as F } from "@/content/personal-sections";
import { ArrowRight } from "../ui/Icons";

function Cta({ label }: { label: string }) {
  return (
    <a href={`#${AD_MATCH_BOX_ID}`} className="pps-cta">
      <span>{label}</span>
      <ArrowRight aria-hidden className="pps-cta-arrow" strokeWidth={2.6} />
    </a>
  );
}

const Tick = () => (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="pps-tick">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export default function PersonalSections() {
  return (
    <div className="pps">
      {/* SECTION 2: what we can help you with */}
      <section className="pps-sec pps-services" aria-labelledby="pps-services-h">
        <div className="pps-wrap">
          {/* desktops only: round icon badge beside the heading (owner's example) */}
          <span aria-hidden className="pps-svc-badge"><Image src={S.cards[0].icon} alt="" width={160} height={160} /></span>
          <p className="pps-eyebrow">{S.eyebrow}</p>
          <h2 id="pps-services-h" className="pps-h2">{S.h2}</h2>
          <p className="pps-intro">{S.intro}</p>
          <ul className="pps-cards">
            {S.cards.map((c) => (
              <li key={c.title} className="pps-card">
                <span className="pps-card-icon"><Image src={c.icon} alt="" width={160} height={160} /></span>
                <h3 className="pps-h3">{c.title}</h3>
                <p className="pps-card-text">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 3: find the right accountant */}
      <section className="pps-sec pps-fit" aria-labelledby="pps-fit-h">
        <div className="pps-wrap pps-fit-grid">
          <div>
            <h2 id="pps-fit-h" className="pps-h2 pps-on-navy">{R.h2}</h2>
            <p className="pps-fit-lead">{R.lead}</p>
            <p className="pps-fit-text">{R.text}</p>
          </div>
          <div className="pps-fit-close">
            <p className="pps-fit-tag"><span>{R.close[0]}</span> <span className="pps-fit-tag-green">{R.close[1]}</span></p>
            <Cta label={R.cta} />
          </div>
          {/* desktops only: the people the sentence names, as white tiles (owner's example "Who is it for?") */}
          <ul className="pps-tiles" aria-hidden>
            {R.tiles.map((t) => (
              <li key={t.label} className="pps-tile">
                <Image src={t.icon} alt="" width={160} height={160} className="pps-tile-icon" />
                <span>{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 4: why use an accountant */}
      <section className="pps-sec pps-why" aria-labelledby="pps-why-h">
        <div className="pps-wrap pps-why-grid">
          <div>
            <h2 id="pps-why-h" className="pps-h2">{W.h2}</h2>
            <p className="pps-intro">{W.lead}</p>
          </div>
          <ul className="pps-checks">
            {W.points.map((p) => (
              <li key={p}><span className="pps-check"><Tick /></span>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 5: how it works */}
      <section className="pps-sec pps-how" aria-labelledby="pps-how-h">
        <div className="pps-wrap">
          <p className="pps-eyebrow">{H.eyebrow}</p>
          <h2 id="pps-how-h" className="pps-h2">{H.h2}</h2>
          <ol className="pps-steps">
            {H.steps.map((s, i) => (
              <li key={s.title} className="pps-step">
                <span className="pps-step-num" aria-hidden>{i + 1}</span>
                <h3 className="pps-h3"><span className="sr-only">{i + 1}. </span>{s.title}</h3>
                <p className="pps-card-text">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="pps-how-cta"><Cta label={H.cta} /></div>
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="pps-sec pps-faq" aria-labelledby="pps-faq-h">
        <div className="pps-wrap pps-faq-grid">
          <h2 id="pps-faq-h" className="pps-h2">{F.h2}</h2>
          <div className="pps-faq-list">
            {F.items.map((f) => (
              <details key={f.q} className="sel-box">
                <summary className="sel-sum">
                  <span className="sel-q">{f.q}</span>
                  <span aria-hidden="true" className="sel-plus">
                    <span className="sel-bar" />
                    <span className="sel-bar sel-bar-v" />
                  </span>
                </summary>
                <p className="sel-a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
