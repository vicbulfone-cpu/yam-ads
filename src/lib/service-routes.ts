import { OPEN_BIZ_QUESTIONNAIRE, OPEN_PERSONAL_QUESTIONNAIRE, OPEN_REG_QUESTIONNAIRE, OPEN_SMSF_QUESTIONNAIRE } from "./questionnaire-events";

/**
 * The site match box's four services, each mapped to its ad questionnaire (owner, 6 Oct 2026):
 * Personal → Ad 2, Business → Ad 1, SMSF → Ad 3, Registrations → Ad 4.
 * The visitor picks ONE service on the site box; the popup then shows that ad's own match box (its sub-services) and
 * that ad's questionnaire. Leads started on the main site stay "Organic" (see leadOrigin in ads/QuestionnaireParts.tsx).
 */
export type ServiceKey = "personal" | "business" | "smsf" | "registration";

/** Service name on the site match box (old questionnaire wording) → ad questionnaire. */
export const SERVICE_OF: Record<string, ServiceKey> = {
  "Personal Tax Returns and Planning": "personal",
  "Business Services": "business",
  "SMSF and Financial Planning": "smsf",
  "Registration Services": "registration",
};

/** The event that opens each ad questionnaire. */
export const OPEN_EVENT_OF: Record<ServiceKey, string> = {
  personal: OPEN_PERSONAL_QUESTIONNAIRE,
  business: OPEN_BIZ_QUESTIONNAIRE,
  smsf: OPEN_SMSF_QUESTIONNAIRE,
  registration: OPEN_REG_QUESTIONNAIRE,
};

/** Fired when the popup shows an ad's match box, so that ad's questionnaire code starts loading before Start is pressed. */
export const preloadEvent = (openEvent: string) => `${openEvent}:preload`;

export const isServiceKey = (s: string | null | undefined): s is ServiceKey => !!s && s in OPEN_EVENT_OF;
