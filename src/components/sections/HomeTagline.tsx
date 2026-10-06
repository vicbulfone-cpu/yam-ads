/**
 * Home page tagline line above the closing call to action.
 * The first sentence is navy, the rest green (split at the first ". ").
 */
export default function HomeTagline({ text }: { text: string }) {
  const cut = text.indexOf(". ");
  const first = cut === -1 ? text : text.slice(0, cut + 1);
  const rest = cut === -1 ? "" : text.slice(cut + 2);
  return (
    // the same white space below the line as above it (owner, 6 Oct 2026)
    <div className="container-page py-14 md:py-16">
      <p className="text-balance text-center font-sans text-[1.45rem] font-extrabold leading-tight tracking-tight text-navy-900 sm:text-[1.75rem] lg:text-[2rem]">
        {first}
        {rest && <> <span className="text-green-700">{rest}</span></>}
      </p>
    </div>
  );
}
