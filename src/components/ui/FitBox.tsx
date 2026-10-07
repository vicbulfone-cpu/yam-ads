"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Match box popups on tablets and desktops (owner, 7 Oct 2026): draws the box just small enough to fit the space left in
 * the popup (evenly, no squashing), so the whole box can be read without scrolling. The layout space shrinks with it,
 * so it stays centred. Phones (below 768px) are untouched. Styles: ".fit-box" in globals.css.
 */
export default function FitBox({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const outer = outerRef.current, inner = innerRef.current;
    if (!outer || !inner) return;
    const fit = () => {
      const natural = inner.offsetHeight; // transforms and margins do not change this
      const room = outer.clientHeight;
      const s = window.innerWidth >= 768 && natural > 0 && room > 0 ? Math.min(1, room / natural) : 1;
      inner.style.transform = s < 1 ? `scale(${s})` : "";
      inner.style.marginBottom = s < 1 ? `${natural * (s - 1)}px` : "";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="fit-box">
      <div ref={innerRef} className="fit-box-in">{children}</div>
    </div>
  );
}
