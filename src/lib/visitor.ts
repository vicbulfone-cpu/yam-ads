// Remembers a visitor's questionnaire progress in their own browser, so a visitor who leaves part-way and comes back is
// recognised and can carry on where they stopped. Nothing here is sent anywhere by itself:
//   - the record lives in the browser's localStorage (key "yam:visitor");
//   - each milestone is also reported to Google Analytics when it is switched on (events questionnaire_start,
//     questionnaire_abandon, questionnaire_return, questionnaire_complete);
//   - getVisitorRecord() is for the lead form (Stage 4/5) to attach to the lead it sends, so the business can see that a
//     lead came from a returning visitor and how many times they left before finishing.
// No name, phone or email is ever stored here; only which services and options were ticked.

const KEY = "yam:visitor";

export type SavedStep = { kind: "select" } | { kind: "category"; index: number } | { kind: "next" };

export type VisitorRecord = {
  /** Random id made in this browser on the first visit to the questionnaire. Not linked to any personal detail. */
  visitorId: string;
  firstSeen: string;
  lastSeen: string;
  /** How many times the questionnaire has been opened. */
  opens: number;
  /** How many times the visitor chose "Leave" before finishing. */
  abandons: number;
  lastAbandonedAt?: string;
  /** Where they were when they last left ("category 2 of 3"). */
  lastAbandonedStep?: string;
  /** True while there are unfinished answers to come back to. */
  inProgress: boolean;
  completedAt?: string;
  ids: string[];
  answers: Record<string, unknown>;
  step: SavedStep;
};

const now = () => new Date().toISOString();
const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`);

function read(): VisitorRecord | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as VisitorRecord) : null;
  } catch {
    return null; // private browsing or storage switched off: the questionnaire still works, it just isn't remembered
  }
}
function write(r: VisitorRecord) {
  try { window.localStorage.setItem(KEY, JSON.stringify(r)); } catch { /* see read() */ }
}
const fresh = (): VisitorRecord => ({ visitorId: newId(), firstSeen: now(), lastSeen: now(), opens: 0, abandons: 0, inProgress: false, ids: [], answers: {}, step: { kind: "select" } });

/** Reports a milestone to Google Analytics, when it is loaded. */
function report(event: string, r: VisitorRecord, extra: Record<string, unknown> = {}) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", event, { visitor_id: r.visitorId, questionnaire_opens: r.opens, questionnaire_abandons: r.abandons, ...extra });
}

/** The visitor's record (for the lead form to attach to a lead), or null if nothing is stored. */
export const getVisitorRecord = (): VisitorRecord | null => (typeof window === "undefined" ? null : read());

/** Call when the questionnaire opens. Counts the visit and reports a return if they left part-way before. */
export function noteOpen(): VisitorRecord {
  const r = read() ?? fresh();
  r.opens += 1;
  r.lastSeen = now();
  write(r);
  if (r.abandons > 0 && r.inProgress) report("questionnaire_return", r, { left_at: r.lastAbandonedStep });
  else if (r.opens === 1) report("questionnaire_start", r);
  return r;
}

/** Call whenever the answers or the page change, so progress survives closing the browser. */
export function saveProgress(ids: string[], answers: Record<string, unknown>, step: SavedStep) {
  const r = read() ?? fresh();
  write({ ...r, ids, answers, step, inProgress: true, lastSeen: now() });
}

/** Call when the visitor confirms they want to leave before finishing. */
export function noteAbandon(stepLabel: string) {
  const r = read() ?? fresh();
  r.abandons += 1;
  r.lastAbandonedAt = now();
  r.lastAbandonedStep = stepLabel;
  r.lastSeen = now();
  write(r);
  report("questionnaire_abandon", r, { left_at: stepLabel });
}

/** Call when the questionnaire is finished and the lead is sent (Stage 4/5): clears the unfinished answers. */
export function noteComplete() {
  const r = read() ?? fresh();
  write({ ...r, inProgress: false, completedAt: now(), ids: [], answers: {}, step: { kind: "select" }, lastSeen: now() });
  report("questionnaire_complete", r);
}
