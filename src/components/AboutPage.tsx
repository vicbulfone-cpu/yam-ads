// The /about page (owner, 7 Oct 2026): the same "About Us" content as the ad pages' About popup (one copy of the words:
// src/content/about-popup.ts, laid out by AboutPopup.tsx), under the site header, then the home page's closing band
// and the page's own footer. The page keeps its URL, title, description and canonical (from the old extraction).
import { ABOUT_POPUP as A } from "@/content/about-popup";
import { loadContent, mergeViews } from "@/lib/content";
import { TAGLINES } from "@/content/taglines";
import AboutPopup from "./ads/AboutPopup";
import Breadcrumbs from "./sections/Breadcrumbs";
import HomeClosingCta from "./sections/HomeClosingCta";
import SiteFooter from "./layout/SiteFooter";

const PATH = "/about";

export default function AboutPage() {
  const nodes = mergeViews(loadContent(PATH)); // the old page's footer wording
  return (
    <>
      <main>
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
          <div className="container-page pt-12 md:pt-20">
            {/* breadcrumb (owner, 7 Oct 2026): same place on screen as on the How It Works page (that page's top space minus
                1cm on phones / 1.5cm from tablets up), so the margins below make up for this section's larger top space */}
            <Breadcrumbs
              crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
              className="-mt-[1cm] mb-6 md:-mt-[calc(1rem+1.5cm)] md:mb-8 lg:-mt-[calc(5rem+1.5cm-clamp(4rem,5vw,7rem))]"
            />
            <div className="max-w-4xl">
              <h1 className="h-display about-title">{A.title}</h1>
            </div>
          </div>
        </section>
        <section className="pb-12 md:pb-20">
          <div className="container-page">
            <div className="about-page max-w-4xl">
              <AboutPopup level={2} />
            </div>
          </div>
        </section>
        {/* owner, 7 Oct 2026: the home page closing band ("One quick match...") in place of the blue call-to-action box */}
        <HomeClosingCta tagline={TAGLINES[8]} />
      </main>
      <SiteFooter nodes={nodes} />
    </>
  );
}
