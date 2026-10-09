"use client";

import { useEffect, useRef } from "react";

/**
 * /ad-2 animated cards (owner, 9 Oct 2026): "Personal Tax Services" (default) and the "Who we help" tiles. On every
 * screen size each card animates once as it scrolls into view (rises in, light sweep, icon pop, then the icon's own
 * move; ".psi-" in ads.css). Cards that arrive together (a desktop row) go one after another via --i. Adds "wim-anim"
 * to the list first, so without JavaScript or with reduced motion nothing is hidden.
 */
export default function PpsCardsReveal({ list: listSel = ".pps-cards", item = ".pps-card" }: { list?: string; item?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const list = ref.current?.parentElement?.querySelector<HTMLElement>(listSel);
    if (!list || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const cards = [...list.querySelectorAll<HTMLElement>(item)];
    list.classList.add("wim-anim");
    // cards queue one after another in page order, at least one step (--i = 1, 120ms in ads.css) apart, even when they
    // reach the screen in separate moments a few milliseconds apart (owner's animation guide, 9 Oct 2026)
    const STEP = 120;
    let lastStart = -Infinity;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries.sort((a, b) => cards.indexOf(a.target as HTMLElement) - cards.indexOf(b.target as HTMLElement))) {
        if (!e.isIntersecting) continue;
        const card = e.target as HTMLElement;
        const now = performance.now();
        const start = Math.max(now, lastStart + STEP);
        lastStart = start;
        card.style.setProperty("--i", ((start - now) / STEP).toFixed(3));
        card.classList.add("is-in");
        io.unobserve(card);
      }
    }, { threshold: 0.3 });
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [listSel, item]);
  return <span ref={ref} hidden />;
}
