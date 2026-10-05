"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { QUESTIONNAIRE_URL, logo } from "@/config/site.config";
import { MATCH_CATEGORIES, QUESTIONNAIRE_UI as UI, SOFTWARE_OPTIONS, type MatchCategory } from "@/content/questionnaire";
import { tiles } from "../sections/MatchCardServices";
import MatchCardView, { type MatchCardData } from "../sections/MatchCardView";
import { ArrowRight, Check, Clock, Close, Sparkle } from "../ui/Icons";
import { LEAVE_PROMPT } from "@/content/leave-prompt";
import PhoneFit from "../ui/PhoneFit";
import { noteAbandon, noteOpen, saveProgress } from "@/lib/visitor";
import { progressMilestones } from "@/lib/progress";

/**
 * The questionnaire popup (3/4 of the screen, blurred page behind it).
 * Any link to the questionnaire address opens it instead of leaving the page:
 *  - links carrying ?category=… (the match card's Start button) go straight to questionnaire page 1;
 *  - every other CTA first shows the match card so the visitor can pick their services.
 * The links stay ordinary links in the HTML (search engines and no-JavaScript visitors still reach /questionnaire).
 * Nothing is rendered inside the popup until it opens, so page HTML and SEO are unchanged.
 */

type Answers = Record<string, { optionIds: string[]; software: string | null; otherNote: string }>;
type Step = { kind: "select" } | { kind: "category"; index: number } | { kind: "next" };

import { OPEN_QUESTIONNAIRE_EVENT } from "@/lib/questionnaire-events";
export { OPEN_QUESTIONNAIRE_EVENT };

const norm = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
/** Card titles → questionnaire category ids, always in the old questionnaire's order. */
const toIds = (titles: string[]) => MATCH_CATEGORIES.filter((c) => titles.some((t) => norm(t) === norm(c.label))).map((c) => c.id);

export default function QuestionnaireModal({ card }: { card: MatchCardData }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>({ kind: "select" });
  const [ids, setIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState(false);
  // true when opened from a page's match box: Back on page 1 then closes the popup instead of showing the match box
  const [fromCard, setFromCard] = useState(false);
  // true while the "Are you sure you want to leave?" box is showing
  const [confirmLeave, setConfirmLeave] = useState(false);
  const stayRef = useRef<HTMLButtonElement>(null);

  const show = useCallback((categoryIds: string[], fromPageCard = false) => {
    // remember the visit; a visitor who left part-way before carries on where they stopped (src/lib/visitor.ts)
    const saved = noteOpen();
    const known = (list: string[]) => list.filter((id) => MATCH_CATEGORIES.some((c) => c.id === id));
    const resume = !categoryIds.length && saved.inProgress && known(saved.ids).length > 0;
    const useIds = resume ? known(saved.ids) : categoryIds;
    const keep = Object.fromEntries(Object.entries(saved.answers as Answers).filter(([id]) => useIds.includes(id)));
    setIds(useIds);
    setAnswers(keep);
    setFromCard(fromPageCard);
    setError(false);
    setConfirmLeave(false);
    setStep(
      resume && saved.step.kind === "next" ? { kind: "next" }
        : resume && saved.step.kind === "category" ? { kind: "category", index: Math.min(saved.step.index, useIds.length - 1) }
          : useIds.length ? { kind: "category", index: 0 } : { kind: "select" },
    );
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setConfirmLeave(false);
    setAnswers({});
  }, []);

  // Closing part-way through the questions first asks "Are you sure you want to leave?" (the match box page just closes)
  const requestClose = useCallback(() => {
    if (step.kind === "select") close();
    else setConfirmLeave(true);
  }, [close, step.kind]);

  // keep the visitor's progress in their browser, so it is still there if they come back
  useEffect(() => {
    if (open && step.kind !== "select") saveProgress(ids, answers, step);
  }, [open, ids, answers, step]);

  // the "leave?" box: focus lands on Stay; closing the browser tab mid-way shows the browser's own "leave site?" warning
  useEffect(() => {
    if (confirmLeave) stayRef.current?.focus();
  }, [confirmLeave]);
  useEffect(() => {
    if (!open || step.kind === "select") return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [open, step.kind]);

  // open / close the native dialog (focus trap, Esc key and top layer come for free)
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.classList.toggle("q-modal-open", open);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step]);

  // intercept every link to the questionnaire address, anywhere on the site
  useEffect(() => {
    const target = new URL(QUESTIONNAIRE_URL, window.location.href);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== target.origin || url.pathname.replace(/\/$/, "") !== target.pathname.replace(/\/$/, "")) return;
      const categoryIds = toIds(url.searchParams.getAll("category"));
      // a match-card Start button with nothing ticked never opens the popup; the card shows its own message
      if (a.hasAttribute("data-match-start") && !categoryIds.length) return e.preventDefault();
      e.preventDefault(); // Next's <Link> skips navigation when the default is prevented
      show(categoryIds, !a.closest("dialog") && a.hasAttribute("data-match-start"));
    };
    const onOpen = (e: Event) => show(toIds((e as CustomEvent<string[]>).detail ?? []), true);
    window.addEventListener("click", onClick, true);
    window.addEventListener(OPEN_QUESTIONNAIRE_EVENT, onOpen);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener(OPEN_QUESTIONNAIRE_EVENT, onOpen);
    };
  }, [show]);

  const categories = ids.map((id) => MATCH_CATEGORIES.find((c) => c.id === id)!).filter(Boolean);
  const totalSteps = categories.length + 2; // categories + summary + contact (as on the old site)
  const current = step.kind === "category" ? categories[step.index] : undefined;
  const sel = current ? answers[current.id] ?? { optionIds: [], software: null, otherNote: "" } : undefined;

  const update = (patch: Partial<Answers[string]>) => {
    if (!current || !sel) return;
    setAnswers((a) => ({ ...a, [current.id]: { ...sel, ...patch } }));
    setError(false);
  };
  const toggle = (optionId: string) => {
    if (!sel) return;
    const has = sel.optionIds.includes(optionId);
    update({
      optionIds: has ? sel.optionIds.filter((o) => o !== optionId) : [...sel.optionIds, optionId],
      software: optionId === "software" && has ? null : sel.software,
    });
  };
  const next = () => {
    if (step.kind !== "category" || !sel) return;
    if (!sel.optionIds.length || (sel.optionIds.includes("software") && !sel.software)) return setError(true);
    setStep(step.index + 1 < categories.length ? { kind: "category", index: step.index + 1 } : { kind: "next" });
  };
  const back = () => {
    setError(false);
    if (step.kind === "next") setStep({ kind: "category", index: categories.length - 1 });
    else if (step.kind === "category" && step.index > 0) setStep({ kind: "category", index: step.index - 1 });
    else if (fromCard) requestClose();
    else setStep({ kind: "select" });
  };

  const stepNumber = step.kind === "category" ? step.index + 1 : categories.length + 1;
  const selectedTitles = card.categories.filter((c) => ids.includes(toIds([c.title])[0] ?? "")).map((c) => c.title);

  return (
    <dialog
      ref={dialogRef}
      className="q-modal"
      data-step={step.kind}
      aria-label={step.kind === "select" ? card.title ?? "Questionnaire" : UI.progressBadge}
      onCancel={(e) => { e.preventDefault(); if (confirmLeave) setConfirmLeave(false); else requestClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget && step.kind === "select") close(); }}
    >
      {open && (
        <div className="relative flex h-full max-h-[inherit] flex-col">
          <div className="q-modal-top flex shrink-0 items-center justify-between gap-3 border-b border-line/70 bg-white/90 px-4 py-2.5 sm:px-6">
            <Image src={logo.srcSmall} alt={logo.alt} width={680} height={91} className="h-auto w-[170px] sm:w-[210px]" />
            <button type="button" onClick={requestClose} aria-label="Close" className="q-modal-close">
              <Close width={20} height={20} strokeWidth={2.4} />
            </button>
          </div>

          <div ref={scrollRef} data-bg={step.kind === "category" ? current?.id : step.kind} className="q-modal-body min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {step.kind === "select" ? (
              // match box at the same width as on every page, with 2cm either side of it (q-modal-card in globals.css)
              <div className="q-modal-card flex min-h-full items-center"><div className="w-full">
                <MatchCardView key={ids.join()} data={card} initialSelected={selectedTitles} />
              </div></div>
            ) : (
              <PhoneFit>
                <ProgressHeader stepNumber={stepNumber} totalSteps={totalSteps} />
                <div className="q-form mx-auto w-full max-w-4xl px-4 pb-6 pt-6 sm:px-8 lg:pb-3 lg:pt-4">
                  {current && sel ? (
                    <CategoryStep category={current} index={step.kind === "category" ? step.index : 0} total={categories.length} sel={sel} error={error} toggle={toggle} update={update} />
                  ) : (
                    // Summary and contact pages are finalised in the questionnaire stage
                    <div className="rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-50 via-white to-amber-50/60 px-6 py-12 text-center shadow-[0_14px_40px_-18px_rgba(7,50,101,.25)]">
                      <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white shadow-[0_10px_24px_-8px_rgba(0,135,58,.6)]"><Sparkle width={26} height={26} /></span>
                      <p className="font-sans tracking-[-0.02em] text-xl font-semibold text-navy-900">Content coming soon</p>
                    </div>
                  )}
                </div>
              </PhoneFit>
            )}
          </div>

          {step.kind !== "select" && (
            <div className="q-modal-footer shrink-0 border-t border-line/70 bg-white/95 px-4 py-3 sm:px-8">
              {error && current && sel && (
                <p role="alert" className="mb-2 text-center text-sm font-semibold text-red-600">
                  {sel.optionIds.includes("software") && !sel.software ? UI.softwareErrorFull : current.id === "smsf_fp" ? UI.smsfError : UI.defaultError}
                </p>
              )}
              <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
                <button type="button" onClick={back} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted transition hover:text-navy-900">
                  <ArrowRight width={16} height={16} strokeWidth={2.5} className="rotate-180" />
                  {UI.back}
                </button>
                {step.kind === "category" && (
                  <button type="button" onClick={next} className={`btn btn-primary min-h-12 px-10 ${sel && sel.optionIds.length ? "q-next-ready" : ""}`}>
                    <span>{UI.next}</span>
                    <span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
                  </button>
                )}
              </div>
            </div>
          )}

          {confirmLeave && (
            <div className="q-leave" role="alertdialog" aria-modal="true" aria-labelledby="q-leave-title" aria-describedby="q-leave-text">
              <div className="q-leave-box">
                <span aria-hidden className="q-leave-icon"><Clock width={30} height={30} strokeWidth={2} /></span>
                <p id="q-leave-title" className="q-leave-title">{LEAVE_PROMPT.title}</p>
                <p id="q-leave-text" className="q-leave-text">{LEAVE_PROMPT.text}</p>
                <div className="mt-6 grid gap-2.5">
                  <button ref={stayRef} type="button" onClick={() => setConfirmLeave(false)} className="btn btn-primary min-h-12 w-full">
                    <span>{LEAVE_PROMPT.stay}</span>
                    <span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      noteAbandon(step.kind === "category" ? `category ${step.index + 1} of ${categories.length}` : "summary");
                      close();
                    }}
                    className="q-leave-exit"
                  >
                    {LEAVE_PROMPT.leave}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

function ProgressHeader({ stepNumber, totalSteps }: { stepNumber: number; totalSteps: number }) {
  const pct = Math.round((stepNumber / totalSteps) * 100);
  // at most 5 milestones, the real pages shared out evenly across them (src/lib/progress.ts)
  const { shown, current } = progressMilestones(stepNumber, totalSteps);
  return (
    <div className="q-hero relative overflow-hidden bg-navy-900 px-5 pb-5 pt-4 text-white sm:px-8 lg:pb-4 lg:pt-3.5">
      <div aria-hidden className="absolute inset-0 opacity-70 [background:radial-gradient(55%_120%_at_90%_-10%,rgba(0,174,65,.5),transparent_60%),radial-gradient(45%_100%_at_0%_110%,rgba(26,90,166,.8),transparent_60%)]" />
      <div aria-hidden className="dots absolute inset-0 opacity-15 [filter:invert(1)]" />
      <div className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green-200 backdrop-blur">
          <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 motion-reduce:animate-none" />
          {UI.progressBadge}
        </span>
        {/* milestones: one dot per step, the last is the finish (your match); the green line fills as you go */}
        <div className="mx-auto mt-3.5 flex max-w-md items-center" aria-hidden>
          {Array.from({ length: shown }, (_, i) => {
            const done = current > i + 1;
            const here = current === i + 1;
            const last = i === shown - 1;
            return (
              <div key={i} className={`flex items-center ${last ? "" : "flex-1"}`}>
                <span className={`grid shrink-0 place-items-center rounded-full text-[0.8rem] font-bold transition-all duration-500 ${last ? "h-10 w-10" : "h-8 w-8"} ${
                  done ? "bg-green-500 text-white" : here ? "bg-white text-navy-900 shadow-[0_0_0_5px_rgba(0,174,65,.45)]" : "bg-white/15 text-white/70"}`}>
                  {last ? <Sparkle width={18} height={18} /> : done ? <Check width={15} height={15} strokeWidth={3.2} /> : i + 1}
                </span>
                {!last && <span className="mx-1.5 h-1 flex-1 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-700" style={{ width: done ? "100%" : "0%" }} /></span>}
              </div>
            );
          })}
        </div>
        <p className="mt-2.5 text-xs font-semibold text-navy-100">
          {UI.stepOf.replace("{n}", String(current)).replace("{total}", String(shown))} <span className="text-green-300">· {pct}%</span>
        </p>
      </div>
    </div>
  );
}

function CategoryStep({
  category, index, total, sel, error, toggle, update,
}: {
  category: MatchCategory; index: number; total: number;
  sel: Answers[string]; error: boolean;
  toggle: (id: string) => void; update: (patch: Partial<Answers[string]>) => void;
}) {
  const showsSoftware = sel.optionIds.includes("software");
  const needsSoftware = showsSoftware && !sel.software;
  const { Icon, tile, ink } = tiles[Math.max(0, MATCH_CATEGORIES.findIndex((c) => c.id === category.id)) % tiles.length];
  return (
    <div className="space-y-4 lg:space-y-3.5">
      <div className="flex items-start gap-4">
        <span aria-hidden style={{ "--tile-ink": ink } as React.CSSProperties} className={`q-icon relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl text-white ring-1 ring-white/40 lg:h-14 lg:w-14 ${tile}`}>
          <Icon className="relative h-8 w-8 lg:h-7 lg:w-7" />
        </span>
        <div className="min-w-0 space-y-1">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green-700">
            {UI.categoryOf.replace("{n}", String(index + 1)).replace("{total}", String(total))}
          </span>
          <h3 className="font-sans tracking-[-0.02em] text-[1.55rem] font-semibold leading-tight text-navy-900 sm:text-[1.85rem] lg:text-[1.7rem]">{category.label}</h3>
          {category.subtitle && <p className="text-sm font-semibold text-green-700">{category.subtitle}</p>}
        </div>
      </div>
      <p className="max-w-2xl rounded-xl border-l-4 border-green-500 bg-green-50/70 px-4 py-2.5 text-[0.95rem] leading-snug text-ink/80">
        {category.id === "smsf_fp" ? (
          <>{UI.smsfHelpBefore} <span className="font-bold text-navy-900">{UI.smsfHelpStrong}</span> {UI.smsfHelpAfter}</>
        ) : UI.defaultHelp.replace("{category}", category.label.toLowerCase())}
      </p>

      {category.sections.map((section, sIdx) => (
        <fieldset key={sIdx} className="space-y-3 rounded-3xl border border-line/80 bg-white p-4 shadow-[0_14px_36px_-18px_rgba(7,50,101,.25)] sm:p-5 lg:space-y-2.5 lg:p-4">
          {section.heading ? (
            <legend className="float-left mb-1 flex w-full items-center gap-3 border-b border-slate-100 pb-2.5">
              <span aria-hidden className="h-5 w-1.5 rounded-full bg-gradient-to-b from-green-500 to-navy-900" />
              <span className="font-sans tracking-[-0.02em] text-lg font-semibold text-navy-900">{section.heading}</span>
            </legend>
          ) : <legend className="sr-only">{category.label}</legend>}
          <div className="clear-both grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-2">
            {section.options.map((opt) => {
              const checked = sel.optionIds.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={`q-opt group relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 transition duration-200 lg:min-h-12 lg:py-2 ${
                    checked ? "border-green-500 bg-gradient-to-br from-green-50 to-white shadow-[0_10px_24px_-10px_rgba(0,135,58,.45)]"
                      : error ? "border-amber-300 bg-white hover:border-amber-400"
                        : "border-line bg-white hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50/40 hover:shadow-[0_8px_20px_-10px_rgba(7,50,101,.3)]"
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(opt.id)} className="peer sr-only" />
                  <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-green-600 peer-focus-visible:ring-offset-2 ${checked ? "scale-110 border-green-600 bg-green-600 text-white" : "border-slate-300 bg-white text-transparent group-hover:border-green-500"}`}>
                    <Check width={13} height={13} strokeWidth={3.4} />
                  </span>
                  <span className={`text-[0.95rem] leading-snug ${checked ? "font-bold text-navy-900" : "font-medium text-ink/85"}`}>{opt.label}</span>
                </label>
              );
            })}
          </div>
          {sel.optionIds.some((sid) => section.options.find((o) => o.id === sid)?.hasOtherBox) && (
            <label className="block pt-1">
              <span className="mb-1.5 block text-xs font-semibold text-muted">{UI.otherBoxLabel}</span>
              <textarea
                value={sel.otherNote}
                onChange={(e) => update({ otherNote: e.target.value })}
                rows={2}
                placeholder={UI.otherBoxPlaceholder}
                className="w-full resize-none rounded-xl border-2 border-line bg-slate-50/60 px-3 py-2 text-sm text-ink transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </label>
          )}
        </fieldset>
      ))}

      {showsSoftware && (
        <div className={`space-y-3 rounded-3xl border-2 bg-white p-4 shadow-[0_14px_36px_-18px_rgba(7,50,101,.25)] sm:p-5 lg:p-4 ${needsSoftware && error ? "border-red-300 ring-2 ring-red-100" : "border-green-500/40"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-sans tracking-[-0.02em] text-lg font-semibold text-navy-900">{UI.softwareHeading}</h4>
            {needsSoftware && error && <span className="text-xs font-semibold text-red-600">{UI.softwareError}</span>}
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {SOFTWARE_OPTIONS.map((sw) => (
              <button
                key={sw}
                type="button"
                aria-pressed={sel.software === sw}
                onClick={() => update({ software: sw })}
                className={`min-h-11 rounded-full border-2 px-3 py-2 text-sm font-bold transition duration-200 ${sel.software === sw ? "border-green-600 bg-green-600 text-white shadow-[0_8px_18px_-8px_rgba(0,135,58,.6)]" : "border-line text-ink/80 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50/50"}`}
              >
                {sw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
