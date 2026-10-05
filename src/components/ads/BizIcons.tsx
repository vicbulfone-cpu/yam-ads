// Icons for the business ad page (owner's "business" design picture): outline service icons for the match box and
// questionnaire, and solid icons for the benefit circles and trust strip.
import type { ReactNode } from "react";

const o = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** One outline icon per business category, in the order of BIZ_CATEGORIES (document, bar chart, gear, light bulb). */
export const BIZ_CATEGORY_ICONS: Record<string, ReactNode> = {
  biz_tax: <><path d="M6.4 2.8h7.2l4.8 4.8v12a1.6 1.6 0 0 1-1.6 1.6H6.4a1.6 1.6 0 0 1-1.6-1.6V4.4a1.6 1.6 0 0 1 1.6-1.6Z" {...o} /><path d="M13.6 2.8v4.8h4.8M8.4 12h7.2M8.4 15h7.2M8.4 18h4.6" {...o} /></>,
  bookkeeping: <><rect x="4" y="13" width="3.6" height="7.4" rx=".8" fill="currentColor" /><rect x="10.2" y="9" width="3.6" height="11.4" rx=".8" fill="currentColor" /><rect x="16.4" y="4.6" width="3.6" height="15.8" rx=".8" fill="currentColor" /></>,
  planning: <><circle cx="12" cy="12" r="3.2" {...o} /><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5" {...o} strokeWidth={2.4} /><circle cx="12" cy="12" r="6.4" {...o} /></>,
  advice: <><path d="M9 17.6h6M9.8 20.8h4.4" {...o} /><path d="M12 3a6.2 6.2 0 0 0-3.6 11.3c.5.4.8 1 .8 1.6v.6h5.6v-.6c0-.6.3-1.2.8-1.6A6.2 6.2 0 0 0 12 3Z" {...o} /></>,
};

type P = { className?: string };
export const PinSolid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden><path d="M12 2.2a7.4 7.4 0 0 0-7.4 7.4c0 5.4 6.2 11.4 6.8 12a.9.9 0 0 0 1.2 0c.6-.6 6.8-6.6 6.8-12A7.4 7.4 0 0 0 12 2.2Z" fill="currentColor" /><circle cx="12" cy="9.6" r="2.7" fill="var(--icon-hole, #fff)" /></svg>
);
export const PeopleSolid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor"><circle cx="12" cy="7.4" r="3.2" /><path d="M6.2 19.6c0-3.6 2.6-6 5.8-6s5.8 2.4 5.8 6c0 .4-.3.6-.6.6H6.8c-.3 0-.6-.2-.6-.6Z" /><circle cx="5.4" cy="9" r="2.3" /><path d="M1.4 18.4c0-2.6 1.7-4.4 4-4.6-.9 1.2-1.4 2.8-1.4 4.6v.6H2c-.3 0-.6-.3-.6-.6Z" /><circle cx="18.6" cy="9" r="2.3" /><path d="M22.6 18.4c0-2.6-1.7-4.4-4-4.6.9 1.2 1.4 2.8 1.4 4.6v.6H22c.3 0 .6-.3.6-.6Z" /></svg>
);
export const HandshakeSolid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m11.2 6.6-2.4-1.2a2 2 0 0 0-1.6-.1L2.8 7v7.2l1.6.8" /><path d="m21.2 14.2-1.6.8-4.4-4.4" /><path d="M21.2 7v7.2" /><path d="M21.2 7 17 5.3a2 2 0 0 0-1.6.1l-4.9 2.7a1.5 1.5 0 0 0-.4 2.3c.6.7 1.6.8 2.4.4l2.6-1.4" /><path d="m4.4 15 3.8 3.6a1.5 1.5 0 0 0 2.1 0" /><path d="m7.4 16.4 2.9 2.7a1.5 1.5 0 0 0 2.1 0l.4-.4" /><path d="m10.6 15.4 2.3 2.2a1.5 1.5 0 0 0 2.1 0l.4-.4a1.5 1.5 0 0 0 0-2.1L13 12.8" /><path d="m13.4 14 1.6 1.5a1.5 1.5 0 0 0 2.1 0l.3-.3a1.5 1.5 0 0 0 0-2.1l-2.2-2.5" /></svg>
);
export const ShieldCheck = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden><path d="M12 2.4 4.4 5.3v5.8c0 4.7 3.1 8.7 7.6 10.1 4.5-1.4 7.6-5.4 7.6-10.1V5.3L12 2.4Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" /><path d="m8.6 11.9 2.4 2.4 4.4-4.6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const ThumbSolid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M7.2 10.4h-3a.8.8 0 0 0-.8.8v8.6c0 .4.4.8.8.8h3V10.4Z" fill="currentColor" /><path d="M7.2 10.4 11 3.6c1.5 0 2.6 1.2 2.4 2.7l-.5 3.3h5.6c1.3 0 2.3 1.2 2 2.5l-1.4 6.4a2 2 0 0 1-2 1.7H7.2" /></svg>
);
