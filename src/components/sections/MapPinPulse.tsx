"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Home page network map (owner, 10 Oct 2026): the green ring on the map's tick pin. It starts once the whole map is on
 * screen (or fills the screen, if it is taller than it): one 1s pulse, then it stops
 * (globals.css .hmi-map-pulse.is-on). It plays only once per page visit. `x`/`y`: the pin's place as % of the map.
 */
export default function MapPinPulse({ x, y }: { x: number; y: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return; // very old browsers: no pulse
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const whole = e.boundingClientRect.height <= window.innerHeight
          ? e.intersectionRatio >= 0.99
          : e.intersectionRect.height >= window.innerHeight * 0.99;
        if (whole) { setOn(true); io.disconnect(); }
      }
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20).concat(0.99) });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} aria-hidden className="hmi-map-anim">
      <span className={`hmi-map-pulse${on ? " is-on" : ""}`} style={{ left: `${x}%`, top: `${y}%` }} />
    </div>
  );
}
