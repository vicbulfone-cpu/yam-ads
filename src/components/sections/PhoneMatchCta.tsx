import { ArrowRight } from "../ui/Icons";

/**
 * Phones only (owner's "mobile look example" picture, 8 Oct 2026): a large green button straight under the hero
 * headline that takes the visitor down to the hero's match box, with the box's own note under it. The label is the
 * match box's own Start label. Hidden from tablet width up. Used on the home page (DeskHero.tsx) and all four ad pages.
 * Styles: ".rz-cta" in ads.css (first made for Ad 4).
 */
export default function PhoneMatchCta({ href, label, note }: { href: string; label: string; note: string[] }) {
  return (
    <div className="rz-cta">
      <a href={href} className={`rz-cta-btn${label.length > 16 ? " is-long" : ""}`}>
        <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className="rz-cta-icon">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" />
        </svg>
        <span>{label}</span>
        <ArrowRight aria-hidden className="rz-cta-arrow" strokeWidth={2.6} />
      </a>
      <p className="rz-cta-note">{note.join(" • ")}</p>
    </div>
  );
}
