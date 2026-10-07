/**
 * SITE CONFIG — the one file to edit when swapping pictures, the logo or navigation.
 *
 * Nothing here is page copy. All page words come from the old site's extracted content
 * (data/structured). Navigation labels below reuse wording that already exists on the old
 * site's footer and buttons.
 */

/** Where every "find my accountant" button goes. Set NEXT_PUBLIC_QUESTIONNAIRE_URL in .env.local / Vercel. */
export const QUESTIONNAIRE_URL = process.env.NEXT_PUBLIC_QUESTIONNAIRE_URL || "/questionnaire";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://youraccountantmatch.com.au";

/** LOGO — swap the files in public/images/brand and update the paths here. */
export const logo = {
  /** Header logo (SVG from hero section, sharp and clean). */
  src: "/images/brand/logo.svg",
  /** Smaller copy (questionnaire popup). */
  srcSmall: "/images/brand/logo.svg",
  width: 1200,
  height: 161,
  alt: "Your Accountant Match",
};

/** HOME PAGE LOGO — shown only on the home page (header and footer). SVG from hero section for sharp rendering. */
export const homeLogo = {
  src: "/images/brand/logo-home.svg",
  width: 2169,
  height: 725,
  alt: "Your Accountant Match",
};

/** HERO PICTURES — the supplied hero artwork (headline script and the three badges are baked into each picture).
 *  Pictures 1–10 are assets/hero 1…10, picture 11 is assets/hero new; all are built by scripts/make-city-heroes.mjs.
 *  The home page and each of the 13 city pages use one picture; a city always keeps the same picture on every visit
 *  (stable for search engines and returning visitors), and neighbouring cities differ. Swap pictures here. */
const HERO_DESCRIPTIONS = [
  "A couple on a sofa", "A couple at the kitchen table", "A tradesman in a hi-vis shirt in his workshop", "A woman working at home with her laptop",
  "A busy parent at the kitchen table with a laptop and paperwork", "Two florists in their shop", "An older couple on a sofa", "A man working on his laptop at home",
  "A nurse at her kitchen table", "A café owner at her counter", "A couple on a sofa",
];
const heroByNumber = (n: number, place?: string) => ({
  src: `/images/hero/city-v4-${n}-1672.webp`,
  srcSmall: `/images/hero/city-v4-${n}-960.webp`,
  width: 1672,
  height: 941,
  alt: `${HERO_DESCRIPTIONS[n - 1]} using a phone${place ? ` in ${place}` : ""} — a better way to find an accountant. Local, vetted, matched to you.`,
});

/** HERO BACKGROUND — the desk photograph behind the home and city page headlines (owner's design, 4 Oct 2026).
 *  Built from "hero section/new hero pic.png" by scripts/make-hero-assets.mjs (full size, high quality). Swap the picture here. */
export const deskHeroPicture = { src: "/images/hero/desk-v7-1983.webp", width: 1983, height: 793 };
/** Home page hero on phones only (below 768px). Built from "hero section/mobile hero.png" by scripts/make-home-assets.mjs. */
/** Home page hero on tablets, laptops and desktops (768px and wider; owner, 4 Oct 2026). "hero no writing.png" from hero section. */
export const homeDeskHeroPicture = { src: "/images/hero/hero-no-writing.png", width: 1983, height: 793 };
/** Home page hero only (owner, 7 Oct 2026): the same photo with its green arrow removed, and the arrow as its own
 *  cut-out laid back on top (left/top = its place in the 1983 x 793 photo), so the arrow can be moved with the handwriting. */
export const homeDeskHeroNoArrowPicture = { src: "/images/hero/hero-no-arrow.png", width: 1983, height: 793 };
/** Home page hero picture (owner, 8 Oct 2026): "hero section/ad landing pages/hero home.png", cropped to the hero's
 *  1983 x 793 shape (top 236px of sky trimmed). The ad pages keep homeDeskHeroNoArrowPicture above. */
export const homePageHeroPicture = { src: "/images/hero/home-v8-1983.webp", width: 1983, height: 793 };
export const homeDeskHeroArrow = { src: "/images/hero/hero-arrow.png", width: 176, height: 57, left: 721, top: 516 };
export const homeMobileHeroPicture = { src: "/images/hero/mobile-v1-1536.webp", width: 1536, height: 1024 };

/** Earlier hero pictures (no longer shown on the home or city pages; kept so they can be reused). */
export const heroPicture = heroByNumber(3);
/** Home page hero carousel. Ordered so the same kind of picture never follows itself, including the loop back to the
 *  start: couple → woman → man → couple → woman → couple → man → woman → couple → woman. */
const HOME_HERO_ORDER = [1, 4, 3, 2, 5, 6, 8, 9, 7, 10];
export const homeHeroPictures = HOME_HERO_ORDER.map((n) => heroByNumber(n));

const CITY_HERO_INDEX: Record<string, number> = {
  sydney: 1, "newcastle-maitland": 6, melbourne: 2, geelong: 9, brisbane: 4, "gold-coast": 8, "sunshine-coast": 10,
  perth: 7, adelaide: 11, hobart: 5, launceston: 8, "canberra-queanbeyan": 3, darwin: 1,
};
export const cityHeroPicture = (slug: string, cityName?: string) => heroByNumber(CITY_HERO_INDEX[slug] ?? 1, cityName);

/** HEADER NAVIGATION — labels are existing site wording. */
export const navItems = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
];

/** Existing CTA wording on the old site. */
export const ctaLabel = "Find My Accountant";
export const stickyCtaLabel = "Get Matched Now";

/** CITY PICTURES — one wide landmark picture per city (compressed copies in public/images/cities). */
export type CityKey =
  | "sydney" | "newcastle-maitland" | "melbourne" | "geelong" | "brisbane" | "gold-coast"
  | "sunshine-coast" | "perth" | "adelaide" | "hobart" | "launceston" | "canberra-queanbeyan" | "darwin";

export const cityPicture = (slug: string) => ({
  src: `/images/cities/${slug}-1600.webp`,
  srcSmall: `/images/cities/${slug}-800.webp`,
  width: 1600,
  height: 685,
});

export const CITY_SLUGS: CityKey[] = [
  "sydney", "newcastle-maitland", "melbourne", "geelong", "brisbane", "gold-coast", "sunshine-coast",
  "perth", "adelaide", "hobart", "launceston", "canberra-queanbeyan", "darwin",
];

export const cityState: Record<string, string> = {
  sydney: "NSW", "newcastle-maitland": "NSW", melbourne: "VIC", geelong: "VIC", brisbane: "QLD", "gold-coast": "QLD",
  "sunshine-coast": "QLD", perth: "WA", adelaide: "SA", hobart: "TAS", launceston: "TAS", "canberra-queanbeyan": "ACT", darwin: "NT",
};
