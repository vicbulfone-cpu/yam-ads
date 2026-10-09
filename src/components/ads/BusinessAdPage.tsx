// Business ad landing page (/ad-1). Everything below the header is now the personal tax page's (/ad-2) content, so
// all four ad landing pages look identical (owner, 9 Oct 2026). The old /ad-1 hero and match box were removed.
// Desktops (1200px+) show the owner's business hero photo instead of the personal one (owner, 9 Oct 2026).
// The owner is changing the wording to business one section at a time (src/content/business-sections.ts).
import PersonalAdPage from "./PersonalAdPage";
import { businessHeroDesktop } from "@/config/site.config";
import { BUSINESS_FAQ, BUSINESS_HERO, BUSINESS_RIGHT_FIT, BUSINESS_SERVICES, BUSINESS_WHY } from "@/content/business-sections";

export default function BusinessAdPage() {
  return <PersonalAdPage pageClass="pz-biz" desktopHeroPicture={businessHeroDesktop} hero={BUSINESS_HERO} services={BUSINESS_SERVICES} why={BUSINESS_WHY} fit={BUSINESS_RIGHT_FIT} faqs={BUSINESS_FAQ.items} />;
}
