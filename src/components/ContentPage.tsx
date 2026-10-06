// Builds a whole page from the old site's extracted content: hero, body sections, call-to-action band, footer.
import type { ReactNode } from "react";
import { cityPicture, homeDeskHeroPicture, homeMobileHeroPicture } from "@/config/site.config";
import { explodeLinkGroups, loadContent, mergeViews, splitOnHeadings, toSections, type Node, type Section } from "@/lib/content";
import { cityOf, isLivePage, typeOf } from "@/lib/pages";
import { copyFor } from "@/lib/seo";
import { getCtaBandWords } from "@/lib/site-data";
import CityShowcase from "./sections/CityShowcase";
import CtaBand from "./sections/CtaBand";
import { extractMatchCard, getHomeMatchCard } from "./sections/MatchCard";
import DeskHero, { HeroTrustStrip } from "./sections/DeskHero";
import PageHero, { chipIcon, heroParts } from "./sections/PageHero";
import { Html } from "./sections/Blocks";
import Link from "next/link";
import { HERO_COPY } from "@/content/hero-copy";
import QuickAnswer from "./sections/QuickAnswer";
import SectionView, { toBlocks } from "./sections/SectionRenderer";
import SiteFooter from "./layout/SiteFooter";
import { auFind } from "./sections/au-media";
import Tagline from "./sections/Tagline";
import { HOME_HERO_TAGLINE, TAGLINES, taglineFor } from "@/content/taglines";
import HomeMatchIntro from "./sections/HomeMatchIntro";
import WhyItMatters from "./sections/WhyItMatters";
import HomeSelection from "./sections/HomeSelection";
import FAQSection from "./sections/FAQSection";
import StartBar from "./sections/StartBar";
import CoverageSection from "./sections/CoverageSection";
import HomeTagline from "./sections/HomeTagline";
import HomeClosingCta from "./sections/HomeClosingCta";

type N = Exclude<Node, { t: "sec" }>;
const SHARED_MATCH_CARD = getHomeMatchCard();

/** The three STEP cards sit under the previous heading on phones; move them under "How does it work" where they belong. */
function reflowSteps(sections: Section[]): Section[] {
  const isStep = (n: N) => n.t === "text" && /^step\s*\d/i.test(n.text);
  const from = sections.findIndex((s) => s.nodes.some(isStep));
  if (from === -1) return sections;
  const src = sections[from];
  const first = src.nodes.findIndex(isStep);
  // the step group = nodes from the first "STEP n" label to the last node sharing the same grid id
  const grid = src.nodes[first].g;
  let last = first;
  src.nodes.forEach((n, i) => { if (i >= first && n.g === grid) last = i; });
  const moved = src.nodes.slice(first, last + 1);
  const target = sections.findIndex((s, i) => i !== from && s.nodes.some((n) => n.t === "text" && /^how does it work/i.test(n.text)));
  if (target === -1) return sections;
  const out = sections.map((s) => ({ ...s, nodes: [...s.nodes] }));
  out[from].nodes.splice(first, last - first + 1);
  out[target].nodes.push(...moved);
  return out;
}

export default function ContentPage({ path, afterBody }: { path: string; afterBody?: ReactNode }) {
  const content = loadContent(path);
  const type = typeOf(path);
  const isHome = type === "homepage";
  const nodes = mergeViews(content);

  // 1. Pull the old category "match card" out of the page (it becomes the hero card)
  const { card: pageCard, rest } = extractMatchCard(nodes);
  const card = SHARED_MATCH_CARD;
  // This site has only a few pages: a section made only of links to other pages (e.g. industry cards, other cities)
  // is left out, and breadcrumb links to missing pages are dropped. Footers do their own filtering.
  const isDead = (n: Node) => (n.t === "link" || n.t === "cardlink") && n.href.startsWith("/") && !isLivePage(n.href);
  const isLive = (n: Node) => (n.t === "link" || n.t === "cardlink") && (!n.href.startsWith("/") || isLivePage(n.href));
  const sections = reflowSteps(splitOnHeadings(explodeLinkGroups(toSections(rest))))
    .filter((s) => s.tag === "footer" || !(s.nodes.some(isDead) && !s.nodes.some(isLive)))
    .map((s) => (s.tag === "footer" ? s : { ...s, nodes: s.nodes.filter((n) => !isDead(n)) }));

  // 2. Split chrome (header/footer) from content
  const body = sections.filter((s) => s.tag !== "header" && s.tag !== "footer");
  const h1Index = body.findIndex((s) => s.nodes.some((n) => n.t === "h" && n.l === 1));
  const pre: N[] = [];
  body.slice(0, Math.max(h1Index, 0)).forEach((s) => pre.push(...s.nodes));
  const headerCrumbs = sections.filter((s) => s.tag === "header").flatMap((s) => s.nodes);
  const heroSec: Section | undefined = h1Index >= 0 ? body[h1Index] : undefined;
  
  // Anything in the headline section after the intro (from the first sub-heading on) is body content.
  let rest2 = h1Index >= 0 ? body.slice(h1Index + 1) : body;
  let heroNodes: N[] = heroSec ? heroSec.nodes : [];
  if (heroSec) {
    const cut = heroSec.nodes.findIndex((n, i) => i > 0 && (n.t === "h" && n.l >= 2 && n.c == null));
    if (cut > 0) {
      heroNodes = heroSec.nodes.slice(0, cut);
      rest2 = [{ ...heroSec, nodes: heroSec.nodes.slice(cut) }, ...rest2];
    }
  }

  const parts = heroParts([...headerCrumbs.filter((n) => n.t === "link" || n.t === "text"), ...pre], heroNodes);
  // rewritten H1 (city and industry pages): "<first line><br><second line>", the second line is set in green
  const rewritten = copyFor(path)?.h1;
  if (rewritten) {
    const all = [rewritten.first, rewritten.highlight, rewritten.second].filter(Boolean).join(" ");
    parts.h1 = { html: all, text: all, override: rewritten };
  }
  const city = cityOf(path);
  const image = city ? cityPicture(city) : null;
  const isCity = type === "city" && Boolean(city);

  // 3. A built-in "Ready to find your accountant?" section becomes the CTA band
  const ctaIdx = rest2.findIndex((s) => toBlocks(s.nodes).some((b) => b.k === "heading" && /^ready to find/i.test(b.text)));
  const ownCta = ctaIdx >= 0 ? toBlocks(rest2[ctaIdx].nodes) : null;
  const ctaWords = getCtaBandWords();
  const homeBackdropFile = isHome ? auFind(/landscape/)?.file : undefined;
  const homeBackdrop = homeBackdropFile ? { src: homeBackdropFile } : undefined;

  let shown = 0;
  const rendered: ReactNode[] = [];
  rest2.forEach((s, i) => {
    if (i === ctaIdx) return;
    const blocks = toBlocks(s.nodes);
    if (blocks.length === 0) return;
    rendered.push(<SectionView key={`${s.id}-${i}`} section={s} index={shown} seed={i * 3} home={isHome} />);
    shown++;
    if (isCity && image && shown === 1) rendered.push(<CityShowcase key="skyline" city={parts.crumbs[parts.crumbs.length - 1]?.label ?? ""} image={image} />);
  });

  const proseOf = (k: number) => (ownCta?.filter((b) => b.k === "prose")[k] as { items: { text: string }[] } | undefined)?.items[0]?.text;

  // Home page follows the owner's "home page 1" and "home page 2" pictures section by section (hero unchanged).
  if (isHome) {
    return (
      <>
        <main className="home-v2">
          <DeskHero headline={{ ...HERO_COPY.home.h1, sub: HERO_COPY.home.sub }} card={card} cardTitleTag={pageCard ? "h2" : "p"} desktopPicture={homeDeskHeroPicture} showTrust={false} phoneStack bar={
            <StartBar
              button={false}
              hero
              words={
                <>
                  <p className="hb-title">More than a directory. A match for your needs.</p>
                  <span aria-hidden className="hb-div" />
                  <p className="hb-sub"><span>We don’t just list accountants,</span> <span>we match you.</span></p>
                </>
              }
            />
          } />
          <HomeMatchIntro />
          <HeroTrustStrip />
          <WhyItMatters />
          <HomeSelection /> {/* trust: how we select accountants (owner, 6 Oct 2026) */}
          <FAQSection />
          {/* (mid-page "Ready to find your accountant?" banner removed, owner 6 Oct 2026) */}
          <CoverageSection />
          <HomeTagline text={TAGLINES[8]} />
          <HomeClosingCta />
        </main>
        <SiteFooter nodes={nodes} variant="home" showAds />
      </>
    );
  }

  return (
    <>
      <main>
        {isHome ? (
          <DeskHero headline={{ ...HERO_COPY.home.h1, sub: HERO_COPY.home.sub }} card={card} cardTitleTag={pageCard ? "h2" : "p"} mobilePicture={homeMobileHeroPicture} desktopPicture={homeDeskHeroPicture} showTrust={false} />
        ) : isCity && image && rewritten ? (
          // city pages: identical hero to home page (same pictures, trust items, size, position), but with city's own H1 text
          <DeskHero
            headline={{ before: rewritten.first, green: rewritten.highlight ?? "", sub: rewritten.second, greenOnOwnLine: true }}
            crumbs={parts.crumbs}
            card={card}
            cardTitleTag={pageCard ? "h2" : "p"}
            mobilePicture={homeMobileHeroPicture}
            desktopPicture={homeDeskHeroPicture}
            showTrust={false}
          />
        ) : (
          <PageHero parts={parts} card={card} cardTitleTag={pageCard ? "h2" : "p"} image={image} showCta={Boolean(parts.cta) || type !== "other"} />
        )}
        {/* home and city pages: the page's own introduction and trust points sit straight under the hero */}
        {(isHome || (isCity && image && rewritten)) && (parts.lead.length > 0 || parts.chips.length > 0) && (
          <section className="container-page pb-4 pt-10 md:pt-14">
            <div className="max-w-3xl space-y-5">
              {parts.lead.map((l, i) => (
                <Html key={i} html={l} className={`prose-yam ${i === 0 ? "lead" : "text-[1.02rem] leading-relaxed text-body"}${isHome ? (i === 0 ? " home-lead-intro" : i === 1 ? " home-lead-quote" : " home-lead-body") : ""}`} />
              ))}
              {parts.chips.length > 0 && (
                <ul className="flex flex-wrap gap-x-5 gap-y-1">
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
          </section>
        )}
        <QuickAnswer path={path} />
        {isHome && <Tagline text={HOME_HERO_TAGLINE} />}
        {isHome ? <div className="home-warm">{rendered}</div> : rendered}
        {afterBody}
        <Tagline text={taglineFor(path)} />
        {/* a closing band with borrowed wording uses styled text, not a heading, so the page keeps its old heading outline */}
        {ownCta ? (
          <CtaBand
            title={(ownCta.find((b) => b.k === "heading") as { text: string }).text}
            text={proseOf(0)}
            label={(ownCta.find((b) => b.k === "cta") as { labels: string[] } | undefined)?.labels[0]}
            note={proseOf(1)}
            backdrop={isHome ? homeBackdrop : undefined}
            />
        ) : (
          <CtaBand {...(ctaWords ?? {})} asHeading={false} backdrop={isHome ? homeBackdrop : undefined} />
        )}
      </main>
      <SiteFooter nodes={nodes} />
    </>
  );
}
