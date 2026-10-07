// The layout engine. It looks at the SHAPE of each old-site section (heading, paragraphs, groups of cards,
// lists, FAQs…) and lays the same words out with the new design components. It writes no copy of its own.
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Node, Section } from "@/lib/content";
import { headingWords, plain } from "@/lib/content";
import { QUESTIONNAIRE_URL } from "@/config/site.config";
import { pictureFor } from "./media";
import { auFind, auPictureFor, auRemaining, auRotating } from "./au-media";
/** Photos kept back for the trust cards and article cards that follow the service tiles on the home page. */
const KEEP_BACK = 14;
const TILE_ICONS = [Briefcase, Coins, Calendar, Doc, Users, Shield, Building, Sparkle];
const CROPS = ["object-center", "object-left", "object-right", "object-[50%_25%]", "object-[50%_75%]"];
import { MidCta, PhotoCollage, SideCollage, WarmBlobs } from "./HomeDecor";
import { DIFFERENCE_NOTES } from "@/content/home-copy";
import { ArticleCard, Checklist, Chips, DataTable, Faq, FeatureCard, Html, NoteCard, PillList, SectionHead, StepCard, TextColumn, TrustBadges } from "./Blocks";
import { ArrowRight, Briefcase, Building, Calendar, Check, Coins, Doc, Pin, Shield, Sparkle, Users } from "../ui/Icons";

type N = Exclude<Node, { t: "sec" }>;
type Card = { c: number | null; nodes: N[] };
type Block =
  | { k: "eyebrow"; text: string }
  | { k: "heading"; level: number; html: string; text: string }
  | { k: "prose"; items: { html: string; text: string }[] }
  | { k: "grid"; cards: Card[] }
  | { k: "list"; ordered: boolean; items: { html: string; text: string }[] }
  | { k: "faq"; items: { q: string; a: string }[] }
  | { k: "links"; links: { href: string; text: string; parts?: string[] }[] }
  | { k: "cta"; labels: string[] }
  | { k: "table"; rows: string[][] }
  | { k: "img"; src: string; alt: string }
  | { k: "linkcards"; cards: { href: string; nodes: N[] }[] };

const CTA_RX = /find my accountant|get match|start my match|start matching|meet my match/i;
const isUpper = (s: string) => s.length > 2 && s === s.toUpperCase() && /[A-Z]/.test(s) && s.split(" ").length <= 7;
const onlyAnchors = (html: string) => /^(\s*<a href="[^"]*">[^<]*<\/a>\s*)+$/.test(html);
const anchorsOf = (html: string) => [...html.matchAll(/<a href="([^"]*)">([^<]*)<\/a>/g)].map((m) => ({ href: m[1], text: m[2] }));

/** Turns a section's flat nodes into ordered blocks. */
export function toBlocks(nodes: N[]): Block[] {
  const out: Block[] = [];
  let i = 0;
  const peekHeading = (from: number) => nodes.slice(from + 1, from + 3).some((n) => n.t === "h");
  while (i < nodes.length) {
    const n = nodes[i];
    // ---- groups of cards (shared grid id)
    if (n.t !== "faq" && n.g != null && n.t !== "img") {
      const g = n.g;
      const cards: Card[] = [];
      while (i < nodes.length && nodes[i].g === g && nodes[i].t !== "faq") {
        const m = nodes[i];
        if (m.t !== "img") {
          const last = cards[cards.length - 1];
          if (last && last.c === m.c) last.nodes.push(m);
          else cards.push({ c: m.c, nodes: [m] });
        }
        i++;
      }
      // A "grid" of one card that holds a section heading is just the section itself: unwrap it.
      if (cards.length === 1 && cards[0].nodes.some((x) => x.t === "h" && x.l <= 2)) {
        out.push(...toBlocks(cards[0].nodes.map((x) => ({ ...x, c: null, g: null }) as N)));
        continue;
      }
      out.push({ k: "grid", cards });
      continue;
    }
    if (n.t === "faq") {
      const items: { q: string; a: string }[] = [];
      while (i < nodes.length && nodes[i].t === "faq") { const f = nodes[i] as Extract<N, { t: "faq" }>; items.push({ q: f.q, a: f.a }); i++; }
      out.push({ k: "faq", items });
      continue;
    }
    if (n.t === "cardlink") {
      const cards: { href: string; nodes: N[] }[] = [];
      while (i < nodes.length && nodes[i].t === "cardlink") {
        const href = (nodes[i] as Extract<N, { t: "cardlink" }>).href;
        i++;
        const body: N[] = [];
        while (i < nodes.length && ["text", "h", "p"].includes(nodes[i].t)) {
          body.push(nodes[i]); i++;
          // a card made only of a label ends after that label
          if (body.length === 1 && body[0].t === "text" && nodes[i]?.t !== "h" && nodes[i]?.t !== "text") break;
          if (body.length === 1 && body[0].t === "text" && nodes[i]?.t === "text" && nodes[i + 1]?.t !== "h") break;
          if (body.some((b) => b.t === "p")) {
            // an optional short note under the card text (e.g. "5 min read")
            if (nodes[i]?.t === "text" && /read|min/i.test((nodes[i] as { text: string }).text)) { body.push(nodes[i]); i++; }
            break;
          }
          if (body.some((b) => b.t === "h") && nodes[i]?.t !== "p") break;
        }
        cards.push({ href, nodes: body });
      }
      out.push({ k: "linkcards", cards });
      continue;
    }
    switch (n.t) {
      case "text":
        if (isUpper(n.text) && peekHeading(i)) out.push({ k: "eyebrow", text: n.text });
        else if (onlyAnchors(n.html)) out.push({ k: "links", links: anchorsOf(n.html) });
        else pushProse(out, n);
        break;
      case "h": out.push({ k: "heading", level: n.l, html: n.html, text: n.text }); break;
      case "p": pushProse(out, n); break;
      case "list": out.push({ k: "list", ordered: n.ordered, items: n.items }); break;
      case "link": {
        const last = out[out.length - 1];
        if (last && last.k === "links") last.links.push({ href: n.href, text: n.text, parts: n.parts });
        else out.push({ k: "links", links: [{ href: n.href, text: n.text, parts: n.parts }] });
        break;
      }
      case "button": {
        if (!CTA_RX.test(n.text)) break; // search / popup triggers from the old site are not CTAs
        const last = out[out.length - 1];
        if (last && last.k === "cta") last.labels.push(n.text); else out.push({ k: "cta", labels: [n.text] });
        break;
      }
      case "table": out.push({ k: "table", rows: n.rows }); break;
      case "img": if (n.alt) out.push({ k: "img", src: n.src, alt: n.alt }); break;
      default: break;
    }
    i++;
  }
  return out;
}

function pushProse(out: Block[], n: { html: string; text: string }) {
  const last = out[out.length - 1];
  if (last && last.k === "prose") last.items.push({ html: n.html, text: n.text });
  else out.push({ k: "prose", items: [{ html: n.html, text: n.text }] });
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const words = (nodes: N[]) => nodes.map((n) => ("text" in n ? n.text : "")).join(" ");
const hasKind = (c: Card, t: string) => c.nodes.some((n) => n.t === t);

function trustIcon(label: string) {
  if (/free|obligation/i.test(label)) return <Coins width={16} height={16} />;
  if (/vetted|registered|verified/i.test(label)) return <Shield width={16} height={16} />;
  return <Check width={16} height={16} strokeWidth={2.6} />;
}

/** Splits "Title: item, item, item" / "Title — item, item" alt text into its parts. */
export function splitAlt(alt: string): { title: string; items: string[] } {
  const m = alt.match(/^(.*?)(?::| — )\s*(.+)$/);
  if (!m) return { title: alt, items: [] };
  return { title: m[1].trim(), items: m[2].split(/,\s*/).map((s) => s.trim()).filter(Boolean) };
}

function renderCardBody(c: Card): { label?: string; title?: string; titleHtml?: string; level: number; paras: ReactNode[]; lists: N[] } {
  const label = (c.nodes.find((n) => n.t === "text") as Extract<N, { t: "text" }> | undefined)?.text;
  const h = c.nodes.find((n) => n.t === "h") as Extract<N, { t: "h" }> | undefined;
  const paras = c.nodes.filter((n) => n.t === "p").map((n, i) => <Html key={i} html={(n as Extract<N, { t: "p" }>).html} />);
  const lists = c.nodes.filter((n) => n.t === "list");
  return { label: h ? label : undefined, title: h ? headingWords(h) : undefined, titleHtml: h?.html, level: h?.l ?? 3, paras, lists };
}

/* ------------------------------------------------------------------ */
/* grid rendering                                                      */
/* ------------------------------------------------------------------ */
function Grid({ cards, seed = 0, home = false }: { cards: Card[]; seed?: number; home?: boolean }) {
  const pick = home ? auPictureFor : pictureFor; // never returns a photo this page has already shown (picture-registry.ts)
  const STEP_PHOTOS = [/beach-path/, /cafe-chat/, /barista/];
  const kinds = cards.map((c) => {
    const first = c.nodes[0];
    if (first?.t === "text" && /^step\s*\d/i.test(first.text)) return "step";
    if (!hasKind(c, "h") && !hasKind(c, "p") && !hasKind(c, "list") && c.nodes.every((n) => n.t === "text" || n.t === "link") && words(c.nodes).split(" ").length <= 6) return "chip";
    if (!hasKind(c, "h") && hasKind(c, "p")) return "note";
    if (c.nodes.some((n) => n.t === "button")) return "button";
    return "feature";
  });
  const kind = kinds.sort((a, b) => kinds.filter((x) => x === b).length - kinds.filter((x) => x === a).length)[0];

  if (kind === "button") {
    const labels = cards.flatMap((c) => c.nodes.filter((n) => n.t === "button" && CTA_RX.test(n.text)).map((n) => (n as { text: string }).text));
    return labels.length ? renderBlock({ k: "cta", labels: [labels[0]] }, seed, home) : null;
  }
  if (kind === "chip") return <Chips items={cards.map((c) => words(c.nodes))} />;

  if (kind === "step") {
    return (
      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {cards.map((c, i) => {
          const texts = c.nodes.filter((n) => n.t === "text") as Extract<N, { t: "text" }>[];
          const h = c.nodes.find((n) => n.t === "h") as Extract<N, { t: "h" }> | undefined;
          const ps = c.nodes.filter((n) => n.t === "p") as Extract<N, { t: "p" }>[];
          return (
            <StepCard key={i} step={texts[0]?.text ?? ""} kicker={texts[1]?.text} title={h?.text} photo={home ? (auFind(STEP_PHOTOS[i % 3])?.file ?? auRotating(i)) : null}>
              {ps.map((p, j) => <Html key={j} html={p.html} />)}
            </StepCard>
          );
        })}
      </div>
    );
  }

  if (kind === "note") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c, i) => (<NoteCard key={i} index={i} html={c.nodes.filter((n) => n.t === "p").map((n) => (n as Extract<N, { t: "p" }>).html).join("<br><br>")} />))}
      </div>
    );
  }

  if (cards.length === 1 && cards[0].nodes.some((n) => n.t === "link")) {
    const h = cards[0].nodes.find((n) => n.t === "h") as Extract<N, { t: "h" }> | undefined;
    const links = cards[0].nodes.filter((n) => n.t === "link") as Extract<N, { t: "link" }>[];
    return (
      <div className="reveal">
        {h && <h3 className="h-card mb-5">{headingWords(h)}</h3>}
        <ul className="flex flex-wrap gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-[0.95rem] font-bold text-navy-900 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-green-500 hover:text-green-700 hover:shadow-[var(--shadow-md)]">
                <Pin width={16} height={16} className="text-green-500 transition group-hover:scale-110" />
                {l.text.replace(/\|$/, "").trim()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (cards.length === 1) {
    const b = renderCardBody(cards[0]);
    return (
      <TextColumn title={b.title} titleLevel={b.level === 2 ? 2 : 3}>
        {b.paras}
        {b.lists.map((l, i) => (<div key={i} className="mt-5"><Checklist ordered={(l as Extract<N, { t: "list" }>).ordered} columns={1} items={(l as Extract<N, { t: "list" }>).items} /></div>))}
      </TextColumn>
    );
  }

  const textColumns = cards.every((c) => (c.nodes.find((n) => n.t === "h") as Extract<N, { t: "h" }> | undefined)?.l === 2);
  if (textColumns) {
    return (
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        {cards.map((c, i) => {
          const b = renderCardBody(c);
          return <TextColumn key={i} title={b.title} titleLevel={2}>{b.paras}</TextColumn>;
        })}
      </div>
    );
  }

  const cols = cards.length === 2 ? "md:grid-cols-2" : cards.length === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-5 md:gap-6 ${cols}`}>
      {cards.map((c, i) => {
        const b = renderCardBody(c);
        const allWords = `${b.title ?? ""} ${words(c.nodes)}`;
        return (
          <div key={i} className="reveal">
            <FeatureCard label={b.label} title={b.title} image={pick(allWords, seed + i)} topPhoto={home}>
              {b.paras}
              {b.lists.map((l, li) => (<PillList key={li} items={(l as Extract<N, { t: "list" }>).items} />))}
            </FeatureCard>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* the section                                                         */
/* ------------------------------------------------------------------ */
export type RenderOptions = { index: number; seed?: number };

export default function SectionView({ section, index, seed = 0, home = false }: { section: Section; index: number; seed?: number; home?: boolean }) {
  const blocks = toBlocks(section.nodes);
  if (blocks.length === 0) return null;
  const eyebrow = (blocks.find((b) => b.k === "eyebrow") as Extract<Block, { k: "eyebrow" }> | undefined)?.text;
  const eyebrowKey = (eyebrow ?? "").toLowerCase();

  // ----- Shared "graphic" sections whose words live in picture alt text -----
  const img = blocks.find((b) => b.k === "img") as Extract<Block, { k: "img" }> | undefined;
  if (img && /^the difference$/.test(eyebrowKey)) return <Difference blocks={blocks} img={img} eyebrow={eyebrow} home={home} />;
  if (img && /^who we help$/.test(eyebrowKey)) return (<><Audience blocks={blocks} img={img} eyebrow={eyebrow} home={home} />{home && <MidCta />}</>);

  const heading = blocks.find((b) => b.k === "heading") as Extract<Block, { k: "heading" }> | undefined;
  const bg = index % 2 === 0 ? "bg-white" : "bg-surface";

  // Order-preserving render of everything after the heading
  let afterHeading = false;
  const body: ReactNode[] = [];
  let leadDone = false;
  const lead: ReactNode[] = [];

  blocks.forEach((b, bi) => {
    if (b.k === "eyebrow" || b === heading) { afterHeading = b === heading || afterHeading; return; }
    if (b.k === "prose" && !leadDone && afterHeading && body.length === 0) {
      lead.push(...b.items.map((p, i) => <Html key={`${bi}-${i}`} html={p.html} />));
      leadDone = true;
      return;
    }
    leadDone = true;
    body.push(<div key={bi} className={body.length ? "mt-10 md:mt-14" : ""}>{renderBlock(b, seed + bi, home, !home)}</div>);
  });

  // single-card "document" sections render as a two-column spread (heading left, text right)
  const grids = blocks.filter((b) => b.k === "grid") as Extract<Block, { k: "grid" }>[];
  const isDoc = grids.length === 1 && grids[0].cards.length === 1 && !heading;

  // home page, tablet and desktop: the "What is Your Accountant Match?" story sits beside a collage of Australian photos
  const story = home && /better way/i.test(eyebrowKey);
  // photo clusters that fill the empty space beside the heading of these home sections (tablet and desktop)
  const sideBadge = home ? (/specialist network/.test(eyebrowKey) ? "check" : /^explore$/.test(eyebrowKey) ? "users" : null) : null;
  const sideFlip = /explore|latest articles/.test(eyebrowKey) ? false : false;
  const faqSide = home && /common questions/.test(eyebrowKey);
  const headNode = heading && <SectionHead eyebrow={eyebrow} title={headingWords(heading)} level={heading.level === 1 ? 1 : (heading.level as 2 | 3)} lead={lead.length ? <>{lead}</> : undefined} />;
  return (
    <section className={`section-y ${bg}${home ? " relative overflow-hidden" : ""}${home && (!heading || heading.level >= 4) ? " md:!py-9" : ""}`}>
      {home && <WarmBlobs flip={index % 2 === 1} />}
      <div className="container-page relative">
        {story ? (
          <div className="md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14">
            <div>
              {headNode}
              <div className="mt-10">{body}</div>
            </div>
            <PhotoCollage />
          </div>
        ) : faqSide ? (
          <>
            {headNode}
            <div className="mt-10 md:mt-14 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-12 [&_.mx-auto.max-w-3xl]:lg:mx-0 [&_.mx-auto.max-w-3xl]:lg:max-w-none">
              <div>{body}</div>
              <div className="relative hidden lg:block lg:self-center"><SideCollage badge="users" flip tall /></div>
            </div>
          </>
        ) : (
          <>
            {sideBadge ? (
              <div className="lg:flex lg:items-center lg:justify-between lg:gap-10">
                <div className="lg:min-w-0 lg:flex-1">{headNode}</div>
                <div className="lg:w-[36%] lg:shrink-0"><SideCollage badge={sideBadge as "users" | "check"} flip={sideFlip} /></div>
              </div>
            ) : headNode}
            {!heading && lead.length > 0 && <div className="lead prose-yam max-w-3xl">{lead}</div>}
            <div className={heading || lead.length ? "mt-10 md:mt-14" : ""}>{isDoc ? body : body}</div>
          </>
        )}
      </div>
    </section>
  );
}

function renderBlock(b: Block, seed: number, home = false, tilePhotos = true): ReactNode {
  switch (b.k) {
    case "grid": return <Grid cards={b.cards} seed={seed} home={home} />;
    case "prose": return <div className="prose-yam max-w-3xl text-[1.02rem]">{b.items.map((p, i) => <Html key={i} html={p.html} />)}</div>;
    case "list": return <Checklist ordered={b.ordered} items={b.items} columns={b.items.length > 5 ? 2 : 1} />;
    case "faq": return <Faq items={b.items} />;
    case "table": return <DataTable rows={b.rows} />;
    case "heading": return <h3 className="h-card">{headingWords({ html: b.html, text: b.text })}</h3>;
    case "links": return <LinkTiles links={b.links} seed={seed} home={home} photos={tilePhotos} />;
    case "cta": return (
      <div className="flex flex-wrap gap-3">
        {b.labels.map((l) => (
          <Link key={l} href={QUESTIONNAIRE_URL} className="btn btn-primary btn-lg"><span>{l}</span><span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span></Link>
        ))}
      </div>
    );
    case "linkcards":
      if (b.cards.every((c) => !c.nodes.some((n) => n.t === "h"))) {
        return <LinkTiles seed={seed} home={home} photos={tilePhotos} links={b.cards.map((c) => ({ href: c.href, text: c.nodes.map((n) => (n as { text?: string }).text ?? "").join(" ").trim(), parts: (c.nodes.find((n) => n.t === "text" && (n as { parts?: string[] }).parts) as { parts?: string[] } | undefined)?.parts })).filter((l) => l.text)} />;
      }
      return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {b.cards.map((c, i) => {
          const hi = c.nodes.findIndex((n) => n.t === "h");
          const h = c.nodes[hi] as Extract<N, { t: "h" }> | undefined;
          const p = c.nodes.find((n) => n.t === "p") as Extract<N, { t: "p" }> | undefined;
          const before = c.nodes.slice(0, Math.max(hi, 0)).filter((n) => n.t === "text") as Extract<N, { t: "text" }>[];
          const after = c.nodes.slice(hi + 1).filter((n) => n.t === "text") as Extract<N, { t: "text" }>[];
          const title = h ? headingWords(h) : "";
          return <div key={i} className="reveal"><ArticleCard href={c.href} label={before[0]?.text} meta={after[0]?.text} title={title} excerpt={p?.text} image={(home ? auPictureFor : pictureFor)(`${title} ${before[0]?.text ?? ""}`, seed + i)} /></div>;
        })}
      </div>
      );
    case "img": return null;
    default: return null;
  }
}

/** Tiles for lists of links (service pages, guides): a small picture at rest, the full picture on hover (desktop). */
export function LinkTiles({ links, seed = 0, home = false, photos = true }: { links: { href: string; text: string; parts?: string[] }[]; seed?: number; home?: boolean; photos?: boolean }) {
  const pick = home ? auPictureFor : pictureFor;
  if (links.length === 1) {
    return (
      <Link href={links[0].href} className="group inline-flex min-h-12 items-center gap-3 font-bold text-green-700">
        <span className="underline decoration-green-200 decoration-2 underline-offset-4 transition group-hover:decoration-green-600">{links[0].text}</span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-green-50 transition group-hover:translate-x-1"><ArrowRight width={16} height={16} /></span>
      </Link>
    );
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {links.map((l, i) => {
        const pic = !photos ? null : home ? (auRemaining() > KEEP_BACK ? auRotating(seed + i) : null) : pick(l.text, seed + i);
        const crop = home ? CROPS[i % CROPS.length] : "";
        const compact = home && !pic; // home page: photo-less tiles become tidy icon cards
        const TileIcon = TILE_ICONS[i % TILE_ICONS.length];
        return (
          <li key={l.href + i} className="reveal">
            <Link href={l.href} className={`group relative flex min-h-[5.25rem] items-center gap-3 overflow-hidden rounded-2xl border border-line bg-white p-3 pr-4 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1.5 hover:border-green-200 hover:shadow-[var(--shadow-lg)]${home ? (compact ? " md:min-h-[4.75rem] md:gap-3.5 md:rounded-2xl md:border-amber-200/60 md:bg-gradient-to-br md:from-white md:to-amber-50/60 md:px-4 md:py-3" : " md:h-full md:flex-col md:items-stretch md:gap-0 md:rounded-3xl md:p-0 md:pr-0") : ""}`}>
              {/* home page, tablet and desktop: a round icon badge starts each photo-less tile */}
              {compact && (
                <span aria-hidden className="hidden h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white shadow-[0_10px_20px_-8px_rgba(0,135,58,.7)] transition duration-300 group-hover:scale-110 group-hover:rotate-6 md:grid">
                  <TileIcon width={20} height={20} />
                </span>
              )}
              {pic && (
                <>
                  <span className={`relative h-[3.75rem] w-[3.75rem] w-[3.75rem] shrink-0 overflow-hidden rounded-xl${home ? " md:h-44 md:w-full md:rounded-none" : ""}`}>
                    <Image src={pic} alt="" fill sizes="(min-width:768px) 300px, 64px" className={`object-cover ${crop}`} />
                  </span>
                  {/* full-size picture revealed on hover (desktop only) */}
                  <span aria-hidden className={`pointer-events-none absolute inset-0 hidden opacity-0 transition duration-500 hoverable:block hoverable:group-hover:opacity-100${home ? " hoverable:!hidden" : ""}`}>
                    <Image src={pic} alt="" fill sizes="320px" className="object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/45 to-navy-950/25" />
                  </span>
                </>
              )}
              <span className={`relative flex-1 transition-colors${home ? (compact ? "" : " md:p-5 md:pb-3") : ""}`}>
                <span className={`block text-[0.95rem] font-bold leading-snug text-navy-900 ${home ? "md:font-serif md:text-[1.1rem]" : "hoverable:group-hover:text-white"}`}>{l.parts ? l.parts[0] : l.text}</span>
                {l.parts && <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted hoverable:group-hover:text-navy-100">{l.parts.slice(1).join(" ")}</span>}
              </span>
              <ArrowRight width={18} height={18} className={`relative shrink-0 text-green-600 transition group-hover:translate-x-1${home ? (compact ? "" : " md:mx-5 md:mb-5 md:self-end") : " hoverable:group-hover:text-green-200"}`} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Graphic-section replacements (words come from the picture alt text)  */
/* ------------------------------------------------------------------ */
function Difference({ blocks, img, eyebrow, home = false }: { blocks: Block[]; img: { alt: string }; eyebrow?: string; home?: boolean }) {
  const heading = blocks.find((b) => b.k === "heading") as Extract<Block, { k: "heading" }> | undefined;
  const { items } = splitAlt(img.alt);
  const icons = [<Sparkle2 key="a" />, <Clock2 key="b" />, <Coins width={26} height={26} key="c" />, <Shield width={26} height={26} key="d" />];
  const photo = home ? auFind(/family-beach/)?.file ?? null : null;
  return (
    <section className="section-y relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-navy-700/50 blur-3xl" />
      <div className="container-page relative">
        {heading && <SectionHead dark eyebrow={eyebrow} title={headingWords(heading)} />}
        {/* home page, tablet and desktop: a warm Australian photo beside the four benefits (decorative; same words) */}
        <div className={photo ? "mt-10 md:mt-14 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12" : ""}>
          {photo && (
            <div aria-hidden className="relative mb-8 hidden aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/20 md:block lg:mb-0 lg:aspect-[4/5]">
              <Image src={photo} alt="" fill sizes="(min-width:1024px) 460px, 90vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
            </div>
          )}
          <ul className={`grid gap-4 sm:grid-cols-2 lg:gap-5 ${photo ? "mt-10 md:mt-0" : "mt-10 md:mt-14 lg:grid-cols-4"}`}>
            {items.map((t, i) => (
              <li key={t} className="reveal group rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition duration-300 hover:-translate-y-2 hover:bg-white/10 md:p-7">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-green-500/15 text-green-200 ring-1 ring-green-500/30 transition group-hover:bg-green-500 group-hover:text-white">{icons[i % icons.length]}</span>
                <p className="mt-6 font-serif text-2xl font-semibold text-white">{t}</p>
                {DIFFERENCE_NOTES[t.toLowerCase()] && <p className="mt-3 text-[0.97rem] leading-relaxed text-navy-100">{DIFFERENCE_NOTES[t.toLowerCase()]}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { Clock } from "../ui/Icons";
const Sparkle2 = () => <Sparkle width={26} height={26} />;
const Clock2 = () => <Clock width={26} height={26} />;

function Audience({ blocks, img, eyebrow, home = false }: { blocks: Block[]; img: { alt: string }; eyebrow?: string; home?: boolean }) {
  const heading = blocks.find((b) => b.k === "heading") as Extract<Block, { k: "heading" }> | undefined;
  const prose = blocks.find((b) => b.k === "prose") as Extract<Block, { k: "prose" }> | undefined;
  const { items } = splitAlt(img.alt);
  const pick = home ? auPictureFor : pictureFor;
  return (
    <section className="section-y bg-white">
      <div className="container-page">
        {heading && <SectionHead eyebrow={eyebrow} title={headingWords(heading)} lead={prose?.items.map((p, i) => <Html key={i} html={p.html} />)} />}
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-14 md:gap-5 lg:grid-cols-5">
          {items.map((t, i) => {
            const pic = pick(t, i);
            return (
              <li key={t} className={`reveal${home ? " md:odd:-rotate-1 md:even:rotate-1 md:hover:rotate-0 md:transition-transform md:duration-300" : ""}`}>
                {/* Picture fills the top three-quarters; the title sits in its own band in the bottom quarter. */}
                <div className={`group flex aspect-[4/5] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-md)] transition duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-[var(--shadow-lg)]${home ? " md:border-4 md:border-white md:shadow-[0_22px_40px_-18px_rgba(7,50,101,.45)]" : ""}`}>
                  <div className="relative flex-[3] overflow-hidden bg-navy-50">
                    {pic && <Image src={pic} alt="" fill sizes="(min-width:1024px) 230px, 45vw" className="object-cover transition duration-700 group-hover:scale-110" />}
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/35 to-transparent" />
                    <span aria-hidden className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-xs font-bold text-navy-900 shadow-sm backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="relative flex flex-1 items-center justify-between gap-2 border-t-[3px] border-green-500 bg-white px-4 transition-colors duration-300 group-hover:bg-navy-900 md:px-5">
                    <span className="font-serif text-[1.05rem] font-semibold leading-tight text-navy-900 transition-colors group-hover:text-white md:text-lg">{t}</span>
                    <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-50 text-green-700 transition duration-300 group-hover:translate-x-1 group-hover:bg-green-500 group-hover:text-white"><ArrowRight width={16} height={16} /></span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export { TrustBadges, trustIcon };
