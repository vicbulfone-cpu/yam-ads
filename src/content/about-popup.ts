/**
 * ABOUT POPUP WORDING (owner, 7 Oct 2026). Everything shown in the "About" popup opened from the ad pages' footers
 * (AdInfoPopup.tsx -> AboutPopup.tsx). The /about page itself keeps its own words. Edit the words here.
 */
export const ABOUT_POPUP = {
  title: "About Us",
  intro: {
    heading: "Finding the Right Accountant Shouldn't Be a Game of Chance",
    lead: "Finding an accountant who truly understands your business or personal finances used to mean scrolling endlessly through generic online directories or taking a gamble on cold inquiries.",
    statement: "We created Your Accountant Match to fix that.",
    body: "Instead of leaving you to sift through overwhelming lists, we simplify the process into a single, precise connection. You tell us your postcode and what you need help with, and we handpick one local accounting specialist from our nationwide network to assist you.",
    promise: "No spam, no endless sales calls, and no distributing your details to multiple firm providers.",
  },
  expertise: {
    heading: "Backed by 19+ Years of Industry Expertise",
    /** Large figure beside the words (from the heading). */
    figure: "19+",
    figureLabel: "Years of Industry Expertise",
    paragraphs: [
      "Your Accountant Match was founded on a deep, insider understanding of Australia's financial landscape.",
      "Our founder brings more than 19 years of experience working closely with accounting professionals across Australia and members of the National Tax & Accountants’ Association (NTAA). Having spent nearly two decades inside the industry, we know what separates a good client-accountant relationship from a great one—and we use that knowledge to make sure you get matched right the first time.",
    ],
  },
  why: {
    heading: "Why Choose Us?",
    items: [
      { id: "local", title: "One Local Match", text: "We connect you directly with one dedicated accountant in your area who specialises in your exact needs—eliminating the stress of shopping around." },
      { id: "privacy", title: "100% Privacy Guaranteed", text: "Your contact details and accounting needs are shared strictly with your designated match—never sold or blasted to a directory of providers." },
      { id: "network", title: "Australia-Wide Network", text: "Our vetted network spans every state and territory, connecting you with local expertise regardless of where you operate." },
      { id: "roots", title: "Proven Industry Roots", text: "Built on nearly two decades of close partnership with Australian accounting professionals and NTAA members." },
    ],
  },
} as const;
