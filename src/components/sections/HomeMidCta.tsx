import Link from "next/link";
import { QUESTIONNAIRE_URL } from "@/config/site.config";

/**
 * Home page: mid-page call to action band (navy into green) between the client cards and the services list.
 * The band runs the full width of the screen; the icon, the words and the button are spread evenly across it.
 */
export default function HomeMidCta() {
  return (
    <section className="bg-[linear-gradient(100deg,#0a3a7c_0%,#0b4583_45%,#0b6b6a_75%,#0f9a4a_100%)]">
      <div className="flex flex-col items-center gap-6 px-6 py-9 text-center md:flex-row md:justify-evenly md:gap-8 md:px-[3vw] md:py-[clamp(2.25rem,2.6vw,3.75rem)] md:text-left">
        <span aria-hidden="true" className="grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-full bg-[#14806a] lg:h-[clamp(4.5rem,5vw,7rem)] lg:w-[clamp(4.5rem,5vw,7rem)]">
          <svg viewBox="0 0 24 24" fill="#fff" className="h-[52%] w-[52%]">
            <circle cx="12" cy="7" r="3.2" />
            <circle cx="5.6" cy="8.6" r="2.4" />
            <circle cx="18.4" cy="8.6" r="2.4" />
            <path d="M6.2 19.5c0-3.6 2.6-6.3 5.8-6.3s5.8 2.7 5.8 6.3z" />
            <path d="M1.5 18.5c0-2.8 1.7-4.8 4.1-4.8.9 0 1.6.2 2.3.7-1.3 1.2-2.1 2.9-2.3 4.9H1.5zM22.5 18.5c0-2.8-1.7-4.8-4.1-4.8-.9 0-1.6.2-2.3.7 1.3 1.2 2.1 2.9 2.3 4.9h4.1z" />
          </svg>
        </span>
        <div>
          <p className="text-[1.5rem] font-extrabold leading-tight tracking-tight text-white md:text-[1.9rem] lg:text-[clamp(1.9rem,2.3vw,3.4rem)]">Ready to find your accountant?</p>
          <p className="mt-2 text-[0.98rem] text-white/90 fs-body">
            It only takes <strong className="font-bold text-white">60 seconds.</strong> Free and no obligation.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Link
            href={QUESTIONNAIRE_URL}
            className="inline-flex min-h-14 items-center gap-4 rounded-full bg-white py-2 pl-9 pr-2.5 text-[1.05rem] font-bold text-green-700 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] transition hover:-translate-y-0.5 lg:min-h-[clamp(3.5rem,3.9vw,5.5rem)] lg:pl-[clamp(2.25rem,2.4vw,3.4rem)] lg:text-[clamp(1.05rem,1.25vw,1.8rem)]"
          >
            Find my Match
            <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-green-600 text-white lg:h-[clamp(2.5rem,2.8vw,4rem)] lg:w-[clamp(2.5rem,2.8vw,4rem)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-[45%] w-[45%]"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
          <p className="text-[0.78rem] text-white/85 fs-xs">Australia-wide &middot; Local accountants &middot; No lists</p>
        </div>
      </div>
    </section>
  );
}
