// Registration ad landing page (/ad-4), laid out as the owner's "registration" design picture (hero section/ad landing
// pages), using Ad 1's hero layout (owner, 6 Oct 2026): the desk photograph exactly as on the home page, headline (green
// words as in the design), the faded line under it, the steps, the benefit circles and the handwriting on the left, the
// registration match box (home page box style) on the right. Phones: headline, match box, then the rest.
// Styles: ".rz-" (on top of ".sz-" and ".bz-") in ads.css.
import Image from "next/image";
import { Fragment } from "react";
import { homeDeskHeroPicture } from "@/config/site.config";
import { REG_LANDING as L } from "@/content/registration-questionnaire";
import { ArrowRight } from "../ui/Icons";
import { AdFooter, AdHeader } from "./AdChrome";
import HeroPoints from "../sections/HeroPoints";
import MatchFitScript from "../sections/MatchFitScript";
import RegistrationMatchCard from "./RegistrationMatchCard";
import { LazyRegistrationQuestionnaire } from "./LazyQuestionnaires";
import { PeopleSolid, PersonSolid, ShieldCheck } from "./BizIcons";

const BENEFIT_ICONS = { people: PeopleSolid, person: PersonSolid, shield: ShieldCheck };

/** "Starting a *business* or" -> the words between asterisks in green */
const greenWords = (line: string) =>
  line.split("*").map((part, i) => (i % 2 ? <span key={i} className="text-[#0e7a32]">{part}</span> : <Fragment key={i}>{part}</Fragment>));

export default function RegistrationAdPage() {
  return (
    <div className="bz-page sz-page rz-page">
      <AdHeader />
      <main className="bz-hero">
        {/* the desk photograph at the home page's height and shape, so the handwriting lines up with its arrow */}
        <div aria-hidden className="bz-photo">
          <Image src={homeDeskHeroPicture.src} alt="" width={homeDeskHeroPicture.width} height={homeDeskHeroPicture.height} priority sizes="100vw" className="h-auto w-full" />
          <p className="bz-script bz-script-biz fade-behind">{L.script.map((s) => <span key={s} className="block">{s}</span>)}</p>
        </div>

        <div className="bz-wrap bz-grid bz-grid-wide sz-grid">
          <div className="bz-text">
            <h1 className="bz-h1 rz-h1">
              {L.h1.map((line, i) => <Fragment key={line}>{i > 0 && " "}<span className="block">{greenWords(line)}</span></Fragment>)}
            </h1>
            {/* the home page's three trust points, straight under the headline (owner, 6 Oct 2026) */}
            <HeroPoints className="bz-points" />
            <p className="bz-sub bz-sub-fade fade-behind">{L.sub}</p>
          </div>

          <div className="bz-card-col">
            <RegistrationMatchCard />
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

          <p className="bz-disclaimer sz-disclaimer">{L.disclaimer}</p>
        </div>
      </main>
      <AdFooter variant="registration" />
      <LazyRegistrationQuestionnaire />
    </div>
  );
}
