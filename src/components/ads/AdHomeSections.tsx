// The home page's sections, shown under the hero on every ad landing page (owner, 6 Oct 2026): "How it works",
// "Meet your accountant match", the three trust icons, "Why it matters", "Common questions" and the "One quick match…" closing band with its
// picture. Same components and spacing as the home page ("home-v2" carries the home heading style). Their Start buttons
// go back up to the ad's own match box (#match-box), so ad visitors stay in the ad questionnaire (paid lead).
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import { TAGLINES } from "@/content/taglines";
import HomeMatchIntro from "../sections/HomeMatchIntro";
import { HeroTrustStrip } from "../sections/DeskHero";
import WhyItMatters from "../sections/WhyItMatters";
import FAQSection from "../sections/FAQSection";
import HomeClosingCta from "../sections/HomeClosingCta";
import AdGap from "./AdGap";

export default function AdHomeSections({ extraFaqs, stepsBar, closingButton, steps }: { extraFaqs?: { q: string; a: string }[]; /** own words for the navy bar under "How it works" */ stepsBar?: { title: string; sub: string }; /** the closing "Less searching" bar with a button, laid out like the others */ closingButton?: boolean; /** own "How it works" steps in place of the photo steps */ steps?: React.ReactNode }) {
  const startHref = `#${AD_MATCH_BOX_ID}`;
  return (
    <div className="home-v2">
      <HomeMatchIntro startHref={startHref} bar={stepsBar} closingButton={closingButton} steps={steps} />
      {/* the three trust icons in the white band, as on the home page */}
      <HeroTrustStrip />
      <WhyItMatters />
      {/* ("How we select accountants" is not shown here, owner 7 Oct 2026: it is a footer link that opens in the popup) */}
      <FAQSection extra={extraFaqs} />
      <HomeClosingCta tagline={TAGLINES[8]} startHref={startHref} />
      <AdGap />
    </div>
  );
}
