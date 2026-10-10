/**
 * "YOUR SELECTIONS, AT A GLANCE" — the summary page of every questionnaire (the site popup and the four ad pages; owner,
 * 10 Oct 2026, from the owner's "Untitled" picture in "hero section/ad landing pages/question"). The customer checks each
 * service and what they chose under it, can change any of it, adds an optional note and confirms. Edit the words here.
 */
export const SELECTIONS_SUMMARY = {
  title: "Your selections, at a glance",
  /** {name}: the customer's first name */
  text: "Thanks, {name}. Does everything look right?",
  /** one screen per choice (owner, 10 Oct 2026): where there are several, this shows under the title; {n} of {total} */
  pageOf: "{n} of {total}",
  /** small label at the top of each service's card */
  serviceSelected: "Service selected",
  /** each service's name on its card */
  services: {
    personal: "Personal tax",
    business: "Business services",
    smsf: "SMSF & wealth advisory",
    registration: "Registration services",
  },
  /** on the card's top: change the choice itself; under it: change what was ticked */
  change: "Change",
  edit: "Edit",
  /** heading over the ticked options of a business, SMSF or registration choice */
  chosen: "You need help with",
  note: {
    title: "Add a note",
    optional: "(optional)",
    hint: "Anything else your accountant should know?",
    placeholder: "For example, a deadline or an ATO letter…",
    /** how the note is labelled for the accountant (lead) and on the match page */
    label: "Note for your accountant",
  },
  confirm: "Confirm and continue",
  /** small line under the button */
  confirmNote: "You can change your selections before we find your accountant.",
};
