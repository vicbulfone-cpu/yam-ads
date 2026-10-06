// Hero for the home page and the 13 city pages (owner's design "how it should look", 4 Oct 2026).
//   Desktop: a full-width desk photograph; headline, supporting line and three points on the left; the match box on the
//            right, overlapping the white reassurance strip under the picture.
//   Phones : headline, supporting line and points over the top of the picture, the mug and laptop showing below them,
//            then the match box, then the three reassurance lines.
// The page CODE starts with the headline (best for search engines). Wording: src/content/hero-copy.ts and, for the city
// headlines, src/content/seo-copy.json.
import type { ReactNode } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { deskHeroPicture } from "@/config/site.config";
import { HERO_COPY } from "@/content/hero-copy";
import MatchCard, { type MatchCardData } from "./MatchCard";
import MatchFitScript from "./MatchFitScript";

export type DeskHeroHeadline = { before: string; green: string; after?: string; sub?: string; greenOnOwnLine?: boolean };

type Pic = { src: string; width: number; height: number };

export default function DeskHero({
  headline, crumbs = [], card, cardTitleTag = "h2", mobilePicture: mobilePictureProp, desktopPicture, showTrust = true, phoneStack = false, bar,
}: { headline: DeskHeroHeadline; crumbs?: { label: string; href?: string }[]; card: MatchCardData | null; cardTitleTag?: "h2" | "p"; mobilePicture?: Pic; desktopPicture?: Pic; showTrust?: boolean;
  /** Home page on phones (owner's "zz" design, 6 Oct 2026): logo, then the desk picture with the headline over its top,
      then the match box straight underneath. Phones use the same desk picture as desktop. */
  phoneStack?: boolean;
  /** Home page (owner, 6 Oct 2026): a bar that sits right against the bottom of the photo on laptops/desktops (the match
      box overlaps it), and straight after the hero on phones and tablets. */
  bar?: ReactNode }) {
  const mobilePicture = phoneStack ? undefined : mobilePictureProp;
  const desk = desktopPicture ?? deskHeroPicture;
  const desktopSrcSet = mobilePicture
    ? getImageProps({ src: desk.src, alt: "", width: desk.width, height: desk.height, quality: 92, sizes: "100vw" }).props.srcSet
    : undefined;
  const mobileImg = mobilePicture
    ? (({ srcSet, src, width, height, sizes, decoding, style }) => ({ srcSet, src, width, height, sizes, decoding, style }))(
        getImageProps({ src: mobilePicture.src, alt: "", width: mobilePicture.width, height: mobilePicture.height, quality: 85, sizes: "100vw" }).props,
      )
    : undefined;
  return (
    <section className={`desk-hero relative isolate -mt-[4cm]${mobilePicture ? " has-mobile-pic" : ""}${phoneStack ? " zz-phone" : ""}`}>
      <div className="desk-hero-grid">
        {/* the photograph: shares the first row with the words and stretches to the full width of the screen */}
        <div className="desk-hero-picture relative">
          {/* overlay text for home page: "The smarter way to find an accountant." above the arrow */}
          <div aria-hidden className="hero-tagline-overlay">The smarter way to<br/>find an accountant.</div>
          {/* the photo keeps its own proportions (laptop and desktop: full width, sitting on the bottom of the hero,
              never zoomed or stretched); the handwritten words are part of the picture */}
          <div className="desk-hero-photo">
            {mobilePicture ? (
              // home page: its own picture on phones (below 768px); the browser loads only the one it shows
              <picture>
                <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
                <img {...mobileImg} alt={HERO_COPY.pictureAlt} loading="eager" fetchPriority="high" className="desk-hero-img" />
              </picture>
            ) : (
              <Image
                src={desk.src}
                alt={HERO_COPY.pictureAlt}
                width={desk.width}
                height={desk.height}
                priority
                fetchPriority="high"
                quality={92}
                sizes={phoneStack ? "(min-width:768px) 100vw, 200vw" : "(min-width:1024px) 100vw, 250vh"}
                className="desk-hero-img"
              />
            )}
          </div>
          {/* soft light behind the words so they stay easy to read */}
          <div aria-hidden className="desk-hero-wash absolute inset-0" />
        </div>

        {/* 1 — headline, supporting line and the three points */}
        <div className="desk-hero-text">
          {/* breadcrumbs sit above the headline without pushing it down, so the headline lines up with the home page's */}
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="desk-hero-crumbs flex flex-wrap items-center gap-x-2 text-[0.82rem] font-semibold text-navy-900/75">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-navy-900/40">/</span>}
                  {c.href && i < crumbs.length - 1 ? <Link href={c.href} className="transition hover:text-green-700">{c.label}</Link> : <span className="text-navy-900">{c.label}</span>}
                </span>
              ))}
            </nav>
          )}
          <h1 className={`desk-hero-h1${headline.greenOnOwnLine ? " is-city" : ""}`}>
            {headline.greenOnOwnLine ? (
              <>
                <span className="block whitespace-nowrap">{headline.before}</span>{" "}
                <span className="block whitespace-nowrap text-green-700">{headline.green}</span>
              </>
            ) : (
              <>
                <span className="block">{headline.before}</span>{" "}
                <span className="block"><span className="text-green-700">{headline.green}</span>{headline.after ? ` ${headline.after}` : ""}</span>
              </>
            )}
          </h1>
          {headline.sub && <p className="desk-hero-sub">{headline.sub}</p>}
          <ul className="desk-hero-points">
            {HERO_COPY.points.map((p) => (
              <li key={p.strong} className="flex items-center gap-3">
                <Image src={p.icon} alt="" width={160} height={160} className="h-11 w-11 shrink-0 2xl:h-[3.75rem] 2xl:w-[3.75rem]" />
                <span className="text-[0.95rem] leading-tight text-navy-900 2xl:text-[1.15rem]">
                  <strong className="block font-extrabold">{p.strong}</strong> {p.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2 — the match box (desktop: right column, running over the white strip) */}
        {card && (
          <div className="desk-hero-card">
            <MatchCard data={card} titleTag={cardTitleTag} />
            <MatchFitScript />
          </div>
        )}

        {/* 3 — three reassurance lines on the white strip under the picture (home page shows them further down instead) */}
        {showTrust && (
          <ul className="desk-hero-trust">
            {HERO_COPY.trust.map((t) => (
              <li key={t.lines[0]} className="flex items-center gap-3.5">
                <Image src={t.icon} alt="" width={160} height={160} className="h-9 w-9 shrink-0 object-contain 2xl:h-11 2xl:w-11" />
                <span className="text-[0.95rem] leading-snug text-navy-900 2xl:text-[1.15rem]">
                  <span className="xl:block xl:whitespace-nowrap">{t.lines[0]}</span> <span className="xl:block xl:whitespace-nowrap">{t.lines[1]}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {bar && <div className="hero-bar">{bar}</div>}
    </section>
  );
}

/** Home page: band under the "Ready to meet your accountant?" bar, repeating the hero's three points and icons (owner, 5 Oct 2026). */
export function HeroTrustStrip() {
  return (
    <section className="home-trust">
      <ul className="home-trust-list">
        {HERO_COPY.points.map((p) => (
          <li key={p.strong}>
            <Image src={p.icon} alt="" width={160} height={160} className="h-11 w-11 shrink-0 2xl:h-[3.75rem] 2xl:w-[3.75rem]" />
            <span className="text-[0.95rem] leading-tight text-navy-900 2xl:text-[1.15rem]">
              <strong className="block font-extrabold">{p.strong}</strong> {p.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
