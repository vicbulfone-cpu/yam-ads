// Registration ad landing page (/ad-4). Everything below the header is now the personal tax page's (/ad-2) content, so
// all four ad landing pages look identical (owner, 9 Oct 2026). The old /ad-4 hero and match box were removed.
// The owner is changing the wording to registration one section at a time (src/content/registration-sections.ts).
// The CTA popup shows the registration match box with its service rows, and Start opens the registration questionnaire
// from the chosen rows, as the business page (owner, 10 Oct 2026).
// Desktops (1200px+) show the owner's registration hero photo instead of the personal one (owner, 10 Oct 2026).
import PersonalAdPage from "./PersonalAdPage";
import RegistrationMatchCard from "./RegistrationMatchCard";
import { LazyRegistrationQuestionnaire } from "./LazyQuestionnaires";
import { OPEN_REG_QUESTIONNAIRE } from "@/lib/questionnaire-events";
import { registrationHeroDesktop } from "@/config/site.config";
import { REG_HERO, REG_RIGHT_FIT, REG_SERVICES, REG_WHY } from "@/content/registration-sections";

export default function RegistrationAdPage() {
  return (
    <PersonalAdPage pageClass="pz-reg" desktopHeroPicture={registrationHeroDesktop} hero={REG_HERO} services={REG_SERVICES} why={REG_WHY} fit={REG_RIGHT_FIT}
      box={{ card: <RegistrationMatchCard />, questionnaire: <LazyRegistrationQuestionnaire />, openEvent: OPEN_REG_QUESTIONNAIRE }} />
  );
}
