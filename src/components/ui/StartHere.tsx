import { START_HERE as S } from "@/content/start-here";
import { Check } from "./Icons";

/**
 * The "Start here" panel beside the match box in every match box popup (owner, 7 Oct 2026; laid out as the owner's
 * "match new" picture): label, a large serif headline with "60 seconds" in green italics and a soft underline, the line
 * under it, three ticked points, and a handwritten "Let's get started" with a curved arrow towards the box.
 * Tablets show a slimmer version above the box (headline, line and a down arrow); phones keep the popup as before.
 * Styles: ".start-here" in globals.css.
 */
/** Laptops/desktops (owner, 7 Oct 2026): the "Start here" pill sits in the middle of the popup's top bar, directly above
 *  the match box (FitBox.tsx sets its position); the panel's own pill is shown on tablets only. */
export function StartHerePill() {
  return (
    <p className="start-here-pill" aria-hidden>
      <span className="start-here-dot" />
      {S.label}
    </p>
  );
}

export default function StartHere() {
  return (
    <div className="start-here">
      <p className="start-here-label">
        <span aria-hidden className="start-here-dot" />
        {S.label}
      </p>
      <p className="start-here-title">
        {S.title.before}
        <em>
          {S.title.em}
          <svg aria-hidden viewBox="0 0 200 14" preserveAspectRatio="none" className="start-here-swoosh"><path d="M3 9C55 3 140 2 197 7" /></svg>
        </em>
        {S.title.after}
      </p>
      <p className="start-here-line">{S.line}</p>
      <ul className="start-here-points">
        {S.points.map((p) => (
          <li key={p.title}>
            <span aria-hidden className="start-here-tick"><Check width={15} height={15} strokeWidth={3.2} /></span>
            <span><strong>{p.title}</strong><span>{p.text}</span></span>
          </li>
        ))}
      </ul>
      <p className="start-here-go" aria-hidden>
        <span className="start-here-script">{S.script}</span>
        <svg viewBox="0 0 120 70" className="start-here-arrow is-right" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 60C42 64 84 52 112 12" />
          <path d="M96 17.5 112 12 113.5 29" />
        </svg>
      </p>
      <svg aria-hidden viewBox="0 0 70 90" className="start-here-arrow is-down" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6C6 34 22 62 46 80" />
        <path d="M38.9 63.4 46 80 28.1 77.8" />
      </svg>
    </div>
  );
}
