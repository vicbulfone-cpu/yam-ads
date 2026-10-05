import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { headingWords, oneLine, plain, type Node } from "@/lib/content";
import { QUESTIONNAIRE_URL, ctaLabel } from "@/config/site.config";
import { ArrowRight, Check, Coins, Shield } from "../ui/Icons";
import { Html } from "./Blocks";
import MatchCard, { type MatchCardData } from "./MatchCard";

type N = Exclude<Node, { t: "sec" }>;
const isUpper = (s: string) => s.length > 2 && s === s.toUpperCase() && /[A-Z]/.test(s) && s.split(" ").length <= 7;

export type HeroParts = {
  crumbs: { label: string; href?: string }[];
  eyebrow?: string;
  h1?: { html: string; text: string; override?: H1Parts };
  lead: string[];
  chips: string[];
  meta: string[];
  cta?: string;
  byline?: { label: string; name: string; role: string; initials: string; reviewedLabel?: string; reviewed?: string; verified?: string };
};

/** Reads the hero's words (breadcrumb, eyebrow, H1, intro, trust chips, CTA) out of the nodes before/in the H1 section. */
export function heroParts(pre: N[], heroNodes: N[]): HeroParts {
  const all = [...pre, ...heroNodes];
  const h1i = all.findIndex((n) => n.t === "h" && n.l === 1);
  const before = h1i === -1 ? [] : all.slice(0, h1i);
  const after = h1i === -1 ? all : all.slice(h1i + 1);

  // breadcrumb: Home / Locations / Sydney
  const crumbs: { label: string; href?: string }[] = [];
  for (const n of before) {
    if (n.t === "link" && n.text !== "/" && n.text.length < 40) crumbs.push({ label: n.text, href: n.href });
    else if (n.t === "text" && n.text.includes(" / ")) n.text.split(" / ").forEach((p) => crumbs.push({ label: p.trim() }));
    else if (n.t === "text" && n.text !== "/" && !isUpper(n.text) && crumbs.length && n.text.length < 60) crumbs.push({ label: n.text });
  }
  const prev = before[before.length - 1];
  const eyebrowNode = prev && prev.t === "text" && isUpper(prev.text) ? (prev as Extract<N, { t: "text" }>) : undefined;
  const h1n = h1i === -1 ? undefined : (all[h1i] as Extract<N, { t: "h" }>);

  const lead: string[] = [];
  const chips: string[] = [];
  const meta: string[] = [];
  let cta: string | undefined;
  let byline: HeroParts["byline"];
  const used = new Set<number>();
  const wb = after.findIndex((n) => n.t === "p" && /^written by$/i.test(n.text));
  if (wb >= 0 && after[wb + 1] && after[wb + 2]) {
    const g = (k: number) => (after[k] as { text?: string } | undefined)?.text ?? "";
    byline = { label: g(wb), name: g(wb + 1), role: g(wb + 2), initials: "" };
    [wb, wb + 1, wb + 2].forEach((k) => used.add(k));
    const rl = after.findIndex((n, k) => k > wb && n.t === "p" && /^last reviewed$/i.test(n.text));
    if (rl >= 0) { byline.reviewedLabel = g(rl); used.add(rl); }
    after.forEach((n, k) => {
      if (n.t !== "text" || k < wb) return;
      if (/^[A-Z]{1,3}$/.test(n.text)) { byline!.initials = n.text; used.add(k); }
      else if (/^last verified/i.test(n.text)) { byline!.verified = n.text; used.add(k); }
      else if (/^\d{1,2} [A-Za-z]+ \d{4}$/.test(n.text)) { byline!.reviewed = n.text; used.add(k); }
    });
  }
  for (const [idx, n] of after.entries()) {
    if (used.has(idx)) continue;
    if (n.t === "p") lead.push(n.html);
    else if (n.t === "text" && n.g != null && n.text.length < 40) chips.push(n.text);
    else if (n.t === "text" && /find my accountant|get match/i.test(n.text)) cta = n.text;
    else if (n.t === "button" && /find my accountant|get match/i.test(n.text)) cta = n.text;
    else if (n.t === "text" && n.text.length < 80 && !/^start$/i.test(n.text)) meta.push(n.text);
  }
  return { crumbs: crumbs.length >= 2 ? crumbs : [], eyebrow: eyebrowNode?.text, h1: h1n && { html: h1n.html, text: h1n.text }, lead, chips, meta, cta, byline };
}

export const chipIcon = (t: string) => (/free|obligation/i.test(t) ? <Coins width={16} height={16} /> : /vetted|registered|verified/i.test(t) ? <Shield width={16} height={16} /> : <Check width={16} height={16} strokeWidth={2.6} />);

export type H1Parts = { first: string; highlight?: string; second?: string };

/**
 * Page headline (H1). Three-part design: a bold navy first line, a green highlighted phrase with a hand-drawn underline
 * ("near you?", "in Sydney"), and a lighter closing line ("We'll find your match."). The words are the page's own, in
 * the same order with a single space between parts; only the look differs.
 */
export function TwoToneH1({ html, text, className = "", sizeClass = "h-display", override, variant }: { html: string; text: string; className?: string; sizeClass?: string; override?: H1Parts; variant?: "mock" }) {
  const flat = headingWords({ html, text });
  let p: H1Parts;
  if (override) p = override;
  else {
    const segs = html.split("<br>");
    const at = segs.findIndex((s) => /^we.ll find/i.test(s.trim()));
    if (at > 0) {
      const second = plain(oneLine(segs.slice(at).join(" ")));
      p = { first: plain(oneLine(segs.slice(0, at).join(" "))), second };
    } else {
      const m = flat.match(/^(.+?[?.!])\s+(.+)$/);
      p = m ? { first: m[1], highlight: m[2] } : { first: flat };
    }
    // a trailing "near you?" / "near me" in the first line becomes the highlighted phrase
    const n = p.first.match(/^(.*?)\s+(near (?:you|me)\??)$/i);
    if (n && !p.highlight) p = { ...p, first: n[1], highlight: n[2] };
  }
  if (variant === "mock") {
    // Home and city pages: bold navy first line, the green phrase on its own line, then a tick and the closing line
    return (
      <h1 className={`${sizeClass} ${className}`}>
        <span className="block text-navy-900">{p.first}</span>
        {p.highlight && (
          <>
            {" "}
            <span className="block text-green-700">{p.highlight}</span>
          </>
        )}
        {p.second && (
          <>
            {" "}
            <span className="mt-2 flex items-start gap-[0.5em] text-[0.62em] font-semibold leading-tight tracking-normal text-navy-900">
              <svg aria-hidden viewBox="0 0 24 24" className="mt-[0.05em] h-[1.35em] w-[1.35em] shrink-0 text-green-700">
                <circle cx="12" cy="12" r="12" fill="currentColor" />
                <path d="M6.8 12.6l3.6 3.6 6.8-7.4" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{p.second}</span>
            </span>
          </>
        )}
      </h1>
    );
  }
  return (
    <h1 className={`${sizeClass} ${className}`}>
      <span className="block">{p.first}</span>
      {p.highlight && (
        <>
          {" "}
          <span className="relative mt-0.5 block w-fit pb-2 text-green-700">
            {p.highlight}
            <svg aria-hidden viewBox="0 0 120 10" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[0.3em] w-full text-green-600">
              <path d="M2 6.5C28 2.5 62 8.5 118 3.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
          </span>
        </>
      )}
      {p.second && (
        <>
          {" "}
          <span className="mt-1 block text-[0.82em] font-medium tracking-normal text-navy-900">{p.second}</span>
        </>
      )}
    </h1>
  );
}

export default function PageHero({
  parts, card, cardTitleTag = "h2", image, children, showCta = true,
}: { parts: HeroParts; card?: MatchCardData | null; cardTitleTag?: "h2" | "p"; image?: { src: string; srcSmall: string } | null; children?: ReactNode; showCta?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
      {/* faded landmark / soft backdrop */}
      {image ? (
        <div aria-hidden className="city-wash pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] sm:h-[40rem]">
          <Image src={image.src} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-[0.32]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/55 to-white" />
        </div>
      ) : (
        <>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[32rem] w-[32rem] rounded-full bg-green-500/10 blur-3xl" />
          <div aria-hidden className="dots pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />
        </>
      )}

      <div className={`container-page pb-14 pt-8 md:pb-20 md:pt-12${card ? " mc-hero-wrap" : ""}`}>
        {/* Phone order: breadcrumbs, headline, first paragraph, trust points, the match card, then the remaining paragraphs.
            Desktop: text column on the left, match card on the right (home page size and position). */}
        <div className={`grid items-start gap-x-14 gap-y-10 ${card ? "mc-hero-grid" : ""}`}>
          <div className={`max-w-3xl lg:col-start-1 lg:row-start-1${card ? " mc-hero-text" : ""}`}>
            {parts.crumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-x-2 text-sm font-medium text-muted md:mb-8">
                {parts.crumbs.map((c, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden className="text-line">/</span>}
                    {c.href && i < parts.crumbs.length - 1 ? <Link href={c.href} className="transition hover:text-green-700">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
                  </span>
                ))}
              </nav>
            )}
            {parts.eyebrow && <span className="eyebrow">{parts.eyebrow}</span>}
            {parts.h1 && <TwoToneH1 html={parts.h1.html} text={parts.h1.text} className={parts.eyebrow ? "mt-5" : ""} override={parts.h1.override} sizeClass={parts.h1.override ? "h-display-home-compact" : "h-display"} />}
            {parts.lead[0] && <Html html={parts.lead[0]} className="prose-yam lead mt-5" />}
            {!card && parts.lead.slice(1).map((l, i) => (
              <Html key={i} html={l} className="prose-yam mt-5 text-[1.02rem] leading-relaxed text-body" />
            ))}
            {parts.byline && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-white/80 p-4 shadow-[var(--shadow-sm)]">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-900 font-serif text-lg font-semibold text-white">{parts.byline.initials || parts.byline.name.slice(0, 1)}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">{parts.byline.label}</p>
                  <p className="font-semibold text-ink">{parts.byline.name}</p>
                  <p className="text-sm text-muted">{parts.byline.role}</p>
                </div>
                {parts.byline.reviewed && (
                  <div className="min-w-0 sm:border-l sm:border-line sm:pl-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">{parts.byline.reviewedLabel}</p>
                    <p className="font-semibold text-ink">{parts.byline.reviewed}</p>
                    {parts.byline.verified && <p className="text-sm text-green-700">{parts.byline.verified}</p>}
                  </div>
                )}
              </div>
            )}
            {parts.chips.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
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
            {parts.meta.length > 0 && <p className="mt-4 text-sm font-semibold text-muted">{parts.meta.join(" · ")}</p>}
            {!card && showCta && (
              <div className="mt-8">
                <Link href={QUESTIONNAIRE_URL} className="btn btn-primary btn-lg">
                  <span>{parts.cta ?? ctaLabel}</span>
                  <span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
                </Link>
              </div>
            )}
          </div>
          {card && <div className="mc-hero-card lg:col-start-2 lg:row-span-2 lg:row-start-1"><MatchCard data={card} titleTag={cardTitleTag} /></div>}
          {card && parts.lead.length > 1 && (
            <div className="max-w-3xl space-y-5 lg:col-start-1 lg:row-start-2">
              {parts.lead.slice(1).map((l, i) => (
                <Html key={i} html={l} className="prose-yam text-[1.02rem] leading-relaxed text-body" />
              ))}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
