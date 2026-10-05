// Personal tax ad landing page (/ad-2), laid out as the owner's "personal" design picture (hero section/ad landing pages).
// Same structure as the business page (BusinessAdPage.tsx): the desk photograph runs behind the whole top of the page
// (header included), headline, steps and benefits on the left, the personal match box on the right.
// Phones: headline, match box, then the steps, benefits, small print and picture. Styles: ".pz-" (on top of ".bz-") in ads.css.
import Image from "next/image";
import { homeDeskHeroPicture } from "@/config/site.config";
import { PERSONAL_LANDING as L } from "@/content/personal-questionnaire";
import { ArrowRight } from "../ui/Icons";
import { AdFooter, AdHeader } from "./AdChrome";
import MatchFitScript from "../sections/MatchFitScript";
import PersonalMatchCard from "./PersonalMatchCard";
import PersonalQuestionnaire from "./PersonalQuestionnaire";
import { PeopleOutline, PinSolid, ShieldCheck } from "./BizIcons";

const BENEFIT_ICONS = { pin: PinSolid, people: PeopleOutline, shield: ShieldCheck };

export default function PersonalAdPage() {
  return (
    <div className="bz-page pz-page">
      <div className="pz-top">
        {/* the desk photograph along the bottom of the top area at its natural shape, so the handwriting lines up with its arrow */}
        <div aria-hidden className="bz-photo pz-photo">
          <Image src={homeDeskHeroPicture.src} alt="" width={homeDeskHeroPicture.width} height={homeDeskHeroPicture.height} priority sizes="100vw" className="h-auto w-full" />
          <p className="bz-script pz-script">{L.script.map((s) => <span key={s} className="block">{s}</span>)}</p>
        </div>
        <AdHeader className="pz-header" />
        <main className="bz-hero pz-hero">
          <div className="bz-wrap bz-grid pz-grid">
            <div className="bz-text">
              <h1 className="bz-h1 pz-h1">
                {L.h1[0]}<span className="text-[#0e7a32]">{L.h1[1]}</span>{L.h1[2]}
              </h1>
              <p className="bz-sub">{L.sub}</p>
            </div>

            <div className="bz-card-col">
              <PersonalMatchCard />
              <MatchFitScript />
            </div>

            <div className="bz-more">
              <ol className="bz-steps">
                {L.steps.map((s, i) => (
                  <li key={s}>{i > 0 && <ArrowRight aria-hidden className="bz-step-arrow" strokeWidth={2.4} />}<span>{s}</span></li>
                ))}
              </ol>
              <ul className="bz-benefits pz-benefits">
                {L.benefits.map((b) => {
                  const Icon = BENEFIT_ICONS[b.icon as keyof typeof BENEFIT_ICONS];
                  return (
                    <li key={b.text.join(" ")}>
                      <Icon className="pz-benefit-icon" />
                      <span>{b.text[0]}<br />{b.text[1]}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="bz-disclaimer pz-disclaimer">{L.disclaimer.map((d) => <span key={d} className="block">{d}</span>)}</p>
          </div>
        </main>
      </div>
      <AdFooter variant="personal" />
      <PersonalQuestionnaire />
    </div>
  );
}
