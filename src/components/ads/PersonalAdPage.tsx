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
import { OPEN_PERSONAL_QUESTIONNAIRE } from "@/lib/questionnaire-events";
import AdBoxPopup from "./AdBoxPopup";

export default function PersonalAdPage() {
  return (
    <div className="bz-page pz-page">
      <AdHeader />
      <main>
        <PersonalHero />
        <PersonalSections />
        <AdHomeSections />
      </main>
      <AdFooter />
      {/* the page's CTA buttons open this box in a popup; phones too, as the page has no box of its own any more */}
      <AdBoxPopup openEvent={OPEN_PERSONAL_QUESTIONNAIRE} phones><PersonalMatchCard /></AdBoxPopup>
      <LazyPersonalQuestionnaire />
    </div>
  );
}
