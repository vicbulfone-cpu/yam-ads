/**
 * The site match box's four services (owner, 6 Oct 2026). Each one uses its ad questionnaire's sub-sections and
 * questions inside the site questionnaire (SiteQuestionnaire.tsx): Personal → Ad 2, Business → Ad 1, SMSF → Ad 3,
 * Registrations → Ad 4. The visitor may tick several; their pages follow each other, then the shared steps.
 */
export type ServiceKey = "personal" | "business" | "smsf" | "registration";

/** In the match box's order. */
export const SERVICE_KEYS: ServiceKey[] = ["personal", "business", "smsf", "registration"];

/** Service name on the site match box (old questionnaire wording) → service. */
export const SERVICE_OF: Record<string, ServiceKey> = {
  "Personal Tax Returns and Planning": "personal",
  "Business Services": "business",
  "SMSF and Financial Planning": "smsf",
  "Registration Services": "registration",
};

export const isServiceKey = (s: string | null | undefined): s is ServiceKey => !!s && (SERVICE_KEYS as string[]).includes(s);

/** Service keys from link/event values (service keys or the box's service names), in the match box's order. */
export function toServiceKeys(values: string[]): ServiceKey[] {
  const keys = values.map((v) => (isServiceKey(v) ? v : SERVICE_OF[v])).filter(Boolean);
  return SERVICE_KEYS.filter((k) => keys.includes(k));
}
