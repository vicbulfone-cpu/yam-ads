import { cityOf, typeOf } from "@/lib/pages";

const CITY_NAMES: Record<string, string> = {
  "newcastle-maitland": "Newcastle–Maitland",
  "gold-coast": "Gold Coast",
  "sunshine-coast": "Sunshine Coast",
  "canberra-queanbeyan": "Canberra–Queanbeyan",
};

const UPPER_TERMS = new Set(["abn", "bas", "cpa", "gst", "smsf", "xero", "myob", "ato"]);

function serviceName(path: string) {
  return path
    .replace(/^\/accountant\//, "")
    .split("-")
    .map((word) => UPPER_TERMS.has(word) ? word.toUpperCase() : word)
    .join(" ");
}

export default function QuickAnswer({ path }: { path: string }) {
  const type = typeOf(path);
  if (type !== "service" && type !== "city") return null;

  const citySlug = cityOf(path);
  const city = citySlug && (CITY_NAMES[citySlug] ?? citySlug.charAt(0).toUpperCase() + citySlug.slice(1));
  const question = type === "city"
    ? `How do I find an accountant in ${city}?`
    : `How can I find a local ${serviceName(path)} near me?`;

  return (
    <section className="container-page py-5 md:py-7" aria-label="Quick answer">
      <aside className="mx-auto max-w-5xl rounded-2xl border border-[#eadfce] bg-[linear-gradient(120deg,#fffaf2,#fff_58%,#f2faf4)] px-5 py-5 shadow-[0_8px_28px_rgba(7,50,101,.06)] md:px-7 md:py-6">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-green-800">Quick answer</p>
        <p className="mt-2 font-semibold leading-snug text-ink">{question}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-body md:text-base">
          Share your postcode and the accounting services you need. We use your location and requirements to match you with one of our partner accountants serving your area.
        </p>
      </aside>
    </section>
  );
}
