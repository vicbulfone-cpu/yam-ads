"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { QUESTIONNAIRE_URL, logo } from "@/config/site.config";
import { BIZ_CATEGORIES, BIZ_MATCH_KEY, BIZ_MODES, BIZ_SOFTWARE, type BizCategory } from "@/content/business-questionnaire";
import {
  ADVICE_TOPICS, financialYears, PERSONAL_NEEDS, RETURN_ITEMS, RETURN_NEEDS, STILL_UNSURE, YES_NO_UNSURE, type NeedId,
} from "@/content/personal-questionnaire";
import { REG_CATEGORIES, REG_STAGE } from "@/content/registration-questionnaire";
import { SMSF_CATEGORIES, SMSF_HAVE, SMSF_WHEN } from "@/content/smsf-questionnaire";
import { BIZ_Q, PERSONAL_Q, REG_Q, SERVICE_PICK, SITE_Q as Q, SMSF_Q } from "@/content/site-questionnaire";
import { LEAVE_PROMPT } from "@/content/leave-prompt";
import { OPEN_QUESTIONNAIRE_EVENT } from "@/lib/questionnaire-events";
import { toServiceKeys, type ServiceKey } from "@/lib/service-routes";
import { getVisitorRecord, noteAbandon, noteComplete, noteOpen } from "@/lib/visitor";
import { BIZ_CATEGORY_ICONS, PERSONAL_NEED_ICONS, REG_CATEGORY_ICONS, SMSF_CATEGORY_ICONS } from "../ads/BizIcons";
import PostcodeBox, { type Place } from "../ads/PostcodeBox";
import { AdProgress, ChoiceCard, cleanPhone, EMAIL, MatchSearching, MOBILE, NoteField, OptionCard, openMatchPage, readTracking, startSearchTimer, StepHead, TextField } from "../ads/QuestionnaireParts";
import MatchCardView, { type MatchCardData } from "../sections/MatchCardView";
import PhoneFit from "../ui/PhoneFit";
import FitBox from "../ui/FitBox";
import StartHere from "../ui/StartHere";
import { ArrowRight, Check, Clock, Close, Doc, Mail, Phone, Pin, Sparkle } from "../ui/Icons";

/**
 * The site questionnaire popup (owner, 6 Oct 2026): every link to the questionnaire address and every site match box
 * opens it. It joins the four ad questionnaires (their wording files and shared parts; the ad questionnaires themselves
 * are not used or changed):
 *   site match box (tick one or more services) →
 *   for each ticked service, in the box's order: that ad's sub-section page, then that ad's own questions
 *     Personal (Ad 2): main reason → its follow-up page → "Does your return include any of these?" (returns only)
 *     Business (Ad 1): one page per ticked category
 *     SMSF (Ad 3): one page per ticked category → the two quick questions
 *     Registrations (Ad 4): one page per ticked category → new or existing business?
 *   → name → summary (Change links) → in person or remote → postcode/suburb → 3-second search → email → mobile →
 *   email my match details? → match page (/match).
 * Leads from here send no adType, so they stay "Organic" (the postcode owner gets them).
 * Links carrying ?service=… (the site box's Start) skip the box; other CTAs show the box first.
 */

const MATCH_PAGE = "/match";

type CatService = "business" | "smsf" | "registration";
type CatAnswer = { ids: string[]; other: string; software: string | null };
type Step =
  | { kind: "pick"; s: ServiceKey }
  | { kind: "cat"; s: CatService; id: string }
  | { kind: "pfollow"; n: FollowNeed }
  | { kind: "pincome" }
  | { kind: "qualify"; s: "smsf" | "registration" }
  | { kind: "name" | "summary" | "mode" | "location" | "email" | "phone" | "emailMe" };
/** Personal reasons with a follow-up page, in this order (owner, 7 Oct 2026: no year or first-return questions, so
 *  "This year's tax return" and "Overdue or multiple returns" have none; "Amend" asks only what needs correcting). */
type FollowNeed = "amend" | "planning";
const FOLLOW_UPS: FollowNeed[] = ["amend", "planning"];
type Edit = { one: true } | { block: ServiceKey; before: string } | null;

const CATS: Record<CatService, BizCategory[]> = { business: BIZ_CATEGORIES, smsf: SMSF_CATEGORIES, registration: REG_CATEGORIES };
const CAT_ICONS: Record<CatService, Record<string, ReactNode>> = { business: BIZ_CATEGORY_ICONS, smsf: SMSF_CATEGORY_ICONS, registration: REG_CATEGORY_ICONS };
const CAT_Q = { business: BIZ_Q, smsf: SMSF_Q, registration: REG_Q } as const;
const catOf = (s: CatService, id: string) => CATS[s].find((c) => c.id === id)!;
/** Category name inside a sentence: lower case, with the ads' own capital fixes. */
const inSentence = (s: CatService, title: string) => {
  const t = title.toLowerCase();
  return s === "smsf" ? t.replace("smsf", "SMSF") : s === "registration" ? t.replace("abn", "ABN") : t;
};

/** Faded picture in each step's box (all from the ad questionnaires; credits in docs/image-credits*.md). */
const PICK_PICTURES: Record<ServiceKey, string> = {
  personal: "/images/stock/general-couple-finances.webp",
  business: "/images/home/cafe-owner-woman.webp",
  smsf: "/images/stock/industry-smsf.webp",
  registration: "/images/stock/topic-new-business.webp",
};
const STEP_PICTURES: Record<string, string> = {
  // business categories
  biz_tax: "/images/stock/topic-tax-return.webp",
  bookkeeping: "/images/stock/topic-bookkeeping.webp",
  planning: "/images/stock/topic-business-structures.webp",
  advice: "/images/home/cafe-owner-woman.webp",
  // SMSF categories
  smsf_setup: "/images/stock/industry-smsf.webp",
  smsf_audit: "/images/stock/topic-audit.webp",
  retirement: "/images/home/retirees-coast.webp",
  wealth: "/images/stock/topic-investing.webp",
  // registration categories
  company: "/images/stock/general-documents-signing.webp",
  abn_tax: "/images/stock/topic-bas-gst.webp",
  business_name: "/images/au/business-cafe-barista.webp",
  structure: "/images/stock/topic-business-structures.webp",
  // personal follow-up pages, by main reason
  this_year: "/images/stock/topic-tax-return.webp",
  overdue: "/images/stock/general-calculator-desk.webp",
  amend: "/images/stock/general-documents-signing.webp",
  p_planning: "/images/stock/topic-tax-planning.webp",
  pincome: "/images/stock/topic-investing.webp",
  q_smsf: "/images/stock/general-couple-finances.webp",
  q_registration: "/images/stock/topic-new-business.webp",
  name: "/images/stock/general-handshake.webp",
  summary: "/images/stock/general-documents-signing.webp",
  mode: "/images/home/accountant-client-desk.webp",
  location: "/images/au/place-mainstreet.webp",
  phone: "/images/stock/general-phone-call.webp",
  emailMe: "/images/home/woman-laptop-office.webp",
};

const UNSURE = { id: "unsure", label: "Not sure" };
/** Personal pages: "Not sure" can't be ticked together with anything else (as on Ad 2). */
const toggleIn = (list: string[], id: string) =>
  id === "unsure" ? (list.includes(id) ? [] : [id])
    : list.includes(id) ? list.filter((x) => x !== id) : [...list.filter((x) => x !== "unsure"), id];
const needTitle = (n: NeedId | null) => (n === "unsure" ? STILL_UNSURE.title : PERSONAL_NEEDS.find((x) => x.id === n)?.title ?? "");
const labelOf = (list: { id: string; label: string }[], id: string | null) => list.find((x) => x.id === id)?.label ?? "";
const emptyAnswer = (): CatAnswer => ({ ids: [], other: "", software: null });

/** Labels the visitor chose in one category (summary, lead and match page), as on the ad questionnaires. */
function chosenLabels(cat: BizCategory, a: CatAnswer | undefined) {
  if (!a) return [];
  return cat.options.filter((o) => a.ids.includes(o.id)).map((o) => {
    if (o.other && a.other.trim()) return `${o.label.split(" — ")[0]}: ${a.other.trim()}`;
    if (o.software && a.software) return `${o.label} (${a.software})`;
    return o.label;
  });
}
const serviceOf = (st: Step): ServiceKey | null =>
  "s" in st ? st.s : st.kind === "pfollow" || st.kind === "pincome" ? "personal" : null;

export default function SiteQuestionnaire({ card }: { card: MatchCardData }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stayRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  // "box": the site match box inside the popup; "questions": the questionnaire pages
  const [phase, setPhase] = useState<"box" | "questions">("box");
  const [services, setServices] = useState<ServiceKey[]>([]);
  // business, SMSF and registration: categories ticked on each sub-section page, and the answers on each category page
  const [picks, setPicks] = useState<Record<CatService, string[]>>({ business: [], smsf: [], registration: [] });
  const [answers, setAnswers] = useState<Record<string, CatAnswer>>({});
  // personal (Ad 2)
  // several reasons can be ticked; "I am still not sure" only on its own (owner, 7 Oct 2026)
  const [needs, setNeeds] = useState<NeedId[]>([]);
  const [amendYear, setAmendYear] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [first, setFirst] = useState<string | null>(null);
  const [amendNote, setAmendNote] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [topicOther, setTopicOther] = useState("");
  const [income, setIncome] = useState<string[]>([]);
  const [personalNotes, setPersonalNotes] = useState("");
  // SMSF (Ad 3) and registrations (Ad 4) quick questions
  const [have, setHave] = useState<string | null>(null);
  const [when, setWhen] = useState<string | null>(null);
  const [smsfNotes, setSmsfNotes] = useState("");
  const [stage, setStage] = useState<string | null>(null);
  const [regNotes, setRegNotes] = useState("");
  // shared steps
  const [stepIdx, setStepIdx] = useState(0);
  const [edit, setEdit] = useState<Edit>(null);
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

  const fy = useMemo(() => financialYears(5), []);
  const yearOptions = useMemo(() => ({
    thisYear: [...fy.slice(0, 2), UNSURE],
    amend: [...fy, { id: "earlier", label: PERSONAL_Q.amend.earlier }, UNSURE],
    overdue: [...fy, { id: "earlier", label: PERSONAL_Q.overdue.earlier }, UNSURE],
  }), [fy]);

  // ---------- the pages, built from the services and choices so far ----------
  const steps: Step[] = useMemo(() => {
    const out: Step[] = [];
    for (const s of services) {
      out.push({ kind: "pick", s });
      if (s === "personal") {
        const ns: NeedId[] = needs.length ? needs : ["this_year"]; // before a reason is picked, count the pages a tax return needs
        for (const n of FOLLOW_UPS) if (ns.includes(n)) out.push({ kind: "pfollow", n });
        if (ns.some((n) => RETURN_NEEDS.includes(n))) out.push({ kind: "pincome" });
      } else {
        out.push(...picks[s].map((id) => ({ kind: "cat" as const, s, id })));
        if (s !== "business") out.push({ kind: "qualify", s });
      }
    }
    // the name comes straight after the service questions, so every later question can use it
    return [...out, { kind: "name" }, { kind: "summary" }, { kind: "mode" }, { kind: "location" }, { kind: "email" }, { kind: "phone" }, { kind: "emailMe" }];
  }, [services, picks, needs]);
  const step = steps[Math.min(stepIdx, steps.length - 1)];
  const summaryIdx = steps.findIndex((x) => x.kind === "summary");
  const pickKey = (s: ServiceKey) => (s === "personal" ? needs.join() : picks[s].join());

  // ---------- opening and closing ----------
  const show = useCallback((keys: ServiceKey[]) => {
    noteOpen(); // counts the visit (src/lib/visitor.ts)
    // a fresh start every time
    setPicks({ business: [], smsf: [], registration: [] }); setAnswers({});
    setNeeds([]); setYear(null); setFirst(null); setAmendYear(null); setAmendNote(""); setTopics([]); setTopicOther(""); setIncome([]); setPersonalNotes("");
    setHave(null); setWhen(null); setSmsfNotes(""); setStage(null); setRegNotes("");
    setStepIdx(0); setEdit(null); setMode(null); setPlace(null); setSearching(false);
    setEmail(""); setPhone(""); setName(""); setEmailMe(null); setError(null); setSending(false); setMatching(false); setConfirmLeave(false);
    setServices(keys);
    setPhase(keys.length ? "questions" : "box");
    setOpen(true);
    if (keys.length) (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "questionnaire_start", { questionnaire: "site", services: keys.join(",") });
  }, []);
  const close = useCallback(() => { setOpen(false); setConfirmLeave(false); }, []);
  const requestClose = () => (phase === "box" ? close() : setConfirmLeave(true));

  // this popup lives in the site layout, so it would stay on top of the next page: once the match page (or any other
  // page) has replaced the one it was opened on, close it
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState(pathname);
  if (pathname !== openedOn) {
    setOpenedOn(pathname);
    setOpen(false); setConfirmLeave(false); setSending(false); setMatching(false);
  }

  // every link to the questionnaire address opens the popup; the site box's Start carries ?service=…
  useEffect(() => {
    const target = new URL(QUESTIONNAIRE_URL, window.location.href);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== target.origin || url.pathname.replace(/\/$/, "") !== target.pathname.replace(/\/$/, "")) return;
      e.preventDefault(); // Next's <Link> skips navigation when the default is prevented
      const keys = toServiceKeys([...url.searchParams.getAll("service"), ...url.searchParams.getAll("category")]);
      // a match box Start with nothing ticked never opens the popup; the box shows its own message
      if (a.hasAttribute("data-match-start") && !keys.length) return;
      show(keys);
    };
    const onOpen = (e: Event) => show(toServiceKeys((e as CustomEvent<string[]>).detail ?? []));
    window.addEventListener("click", onClick, true);
    window.addEventListener(OPEN_QUESTIONNAIRE_EVENT, onOpen);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener(OPEN_QUESTIONNAIRE_EVENT, onOpen);
    };
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
    if (!open || phase === "box") return;
    const warn = (e: BeforeUnloadEvent) => { if (!sending) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [open, phase, sending]);
  useEffect(() => { if (confirmLeave) stayRef.current?.focus(); }, [confirmLeave]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    if (["phone", "name"].includes(step.kind)) window.setTimeout(() => fieldRef.current?.focus(), 80);
  }, [stepIdx, step.kind, phase]);
  // postcode list and match page are loaded in the background, so both appear straight away when needed
  useEffect(() => { if (open && phase === "questions") void fetch("/data/au-postcodes.txt", { priority: "low" } as RequestInit).catch(() => {}); }, [open, phase]);
  useEffect(() => { if (open && phase === "questions") router.prefetch(MATCH_PAGE); }, [open, phase, router]);
  useEffect(() => () => document.documentElement.classList.remove("q-modal-open"), []);

  const goTo = (i: number) => { setError(null); setStepIdx(i); };
  const clear = () => setError(null);
  const firstWord = name.trim().split(/\s+/)[0] ?? "";
  const firstName = firstWord ? firstWord[0].toUpperCase() + firstWord.slice(1) : "";
  const p = (text: string) => (firstName
    ? text.replaceAll("{name}", firstName)
    : text.replace(/^\{name\}, (.)/, (_, c: string) => c.toUpperCase()).replace(/,? \{name\}/g, ""));

  // ---------- answers ----------
  const toggleNeed = (id: NeedId) => { setNeeds((l) => toggleIn(l, id) as NeedId[]); clear(); };
  const togglePick = (s: CatService, id: string) => {
    clear();
    setPicks((all) => {
      const has = all[s].includes(id);
      const ids = CATS[s].map((c) => c.id).filter((c) => (c === id ? !has : all[s].includes(c)));
      return { ...all, [s]: ids };
    });
  };
  const cur = step.kind === "cat" ? catOf(step.s, step.id) : null;
  const sel = cur ? answers[cur.id] ?? emptyAnswer() : null;
  const patch = (np: Partial<CatAnswer>) => {
    if (!cur || !sel) return;
    setAnswers((a) => ({ ...a, [cur.id]: { ...sel, ...np } }));
    clear();
  };
  const toggleOption = (id: string) => {
    if (!cur || !sel || step.kind !== "cat") return;
    let ids: string[];
    if (step.s === "smsf" && id.endsWith("_unsure")) ids = sel.ids.includes(id) ? [] : [id]; // as on Ad 3
    else if (step.s === "smsf") ids = sel.ids.includes(id) ? sel.ids.filter((x) => x !== id) : [...sel.ids.filter((x) => !x.endsWith("_unsure")), id];
    else ids = sel.ids.includes(id) ? sel.ids.filter((x) => x !== id) : [...sel.ids, id];
    const stillSoftware = cur.options.some((o) => o.software && ids.includes(o.id));
    patch({ ids, software: stillSoftware ? sel.software : null });
  };

  /** What the visitor told us, per service, as label/value lines (summary, lead and match page). */
  const personalLines = (n: NeedId): { label: string; value: string }[] => {
    const L = PERSONAL_Q.summaryLabels;
    switch (n) {
      case "amend": return amendNote.trim() ? [{ label: L.correcting, value: amendNote.trim() }] : [];
      case "planning": return [{ label: L.advice, value: ADVICE_TOPICS.filter((o) => topics.includes(o.id)).map((o) => (o.id === "other" && topicOther.trim() ? `Other: ${topicOther.trim()}` : o.label)).join(", ") }];
      default: return [];
    }
  };
  const incomeLabels = () => RETURN_ITEMS.filter((o) => income.includes(o.id)).map((o) => o.label);
  const aboutLines = (s: "smsf" | "registration") => s === "smsf"
    ? [{ label: SMSF_Q.summaryLabels.have, value: labelOf(SMSF_HAVE, have) }, { label: SMSF_Q.summaryLabels.when, value: labelOf(SMSF_WHEN, when) },
      ...(smsfNotes.trim() ? [{ label: SMSF_Q.summaryLabels.notes, value: smsfNotes.trim() }] : [])]
    : [{ label: REG_Q.summaryLabels.stage, value: labelOf(REG_STAGE, stage) }, ...(regNotes.trim() ? [{ label: REG_Q.summaryLabels.notes, value: regNotes.trim() }] : [])];

  // ---------- moving on ----------
  /** After a page is answered: straight back to the summary when changing one page; when changing a sub-section
   *  choice, through that service's (new) pages and then back; otherwise the next page. */
  const advance = () => {
    if (edit && "one" in edit) { setEdit(null); return goTo(summaryIdx); }
    if (edit && "block" in edit) {
      const nextStep = steps[stepIdx + 1];
      const unchanged = step.kind === "pick" && pickKey(step.s) === edit.before;
      if (unchanged || !nextStep || serviceOf(nextStep) !== edit.block) { setEdit(null); return goTo(summaryIdx); }
    }
    goTo(stepIdx + 1);
  };

  const next = () => {
    switch (step.kind) {
      case "pick":
        if (step.s === "personal" ? !needs.length : !picks[step.s].length) return setError(SERVICE_PICK[step.s].error);
        return advance();
      case "cat": {
        const E = CAT_Q[step.s].errors;
        if (!cur || !sel || !sel.ids.length) return setError(E.category);
        if (cur.options.some((o) => o.software && sel.ids.includes(o.id)) && !sel.software) return setError(E.software);
        if (cur.options.some((o) => o.other && sel.ids.includes(o.id)) && !sel.other.trim()) return setError(E.other);
        return advance();
      }
      case "pfollow": {
        const E = PERSONAL_Q.errors;
        if (step.n === "planning" && !topics.length) return setError(E.topics);
        if (step.n === "planning" && topics.includes("other") && !topicOther.trim()) return setError(E.other);
        return advance();
      }
      case "pincome":
        if (!income.length) return setError(PERSONAL_Q.errors.income);
        return advance();
      case "qualify":
        if (step.s === "smsf" && !have) return setError(SMSF_Q.errors.have);
        if (step.s === "smsf" && !when) return setError(SMSF_Q.errors.when);
        if (step.s === "registration" && !stage) return setError(REG_Q.errors.stage);
        return advance();
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
        clear();
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
    clear();
    if (edit) { setEdit(null); return goTo(summaryIdx); }
    // first page: back to the match box (ticks kept) to change the services
    if (stepIdx === 0) return setPhase("box");
    goTo(stepIdx - 1);
  };

  /** Summary "Change" links. */
  const editPage = (i: number) => { setEdit({ one: true }); goTo(i); };
  const editPick = (s: ServiceKey) => { setEdit({ block: s, before: pickKey(s) }); goTo(steps.findIndex((x) => x.kind === "pick" && x.s === s)); };
  const indexOf = (match: (x: Step) => boolean) => steps.findIndex(match);

  async function submit() {
    if (!place) return;
    setSending(true);
    clear();
    // the personal "searching" screen stays up for 5 seconds while the lead is sent
    const holdSearching = startSearchTimer();
    setMatching(true);
    router.prefetch(MATCH_PAGE);
    const groups: { category: string; items: string[] }[] = [];
    const lines: string[] = [];
    const leadAnswers: Record<string, unknown> = { services };
    for (const s of services) {
      if (s === "personal") {
        if (!needs.length) continue;
        for (const n of needs) {
          const details = personalLines(n).map((d) => `${d.label}: ${d.value}`);
          lines.push(`Need: ${needTitle(n)}`, ...details);
          groups.push({ category: needTitle(n), items: [needTitle(n), ...details] });
        }
        const inc = needs.some((n) => RETURN_NEEDS.includes(n)) ? incomeLabels() : [];
        lines.push(...inc.map((i) => `${PERSONAL_Q.summaryLabels.income}: ${i}`), ...(personalNotes.trim() ? [`${PERSONAL_Q.summaryLabels.notes}: ${personalNotes.trim()}`] : []));
        if (inc.length) groups.push({ category: PERSONAL_Q.summaryLabels.income, items: inc });
        if (personalNotes.trim()) groups.push({ category: PERSONAL_Q.summaryLabels.notes, items: [personalNotes.trim()] });
        leadAnswers.personal = { needs, amend: needs.includes("amend") ? { note: amendNote.trim() } : null, adviceTopics: topics, adviceOther: topicOther.trim(), returnIncludes: income, notes: personalNotes.trim() };
        continue;
      }
      for (const id of picks[s]) {
        const cat = catOf(s, id);
        const chosen = chosenLabels(cat, answers[id]);
        lines.push(...chosen.map((l) => `${cat.title}: ${l}`));
        groups.push({ category: cat.title, items: chosen });
      }
      const catAnswers = Object.fromEntries(picks[s].map((id) => [id, answers[id]]));
      if (s === "business") leadAnswers.business = catAnswers;
      else {
        const about = aboutLines(s);
        lines.push(...about.map((a) => `${a.label}: ${a.value}`));
        groups.push({ category: CAT_Q[s].summaryLabels.about, items: about.map((a) => `${a.label}: ${a.value}`) });
        leadAnswers[s] = s === "smsf"
          ? { ...catAnswers, haveSmsf: have, timing: when, notes: smsfNotes.trim() }
          : { ...catAnswers, businessStage: stage, notes: regNotes.trim() };
      }
    }
    const modeLabel = BIZ_MODES.find((m) => m.id === mode)?.label ?? "";
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // no adType: a main-site lead stays "Organic" (postcode owner) unless a gclid is present
          questionnaire: "site",
          name: name.trim(), email: email.trim(), phone: cleanPhone(phone),
          postcode: place.postcode, suburb: place.suburb, state: place.state,
          services: lines, answers: leadAnswers, workMode: modeLabel,
          emailMatchDetails: emailMe === true,
          matchPageUrl: `${window.location.origin}${MATCH_PAGE}`,
          tracking: readTracking(),
          visitor: getVisitorRecord()?.visitorId ?? null,
          website: honeypot,
        }),
      });
      const data = (await res.json()) as { ok: boolean; leadId?: string };
      if (!res.ok || !data.ok || !data.leadId) throw new Error("not ok");
      // what the match page shows back to the customer (their own answers only; kept in this browser tab). One service:
      // that ad's match page wording; several: the general (business) wording.
      sessionStorage.setItem(BIZ_MATCH_KEY, JSON.stringify({
        adType: services.length === 1 ? services[0] : "site", leadId: data.leadId, name: name.trim(), email: email.trim(),
        emailMe: emailMe === true, mode: modeLabel, place, services: groups,
      }));
      noteComplete();
      await holdSearching();
      openMatchPage(router, `${MATCH_PAGE}?lead=${data.leadId}`);
    } catch {
      setMatching(false);
      setSending(false);
      setError(Q.errors.send);
    }
  }

  // ---------- drawing ----------
  const ready =
    step.kind === "pick" ? (step.s === "personal" ? needs.length > 0 : picks[step.s].length > 0)
      : step.kind === "cat" ? Boolean(sel?.ids.length)
        : step.kind === "pfollow" ? (step.n === "amend" || topics.length > 0)
          : step.kind === "pincome" ? income.length > 0
            : step.kind === "qualify" ? (step.s === "smsf" ? Boolean(have && when) : Boolean(stage))
              : step.kind === "mode" ? Boolean(mode)
                : step.kind === "location" ? Boolean(place)
                  : step.kind === "phone" ? MOBILE.test(cleanPhone(phone))
                    : step.kind === "name" ? name.trim().length >= 2
                      : step.kind === "emailMe" ? emailMe !== null
                        : step.kind === "summary";
  const nextLabel = step.kind === "summary" ? Q.summary.confirm : step.kind === "location" ? Q.location.find : step.kind === "emailMe" ? Q.emailMe.submit : Q.next;
  // the postcode step stays on screen behind the email box
  const body: Step = step.kind === "email" ? { kind: "location" } : step;
  const picture =
    body.kind === "pick" ? PICK_PICTURES[body.s]
      : body.kind === "cat" ? STEP_PICTURES[body.id]
        : body.kind === "pfollow" ? STEP_PICTURES[body.n === "planning" ? "p_planning" : body.n]
          : body.kind === "qualify" ? STEP_PICTURES[`q_${body.s}`]
            : STEP_PICTURES[body.kind];
  const warn = Boolean(error);
  const onlyBusiness = services.length === 1 && services[0] === "business";

  return (
    <dialog
      ref={dialogRef}
      className={`q-modal${phase === "questions" ? " bq" : ""}`}
      data-step={phase === "box" ? "select" : step.kind}
      aria-label={phase === "box" ? card.title ?? "Questionnaire" : Q.badge}
      onCancel={(e) => { e.preventDefault(); if (confirmLeave) setConfirmLeave(false); else if (!sending) requestClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget && phase === "box") close(); }}
    >
      {open && (
        <div className="relative flex h-full max-h-[inherit] flex-col">
          <div className="q-modal-top flex shrink-0 items-center justify-between gap-3 border-b border-line/70 bg-white/90 px-4 py-2.5 sm:px-6">
            <Image src={logo.srcSmall} alt={logo.alt} width={680} height={91} className="h-auto w-[170px] sm:w-[210px]" />
            <button type="button" onClick={requestClose} aria-label="Close" className="q-modal-close" disabled={sending}>
              <Close width={20} height={20} strokeWidth={2.4} />
            </button>
          </div>

          {phase === "box" ? (
            <div ref={scrollRef} data-bg="select" className="q-modal-body q-fit-body min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {/* the site match box; its Start link begins the questions. Tablets and desktops (owner, 7 Oct 2026): drawn
                  to fit the popup with no scrolling, and on the home page a "Start here" message above it */}
              <div className="q-modal-card q-fit-card flex min-h-full items-center"><div className="w-full">
                <StartHere />
                <FitBox><MatchCardView key={services.join()} data={card} initialSelected={services} /></FitBox>
              </div></div>
            </div>
          ) : (
            <>
              <div ref={scrollRef} data-bg="biz" className="q-modal-body min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <PhoneFit>
                <AdProgress stepNumber={stepIdx + 1} total={steps.length} badge={Q.badge} stepOf={Q.stepOf} kind={step.kind} />
                <form className="q-form mx-auto w-full max-w-4xl px-4 pb-6 pt-6 sm:px-8 lg:pb-4 lg:pt-5" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                  {/* spam trap: hidden from people, bots fill it in */}
                  <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
                  <div className="bq-box" style={{ "--bq-img": `url("${picture}")` } as React.CSSProperties}>
                    {body.kind === "pick" && body.s === "personal" && (
                      <StepHead eyebrow={SERVICE_PICK.personal.name} title={SERVICE_PICK.personal.question} icon={<Sparkle width={26} height={26} />}>
                        <p className="text-[0.98rem] leading-snug text-ink/80">{SERVICE_PICK.personal.hint}</p>
                        <fieldset className="grid gap-2.5 sm:grid-cols-2">
                          <legend className="sr-only">{SERVICE_PICK.personal.question}</legend>
                          {[...PERSONAL_NEEDS, STILL_UNSURE].map((n) => (
                            <PickCard key={n.id} checked={needs.includes(n.id)} warn={warn && !needs.length} tone={"tone" in n ? n.tone : "green"}
                              icon={PERSONAL_NEED_ICONS[n.id]} title={n.title} desc={n.help}
                              onToggle={() => toggleNeed(n.id)} />
                          ))}
                        </fieldset>
                      </StepHead>
                    )}
                    {body.kind === "pick" && body.s !== "personal" && (
                      <StepHead eyebrow={SERVICE_PICK[body.s].name} title={SERVICE_PICK[body.s].question} icon={<Sparkle width={26} height={26} />}>
                        <p className="text-[0.98rem] leading-snug text-ink/80">{SERVICE_PICK[body.s].hint}</p>
                        <fieldset className="grid gap-2.5 sm:grid-cols-2">
                          <legend className="sr-only">{SERVICE_PICK[body.s].question}</legend>
                          {CATS[body.s].map((c) => (
                            <PickCard key={c.id} checked={picks[body.s as CatService].includes(c.id)} warn={warn && !picks[body.s as CatService].length}
                              tone={c.tone} icon={CAT_ICONS[body.s as CatService][c.id]} title={c.title} desc={c.desc}
                              onToggle={() => togglePick(body.s as CatService, c.id)} />
                          ))}
                        </fieldset>
                      </StepHead>
                    )}

                    {body.kind === "cat" && cur && sel && (
                      <CategoryStep s={body.s} cat={cur} index={picks[body.s].indexOf(cur.id)} total={picks[body.s].length} sel={sel} toggle={toggleOption} patch={patch} error={error} />
                    )}

                    {body.kind === "pfollow" && (
                      <div className="space-y-4">
                        <NeedHead need={body.n} eyebrow={PERSONAL_Q[body.n].eyebrow}
                          title={body.n === "planning" ? PERSONAL_Q.planning.title : PERSONAL_Q.amend.title} />
                        {body.n === "amend" && (
                          <>
                            <NoteField label={PERSONAL_Q.amend.noteLabel} value={amendNote} onChange={setAmendNote} placeholder={PERSONAL_Q.amend.notePlaceholder} rows={3} />
                          </>
                        )}
                        {body.n === "planning" && (
                          <>
                            <p className="text-[0.95rem] text-muted">{PERSONAL_Q.planning.hint}</p>
                            <fieldset className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-2">
                              <legend className="sr-only">{PERSONAL_Q.planning.title}</legend>
                              {ADVICE_TOPICS.map((o) => (
                                <OptionCard key={o.id} checked={topics.includes(o.id)} onToggle={() => { setTopics((t) => toggleIn(t, o.id)); clear(); }} label={o.label} warn={warn && !topics.length} />
                              ))}
                            </fieldset>
                            {topics.includes("other") && <NoteField label={PERSONAL_Q.otherLabel} value={topicOther} onChange={(v) => { setTopicOther(v); clear(); }} placeholder={PERSONAL_Q.otherPlaceholder} />}
                          </>
                        )}
                      </div>
                    )}

                    {body.kind === "pincome" && (
                      <StepHead eyebrow={PERSONAL_Q.income.eyebrow} title={p(PERSONAL_Q.income.title)} icon={<Doc width={26} height={26} />}>
                        <p className="text-[0.95rem] text-muted">{PERSONAL_Q.income.hint}</p>
                        <fieldset className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-2">
                          <legend className="sr-only">{PERSONAL_Q.income.title}</legend>
                          {RETURN_ITEMS.map((o) => (
                            <OptionCard key={o.id} checked={income.includes(o.id)} onToggle={() => { setIncome((i) => toggleIn(i, o.id)); clear(); }} label={o.label} warn={warn && !income.length} />
                          ))}
                        </fieldset>
                      </StepHead>
                    )}

                    {body.kind === "qualify" && body.s === "smsf" && (
                      <StepHead eyebrow={SMSF_Q.qualify.eyebrow} title={SMSF_Q.qualify.title} icon={<Doc width={26} height={26} />}>
                        <ChoiceGroup label={SMSF_Q.qualify.have} options={SMSF_HAVE} value={have} onChange={(v) => { setHave(v); clear(); }} warn={warn && !have} cols={3} />
                        <ChoiceGroup label={SMSF_Q.qualify.when} options={SMSF_WHEN} value={when} onChange={(v) => { setWhen(v); clear(); }} warn={warn && Boolean(have) && !when} cols={3} />
                        <NoteField label={SMSF_Q.qualify.noteLabel} value={smsfNotes} onChange={setSmsfNotes} placeholder={SMSF_Q.qualify.notePlaceholder} rows={2} />
                      </StepHead>
                    )}
                    {body.kind === "qualify" && body.s === "registration" && (
                      <StepHead eyebrow={REG_Q.qualify.eyebrow} title={REG_Q.qualify.title} icon={<Doc width={26} height={26} />}>
                        <div role="radiogroup" aria-label={REG_Q.qualify.title} className="grid gap-2.5 sm:grid-cols-2">
                          {REG_STAGE.map((o) => (
                            <ChoiceCard key={o.id} checked={stage === o.id} onSelect={() => { setStage(o.id); clear(); }} label={o.label} warn={warn && !stage} />
                          ))}
                        </div>
                        <NoteField label={REG_Q.qualify.noteLabel} value={regNotes} onChange={setRegNotes} placeholder={REG_Q.qualify.notePlaceholder} rows={2} />
                      </StepHead>
                    )}

                    {body.kind === "name" && (
                      <StepHead eyebrow={Q.name.eyebrow} title={Q.name.title} icon={<Sparkle width={26} height={26} />}>
                        <TextField ref={fieldRef} label={Q.name.label} autoComplete="name" value={name} onChange={(v) => { setName(v); clear(); }} placeholder={Q.name.placeholder} invalid={warn} />
                      </StepHead>
                    )}

                    {body.kind === "summary" && (
                      <StepHead eyebrow={Q.summary.eyebrow} title={p(Q.summary.title)} icon={<Check width={26} height={26} strokeWidth={3} />}>
                        <p className="text-[0.98rem] leading-snug text-ink/80">{p(Q.summary.text)}</p>
                        {services.map((s) => (
                          <div key={s} className="space-y-2.5">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-green-700">{SERVICE_PICK[s].name}</h4>
                              {/* change which sub-sections were ticked (personal: the reason card's own Change) */}
                              {s !== "personal" && (
                                <button type="button" onClick={() => editPick(s)} className="min-h-10 rounded-full px-3 text-sm font-semibold text-green-700 underline-offset-2 hover:bg-green-50 hover:underline">
                                  {Q.summary.edit}<span className="sr-only"> {SERVICE_PICK[s].name}</span>
                                </button>
                              )}
                            </div>
                            <ul className="grid gap-3 sm:grid-cols-2">
                              {s === "personal" && needs.length > 0 && (
                                <>
                                  {needs.map((need) => (
                                    <SummaryCard key={need} title={PERSONAL_Q.summaryLabels.need} tone={PERSONAL_NEEDS.find((n) => n.id === need)?.tone ?? "green"} icon={PERSONAL_NEED_ICONS[need]} onEdit={() => editPick("personal")}>
                                      <li className="font-bold text-navy-900">{needTitle(need)}</li>
                                      {personalLines(need).map((d) => <Line key={d.label}><span className="font-semibold">{d.label}:</span> {d.value}</Line>)}
                                      {(FOLLOW_UPS as NeedId[]).includes(need) && (
                                        <li><button type="button" onClick={() => editPage(indexOf((x) => x.kind === "pfollow" && x.n === need))} className="text-sm font-semibold text-green-700 underline underline-offset-2 hover:text-green-800">{Q.summary.edit} {PERSONAL_Q.summaryLabels.details.toLowerCase()}</button></li>
                                      )}
                                    </SummaryCard>
                                  ))}
                                  {needs.some((n) => RETURN_NEEDS.includes(n)) && (
                                    <SummaryCard title={PERSONAL_Q.summaryLabels.income} tone="green" icon={PERSONAL_NEED_ICONS.this_year} onEdit={() => editPage(indexOf((x) => x.kind === "pincome"))}>
                                      {incomeLabels().map((l) => <Line key={l}>{l}</Line>)}
                                    </SummaryCard>
                                  )}
                                </>
                              )}
                              {s !== "personal" && picks[s].map((id) => {
                                const cat = catOf(s, id);
                                return (
                                  <SummaryCard key={id} title={cat.title} tone={cat.tone} icon={CAT_ICONS[s][id]} onEdit={() => editPage(indexOf((x) => x.kind === "cat" && x.id === id))}>
                                    {chosenLabels(cat, answers[id]).map((l) => <Line key={l}>{l}</Line>)}
                                  </SummaryCard>
                                );
                              })}
                              {(s === "smsf" || s === "registration") && (
                                <SummaryCard title={CAT_Q[s].summaryLabels.about} onEdit={() => editPage(indexOf((x) => x.kind === "qualify" && x.s === s))}>
                                  {aboutLines(s).map((a) => <Line key={a.label}><span className="font-semibold">{a.label}:</span> {a.value}</Line>)}
                                </SummaryCard>
                              )}
                            </ul>
                          </div>
                        ))}
                        {services.includes("personal") && (
                          <NoteField label={PERSONAL_Q.notes.label} value={personalNotes} onChange={setPersonalNotes} placeholder={PERSONAL_Q.notes.placeholder} rows={3} />
                        )}
                      </StepHead>
                    )}

                    {body.kind === "mode" && (
                      <StepHead eyebrow={Q.mode.eyebrow} title={p(Q.mode.title)} icon={<Sparkle width={26} height={26} />}>
                        <div role="radiogroup" aria-label={p(Q.mode.title)} className="grid gap-2.5 sm:grid-cols-3">
                          {BIZ_MODES.map((m) => <ChoiceCard key={m.id} checked={mode === m.id} onSelect={() => { setMode(m.id); clear(); }} label={m.label} desc={m.desc} />)}
                        </div>
                      </StepHead>
                    )}
                    {body.kind === "location" && (
                      <StepHead eyebrow={Q.location.eyebrow} title={p(Q.location.title)} icon={<Pin width={26} height={26} />}>
                        <PostcodeBox value={place} onChange={(pl) => { setPlace(pl); clear(); }} invalid={warn} />
                      </StepHead>
                    )}
                    {body.kind === "phone" && (
                      <StepHead eyebrow={Q.phone.eyebrow} title={p(Q.phone.title)} icon={<Phone width={26} height={26} />}>
                        <TextField ref={fieldRef} label={Q.phone.label} type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(v) => { setPhone(v); clear(); }} placeholder={Q.phone.placeholder} invalid={warn} />
                        <p className="bq-note"><span aria-hidden className="bq-note-icon"><Check width={14} height={14} strokeWidth={3} /></span>{Q.phone.note}</p>
                      </StepHead>
                    )}
                    {body.kind === "emailMe" && (
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
            </>
          )}

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

          {/* after the last question: 5 seconds of "John, we are now searching…" until the match page opens */}
          {matching && <MatchSearching firstName={firstName} />}

          {/* good news: ask for the email address */}
          {phase === "questions" && step.kind === "email" && !confirmLeave && (
            <div className="q-leave" role="dialog" aria-modal="true" aria-labelledby="sq-found-title">
              <form className="q-leave-box bq-found" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                <span aria-hidden className="q-leave-icon bq-found-icon"><Sparkle width={30} height={30} strokeWidth={2} /></span>
                <p id="sq-found-title" className="q-leave-title">{p(Q.found.title)}</p>
                <p className="mt-2 text-[1rem] leading-snug text-ink/80">{p(Q.found.text)}</p>
                <div className="mt-5 text-left">
                  <TextField label={Q.found.label} type="email" autoComplete="email" inputMode="email" value={email} onChange={(v) => { setEmail(v); clear(); }}
                    placeholder={onlyBusiness ? Q.found.placeholder : PERSONAL_Q.found.placeholder} invalid={warn} autoFocus />
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
            <div className="q-leave" role="alertdialog" aria-modal="true" aria-labelledby="sq-leave-title" aria-describedby="sq-leave-text">
              <div className="q-leave-box">
                <span aria-hidden className="q-leave-icon"><Clock width={30} height={30} strokeWidth={2} /></span>
                <p id="sq-leave-title" className="q-leave-title">{LEAVE_PROMPT.title}</p>
                <p id="sq-leave-text" className="q-leave-text">{LEAVE_PROMPT.text}</p>
                <div className="mt-6 grid gap-2.5">
                  <button ref={stayRef} type="button" onClick={() => setConfirmLeave(false)} className="btn btn-primary min-h-12 w-full">
                    <span>{LEAVE_PROMPT.stay}</span>
                    <span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
                  </button>
                  <button type="button" onClick={() => { noteAbandon(`page ${stepIdx + 1} of ${steps.length}`); close(); }} className="q-leave-exit">{LEAVE_PROMPT.leave}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

/** A sub-section choice: the ad box's coloured icon square, name and line, with a round tick (tick boxes, or one choice). */
function PickCard({ checked, onToggle, radio, warn, tone, icon, title, desc }: {
  checked: boolean; onToggle: () => void; radio?: boolean; warn?: boolean; tone: string; icon: ReactNode; title: string; desc: string;
}) {
  return (
    <label className={`q-opt group relative flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 px-3.5 py-3 transition duration-200 ${
      checked ? "border-green-500 bg-gradient-to-br from-green-50 to-white shadow-[0_10px_24px_-10px_rgba(0,135,58,.45)]"
        : warn ? "border-amber-300 bg-white hover:border-amber-400"
          : "border-line bg-white/95 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50/40 hover:shadow-[0_8px_20px_-10px_rgba(7,50,101,.3)]"}`}>
      <input type={radio ? "radio" : "checkbox"} name={radio ? "sq-pick" : undefined} checked={checked} onChange={onToggle} className="peer sr-only" />
      <span aria-hidden className={`bz-tile is-${tone} !w-11 shrink-0`}><svg viewBox="0 0 24 24">{icon}</svg></span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[1rem] leading-snug ${checked ? "font-bold text-navy-900" : "font-semibold text-ink/90"}`}>{title}</span>
        <span className="mt-0.5 block text-[0.85rem] leading-snug text-muted">{desc}</span>
      </span>
      <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-green-600 peer-focus-visible:ring-offset-2 ${checked ? "scale-110 border-green-600 bg-green-600 text-white" : "border-slate-300 bg-white text-transparent group-hover:border-green-500"}`}>
        <Check width={13} height={13} strokeWidth={3.4} />
      </span>
    </label>
  );
}

/** One category page (as on Ads 1, 3 and 4). */
function CategoryStep({ s, cat, index, total, sel, toggle, patch, error }: {
  s: CatService; cat: BizCategory; index: number; total: number; sel: CatAnswer; error: string | null;
  toggle: (id: string) => void; patch: (p: Partial<CatAnswer>) => void;
}) {
  const QQ = CAT_Q[s];
  const showSoftware = cat.options.some((o) => o.software && sel.ids.includes(o.id));
  const showOther = cat.options.some((o) => o.other && sel.ids.includes(o.id));
  return (
    <div className="space-y-4 lg:space-y-3.5">
      <div className="flex items-start gap-4">
        <span aria-hidden className={`bz-tile is-${cat.tone} !w-14 shrink-0`}><svg viewBox="0 0 24 24">{CAT_ICONS[s][cat.id]}</svg></span>
        <div className="min-w-0 space-y-1">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green-700">
            {QQ.categoryOf.replace("{n}", String(index + 1)).replace("{total}", String(total))}
          </span>
          <h3 className="font-sans tracking-[-0.02em] text-[1.5rem] font-semibold leading-tight text-navy-900 sm:text-[1.8rem]">{cat.title}</h3>
        </div>
      </div>
      <p className="max-w-2xl rounded-xl border-l-4 border-green-500 bg-green-50/80 px-4 py-2.5 text-[0.95rem] leading-snug text-ink/80">
        {QQ.categoryHelp.replace("{category}", inSentence(s, cat.title))}
      </p>
      <fieldset className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:gap-2">
        <legend className="sr-only">{cat.title}</legend>
        {cat.options.map((o) => (
          <OptionCard key={o.id} checked={sel.ids.includes(o.id)} onToggle={() => toggle(o.id)} label={o.label} warn={Boolean(error) && !sel.ids.length} />
        ))}
      </fieldset>
      {showOther && <NoteField label={QQ.otherLabel} value={sel.other} onChange={(v) => patch({ other: v })} placeholder={QQ.otherPlaceholder} />}
      {showSoftware && (
        <div className="space-y-3 rounded-3xl border-2 border-green-500/40 bg-white p-4 shadow-[0_14px_36px_-18px_rgba(7,50,101,.25)] sm:p-5">
          <h4 className="font-sans tracking-[-0.02em] text-lg font-semibold text-navy-900">{QQ.softwareHeading}</h4>
          <div role="radiogroup" aria-label={QQ.softwareHeading} className="flex flex-wrap gap-2.5">
            {BIZ_SOFTWARE.map((sw) => (
              <button key={sw} type="button" role="radio" aria-checked={sel.software === sw} onClick={() => patch({ software: sw })}
                className={`min-h-11 rounded-full border-2 px-4 py-2 text-sm font-bold transition duration-200 ${sel.software === sw ? "border-green-600 bg-green-600 text-white shadow-[0_8px_18px_-8px_rgba(0,135,58,.6)]" : "border-line bg-white text-ink/80 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50/50"}`}>
                {sw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Heading of a personal follow-up page (as on Ad 2). */
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

function SummaryCard({ title, tone, icon, onEdit, children }: { title: string; tone?: string; icon?: ReactNode; onEdit: () => void; children: ReactNode }) {
  return (
    <li className="rounded-2xl border border-line bg-white/95 p-4 shadow-[0_10px_28px_-18px_rgba(7,50,101,.35)]">
      <div className="mb-2 flex items-center gap-3">
        {icon && tone
          ? <span aria-hidden className={`bz-tile is-${tone} !w-10 shrink-0`}><svg viewBox="0 0 24 24">{icon}</svg></span>
          : <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.8rem] bg-green-50 text-green-700"><Doc width={22} height={22} /></span>}
        <p className="flex-1 font-bold leading-tight text-navy-900">{title}</p>
        <button type="button" onClick={onEdit} className="min-h-10 rounded-full px-3 text-sm font-semibold text-green-700 underline-offset-2 hover:bg-green-50 hover:underline">
          {Q.summary.edit}<span className="sr-only"> {title}</span>
        </button>
      </div>
      <ul className="space-y-1.5">{children}</ul>
    </li>
  );
}

function Line({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-[0.93rem] leading-snug text-ink/85">
      <Check aria-hidden width={16} height={16} strokeWidth={3} className="mt-0.5 shrink-0 text-green-600" />
      <span className="min-w-0 break-words">{children}</span>
    </li>
  );
}
