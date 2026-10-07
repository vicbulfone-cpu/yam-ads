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
      <svg aria-hidden viewBox="0 0 24 24" className="start-here-arrow" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M6 13l6 6 6-6" />
      </svg>
    </div>
  );
}
