import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import { Check } from "@/components/ui/Icons";
import CtaBand from "@/components/sections/CtaBand";
import MatchCard, { getHomeMatchCard } from "@/components/sections/MatchCard";
import SectionView from "@/components/sections/SectionRenderer";
import { QUESTIONNAIRE_URL, ctaLabel } from "@/config/site.config";
import { howWeSelect as hw } from "@/content/how-we-select";
import { loadContent, mergeViews, splitOnHeadings, toSections } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { ArrowRight } from "@/components/ui/Icons";

const PATH = "/how-we-select-accountants";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(PATH);
}

export default function HowWeSelectPage() {
  // Shared blocks from the old page ("What is Your Accountant Match?" etc.) and its footer
  const nodes = mergeViews(loadContent(PATH));
  const shared = splitOnHeadings(toSections(nodes))
    .filter((s) => s.tag !== "header" && s.tag !== "footer" && s.tag !== "main")
    .filter((s) => s.nodes.some((n) => n.t === "text" && /better way to find your accountant/i.test(n.text)));
  const matchCard = getHomeMatchCard();

  return (
    <>
      <JsonLd path={PATH} />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[30rem] w-[30rem] rounded-full bg-green-500/10 blur-3xl" />
          <div className="container-page mc-hero-wrap pb-10 pt-12 md:pb-16 md:pt-20">
            <div className="mc-hero-grid grid items-start gap-10">
              <div className="mc-hero-text max-w-3xl">
                <h1 className="h-display">{hw.title}</h1>
                <p className="lead mt-6">{hw.intro}</p>
              </div>
              <div className="mc-hero-card lg:col-start-2 lg:row-start-1">
                <MatchCard data={matchCard} titleTag="p" />
              </div>
            </div>
          </div>
        </section>

        {/* Seven checks — numbered timeline */}
        <section className="pb-8 md:pb-16">
          <div className="container-page">
            <ol className="relative mx-auto max-w-5xl">
              {/* the line (grows as you scroll, where supported) */}
              <span aria-hidden className="absolute bottom-0 left-[1.4rem] top-2 w-[3px] rounded-full bg-line lg:left-1/2 lg:-translate-x-1/2" />
              <span aria-hidden className="grow-y absolute bottom-0 left-[1.4rem] top-2 w-[3px] rounded-full bg-gradient-to-b from-green-500 to-navy-900 lg:left-1/2 lg:-translate-x-1/2" />
              {hw.checks.map((c, i) => {
                const left = i % 2 === 0;
                return (
                  <li key={c.n} className="reveal relative pb-10 pl-16 last:pb-0 lg:pb-14 lg:pl-0">
                    {/* number marker on the line */}
                    <span className="absolute left-0 top-2 grid h-[2.9rem] w-[2.9rem] place-items-center rounded-full border-4 border-white bg-navy-900 font-serif text-lg font-semibold text-white shadow-[var(--shadow-md)] lg:left-1/2 lg:-translate-x-1/2">
                      {c.n}
                    </span>
                    <article className={`group card card-lift relative overflow-hidden ${left ? "lg:mr-auto lg:w-[calc(50%-3.25rem)]" : "lg:ml-auto lg:w-[calc(50%-3.25rem)]"}`}>
                      <div className="relative h-40 overflow-hidden sm:h-48 hoverable:absolute hoverable:inset-0 hoverable:h-auto hoverable:opacity-0 hoverable:transition-opacity hoverable:duration-500 hoverable:group-hover:opacity-100">
                        <Image src={`/images/stock/${c.image}.webp`} alt="" fill sizes="(min-width:1024px) 480px, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 hidden bg-gradient-to-t from-navy-950/90 via-navy-950/70 to-navy-950/50 hoverable:block" />
                      </div>
                      <div className="relative p-6 md:p-8 hoverable:group-hover:text-white">
                        <p className="eyebrow hoverable:group-hover:bg-white/15 hoverable:group-hover:text-green-200">Check {c.n}</p>
                        <h2 className="h-card mt-4 hoverable:group-hover:text-white">{c.title}</h2>
                        <p className="mt-3 text-[0.97rem] leading-relaxed text-body hoverable:group-hover:text-navy-100">{c.body}</p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Commitment panel */}
        <section className="pb-12 md:pb-20">
          <div className="container-page">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 via-white to-navy-50 p-7 shadow-[var(--shadow-md)] md:p-12">
              <span aria-hidden className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-green-500/10 blur-2xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:gap-10">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-green-600 text-white shadow-[var(--shadow-green)]">
                  <Check width={30} height={30} strokeWidth={2.4} />
                </span>
                <div>
                  <h2 className="h-section !text-[clamp(1.6rem,2.4vw+0.8rem,2.4rem)]">{hw.commitment.title}</h2>
                  {hw.commitment.paragraphs.map((p, i) => (
                    <p key={i} className={`mt-4 ${i === 0 ? "text-[1.05rem] text-body" : "font-semibold text-ink"} leading-relaxed`}>{p}</p>
                  ))}
                  <Link href={QUESTIONNAIRE_URL} className="btn btn-primary btn-lg mt-8">
                    <span>{ctaLabel}</span>
                    <span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {shared.map((s, i) => (<SectionView key={s.id} section={s} index={i + 1} />))}
        <CtaBand />
      </main>
      <SiteFooter nodes={nodes} />
    </>
  );
}
