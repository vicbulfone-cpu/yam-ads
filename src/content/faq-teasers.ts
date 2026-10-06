/**
 * Home page FAQ: the short line under each question, word for word from the owner's "faq example" design picture
 * (hero section/ad landing pages/faq example.png, 6 Oct 2026). Same order as the FAQ questions; drawn by CSS
 * (FAQSection.tsx) so each question's text stays identical to the FAQPage structured data.
 */
export const FAQ_TEASERS = [
  "Find out typical timeframes and what to expect after you submit your details.",
  "Learn about the checks we do and the standards we look for.",
  "Understand how the service works and what it costs (or doesn’t cost) you.",
  "See the range of services you can request through the questionnaire.",
  "Find out how flexible the service is and the options available.",
  "A step-by-step look at how we match you with the right local accountant.",
  "Find out what to do if it’s not the right fit for your needs.",
  "See where our network of accountants is available across Australia.",
];

/** The owner's eight FAQ icons (hero section/8 icons faq), copied to public/images/home/faq; same order as the questions. */
export const FAQ_ICONS = [
  "01-clock-contact-time",
  "02-shield-qualified-accountants",
  "03-coins-matching-cost",
  "04-document-accounting-services",
  "05-phone-online-service",
  "06-gear-matching-process",
  "07-people-accountant-fit",
  "08-pin-regional-coverage",
].map((n) => `/images/home/faq/${n}.png`);
