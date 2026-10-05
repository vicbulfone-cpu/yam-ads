"use client";

import { usePathname } from "next/navigation";
import { OPEN_BIZ_QUESTIONNAIRE, OPEN_PERSONAL_QUESTIONNAIRE, OPEN_REG_QUESTIONNAIRE, OPEN_SMSF_QUESTIONNAIRE } from "@/lib/questionnaire-events";
import { preloadEvent } from "@/lib/service-routes";
import WhenNeeded from "../ui/WhenNeeded";

/**
 * The ad pages' questionnaires, loaded only when needed (see WhenNeeded.tsx): the page starts without their code and
 * fetches it at the visitor's first sign of activity, well before they can press Start.
 * `onSite`: the copy mounted on the main site (opened from the site match box), which loads only once the popup shows
 * that ad's match box.
 */
type Opts = { onSite?: boolean };
const site = (openEvent: string, onSite?: boolean) => (onSite ? { waitForEvent: true, preloadEvents: [preloadEvent(openEvent)] } : {});

export function LazyBusinessQuestionnaire({ onSite }: Opts) {
  return <WhenNeeded load={() => import("./BusinessQuestionnaire")} props={{}} events={[OPEN_BIZ_QUESTIONNAIRE]} {...site(OPEN_BIZ_QUESTIONNAIRE, onSite)} />;
}
export function LazyPersonalQuestionnaire({ onSite }: Opts) {
  return <WhenNeeded load={() => import("./PersonalQuestionnaire")} props={{}} events={[OPEN_PERSONAL_QUESTIONNAIRE]} {...site(OPEN_PERSONAL_QUESTIONNAIRE, onSite)} />;
}
export function LazySmsfQuestionnaire({ onSite }: Opts) {
  return <WhenNeeded load={() => import("./SmsfQuestionnaire")} props={{}} events={[OPEN_SMSF_QUESTIONNAIRE]} {...site(OPEN_SMSF_QUESTIONNAIRE, onSite)} />;
}
export function LazyRegistrationQuestionnaire({ onSite }: Opts) {
  return <WhenNeeded load={() => import("./RegistrationQuestionnaire")} props={{}} events={[OPEN_REG_QUESTIONNAIRE]} {...site(OPEN_REG_QUESTIONNAIRE, onSite)} />;
}

/** Ad landing pages (/ad-1, /ad-2, …) mount their own questionnaire; every other page gets all four from the layout. */
export const isAdPath = (path: string) => /^\/ad-\d+(\/|$)/.test(path);

export function SiteAdQuestionnaires() {
  const path = usePathname();
  if (isAdPath(path)) return null;
  return (
    <>
      <LazyPersonalQuestionnaire onSite />
      <LazyBusinessQuestionnaire onSite />
      <LazySmsfQuestionnaire onSite />
      <LazyRegistrationQuestionnaire onSite />
    </>
  );
}
