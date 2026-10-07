// Ad landing pages (owner, 7 Oct 2026: on tablets and up the ad heroes look like the home hero). Pieces shared by the
// four ad pages; styles: "AD HERO = HOME HERO" in ads.css. Phones look exactly as before.
import { homeDeskHeroArrow, homeDeskHeroNoArrowPicture } from "@/config/site.config";
import HomeHeroBar from "../sections/HomeHeroBar";

/** The desk photo has no arrow of its own; the green arrow is laid on top in its place (as on the home page), so on
 *  tablets and up it can sit 4mm lower like the home arrow. On phones it sits exactly where the photo's arrow was. */
export function AdHeroArrow() {
  const pic = homeDeskHeroNoArrowPicture;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={homeDeskHeroArrow.src}
      alt=""
      width={homeDeskHeroArrow.width}
      height={homeDeskHeroArrow.height}
      className="bz-arrow"
      style={{
        left: `${(homeDeskHeroArrow.left / pic.width) * 100}%`,
        top: `${(homeDeskHeroArrow.top / pic.height) * 100}%`,
        width: `${(homeDeskHeroArrow.width / pic.width) * 100}%`,
      }}
    />
  );
}

/** The home page's navy bar under the hero photo (tablets and up only). */
export function AdHeroBar() {
  return (
    <div className="hero-bar bz-hero-bar">
      <HomeHeroBar />
    </div>
  );
}
