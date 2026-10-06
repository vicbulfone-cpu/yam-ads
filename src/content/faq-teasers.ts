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
  "See what the short questionnaire asks and where your details go.",
];

/**
 * Extra home page FAQ added after the old site's eight (owner, 6 Oct 2026: "make up 1 more q&a so we have nine").
 * Uses only facts already stated on the site. Shown in the FAQ section AND added to the home page's FAQPage
 * structured data (src/lib/seo.ts), so the two always match.
 */
export const HOME_EXTRA_FAQS: { q: string; a: string }[] = [
  {
    q: "What details do I need to provide to get matched?",
    a: "Just your postcode, the services you need help with, and your name, mobile number and email so your matched accountant can contact you. The questionnaire takes about 60 seconds, and your details go to one local accountant only. They are never sold or distributed to multiple firms.",
  },
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
  "09-clipboard-your-details", // drawn to match the owner's set (not owner-supplied)
].map((n) => `/images/home/faq/${n}.png`);
