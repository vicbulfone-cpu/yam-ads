import Image from "next/image";
import { HOME_STEPS } from "../sections/HomeMatchIntro";
import PersonalHowStepsAnim from "./PersonalHowStepsAnim";

/**
 * /ad-2 "How it works" steps (owner's "steps/Untitled" picture, 9 Oct 2026): replace the home page's photo steps on the
 * personal tax page only (the heading, intro and navy bar around them are the home page's, unchanged). Each step: a
 * green number disc, the owner's icon ("steps" folder, made by scripts/make-personal-step-icons.mjs), the title and line
 * (same words as the home page).
 * Each icon is drawn from its layers (scripts/make-personal-step-layers.mjs) so its parts can move on their own: the
 * pen writes on the pad, the puzzle pieces join, the hands greet (owner, 9 Oct 2026). They play one after another
 * (PersonalHowStepsAnim.tsx), and again on hover.
 * Styles: ".phs-" in ads.css.
 */

/** each icon's layers, bottom first; every layer is the whole icon's canvas, so they stack exactly */
const ICONS = [
  { w: 440, h: 404, layers: ["questionnaire-pad", "questionnaire-pen"] },
  { w: 440, h: 356, layers: ["accountant-match-blue", "accountant-match-green", "accountant-match-pin"] },
  { w: 440, h: 336, layers: ["connect-handshake-hands", "connect-handshake-tick"] },
];

export default function PersonalHowSteps() {
  return (
    <>
      {/* (the curved green arrows between the icons were removed, owner 9 Oct 2026; the steps then 6mm, 5mm and 1cm lower, the words above them unmoved) */}
      <ol className="phs mt-[calc(2rem+5mm+6mm+5mm+1cm)] grid gap-10 sm:grid-cols-3 sm:gap-6 lg:mt-[calc(1.4vw+5mm+6mm+5mm+1cm)] lg:gap-[3vw]">
        {HOME_STEPS.map((s, i) => (
          <li key={s.title} className="phs-step">
            {/* "Step" beside the number disc, styled as the section's "How it works" label (owner, 9 Oct 2026) */}
            <div aria-hidden className="phs-head">
              <span className="phs-num">{i + 1}</span>
              <span className="phs-label">Step</span>
            </div>
            <div className="phs-icon-box">
              <div className={`phs-icon phs-icon-${i + 1}`} style={{ aspectRatio: `${ICONS[i].w} / ${ICONS[i].h}` }}>
                {ICONS[i].layers.map((l) => (
                  <Image key={l} src={`/images/ad-personal/steps/${l}.webp`} alt="" width={ICONS[i].w} height={ICONS[i].h}
                    sizes="(min-width: 1024px) 16vw, 13rem" className={`phs-layer phs-${l}`} />
                ))}
              </div>
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
