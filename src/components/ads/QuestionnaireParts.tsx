"use client";

import { MATCH_SEARCH, MATCH_WAIT_MS } from "@/content/match-search";
import { Check, Sparkle } from "../ui/Icons";

/**
 * Pieces shared by every ad questionnaire (business /ad-1, personal /ad-2, ...): the navy progress header, the step
 * heading, tick and choice cards, text boxes, and the checks and tracking used on submit.
 */

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MOBILE = /^(?:\+?61|0)4\d{8}$/;
export const cleanPhone = (p: string) => p.replace(/[\s()-]/g, "");

/** Google Ads click IDs: gclid, or gbraid / wbraid on some iPhone traffic. Any one of them makes the lead "Paid". */
export const AD_CLICK_IDS = ["gclid", "gbraid", "wbraid"];
const TRACKING_KEY = "yam:tracking";

/**
 * utm_*, the Google Ads click IDs and ref from the page address, carried into the lead. Remembered for the visit (this
 * browser tab), so they are not lost if the visitor moves to another page before finishing the questionnaire.
 */
export function readTracking() {
  let out: Record<string, string> = {};
  try { out = JSON.parse(sessionStorage.getItem(TRACKING_KEY) ?? "{}"); } catch {}
  const fresh: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((v, k) => {
    if (k.startsWith("utm_") || AD_CLICK_IDS.includes(k) || k === "ref") fresh[k] = v;
  });
  if (Object.keys(fresh).length) {
    out = fresh; // a new visit from a link replaces what was remembered
    try { sessionStorage.setItem(TRACKING_KEY, JSON.stringify(out)); } catch {}
  }
  return out;
}
// remember the landing page's tracking as soon as this code loads
if (typeof window !== "undefined") readTracking();

/**
 * Opens the match page. The quick in-app switch is tried first (the popup stays on "Preparing your match…" until the
 * match page replaces it); if the match page hasn't appeared within 3 seconds (e.g. an old browser tab after a site
 * update, or a browser that blocks the switch), the browser loads it directly, so the customer is never left waiting.
 */
export function openMatchPage(router: { push: (href: string) => void }, href: string) {
  const path = href.split("?")[0];
  router.push(href);
  window.setTimeout(() => { if (window.location.pathname !== path) window.location.assign(href); }, 3000);
}

/** Starts the "searching" screen's clock; the returned function waits until it has been up for MATCH_WAIT_MS. */
export function startSearchTimer() {
  const since = Date.now();
  return () => new Promise((r) => window.setTimeout(r, Math.max(0, MATCH_WAIT_MS - (Date.now() - since))));
}

/**
 * Personal "searching" screen shown over the questionnaire after the last question, until the match page replaces it:
 * "John, we are now searching for a local accountant who is well matched for the services you requested."
 */
export function MatchSearching({ firstName }: { firstName: string }) {
  return (
    <div className="q-leave" role="status" aria-live="polite">
      <div className="q-leave-box bq-search bq-matching">
        <span aria-hidden className="bq-radar"><Sparkle width={30} height={30} strokeWidth={2} /></span>
        {firstName && <p className="bq-matching-name">{firstName},</p>}
        <p className="q-leave-title bq-matching-text">{firstName ? MATCH_SEARCH.text : MATCH_SEARCH.textNoName}</p>
        <span aria-hidden className="bq-search-bar is-match"><span /></span>
      </div>
    </div>
  );
}

/** The named stages on the progress strip (owner, 7 Oct 2026). Every questionnaire ends with the same pages, so the
 *  stage comes from the page's kind; any other kind is one of that questionnaire's own service questions. */
export const PROGRESS_STAGES = ["Your needs", "About you", "Your area", "Your details", "Your match"];
const STAGE_OF: Record<string, number> = { name: 1, summary: 1, mode: 2, location: 2, email: 3, phone: 3, emailMe: 3 };

/**
 * Progress at the top of every questionnaire page (owner, 7 Oct 2026): a slim, quiet strip on white: a green bar with a
 * circle per stage, each named underneath (done = solid green with a tick, current = green ring, still to come = light
 * ring). "Your match" is the finish (the match page). "Your Match in Progress" and "Step N of M" stay for screen readers.
 */
export function AdProgress({ stepNumber, total, badge, stepOf, kind }: { stepNumber: number; total: number; badge: string; stepOf: string; /** the page's kind (name, summary, ...): picks the stage */ kind: string }) {
  const current = STAGE_OF[kind] ?? 0; // counted from 0
  const last = PROGRESS_STAGES.length - 1;
  const label = `${badge}: ${PROGRESS_STAGES[current]}. ${stepOf.replace("{n}", String(stepNumber)).replace("{total}", String(total))}`;
  return (
    <div className="q-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={stepNumber} aria-label={label}>
      <div className="q-progress-track" aria-hidden>
        <span className="q-progress-fill" style={{ width: `${(current / last) * 100}%` }} />
        {PROGRESS_STAGES.map((name, i) => {
          const state = i < current ? "done" : i === current ? "here" : "todo";
          return (
            <span key={name} className={`q-progress-step is-${state}`} style={{ left: `${(i / last) * 100}%` }}>
              <span className="q-progress-dot">{state === "done" && <Check width={9} height={9} strokeWidth={4} />}</span>
              <span className="q-progress-name">{name}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function StepHead({ eyebrow, title, icon, children }: { eyebrow: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <span aria-hidden className="q-icon grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-green-600 text-white shadow-[0_10px_24px_-10px_rgba(0,135,58,.6)]">{icon}</span>
        <div className="min-w-0 space-y-1">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green-700">{eyebrow}</span>
          <h3 className="font-sans tracking-[-0.02em] text-[1.45rem] font-semibold leading-tight text-navy-900 sm:text-[1.75rem]">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );
}

export function OptionCard({ checked, onToggle, label, warn }: { checked: boolean; onToggle: () => void; label: string; warn?: boolean }) {
  return (
    <label className={`q-opt group relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 transition duration-200 lg:min-h-12 lg:py-2 ${
      checked ? "border-green-500 bg-gradient-to-br from-green-50 to-white shadow-[0_10px_24px_-10px_rgba(0,135,58,.45)]"
        : warn ? "border-amber-300 bg-white hover:border-amber-400"
          : "border-line bg-white/95 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50/40 hover:shadow-[0_8px_20px_-10px_rgba(7,50,101,.3)]"}`}>
      <input type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
      <span aria-hidden className={`q-tick${checked ? " is-on" : ""} grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-green-600 peer-focus-visible:ring-offset-2 ${checked ? "scale-110 border-green-600 bg-green-600 text-white" : "border-slate-300 bg-white text-transparent group-hover:border-green-500"}`}>
        <Check width={13} height={13} strokeWidth={3.4} />
      </span>
      <span className={`q-opt-text text-[0.95rem] leading-snug ${checked ? "font-bold text-navy-900" : "font-medium text-ink/85"}`}>{label}</span>
    </label>
  );
}

/** multi: one of several that can be ticked together (a checkbox to screen readers; same look) */
export function ChoiceCard({ checked, onSelect, label, desc, warn, multi = false }: { checked: boolean; onSelect: () => void; label: string; desc?: string; warn?: boolean; multi?: boolean }) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={checked}
      onClick={onSelect}
      className={`q-choice flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition duration-200 ${
        checked ? "border-green-500 bg-gradient-to-br from-green-50 to-white shadow-[0_10px_24px_-10px_rgba(0,135,58,.45)]"
          : warn ? "border-amber-300 bg-white hover:border-amber-400"
            : "border-line bg-white/95 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50/40 hover:shadow-[0_8px_20px_-10px_rgba(7,50,101,.3)]"}`}
    >
      <span aria-hidden className={`q-tick${checked ? " is-on" : ""} grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-200 ${checked ? "scale-110 border-green-600 bg-green-600 text-white" : "border-slate-300 bg-white text-transparent"}`}>
        <Check width={13} height={13} strokeWidth={3.4} />
      </span>
      <span className="min-w-0">
        <span className={`block text-[1rem] leading-snug ${checked ? "font-bold text-navy-900" : "font-semibold text-ink/90"}`}>{label}</span>
        {desc && <span className="mt-0.5 block break-words text-[0.85rem] leading-snug text-muted">{desc}</span>}
      </span>
    </button>
  );
}

type FieldProps = {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; invalid?: boolean; autoFocus?: boolean;
  type?: string; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  ref?: React.Ref<HTMLInputElement>;
};
export function TextField({ label, value, onChange, placeholder, invalid, type = "text", autoComplete, inputMode, autoFocus, ref }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy-900">{label}</span>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        autoFocus={autoFocus}
        aria-invalid={invalid || undefined}
        className={`bq-input ${invalid ? "is-invalid" : ""}`}
      />
    </label>
  );
}

/** Multi-line box (e.g. "Other — tell us what you need", or an optional note). */
export function NoteField({ label, value, onChange, placeholder, rows = 2 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={500}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border-2 border-line bg-white px-3 py-2 text-sm text-ink transition placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}
