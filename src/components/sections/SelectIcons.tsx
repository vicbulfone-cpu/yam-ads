/**
 * "Vetted partner network" check icons (owner, 7 Oct 2026): seven new line icons, none used elsewhere on the site, in the
 * tile's own colour (currentColor) with a light tint. On desktops each one animates once as the grid scrolls into view and
 * again on hover (styles: ".si-" in globals.css; reveal: WimReveal.tsx).
 */
const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
const tint = { fill: "currentColor", fillOpacity: 0.1, stroke: "none" };

export const SELECT_ICONS = [
  // 1 identity: ID card with a photo, a scan line sweeps down it
  <svg key="id" {...svg} className="sel-icon si si-id">
    <rect x="2.5" y="5" width="19" height="14" rx="2.2" {...tint} />
    <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
    <circle cx="8.3" cy="10.6" r="2.1" />
    <path d="M5.2 16.2c.6-1.7 1.7-2.6 3.1-2.6s2.5.9 3.1 2.6" />
    <path d="M14 10h4.5M14 13h4.5M14 16h2.8" />
    <path className="si-scan" d="M3.6 6.4h16.8" strokeWidth="1.3" />
  </svg>,
  // 2 registrations and memberships: an award seal with ribbons
  <svg key="seal" {...svg} className="sel-icon si si-seal">
    <path className="si-ribbons" d="M9.2 14.4 7.6 21l4.4-2.3 4.4 2.3-1.6-6.6" />
    <g className="si-rosette">
      <path d="M12.00 3.30L13.35 4.48L15.10 4.13L15.68 5.82L17.37 6.40L17.02 8.15L18.20 9.50L17.02 10.85L17.37 12.60L15.68 13.18L15.10 14.87L13.35 14.52L12.00 15.70L10.65 14.52L8.90 14.87L8.32 13.18L6.63 12.60L6.98 10.85L5.80 9.50L6.98 8.15L6.63 6.40L8.32 5.82L8.90 4.13L10.65 4.48L12.00 3.30Z" {...tint} />
      <path d="M12.00 3.30L13.35 4.48L15.10 4.13L15.68 5.82L17.37 6.40L17.02 8.15L18.20 9.50L17.02 10.85L17.37 12.60L15.68 13.18L15.10 14.87L13.35 14.52L12.00 15.70L10.65 14.52L8.90 14.87L8.32 13.18L6.63 12.60L6.98 10.85L5.80 9.50L6.98 8.15L6.63 6.40L8.32 5.82L8.90 4.13L10.65 4.48L12.00 3.30Z" />
      <circle cx="12" cy="9.5" r="2.6" />
    </g>
  </svg>,
  // 3 services and expertise: a target, the arrow flies into the bullseye
  <svg key="target" {...svg} className="sel-icon si si-target">
    <circle cx="11" cy="13" r="8.5" {...tint} />
    <circle className="si-ring" cx="11" cy="13" r="8.5" />
    <circle cx="11" cy="13" r="5" />
    <circle cx="11" cy="13" r="1.6" fill="currentColor" />
    <g className="si-arrow">
      <path d="M11 13 20.2 3.8" />
      <path d="M17.2 3.6h3.2v3.2" />
    </g>
  </svg>,
  // 4 service area: a folded map unfolds and a route draws across it
  <svg key="map" {...svg} className="sel-icon si si-map">
    <g className="si-map-sheet">
      <path d="M3 6.6 9 4.2l6 2.4 6-2.4v13.2l-6 2.4-6-2.4-6 2.4z" {...tint} />
      <path d="M3 6.6 9 4.2l6 2.4 6-2.4v13.2l-6 2.4-6-2.4-6 2.4z" />
      <path d="M9 4.2v13.2M15 6.6v13.2" />
    </g>
    <path className="si-route" pathLength={1} d="M5 15.5c1.6-2.4 3.4-.4 5-2.6s2.6-3.6 4.6-3.4 2.6-1.6 4-2" strokeDasharray="0.06 0.05" />
  </svg>,
  // 5 insurance: an umbrella opens, raindrops fall beside it
  <svg key="umbrella" {...svg} className="sel-icon si si-umbrella">
    <g className="si-canopy">
      <path d="M3 12a9 9 0 0 1 18 0c-1.5-1.3-3-1.3-4.5 0-1.5-1.3-3-1.3-4.5 0-1.5-1.3-3-1.3-4.5 0-1.5-1.3-3-1.3-4.5 0z" {...tint} />
      <path d="M3 12a9 9 0 0 1 18 0c-1.5-1.3-3-1.3-4.5 0-1.5-1.3-3-1.3-4.5 0-1.5-1.3-3-1.3-4.5 0-1.5-1.3-3-1.3-4.5 0z" />
    </g>
    <path d="M12 3V2M12 12v6.5a2 2 0 0 1-4 0" />
    <path className="si-drop" style={{ "--k": 0 } as React.CSSProperties} d="M3.5 15.5v1.6" />
    <path className="si-drop" style={{ "--k": 1 } as React.CSSProperties} d="M20.5 15v1.6" />
    <path className="si-drop" style={{ "--k": 2 } as React.CSSProperties} d="M17 17v1.6" />
  </svg>,
  // 6 periodic reviews: circular arrows turn, a tick draws in the middle
  <svg key="review" {...svg} className="sel-icon si si-review">
    <circle cx="12" cy="12" r="8" {...tint} />
    <g className="si-cycle">
      <path d="M20 12a8 8 0 0 1-14.2 5" />
      <path d="M5.6 20.2v-3.4H9" />
      <path d="M4 12a8 8 0 0 1 14.2-5" />
      <path d="M18.4 3.8v3.4H15" />
    </g>
    <path className="si-tick" pathLength={1} d="m8.8 12.2 2.2 2.2 4.2-4.4" />
  </svg>,
  // 7 customer concerns: a chat bubble with typing dots
  <svg key="chat" {...svg} className="sel-icon si si-chat">
    <path d="M5 4.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7.5L7 21v-3.5H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" {...tint} />
    <path d="M5 4.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7.5L7 21v-3.5H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" />
    <circle className="si-dot" style={{ "--k": 0 } as React.CSSProperties} cx="8" cy="11" r="1.15" fill="currentColor" stroke="none" />
    <circle className="si-dot" style={{ "--k": 1 } as React.CSSProperties} cx="12" cy="11" r="1.15" fill="currentColor" stroke="none" />
    <circle className="si-dot" style={{ "--k": 2 } as React.CSSProperties} cx="16" cy="11" r="1.15" fill="currentColor" stroke="none" />
  </svg>,
];
