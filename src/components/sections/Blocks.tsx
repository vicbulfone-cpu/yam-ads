// Reusable visual blocks. They only LAY OUT words handed to them (from the old site's extracted content);
// none of them contains copy of its own.
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Calendar, Check, Plus, Shield, Sparkle } from "../ui/Icons";

export const Html = ({ html, className = "", as: As = "p" }: { html: string; className?: string; as?: "p" | "span" | "div" | "h1" | "h2" | "h3" }) => (
  <As className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

/* ------------------------------------------------------------------ */
/* Eyebrow + heading group                                             */
/* ------------------------------------------------------------------ */
export function SectionHead({
  eyebrow, title, titleHtml, level = 2, lead, align = "left", dark = false,
}: { eyebrow?: string | null; title?: string; titleHtml?: string; level?: 1 | 2 | 3; lead?: ReactNode; align?: "left" | "center"; dark?: boolean }) {
  const Tag = (`h${level}` as unknown) as "h2";
  return (
    <div className={`reveal max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <span className={`eyebrow ${dark ? "eyebrow-dark" : ""}`}>{eyebrow}</span>}
      {(title || titleHtml) && (
        <Tag className={`h-section ${eyebrow ? "mt-4" : ""} ${dark ? "!text-white" : ""}`}
          {...(titleHtml ? { dangerouslySetInnerHTML: { __html: titleHtml } } : { children: title })} />
      )}
      {lead && <div className={`lead prose-yam mt-5 ${dark ? "!text-navy-100" : ""}`}>{lead}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feature card: lift on hover; picture reveals on hover (desktop),    */
/* shown by default on phones/tablets.                                 */
/* ------------------------------------------------------------------ */
export function FeatureCard({
  label, title, children, image, href, index, topPhoto = false,
}: { label?: string | null; title?: string; children?: ReactNode; image?: string | null; href?: string; index?: number; topPhoto?: boolean }) {
  // home page: a clean card with the photo always on top (no hover reveal), so the words stay easy to read
  if (topPhoto && image) {
    return (
      <article className="group card card-lift relative flex h-full flex-col overflow-hidden">
        <div className="relative h-44 w-full overflow-hidden sm:h-48">
          <Image src={image} alt="" fill sizes="(min-width:1280px) 380px, (min-width:768px) 45vw, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
        </div>
        <div className="relative flex flex-1 flex-col p-6 md:p-7">
          {label && <span className="mb-4 w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700">{label}</span>}
          {title && <h3 className="h-card">{title}</h3>}
          {children && <div className="prose-yam mt-3 text-[0.97rem] leading-relaxed text-body">{children}</div>}
        </div>
      </article>
    );
  }
  const body = (
    <>
      {image && (
        <div className="relative h-40 w-full overflow-hidden sm:h-44 hoverable:absolute hoverable:inset-0 hoverable:h-auto hoverable:opacity-0 hoverable:transition-opacity hoverable:duration-500 hoverable:group-hover:opacity-100 hoverable:group-focus-within:opacity-100">
          <Image src={image} alt="" fill sizes="(min-width:1280px) 380px, (min-width:768px) 45vw, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 hidden bg-gradient-to-t from-navy-950/90 via-navy-950/55 to-navy-950/30 hoverable:block" />
        </div>
      )}
      <div className="relative flex flex-1 flex-col p-6 transition-colors duration-300 md:p-7 hoverable:group-hover:text-white hoverable:group-focus-within:text-white">
        {(label || index !== undefined) && (
          <div className="mb-4 flex items-center gap-3">
            {index !== undefined && (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white transition-colors group-hover:bg-green-500">
                {index + 1}
              </span>
            )}
            {label && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700 transition-colors hoverable:group-hover:bg-white/15 hoverable:group-hover:text-green-200">
                {label}
              </span>
            )}
          </div>
        )}
        {!label && index === undefined && (
          <span aria-hidden className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-navy-900 text-white transition-colors group-hover:bg-green-600">
            <Sparkle width={22} height={22} />
          </span>
        )}
        {title && <h3 className="h-card transition-colors hoverable:group-hover:text-white">{title}</h3>}
        {children && <div className="prose-yam mt-3 text-[0.97rem] leading-relaxed text-body transition-colors hoverable:group-hover:text-navy-100 hoverable:group-hover:[&_a]:text-green-200 hoverable:group-hover:[&_strong]:text-white">{children}</div>}
        {href && (
          <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-green-700 hoverable:group-hover:text-green-200">
            <ArrowRight width={18} height={18} className="transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </>
  );
  const cls = `group card card-lift relative flex h-full flex-col overflow-hidden ${image ? "hoverable:min-h-[15rem]" : ""}`;
  return href ? (
    <Link href={href} className={cls}>{body}</Link>
  ) : (
    <article className={cls}>{body}</article>
  );
}

/* ------------------------------------------------------------------ */
/* Numbered step card (How it works)                                    */
/* ------------------------------------------------------------------ */
export function StepCard({ step, kicker, title, children, photo }: { step: string; kicker?: string; title?: string; children?: ReactNode; photo?: string | null }) {
  return (
    <article className="reveal group card card-lift relative h-full overflow-hidden p-7 md:p-8">
      {/* home page, tablet and desktop only: a warm Australian photo tops each step (decorative) */}
      {photo && (
        <div aria-hidden className="relative -mx-7 -mt-7 mb-6 hidden h-48 overflow-hidden md:-mx-8 md:-mt-8 md:block">
          <Image src={photo} alt="" fill sizes="(min-width:1024px) 380px, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/0 to-transparent" />
          <span className="absolute bottom-3 left-7 grid h-12 w-12 place-items-center rounded-full bg-green-600 font-serif text-xl font-semibold text-white shadow-[0_10px_24px_-8px_rgba(0,135,58,.7)] ring-4 ring-white md:left-8">{step.replace(/\D/g, "")}</span>
        </div>
      )}
      <span aria-hidden className={`pointer-events-none absolute -right-3 -top-6 select-none font-serif text-[8rem] font-semibold leading-none text-navy-50 transition-colors group-hover:text-green-50${photo ? " md:hidden" : ""}`}>
        {step.replace(/\D/g, "")}
      </span>
      <div className="relative">
        <span className="eyebrow">{step}</span>
        {kicker && <p className="mt-5 text-sm font-bold uppercase tracking-wider text-green-700">{kicker}</p>}
        {title && <h3 className="h-card mt-2">{title}</h3>}
        <div className="prose-yam mt-3 text-body">{children}</div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Article card with link                                              */
/* ------------------------------------------------------------------ */
export function ArticleCard({ href, label, meta, title, excerpt, image }: { href: string; label?: string; meta?: string; title: string; excerpt?: string; image?: string | null }) {
  return (
    <Link href={href} className="group card card-lift flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-50">
        {image && <Image src={image} alt="" fill sizes="(min-width:1024px) 300px, (min-width:640px) 45vw, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
        {label && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-green-700 shadow-sm">{label}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-serif text-lg font-semibold leading-snug text-navy-900 transition-colors group-hover:text-green-700 md:text-[1.2rem]">{title}</h3>
        {excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body">{excerpt}</p>}
        {meta && <p className="mt-auto pt-4 text-xs font-semibold text-muted">{meta}</p>}
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Checklist — two columns on tablet/desktop, custom tick icons         */
/* ------------------------------------------------------------------ */
export function Checklist({ items, columns = 2, ordered = false }: { items: { html: string }[]; columns?: 1 | 2; ordered?: boolean }) {
  return (
    <ul className={`grid gap-x-10 gap-y-4 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
      {items.map((it, i) => (
        <li key={i} className="reveal flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-[var(--shadow-md)] md:p-5">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-50 text-green-700 ring-1 ring-green-100">
            {ordered ? <span className="text-sm font-bold">{i + 1}</span> : <Check width={18} height={18} strokeWidth={2.4} />}
          </span>
          <Html as="span" html={it.html} className="prose-yam text-[0.98rem] leading-relaxed text-body" />
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ — native <details>: works without JavaScript and every answer    */
/* stays in the page for search engines.                                 */
/* ------------------------------------------------------------------ */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((it, i) => (
        <details key={i} className="group card overflow-hidden transition hover:border-green-200 open:border-green-200 open:shadow-[var(--shadow-md)]" name="faq" data-faq="">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 p-5 font-serif text-[1.05rem] font-semibold leading-snug text-navy-900 marker:hidden md:p-6 md:text-lg [&::-webkit-details-marker]:hidden">
            <span>{it.q}</span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-50 text-green-700 transition-transform duration-300 group-open:rotate-45 group-open:bg-green-600 group-open:text-white">
              <Plus width={18} height={18} strokeWidth={2.4} />
            </span>
          </summary>
          <Html html={it.a} className="prose-yam border-t border-line bg-surface/60 px-5 pb-6 pt-4 text-[0.98rem] leading-relaxed text-body md:px-6" />
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chips (e.g. professional bodies)                                     */
/* ------------------------------------------------------------------ */
export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {items.map((t) => (
        <li key={t} className="reveal flex min-h-12 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-bold tracking-wide text-navy-900 shadow-[var(--shadow-sm)]">
          <Shield width={18} height={18} className="text-green-500" />
          {t}
        </li>
      ))}
    </ul>
  );
}

/* Small trust badges (icon + label) */
export function TrustBadges({ items, icons, dark = false }: { items: string[]; icons?: ReactNode[]; dark?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      {items.map((t, i) => (
        <li key={t} className={`flex items-center gap-2.5 text-[0.95rem] font-semibold ${dark ? "text-white" : "text-ink"}`}>
          <span className={`grid h-8 w-8 place-items-center rounded-full ${dark ? "bg-white/15 text-green-200" : "bg-green-50 text-green-700"}`}>
            {icons?.[i] ?? <Check width={16} height={16} strokeWidth={2.6} />}
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Note card (key dates etc.)                                           */
/* ------------------------------------------------------------------ */
export function NoteCard({ html, index }: { html: string; index: number }) {
  return (
    <div className="reveal group card flex gap-4 p-5 transition hover:-translate-y-1 hover:border-green-200 hover:shadow-[var(--shadow-md)] md:p-6">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-navy-900 text-white transition-colors group-hover:bg-green-600">
        <Calendar width={22} height={22} />
      </span>
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted">{String(index + 1).padStart(2, "0")}</span>
        <Html html={html} className="prose-yam mt-1 text-[0.98rem] leading-relaxed text-body" />
      </div>
    </div>
  );
}

/* List of links shown as pills (e.g. the cities in a state) */
export function PillList({ items }: { items: { html: string }[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((it, i) => (
        <li key={i}>
          <Html as="span" html={it.html} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-bold text-navy-900 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-green-500 hover:text-green-700 [&_a]:no-underline" />
        </li>
      ))}
    </ul>
  );
}

/* Editorial text column (heading + paragraphs) */
export function TextColumn({ title, titleLevel = 3, children }: { title?: string; titleLevel?: 2 | 3; children: ReactNode }) {
  const Tag = (`h${titleLevel}` as unknown) as "h3";
  return (
    <article className="reveal relative border-l-4 border-green-500 pl-6 md:pl-8">
      {title && <Tag className="h-card">{title}</Tag>}
      <div className="prose-yam mt-3 text-[1rem] leading-relaxed text-body">{children}</div>
    </article>
  );
}

/* Data table */
export function DataTable({ rows }: { rows: string[][] }) {
  const [head, ...body] = rows;
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-[0.95rem]">
        <thead>
          <tr className="bg-navy-900 text-white">{head?.map((c, i) => <th key={i} className="px-5 py-3.5 font-semibold">{c}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((r, i) => (
            <tr key={i} className="border-t border-line even:bg-surface/70">{r.map((c, j) => <td key={j} className="px-5 py-3.5 align-top text-body">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Sparkle };
