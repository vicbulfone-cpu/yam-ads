import { START_HERE as S } from "@/content/start-here";
import { Check } from "./Icons";

/**
 * The panel beside the match box in every match box popup (owner, 7 Oct 2026; laid out as the owner's "match new"
 * picture): a large headline with "60 seconds" in green italics and a soft underline, the line under it and three ticked
 * points. Owner, 8 Oct 2026: the "Start here" label, the handwritten "Let's get started" and the arrows are removed, and
 * the panel is centred on the box. Tablets show a slimmer version above the box; phones keep the popup as before.
 * Styles: ".start-here" in globals.css.
 */
export default function StartHere() {
  return (
    <div className="start-here">
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
    </div>
  );
}
