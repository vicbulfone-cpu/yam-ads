import Image from "next/image";
import Link from "next/link";
import { QUESTIONNAIRE_URL } from "@/config/site.config";

/**
 * Home page closing call to action: a full-width navy band with a coastal photo blended into the right side; the words stay centred.
 * The button points at the questionnaire (the questionnaire popup intercepts the click).
 */
export default function HomeClosingCta() {
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
          <h2 id="home-closing-cta" className="text-[1.65rem] leading-tight! text-white! sm:text-[2rem] lg:text-[clamp(2rem,2.4vw,3.6rem)]">
            Ready to find your accountant?
          </h2>
          <p className="mt-2 text-base text-white/90 sm:text-[1.1rem] fs-lead">Your needs. Your area. Your accountant.</p>
          <Link href={QUESTIONNAIRE_URL} className="btn btn-primary mt-6 min-w-[17rem] rounded-full px-8 text-base btn-fluid lg:min-w-[clamp(17rem,19vw,27rem)]">
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
