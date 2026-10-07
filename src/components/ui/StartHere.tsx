import { START_HERE as S } from "@/content/start-here";

/**
 * The "Start here" message above the match box in the match box popups (home page and ad pages; owner, 7 Oct 2026).
 * Tablets and desktops only: phones keep the popup exactly as before. Styles: ".start-here" in globals.css.
 */
export default function StartHere() {
  return (
    <div className="start-here">
      <p className="start-here-label">
        <span aria-hidden className="start-here-dot" />
        {S.label}
      </p>
      <p className="start-here-title">
        {S.title.before}<em>{S.title.em}</em>{S.title.after}
      </p>
      <p className="start-here-line">{S.line}</p>
      {/* a hand-drawn style curved arrow sweeping towards the match box (owner, 7 Oct 2026): to the right beside the box on
          laptops/desktops, down onto it on tablets */}
      <svg aria-hidden viewBox="0 0 160 70" className="start-here-arrow is-right" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 52C40 62 92 58 140 26" />
        <path d="M122 27.2 140 26 132 42.1" />
      </svg>
      <svg aria-hidden viewBox="0 0 70 90" className="start-here-arrow is-down" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6C6 34 22 62 46 80" />
        <path d="M38.9 63.4 46 80 28.1 77.8" />
      </svg>
    </div>
  );
}
