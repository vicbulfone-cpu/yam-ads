/**
 * Home page: "Connecting Australians with local accountants" (our coverage).
 * Laid out as the owner's "australia wide" picture (hero section/ad landing pages/australia wide.png, 6 Oct 2026):
 * a navy band; on the left the eyebrow, two-line heading, the line under it and two framed panels (capital cities,
 * regional centres) of place chips; on the right a large map of Australia with a green pin and "Australia wide";
 * a full-width rule, then the one-accountant-per-area note. Phones and tablets stack everything, map last.
 * None of the places has its own page on this site (the Melbourne page was removed, owner 6 Oct 2026), so none is a link.
 * Styles: ".cov-" in globals.css.
 */

const rows: { label: string; places: string[]; cols: 3 | 4 }[] = [
  { label: "Capital cities", places: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Hobart", "Canberra", "Darwin"], cols: 4 },
  { label: "Regional centres", places: ["Gold Coast", "Newcastle", "Sunshine Coast", "Geelong", "Launceston", "Regional Australia"], cols: 3 },
];

const Pin = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path fill="currentColor" d="M12 2a7.5 7.5 0 0 0-7.5 7.5C4.5 15 12 22 12 22s7.5-7 7.5-12.5A7.5 7.5 0 0 0 12 2zm0 10.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z" />
  </svg>
);

export default function CoverageSection() {
  return (
    <section className="cov">
      <div className="container-page home-wide">
        <div className="cov-grid">
          <div className="cov-main">
            <p className="cov-eyebrow">Our coverage</p>
            <h2 className="cov-h2">
              <span className="block">Connecting Australians</span>
              <span className="block cov-green">with local accountants</span>
            </h2>
            <p className="cov-lead">From capital cities to regional communities, tell us your area and what you need.</p>

            <div className="cov-panels">
              {rows.map((r) => (
                <div key={r.label} className="cov-panel">
                  <p className="cov-label">
                    <Pin className="cov-label-pin" /> {r.label}
                  </p>
                  <ul className={`cov-chips cov-cols-${r.cols}`}>
                    {r.places.map((p) => (
                      <li key={p} className="cov-chip">
                        <Pin className="cov-chip-pin" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* map of Australia (the match box's outline, drawn large) with a pin and "Australia wide" */}
          <div className="cov-map-wrap" aria-hidden="true">
            <span className="cov-map" />
            <span className="cov-map-mark">
              <Pin className="cov-map-pin" />
              <span className="cov-map-text">Australia wide</span>
            </span>
          </div>
        </div>

        <p className="cov-note">
          <strong>One local accountant per area.</strong> Your enquiry is sent to your matched accountant, and your details are never sold or distributed to multiple firms.
        </p>
      </div>
    </section>
  );
}
