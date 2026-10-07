// Business ad landing page (/ad-1), laid out as the owner's "business" design picture (hero section/ad landing pages).
// Desk photograph across the hero, headline and benefits on the left, the business match box on the right.
// Phones: headline, match box, then the steps, benefits and picture. Styles: ".bz-" in globals.css.
import Image from "next/image";
import { homeDeskHeroNoArrowPicture } from "@/config/site.config";
import { AdHeroArrow, AdHeroBar } from "./AdHeroParts";
import HomeStepsFit from "../sections/HomeStepsFit";
import { BIZ_LANDING as L } from "@/content/business-questionnaire";
import { ArrowRight } from "../ui/Icons";
import { AdFooter, AdHeader } from "./AdChrome";
import HeroPoints from "../sections/HeroPoints";
import BizMatchCard from "./BizMatchCard";
import MatchFitScript from "../sections/MatchFitScript";
import { LazyBusinessQuestionnaire } from "./LazyQuestionnaires";
import AdHomeSections from "./AdHomeSections";
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";

export default function BusinessAdPage() {
  return (
    <div className="bz-page">
      <AdHeader />
      <main>
        <div className="bz-hero">
        {/* the desk photograph sits along the bottom of the hero at its natural shape, so the handwriting lines up with its arrow */}
        <div aria-hidden className="bz-photo">
          <Image src={homeDeskHeroNoArrowPicture.src} alt="" width={homeDeskHeroNoArrowPicture.width} height={homeDeskHeroNoArrowPicture.height} priority sizes="100vw" className="h-auto w-full" />
          <AdHeroArrow />
          <p className="bz-script bz-script-biz fade-behind">{L.script.map((s) => <span key={s} className="block">{s}</span>)}</p>
        </div>
        {/* tablets and up: the home page navy bar under the photo (owner, 7 Oct 2026) */}
        <AdHeroBar />

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

          <div id={AD_MATCH_BOX_ID} className="bz-card-col scroll-mt-24">
            <BizMatchCard longText className="bz-card-wide" />
            <MatchFitScript />
          </div>

          <div className="bz-more">
            <ol className="bz-steps bz-steps-shade fade-behind">
              {L.steps.map((s, i) => (
                <li key={s}>{i > 0 && <ArrowRight aria-hidden className="bz-step-arrow" strokeWidth={2.4} />}<span>{s}</span></li>
              ))}
            </ol>
            <HomeStepsFit />
          </div>
        </div>
        </div>
        <AdHomeSections />
      </main>
      <AdFooter />
      <LazyBusinessQuestionnaire />
    </div>
  );
}
