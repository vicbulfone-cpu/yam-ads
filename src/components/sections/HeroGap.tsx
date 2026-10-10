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

/**
 * Home page, laptops and desktops (owner, 10 Oct 2026, noc): one even white glow behind the hero's words (headline, line,
 * points, steps), its edges fading out smoothly. Sized to the words themselves and placed on the photo's wash layer
 * (".desk-hero-wash::before" in globals.css): it stops short of the match box on the right and of the tallest towers in
 * the photo at the bottom, so neither the landscape nor the box is touched.
 */
function placeWordsGlow(box: Element) {
  const wash = document.querySelector<HTMLElement>(".desk-hero .desk-hero-wash");
  const words = document.querySelector(".hero-words-glow");
  const photo = document.querySelector(".desk-hero .desk-hero-photo");
  if (!wash || !words || !photo) return;
  const rs = textRects(words);
  if (!rs.length) return;
  const FEATHER = 1.5 * CM;
  const w = wash.getBoundingClientRect(), p = photo.getBoundingClientRect();
  const left = Math.min(...rs.map((r) => r.left)), top = Math.min(...rs.map((r) => r.top));
  const right = Math.max(...rs.map((r) => r.right)), bottom = Math.max(...rs.map((r) => r.bottom));
  const towers = p.top + p.height * 0.6; // the tallest towers start about 60% down the photo
  const room = (space: number) => Math.max(0, Math.min(FEATHER, space));
  const l = left - FEATHER, t = top - FEATHER;
  const r = right + room(box.getBoundingClientRect().left - 12 - right), b = bottom + room(towers - 4 - bottom);
  wash.style.setProperty("--glow-l", `${l - w.left}px`);
  wash.style.setProperty("--glow-t", `${t - w.top}px`);
  wash.style.setProperty("--glow-w", `${r - l}px`);
  wash.style.setProperty("--glow-h", `${b - t}px`);
  // how far each edge can fade (the right and bottom edges have less room before the box and the towers)
  wash.style.setProperty("--glow-fr", `${Math.max(8, r - right)}px`);
  // the bottom edge always fades over 1cm, starting a little above the steps where the towers are close below them
  wash.style.setProperty("--glow-fb", `${Math.max(CM, b - bottom)}px`);
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
