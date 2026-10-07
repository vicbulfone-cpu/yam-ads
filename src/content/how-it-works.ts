// How It Works page, "One match, by postcode" (owner's words, 7 Oct 2026). Replaces the old paragraph that began
// "Your Accountant Match is a free matching and referral service..." (logged in docs/seo-copy-log.md).
export const ONE_MATCH_OLD_START = /^Your Accountant Match is a free matching and referral service/;

export const ONE_MATCH_PARAGRAPHS = [
  "Your Accountant Match is a free service designed to make finding the right accountant simple. We match you with one participating accountant from our carefully selected partner network, based on your postcode and the services you need.",
  "Your enquiry goes directly to your matched accounting firm — never to multiple accountants. From there, your accountant works directly with you to provide the accounting and taxation services you need.",
  "One enquiry. One matched accountant. No shopping around.",
];

// The button under those paragraphs (owner, 7 Oct 2026). Old: "Find My Accountant". The last paragraph is shown in bold.
export const ONE_MATCH_BUTTON = "Meet my match";

// Step 2 "We match you by area", detailed paragraph (owner's words, 7 Oct 2026). Replaces the old paragraph that began
// "Your postcode determines your match..." (logged in docs/seo-copy-log.md).
export const STEP2_OLD_START = /^Your postcode determines your match/;
export const STEP2_TEXT =
  "Your postcode connects you with one local accountant from our carefully selected partner network. Tell us what you need help with, and we’ll make sure you’re matched with an accountant perfectly aligned with your needs.";

// Step 3 "Your matched accountant contacts you", detailed paragraph (owner's words, 7 Oct 2026). Replaces the old paragraph
// that began "Your enquiry is sent directly and exclusively..." (logged in docs/seo-copy-log.md).
export const STEP3_OLD_START = /^Your enquiry is sent directly and exclusively/;
export const STEP3_TEXT =
  "No chasing accountants. No multiple enquiries. Your details go directly to your matched local accountant, so they can get in touch and start the conversation about how they can help.";

// Step boxes (owner, 7 Oct 2026: "look like the match box design", "only use words currently in the 3 step boxes"): each
// step's paragraph is shown as two icon rows. These are the opening words of each row, taken from the paragraph itself;
// the row's bold title is that opening, the rest of the paragraph up to the next row is the line under it.
export const STEP_ROW_STARTS: string[][] = [
  ["Share your postcode and the accounting help you're looking for", "It takes about 60 seconds"],
  ["Your postcode connects you with one local accountant", "Tell us what you need help with"],
  ["No chasing accountants. No multiple enquiries.", "Your details go directly to your matched local accountant"],
];

// Step 1 "Tell us what you need" (owner, 8 Oct 2026): "Share your postcode or area and…" → "Share your postcode and…"
export const STEP1_FROM = "Share your postcode or area and";
export const STEP1_TO = "Share your postcode and";
