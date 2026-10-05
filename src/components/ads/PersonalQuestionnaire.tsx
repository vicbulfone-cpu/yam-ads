"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { logo } from "@/config/site.config";
import { BIZ_MATCH_KEY } from "@/content/business-questionnaire";
import { LEAVE_PROMPT } from "@/content/leave-prompt";
import {
  ADVICE_TOPICS, financialYears, PERSONAL_MODES, PERSONAL_NEEDS, PERSONAL_Q as Q, RETURN_ITEMS, RETURN_NEEDS, STILL_UNSURE,
  YES_NO_UNSURE, type NeedId,
} from "@/content/personal-questionnaire";
import { getVisitorRecord } from "@/lib/visitor";
import { ArrowRight, Check, Clock, Close, Doc, Mail, Phone, Pin, Sparkle } from "../ui/Icons";
import { PERSONAL_NEED_ICONS } from "./BizIcons";
import PostcodeBox, { type Place } from "./PostcodeBox";
import { AdProgress, ChoiceCard, cleanPhone, EMAIL, MOBILE, NoteField, OptionCard, openMatchPage, readTracking, StepHead, TextField } from "./QuestionnaireParts";

/**
 * The personal tax questionnaire (personal ad page /ad-2). Same popup, progress header and option cards as the business
 * questionnaire (BusinessQuestionnaire.tsx), with the owner's personal-tax questions:
 *   ["help me choose"] → follow-up for the main reason → "Does your return include any of these?" (returns only) →
 *   name → summary (confirm, optional note) → in person or remote → postcode/suburb → 3-second search →
 *   "great news" box asking for email → mobile → email the match details? → match page (/ad-6).
 * Each page counts as one step in the progress bar. Opened by the personal match box (OPEN_PERSONAL_QUESTIONNAIRE event,
 * detail = the chosen reason, or "choose" for "Not sure — help me choose").
 */

export const OPEN_PERSONAL_QUESTIONNAIRE = "yam:open-personal-questionnaire";
const MATCH_PAGE = "/ad-6";

type Kind = "choose" | "followup" | "income" | "name" | "summary" | "mode" | "location" | "email" | "phone" | "emailMe";

/** Faded picture in each step's box (credits: docs/image-credits*.md). The follow-up page uses its reason's picture. */
const STEP_PICTURES: Record<string, string> = {
  choose: "/images/stock/general-couple-finances.webp",
  this_year: "/images/stock/topic-tax-return.webp",
  overdue: "/images/stock/general-calculator-desk.webp",
  amend: "/images/stock/general-documents-signing.webp",
  planning: "/images/stock/topic-tax-planning.webp",
  income: "/images/stock/topic-investing.webp",
  name: "/images/stock/general-handshake.webp",
  summary: "/images/stock/general-home-office.webp",
  mode: "/images/home/accountant-client-desk.webp",
  location: "/images/au/place-mainstreet.webp",
  phone: "/images/stock/general-phone-call.webp",
  emailMe: "/images/home/woman-laptop-home.webp",
};

const UNSURE = { id: "unsure", label: "Not sure" };
/** "Not sure" can't be ticked together with anything else on the same page. */
const toggleIn = (list: string[], id: string) =>
  id === "unsure" ? (list.includes(id) ? [] : [id])
    : list.includes(id) ? list.filter((x) => x !== id) : [...list.filter((x) => x !== "unsure"), id];
const needTitle = (n: NeedId | null) => (n === "unsure" ? STILL_UNSURE.title : PERSONAL_NEEDS.find((x) => x.id === n)?.title ?? "");
const labelOf = (list: { id: string; label: string }[], id: string | null) => list.find((x) => x.id === id)?.label ?? "";

export default function PersonalQuestionnaire() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stayRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const needBeforeEdit = useRef<NeedId | null>(null);

  const [open, setOpen] = useState(false);
  const [showChoose, setShowChoose] = useState(false);
  const [need, setNeed] = useState<NeedId | null>(null);
  // follow-up answers
  const [year, setYear] = useState<string | null>(null);
  const [first, setFirst] = useState<string | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [amendNote, setAmendNote] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [topicOther, setTopicOther] = useState("");
  const [income, setIncome] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  // shared with the business questionnaire
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
  const [confirmLeave, setConfirmLeave] = useState(false);

  // financial years are worked out from today's date (the newest completed year first)
  const fy = useMemo(() => financialYears(5), []);
  const yearOptions = useMemo(() => ({
    thisYear: [...fy.slice(0, 2), UNSURE],
    amend: [...fy, { id: "earlier", label: Q.amend.earlier }, UNSURE],
    overdue: [...fy, { id: "earlier", label: Q.overdue.earlier }, UNSURE],
  }), [fy]);

  const steps: Kind[] = useMemo(() => {
    const s: Kind[] = showChoose ? ["choose"] : [];
    const n = need ?? "this_year"; // before a reason is picked, count the pages a tax return needs
    if (n !== "unsure") s.push("followup");
    if (RETURN_NEEDS.includes(n)) s.push("income");
    // the name comes straight after the service questions, so every later question can use it
    return [...s, "name", "summary", "mode", "location", "email", "phone", "emailMe"];
  }, [showChoose, need]);
  const kind = steps[Math.min(stepIdx, steps.length - 1)];
  const idxOf = (k: Kind) => steps.indexOf(k);

  const resetFollowUp = () => { setYear(null); setFirst(null); setYears([]); setAmendNote(""); setTopics([]); setTopicOther(""); };

  const show = useCallback((detail: string) => {
    const chosen = detail === "choose" ? null : (detail as NeedId);
    setShowChoose(!chosen);
    setNeed(chosen);
    setYear(null); setFirst(null); setYears([]); setAmendNote(""); setTopics([]); setTopicOther(""); setIncome([]); setNotes("");
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
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "questionnaire_start", { questionnaire: "personal", need: detail });
  }, []);

  const close = useCallback(() => { setOpen(false); setConfirmLeave(false); }, []);

  useEffect(() => {
    const onOpen = (e: Event) => show((e as CustomEvent<string>).detail ?? "choose");
    window.addEventListener(OPEN_PERSONAL_QUESTIONNAIRE, onOpen);
    return () => window.removeEventListener(OPEN_PERSONAL_QUESTIONNAIRE, onOpen);
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
    if (["phone", "name"].includes(kind)) window.setTimeout(() => fieldRef.current?.focus(), 80);
  }, [stepIdx, kind]);

  // postcode list and match page are loaded in the background, so both appear straight away when needed
  useEffect(() => { if (open) void fetch("/data/au-postcodes.txt", { priority: "low" } as RequestInit).catch(() => {}); }, [open]);
  useEffect(() => { if (open) router.prefetch(MATCH_PAGE); }, [open, router]);
  useEffect(() => () => document.documentElement.classList.remove("q-modal-open"), []);

  const goTo = (i: number) => { setError(null); setStepIdx(i); };
  const firstWord = name.trim().split(/\s+/)[0] ?? "";
  const firstName = firstWord ? firstWord[0].toUpperCase() + firstWord.slice(1) : "";
  const p = (text: string) => (firstName
    ? text.replaceAll("{name}", firstName)
    : text.replace(/^\{name\}, (.)/, (_, c: string) => c.toUpperCase()).replace(/,? \{name\}/g, ""));
  const clear = () => setError(null);

  // ---------- what the visitor told us, as label/value lines (summary, lead and match page) ----------
  const detailLines = (): { label: string; value: string }[] => {
    const L = Q.summaryLabels;
    switch (need) {
      case "this_year":
        return [{ label: L.year, value: labelOf(yearOptions.thisYear, year) }, { label: L.first, value: labelOf(YES_NO_UNSURE, first) }];
      case "overdue":
        return [{ label: L.years, value: yearOptions.overdue.filter((o) => years.includes(o.id)).map((o) => o.label).join(", ") }];
      case "amend":
        return [{ label: L.year, value: labelOf(yearOptions.amend, year) }, ...(amendNote.trim() ? [{ label: L.correcting, value: amendNote.trim() }] : [])];
      case "planning":
        return [{ label: L.advice, value: ADVICE_TOPICS.filter((o) => topics.includes(o.id)).map((o) => (o.id === "other" && topicOther.trim() ? `Other: ${topicOther.trim()}` : o.label)).join(", ") }];
      default:
        return [];
    }
  };
  const incomeLabels = () => RETURN_ITEMS.filter((o) => income.includes(o.id)).map((o) => o.label);

  // ---------- moving on ----------
  const next = () => {
    switch (kind) {
      case "choose": {
        if (!need) return setError(Q.errors.need);
        // editing from the summary with the same reason: straight back; a new reason needs its own questions first
        if (backToSummary && need === needBeforeEdit.current) { setBackToSummary(false); return goTo(idxOf("summary")); }
        setBackToSummary(false);
        return goTo(stepIdx + 1);
      }
      case "followup": {
        if (need === "this_year" && !year) return setError(Q.errors.year);
        if (need === "this_year" && !first) return setError(Q.errors.first);
        if (need === "overdue" && !years.length) return setError(Q.errors.years);
        if (need === "amend" && !year) return setError(Q.errors.year);
        if (need === "planning" && !topics.length) return setError(Q.errors.topics);
        if (need === "planning" && topics.includes("other") && !topicOther.trim()) return setError(Q.errors.other);
        if (backToSummary) { setBackToSummary(false); return goTo(idxOf("summary")); }
        return goTo(stepIdx + 1);
      }
      case "income":
        if (!income.length) return setError(Q.errors.income);
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

  /** Summary "Change" links. Changing the main reason shows the "help me choose" page (added if it wasn't asked). */
  const edit = (k: "choose" | "followup" | "income") => {
    setBackToSummary(true);
    if (k === "choose") {
      needBeforeEdit.current = need;
      setShowChoose(true);
      return goTo(0);
    }
    goTo(idxOf(k));
  };

  async function submit() {
    if (!place || !need) return;
    setSending(true);
    setError(null);
    const title = needTitle(need);
    const details = detailLines();
    const inc = RETURN_NEEDS.includes(need) ? incomeLabels() : [];
    const services = [
      `Need: ${title}`,
      ...details.map((d) => `${d.label}: ${d.value}`),
      ...inc.map((i) => `${Q.summaryLabels.income}: ${i}`),
      ...(notes.trim() ? [`${Q.summaryLabels.notes}: ${notes.trim()}`] : []),
    ];
    const modeLabel = PERSONAL_MODES.find((m) => m.id === mode)?.label ?? "";
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adType: "personal",
          name: name.trim(), email: email.trim(), phone: cleanPhone(phone),
          postcode: place.postcode, suburb: place.suburb, state: place.state,
          services,
          answers: { need, year, firstReturn: first, years, amendNote: amendNote.trim(), adviceTopics: topics, adviceOther: topicOther.trim(), returnIncludes: income, notes: notes.trim() },
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
        adType: "personal", leadId: data.leadId, name: name.trim(), email: email.trim(), emailMe: emailMe === true, mode: modeLabel, place,
        services: [
          { category: title, items: details.map((d) => `${d.label}: ${d.value}`) },
          ...(inc.length ? [{ category: Q.summaryLabels.income, items: inc }] : []),
          ...(notes.trim() ? [{ category: Q.summaryLabels.notes, items: [notes.trim()] }] : []),
        ].filter((g) => g.items.length || g.category === title),
      }));
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "questionnaire_complete", { questionnaire: "personal" });
      // the popup stays open ("Preparing your match…") until the match page replaces this page
      openMatchPage(router, `${MATCH_PAGE}?lead=${data.leadId}`);
    } catch {
      setSending(false);
      setError(Q.errors.send);
    }
  }

  // ---------- progress ----------
  const total = steps.length;
  const ready =
    kind === "choose" ? Boolean(need)
      : kind === "followup" ? (need === "this_year" ? Boolean(year && first) : need === "overdue" ? years.length > 0 : need === "amend" ? Boolean(year) : topics.length > 0)
        : kind === "income" ? income.length > 0
          : kind === "mode" ? Boolean(mode)
            : kind === "location" ? Boolean(place)
              : kind === "phone" ? MOBILE.test(cleanPhone(phone))
                : kind === "name" ? name.trim().length >= 2
                  : kind === "emailMe" ? emailMe !== null
                    : kind === "summary";
  const nextLabel = kind === "summary" ? Q.summary.confirm : kind === "location" ? Q.location.find : kind === "emailMe" ? Q.emailMe.submit : Q.next;
  // the postcode step stays on screen behind the email box
  const bodyKind = kind === "email" ? "location" : kind;
  const picture = STEP_PICTURES[bodyKind === "followup" ? need ?? "this_year" : bodyKind];
  const warn = Boolean(error);

  return (
    <dialog
      ref={dialogRef}
      className="q-modal bq"
      aria-label={Q.badge}
      onCancel={(e) => { e.preventDefault(); if (confirmLeave) setConfirmLeave(false); else if (!sending) setConfirmLeave(true); }}
    >
      {open && (
        <div className="relative flex h-full max-h-[inherit] flex-col">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line/70 bg-white/90 px-4 py-2.5 sm:px-6">
            <Image src={logo.srcSmall} alt={logo.alt} width={680} height={91} className="h-auto w-[170px] sm:w-[210px]" />
            <button type="button" onClick={() => setConfirmLeave(true)} aria-label="Close" className="q-modal-close" disabled={sending}>
              <Close width={20} height={20} strokeWidth={2.4} />
            </button>
          </div>

          <div ref={scrollRef} data-bg="biz" className="q-modal-body min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <AdProgress stepNumber={stepIdx + 1} total={total} badge={Q.badge} stepOf={Q.stepOf} />
            <form
              className="mx-auto w-full max-w-4xl px-4 pb-6 pt-6 sm:px-8 lg:pb-4 lg:pt-5"
              onSubmit={(e) => { e.preventDefault(); next(); }}
              noValidate
            >
              {/* spam trap: hidden from people, bots fill it in */}
              <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
              <div className="bq-box" style={{ "--bq-img": `url("${picture}")` } as React.CSSProperties}>
                {bodyKind === "choose" && (
                  <StepHead eyebrow={Q.choose.eyebrow} title={Q.choose.title} icon={<Sparkle width={26} height={26} />}>
                    <p className="text-[0.98rem] leading-snug text-ink/80">{Q.choose.text}</p>
                    <div role="radiogroup" aria-label={Q.choose.title} className="grid gap-2.5 sm:grid-cols-2">
                      {[...PERSONAL_NEEDS, STILL_UNSURE].map((n) => (
                        <ChoiceCard
                          key={n.id}
                          checked={need === n.id}
                          warn={warn && !need}
                          onSelect={() => { if (need !== n.id) resetFollowUp(); setNeed(n.id); clear(); }}
                          label={n.title}
                          desc={n.help}
                        />
                      ))}
                    </div>
                  </StepHead>
                )}

                {bodyKind === "followup" && need && need !== "unsure" && (
                  <div className="space-y-4">
                    <NeedHead need={need} eyebrow={Q[need === "this_year" ? "thisYear" : need].eyebrow}
                      title={need === "planning" ? Q.planning.title : need === "overdue" ? Q.overdue.years : Q.thisYear.year} />
                    {need === "this_year" && (
                      <>
                        <ChoiceGroup label={Q.thisYear.year} hideLabel options={yearOptions.thisYear} value={year} onChange={(v) => { setYear(v); clear(); }} warn={warn && !year} cols={3} />
                        <ChoiceGroup label={Q.thisYear.first} options={YES_NO_UNSURE} value={first} onChange={(v) => { setFirst(v); clear(); }} warn={warn && Boolean(year) && !first} cols={3} />
                      </>
                    )}
                    {need === "overdue" && (
                      <>
                        <p className="text-[0.95rem] text-muted">{Q.overdue.hint}</p>
                        <fieldset className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-2">
                          <legend className="sr-only">{Q.overdue.years}</legend>
                          {yearOptions.overdue.map((o) => (
                            <OptionCard key={o.id} checked={years.includes(o.id)} onToggle={() => { setYears((y) => toggleIn(y, o.id)); clear(); }} label={o.label} warn={warn && !years.length} />
                          ))}
                        </fieldset>
                      </>
                    )}
                    {need === "amend" && (
                      <>
                        <ChoiceGroup label={Q.amend.year} hideLabel options={yearOptions.amend} value={year} onChange={(v) => { setYear(v); clear(); }} warn={warn && !year} cols={2} />
                        <NoteField label={Q.amend.noteLabel} value={amendNote} onChange={setAmendNote} placeholder={Q.amend.notePlaceholder} rows={3} />
                      </>
                    )}
                    {need === "planning" && (
                      <>
                        <p className="text-[0.95rem] text-muted">{Q.planning.hint}</p>
                        <fieldset className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-2">
                          <legend className="sr-only">{Q.planning.title}</legend>
                          {ADVICE_TOPICS.map((o) => (
                            <OptionCard key={o.id} checked={topics.includes(o.id)} onToggle={() => { setTopics((t) => toggleIn(t, o.id)); clear(); }} label={o.label} warn={warn && !topics.length} />
                          ))}
                        </fieldset>
                        {topics.includes("other") && <NoteField label={Q.otherLabel} value={topicOther} onChange={(v) => { setTopicOther(v); clear(); }} placeholder={Q.otherPlaceholder} />}
                      </>
                    )}
                  </div>
                )}

                {bodyKind === "income" && (
                  <StepHead eyebrow={Q.income.eyebrow} title={p(Q.income.title)} icon={<Doc width={26} height={26} />}>
                    <p className="text-[0.95rem] text-muted">{Q.income.hint}</p>
                    <fieldset className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-2">
                      <legend className="sr-only">{Q.income.title}</legend>
                      {RETURN_ITEMS.map((o) => (
                        <OptionCard key={o.id} checked={income.includes(o.id)} onToggle={() => { setIncome((i) => toggleIn(i, o.id)); clear(); }} label={o.label} warn={warn && !income.length} />
                      ))}
                    </fieldset>
                  </StepHead>
                )}

                {bodyKind === "name" && (
                  <StepHead eyebrow={Q.name.eyebrow} title={Q.name.title} icon={<Sparkle width={26} height={26} />}>
                    <TextField ref={fieldRef} label={Q.name.label} autoComplete="name" value={name} onChange={(v) => { setName(v); clear(); }} placeholder={Q.name.placeholder} invalid={warn} />
                  </StepHead>
                )}

                {bodyKind === "summary" && need && (
                  <StepHead eyebrow={Q.summary.eyebrow} title={p(Q.summary.title)} icon={<Check width={26} height={26} strokeWidth={3} />}>
                    <p className="text-[0.98rem] leading-snug text-ink/80">{p(Q.summary.text)}</p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      <SummaryCard title={Q.summaryLabels.need} onEdit={() => edit("choose")} need={need}>
                        <li className="font-bold text-navy-900">{needTitle(need)}</li>
                        {detailLines().map((d) => (
                          <li key={d.label} className="flex gap-2 text-[0.93rem] leading-snug text-ink/85">
                            <Check aria-hidden width={16} height={16} strokeWidth={3} className="mt-0.5 shrink-0 text-green-600" />
                            <span><span className="font-semibold">{d.label}:</span> {d.value}</span>
                          </li>
                        ))}
                        {need !== "unsure" && (
                          <li><button type="button" onClick={() => edit("followup")} className="text-sm font-semibold text-green-700 underline underline-offset-2 hover:text-green-800">{Q.summary.edit} {Q.summaryLabels.details.toLowerCase()}</button></li>
                        )}
                      </SummaryCard>
                      {RETURN_NEEDS.includes(need) && (
                        <SummaryCard title={Q.summaryLabels.income} onEdit={() => edit("income")}>
                          {incomeLabels().map((l) => (
                            <li key={l} className="flex gap-2 text-[0.93rem] leading-snug text-ink/85">
                              <Check aria-hidden width={16} height={16} strokeWidth={3} className="mt-0.5 shrink-0 text-green-600" />{l}
                            </li>
                          ))}
                        </SummaryCard>
                      )}
                    </ul>
                    <NoteField label={Q.notes.label} value={notes} onChange={setNotes} placeholder={Q.notes.placeholder} rows={3} />
                  </StepHead>
                )}

                {bodyKind === "mode" && (
                  <StepHead eyebrow={Q.mode.eyebrow} title={p(Q.mode.title)} icon={<Sparkle width={26} height={26} />}>
                    <div role="radiogroup" aria-label={p(Q.mode.title)} className="grid gap-2.5 sm:grid-cols-3">
                      {PERSONAL_MODES.map((m) => (
                        <ChoiceCard key={m.id} checked={mode === m.id} onSelect={() => { setMode(m.id); clear(); }} label={m.label} desc={m.desc} />
                      ))}
                    </div>
                  </StepHead>
                )}
                {bodyKind === "location" && (
                  <StepHead eyebrow={Q.location.eyebrow} title={p(Q.location.title)} icon={<Pin width={26} height={26} />}>
                    <PostcodeBox value={place} onChange={(pl) => { setPlace(pl); clear(); }} invalid={warn} />
                  </StepHead>
                )}
                {bodyKind === "phone" && (
                  <StepHead eyebrow={Q.phone.eyebrow} title={p(Q.phone.title)} icon={<Phone width={26} height={26} />}>
                    <TextField ref={fieldRef} label={Q.phone.label} type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(v) => { setPhone(v); clear(); }} placeholder={Q.phone.placeholder} invalid={warn} />
                    <p className="bq-note"><span aria-hidden className="bq-note-icon"><Check width={14} height={14} strokeWidth={3} /></span>{Q.phone.note}</p>
                  </StepHead>
                )}
                {bodyKind === "emailMe" && (
                  <StepHead eyebrow={Q.emailMe.eyebrow} title={p(Q.emailMe.title)} icon={<Mail width={26} height={26} />}>
                    <div role="radiogroup" aria-label={p(Q.emailMe.title)} className="grid gap-2.5 sm:grid-cols-2">
                      <ChoiceCard checked={emailMe === true} onSelect={() => { setEmailMe(true); clear(); }} label={Q.emailMe.yes} desc={Q.emailMe.to.replace("{email}", email.trim())} />
                      <ChoiceCard checked={emailMe === false} onSelect={() => { setEmailMe(false); clear(); }} label={Q.emailMe.no} />
                    </div>
                  </StepHead>
                )}
              </div>
              {/* Enter in a text box moves on */}
              <button type="submit" hidden />
            </form>
          </div>

          <div className="q-modal-footer shrink-0 border-t border-line/70 bg-white/95 px-4 py-3 sm:px-8">
            {error && kind !== "email" && <p role="alert" className="mb-2 text-center text-sm font-semibold text-red-600">{error}</p>}
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
          {kind === "email" && !confirmLeave && (
            <div className="q-leave" role="dialog" aria-modal="true" aria-labelledby="pq-found-title">
              <form className="q-leave-box bq-found" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                <span aria-hidden className="q-leave-icon bq-found-icon"><Sparkle width={30} height={30} strokeWidth={2} /></span>
                <p id="pq-found-title" className="q-leave-title">{p(Q.found.title)}</p>
                <p className="mt-2 text-[1rem] leading-snug text-ink/80">{p(Q.found.text)}</p>
                <div className="mt-5 text-left">
                  <TextField label={Q.found.label} type="email" autoComplete="email" inputMode="email" value={email} onChange={(v) => { setEmail(v); clear(); }} placeholder={Q.found.placeholder} invalid={warn} autoFocus />
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
            <div className="q-leave" role="alertdialog" aria-modal="true" aria-labelledby="pq-leave-title" aria-describedby="pq-leave-text">
              <div className="q-leave-box">
                <span aria-hidden className="q-leave-icon"><Clock width={30} height={30} strokeWidth={2} /></span>
                <p id="pq-leave-title" className="q-leave-title">{LEAVE_PROMPT.title}</p>
                <p id="pq-leave-text" className="q-leave-text">{LEAVE_PROMPT.text}</p>
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

/** Heading of a follow-up page: the reason's coloured icon square, the reason as the small label, the question below. */
function NeedHead({ need, eyebrow, title }: { need: Exclude<NeedId, "unsure">; eyebrow: string; title: string }) {
  const tone = PERSONAL_NEEDS.find((n) => n.id === need)!.tone;
  return (
    <div className="flex items-start gap-4">
      <span aria-hidden className={`bz-tile is-${tone} !w-14 shrink-0`}><svg viewBox="0 0 24 24">{PERSONAL_NEED_ICONS[need]}</svg></span>
      <div className="min-w-0 space-y-1">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green-700">{eyebrow}</span>
        <h3 className="font-sans tracking-[-0.02em] text-[1.5rem] font-semibold leading-tight text-navy-900 sm:text-[1.8rem]">{title}</h3>
      </div>
    </div>
  );
}

/** One question with single-choice cards (e.g. "Which financial year?"). */
function ChoiceGroup({ label, hideLabel, options, value, onChange, warn, cols }: {
  label: string; hideLabel?: boolean; options: { id: string; label: string; desc?: string }[]; value: string | null;
  onChange: (id: string) => void; warn?: boolean; cols: 2 | 3;
}) {
  return (
    <div className="space-y-2.5">
      {!hideLabel && <h4 className="font-sans text-lg font-semibold tracking-[-0.02em] text-navy-900">{label}</h4>}
      <div role="radiogroup" aria-label={label} className={`grid gap-2.5 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((o) => <ChoiceCard key={o.id} checked={value === o.id} onSelect={() => onChange(o.id)} label={o.label} desc={o.desc} warn={warn} />)}
      </div>
    </div>
  );
}

function SummaryCard({ title, onEdit, need, children }: { title: string; onEdit: () => void; need?: NeedId; children: React.ReactNode }) {
  const tone = PERSONAL_NEEDS.find((n) => n.id === need)?.tone ?? "green";
  return (
    <li className="rounded-2xl border border-line bg-white/95 p-4 shadow-[0_10px_28px_-18px_rgba(7,50,101,.35)]">
      <div className="mb-2 flex items-center gap-3">
        <span aria-hidden className={`bz-tile is-${tone} !w-10 shrink-0`}><svg viewBox="0 0 24 24">{PERSONAL_NEED_ICONS[need ?? "this_year"]}</svg></span>
        <p className="flex-1 font-bold leading-tight text-navy-900">{title}</p>
        <button type="button" onClick={onEdit} className="min-h-10 rounded-full px-3 text-sm font-semibold text-green-700 underline-offset-2 hover:bg-green-50 hover:underline">
          {Q.summary.edit}<span className="sr-only"> {title}</span>
        </button>
      </div>
      <ul className="space-y-1.5">{children}</ul>
    </li>
  );
}
