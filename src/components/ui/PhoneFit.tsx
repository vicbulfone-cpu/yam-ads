"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Phones only (below 768px; owner, 5 Oct 2026): the questionnaire fills the screen and the screen does not scroll, so each
 * step is drawn just small enough to fit the space between the top bar and the Back/Next bar, the way the match box fits
 * the screen. The content is laid out wider and then scaled down by the same amount, so it still fills the full width.
 * It never shrinks below MIN_SCALE (text stays readable); a step that is still too tall (very small phones with a lot
 * ticked) can then be scrolled inside the questionnaire as a last resort. Tablets and desktops are left untouched.
 * Put this directly inside the questionnaire's scrolling area (".q-modal-body").
 */
const MIN_SCALE = 0.72;
const PHONE = "(max-width: 767px)";

export default function PhoneFit({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    const mq = window.matchMedia(PHONE);
    let scale = 1;
    let raf = 0;

    const reset = () => {
      scale = 1;
      el.style.removeProperty("width");
      el.style.removeProperty("transform");
      el.style.removeProperty("margin-bottom");
    };
    const fit = () => {
      raf = 0;
      if (!mq.matches) return reset();
      const avail = box.clientHeight;
      // a few rounds: laying the step out wider makes its text re-wrap, which changes its height again
      for (let round = 0; round < 4; round++) {
        // offsetHeight is the height before scaling, at the current (widened) width
        const natural = el.offsetHeight;
        if (!natural || !avail) return;
        // the scale that fits this height, never larger than the last one that fitted at this width
        const next = Math.max(MIN_SCALE, Math.min(1, Math.floor((avail / natural) * 1000) / 1000));
        if (Math.abs(next - scale) < 0.004 && natural * scale <= avail + 1) break;
        scale = round < 3 ? next : Math.min(scale, next);
        // laid out wider by 1/scale, then scaled back down to the full width
        el.style.width = scale < 1 ? `${box.clientWidth / scale}px` : "";
        el.style.transform = scale < 1 ? `scale(${scale})` : "";
      }
      // the space the scaled step really takes up, so nothing is left to scroll below it
      el.style.marginBottom = scale < 1 ? `${-(el.offsetHeight * (1 - scale))}px` : "";
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(fit); };

    const ro = new ResizeObserver(queue);
    ro.observe(box);
    ro.observe(el);
    mq.addEventListener("change", queue);
    queue();
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", queue);
      if (raf) cancelAnimationFrame(raf);
      reset();
    };
  }, []);

  return <div ref={ref} className={`q-fit ${className}`}>{children}</div>;
}
