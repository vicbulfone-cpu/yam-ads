import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import { Check } from "@/components/ui/Icons";
import CtaBand from "@/components/sections/CtaBand";
import { QUESTIONNAIRE_URL, ctaLabel } from "@/config/site.config";
import { howWeSelect as hw } from "@/content/how-we-select";
import { loadContent, mergeViews } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { ArrowRight } from "@/components/ui/Icons";

const PATH = "/how-we-select-accountants";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(PATH);
}

export default function HowWeSelectPage() {
  // The old page's footer wording. (Its shared "What is Your Accountant Match?" block is no longer shown here, owner
  // 7 Oct 2026, so it is not in the page or in the ad pages' popup.)
  const nodes = mergeViews(loadContent(PATH));

  return (
    <>
      <JsonLd path={PATH} />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
          {/* no match box here (owner, 6 Oct 2026): the seven checks start straight under the introduction */}
          <div className="container-page pb-8 pt-12 md:pb-10 md:pt-20">
            <div className="max-w-3xl">
              <h1 className="h-display">{hw.title}</h1>
              <p className="lead mt-6">{hw.intro}</p>
            </div>
          </div>
        </section>

        {/* Seven checks (owner, 7 Oct 2026: two boxes side by side, "amazing, professional and polished"): picture cards
            in two columns (one on phones). Each card: the check's accounting photo under a navy fade, with the big
            check number, the "Check N" label and the light green heading on it, then the description on white. The
            seventh card runs the full width (photo left, words right) so the grid ends evenly. Styles: ".hws-" in
            globals.css; the ad pages' popup shows the same cards. */}
        <section className="hws pb-8 md:pb-16">
          <div className="container-page">
            <ol className="hws-checks">
              {hw.checks.map((c) => (
                <li key={c.n} className="hws-item reveal">
                  <article className="hws-card group">
                    <div className="hws-media">
                      <Image src={`/images/stock/${c.image}.webp`} alt="" fill sizes="(min-width:1024px) 560px, (min-width:768px) 46vw, 92vw" className="hws-img" />
                      <span aria-hidden className="hws-shade" />
                      <span aria-hidden className="hws-n">{String(c.n).padStart(2, "0")}</span>
                      <div className="hws-head">
                        <p className="hws-eyebrow">Check {c.n}</p>
                        <h2 className="hws-title">{c.title}</h2>
                      </div>
                    </div>
                    <div className="hws-body">
                      <span aria-hidden className="hws-rule" />
                      <p>{c.body}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Commitment panel */}
        <section className="pb-12 md:pb-20">
          <div className="container-page">
            <div className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 via-white to-navy-50 p-7 shadow-[var(--shadow-md)] md:p-12">
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

        <CtaBand />
      </main>
      <SiteFooter nodes={nodes} />
    </>
  );
}
