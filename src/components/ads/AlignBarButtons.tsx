"use client";

import { useEffect } from "react";

/**
 * /ad-2 (owner, 9 Oct 2026): every navy bar's button below the hero sits at exactly the same left position as the hero
 * bar's button (".pz-hero-bar"), and stays there when the words change or the window is resized, until the owner says
 * otherwise. Laptops/desktops only (the bars' buttons are hidden below 1024px). A button is only ever moved right: if a
 * bar's words reach past that point it keeps its own place rather than covering them.
 * The hero bar's button keeps the place the owner set (its own shift from where it would sit with a standard-size
 * heading), even though the bar headings are now smaller (--bar-title-scale in ads.css): the space the smaller heading
 * gives back is added to its shift.
 */
export default function AlignBarButtons() {
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const align = () => {
      const anchor = document.querySelector<HTMLElement>(".pz-hero-bar > a");
      const buttons = [...document.querySelectorAll<HTMLElement>("main .bar-align-how-row > a")].filter((a) => a !== anchor);
      buttons.forEach((b) => { b.style.position = ""; b.style.left = ""; });
      if (!anchor) return;
      anchor.style.left = "";
      if (!mq.matches) return;
      const bar = anchor.parentElement!;
      const scale = parseFloat(getComputedStyle(bar).getPropertyValue("--bar-title-scale")) || 1;
      const title = bar.querySelector<HTMLElement>(".sb-title");
      if (title && scale < 1) {
        const given = title.getBoundingClientRect().width * (1 / scale - 1);
        anchor.style.left = `${(parseFloat(getComputedStyle(anchor).left) || 0) + given}px`;
      }
      const x = anchor.getBoundingClientRect().left;
      buttons.forEach((b) => {
        const shift = x - b.getBoundingClientRect().left;
        if (shift > 0) { b.style.position = "relative"; b.style.left = `${shift}px`; }
      });
    };
    align();
    const ro = new ResizeObserver(align);
    ro.observe(document.documentElement);
    document.fonts?.ready.then(align);
    return () => ro.disconnect();
  }, []);
  return null;
}
