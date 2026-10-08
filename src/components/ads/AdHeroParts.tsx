// Ad landing pages (owner, 7 Oct 2026: on tablets and up the ad heroes look like the home hero). Pieces shared by the
// four ad pages; styles: "AD HERO = HOME HERO" in ads.css. Phones look exactly as before.
// (owner, 8 Oct 2026: the ad heroes now use the home hero photo, with no handwriting or arrow, so the arrow piece is gone)
import HomeHeroBar from "../sections/HomeHeroBar";

/** The home page's navy bar under the hero photo (tablets and up only). */
export function AdHeroBar() {
  return (
    <div className="hero-bar bz-hero-bar">
      <HomeHeroBar />
    </div>
  );
}
