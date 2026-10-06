/**
 * The names of the browser events that open each questionnaire. They live in this tiny file (not in the questionnaire
 * files) so the match boxes can open a questionnaire without loading the questionnaire's own code up front: that code is
 * loaded only when needed (src/components/ui/WhenNeeded.tsx).
 */
export const OPEN_QUESTIONNAIRE_EVENT = "yam:open-questionnaire";
export const OPEN_BIZ_QUESTIONNAIRE = "yam:open-biz-questionnaire";
export const OPEN_PERSONAL_QUESTIONNAIRE = "yam:open-personal-questionnaire";
export const OPEN_SMSF_QUESTIONNAIRE = "yam:open-smsf-questionnaire";
export const OPEN_REG_QUESTIONNAIRE = "yam:open-registration-questionnaire";
