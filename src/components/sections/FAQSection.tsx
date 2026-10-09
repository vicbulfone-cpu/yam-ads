import fs from "node:fs";
import path from "node:path";
import { HOME_EXTRA_FAQS } from "@/content/faq-teasers";

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
 * Layout: on laptops and desktops the heading and the line under it sit on the left behind a thin divider, and the
 * questions run in two columns on the right (five, then four). Each question is a box exactly like the home page's
 * "Vetted partner network" section (owner, 6 Oct 2026; HomeSelection.tsx, ".sel-" styles in globals.css): a soft-filled
 * box with no border and no icon, the question in green and a plus; open, it turns mint, the plus becomes a minus and the
 * answer shows. Every question starts closed on every visit (owner, 6 Oct 2026; data-faq + FaqReset.tsx). Tablets keep the two columns under the heading; phones show one column. Section styles: ".faqx" in globals.css.
 * Every word is real text in the page (crawlable). The question and answer carry data-faq-question / data-faq-answer;
 * those two match the FAQPage structured data word for word (scripts/seo-audit.mjs checks them; the ninth comes from
 * HOME_EXTRA_FAQS, added to the structured data in src/lib/seo.ts).
 */
function FaqRow({ f, extra }: { f: Faq; extra?: boolean }) {
  // a page's own extra questions are not in the home FAQPage structured data, so they carry no data-faq-question/answer markers
  const markQ = extra ? {} : { "data-faq-question": "" };
  const markA = extra ? {} : { "data-faq-answer": "" };
  return (
    <details className="sel-box" data-faq="">
      <summary className="sel-sum">
        <span className="sel-q" {...markQ}>{f.q}</span>
        <span aria-hidden="true" className="sel-plus">
          <span className="sel-bar" />
          <span className="sel-bar sel-bar-v" />
        </span>
      </summary>
      <p className="sel-a" {...markA}>{f.a}</p>
    </details>
  );
}

/** extra: a page's own questions added after the shared ones (e.g. /ad-2's personal tax questions); a question
 *  already in the list is skipped so nothing shows twice */
export default function FAQSection({ extra = [] }: { extra?: Faq[] }) {
  const shared = [...homeFaqs(), ...HOME_EXTRA_FAQS];
  const key = (f: Faq) => f.q.trim().toLowerCase();
  const seen = new Set(shared.map(key));
  const own = extra.filter((f) => !seen.has(key(f)) && !!seen.add(key(f)));
  const ownQs = new Set(own.map((f) => f.q));
  const faqs = [...shared, ...own];
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
        </div>

        <div className="sel-right">
          <div className="sel-cols">
          {cols.map((col, c) => (
            <div key={c} className="sel-col">
              {col.map((f) => <FaqRow key={f.q} f={f} extra={ownQs.has(f.q)} />)}
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
