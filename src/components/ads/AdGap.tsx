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
      if (window.innerWidth < 1024 || !box || !photo) return;
      const lowest = Math.max(box.getBoundingClientRect().bottom, photo.getBoundingClientRect().bottom);
      const contentTop = section.getBoundingClientRect().top + parseFloat(getComputedStyle(section).paddingTop);
      section.style.setProperty("--ad-gap", `${Math.round(lowest + CM - contentTop)}px`);
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
