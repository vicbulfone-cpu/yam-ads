/**
 * The short "loading" screen shown for 3 seconds after the mobile number (the last question), before the match page
 * opens. Used by the site questionnaire and every ad questionnaire (owner, 10 Oct 2026: short and upbeat; was a 5-second
 * "we are now searching…" message). The visitor's first name goes first.
 */
export const MATCH_SEARCH = {
  /** after "{first name}," */
  text: "your perfect match is loading…",
  /** if no name was given */
  textNoName: "Your perfect match is loading…",
};

/** How long the screen stays up (the lead is sent meanwhile; the match page opens once both are done). */
export const MATCH_WAIT_MS = 3000;
