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
 * Home page, every screen size (owner, 10 Oct 2026: "lighten sky around edge of" the hero words, "then very gradual fade out in
 * all directions, just a little fade, do not let fade affect other elements"): a light white tint behind the words where they
 * sit on the photo (on phones the headline sits on the white page above it, so only the points and steps count), easing out
 * gradually on every side over open sky only: it is gone before the match box, the top of the photo (or the sky carried up
 * above it), the screen's edges, and just above the highest building below (SKYLINE). Each edge's fade also carries on inwards
 * over the words (up to 2.5cm), so it stays long and gentle where the room outside is short. Placed on the photo's wash layer
 * (".desk-hero-wash::before" in globals.css).
 */
function placeWordsGlow(box: Element | null) {
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
  const FADE = 4 * CM; // how far the fade eases out where there is room
  const MIN = 1.2 * CM; // the shortest fade outside the words
  const PAD = 0.5 * CM; // full strength this far past the words, where there is room
  const screenL = Math.max(p.left, w.left, 0), screenR = Math.min(p.right, w.right, document.documentElement.clientWidth);
  // the match box sits beside the words on laptops and desktops; on phones and tablets it is below the photo
  const b0 = box?.getBoundingClientRect();
  const boxLeft = b0 && b0.top < bottom && b0.left > right ? b0.left - 10 : screenR;
  const strip = (x: number) => Math.min(SKYLINE.length - 1, Math.max(0, Math.floor(((x - p.left) / p.width) * SKYLINE.length)));
  // [where full strength ends, where the fade is gone], from an edge of the words outwards, given the room on that side
  const side = (room: number) => { const out = Math.max(Math.min(MIN, Math.max(room, 0)), Math.min(PAD + FADE, room)); return [Math.min(PAD, Math.max(0, out - MIN)), out]; };
  const [pl, ol] = side(left - screenL);
  const [pt, ot] = side(top - skyTop);
  const [pr, or] = side(boxLeft - right);
  const city = p.top + p.height * Math.min(...SKYLINE.slice(strip(left - ol), strip(right + or) + 1)); // highest building under it
  const [pb, ob] = side(city - 3 - bottom);
  const l = left - ol, tp = top - ot, r = Math.min(right + or, boxLeft), b = Math.min(bottom + ob, city - 3);
  const inX = Math.min(2.5 * CM, (right - left) * 0.4), inY = Math.min(2.5 * CM, (bottom - top) * 0.4);
  wash.style.setProperty("--glow-l", `${l - w.left}px`);
  wash.style.setProperty("--glow-t", `${tp - w.top}px`);
  wash.style.setProperty("--glow-w", `${r - l}px`);
  wash.style.setProperty("--glow-h", `${b - tp}px`);
  wash.style.setProperty("--glow-fl", `${ol - pl + inX}px`);
  wash.style.setProperty("--glow-ft", `${ot - pt + inY}px`);
  wash.style.setProperty("--glow-fr", `${Math.max(0, r - right - pr) + inX}px`);
  wash.style.setProperty("--glow-fb", `${Math.max(0, b - bottom - pb) + inY}px`);
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
      placeWordsGlow(box); // the light tint behind the hero words, every screen size (owner, 10 Oct 2026)
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
