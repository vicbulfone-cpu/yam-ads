"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Match box popups on tablets and desktops (owner, 7 Oct 2026): draws the box as large as the space left in the popup
 * allows (evenly, no squashing), so the whole box can be read without scrolling. The layout space shrinks with it,
 * so it stays centred. Phones (below 768px) are untouched. Styles: ".fit-box" in globals.css.
 */
export default function FitBox({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const outer = outerRef.current, inner = innerRef.current;
    if (!outer || !inner) return;
    const fit = () => {
      // the box's own size (transforms and margins do not change these)
      const h = inner.offsetHeight, w = inner.offsetWidth;
      const roomH = outer.clientHeight, roomW = outer.clientWidth;
      // as large as the popup allows (owner, 7 Oct 2026: bigger, still no scrolling): grow or shrink until either the
      // height or the width is used up
      const s = window.innerWidth >= 768 && h > 0 && w > 0 && roomH > 0 ? Math.min(roomH / h, roomW / w) : 1;
      inner.style.transform = s !== 1 ? `scale(${s})` : "";
      inner.style.marginBottom = s !== 1 ? `${h * (s - 1)}px` : "";
    };
    fit();
    // again once the popup has finished opening (it scales in)
    const late = window.setTimeout(fit, 450);
    const ro = new ResizeObserver(fit);
    ro.observe(outer);
    ro.observe(inner);
    return () => { ro.disconnect(); window.clearTimeout(late); };
  }, []);

  return (
    <div ref={outerRef} className="fit-box">
      <div ref={innerRef} className="fit-box-in">{children}</div>
    </div>
  );
}
