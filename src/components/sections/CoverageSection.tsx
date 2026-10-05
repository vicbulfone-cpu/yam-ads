import Link from "next/link";

/**
 * Home page: "Connecting Australians with local accountants".
 * Owner rule: only the site's 13 city pages are shown (no other towns); "Regional Australia" is plain text, not a link.
 */

const rows: { label: string; places: { name: string; href?: string }[] }[] = [
  {
    label: "Capital cities",
    places: [
      { name: "Sydney", href: "/locations/sydney" },
      { name: "Melbourne", href: "/locations/melbourne" },
      { name: "Brisbane", href: "/locations/brisbane" },
      { name: "Perth", href: "/locations/perth" },
      { name: "Adelaide", href: "/locations/adelaide" },
      { name: "Hobart", href: "/locations/hobart" },
      { name: "Canberra", href: "/locations/canberra-queanbeyan" },
      { name: "Darwin", href: "/locations/darwin" },
    ],
  },
  {
    label: "Regional centres",
    places: [
      { name: "Gold Coast", href: "/locations/gold-coast" },
      { name: "Newcastle", href: "/locations/newcastle-maitland" },
      { name: "Sunshine Coast", href: "/locations/sunshine-coast" },
      { name: "Geelong", href: "/locations/geelong" },
      { name: "Launceston", href: "/locations/launceston" },
      { name: "Regional Australia" },
    ],
  },
];

const Pin = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="shrink-0 text-green-600">
    <path fill="currentColor" d="M12 2a7.5 7.5 0 0 0-7.5 7.5C4.5 15 12 22 12 22s7.5-7 7.5-12.5A7.5 7.5 0 0 0 12 2zm0 10.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z" />
  </svg>
);

export default function CoverageSection() {
  return (
    <section className="bg-[#eaf8ef] py-16 md:py-20">
      <div className="container-page">
        <p className="inline-flex rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-green-700">Our coverage</p>
        <h2 className="mt-4 text-[1.85rem] leading-[1.1]! text-navy-900 sm:text-[2.1rem] lg:text-[2.3rem]">
          Connecting Australians <span className="text-green-700">with local accountants</span>
        </h2>
        <p className="mt-3 text-[1rem] text-navy-900/85">From capital cities to regional communities, tell us your area and what you need.</p>

        <div className="mt-8 space-y-6">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-3 md:grid-cols-[11rem_1fr] md:items-start">
              <p className="flex items-center gap-2.5 pt-2 text-[1.05rem] font-extrabold text-navy-900">
                <Pin size={24} /> {r.label}
              </p>
              <ul className="flex flex-wrap gap-2.5 md:gap-3">
                {r.places.map((p) => (
                  <li key={p.name}>
                    {p.href ? (
                      <Link
                        href={p.href}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[0.88rem] font-medium text-navy-900 shadow-[0_2px_8px_-3px_rgba(7,50,101,0.18)] transition hover:text-green-700 hoverable:hover:-translate-y-0.5"
                      >
                        <Pin /> {p.name}
                      </Link>
                    ) : (
                      <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[0.88rem] font-medium text-navy-900 shadow-[0_2px_8px_-3px_rgba(7,50,101,0.18)]">
                        <Pin /> {p.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-7 text-[0.88rem] text-navy-900/80">
          One local accountant per area. Your enquiry is sent to your matched accountant, and your details are never sold or distributed to multiple firms.
        </p>
        <Link
          href="/locations"
          className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full border-[1.5px] border-green-600 bg-white px-7 text-[0.95rem] font-bold text-navy-900 transition hover:bg-green-50"
        >
          View all locations
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-green-700"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    </section>
  );
}
