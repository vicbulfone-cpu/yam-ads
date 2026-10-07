"use client";

import { useEffect, useRef } from "react";

/**
 * "Why it matters" cards, desktops (owner, 7 Oct 2026): adds "wim-anim" so the cards start hidden, then "is-in" when the
 * band scrolls into view, so they rise in one after another (styles: ".wim-" in globals.css). Without JavaScript, on
 * phones/tablets or with reduced motion nothing is hidden.
 */
export default function WimReveal() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const list = ref.current?.parentElement?.querySelector<HTMLElement>(".wim-cards");
    if (!list) return;
    if (!window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return;
    list.classList.add("wim-anim");
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { list.classList.add("is-in"); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(list);
    return () => io.disconnect();
  }, []);
  return <span ref={ref} hidden />;
}
