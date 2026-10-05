"use client";

import { useEffect, useRef } from "react";

const CM = 96 / 2.54; // 1cm in CSS pixels

/**
 * Home page, laptop and desktop: pulls the section it sits in up so its content starts `cm` (default 2.5cm) below the
 * bottom of the hero picture and match box (the hero keeps blank space at its foot, which varies with the screen size).
 */
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
      if (window.innerWidth < 1024 || !pic || !box) return;
      const heroBottom = Math.max(pic.getBoundingClientRect().bottom, box.getBoundingClientRect().bottom);
      const pull = content.getBoundingClientRect().top - heroBottom - GAP;
      if (pull > 0) section.style.marginTop = `${-pull}px`;
    };
    // after the match box has scaled itself to the window
    const run = () => requestAnimationFrame(() => requestAnimationFrame(place));
    run();
    window.addEventListener("resize", run);
    return () => window.removeEventListener("resize", run);
  }, [GAP]);
  return <span ref={ref} hidden />;
}
