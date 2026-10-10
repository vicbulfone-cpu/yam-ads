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
import PhoneFit from "../ui/PhoneFit";
import { SummaryConfirmNote, SummaryPage } from "./SelectionsSummary";
import { SELECTIONS_SUMMARY } from "@/content/selections-summary";
import { AdProgress, ChoiceCard, cleanPhone, EMAIL, MatchSearching, MOBILE, NoteField, OptionCard, openMatchPage, readTracking, startSearchTimer, StepHead, TextField } from "./QuestionnaireParts";

/**
 * The personal tax questionnaire (personal ad page /ad-2). Same popup, progress header and option cards as the business
 * questionnaire (BusinessQuestionnaire.tsx), with the owner's personal-tax questions:
 *   ["help me choose"] → follow-up for each ticked reason that has one (amend, planning) → "Does your return include
 *   any of these?" (if any ticked reason is a return) →
 *   name → summary (confirm, optional note) → in person or remote → postcode/suburb → 11-second search →
 *   "great news" box asking for email → mobile → 3-second "your match is loading" → match page (/match).
 * Each page counts as one step in the progress bar. Opened by the personal match box (OPEN_PERSONAL_QUESTIONNAIRE event,
 * detail = the ticked reasons, comma separated, or "choose" for "Not sure — help me choose"). Several reasons can be
 * ticked (owner, 10 Oct 2026).
 */

import { OPEN_PERSONAL_QUESTIONNAIRE } from "@/lib/questionnaire-events";
export { OPEN_PERSONAL_QUESTIONNAIRE };
const MATCH_PAGE = "/match";

// "amend" and "planning" are each reason's own follow-up page; a visitor who ticked both sees both, one after the other
type Kind = "choose" | "amend" | "planning" | "income" | "name" | "summary" | "mode" | "location" | "email" | "phone" | "emailMe";

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
/** the ticked reasons in the box's order (owner, 10 Oct 2026: several can be ticked) */
const NEED_ORDER: NeedId[] = [...PERSONAL_NEEDS.map((n) => n.id), STILL_UNSURE.id];
const inOrder = (list: NeedId[]) => NEED_ORDER.filter((id) => list.includes(id));
const sameNeeds = (a: NeedId[], b: NeedId[]) => a.length === b.length && a.every((x) => b.includes(x));
const labelOf = (list: { id: string; label: string }[], id: string | null) => list.find((x) => x.id === id)?.label ?? "";

export default function PersonalQuestionnaire() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stayRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const needBeforeEdit = useRef<NeedId[]>([]);

  const [open, setOpen] = useState(false);
  const [showChoose, setShowChoose] = useState(false);
  const [needs, setNeeds] = useState<NeedId[]>([]);
  const firstNeed = needs[0] ?? null; // the first ticked reason (summary card colour and icon)
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
  const [matching, setMatching] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  // the summary: one screen per choice (owner, 10 Oct 2026), this is the one showing
  const [sumPage, setSumPage] = useState(0);

  // financial years are worked out from today's date (the newest completed year first)
  const fy = useMemo(() => financialYears(5), []);
  const yearOptions = useMemo(() => ({
    thisYear: [...fy.slice(0, 2), UNSURE],
    amend: [...fy, { id: "earlier", label: Q.amend.earlier }, UNSURE],
    overdue: [...fy, { id: "earlier", label: Q.overdue.earlier }, UNSURE],
  }), [fy]);

  const steps: Kind[] = useMemo(() => {
    const s: Kind[] = showChoose ? ["choose"] : [];
    const n: NeedId[] = needs.length ? needs : ["this_year"]; // before a reason is picked, count the pages a tax return needs
    // follow-up pages only for amend (what needs correcting) and planning: no year or first-return questions (owner, 7 Oct 2026)
    if (n.includes("amend")) s.push("amend");
    if (n.includes("planning")) s.push("planning");
    if (n.some((x) => RETURN_NEEDS.includes(x))) s.push("income");
    // the name comes straight after the service questions, so every later question can use it
    return [...s, "name", "summary", "mode", "location", "email", "phone"];
  }, [showChoose, needs]);
  const kind = steps[Math.min(stepIdx, steps.length - 1)];
  const idxOf = (k: Kind) => steps.indexOf(k);


  const show = useCallback((detail: string) => {
    // detail: the ticked reasons, comma separated, or "choose" ("Not sure — help me choose")
    const chosen = detail === "choose" ? [] : inOrder(detail.split(",").filter((x): x is NeedId => NEED_ORDER.includes(x as NeedId)));
    setShowChoose(!chosen.length);
    setNeeds(chosen);
    setYear(null); setFirst(null); setYears([]); setAmendNote(""); setTopics([]); setTopicOther(""); setIncome([]); setNotes("");
    setStepIdx(0); setSumPage(0);
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
    return [
      ...(needs.includes("amend") && amendNote.trim() ? [{ label: L.correcting, value: amendNote.trim() }] : []),
      ...(needs.includes("planning")
        ? [{ label: L.advice, value: ADVICE_TOPICS.filter((o) => topics.includes(o.id)).map((o) => (o.id === "other" && topicOther.trim() ? `Other: ${topicOther.trim()}` : o.label)).join(", ") }]
        : []),
    ];
  };
  const needTitles = () => needs.map(needTitle).join(", ");
  const hasReturn = needs.some((x) => RETURN_NEEDS.includes(x));
  const incomeLabels = () => RETURN_ITEMS.filter((o) => income.includes(o.id)).map((o) => o.label);

  // ---------- moving on ----------
  const next = () => {
    switch (kind) {
      case "choose": {
        if (!needs.length) return setError(Q.errors.need);
        // editing from the summary with the same reasons: straight back; new reasons need their own questions first
        if (backToSummary && sameNeeds(needs, needBeforeEdit.current)) { setBackToSummary(false); return goTo(idxOf("summary")); }
        setBackToSummary(false);
        return goTo(stepIdx + 1);
      }
      case "amend":
        // editing from the summary: on to the tax planning page too if that was ticked, else straight back
        if (backToSummary && !needs.includes("planning")) { setBackToSummary(false); return goTo(idxOf("summary")); }
        return goTo(stepIdx + 1);
      case "planning": {
        if (!topics.length) return setError(Q.errors.topics);
        if (topics.includes("other") && !topicOther.trim()) return setError(Q.errors.other);
        if (backToSummary) { setBackToSummary(false); return goTo(idxOf("summary")); }
        return goTo(stepIdx + 1);
      }
      case "income":
        if (!income.length) return setError(Q.errors.income);
        if (backToSummary) { setBackToSummary(false); return goTo(idxOf("summary")); }
        return goTo(stepIdx + 1);
      case "name":
        if (name.trim().length < 2) return setError(Q.errors.name);
        setSumPage(0);
        return goTo(stepIdx + 1);
      case "summary":
        // the next choice's screen, then on (owner, 10 Oct 2026: a separate screen for each service and sub-service)
        if (sumPage < needs.length - 1) { setError(null); scrollRef.current?.scrollTo({ top: 0 }); return setSumPage(sumPage + 1); }
        return goTo(stepIdx + 1);
      case "mode":
        if (!mode) return setError(Q.errors.mode);
        return goTo(stepIdx + 1);
      case "location":
        if (!place) return setError(Q.errors.location);
        setError(null);
        setSearching(true);
        // a short pause while we "look", then the good-news box asks for the email address
        window.setTimeout(() => { setSearching(false); setStepIdx((i) => i + 1); }, 11000); // 11 seconds (owner, 7 Oct 2026: 7, then 2 more, then 2 more)
        return;
      case "email":
        if (!EMAIL.test(email.trim())) return setError(Q.errors.email);
        return goTo(stepIdx + 1);
      case "phone":
        if (!MOBILE.test(cleanPhone(phone))) return setError(Q.errors.phone);
        return void submit(); // straight to the match page, no step in between (owner, 10 Oct 2026)
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
    // the summary's screens go back one at a time; coming back to the summary lands on its last screen
    if (kind === "summary" && sumPage > 0) { scrollRef.current?.scrollTo({ top: 0 }); return setSumPage(sumPage - 1); }
    if (steps[stepIdx - 1] === "summary") setSumPage(needs.length - 1);
    goTo(stepIdx - 1);
  };

  /** Summary "Change" links. Changing the main reason shows the "help me choose" page (added if it wasn't asked). */
  const edit = (k: "choose" | "amend" | "planning" | "income") => {
    setBackToSummary(true);
    if (k === "choose") {
      needBeforeEdit.current = needs;
      setShowChoose(true);
      return goTo(0);
    }
    goTo(idxOf(k));
  };

  async function submit() {
    if (!place || !needs.length) return;
    setSending(true);
    setError(null);
    // a 3-second "your match is loading" screen while the lead is sent, then the match page (owner, 10 Oct 2026)
    const holdSearching = startSearchTimer();
    setMatching(true);
    router.prefetch(MATCH_PAGE);
    const title = needTitles();
    const details = detailLines();
    const inc = hasReturn ? incomeLabels() : [];
    const services = [
      `Need: ${title}`,
      ...details.map((d) => `${d.label}: ${d.value}`),
      ...inc.map((i) => `${Q.summaryLabels.income}: ${i}`),
      ...(notes.trim() ? [`${SELECTIONS_SUMMARY.note.label}: ${notes.trim()}`] : []),
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
          // need: the ticked reasons, comma separated (one or more since 10 Oct 2026); needs: the same as a list
          answers: { need: needs.join(","), needs, amendNote: amendNote.trim(), adviceTopics: topics, adviceOther: topicOther.trim(), returnIncludes: income, notes: notes.trim() },
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
          ...(notes.trim() ? [{ category: SELECTIONS_SUMMARY.note.label, items: [notes.trim()] }] : []),
        ].filter((g) => g.items.length || g.category === title),
      }));
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "questionnaire_complete", { questionnaire: "personal" });
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
  const ready =
    kind === "choose" ? needs.length > 0
      : kind === "amend" ? true
        : kind === "planning" ? topics.length > 0
        : kind === "income" ? income.length > 0
          : kind === "mode" ? Boolean(mode)
            : kind === "location" ? Boolean(place)
              : kind === "phone" ? MOBILE.test(cleanPhone(phone))
                : kind === "name" ? name.trim().length >= 2
                  : kind === "emailMe" ? emailMe !== null
                    : kind === "summary";
  const nextLabel = kind === "summary" ? SELECTIONS_SUMMARY.confirm : kind === "location" ? Q.location.find : kind === "phone" ? Q.emailMe.submit : Q.next;
  // the postcode step stays on screen behind the email box
  const bodyKind = kind === "email" ? "location" : kind;
  const picture = STEP_PICTURES[bodyKind];
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
          <div className="q-modal-top flex shrink-0 items-center justify-between gap-3 border-b border-line/70 bg-white/90 px-4 py-2.5 sm:px-6">
            <Image src={logo.srcSmall} alt={logo.alt} width={680} height={91} className="h-auto w-[170px] sm:w-[210px]" />
            <button type="button" onClick={() => setConfirmLeave(true)} aria-label="Close" className="q-modal-close" disabled={sending}>
              <Close width={20} height={20} strokeWidth={2.4} />
            </button>
          </div>

          <div ref={scrollRef} data-bg="biz" className={`q-modal-body min-h-0 flex-1 overflow-y-auto overscroll-contain${kind === "summary" ? " q-scroll" : ""}`}>
            <PhoneFit>
            <AdProgress stepNumber={stepIdx + 1} total={total} badge={Q.badge} stepOf={Q.stepOf} kind={kind} />
            <form
              className="q-form mx-auto w-full max-w-4xl px-4 pb-6 pt-6 sm:px-8 lg:pb-4 lg:pt-5"
              onSubmit={(e) => { e.preventDefault(); next(); }}
              noValidate
            >
              {/* spam trap: hidden from people, bots fill it in */}
              <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
              <div className="bq-box" style={{ "--bq-img": `url("${picture}")` } as React.CSSProperties}>
                {bodyKind === "choose" && (
                  <StepHead eyebrow={Q.choose.eyebrow} title={Q.choose.title} icon={<Sparkle width={26} height={26} />}>
                    <p className="text-[0.98rem] leading-snug text-ink/80">{Q.choose.text}</p>
                    {/* tick as many as apply; "I'm still not sure" can't be ticked with anything else (owner, 10 Oct 2026) */}
                    <div role="group" aria-label={Q.choose.title} className="grid gap-2.5 sm:grid-cols-2">
                      {[...PERSONAL_NEEDS, STILL_UNSURE].map((n) => (
                        <ChoiceCard
                          key={n.id}
                          multi
                          checked={needs.includes(n.id)}
                          warn={warn && !needs.length}
                          onSelect={() => { setNeeds((list) => inOrder(toggleIn(list, n.id) as NeedId[])); clear(); }}
                          label={n.title}
                          desc={n.help}
                        />
                      ))}
                    </div>
                  </StepHead>
                )}

                {(bodyKind === "amend" || bodyKind === "planning") && (
                  <div className="space-y-4">
                    <NeedHead need={bodyKind} eyebrow={Q[bodyKind].eyebrow}
                      title={bodyKind === "planning" ? Q.planning.title : Q.amend.title} />
                    {bodyKind === "amend" && (
                      <>
                        <NoteField label={Q.amend.noteLabel} value={amendNote} onChange={setAmendNote} placeholder={Q.amend.notePlaceholder} rows={3} />
                      </>
                    )}
                    {bodyKind === "planning" && (
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

                {bodyKind === "summary" && firstNeed && (
                  // one card per ticked reason, with what was chosen for it underneath; "Your return includes" on the first tax
                  // return reason (owner, 10 Oct 2026, "Your selections, at a glance")
                  <SummaryPage page={sumPage} firstName={firstName} note={notes} onNote={setNotes}
                    blocks={needs.map((n) => ({
                      key: n, service: SELECTIONS_SUMMARY.services.personal, title: needTitle(n), onChange: () => edit("choose"),
                      sections: [
                        ...(n === "amend" && amendNote.trim() ? [{ heading: Q.summaryLabels.correcting, items: [amendNote.trim()], onEdit: () => edit("amend") }] : []),
                        ...(n === "planning" ? [{ heading: Q.summaryLabels.advice, items: ADVICE_TOPICS.filter((o) => topics.includes(o.id)).map((o) => (o.id === "other" && topicOther.trim() ? `Other: ${topicOther.trim()}` : o.label)), onEdit: () => edit("planning") }] : []),
                        ...(n === needs.find((x) => RETURN_NEEDS.includes(x)) ? [{ heading: Q.summaryLabels.income, items: incomeLabels(), onEdit: () => edit("income") }] : []),
                      ],
                    }))} />
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
            </PhoneFit>
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
            {kind === "summary" && <SummaryConfirmNote />}
          </div>

          {/* 11-second search after the postcode */}
          {/* after the last question: 5 seconds of "John, we are now searching…" until the match page opens */}
          {matching && <MatchSearching firstName={firstName} />}

          {searching && place && (
            <div className="q-leave" role="status" aria-live="polite">
              <div className="q-leave-box bq-search">
                <span aria-hidden className="bq-radar"><Pin width={28} height={28} strokeWidth={2.2} /></span>
                <p className="q-leave-title">{p(Q.searching.title).replace("{place}", place.suburb)}</p>
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
                <p id="pq-found-title" className="q-leave-title">{p(Q.found.title).replace("{place}", place?.suburb ?? "your area")}</p>
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

