import fs from "node:fs";
import path from "node:path";

/**
 * Home page: "Frequently Asked Questions".
 * Questions and answers are read word for word from the home page's FAQ data (the same source as its FAQPage
 * structured data), so the visible FAQ and the structured data always match.
 */

type Faq = { q: string; a: string };

function homeFaqs(): Faq[] {
  const file = path.join(process.cwd(), "data", "extracted", "pages", "_home.json");
  const page = JSON.parse(fs.readFileSync(file, "utf8")) as { jsonLd: { "@type"?: string; mainEntity?: { name: string; acceptedAnswer: { text: string } }[] }[] };
  const faq = page.jsonLd.find((x) => x["@type"] === "FAQPage");
  return (faq?.mainEntity ?? []).map((m) => ({ q: m.name, a: m.acceptedAnswer.text }));
}

/**
 * Condensed layout (owner, 6 Oct 2026): laptops/desktops put the heading on the left (it stays in view while the
 * list scrolls) and the questions on the right as one white card with hairline dividers, numbered rows and a round
 * plus/minus; phones and tablets stack the heading above the same card with tighter rows.
 */
export default function FAQSection() {
  const faqs = homeFaqs();
  return (
    <section className="bg-white py-12 md:py-14 lg:py-[clamp(3.5rem,4vw,6rem)]">
      <div className="container-page home-wide grid gap-7 lg:grid-cols-[0.8fr_1.45fr] lg:items-start lg:gap-[4vw]">
        <div className="lg:sticky lg:top-[7rem]">
          <p className="inline-flex rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-green-700 fs-eyebrow">Common questions</p>
          <h2 className="mt-4 text-[1.85rem] leading-[1.1]! text-navy-900 sm:text-[2.1rem] lg:text-[2.3rem] fs-h2">
            Frequently Asked <span className="text-green-700">Questions</span>
          </h2>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-14 rounded-full bg-green-600 lg:w-[clamp(3.5rem,4vw,6rem)]" />
          <p className="mt-4 max-w-[26rem] text-[1rem] text-navy-900/85 lg:max-w-none fs-lead">Answers to common questions about finding your accountant.</p>
        </div>

        <div className="overflow-hidden rounded-2xl [counter-reset:faq] border border-navy-900/10 bg-white shadow-[0_18px_40px_-28px_rgba(7,50,101,0.45)]">
          {faqs.map((f) => (
            <details key={f.q} className="group border-t border-navy-900/[0.08] first:border-t-0 transition-colors open:bg-green-50/60">
              <summary className="flex min-h-[3.25rem] cursor-pointer list-none items-center gap-3.5 px-4 py-2.5 text-[0.95rem] font-bold text-navy-900 transition-colors hover:bg-green-50/60 sm:px-5 lg:min-h-[clamp(3.25rem,3.3vw,5rem)] lg:gap-[1vw] lg:px-[1.5vw] fs-body [&::-webkit-details-marker]:hidden">
                {/* the number is drawn by CSS so it is not part of the question's text (keeps it identical to the FAQ structured data) */}
                <span aria-hidden="true" className="w-6 shrink-0 font-sans text-[0.8rem] font-extrabold tabular-nums text-green-700/70 [counter-increment:faq] before:content-[counter(faq,decimal-leading-zero)] lg:w-[clamp(1.5rem,1.7vw,2.6rem)] fs-xs" />
                <span className="flex-1">{f.q}</span>
                <span aria-hidden="true" className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-green-100 text-green-700 transition-colors group-open:bg-green-700 group-open:text-white lg:h-[clamp(1.75rem,1.9vw,2.8rem)] lg:w-[clamp(1.75rem,1.9vw,2.8rem)]">
                  <span className="absolute h-[2px] w-3 rounded bg-current" />
                  <span className="absolute h-3 w-[2px] rounded bg-current transition-transform group-open:scale-y-0" />
                </span>
              </summary>
              <p className="pb-4 pl-[3.5rem] pr-5 text-[0.92rem] leading-relaxed text-body sm:pl-[3.75rem] lg:pl-[calc(1.5vw+clamp(1.5rem,1.7vw,2.6rem)+1vw)] lg:pr-[4.5vw] fs-sm">{f.a}</p>
            </details>
          ))}
        </div>
        {/* (photo collage and its green squares removed, owner 6 Oct 2026) */}
      </div>
    </section>
  );
}
