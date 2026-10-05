/**
 * HERO WORDING — home page and the 13 city pages (owner's design "how it should look", 4 Oct 2026).
 * The wording below is taken from that design. Edit it here; nothing else needs to change.
 *
 * Headlines:
 *  - Home page: "Looking for an accountant near you?" ("accountant" in green).
 *  - City pages keep their own headline from src/content/seo-copy.json ("Find a Vetted Accountant in Sydney"),
 *    with the city phrase in green and their own supporting line.
 */
export const HERO_COPY = {
  home: {
    /** H1, in three parts so the middle word can be green: "Looking for an" + "accountant" + "near you?" */
    h1: { before: "Looking for an", green: "accountant", after: "near you?" },
    sub: "Let us do the heavy lifting and find your perfect match.",
  },
  /** Three points under the headline (icon + bold line + plain line). */
  points: [
    { icon: "/images/ui/hero-pin.webp", strong: "Local accountants", text: "in your area" },
    { icon: "/images/ui/hero-people.webp", strong: "Matched to", text: "your exact needs" },
    { icon: "/images/ui/hero-handshake.webp", strong: "Free and", text: "no obligation" },
  ],
  /** Three reassurance lines on the white strip under the picture. */
  trust: [
    { icon: "/images/ui/hero-shield.webp", lines: ["Your details are never", "sold or sent to a list."] },
    { icon: "/images/ui/hero-people-plain.webp", lines: ["One local accountant", "per area."] },
    { icon: "/images/ui/hero-thumb-v2.webp", lines: ["Matched to your needs", "and location."] },
  ],
  /** Describes the background photograph for screen readers and search engines (the handwriting is part of the picture). */
  pictureAlt: "A bright desk with a laptop, a notebook and a Your Accountant Match mug. Handwritten on the picture: the smarter way to find an accountant.",
};
