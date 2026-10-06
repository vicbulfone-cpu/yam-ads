"use client";

import { useEffect } from "react";
import { OPEN_QUESTIONNAIRE_EVENT } from "@/lib/questionnaire-events";

/**
 * Opens the questionnaire popup when a page is loaded as /?start=1 (that is where /questionnaire sends visitors):
 * with ?service=… it goes straight to the questions for those services, otherwise it shows the match box first.
 * Lives in the site layout, so it works on any page.
 */
export default function QuestionnaireAutoOpen() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("start")) return;
    // ?service=… (the match box's Start) or the older ?category=…: straight to the questions for those services
    const categories = [...url.searchParams.getAll("service"), ...url.searchParams.getAll("category")];
    // wait one tick so the popup (mounted next to this in the layout) is listening
    const t = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(OPEN_QUESTIONNAIRE_EVENT, { detail: categories }));
      // drop the helper parameter so a refresh does not reopen the popup (other parameters stay for tracking)
      url.searchParams.delete("start");
      window.history.replaceState(null, "", url.pathname + (url.search ? url.search : "") + url.hash);
    }, 50);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
