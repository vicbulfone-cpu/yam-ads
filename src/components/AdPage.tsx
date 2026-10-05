// Ad landing page (/ad-1 … /ad-6): the home page hero, then two screens of blank space for content the owner will add later.
import { homeDeskHeroPicture, homeMobileHeroPicture } from "@/config/site.config";
import { HERO_COPY } from "@/content/hero-copy";
import { getHomeMatchCard } from "./sections/MatchCard";
import DeskHero from "./sections/DeskHero";
import SiteFooter from "./layout/SiteFooter";

export default function AdPage() {
  return (
    <>
      <main className="home-v2">
        <DeskHero
          headline={{ ...HERO_COPY.home.h1, sub: HERO_COPY.home.sub }}
          card={getHomeMatchCard()}
          cardTitleTag="p"
          mobilePicture={homeMobileHeroPicture}
          desktopPicture={homeDeskHeroPicture}
          showTrust={false}
        />
        {/* blank space, two screens tall: content to come */}
        <section aria-hidden className="min-h-[200svh]" />
      </main>
      <SiteFooter nodes={[]} variant="home" />
    </>
  );
}
