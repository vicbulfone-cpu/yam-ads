"use client";

import { useEffect, useRef } from "react";

const CM = 96 / 2.54; // 1cm in CSS pixels

/**
 * Home page, laptop and desktop: pulls the section it sits in up so its content starts `cm` (default 2.5cm) below the
 * bottom of the hero picture and match box (the hero keeps blank space at its foot, which varies with the screen size).
 */
/** the parts of an element's box that hold its words (inline text, not the empty width of a block) */
function textRects(el: Element) {
  const rects: DOMRect[] = [];
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    if (!n.textContent?.trim()) continue;
    const r = document.createRange();
    r.selectNodeContents(n);
    rects.push(...[...r.getClientRects()].filter((x) => x.width > 1));
  }
  return rects;
}

/** The top of the city skyline in the home hero photo ("hero.png"), as a fraction of the photo's height, in 40 equal
 *  strips across its width (the highest building or tree in each strip; measured from the photo, 10 Oct 2026). Re-measure if
 *  the home hero photo changes. */
const SKYLINE = [0.588, 0.606, 0.613, 0.619, 0.637, 0.644, 0.644, 0.65, 0.662, 0.65, 0.619, 0.637, 0.656, 0.669, 0.669, 0.656,
  0.688, 0.688, 0.681, 0.681, 0.7, 0.688, 0.7, 0.7, 0.669, 0.688, 0.7, 0.706, 0.713, 0.719, 0.681, 0.681, 0.694, 0.694, 0.706,
  0.706, 0.719, 0.719, 0.725, 0.725];

/**
 * Home page, every screen size (owner, 10 Oct 2026: "lighten sky around edge of" the hero words, "just a little fade, do not let
 * fade affect other elements"; then "keep background colour behind" the words "but make fade back to sky blue more gradual in all
 * directions"): a light white tint at full strength behind all the words where they sit on the photo (on phones the headline sits
 * on the white page above it, so only the points and steps count), then easing back to the sky over up to 14cm on every side.
 * Up and to the right the fade carries on behind the header and the match box (both solid, so only its gentle outer part shows
 * on the sky); down, it is gone just above the highest building (SKYLINE), so the city is never lightened. Placed on the photo's
 * wash layer (".desk-hero-wash::before" in globals.css).
 */
function placeWordsGlow() {
  const wash = document.querySelector<HTMLElement>(".desk-hero .desk-hero-wash");
  const words = document.querySelector(".hero-words-glow");
  const photo = document.querySelector(".desk-hero .desk-hero-photo");
  if (!wash || !words || !photo) return;
  const w = wash.getBoundingClientRect(), p = photo.getBoundingClientRect();
  // the sky carried up above the photo (its ::before, globals.css) counts as photo too
  const sky = photo instanceof HTMLElement ? parseFloat(getComputedStyle(photo, "::before").height) || 0 : 0;
  const skyTop = Math.max(p.top - sky, w.top);
  const rs = textRects(words).filter((r) => r.top >= skyTop); // only words over the photo
  if (!rs.length) { wash.style.setProperty("--glow-w", "0px"); return; }
  const left = Math.min(...rs.map((r) => r.left)), top = Math.min(...rs.map((r) => r.top));
  const right = Math.max(...rs.map((r) => r.right)), bottom = Math.max(...rs.map((r) => r.bottom));
  const FADE = 14 * CM; // how far the fade eases back to the sky, where there is room (owner, 10 Oct 2026: "more gradually"; was 8cm)
  const screenL = Math.max(w.left, 0), screenR = Math.min(w.right, document.documentElement.clientWidth);
  const out = (room: number) => Math.max(0, Math.min(FADE, room));
  // left and right: the fade's full length, of which only the part on screen is drawn (the rest is past the screen's edge)
  const ol = out(left - screenL), ot = out(top - w.top), or = out(screenR - right);
  const BOTTOM = 3 * CM; // the shortest fade at the bottom: where the skyline is closer, it starts a little up over the steps
  const strip = (x: number) => Math.min(SKYLINE.length - 1, Math.max(0, Math.floor(((x - p.left) / p.width) * SKYLINE.length)));
  const city = p.top + p.height * Math.min(...SKYLINE.slice(strip(left - ol), strip(right) + 1)) - 3; // highest building under the words and their left fade
  const ob = out(city - bottom);
  wash.style.setProperty("--glow-l", `${left - ol - w.left}px`);
  wash.style.setProperty("--glow-t", `${top - ot - w.top}px`);
  wash.style.setProperty("--glow-w", `${right + or - (left - ol)}px`);
  wash.style.setProperty("--glow-h", `${bottom + ob - (top - ot)}px`);
  wash.style.setProperty("--glow-fl", `${FADE}px`);
  wash.style.setProperty("--glow-cl", `${FADE - ol}px`);
  wash.style.setProperty("--glow-ft", `${ot}px`);
  wash.style.setProperty("--glow-fr", `${FADE}px`);
  wash.style.setProperty("--glow-cr", `${FADE - or}px`);
  wash.style.setProperty("--glow-fb", `${Math.max(ob, BOTTOM)}px`);
}

export default function HeroGap({ cm = 2.5 }: { cm?: number }) {
  const GAP = cm * CM;
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("section");
    const content = section?.querySelector<HTMLElement>(":scope > div");
    if (!section || !content) return;
    const place = () => {
      section.style.marginTop = "";
      const pic = document.querySelector(".desk-hero-img");
      const box = document.querySelector(".desk-hero-card .mc");
      // the bar under the hero photo counts too (owner, 6 Oct 2026: content moves down to make room for it)
      const bar = document.querySelector<HTMLElement>(".desk-hero .hero-bar"); // the home hero bar only (ad pages place theirs in AdGap.tsx)
      bar?.style.removeProperty("--hb-clear");
      bar?.classList.remove("hb-mid");
      placeWordsGlow(); // the light tint behind the hero words, every screen size (owner, 10 Oct 2026)
      if (window.innerWidth < 1024 || !pic || !box) return;
      // the bar's words are centred across the whole bar, so they start below the match box where it overlaps the bar
      if (bar) bar.style.setProperty("--hb-clear", `${Math.max(0, box.getBoundingClientRect().bottom - bar.getBoundingClientRect().top)}px`);
      // "We don't just list accountants, we match you." sits centred under the match box (owner, 6 Oct 2026):
      // --hb-box-mid is the box's centre, measured from the left of the bar's words (".hb-mid" in globals.css)
      const words = bar?.querySelector<HTMLElement>(".hero-bar-words");
      if (bar && words) {
        const b = box.getBoundingClientRect();
        bar.style.setProperty("--hb-box-mid", `${b.left + b.width / 2 - words.getBoundingClientRect().left}px`);
        bar.classList.add("hb-mid");
      }
      const heroBottom = Math.max(pic.getBoundingClientRect().bottom,box.getBoundingClientRect().bottom, bar ? bar.getBoundingClientRect().bottom : 0);
      const pull = content.getBoundingClientRect().top - heroBottom - GAP;
      if (pull !== 0) section.style.marginTop = `${-pull}px`;
    };
    // after the match box has scaled itself to the window
    const run = () => requestAnimationFrame(() => requestAnimationFrame(place));
    run();
    window.addEventListener("resize", run);
    return () => window.removeEventListener("resize", run);
  }, [GAP]);
  return <span ref={ref} hidden />;
}
