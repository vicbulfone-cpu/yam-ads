// The personal tax ad page's hero (/ad-2), from the owner's "personal example" picture (9 Oct 2026). It replaced the old
// Ad 1-style hero (desk photo, three-line headline, steps and match box). The words sit on the photo's sky, never on the person:
// desktops (1200px+) = the owner's desktop photo with the words on the left; tablets (768-1199px) = the same photo in full
// under the words, its sky fading into the light sky behind them; phones = the mobile photo soft behind the words (owner's
// "mobile look"). Then the three trust points.
// The button is a #match-box link: AdBoxPopup opens the personal match box in its popup on every screen size.
// Styles: ".pth-" in ads.css.
import Image, { getImageProps } from "next/image";
import { personalHeroPictures as P } from "@/config/site.config";
import { PERSONAL_HERO as H } from "@/content/personal-questionnaire";
import { HERO_COPY } from "@/content/hero-copy";
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import { ArrowRight } from "../ui/Icons";

/** the steps line under the three points (owner, 9 Oct 2026: its last step names the partner network; the business and
 *  registration ad pages keep "Get matched with one accountant") */
const STEPS = ["Tell us your needs", "Enter your postcode", "Get matched with one accountant from our partner network"];

export default function PersonalHero() {
  const common = { alt: "", sizes: "100vw" };
  const { props: { srcSet: desktop } } = getImageProps({ ...common, ...P.desktop, quality: 80 });
  const { props: { srcSet: mobile, ...img } } = getImageProps({ ...common, ...P.mobile, quality: 75 });

  return (
    <section className="pth" aria-labelledby="pth-title">
      <picture className="pth-pic">
        <source media="(min-width: 768px)" srcSet={desktop} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- decorative: alt="" comes from getImageProps */}
        <img {...img} srcSet={mobile} loading="eager" fetchPriority="high" />
      </picture>

      <div className="pth-inner">
        <div className="pth-text">
          <h1 id="pth-title" className="pth-h1">
            <span>{H.h1[0]}</span>{" "}
            <span className="pth-green">{H.h1[1]}</span>{" "}
            <span className="pth-green">{H.h1[2]}</span>
          </h1>
          {/* one span per sentence (desktop styles decide whether each is its own line) */}
          <p className="pth-sub">
            {H.sub.split(/(?<=[.?]) (?=[A-Z])/).map((s, i) => (
              <span key={i} className="pth-sub-line">{i > 0 && " "}{s}</span>
            ))}
          </p>
          <a href={`#${AD_MATCH_BOX_ID}`} className="pth-cta">
            {/* phones only (owner's "mobile look"): a magnifier at the start of the button */}
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className="pth-cta-icon">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5 21 21" />
            </svg>
            <span>{H.cta}</span>
            <ArrowRight aria-hidden className="pth-cta-arrow" strokeWidth={2.6} />
          </a>
          <p className="pth-note">{H.note.join(" • ")}</p>
        </div>

        {/* phones and tablets: the space where the skyline and trees show under the words */}
        <div aria-hidden className="pth-visual" />

        {/* desktops: one box round the points and steps so one even fade can sit behind both (owner, 9 Oct 2026); on
            smaller screens it is "display: contents" and changes nothing */}
        <div className="pth-veil">
          <ul className="pth-points">
            {HERO_COPY.points.map((p) => (
              <li key={p.strong}>
                <Image src={p.icon} alt="" width={160} height={160} className="pth-point-icon" />
                <span><strong>{p.strong}</strong> {p.text}</span>
              </li>
            ))}
          </ul>
          {/* desktops: the home page's steps line under the three points (owner, 9 Oct 2026) */}
          <ol className="bz-steps pth-steps">
            {STEPS.map((s, i, all) => (
              <li key={s}>{i > 0 && <ArrowRight aria-hidden className="bz-step-arrow" strokeWidth={2.4} />}
                {/* the last word ("accountant", on the laptop in the photo) in its own span for a small fade (owner, 9 Oct 2026) */}
                {i === all.length - 1
                  ? <span>{s.slice(0, s.lastIndexOf(" ") + 1)}<span className="pth-steps-last">{s.slice(s.lastIndexOf(" ") + 1)}</span></span>
                  : <span>{s}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
