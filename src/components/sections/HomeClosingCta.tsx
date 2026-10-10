import Image from "next/image";
import Link from "next/link";
import { QUESTIONNAIRE_URL } from "@/config/site.config";

/**
 * Home page closing call to action: a full-width navy band with a coastal photo blended into the right side; the words stay centred.
 * The button points at the questionnaire (the questionnaire popup intercepts the click).
 * `tagline` ("One quick match. A year of better tax outcomes.") sits at the top of the band, above the heading (owner,
 * 6 Oct 2026; it used to be its own line on white above the band): first sentence white, the rest bright green, both
 * easy to read on the navy.
 */
export default function HomeClosingCta({ tagline, startHref = QUESTIONNAIRE_URL }: { tagline?: string; /** ad pages: their own match box */ startHref?: string }) {
  const cut = tagline ? tagline.indexOf(". ") : -1;
  const first = tagline && cut !== -1 ? tagline.slice(0, cut + 1) : tagline;
  const rest = tagline && cut !== -1 ? tagline.slice(cut + 2) : "";
  return (
    <section aria-labelledby="home-closing-cta">
      <div className="relative isolate overflow-hidden bg-navy-900">
        {/* photo: full width on phones (heavily tinted), blended into the right side from tablet up */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/home/coast.webp"
            alt="Rugged Australian coastline meeting a deep blue ocean"
            fill
            sizes="100vw"
            className="object-cover object-[80%_50%] opacity-90"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,50,101,.97)_0%,rgba(7,50,101,.85)_38%,rgba(7,50,101,.45)_70%,rgba(7,50,101,.3)_100%)]"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,50,101,.25)_0%,rgba(7,50,101,0)_40%,rgba(7,50,101,.3)_100%)]" />
        </div>

        <div className="flex flex-col items-center px-6 py-10 text-center md:py-[clamp(2.75rem,3.6vw,5rem)]">
          {tagline && (
            <>
              <p className="text-balance font-sans text-[1.3rem] font-extrabold leading-tight tracking-tight text-white [text-shadow:0_2px_12px_rgba(4,24,52,0.55)] sm:text-[1.6rem] lg:text-[clamp(1.6rem,1.9vw,2.8rem)]">
                {first}
                {rest && <> <span className="text-[#4ee28f] max-sm:block">{rest}</span></>}
              </p>
              {/* the short green line under the tagline removed, site wide (owner, 10 Oct 2026, noc); its space is kept so
                  the heading below stays where it was */}
              <span aria-hidden className="mb-6 mt-5 block h-[3px] lg:mb-[1.6vw] lg:mt-[1.3vw]" />
            </>
          )}
          <h2 id="home-closing-cta" className="text-[1.65rem] leading-tight! text-white! sm:text-[2rem] lg:text-[clamp(2rem,2.4vw,3.6rem)]">
            Ready to find your accountant?
          </h2>
          <p className="mt-2 text-base text-white/90 sm:text-[1.1rem] fs-lead">Your needs. Your area. Your accountant.</p>
          <Link href={startHref} className="btn btn-primary mt-6 min-w-[17rem] rounded-full px-8 text-base btn-fluid lg:min-w-[clamp(17rem,19vw,27rem)]">
            Match Me Now
            <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <p className="mt-4 text-[0.8rem] font-semibold text-white/85 fs-xs">60 seconds • Free and no obligation</p>
        </div>
      </div>
    </section>
  );
}
