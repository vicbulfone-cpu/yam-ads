"use client";

import { progressMilestones } from "@/lib/progress";
import { Check, Sparkle } from "../ui/Icons";

/**
 * Pieces shared by every ad questionnaire (business /ad-1, personal /ad-2, ...): the navy progress header, the step
 * heading, tick and choice cards, text boxes, and the checks and tracking used on submit.
 */

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MOBILE = /^(?:\+?61|0)4\d{8}$/;
export const cleanPhone = (p: string) => p.replace(/[\s()-]/g, "");

/** utm_*, gclid and ref from the page address, carried into the lead. */
export function readTracking() {
  const out: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((v, k) => {
    if (k.startsWith("utm_") || k === "gclid" || k === "ref") out[k] = v;
  });
  return out;
}

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

/** Navy progress header: at most 5 milestones, the real pages shared out evenly across them (src/lib/progress.ts). */
export function AdProgress({ stepNumber, total, badge, stepOf }: { stepNumber: number; total: number; badge: string; stepOf: string }) {
  const pct = Math.round((stepNumber / total) * 100);
  const { shown, current } = progressMilestones(stepNumber, total);
  return (
    <div className="q-hero relative overflow-hidden bg-navy-900 px-4 pb-4 pt-3.5 text-white sm:px-8">
      <div aria-hidden className="absolute inset-0 opacity-70 [background:radial-gradient(55%_120%_at_90%_-10%,rgba(0,174,65,.5),transparent_60%),radial-gradient(45%_100%_at_0%_110%,rgba(26,90,166,.8),transparent_60%)]" />
      <div aria-hidden className="dots absolute inset-0 opacity-15 [filter:invert(1)]" />
      <div className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green-200 backdrop-blur">
          <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 motion-reduce:animate-none" />
          {badge}
        </span>
        <div className="mx-auto mt-3 flex max-w-md items-center" aria-hidden>
          {Array.from({ length: shown }, (_, i) => {
            const done = current > i + 1;
            const here = current === i + 1;
            const last = i === shown - 1;
            const size = last ? "h-9 w-9" : "h-8 w-8 text-[0.8rem]";
            return (
              <div key={i} className={`flex items-center ${last ? "" : "flex-1"}`}>
                <span className={`grid shrink-0 place-items-center rounded-full font-bold transition-all duration-500 ${size} ${
                  done ? "bg-green-500 text-white" : here ? "bg-white text-navy-900 shadow-[0_0_0_4px_rgba(0,174,65,.45)]" : "bg-white/15 text-white/70"}`}>
                  {last ? <Sparkle width={16} height={16} /> : done ? <Check width={12} height={12} strokeWidth={3.4} /> : i + 1}
                </span>
                {!last && <span className="mx-1.5 h-1 flex-1 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-700" style={{ width: done ? "100%" : "0%" }} /></span>}
              </div>
            );
          })}
        </div>
        <p className="mt-2.5 text-xs font-semibold text-navy-100">
          {stepOf.replace("{n}", String(current)).replace("{total}", String(shown))} <span className="text-green-300">· {pct}%</span>
        </p>
      </div>
    </div>
  );
}

export function StepHead({ eyebrow, title, icon, children }: { eyebrow: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-green-600 text-white shadow-[0_10px_24px_-10px_rgba(0,135,58,.6)]">{icon}</span>
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
    <label className={`group relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 transition duration-200 lg:min-h-12 lg:py-2 ${
      checked ? "border-green-500 bg-gradient-to-br from-green-50 to-white shadow-[0_10px_24px_-10px_rgba(0,135,58,.45)]"
        : warn ? "border-amber-300 bg-white hover:border-amber-400"
          : "border-line bg-white/95 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50/40 hover:shadow-[0_8px_20px_-10px_rgba(7,50,101,.3)]"}`}>
      <input type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
      <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-green-600 peer-focus-visible:ring-offset-2 ${checked ? "scale-110 border-green-600 bg-green-600 text-white" : "border-slate-300 bg-white text-transparent group-hover:border-green-500"}`}>
        <Check width={13} height={13} strokeWidth={3.4} />
      </span>
      <span className={`text-[0.95rem] leading-snug ${checked ? "font-bold text-navy-900" : "font-medium text-ink/85"}`}>{label}</span>
    </label>
  );
}

export function ChoiceCard({ checked, onSelect, label, desc, warn }: { checked: boolean; onSelect: () => void; label: string; desc?: string; warn?: boolean }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition duration-200 ${
        checked ? "border-green-500 bg-gradient-to-br from-green-50 to-white shadow-[0_10px_24px_-10px_rgba(0,135,58,.45)]"
          : warn ? "border-amber-300 bg-white hover:border-amber-400"
            : "border-line bg-white/95 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50/40 hover:shadow-[0_8px_20px_-10px_rgba(7,50,101,.3)]"}`}
    >
      <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-200 ${checked ? "scale-110 border-green-600 bg-green-600 text-white" : "border-slate-300 bg-white text-transparent"}`}>
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
