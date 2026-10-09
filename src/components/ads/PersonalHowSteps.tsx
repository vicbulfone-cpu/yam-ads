import Image from "next/image";
import { HOME_STEPS } from "../sections/HomeMatchIntro";
import PersonalHowStepsAnim from "./PersonalHowStepsAnim";

/**
 * /ad-2 "How it works" steps (owner's "steps/Untitled" picture, 9 Oct 2026): replace the home page's photo steps on the
 * personal tax page only (the heading, intro and navy bar around them are the home page's, unchanged). Each step: a
 * green number disc, the owner's icon ("steps" folder, made by scripts/make-personal-step-icons.mjs), the title and line
 * (same words as the home page).
 * The icons move one after another when the steps come into view, and on hover (PersonalHowStepsAnim.tsx).
 * Styles: ".phs-" in ads.css.
 */

const ICONS = [
  { src: "/images/ad-personal/steps/questionnaire.webp", w: 440, h: 404 },
  { src: "/images/ad-personal/steps/accountant-match.webp", w: 440, h: 356 },
  { src: "/images/ad-personal/steps/connect-handshake.webp", w: 440, h: 336 },
];

export default function PersonalHowSteps() {
  return (
    <>
      {/* (the curved green arrows between the icons were removed, owner 9 Oct 2026) */}
      <ol className="phs mt-[calc(2rem+5mm)] grid gap-10 sm:grid-cols-3 sm:gap-6 lg:mt-[calc(1.4vw+5mm)] lg:gap-[3vw]">
        {HOME_STEPS.map((s, i) => (
          <li key={s.title} className="phs-step">
            <span aria-hidden className="phs-num">{i + 1}</span>
            <div className="phs-icon-box">
              <Image src={ICONS[i].src} alt="" width={ICONS[i].w} height={ICONS[i].h} sizes="(min-width: 1024px) 16vw, 13rem" className={`phs-icon phs-icon-${i + 1}`} />
            </div>
            <h3 className="mt-3 font-sans text-[1.3rem] font-extrabold tracking-[-0.02em] text-navy-900 lg:mt-[0.9vw] lg:text-[clamp(1.3rem,1.75vw,2.6rem)]">{s.title}</h3>
            <p className="mt-1 text-[1rem] leading-snug text-navy-900/80 lg:text-[clamp(1rem,1.15vw,1.7rem)]">{s.text}</p>
          </li>
        ))}
      </ol>
      <PersonalHowStepsAnim />
    </>
  );
}
