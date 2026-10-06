import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { FAQ_ICONS, FAQ_TEASERS, HOME_EXTRA_FAQS } from "@/content/faq-teasers";

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
 * Layout from the owner's "faq example" picture (6 Oct 2026), condensed: the heading is styled like the other home
 * sections' intros ("How it works" / "Meet your accountant match": eyebrow with a rule after it, two-line heading,
 * the line beside it behind a divider), then nine smaller cards, three per row on laptops and desktops (two on
 * tablets, one on phones). Each card: round icon, mint number badge, the question, a short line under it and a round
 * plus that turns into a green minus when the answer is open. Styles: ".faq8" in globals.css.
 * The number and the short line are drawn by CSS (::before), so each card's text is exactly the question and answer
 * in the FAQPage structured data (the ninth comes from HOME_EXTRA_FAQS, added to the structured data in src/lib/seo.ts).
 */
function FaqCard({ f, i }: { f: Faq; i: number }) {
  return (
    <details className="faq8-card group">
      <summary className="faq8-sum">
        <Image src={FAQ_ICONS[i]} alt="" width={118} height={118} className="faq8-icon" />
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
  const faqs = [...homeFaqs(), ...HOME_EXTRA_FAQS];
  return (
    <section className="bg-white py-12 md:py-14 lg:py-[clamp(3.5rem,4vw,6rem)]">
      <div className="container-page home-wide">
        <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-[4vw]">
          <div>
            <p className="flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700 fs-eyebrow">
              Common questions
              <span aria-hidden="true" className="h-px w-16 bg-green-700 lg:w-[clamp(4rem,6vw,9rem)]" />
            </p>
            <h2 className="mt-2 font-sans text-[2.1rem] font-extrabold leading-[1.02]! tracking-[-0.04em] sm:text-[2.6rem] lg:text-[clamp(2.6rem,3.75vw,5.7rem)]">
              <span className="block text-navy-900">Frequently Asked</span>
              <span className="block text-green-700">Questions</span>
            </h2>
          </div>
          <p className="text-[1.05rem] leading-snug text-navy-900/85 lg:mt-[1.2vw] lg:self-start lg:border-l lg:border-navy-900/25 lg:py-[0.4vw] lg:pl-[3.5vw] lg:text-[clamp(1.05rem,1.3vw,1.95rem)]">
            Answers to common questions about finding your accountant.
          </p>
        </div>

        <div className="faq8">
          {faqs.map((f, i) => <FaqCard key={f.q} f={f} i={i} />)}
        </div>
        {/* (photo collage and its green squares removed, owner 6 Oct 2026) */}
      </div>
    </section>
  );
}