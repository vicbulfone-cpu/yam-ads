"use client";

import { useEffect } from "react";

const MM = 96 / 25.4; // 1mm in CSS pixels

/**
 * /ad-2 hero, desktops (owner, 9 Oct 2026; removed and put back the same day): the steps line ("Tell us your needs →
 * Enter your postcode → Get matched with one accountant from our partner network") sits with its bottom 1mm (4mm, then 3mm lower) above the
 * bottom edge of the hero photo, just above the navy bar. The photo is as tall as the window, so the line is placed by
 * measuring, and again whenever the window size changes. Only where the line shows (1200px+).
 */
export default function PlaceHeroSteps() {
  useEffect(() => {
    const place = () => {
      const steps = document.querySelector<HTMLElement>(".pth-steps");
      const pic = document.querySelector<HTMLElement>(".pth-pic img");
      if (!steps || !pic) return;
      steps.style.top = "";
      if (getComputedStyle(steps).display === "none") return;
      const base = parseFloat(getComputedStyle(steps).top) || 0;
      const delta = pic.getBoundingClientRect().bottom - 1 * MM - steps.getBoundingClientRect().bottom; // 4mm, then 3mm lower (owner, 9 Oct 2026)
      steps.style.top = `${base + delta}px`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(document.documentElement);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, []);
  return null;
}
