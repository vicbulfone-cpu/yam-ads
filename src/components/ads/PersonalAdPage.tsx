// Personal tax ad landing page (/ad-2). The hero is the owner's new personal tax hero (PersonalHero.tsx, 9 Oct 2026),
// which replaced the old Ad 1-style hero (desk photo, headline, steps and the match box beside it). Everything under the
// hero (AdHomeSections), the header and the footer are unchanged; the owner's sections 2-6 (PersonalSections.tsx, 9 Oct
// 2026) sit between the hero and them for now. The personal match box now lives only in the popup,
// which the hero button and every #match-box button on the page open, on every screen size.
import { AdFooter, AdHeader } from "./AdChrome";
import PersonalHero from "./PersonalHero";
import PersonalMatchCard from "./PersonalMatchCard";
import { LazyPersonalQuestionnaire } from "./LazyQuestionnaires";
import AdHomeSections from "./AdHomeSections";
import PersonalSections from "./PersonalSections";
import PersonalHowSteps from "./PersonalHowSteps";
import { OPEN_PERSONAL_QUESTIONNAIRE } from "@/lib/questionnaire-events";
import AdBoxPopup from "./AdBoxPopup";
import AlignBarButtons from "./AlignBarButtons";
import PlaceHeroSteps from "./PlaceHeroSteps";
import MatchWhyGap from "./MatchWhyGap";
import StartBar from "../sections/StartBar";
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import { PERSONAL_FAQ } from "@/content/personal-sections";

export default function PersonalAdPage() {
  return (
    <div className="bz-page pz-page">
      <AdHeader />
      <main>
        <PersonalHero />
        {/* the home page's navy "Ready to meet your accountant?" bar straight under the hero photo, touching it (owner,
            9 Oct 2026). Start is a #match-box link, so it opens the personal match box popup. */}
        <StartBar startHref={`#${AD_MATCH_BOX_ID}`} buttonOnPhone={false} className="bar-align-how-row pz-hero-bar" />
        <PersonalSections />
        {/* the four personal tax questions join the shared questions at the bottom (owner, 9 Oct 2026) */}
        {/* "How it works" uses the owner's icon steps instead of the photo steps (owner, 9 Oct 2026) */}
        <AdHomeSections extraFaqs={PERSONAL_FAQ.items} steps={<PersonalHowSteps />}
          stepsBar={{ title: "Less Searching. More Confidence.", sub: "Find an accountant who understands your tax needs." }} closingButton />
      </main>
      <AdFooter />
      {/* the page's CTA buttons open this box in a popup; phones too, as the page has no box of its own any more */}
      <AdBoxPopup openEvent={OPEN_PERSONAL_QUESTIONNAIRE} phones><PersonalMatchCard /></AdBoxPopup>
      <LazyPersonalQuestionnaire />
      {/* every navy bar button lines up with the hero bar's (owner, 9 Oct 2026) */}
      <AlignBarButtons />
      {/* the hero's steps line 4mm above the bottom of the hero photo, just above the navy bar (owner, 9 Oct 2026) */}
      <PlaceHeroSteps />
      {/* "Tax time, made easier" the same distance under its navy bar as "What we can help you with" (owner, 9 Oct 2026) */}
      <MatchWhyGap />
    </div>
  );
}
