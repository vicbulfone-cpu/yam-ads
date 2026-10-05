// Home page hero. City pages reuse it (their own hero picture, a faded skyline behind, and breadcrumbs).
//   Phones : headline (compact) → hero picture → match card → intro and trust points → remaining paragraphs
//   Desktop: left = hero picture, then headline, intro, trust points (home page: headline first, then the picture); right = match card (stays in view while you read)
// The page CODE always starts with the headline and intro (best for search engines); only the on-screen order
// changes, using CSS. All words come from the old home page; nothing here is hand-typed copy.
import Image from "next/image";
import Link from "next/link";
import { heroPicture, homeHeroPictures } from "@/config/site.config";
import { Html } from "./Blocks";
import MatchCard, { type MatchCardData } from "./MatchCard";
import { HeroPeople } from "./HomeDecor";
import { TwoToneH1, chipIcon, type HeroParts } from "./PageHero";

type Picture = { src: string; srcSmall?: string; width: number; height: number; alt: string };

export default function HomeHero({
  parts, card, cardTitleTag = "h2", picture = heroPicture, backdrop, headlineFirst = false, homeStyle = headlineFirst, homePage = false,
}: { parts: HeroParts; card: MatchCardData | null; cardTitleTag?: "h2" | "p"; picture?: Picture; backdrop?: { src: string }; headlineFirst?: boolean; homeStyle?: boolean; homePage?: boolean }) {
  return (
    <section className={`relative isolate overflow-x-clip ${homePage ? "home-hero-surface" : "bg-gradient-to-b from-navy-50 via-white to-white"}`}>
      {backdrop && (
        <div aria-hidden className="city-wash pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]">
          <Image src={backdrop.src} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-[0.30]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/60 to-white" />
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[32rem] w-[32rem] rounded-full bg-green-500/[0.04] blur-3xl" />
      <div aria-hidden className="dots pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />

      {/* city pages: breadcrumbs sit 1cm closer to the header than the default spacing (H1, picture and card follow) */}
      <div className={`container-page pb-12 md:pb-20 ${homePage ? "pt-0 md:pt-0" : "pt-1 md:pt-[calc(2.5rem-1cm)]"}`}>
        {parts.crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 flex translate-y-[3mm] flex-wrap items-center gap-x-2 text-sm font-medium text-muted md:mb-6">
            {parts.crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-line">/</span>}
                {c.href && i < parts.crumbs.length - 1 ? <Link href={c.href} className="transition hover:text-green-700">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className={`grid items-start gap-x-10 ${homePage ? "gap-y-0" : "gap-y-6"} lg:grid-cols-[1.05fr_1fr] lg:gap-x-14 lg:gap-y-0`}>
          {/* 1 — headline (first in the page code; first on phones) */}
          <div className={`order-1 max-w-3xl ${homePage ? "-translate-y-[0.5cm]" : ""} lg:order-none lg:col-start-1 ${headlineFirst ? "lg:row-start-1 lg:-mr-[calc(3.5rem+1cm)]" : homeStyle ? "lg:row-start-2 lg:-mr-[calc(3.5rem+1cm)] lg:pt-8" : "lg:row-start-2 lg:pt-8"}`}>
            {parts.h1 && <TwoToneH1 html={parts.h1.html} text={parts.h1.text} sizeClass={homeStyle ? "h-display-mock" : "h-display-home"} override={parts.h1.override} variant={homeStyle ? "mock" : undefined} />}
          </div>

          {/* 2 — intro and trust points (phones: after the card) */}
          <div className="order-4 max-w-3xl lg:order-none lg:col-start-1 lg:row-start-3">
            {parts.lead[0] && <Html html={parts.lead[0]} className={`prose-yam lead lg:mt-5${homePage ? " home-lead-intro" : ""}`} />}
            {parts.chips.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1">
                {parts.chips.map((t) => (
                  <li key={t}>
                    {/vetted/i.test(t) ? (
                      <Link href="/how-we-select-accountants" className="group flex min-h-11 items-center gap-2 text-[0.95rem] font-semibold text-ink">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-green-50 text-green-700 ring-1 ring-green-100 transition group-hover:bg-green-600 group-hover:text-white">{chipIcon(t)}</span>
                        <span className="underline decoration-green-200 decoration-2 underline-offset-4 group-hover:decoration-green-600">{t}</span>
                      </Link>
                    ) : (
                      <span className="flex min-h-11 items-center gap-2 text-[0.95rem] font-semibold text-ink">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-green-50 text-green-700 ring-1 ring-green-100">{chipIcon(t)}</span>
                        {t}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 3 — the hero picture (phones: right under the headline) */}
          <figure className={`relative order-2 lg:order-none lg:col-start-1 ${homePage ? "lg:mr-0 xl:-mr-[calc(3.5rem+1cm)]" : "lg:-mr-[calc(3.5rem+1cm)]"} ${headlineFirst ? "lg:row-start-2 lg:mt-3" : homeStyle ? "lg:row-start-1 lg:mt-[0.5cm]" : "lg:row-start-1"}`}>
            {homePage && <div className="hero-tagline-overlay">a smarter way to find an accountant</div>}
            <div className="home-hero-frame">
              {homePage ? (
                <div className="home-hero-carousel" role="region" aria-label="Homepage hero images. Focus or hover to pause." tabIndex={0}>
                  {homeHeroPictures.map((heroImage, index) => (
                    <Image
                      key={heroImage.src}
                      src={heroImage.src}
                      alt={index === 0 ? heroImage.alt : ""}
                      fill
                      fetchPriority={index === 0 ? "high" : "low"}
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(min-width:1280px) 760px, (min-width:1024px) 60vw, 96vw"
                      className="home-hero-carousel-image object-cover"
                      style={{ "--hero-slide-index": index } as React.CSSProperties}
                    />
                  ))}
                </div>
              ) : (
                <Image
                  src={picture.src}
                  alt={picture.alt}
                  width={picture.width}
                  height={picture.height}
                  priority
                  sizes="(min-width:1280px) 760px, (min-width:1024px) 60vw, 96vw"
                  className="h-auto w-full"
                />
              )}
            </div>
          </figure>

          {/* 4 — the match card with a soft glow behind it */}
          {card && (
            <div className="relative order-3 lg:order-none lg:mt-[3mm] lg:translate-x-[min(2cm,max(0px,calc((100vw-1240px)/2+8px)))] lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:self-start">
              <div aria-hidden className="hero-glow pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_70%_20%,rgba(0,174,65,.09),transparent_70%),radial-gradient(50%_50%_at_20%_90%,rgba(26,90,166,.16),transparent_70%)] blur-xl" />
              <div className="hero-card-in">
                <MatchCard data={card} titleTag={cardTitleTag} />
              </div>
              {/* home page, desktop: photos fill the space under the match box (decorative) */}
              {homePage && <HeroPeople />}
            </div>
          )}

          {/* 5 — remaining intro paragraphs */}
          {parts.lead.length > 1 && (
            <div className="order-5 max-w-3xl space-y-5 lg:order-none lg:col-start-1 lg:row-start-4 lg:mt-6">
              {parts.lead.slice(1).map((l, i) => (
                <Html key={i} html={l} className={`prose-yam text-[1.02rem] leading-relaxed text-body${homePage ? (i === 0 ? " home-lead-quote" : " home-lead-body") : ""}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
