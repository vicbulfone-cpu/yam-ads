/** A calm, single-sentence tagline band. Real text (not an image); never a heading. Wording lives in src/content/taglines.ts. */
export default function Tagline({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <section aria-label="Tagline" className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span aria-hidden className="mx-auto mb-5 block h-0.5 w-10 rounded-full bg-green-600/70" />
        <p className="font-serif text-xl font-medium italic leading-snug text-navy-900 md:text-2xl">{text}</p>
      </div>
    </section>
  );
}
