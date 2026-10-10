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
 * Home page, laptops and desktops (owner, 10 Oct 2026, noc): one even white glow behind the hero's words (headline, line,
 * points, steps), its edges fading out gradually. Sized to the words themselves and placed on the photo's wash layer
 * (".desk-hero-wash::before" in globals.css). It reaches down over the steps line and fades out just above the highest
 * building beneath it (SKYLINE), and stops short of the match box on the right, so neither the city nor the box is touched.
 */
function placeWordsGlow(box: Element) {
  const wash = document.querySelector<HTMLElement>(".desk-hero .desk-hero-wash");
  const words = document.querySelector(".hero-words-glow");
  const photo = document.querySelector(".desk-hero .desk-hero-photo");
  if (!wash || !words || !photo) return;
  const rs = textRects(words);
  if (!rs.length) return;
  const w = wash.getBoundingClientRect(), p = photo.getBoundingClientRect();
  const left = Math.min(...rs.map((r) => r.left)), top = Math.min(...rs.map((r) => r.top));
  const right = Math.max(...rs.map((r) => r.right)), bottom = Math.max(...rs.map((r) => r.bottom));
  const lastLine = rs.reduce((a, r) => (r.bottom > a.bottom ? r : a));
  const fl = 2.5 * CM, ft = 2 * CM; // left and top fades (the left reaches a little further out)
  const l = left - fl, t = top - ft;
  const r = right + Math.max(0, Math.min(2 * CM, box.getBoundingClientRect().left - 12 - right));
  // the highest building under the glow, from its left edge to its right edge
  const strip = (x: number) => Math.min(SKYLINE.length - 1, Math.max(0, Math.floor(((x - p.left) / p.width) * SKYLINE.length)));
  const city = p.top + p.height * Math.min(...SKYLINE.slice(strip(l), strip(r) + 1));
  // full strength down to the middle of the steps line, then fading out just above the buildings (at most 2cm)
  const fadeFrom = lastLine.top + lastLine.height / 2;
  const b = Math.max(bottom, Math.min(city - 3, bottom + 2 * CM));
  wash.style.setProperty("--glow-l", `${l - w.left}px`);
  wash.style.setProperty("--glow-t", `${t - w.top}px`);
  wash.style.setProperty("--glow-w", `${r - l}px`);
  wash.style.setProperty("--glow-h", `${b - t}px`);
  wash.style.setProperty("--glow-fl", `${fl}px`);
  wash.style.setProperty("--glow-ft", `${ft}px`);
  wash.style.setProperty("--glow-fr", `${Math.max(8, r - right)}px`);
  wash.style.setProperty("--glow-fb", `${Math.max(10, b - fadeFrom)}px`);
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
      if (window.innerWidth < 1024 || !pic || !box) return;
      // the white fade over the photo ends at the match box's left edge (owner, 10 Oct 2026: ".desk-hero-wash" in globals.css)
      document.querySelector<HTMLElement>(".desk-hero")?.style.setProperty("--hero-box-left", `${box.getBoundingClientRect().left}px`);
      placeWordsGlow(box);
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
