import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { FAQ_ICONS, FAQ_MAP, HOME_EXTRA_FAQS } from "@/content/faq-teasers";

/**
 * Home page: the FAQ section.
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
 * Layout from the owner's "faq example" picture (hero section/ad landing pages, 6 Oct 2026): on laptops and desktops the
 * heading, the line under it and a large map illustration sit on the left behind a thin divider, and the questions run in
 * two columns on the right (five, then four). Each question is an open row: the owner's icon (transparent background, scripts/faq-icons.mjs) | the question | a green
 * plus, with a thin line between rows. An open row turns mint, the plus becomes a minus and the answer shows under the
 * question. Tablets keep the two columns under the heading; phones show one column. Styles: ".faqx" in globals.css.
 * Every word is real text in the page (crawlable). The question and answer carry data-faq-question / data-faq-answer;
 * those two match the FAQPage structured data word for word (scripts/seo-audit.mjs checks them; the ninth comes from
 * HOME_EXTRA_FAQS, added to the structured data in src/lib/seo.ts).
 */
function FaqRow({ f, i }: { f: Faq; i: number }) {
  return (
    <details className="faqx-row" open={i === 0}>
      <summary className="faqx-sum">
        <Image src={FAQ_ICONS[i]} alt="" width={360} height={260} sizes="(min-width: 1024px) 9vw, 6rem" className="faqx-icon" />
        <span className="faqx-q" data-faq-question="">{f.q}</span>
        <span aria-hidden="true" className="faqx-plus">
          <span className="faqx-bar" />
          <span className="faqx-bar faqx-bar-v" />
        </span>
      </summary>
      <p className="faqx-a" data-faq-answer="">{f.a}</p>
    </details>
  );
}

export default function FAQSection() {
  const faqs = [...homeFaqs(), ...HOME_EXTRA_FAQS];
  const half = Math.ceil(faqs.length / 2);
  const cols = [faqs.slice(0, half), faqs.slice(half)];
  return (
    <section className="faqx bg-white">
      <div className="container-page home-wide faqx-grid">
        <div className="faqx-intro">
          <p className="faqx-eyebrow fs-eyebrow">
            Common questions
            <span aria-hidden="true" className="faqx-eyebrow-rule" />
          </p>
          <h2 className="faqx-h2">
            <span className="block text-navy-900">A few questions.</span>
            <span className="block text-green-700">Clear answers.</span>
          </h2>
          <p className="faqx-sub">Everything you need to know about finding your accountant.</p>
          <Image src={FAQ_MAP} alt="" width={354} height={233} sizes="(min-width: 1024px) 22vw, 1px" className="faqx-map" />
        </div>

        <div className="faqx-cols">
          {cols.map((col, c) => (
            <div key={c} className="faqx-col">
              {col.map((f, j) => <FaqRow key={f.q} f={f} i={c * half + j} />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
