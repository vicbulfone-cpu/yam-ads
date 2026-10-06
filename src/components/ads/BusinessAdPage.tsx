// Business ad landing page (/ad-1), laid out as the owner's "business" design picture (hero section/ad landing pages).
// Desk photograph across the hero, headline and benefits on the left, the business match box on the right.
// Phones: headline, match box, then the steps, benefits and picture. Styles: ".bz-" in globals.css.
import Image from "next/image";
import { homeDeskHeroPicture } from "@/config/site.config";
import { BIZ_LANDING as L } from "@/content/business-questionnaire";
import { ArrowRight } from "../ui/Icons";
import { AdFooter, AdHeader } from "./AdChrome";
import HeroPoints from "../sections/HeroPoints";
import BizMatchCard from "./BizMatchCard";
import MatchFitScript from "../sections/MatchFitScript";
import { LazyBusinessQuestionnaire } from "./LazyQuestionnaires";
import { HandshakeSolid, PeopleSolid, PinSolid } from "./BizIcons";

const BENEFIT_ICONS = { pin: PinSolid, people: PeopleSolid, handshake: HandshakeSolid };

export default function BusinessAdPage() {
  return (
    <div className="bz-page">
      <AdHeader />
      <main className="bz-hero">
        {/* the desk photograph sits along the bottom of the hero at its natural shape, so the handwriting lines up with its arrow */}
        <div aria-hidden className="bz-photo">
          <Image src={homeDeskHeroPicture.src} alt="" width={homeDeskHeroPicture.width} height={homeDeskHeroPicture.height} priority sizes="100vw" className="h-auto w-full" />
          <p className="bz-script bz-script-biz fade-behind">{L.script.map((s) => <span key={s} className="block">{s}</span>)}</p>
        </div>

        <div className="bz-wrap bz-grid bz-grid-wide">
          <div className="bz-text">
            <h1 className="bz-h1">
              <span className="block">{L.h1[0]}</span>
              <span className="block text-[#0e7a32]">{L.h1[1]}</span>
              <span className="block">{L.h1[2]}</span>
            </h1>
            {/* the home page's three trust points, straight under the headline (owner, 6 Oct 2026) */}
            <HeroPoints className="bz-points" />
            <p className="bz-sub bz-sub-fade fade-behind">{L.sub}</p>
          </div>

          <div className="bz-card-col">
            <BizMatchCard longText className="bz-card-wide" />
            <MatchFitScript />
          </div>

          <div className="bz-more">
            <ol className="bz-steps bz-steps-shade fade-behind">
              {L.steps.map((s, i) => (
                <li key={s}>{i > 0 && <ArrowRight aria-hidden className="bz-step-arrow" strokeWidth={2.4} />}<span>{s}</span></li>
              ))}
            </ol>
            <ul className="bz-benefits">
              {L.benefits.map((b) => {
                const Icon = BENEFIT_ICONS[b.icon as keyof typeof BENEFIT_ICONS];
                return (
                  <li key={b.text.join(" ")}>
                    <span aria-hidden className="bz-benefit-icon"><Icon className="h-[55%] w-[55%]" /></span>
                    <span>{b.text[0]}<br />{b.text[1]}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="bz-disclaimer">{L.disclaimer}</p>
        </div>
      </main>
      <AdFooter />
      <LazyBusinessQuestionnaire />
    </div>
  );
}
