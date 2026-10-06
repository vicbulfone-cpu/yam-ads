import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { FAQ_ICONS, FAQ_TEASERS } from "@/content/faq-teasers";

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
 * Layout from the owner's "faq example" picture (6 Oct 2026): centred heading with a rule each side of the eyebrow,
 * then the eight questions as white cards in two columns (1–4 left, 5–8 right; one column on phones and tablets).
 * Each card: the owner's round icon, a mint number badge, the question, a short line under it and a round plus that
 * turns into a green minus when the answer is open. Styles: ".faq8" in globals.css.
 * The number and the short line are drawn by CSS (::before), so each card's text is exactly the question and answer
 * in the FAQPage structured data.
 */
function FaqCard({ f, i }: { f: Faq; i: number }) {
  return (
    <details className="faq8-card group">
      <summary className="faq8-sum">
        <Image src={FAQ_ICONS[i]} alt="" width={96} height={96} className="faq8-icon" />
        <span aria-hidden="true" className="faq8-num" />
        <span className="faq8-q">{f.q}</span>
        <span aria-hidden="true" className="faq8-teaser" data-teaser={FAQ_TEASERS[i]} />
        <span aria-hidden="true" className="faq8-plus">
          <span className="faq8-bar" />
          <span className="faq8-bar faq8-bar-v" />
        </span>
      </summary>
      <p className="faq8-a">{f.a}</p>
    </details>
  );
}

export default function FAQSection() {
  const faqs = homeFaqs();
  const half = Math.ceil(faqs.length / 2);
  return (
    <section className="bg-white py-12 md:py-14 lg:py-[clamp(3.5rem,4vw,6rem)]">
      <div className="container-page home-wide">
        <div className="text-center">
          <p className="inline-flex items-center gap-4 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-green-700 fs-eyebrow">
            <span aria-hidden="true" className="h-[2px] w-10 rounded-full bg-green-700 sm:w-14 lg:w-[clamp(3.5rem,4.5vw,7rem)]" />
            Common questions
            <span aria-hidden="true" className="h-[2px] w-10 rounded-full bg-green-700 sm:w-14 lg:w-[clamp(3.5rem,4.5vw,7rem)]" />
          </p>
          <h2 className="mt-3 font-sans text-[2.1rem] font-extrabold leading-[1.05]! tracking-[-0.04em] text-navy-900 sm:text-[2.6rem] lg:mt-[0.8vw] lg:text-[clamp(2.6rem,3.4vw,5.2rem)]">
            Frequently Asked <span className="text-green-700">Questions</span>
          </h2>
          <p className="mt-2 text-[1rem] text-navy-900/80 lg:mt-[0.5vw] lg:text-[clamp(1rem,1.3vw,1.95rem)]">Answers to common questions about finding your accountant.</p>
        </div>

        <div className="faq8">
          {[faqs.slice(0, half), faqs.slice(half)].map((col, c) => (
            <div key={c} className="faq8-col">
              {col.map((f, j) => <FaqCard key={f.q} f={f} i={c * half + j} />)}
            </div>
          ))}
        </div>
        {/* (photo collage and its green squares removed, owner 6 Oct 2026) */}
      </div>
    </section>
  );
}
