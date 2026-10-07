import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "@/components/layout/SiteFooter";
import HomeClosingCta from "@/components/sections/HomeClosingCta";
import { TAGLINES } from "@/content/taglines";
import { howWeSelect as hw } from "@/content/how-we-select";
import { loadContent, mergeViews } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

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

        {/* Commitment (owner, 7 Oct 2026: redesigned, no button): a navy panel with the heading beside the two
            paragraphs; the privacy promise sits in a highlighted card. Same words. Styles: ".hwc-" in globals.css. */}
        <section className="pb-12 md:pb-20">
          <div className="container-page">
            <div className="hwc">
              <div className="hwc-side">
                <span aria-hidden className="hwc-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.6 4.5 5.5v5.6c0 4.8 3.2 8.8 7.5 10.3 4.3-1.5 7.5-5.5 7.5-10.3V5.5L12 2.6Z" />
                    <path d="m8.4 11.8 2.5 2.5 4.8-4.9" />
                  </svg>
                </span>
                <h2 className="hwc-title">{hw.commitment.title}</h2>
                <span aria-hidden className="hwc-rule" />
              </div>
              <div className="hwc-body">
                <p className="hwc-lead">{hw.commitment.paragraphs[0]}</p>
                {hw.commitment.paragraphs.slice(1).map((p) => (
                  <p key={p} className="hwc-promise">
                    <span aria-hidden className="hwc-promise-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2.2" /><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" /></svg>
                    </span>
                    <span>{p}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* owner, 7 Oct 2026: the home page closing band ("One quick match...") in place of the blue call-to-action box */}
        <HomeClosingCta tagline={TAGLINES[8]} />
      </main>
      <SiteFooter nodes={nodes} />
    </>
  );
}
