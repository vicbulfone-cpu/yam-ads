// The /about page (owner, 7 Oct 2026): the same "About Us" content as the ad pages' About popup (one copy of the words:
// src/content/about-popup.ts, laid out by AboutPopup.tsx), under the site header, then the closing call-to-action band
// and the page's own footer. The page keeps its URL, title, description and canonical (from the old extraction).
import { ABOUT_POPUP as A } from "@/content/about-popup";
import { loadContent, mergeViews } from "@/lib/content";
import { getCtaBandWords } from "@/lib/site-data";
import AboutPopup from "./ads/AboutPopup";
import CtaBand from "./sections/CtaBand";
import SiteFooter from "./layout/SiteFooter";

const PATH = "/about";

export default function AboutPage() {
  const nodes = mergeViews(loadContent(PATH)); // the old page's footer wording
  const ctaWords = getCtaBandWords();
  return (
    <>
      <main>
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
          <div className="container-page pt-12 md:pt-20">
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
        <CtaBand {...(ctaWords ?? {})} asHeading={false} />
      </main>
      <SiteFooter nodes={nodes} />
    </>
  );
}
