"use client";

import { useEffect, useRef } from "react";

/**
 * "What we can help you with" icons, site-wide (owner, 10 Oct 2026): once the page has been scrolled and the cards are on
 * screen, wait 1 second, then animate the icons one by one in reading order (top left to top right, then bottom left to
 * bottom right), the whole run taking 2 seconds. Sets "icseq" on the list (icons wait hidden), then "icseq-go" with each
 * card's place in the order (--k) and the gap between icons (--icseq-step) so the last icon finishes at 2 seconds.
 * Styles: ".icseq" in globals.css. With reduced motion or without JavaScript nothing is hidden. Place inside the section.
 */
export default function IconSequence({ list: listSel, item, slot = 1000 }: {
  list: string; item: string;
  /** how long one icon's own animation lasts (ms); the gaps are spread over the rest of the 2 seconds */
  slot?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const list = ref.current?.parentElement?.querySelector<HTMLElement>(listSel);
    if (!list || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const cards = [...list.querySelectorAll<HTMLElement>(item)];
    if (!cards.length) return;
    const TOTAL = 2000, WAIT = 1000;
    list.classList.add("icseq");
    list.style.setProperty("--icseq-step", `${cards.length > 1 ? Math.max(0, TOTAL - slot) / (cards.length - 1) : 0}ms`);
    cards.forEach((c, k) => c.style.setProperty("--k", String(k)));
    let scrolled = false, inView = false, timer = 0, fallback = 0;
    const start = () => {
      if (timer || !inView) return;
      timer = window.setTimeout(() => list.classList.add("icseq-go"), WAIT);
      io.disconnect();
      removeEventListener("scroll", onScroll);
    };
    const onScroll = () => { scrolled = true; start(); };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && scrolled) start();
      // on screen but the page is never scrolled (e.g. a tall screen): start anyway so the icons are not left hidden
      if (inView && !fallback) fallback = window.setTimeout(() => { scrolled = true; start(); }, 3000);
    }, { threshold: 0.25 });
    io.observe(list);
    addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); clearTimeout(timer); clearTimeout(fallback); };
  }, [listSel, item, slot]);
  return <span ref={ref} hidden />;
}
