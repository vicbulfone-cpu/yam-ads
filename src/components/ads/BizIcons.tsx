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

/** Personal ad page (owner's "personal" design picture): document, calendar with tick, document with pencil, bar chart. */
export const PERSONAL_NEED_ICONS: Record<string, ReactNode> = {
  this_year: <><path d="M6.4 2.8h7.2l4.8 4.8v12a1.6 1.6 0 0 1-1.6 1.6H6.4a1.6 1.6 0 0 1-1.6-1.6V4.4a1.6 1.6 0 0 1 1.6-1.6Z" {...o} /><path d="M8.4 8.4h4M8.4 12h7.2M8.4 15.4h3.6" {...o} /><path d="m13.6 17.6 1.4 1.4 3-3" {...o} /></>,
  overdue: <><rect x="3.4" y="4.8" width="17.2" height="15.6" rx="2" {...o} /><path d="M3.4 9.4h17.2M8 2.8v4M16 2.8v4" {...o} /><path d="m8.8 14.6 2.2 2.2 4.2-4.4" {...o} /></>,
  amend: <><path d="M13 20.8H6.4a1.6 1.6 0 0 1-1.6-1.6V4.4a1.6 1.6 0 0 1 1.6-1.6h7.2l4.8 4.8v3" {...o} /><path d="M8.4 9h4M8.4 12.4h4.4M8.4 15.8h2.4" {...o} /><path d="m19.6 13.2 1.4 1.4-5.4 5.4-2.2.6.6-2.2 5.6-5.2Z" {...o} /></>,
  planning: <><rect x="3.6" y="14" width="3" height="6.6" rx=".7" fill="currentColor" /><rect x="8.6" y="10.4" width="3" height="10.2" rx=".7" fill="currentColor" /><rect x="13.6" y="7" width="3" height="13.6" rx=".7" fill="currentColor" /><rect x="18.6" y="3.4" width="3" height="17.2" rx=".7" fill="currentColor" /></>,
  unsure: <><circle cx="12" cy="12" r="8.6" {...o} /><path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7" {...o} /><circle cx="12" cy="16.8" r=".6" fill="currentColor" stroke="currentColor" strokeWidth={1} /></>,
};

/** SMSF ad page (owner's "smsf" design picture): calculator, house, bar chart, sprout. */
export const SMSF_CATEGORY_ICONS: Record<string, ReactNode> = {
  smsf_setup: <><rect x="5" y="2.8" width="14" height="18.4" rx="2" {...o} /><rect x="7.8" y="5.6" width="8.4" height="3.6" rx=".6" fill="currentColor" /><path d="M8.4 12.6h.01M12 12.6h.01M15.6 12.6h.01M8.4 15.6h.01M12 15.6h.01M15.6 15.6h.01M8.4 18.4h.01M12 18.4h.01M15.6 18.4h.01" {...o} strokeWidth={2.6} /></>,
  smsf_audit: <><path d="M3 11.2 12 3.6l9 7.6" {...o} strokeWidth={2.2} /><path d="M5.4 9.6v10.2c0 .5.4.9.9.9h4v-5.6h3.4v5.6h4c.5 0 .9-.4.9-.9V9.6L12 4.2 5.4 9.6Z" fill="currentColor" /></>,
  retirement: <><rect x="4" y="13" width="3.8" height="7.6" rx=".8" fill="currentColor" /><rect x="10.1" y="8.6" width="3.8" height="12" rx=".8" fill="currentColor" /><rect x="16.2" y="4" width="3.8" height="16.6" rx=".8" fill="currentColor" /></>,
  wealth: <><path d="M12 21v-8.4" {...o} strokeWidth={2.2} /><path d="M12 13.2C12 8.6 8.8 5.6 3.8 5.6c0 4.8 3.2 7.6 8.2 7.6Z" fill="currentColor" /><path d="M12 11.2c0-4.4 3-7.6 8.2-7.6 0 4.8-3 7.6-8.2 7.6Z" fill="currentColor" /><path d="M7.4 21h9.2" {...o} strokeWidth={2.2} /></>,
};

/** Registration ad page (owner's "registration" design picture): document, gear, tag, bar chart. */
export const REG_CATEGORY_ICONS: Record<string, ReactNode> = {
  company: BIZ_CATEGORY_ICONS.biz_tax,
  abn_tax: BIZ_CATEGORY_ICONS.planning,
  business_name: <><path d="M3.4 12.6V4.8c0-.8.6-1.4 1.4-1.4h7.8c.4 0 .7.1 1 .4l7.6 7.6a1.4 1.4 0 0 1 0 2l-7.8 7.8a1.4 1.4 0 0 1-2 0l-7.6-7.6c-.3-.3-.4-.6-.4-1Z" {...o} /><circle cx="8.2" cy="8.2" r="1.7" fill="currentColor" /></>,
  structure: BIZ_CATEGORY_ICONS.bookkeeping,
};

/** SMSF ad page: outline icons for the three steps (document, pin, people). */
export const SMSF_STEP_ICONS: Record<string, ReactNode> = {
  doc: BIZ_CATEGORY_ICONS.biz_tax,
  pin: <><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" {...o} /><circle cx="12" cy="10" r="2.5" {...o} /></>,
  people: <><circle cx="9" cy="8" r="3.4" {...o} /><path d="M2.8 20.2c0-3.6 2.8-6.2 6.2-6.2s6.2 2.6 6.2 6.2" {...o} /><circle cx="16.6" cy="8.8" r="2.7" {...o} /><path d="M16.6 14.2c2.7.2 4.6 2.4 4.6 5.4" {...o} /></>,
};

type P = { className?: string };
export const LockIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4.6" y="10.4" width="14.8" height="10.4" rx="2" /><path d="M8 10.4V7.6a4 4 0 0 1 8 0v2.8" /><path d="M12 14.4v2.6" /></svg>
);
export const PeopleOutline = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.4" /><path d="M2.8 20.2c0-3.6 2.8-6.2 6.2-6.2s6.2 2.6 6.2 6.2" /><circle cx="16.6" cy="8.8" r="2.7" /><path d="M16.6 14.2c2.7.2 4.6 2.4 4.6 5.4" /></svg>
);
export const PinSolid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden><path d="M12 2.2a7.4 7.4 0 0 0-7.4 7.4c0 5.4 6.2 11.4 6.8 12a.9.9 0 0 0 1.2 0c.6-.6 6.8-6.6 6.8-12A7.4 7.4 0 0 0 12 2.2Z" fill="currentColor" /><circle cx="12" cy="9.6" r="2.7" fill="var(--icon-hole, #fff)" /></svg>
);
export const PeopleSolid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor"><circle cx="12" cy="7.4" r="3.2" /><path d="M6.2 19.6c0-3.6 2.6-6 5.8-6s5.8 2.4 5.8 6c0 .4-.3.6-.6.6H6.8c-.3 0-.6-.2-.6-.6Z" /><circle cx="5.4" cy="9" r="2.3" /><path d="M1.4 18.4c0-2.6 1.7-4.4 4-4.6-.9 1.2-1.4 2.8-1.4 4.6v.6H2c-.3 0-.6-.3-.6-.6Z" /><circle cx="18.6" cy="9" r="2.3" /><path d="M22.6 18.4c0-2.6-1.7-4.4-4-4.6.9 1.2 1.4 2.8 1.4 4.6v.6H22c.3 0 .6-.3.6-.6Z" /></svg>
);
export const PersonSolid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor"><circle cx="12" cy="7.6" r="4.2" /><path d="M4.2 20.4c0-4.4 3.5-7.4 7.8-7.4s7.8 3 7.8 7.4c0 .5-.4.8-.8.8H5c-.4 0-.8-.3-.8-.8Z" /></svg>
);
export const HandshakeSolid =({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m11.2 6.6-2.4-1.2a2 2 0 0 0-1.6-.1L2.8 7v7.2l1.6.8" /><path d="m21.2 14.2-1.6.8-4.4-4.4" /><path d="M21.2 7v7.2" /><path d="M21.2 7 17 5.3a2 2 0 0 0-1.6.1l-4.9 2.7a1.5 1.5 0 0 0-.4 2.3c.6.7 1.6.8 2.4.4l2.6-1.4" /><path d="m4.4 15 3.8 3.6a1.5 1.5 0 0 0 2.1 0" /><path d="m7.4 16.4 2.9 2.7a1.5 1.5 0 0 0 2.1 0l.4-.4" /><path d="m10.6 15.4 2.3 2.2a1.5 1.5 0 0 0 2.1 0l.4-.4a1.5 1.5 0 0 0 0-2.1L13 12.8" /><path d="m13.4 14 1.6 1.5a1.5 1.5 0 0 0 2.1 0l.3-.3a1.5 1.5 0 0 0 0-2.1l-2.2-2.5" /></svg>
);
export const ShieldCheck = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden><path d="M12 2.4 4.4 5.3v5.8c0 4.7 3.1 8.7 7.6 10.1 4.5-1.4 7.6-5.4 7.6-10.1V5.3L12 2.4Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" /><path d="m8.6 11.9 2.4 2.4 4.4-4.6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const ThumbSolid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M7.2 10.4h-3a.8.8 0 0 0-.8.8v8.6c0 .4.4.8.8.8h3V10.4Z" fill="currentColor" /><path d="M7.2 10.4 11 3.6c1.5 0 2.6 1.2 2.4 2.7l-.5 3.3h5.6c1.3 0 2.3 1.2 2 2.5l-1.4 6.4a2 2 0 0 1-2 1.7H7.2" /></svg>
);
