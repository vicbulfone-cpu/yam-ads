"use client";

import { useEffect } from "react";

const CM = 96 / 2.54; // 1cm in CSS pixels

/**
 * Ad pages, laptops and desktops (owner, 6 Oct 2026): "How it works" starts 1cm below the bottom of the match box or the
 * hero photo, whichever is lower. The match box may be drawn smaller to fit the screen height (MatchFitScript), which
 * leaves its unshrunk space behind, so the gap is measured from the box as drawn. Phones and tablets use CSS alone
 * (".bz-page .home-v2" in ads.css). Same idea as the home page's HeroGap.tsx, but through its own --ad-gap setting,
 * as HeroGap (inside "How it works") clears the section's inline margin.
 */
export default function AdGap() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".bz-page .home-v2 > section");
    if (!section) return;
    const place = () => {
      section.style.removeProperty("--ad-gap");
      const box = document.querySelector("#match-box .mc");
      const photo = document.querySelector(".bz-photo");
      // the home navy bar under the photo (owner, 7 Oct 2026; AdHeroParts.tsx): placed as HeroGap.tsx places the home one
      const bar = document.querySelector<HTMLElement>(".bz-hero-bar");
      bar?.style.removeProperty("--hb-clear");
      bar?.classList.remove("hb-mid");
      (photo as HTMLElement | null)?.style.removeProperty("--hw-drop");
      if (window.innerWidth < 1024 || !box || !photo) return;
      // the ad words are longer than the home ones, so where the steps would run into the handwriting, the handwriting
      // and its arrow move down together until there is a clear gap (never past the bottom of the photo)
      const steps = document.querySelector(".bz-hero .bz-steps");
      const script = document.querySelector(".bz-hero .bz-script");
      const arrow = document.querySelector(".bz-hero .bz-arrow");
      if (steps && script && arrow) {
        const gap = script.getBoundingClientRect().top - steps.getBoundingClientRect().bottom;
        const room = photo.getBoundingClientRect().bottom - 8 - arrow.getBoundingClientRect().bottom;
        const drop = Math.max(0, Math.min(14 - gap, room));
        if (drop > 0) (photo as HTMLElement).style.setProperty("--hw-drop", `${Math.round(drop)}px`);
      }
      if (bar) {
        const b = box.getBoundingClientRect();
        bar.style.setProperty("--hb-clear", `${Math.max(0, b.bottom - bar.getBoundingClientRect().top)}px`);
        const words = bar.querySelector<HTMLElement>(".hero-bar-words");
        if (words) {
          bar.style.setProperty("--hb-box-mid", `${b.left + b.width / 2 - words.getBoundingClientRect().left}px`);
          bar.classList.add("hb-mid");
        }
      }
      const barBottom = bar ? bar.getBoundingClientRect().bottom : 0;
      const lowest = Math.max(box.getBoundingClientRect().bottom, photo.getBoundingClientRect().bottom, barBottom);
      // with the bar, "How it works" starts 3cm below it, as on the home page (HeroGap cm={3})
      const gap = barBottom ? 3 * CM : CM;
      const contentTop = section.getBoundingClientRect().top + parseFloat(getComputedStyle(section).paddingTop);
      section.style.setProperty("--ad-gap", `${Math.round(lowest + gap - contentTop)}px`);
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("load", place);
    document.fonts?.ready.then(place);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("load", place);
    };
  }, []);
  return null;
}
