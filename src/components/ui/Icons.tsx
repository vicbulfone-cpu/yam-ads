// Small inline SVG icon set (no icon library: keeps the page light and fast).
import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...p,
});

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ArrowUp = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M12 19V5M6 11l6-6 6 6" /></svg>);
export const Check = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
export const Plus = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const Menu = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const Close = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const Pin = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);
export const Shield = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M12 3l8 3v6c0 4.6-3.2 8.2-8 9-4.8-.8-8-4.4-8-9V6l8-3z" /><path d="M8.5 12l2.5 2.5L15.5 10" /></svg>);
export const Users = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c.4-3.4 2.9-5.4 6-5.4s5.6 2 6 5.4" /><circle cx="17.5" cy="9" r="2.5" /><path d="M16.5 14.4c2.5.2 4.1 1.9 4.5 4.6" /></svg>);
export const Clock = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const Leaf = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" /><path d="M5 19c2-4 5-7 9-9" /></svg>);
export const ChevronDown = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>);
export const Search = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>);
export const Calendar = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>);
export const Doc = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></svg>);
export const Briefcase = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" /></svg>);
export const Coins = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><ellipse cx="9" cy="7" rx="5.5" ry="3" /><path d="M3.5 7v5c0 1.7 2.5 3 5.5 3M3.5 12v5c0 1.7 2.5 3 5.5 3 3 0 5.5-1.3 5.5-3" /><ellipse cx="16" cy="14" rx="5.5" ry="3" /></svg>);
export const Building = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M4 21V5l8-2v18M12 8h8v13M8 9h.01M8 13h.01M8 17h.01M16 12h.01M16 16h.01M2 21h20" /></svg>);
export const Phone = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>);
export const Mail = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>);
export const Sparkle = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></svg>);
export const Layers = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" /></svg>);
export const Star = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg>);
