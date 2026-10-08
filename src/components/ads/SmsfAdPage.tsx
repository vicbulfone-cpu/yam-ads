// SMSF & wealth ad landing page (/ad-3), laid out as the owner's "smsf" design picture (hero section/ad landing pages).
// Same structure as the business page (BusinessAdPage.tsx): the desk photograph sits exactly as on the home page (its top
// just under the header), headline, steps (with icons, as the design) and benefits on the left, the SMSF match box on the
// right (home page box style). Phones: headline, match box, then the steps, benefits, small print and picture.
// Styles: ".sz-" (on top of ".bz-") in ads.css.
import Image from "next/image";
import { homePageHeroPicture } from "@/config/site.config";
import { AdHeroBar } from "./AdHeroParts";
import HomeStepsFit from "../sections/HomeStepsFit";
import { SMSF_LANDING as L } from "@/content/smsf-questionnaire";
import { AdFooter, AdHeader } from "./AdChrome";
import { ArrowRight } from "../ui/Icons";
import HeroPoints from "../sections/HeroPoints";
import MatchFitScript from "../sections/MatchFitScript";
import SmsfMatchCard from "./SmsfMatchCard";
import { LazySmsfQuestionnaire } from "./LazyQuestionnaires";
import AdHomeSections from "./AdHomeSections";
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import { OPEN_SMSF_QUESTIONNAIRE } from "@/lib/questionnaire-events";
import AdBoxPopup from "./AdBoxPopup";

export default function SmsfAdPage() {
  return (
    <div className="bz-page sz-page">
      <AdHeader />
      <main>
        <div className="bz-hero">
        {/* the home page hero photo, placed as on the home page (owner, 8 Oct 2026: no handwriting or arrow) */}
        <div aria-hidden className="bz-photo">
          <Image src={homePageHeroPicture.src} alt="" width={homePageHeroPicture.width} height={homePageHeroPicture.height} priority sizes="100vw" className="h-auto w-full" />
        </div>
        {/* tablets and up: the home page navy bar under the photo (owner, 7 Oct 2026) */}
        <AdHeroBar />

        {/* hero laid out exactly as Ad 1 (owner, 6 Oct 2026): three-line headline, faded line and steps (plain, with
            arrows), solid benefit circles, the wider match box; wording unchanged */}
        <div className="bz-wrap bz-grid bz-grid-wide sz-grid">
          <div className="bz-text">
            <h1 className="bz-h1">
              <span className="block">{L.h1[0]}</span>{" "}
              <span className="block text-[#0e7a32]">{L.h1[1]}</span>{" "}
              <span className="block">{L.h1[2]}</span>
            </h1>
            {/* the home page's three trust points, straight under the headline (owner, 6 Oct 2026) */}
            <HeroPoints className="bz-points" />
            <p className="bz-sub bz-sub-fade fade-behind">{L.sub}</p>
          </div>

          <div id={AD_MATCH_BOX_ID} className="bz-card-col scroll-mt-24">
            <SmsfMatchCard />
            <MatchFitScript />
          </div>

          <div className="bz-more">
            <ol className="bz-steps bz-steps-shade fade-behind">
              {L.steps.map((s, i) => (
                <li key={s.icon}>{i > 0 && <ArrowRight aria-hidden className="bz-step-arrow" strokeWidth={2.4} />}<span>{s.text.join(" ")}</span></li>
              ))}
            </ol>
            <HomeStepsFit />
          </div>
        </div>
        </div>
        <AdHomeSections />
      </main>
      <AdFooter />
      {/* tablets and desktops: the page's CTA buttons open this box in a popup (owner, 7 Oct 2026) */}
      <AdBoxPopup openEvent={OPEN_SMSF_QUESTIONNAIRE}><SmsfMatchCard /></AdBoxPopup>
      <LazySmsfQuestionnaire />
    </div>
  );
}
