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

export default function FAQSection() {
  const faqs = homeFaqs();
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-page home-wide">
        <div>
          <p className="inline-flex rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-green-700 fs-eyebrow">Common questions</p>
          <h2 className="mt-4 text-[1.85rem] leading-[1.1]! text-navy-900 sm:text-[2.1rem] lg:text-[2.3rem] fs-h2">
            Frequently Asked <span className="text-green-700">Questions</span>
          </h2>
          <p className="mt-3 text-[1rem] text-navy-900/85 fs-lead">Answers to common questions about finding your accountant.</p>

          <div className="mt-7 space-y-2.5 lg:mt-[2vw] lg:space-y-[0.75vw]">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-green-200 bg-white transition-colors open:border-green-600/50 open:shadow-[0_10px_24px_-16px_rgba(7,50,101,0.3)]">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-2.5 text-[0.95rem] font-bold lg:min-h-[clamp(3rem,3.4vw,5rem)] lg:px-[1.4vw] fs-body text-navy-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="relative h-4 w-4 shrink-0 text-green-600">
                    <span className="absolute left-0 top-1/2 h-[2.5px] w-4 -translate-y-1/2 rounded bg-current" />
                    <span className="absolute left-1/2 top-0 h-4 w-[2.5px] -translate-x-1/2 rounded bg-current transition-transform group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="px-5 pb-4 text-[0.92rem] leading-relaxed text-body lg:px-[1.4vw] fs-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        {/* (photo collage and its green squares removed, owner 6 Oct 2026) */}
      </div>
    </section>
  );
}
