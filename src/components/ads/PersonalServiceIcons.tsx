// The six round icons on /ad-2's "Personal Tax Services" cards (owner, 9 Oct 2026): the owner's pictures in
// "hero section/ad landing pages/personal tax/r" (one per card, named after it) redrawn as SVG (same shapes and green,
// measured off the 1024px originals) so their parts can move. Animation in the "Why it matters" style (".psi-" in
// ads.css): person nods, screen brackets open, house rises as its roof draws, chart bars grow and the trend line draws,
// briefcase lifts and its clasp clicks, gear turns.

const GREEN = "#087b12";

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="psi">
      <circle cx="50" cy="50" r="50" fill={GREEN} />
      {children}
    </svg>
  );
}

/** individual_tax_returns.png */
export function PersonIcon() {
  return (
    <Base>
      <g className="psi-person">
        <path className="psi-body" d="M28 76.5Q25.5 76.5 25.5 74V67.2C25.5 53.5 36.5 44.8 50 44.8C63.5 44.8 74.5 53.5 74.5 67.2V74Q74.5 76.5 72 76.5Z" fill="#fff" />
        <circle className="psi-head" cx="50" cy="36.4" r="13" fill="#fff" />
      </g>
    </Base>
  );
}

/** tax_deductions.png */
export function ScreenIcon() {
  return (
    <Base>
      <rect x="19.9" y="26" width="60.3" height="43.7" rx="5" fill="none" stroke="#fff" strokeWidth="5.2" />
      <rect x="47.4" y="72" width="5.2" height="5" fill="#fff" />
      <path d="M40.5 79.2H59.6" stroke="#fff" strokeWidth="5.2" strokeLinecap="round" />
      <path className="psi-code-l" d="M39.6 39.7L30.8 47.8L39.6 56.5" fill="none" stroke="#fff" strokeWidth="5.1" strokeLinecap="round" strokeLinejoin="round" />
      <path className="psi-code-r" d="M60.4 39.7L69.2 47.8L60.4 56.5" fill="none" stroke="#fff" strokeWidth="5.1" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

/** rental_property_tax.png */
export function HouseIcon() {
  return (
    <Base>
      <g className="psi-house">
        <path d="M27.1 44V78.1H73V44" fill="none" stroke="#fff" strokeWidth="5.2" strokeLinejoin="round" />
        <rect x="33.4" y="54.1" width="7.3" height="8.4" fill="#fff" />
        <rect x="44.9" y="57.3" width="12.4" height="20.8" fill="#fff" />
      </g>
      <path className="psi-roof" pathLength={1} d="M17.8 48.8L50 22.4L82.2 48.8" fill="none" stroke="#fff" strokeWidth="5.3" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

/** investments_shares.png */
export function ChartIcon() {
  const bars: [number, number][] = [[18.8, 58.4], [35.5, 48.9], [52.1, 40.7], [68.8, 31.2]];
  return (
    <Base>
      {bars.map(([x, y], i) => (
        <rect key={x} className="psi-bar" style={{ "--b": i } as React.CSSProperties} x={x} y={y} width="8.3" height={81.3 - y} rx="4.15" fill="#fff" />
      ))}
      <path className="psi-trend" pathLength={1} d="M20.9 51.1L40.7 35.6L54.9 45.3L75.8 25.4" fill="none" stroke="#fff" strokeWidth="5.3" strokeLinecap="round" strokeLinejoin="round" />
      <path className="psi-trend-head" d="M66.7 19.7H79.1V32.4" fill="none" stroke="#fff" strokeWidth="5.3" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

/** contractor_freelance_income.png */
export function BriefcaseIcon() {
  return (
    <Base>
      <g className="psi-case">
        <rect x="39.6" y="28.1" width="20.8" height="9.4" rx="1.5" fill="none" stroke="#fff" strokeWidth="5.2" />
        <rect x="19.9" y="37.5" width="60.3" height="41.7" rx="5" fill={GREEN} stroke="#fff" strokeWidth="5.2" />
        <path d="M19.8 53.9Q50 70.7 80.2 53.9" fill="none" stroke="#fff" strokeWidth="6" />
        <rect className="psi-clasp" x="44.9" y="54.2" width="10.3" height="5.8" rx="1" fill="#fff" />
      </g>
    </Base>
  );
}

/** complex_tax_returns.png: a document outline with three lines and a folded corner, a spoked gear over its lower
 *  right corner (cut out of it by a green disc). The gear turns. */
export function DocGearIcon() {
  const knobs: [number, number][] = [[76.4, 66.7], [73.56, 73.56], [66.7, 76.4], [59.84, 73.56], [57, 66.7], [59.84, 59.84], [66.7, 57], [73.56, 59.84]];
  return (
    <Base>
      <path d="M57.3 17.7H27.1V79.2H68.8V29Z" fill="none" stroke="#fff" strokeWidth="5.2" strokeLinejoin="round" />
      <path d="M57.3 17.7V31.2H68.8" fill="none" stroke="#fff" strokeWidth="5.2" strokeLinejoin="round" />
      <g stroke="#fff" strokeWidth="5.3" strokeLinecap="round">
        <path d="M35.5 42.7H58.4" /><path d="M35.5 53.2H52.1" /><path d="M35.5 63.5H48.8" />
      </g>
      <circle cx="66.7" cy="66.7" r="21.2" fill={GREEN} />
      <g className="psi-gear">
        <circle cx="66.7" cy="66.7" r="12.5" fill="none" stroke="#fff" strokeWidth="5.1" />
        <path d="M81.90 66.70L85.80 66.70M77.45 77.45L80.21 80.21M66.70 81.90L66.70 85.80M55.95 77.45L53.19 80.21M51.50 66.70L47.60 66.70M55.95 55.95L53.19 53.19M66.70 51.50L66.70 47.60M77.45 55.95L80.21 53.19" stroke="#fff" strokeWidth="5.1" strokeLinecap="round" />
        {knobs.map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r="2.2" fill="#fff" />)}
        <circle cx="66.7" cy="66.7" r="6.7" fill="#fff" />
        <circle cx="66.7" cy="66.7" r="1.6" fill={GREEN} />
      </g>
    </Base>
  );
}

/** card title -> icon (the owner's "r" folder, one picture per card, named after it) */
export const SERVICE_ICONS: Record<string, () => React.JSX.Element> = {
  "Individual Tax Returns": PersonIcon,
  "Tax Deductions": ScreenIcon,
  "Rental Property Tax": HouseIcon,
  "Investments & Shares": ChartIcon,
  "Contractor & Freelance Income": BriefcaseIcon,
  "More Complex Tax Returns": DocGearIcon,
};
