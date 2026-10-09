"use client";

import { useEffect } from "react";

const MIN_CARD_GAP = 96 / 2.54; // 1cm in CSS pixels

/**
 * /ad-2 (owner, 9 Oct 2026): the space between the navy "Your Ideal Accountant Awaits" bar and "Tax time, made easier"
 * is the same as the space between the navy bar under the hero and "What we can help you with" (bar bottom to the
 * top of the label's line). On laptops and desktops the words sit centred beside the help box, so that space changes
 * with the screen width; the section (and everything under it) is moved by measuring, and again whenever the window
 * size changes. Without JavaScript the section simply keeps its CSS position.
 */
export default function MatchWhyGap() {
  useEffect(() => {
    const why = document.querySelector<HTMLElement>(".pps-why");
    const heroBar = document.querySelector<HTMLElement>(".pz-hero-bar");
    const servicesLabel = document.querySelector<HTMLElement>(".pps-services .pps-eyebrow");
    const idealBar = document.querySelector<HTMLElement>(".pps-bar-gap--ideal > *");
    const whyLabel = why?.querySelector<HTMLElement>(".pps-eyebrow");
    if (!why || !heroBar || !servicesLabel || !idealBar || !whyLabel) return;
    /** top of a label's line of words (not its box) */
    const lineTop = (el: HTMLElement) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().top; };
    const place = () => {
      why.style.marginTop = "";
      const base = parseFloat(getComputedStyle(why).marginTop) || 0;
      const want = lineTop(servicesLabel) - heroBar.getBoundingClientRect().bottom;
      const now = lineTop(whyLabel) - idealBar.getBoundingClientRect().bottom;
      why.style.marginTop = `${base + want - now}px`;
      // never closer than 1cm between the bar and the help box (narrow laptops, where the box is tall)
      const card = why.querySelector<HTMLElement>(".pps-why-card");
      if (card) {
        const short = idealBar.getBoundingClientRect().bottom + MIN_CARD_GAP - card.getBoundingClientRect().top;
        if (short > 0) why.style.marginTop = `${base + want - now + short}px`;
      }
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(document.documentElement);
    document.fonts?.ready.then(place);
    return () => { ro.disconnect(); why.style.marginTop = ""; };
  }, []);
  return null;
}
