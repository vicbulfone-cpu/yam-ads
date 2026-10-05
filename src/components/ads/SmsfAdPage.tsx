// SMSF & wealth ad landing page (/ad-3), laid out as the owner's "smsf" design picture (hero section/ad landing pages).
// Same structure as the business page (BusinessAdPage.tsx): the desk photograph sits exactly as on the home page (its top
// just under the header), headline, steps (with icons, as the design) and benefits on the left, the SMSF match box on the
// right (home page box style). Phones: headline, match box, then the steps, benefits, small print and picture.
// Styles: ".sz-" (on top of ".bz-") in ads.css.
import Image from "next/image";
import { homeDeskHeroPicture } from "@/config/site.config";
import { SMSF_LANDING as L } from "@/content/smsf-questionnaire";
import { ArrowRight } from "../ui/Icons";
import { AdFooter, AdHeader } from "./AdChrome";
import MatchFitScript from "../sections/MatchFitScript";
import SmsfMatchCard from "./SmsfMatchCard";
import { LazySmsfQuestionnaire } from "./LazyQuestionnaires";
import { PeopleSolid, PinSolid, ShieldCheck } from "./BizIcons";

const BENEFIT_ICONS = { pin: PinSolid, people: PeopleSolid, shield: ShieldCheck };

export default function SmsfAdPage() {
  return (
    <div className="bz-page sz-page">
      <AdHeader />
      <main className="bz-hero">
        {/* the desk photograph at the home page's height and shape, so the handwriting lines up with its arrow */}
        <div aria-hidden className="bz-photo">
          <Image src={homeDeskHeroPicture.src} alt="" width={homeDeskHeroPicture.width} height={homeDeskHeroPicture.height} priority sizes="100vw" className="h-auto w-full" />
          <p className="bz-script bz-script-biz fade-behind">{L.script.map((s) => <span key={s} className="block">{s}</span>)}</p>
        </div>

        {/* hero laid out exactly as Ad 1 (owner, 6 Oct 2026): three-line headline, faded line and steps (plain, with
            arrows), solid benefit circles, the wider match box; wording unchanged */}
        <div className="bz-wrap bz-grid bz-grid-wide sz-grid">
          <div className="bz-text">
            <h1 className="bz-h1">
              <span className="block">{L.h1[0]}</span>{" "}
              <span className="block text-[#0e7a32]">{L.h1[1]}</span>{" "}
              <span className="block">{L.h1[2]}</span>
            </h1>
            <p className="bz-sub bz-sub-fade fade-behind">{L.sub}</p>
          </div>

          <div className="bz-card-col">
            <SmsfMatchCard />
            <MatchFitScript />
          </div>

          <div className="bz-more">
            <ol className="bz-steps bz-steps-shade fade-behind">
              {L.steps.map((s, i) => (
                <li key={s.icon}>{i > 0 && <ArrowRight aria-hidden className="bz-step-arrow" strokeWidth={2.4} />}<span>{s.text.join(" ")}</span></li>
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

          <p className="bz-disclaimer sz-disclaimer">{L.disclaimer.join(" ")}</p>
        </div>
      </main>
      <AdFooter variant="smsf" />
      <LazySmsfQuestionnaire />
    </div>
  );
}
