/**
 * SITE QUESTIONNAIRE — the popup opened by the site match box (home page and every other site page; owner, 6 Oct 2026).
 * It joins the four ad questionnaires: for each service ticked on the box, that ad's own sub-section page and questions,
 * then the shared steps once (name → summary → in person or remote → postcode → email → mobile → email my match?).
 * All wording comes from the ad wording files; only the progress badge is the old site questionnaire's.
 */
import { BIZ_CARD, BIZ_Q } from "./business-questionnaire";
import { PERSONAL_CARD, PERSONAL_Q } from "./personal-questionnaire";
import { REG_CARD, REG_Q } from "./registration-questionnaire";
import { SMSF_CARD, SMSF_Q } from "./smsf-questionnaire";
import { MATCH_CARD_COPY } from "./match-card-copy";
import type { ServiceKey } from "@/lib/service-routes";

/** Shared steps (business wording, as on Ad 1) with the old site questionnaire's progress badge. */
export const SITE_Q = { ...BIZ_Q, badge: "Your Match in Progress" };

/** Each service's sub-section page: the name shown on the site box, and its ad match box's question and hint. */
export const SERVICE_PICK: Record<ServiceKey, { name: string; question: string; hint: string; error: string }> = {
  personal: { name: MATCH_CARD_COPY.rows["Personal Tax Returns and Planning"].title, question: PERSONAL_CARD.question, hint: "Select all that apply.", error: PERSONAL_CARD.error },
  business: { name: MATCH_CARD_COPY.rows["Business Services"].title, question: BIZ_CARD.question, hint: BIZ_CARD.hint, error: BIZ_CARD.error },
  smsf: { name: MATCH_CARD_COPY.rows["SMSF and Financial Planning"].title, question: SMSF_CARD.question, hint: SMSF_CARD.hint, error: SMSF_CARD.error },
  registration: { name: MATCH_CARD_COPY.rows["Registration Services"].title, question: REG_CARD.question, hint: REG_CARD.hint, error: REG_CARD.error },
};

export { BIZ_Q, PERSONAL_Q, SMSF_Q, REG_Q };
