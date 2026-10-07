// The home page's sections, shown under the hero on every ad landing page (owner, 6 Oct 2026): "How it works",
// "Meet your accountant match", the three trust icons, "Why it matters", "How we select accountants", "Common questions" and the "One quick match…" closing band with its
// picture. Same components and spacing as the home page ("home-v2" carries the home heading style). Their Start buttons
// go back up to the ad's own match box (#match-box), so ad visitors stay in the ad questionnaire (paid lead).
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import { TAGLINES } from "@/content/taglines";
import HomeMatchIntro from "../sections/HomeMatchIntro";
import { HeroTrustStrip } from "../sections/DeskHero";
import WhyItMatters from "../sections/WhyItMatters";
import HomeSelection from "../sections/HomeSelection";
import FAQSection from "../sections/FAQSection";
import HomeClosingCta from "../sections/HomeClosingCta";
import AdGap from "./AdGap";

export default function AdHomeSections() {
  const startHref = `#${AD_MATCH_BOX_ID}`;
  return (
    <div className="home-v2">
      <HomeMatchIntro startHref={startHref} />
      {/* the three trust icons in the white band, as on the home page */}
      <HeroTrustStrip />
      <WhyItMatters />
      {/* "How we select accountants" under "Why it matters", as on the home page (owner, 7 Oct 2026) */}
      <HomeSelection />
      <FAQSection />
      <HomeClosingCta tagline={TAGLINES[8]} startHref={startHref} />
      <AdGap />
    </div>
  );
}
