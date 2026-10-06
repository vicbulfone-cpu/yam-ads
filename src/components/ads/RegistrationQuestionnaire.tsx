"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { logo } from "@/config/site.config";
import { BIZ_MATCH_KEY, type BizCategory } from "@/content/business-questionnaire";
import { REG_CATEGORIES, REG_MODES, REG_Q as Q, REG_STAGE } from "@/content/registration-questionnaire";
import { LEAVE_PROMPT } from "@/content/leave-prompt";
import { getVisitorRecord } from "@/lib/visitor";
import { ArrowRight, Check, Clock, Close, Doc, Mail, Phone, Pin, Sparkle } from "../ui/Icons";
import { AdProgress, ChoiceCard, cleanPhone, EMAIL, MatchSearching, MOBILE, NoteField, OptionCard, openMatchPage, readTracking, startSearchTimer, StepHead, TextField } from "./QuestionnaireParts";
import { REG_CATEGORY_ICONS } from "./BizIcons";
import PostcodeBox, { type Place } from "./PostcodeBox";
import PhoneFit from "../ui/PhoneFit";

/**
 * The registration questionnaire (registration ad page /ad-4). Same popup, progress header and option cards as the
 * business and SMSF questionnaires, with the owner's registration questions (6 Oct 2026):
 *   one page per ticked category (exact requirements) → new or existing business? (+ optional note) → name →
 *   summary (confirm) → in person or remote → postcode/suburb → 3-second search → "great news" box asking for email →
 *   mobile → email the match details? → match page (/ad-6).
 * Each page counts as one step in the progress bar (max 5 milestones). Opened by the registration match box (OPEN_REG_QUESTIONNAIRE).
 */

import { OPEN_REG_QUESTIONNAIRE } from "@/lib/questionnaire-events";
const MATCH_PAGE = "/ad-6";

type CatAnswer = { ids: string[]; other: string };
type Step = { kind: "cat"; id: string } | { kind: "qualify" | "summary" | "mode" | "location" | "email" | "phone" | "name" | "emailMe" };

/** Faded picture in each step's box (credits: docs/image-credits*.md). */
const STEP_PICTURES: Record<string, string> = {
  company: "/images/stock/general-documents-signing.webp",
  abn_tax: "/images/stock/topic-bas-gst.webp",
  business_name: "/images/au/business-cafe-barista.webp",
  structure: "/images/stock/topic-business-structures.webp",
  qualify: "/images/stock/topic-new-business.webp",
  name: "/images/stock/general-handshake.webp",
  summary: "/images/stock/general-calculator-desk.webp",
  mode: "/images/home/accountant-client-desk.webp",
  location: "/images/au/place-mainstreet.webp",
  phone: "/images/stock/general-phone-call.webp",
  emailMe: "/images/home/woman-laptop-office.webp",
};

const emptyAnswer = (): CatAnswer => ({ ids: [], other: "" });
const catById = (id: string) => REG_CATEGORIES.find((c) => c.id === id)!;
const labelOf = (list: { id: string; label: string }[], id: string | null) => list.find((x) => x.id === id)?.label ?? "";

/** Labels the visitor chose in one category (used by the summary, the lead and the match page). */
function chosenLabels(cat: BizCategory, a: CatAnswer | undefined) {
  if (!a) return [];
  return cat.options.filter((o) => a.ids.includes(o.id)).map((o) => (o.other && a.other.trim() ? `${o.label.split(" — ")[0]}: ${a.other.trim()}` : o.label));
}

export default function RegistrationQuestionnaire() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stayRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, CatAnswer>>({});
  const [stage, setStage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [stepIdx, setStepIdx] = useState(0);
  const [backToSummary, setBackToSummary] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [searching, setSearching] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [emailMe, setEmailMe] = useState<boolean | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [matching, setMatching] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const steps: Step[] = useMemo(() => [
    ...cats.map((id) => ({ kind: "cat" as const, id })),
    // new or existing business, then the name, so every later question can use it
    { kind: "qualify" }, { kind: "name" }, { kind: "summary" }, { kind: "mode" }, { kind: "location" }, { kind: "email" }, { kind: "phone" }, { kind: "emailMe" },
  ], [cats]);
  const step = steps[Math.min(stepIdx, steps.length - 1)];
  const stepKey = step.kind === "cat" ? step.id : step.kind;
  const idxOf = (k: Step["kind"]) => steps.findIndex((s) => s.kind === k);

  const show = useCallback((ids: string[]) => {
    setCats(ids);
    setAnswers({});
    setStage(null); setNotes("");
    setStepIdx(0);
    setBackToSummary(false);
    setMode(null);
    setPlace(null);
    setSearching(false);
    setEmail(""); setPhone(""); setName(""); setEmailMe(null);
    setError(null);
    setSending(false);
    setConfirmLeave(false);
    setOpen(true);
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "questionnaire_start", { questionnaire: "registration", categories: ids.join(",") });
  }, []);

  const close = useCallback(() => { setOpen(false); setConfirmLeave(false); }, []);

  useEffect(() => {
    const onOpen = (e: Event) => show((e as CustomEvent<string[]>).detail ?? []);
    window.addEventListener(OPEN_REG_QUESTIONNAIRE, onOpen);
    return () => window.removeEventListener(OPEN_REG_QUESTIONNAIRE, onOpen);
  }, [show]);

  // native dialog: focus trap, Esc key and top layer come for free
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.classList.toggle("q-modal-open", open);
  }, [open]);

  // the browser's own "leave site?" warning while part-way through
  useEffect(() => {
    if (!open) return;
    const warn = (e: BeforeUnloadEvent) => { if (!sending) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [open, sending]);

  useEffect(() => { if (confirmLeave) stayRef.current?.focus(); }, [confirmLeave]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    if (["phone", "name"].includes(step.kind)) window.setTimeout(() => fieldRef.current?.focus(), 80);
  }, [stepIdx, step.kind]);

  // postcode list and match page are loaded in the background, so both appear straight away when needed
  useEffect(() => { if (open) void fetch("/data/au-postcodes.txt", { priority: "low" } as RequestInit).catch(() => {}); }, [open]);
  useEffect(() => { if (open) router.prefetch(MATCH_PAGE); }, [open, router]);
  useEffect(() => () => document.documentElement.classList.remove("q-modal-open"), []);

  const goTo = (i: number) => { setError(null); setStepIdx(i); };
  // first name, capitalised, for the personalised questions ({name} in the wording)
  const first = name.trim().split(/\s+/)[0] ?? "";
  const firstName = first ? first[0].toUpperCase() + first.slice(1) : "";
  const p = (text: string) => (firstName
    ? text.replaceAll("{name}", firstName)
    : text.replace(/^\{name\}, (.)/, (_, c: string) => c.toUpperCase()).replace(/,? \{name\}/g, ""));

  // ---------- category answers ----------
  const cur = step.kind === "cat" ? catById(step.id) : null;
  const sel = cur ? answers[cur.id] ?? emptyAnswer() : null;
  const patch = (np: Partial<CatAnswer>) => {
    if (!cur || !sel) return;
    setAnswers((a) => ({ ...a, [cur.id]: { ...sel, ...np } }));
    setError(null);
  };
  // the owner's lists include "Not sure…" / "Help choosing…" options; they can be ticked together with the others
  const toggle = (id: string) => {
    if (!sel) return;
    patch({ ids: sel.ids.includes(id) ? sel.ids.filter((x) => x !== id) : [...sel.ids, id] });
  };

  /** About-the-business lines (new/existing and the note) for the summary, the lead and the match page. */
  const aboutLines = () => [
    { label: Q.summaryLabels.stage, value: labelOf(REG_STAGE, stage) },
    ...(notes.trim() ? [{ label: Q.summaryLabels.notes, value: notes.trim() }] : []),
  ];

  // ---------- moving on ----------
  const next = () => {
    switch (step.kind) {
      case "cat": {
        if (!cur || !sel || !sel.ids.length) return setError(Q.errors.category);
        if (cur.options.some((o) => o.other && sel.ids.includes(o.id)) && !sel.other.trim()) return setError(Q.errors.other);
        if (backToSummary) { setBackToSummary(false); return goTo(idxOf("summary")); }
        return goTo(stepIdx + 1);
      }
      case "qualify":
        if (!stage) return setError(Q.errors.stage);
        if (backToSummary) { setBackToSummary(false); return goTo(idxOf("summary")); }
        return goTo(stepIdx + 1);
      case "name":
        if (name.trim().length < 2) return setError(Q.errors.name);
        return goTo(stepIdx + 1);
      case "summary":
        return goTo(stepIdx + 1);
      case "mode":
        if (!mode) return setError(Q.errors.mode);
        return goTo(stepIdx + 1);
      case "location":
        if (!place) return setError(Q.errors.location);
        setError(null);
        setSearching(true);
        // a short pause while we "look", then the good-news box asks for the email address
        window.setTimeout(() => { setSearching(false); setStepIdx((i) => i + 1); }, 3000);
        return;
      case "email":
        if (!EMAIL.test(email.trim())) return setError(Q.errors.email);
        return goTo(stepIdx + 1);
      case "phone":
        if (!MOBILE.test(cleanPhone(phone))) return setError(Q.errors.phone);
        return goTo(stepIdx + 1);
      case "emailMe":
        if (emailMe === null) return setError(Q.errors.emailMe);
        return void submit();
    }
  };

  const back = () => {
    if (searching) return;
    setError(null);
    if (stepIdx === 0) return setConfirmLeave(true);
    if (backToSummary) { setBackToSummary(false); return goTo(idxOf("summary")); }
    goTo(stepIdx - 1);
  };

  async function submit() {
    if (!place) return;
    setSending(true);
    setError(null);
    // the personal "searching" screen stays up for 5 seconds while the lead is sent
    const holdSearching = startSearchTimer();
    setMatching(true);
    router.prefetch(MATCH_PAGE);
    const about = aboutLines();
    const services = [
      ...cats.flatMap((id) => chosenLabels(catById(id), answers[id]).map((l) => `${catById(id).title}: ${l}`)),
      ...about.map((a) => `${a.label}: ${a.value}`),
    ];
    const modeLabel = REG_MODES.find((m) => m.id === mode)?.label ?? "";
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adType: "registration",
          name: name.trim(), email: email.trim(), phone: cleanPhone(phone),
          postcode: place.postcode, suburb: place.suburb, state: place.state,
          services,
          answers: { ...answers, businessStage: stage, notes: notes.trim() },
          workMode: modeLabel,
          emailMatchDetails: emailMe === true,
          matchPageUrl: `${window.location.origin}${MATCH_PAGE}`,
          tracking: readTracking(),
          visitor: getVisitorRecord()?.visitorId ?? null,
          website: honeypot,
        }),
      });
      const data = (await res.json()) as { ok: boolean; leadId?: string };
      if (!res.ok || !data.ok || !data.leadId) throw new Error("not ok");
      // what the match page shows back to the customer (their own answers only; kept in this browser tab)
      sessionStorage.setItem(BIZ_MATCH_KEY, JSON.stringify({
        adType: "registration", leadId: data.leadId, name: name.trim(), email: email.trim(), emailMe: emailMe === true, mode: modeLabel, place,
        services: [
          ...cats.map((id) => ({ category: catById(id).title, items: chosenLabels(catById(id), answers[id]) })),
          { category: Q.summaryLabels.about, items: about.map((a) => `${a.label}: ${a.value}`) },
        ],
      }));
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "questionnaire_complete", { questionnaire: "registration" });
      // the popup stays open ("Preparing your match…") until the match page replaces this page
      await holdSearching();
      openMatchPage(router, `${MATCH_PAGE}?lead=${data.leadId}`);
    } catch {
      setMatching(false);
      setSending(false);
      setError(Q.errors.send);
    }
  }

  // ---------- progress ----------
  const total = steps.length;
  const stepNumber = stepIdx + 1;
  const ready =
    step.kind === "cat" ? Boolean(sel?.ids.length)
      : step.kind === "qualify" ? Boolean(stage)
        : step.kind === "mode" ? Boolean(mode)
          : step.kind === "location" ? Boolean(place)
            : step.kind === "phone" ? MOBILE.test(cleanPhone(phone))
              : step.kind === "name" ? name.trim().length >= 2
                : step.kind === "emailMe" ? emailMe !== null
                  : step.kind === "summary";
  const nextLabel = step.kind === "summary" ? Q.summary.confirm : step.kind === "location" ? Q.location.find : step.kind === "emailMe" ? Q.emailMe.submit : Q.next;
  // the postcode step stays on screen behind the email box
  const bodyKind = step.kind === "email" ? "location" : step.kind;

  return (
    <dialog
      ref={dialogRef}
      className="q-modal bq"
      aria-label={Q.badge}
      onCancel={(e) => { e.preventDefault(); if (confirmLeave) setConfirmLeave(false); else if (!sending) setConfirmLeave(true); }}
    >
      {open && (
        <div className="relative flex h-full max-h-[inherit] flex-col">
          <div className="q-modal-top flex shrink-0 items-center justify-between gap-3 border-b border-line/70 bg-white/90 px-4 py-2.5 sm:px-6">
            <Image src={logo.srcSmall} alt={logo.alt} width={680} height={91} className="h-auto w-[170px] sm:w-[210px]" />
            <button type="button" onClick={() => setConfirmLeave(true)} aria-label="Close" className="q-modal-close" disabled={sending}>
              <Close width={20} height={20} strokeWidth={2.4} />
            </button>
          </div>

          <div ref={scrollRef} data-bg="biz" className="q-modal-body min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <PhoneFit>
            <AdProgress stepNumber={stepNumber} total={total} badge={Q.badge} stepOf={Q.stepOf} />
            <form
              className="q-form mx-auto w-full max-w-4xl px-4 pb-6 pt-6 sm:px-8 lg:pb-4 lg:pt-5"
              onSubmit={(e) => { e.preventDefault(); next(); }}
              noValidate
            >
              {/* spam trap: hidden from people, bots fill it in */}
              <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
              <div className="bq-box" style={{ "--bq-img": `url("${STEP_PICTURES[step.kind === "email" ? "location" : stepKey]}")` } as React.CSSProperties}>
                {bodyKind === "cat" && cur && sel && (
                  <CategoryStep cat={cur} index={stepIdx} total={cats.length} sel={sel} toggle={toggle} patch={patch} error={error} />
                )}
                {bodyKind === "qualify" && (
                  <StepHead eyebrow={Q.qualify.eyebrow} title={Q.qualify.title} icon={<Doc width={26} height={26} />}>
                    <div role="radiogroup" aria-label={Q.qualify.title} className="grid gap-2.5 sm:grid-cols-2">
                      {REG_STAGE.map((o) => (
                        <ChoiceCard key={o.id} checked={stage === o.id} onSelect={() => { setStage(o.id); setError(null); }} label={o.label} warn={Boolean(error) && !stage} />
                      ))}
                    </div>
                    <NoteField label={Q.qualify.noteLabel} value={notes} onChange={setNotes} placeholder={Q.qualify.notePlaceholder} rows={2} />
                  </StepHead>
                )}
                {bodyKind === "summary" && (
                  <SummaryStep cats={cats} answers={answers} about={aboutLines()} personalise={p}
                    onEdit={(k) => { setBackToSummary(true); goTo(k === "qualify" ? idxOf("qualify") : k); }} />
                )}
                {bodyKind === "mode" && (
                  <StepHead eyebrow={Q.mode.eyebrow} title={p(Q.mode.title)} icon={<Sparkle width={26} height={26} />}>
                    <div role="radiogroup" aria-label={p(Q.mode.title)} className="grid gap-2.5 sm:grid-cols-3">
                      {REG_MODES.map((m) => (
                        <ChoiceCard key={m.id} checked={mode === m.id} onSelect={() => { setMode(m.id); setError(null); }} label={m.label} desc={m.desc} />
                      ))}
                    </div>
                  </StepHead>
                )}
                {bodyKind === "location" && (
                  <StepHead eyebrow={Q.location.eyebrow} title={p(Q.location.title)} icon={<Pin width={26} height={26} />}>
                    <PostcodeBox value={place} onChange={(pl) => { setPlace(pl); setError(null); }} invalid={Boolean(error)} />
                  </StepHead>
                )}
                {bodyKind === "phone" && (
                  <StepHead eyebrow={Q.phone.eyebrow} title={p(Q.phone.title)} icon={<Phone width={26} height={26} />}>
                    <TextField ref={fieldRef} label={Q.phone.label} type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(v) => { setPhone(v); setError(null); }} placeholder={Q.phone.placeholder} invalid={Boolean(error)} />
                    <p className="bq-note"><span aria-hidden className="bq-note-icon"><Check width={14} height={14} strokeWidth={3} /></span>{Q.phone.note}</p>
                  </StepHead>
                )}
                {bodyKind === "name" && (
                  <StepHead eyebrow={Q.name.eyebrow} title={Q.name.title} icon={<Sparkle width={26} height={26} />}>
                    <TextField ref={fieldRef} label={Q.name.label} autoComplete="name" value={name} onChange={(v) => { setName(v); setError(null); }} placeholder={Q.name.placeholder} invalid={Boolean(error)} />
                  </StepHead>
                )}
                {bodyKind === "emailMe" && (
                  <StepHead eyebrow={Q.emailMe.eyebrow} title={p(Q.emailMe.title)} icon={<Mail width={26} height={26} />}>
                    <div role="radiogroup" aria-label={p(Q.emailMe.title)} className="grid gap-2.5 sm:grid-cols-2">
                      <ChoiceCard checked={emailMe === true} onSelect={() => { setEmailMe(true); setError(null); }} label={Q.emailMe.yes} desc={Q.emailMe.to.replace("{email}", email.trim())} />
                      <ChoiceCard checked={emailMe === false} onSelect={() => { setEmailMe(false); setError(null); }} label={Q.emailMe.no} />
                    </div>
                  </StepHead>
                )}
              </div>
              {/* Enter in a text box moves on */}
              <button type="submit" hidden />
            </form>
            </PhoneFit>
          </div>

          <div className="q-modal-footer shrink-0 border-t border-line/70 bg-white/95 px-4 py-3 sm:px-8">
            {error && step.kind !== "email" && <p role="alert" className="mb-2 text-center text-sm font-semibold text-red-600">{error}</p>}
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
              <button type="button" onClick={back} disabled={sending || searching} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted transition hover:text-navy-900 disabled:opacity-40">
                <ArrowRight width={16} height={16} strokeWidth={2.5} className="rotate-180" />
                {Q.back}
              </button>
              <button type="button" onClick={next} disabled={sending || searching} className={`btn btn-primary min-h-12 px-8 sm:px-10 ${ready && !sending ? "q-next-ready" : ""}`}>
                <span>{sending ? Q.emailMe.sending : nextLabel}</span>
                <span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
              </button>
            </div>
          </div>

          {/* 3-second search after the postcode */}
          {/* after the last question: 5 seconds of "John, we are now searching…" until the match page opens */}
          {matching && <MatchSearching firstName={firstName} />}

          {searching && place && (
            <div className="q-leave" role="status" aria-live="polite">
              <div className="q-leave-box bq-search">
                <span aria-hidden className="bq-radar"><Pin width={28} height={28} strokeWidth={2.2} /></span>
                <p className="q-leave-title">{p(Q.searching.title)}</p>
                <p className="mt-2 text-[0.98rem] font-medium text-muted">{Q.searching.near.replace("{place}", `${place.suburb} ${place.postcode}`)}</p>
                <span aria-hidden className="bq-search-bar"><span /></span>
              </div>
            </div>
          )}

          {/* good news: ask for the email address */}
          {step.kind === "email" && !confirmLeave && (
            <div className="q-leave" role="dialog" aria-modal="true" aria-labelledby="rq-found-title">
              <form className="q-leave-box bq-found" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                <span aria-hidden className="q-leave-icon bq-found-icon"><Sparkle width={30} height={30} strokeWidth={2} /></span>
                <p id="rq-found-title" className="q-leave-title">{p(Q.found.title)}</p>
                <p className="mt-2 text-[1rem] leading-snug text-ink/80">{p(Q.found.text)}</p>
                <div className="mt-5 text-left">
                  <TextField label={Q.found.label} type="email" autoComplete="email" inputMode="email" value={email} onChange={(v) => { setEmail(v); setError(null); }} placeholder={Q.found.placeholder} invalid={Boolean(error)} autoFocus />
                </div>
                {error && <p role="alert" className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
                <button type="submit" className={`btn btn-primary mt-4 min-h-12 w-full ${EMAIL.test(email.trim()) ? "q-next-ready" : ""}`}>
                  <span>{Q.found.button}</span>
                  <span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
                </button>
                <button type="button" onClick={back} className="q-leave-exit mt-2 w-full">{Q.back}</button>
              </form>
            </div>
          )}

          {confirmLeave && (
            <div className="q-leave" role="alertdialog" aria-modal="true" aria-labelledby="rq-leave-title" aria-describedby="rq-leave-text">
              <div className="q-leave-box">
                <span aria-hidden className="q-leave-icon"><Clock width={30} height={30} strokeWidth={2} /></span>
                <p id="rq-leave-title" className="q-leave-title">{LEAVE_PROMPT.title}</p>
                <p id="rq-leave-text" className="q-leave-text">{LEAVE_PROMPT.text}</p>
                <div className="mt-6 grid gap-2.5">
                  <button ref={stayRef} type="button" onClick={() => setConfirmLeave(false)} className="btn btn-primary min-h-12 w-full">
                    <span>{LEAVE_PROMPT.stay}</span>
                    <span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
                  </button>
                  <button type="button" onClick={close} className="q-leave-exit">{LEAVE_PROMPT.leave}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

function CategoryStep({ cat, index, total, sel, toggle, patch, error }: {
  cat: BizCategory; index: number; total: number; sel: CatAnswer; error: string | null;
  toggle: (id: string) => void; patch: (p: Partial<CatAnswer>) => void;
}) {
  const showOther = cat.options.some((o) => o.other && sel.ids.includes(o.id));
  return (
    <div className="space-y-4 lg:space-y-3.5">
      <div className="flex items-start gap-4">
        <span aria-hidden className={`bz-tile is-${cat.tone} !w-14 shrink-0`}><svg viewBox="0 0 24 24">{REG_CATEGORY_ICONS[cat.id]}</svg></span>
        <div className="min-w-0 space-y-1">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green-700">
            {Q.categoryOf.replace("{n}", String(index + 1)).replace("{total}", String(total))}
          </span>
          <h3 className="font-sans tracking-[-0.02em] text-[1.5rem] font-semibold leading-tight text-navy-900 sm:text-[1.8rem]">{cat.title}</h3>
        </div>
      </div>
      <p className="max-w-2xl rounded-xl border-l-4 border-green-500 bg-green-50/80 px-4 py-2.5 text-[0.95rem] leading-snug text-ink/80">
        {Q.categoryHelp.replace("{category}", cat.title.toLowerCase().replace("abn", "ABN"))}
      </p>
      <fieldset className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-2">
        <legend className="sr-only">{cat.title}</legend>
        {cat.options.map((o) => (
          <OptionCard key={o.id} checked={sel.ids.includes(o.id)} onToggle={() => toggle(o.id)} label={o.label} warn={Boolean(error) && !sel.ids.length} />
        ))}
      </fieldset>
      {showOther && (
        <NoteField label={Q.otherLabel} value={sel.other} onChange={(v) => patch({ other: v })} placeholder={Q.otherPlaceholder} />
      )}
    </div>
  );
}

function SummaryStep({ cats, answers, about, onEdit, personalise: p }: {
  cats: string[]; answers: Record<string, CatAnswer>; about: { label: string; value: string }[];
  onEdit: (stepIndex: number | "qualify") => void; personalise: (t: string) => string;
}) {
  const card = "rounded-2xl border border-line bg-white/95 p-4 shadow-[0_10px_28px_-18px_rgba(7,50,101,.35)]";
  const editBtn = "min-h-10 rounded-full px-3 text-sm font-semibold text-green-700 underline-offset-2 hover:bg-green-50 hover:underline";
  return (
    <StepHead eyebrow={Q.summary.eyebrow} title={p(Q.summary.title)} icon={<Check width={26} height={26} strokeWidth={3} />}>
      <p className="text-[0.98rem] leading-snug text-ink/80">{p(Q.summary.text)}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {cats.map((id, i) => {
          const cat = catById(id);
          return (
            <li key={id} className={card}>
              <div className="mb-2 flex items-center gap-3">
                <span aria-hidden className={`bz-tile is-${cat.tone} !w-10 shrink-0`}><svg viewBox="0 0 24 24">{REG_CATEGORY_ICONS[id]}</svg></span>
                <p className="flex-1 font-bold leading-tight text-navy-900">{cat.title}</p>
                <button type="button" onClick={() => onEdit(i)} className={editBtn}>
                  {Q.summary.edit}<span className="sr-only"> {cat.title}</span>
                </button>
              </div>
              <ul className="space-y-1.5">
                {chosenLabels(cat, answers[id]).map((l) => (
                  <li key={l} className="flex gap-2 text-[0.93rem] leading-snug text-ink/85">
                    <Check aria-hidden width={16} height={16} strokeWidth={3} className="mt-0.5 shrink-0 text-green-600" />{l}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
        <li className={card}>
          <div className="mb-2 flex items-center gap-3">
            <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.8rem] bg-green-50 text-green-700"><Doc width={22} height={22} /></span>
            <p className="flex-1 font-bold leading-tight text-navy-900">{Q.summaryLabels.about}</p>
            <button type="button" onClick={() => onEdit("qualify")} className={editBtn}>
              {Q.summary.edit}<span className="sr-only"> {Q.summaryLabels.about}</span>
            </button>
          </div>
          <dl className="space-y-1.5 text-[0.93rem] leading-snug">
            {about.map((a) => (
              <div key={a.label}>
                <dt className="inline font-semibold text-navy-900">{a.label}: </dt>
                <dd className="inline break-words text-ink/85">{a.value}</dd>
              </div>
            ))}
          </dl>
        </li>
      </ul>
    </StepHead>
  );
}
