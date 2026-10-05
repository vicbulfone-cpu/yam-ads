"use client";

import { QUESTIONNAIRE_URL } from "@/config/site.config";
import { OPEN_QUESTIONNAIRE_EVENT, OPEN_SERVICE_BOX } from "@/lib/questionnaire-events";
import type { MatchCardData } from "../sections/MatchCardView";
import WhenNeeded from "../ui/WhenNeeded";

/**
 * The site questionnaire popup, loaded only when needed (see WhenNeeded.tsx). Early "open" events and early clicks on
 * links to the questionnaire address are held and replayed once it is ready, so every CTA still opens it.
 */
export default function LazyQuestionnaireModal({ card }: { card: MatchCardData }) {
  return (
    <WhenNeeded
      load={() => import("./QuestionnaireModal")}
      props={{ card }}
      events={[OPEN_QUESTIONNAIRE_EVENT, OPEN_SERVICE_BOX]}
      linkPath={QUESTIONNAIRE_URL}
    />
  );
}
