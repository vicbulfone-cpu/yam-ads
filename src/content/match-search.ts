/**
 * The personal "searching" screen shown for 5 seconds after the last question, before the match page opens. Used by the
 * site questionnaire and every ad questionnaire (owner's wording, 6 Oct 2026). The visitor's first name goes first.
 */
export const MATCH_SEARCH = {
  /** after "{first name}," */
  text: "we are now searching for a local accountant who is well matched for the services you requested.",
  /** if no name was given */
  textNoName: "We are now searching for a local accountant who is well matched for the services you requested.",
};

/** How long the screen stays up (the lead is sent meanwhile; the match page opens once both are done). */
export const MATCH_WAIT_MS = 5000;
