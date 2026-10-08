/** A calm, single-sentence tagline band. Real text (not an image); never a heading. Wording lives in src/content/taglines.ts.
 *  `handwritten`: the line in green handwriting, the same style as "Real people. Local accountants." on the home page's
 *  tradie picture (How It Works page; owner, 8 Oct 2026). */
export default function Tagline({ text, handwritten = false }: { text: string | null; handwritten?: boolean }) {
  if (!text) return null;
  if (handwritten) {
    // no short green line above it, and the words 3cm higher than they were under that line (the line and its gap were
    // 22px; everything below moves up with them) (owner, 8 Oct 2026). It then overlaps the grey section above, so it
    // takes the same grey across the full width (no edge running under the words); below 768px it stops 20px short so it
    // clears the button above. Always on one line: on narrow screens the writing is drawn smaller so it fits (owner, 8 Oct 2026).
    return (
      <section aria-label="Tagline" className="bg-surface -mt-[calc(3cm-22px-20px)] md:-mt-[calc(3cm-22px)]">
        <div className="container-page py-10 md:py-14">
          <p className="-rotate-[2deg] text-center font-[family-name:var(--font-script)] whitespace-nowrap text-[min(4.3vw,1.9rem)] font-semibold leading-[1.1] text-green-700 sm:text-[min(4.3vw,2.3rem)] lg:text-[clamp(2.3rem,2.6vw,3rem)]">{text}</p>
        </div>
      </section>
    );
  }
  return (
    <section aria-label="Tagline" className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span aria-hidden className="mx-auto mb-5 block h-0.5 w-10 rounded-full bg-green-600/70" />
        <p className="font-serif text-xl font-medium italic leading-snug text-navy-900 md:text-2xl">{text}</p>
      </div>
    </section>
  );
}
