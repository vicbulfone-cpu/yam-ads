import StartBar from "./StartBar";

/**
 * The navy bar straight under the home hero photo (owner, 6 Oct 2026): "More than a directory. A match for your needs."
 * and "We don't just list accountants, we match you." Shared by the home page (DeskHero `bar`) and, on tablets and up,
 * the ad landing pages (owner, 7 Oct 2026: ad heroes look like the home hero), so the words live in one place.
 */
export default function HomeHeroBar() {
  return (
    <StartBar
      button={false}
      hero
      className="bar-align-how" /* words in line with "How it works" on laptops and desktops (owner, 6 Oct 2026) */
      words={
        <>
          <p className="hb-title">More than a directory. A match for your needs.</p>
          <span aria-hidden className="hb-div" />
          <p className="hb-sub"><span>We don’t just list accountants,</span> <span>we match you.</span></p>
        </>
      }
    />
  );
}
