"use client";

import { useEffect } from "react";
import { OPEN_QUESTIONNAIRE_EVENT, OPEN_SERVICE_BOX } from "@/lib/questionnaire-events";
import { isServiceKey } from "@/lib/service-routes";

/**
 * Opens the questionnaire popup when a page is loaded as /?start=1 (that is where /questionnaire sends visitors):
 * with ?category=… it goes straight to questionnaire page 1, otherwise it shows the match box first.
 * Lives in the site layout, so it works on any page.
 */
export default function QuestionnaireAutoOpen() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("start")) return;
    const categories = url.searchParams.getAll("category");
    // ?service=… (the site match box's Start): open on that service's ad match box
    const service = url.searchParams.get("service");
    // wait one tick so the popup (mounted next to this in the layout) is listening
    const t = window.setTimeout(() => {
      if (isServiceKey(service)) window.dispatchEvent(new CustomEvent(OPEN_SERVICE_BOX, { detail: service }));
      else window.dispatchEvent(new CustomEvent(OPEN_QUESTIONNAIRE_EVENT, { detail: categories }));
      // drop the helper parameter so a refresh does not reopen the popup (other parameters stay for tracking)
      url.searchParams.delete("start");
      window.history.replaceState(null, "", url.pathname + (url.search ? url.search : "") + url.hash);
    }, 50);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
