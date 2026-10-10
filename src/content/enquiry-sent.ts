/**
 * THE PAGE AFTER EVERY QUESTIONNAIRE (/match): "your enquiry has been sent" (owner, 11 Oct 2026). Replaces the sample
 * accountant until GoHighLevel sends the real match back. Edit the words here. {first} = the customer's first name,
 * {area} = their suburb (or postcode), {email} = their email.
 */
export const ENQUIRY_SENT = {
  /** the pill in the header */
  pill: "Enquiry sent",
  titleLead: "Thanks {first},",
  titleEm: "your enquiry has been sent.",
  sub: "A local accountant who covers {area} will contact you, usually within 2 hours.",
  /** when there is no area or name (e.g. the page was opened directly) */
  titleLeadNoName: "Thanks,",
  subNoArea: "A local accountant will contact you, usually within 2 hours.",
  /** when they ticked "email me my match details" */
  emailed: "We’ll also email a copy of your enquiry to {email}.",
  nextTitle: "What happens next",
  steps: [
    { title: "Your enquiry has gone to one accountant", text: "We’ve sent your details and the services you need to one accountant who covers your area. No other firm receives them." },
    { title: "They’ll contact you, usually within 2 hours", text: "Keep your phone handy: they’ll call or email you to talk through what you need." },
    { title: "You decide, with no obligation", text: "Discuss your needs, confirm availability and agree on fees before going ahead. Our matching is free." },
  ],
  selectedTitle: "Your selected services",
  detailsTitle: "Your details",
  details: { area: "Area", meet: "Prefers to meet", email: "Email" },
  homeLabel: "Back to the home page",
  disclaimer: "Your enquiry is shared with one accountant only. Matching is free; accountant fees are agreed separately.",
};
