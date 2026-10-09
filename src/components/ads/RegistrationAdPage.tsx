// Registration ad landing page (/ad-4). Everything below the header is now the personal tax page's (/ad-2) content, so
// all four ad landing pages look identical (owner, 9 Oct 2026). The old /ad-4 hero and match box were removed.
// The owner is changing the wording to registration one section at a time (src/content/registration-sections.ts).
import PersonalAdPage from "./PersonalAdPage";
import { REG_HERO, REG_RIGHT_FIT, REG_SERVICES, REG_WHY } from "@/content/registration-sections";

export default function RegistrationAdPage() {
  return <PersonalAdPage pageClass="pz-reg" hero={REG_HERO} services={REG_SERVICES} why={REG_WHY} fit={REG_RIGHT_FIT} />;
}
