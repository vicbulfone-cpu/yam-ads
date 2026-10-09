// SMSF & wealth ad landing page (/ad-3). Everything below the header is now the personal tax page's (/ad-2) content, so
// all four ad landing pages look identical (owner, 9 Oct 2026). The old /ad-3 hero and match box were removed.
// The owner is changing the wording to SMSF one section at a time (src/content/smsf-sections.ts).
// Desktops (1200px+) show the owner's SMSF hero photo instead of the personal one (owner, 9 Oct 2026).
import PersonalAdPage from "./PersonalAdPage";
import { smsfHeroDesktop } from "@/config/site.config";
import { SMSF_HERO, SMSF_RIGHT_FIT, SMSF_SERVICES, SMSF_WHY } from "@/content/smsf-sections";

export default function SmsfAdPage() {
  return <PersonalAdPage pageClass="pz-smsf" desktopHeroPicture={smsfHeroDesktop} hero={SMSF_HERO} services={SMSF_SERVICES} why={SMSF_WHY} fit={SMSF_RIGHT_FIT} />;
}
