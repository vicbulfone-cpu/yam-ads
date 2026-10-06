import type { ReactNode } from "react";
import Link from "next/link";
import { QUESTIONNAIRE_URL } from "@/config/site.config";

const ArrowRight = () => (
  <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-[1.1em] w-[1.1em]">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/**
 * Full-width navy "Ready to meet your accountant?" bar, optionally with the "Start My Match" button.
 * Used twice in the home page's "How it works" / "Meet your accountant match" section, and once straight under the
 * hero photo (owner, 6 Oct 2026). 3mm more space inside at the top and bottom, margins unchanged (owner, 6 Oct 2026).
 * `hero`: laptops/desktops line the words up with the hero's headline column (the match box overlaps the bar's right
 * side); `words` then replaces the bar's words (the hero bar has its own, owner 6 Oct 2026).
 */
export default function StartBar({
  button = true, buttonOnPhone = true, hero = false, className = "", words, title = "Ready to meet your accountant?", startHref = QUESTIONNAIRE_URL,
}: { /** where Start goes (ad pages: their own match box) */ startHref?: string; button?: boolean; /** false hides the button below laptop width (owner, 6 Oct 2026: home "Ready to meet" bar) */ buttonOnPhone?: boolean; hero?: boolean; className?: string; words?: ReactNode; /** the bold words (owner, 6 Oct 2026: the bar under the tradie photo has its own) */ title?: string }) {
  const row = "flex flex-col items-center gap-4 text-center lg:flex-row lg:justify-center lg:gap-[3vw] lg:text-left";
  const content = (
    <>
      <p className="sb-title font-sans text-[1.6rem] font-extrabold leading-tight tracking-[-0.02em] text-white lg:text-[clamp(1.6rem,2.1vw,3.2rem)]">{title}</p>
      <span aria-hidden className="sb-div hidden h-[2.6vw] w-px bg-white/40 lg:block" />
      <p className="sb-sub text-[1.02rem] text-white/90 lg:text-[clamp(1rem,1.2vw,1.8rem)]">Your needs, your area, your accountant.</p>
      {button && (
        <Link href={startHref} className={`btn btn-primary min-w-[14rem] rounded-full px-8 text-[1.05rem] btn-fluid lg:min-w-[clamp(14rem,17vw,25rem)] ${buttonOnPhone ? "" : "max-lg:hidden"}`}>
          Start My Match <ArrowRight />
        </Link>
      )}
    </>
  );
  if (hero) {
    return (
      <div className={`bg-navy-900 px-6 py-[calc(1.75rem+3mm)] lg:px-0 lg:py-[calc(0.9vw+3mm)] ${className}`}>
        <div className="desk-hero-grid hero-bar-grid">
          <div className="hero-bar-words">{words ?? content}</div>
        </div>
      </div>
    );
  }
  return <div className={`${row} bg-navy-900 px-6 py-[calc(1.75rem+3mm)] lg:px-[3vw] lg:py-[calc(0.9vw+3mm)] ${className}`}>{content}</div>;
}
