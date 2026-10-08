// The personal tax ad page's hero (/ad-2), from the owner's "personal example" picture (9 Oct 2026). It replaced the old
// Ad 1-style hero (desk photo, three-line headline, steps and match box). The words sit on the photo's sky, never on the person:
// desktops (1200px+) = the owner's desktop photo with the words on the left; phones and tablets = the mobile photo
// (sky over the skyline) with the words at the top, the skyline and trees showing under them, then the three trust points.
// The button is a #match-box link: AdBoxPopup opens the personal match box in its popup on every screen size.
// Styles: ".pth-" in ads.css.
import Image, { getImageProps } from "next/image";
import { personalHeroPictures as P } from "@/config/site.config";
import { PERSONAL_HERO as H } from "@/content/personal-questionnaire";
import { HERO_COPY } from "@/content/hero-copy";
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import { ArrowRight } from "../ui/Icons";

export default function PersonalHero() {
  const common = { alt: "", sizes: "100vw" };
  const { props: { srcSet: desktop } } = getImageProps({ ...common, ...P.desktop, quality: 80 });
  const { props: { srcSet: mobile, ...img } } = getImageProps({ ...common, ...P.mobile, quality: 75 });

  return (
    <section className="pth" aria-labelledby="pth-title">
      <picture className="pth-pic">
        <source media="(min-width: 1200px)" srcSet={desktop} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- decorative: alt="" comes from getImageProps */}
        <img {...img} srcSet={mobile} loading="eager" fetchPriority="high" />
      </picture>

      <div className="pth-inner">
        <div className="pth-text">
          <p className="pth-eyebrow">{H.eyebrow}</p>
          <h1 id="pth-title" className="pth-h1">
            <span>{H.h1[0]}</span>{" "}
            <span className="pth-green">{H.h1[1]}</span>
          </h1>
          <p className="pth-sub">{H.sub}</p>
          <a href={`#${AD_MATCH_BOX_ID}`} className="pth-cta">
            <span>{H.cta}</span>
            <ArrowRight aria-hidden className="pth-cta-arrow" strokeWidth={2.6} />
          </a>
          <p className="pth-note">{H.note.join(" • ")}</p>
        </div>

        {/* phones and tablets: the space where the skyline and trees show under the words */}
        <div aria-hidden className="pth-visual" />

        <ul className="pth-points">
          {HERO_COPY.points.map((p) => (
            <li key={p.strong}>
              <Image src={p.icon} alt="" width={160} height={160} className="pth-point-icon" />
              <span><strong>{p.strong}</strong> {p.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
