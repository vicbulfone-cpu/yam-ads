"use client";

import { useEffect } from "react";

/**
 * Every navy bar's button, site-wide (owner, 10 Oct 2026; it replaced the /ad-2 rule of lining them up with the hero bar's
 * button): its left edge sits exactly where the button in the home page's bar above "Who we help" sits
 * (".home-bar-gap--fit"), at every laptop/desktop width, and stays there when the window is resized. Laptops/desktops only
 * (the bars' buttons are hidden below 1024px). If a bar's words reach past that point, its button keeps clear of them
 * rather than covering them.
 * On the home page that button is measured; other pages use where it sits there (REF: [screen width, left edge], measured
 * on the home page, 10 Oct 2026; in between, a straight line). If that bar's words or styles change, re-measure REF.
 */
const REF: [number, number][] = [
  [1024, 723.2], [1100, 793.5], [1150, 839.8], [1199, 885.1], [1200, 1003.5], [1250, 1023], [1280, 1038.9], [1366, 1093.2],
  [1440, 1152.5], [1536, 1229.3], [1600, 1280.5], [1680, 1344.7], [1800, 1440.7], [1920, 1536.8], [2048, 1638.9],
  [2200, 1760.9], [2400, 1921], [2560, 1962.3], [2880, 2015], [3200, 2067.9],
];

function refLeft(w: number) {
  if (w <= REF[0][0]) return REF[0][1];
  for (let i = 1; i < REF.length; i++) {
    const [w1, x1] = REF[i - 1], [w2, x2] = REF[i];
    if (w <= w2) return x1 + ((x2 - x1) * (w - w1)) / (w2 - w1);
  }
  const [w1, x1] = REF[REF.length - 2], [w2, x2] = REF[REF.length - 1];
  return x2 + ((x2 - x1) * (w - w2)) / (w2 - w1);
}

export default function AlignBarButtons() {
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const align = () => {
      const anchor = document.querySelector<HTMLElement>(".home-bar-gap--fit .bar-align-how-row > a");
      const buttons = [...document.querySelectorAll<HTMLElement>("main .bar-align-how-row > a")].filter((a) => a !== anchor);
      buttons.forEach((b) => { b.style.removeProperty("position"); b.style.removeProperty("left"); });
      if (!mq.matches) return;
      const x = anchor ? anchor.getBoundingClientRect().left : refLeft(window.innerWidth);
      buttons.forEach((b) => {
        if (!b.offsetParent) return;
        // the right edge of the bar's words (its title, divider and line)
        const words = [...(b.parentElement?.children ?? [])].filter((e) => e !== b && e.getBoundingClientRect().width > 0);
        const wordsRight = Math.max(0, ...words.map((e) => e.getBoundingClientRect().right));
        const target = Math.max(x, wordsRight + 16);
        const own = parseFloat(getComputedStyle(b).left) || 0; // a bar's own CSS shift (e.g. the /ad-2 hero bar's)
        const left = own + target - b.getBoundingClientRect().left;
        b.style.position = "relative";
        b.style.left = `${left}px`;
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
