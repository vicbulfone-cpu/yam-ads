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

/**
 * The owner's FAQ icons (hero section/ad landing pages, 6 Oct 2026), converted to WebP in public/images/home/faq-icons; same
 * order as the questions. FAQ_MAP is the large map illustration beside the heading on laptops and desktops.
 */
export const FAQ_ICONS = [
  "01-clock",
  "02-shield",
  "03-coins",
  "04-document",
  "05-phone",
  "06-gears",
  "07-people",
  "08-location-pin",
  "09-clipboard",
].map((n) => `/images/home/faq-icons/${n}.webp`);

export const FAQ_MAP = "/images/home/faq-icons/10-map-large.webp";
