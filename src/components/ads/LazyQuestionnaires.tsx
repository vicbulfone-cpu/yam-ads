"use client";

import { OPEN_BIZ_QUESTIONNAIRE, OPEN_PERSONAL_QUESTIONNAIRE, OPEN_SMSF_QUESTIONNAIRE } from "@/lib/questionnaire-events";
import WhenNeeded from "../ui/WhenNeeded";

/**
 * The ad pages' questionnaires, loaded only when needed (see WhenNeeded.tsx): the page starts without their code and
 * fetches it at the visitor's first sign of activity, well before they can press Start.
 */
export function LazyBusinessQuestionnaire() {
  return <WhenNeeded load={() => import("./BusinessQuestionnaire")} props={{}} events={[OPEN_BIZ_QUESTIONNAIRE]} />;
}
export function LazyPersonalQuestionnaire() {
  return <WhenNeeded load={() => import("./PersonalQuestionnaire")} props={{}} events={[OPEN_PERSONAL_QUESTIONNAIRE]} />;
}
export function LazySmsfQuestionnaire() {
  return <WhenNeeded load={() => import("./SmsfQuestionnaire")} props={{}} events={[OPEN_SMSF_QUESTIONNAIRE]} />;
}
