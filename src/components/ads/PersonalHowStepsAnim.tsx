"use client";

import { useEffect } from "react";

const STEP_MS = 1000;

/**
 * Moves the /ad-2 "How it works" step icons (PersonalHowSteps.tsx; owner, 9 Oct 2026): when the steps first come into
 * view (straight away if they are on screen as the page loads), step 1 for 1 second, then step 2, then step 3, then
 * stop. Hovering a step moves its icon for 1 second again. Off for visitors who turn motion off.
 */
export default function PersonalHowStepsAnim() {
  useEffect(() => {
    const ol = document.querySelector<HTMLElement>(".phs");
    if (!ol || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const steps = [...ol.querySelectorAll<HTMLElement>(".phs-step")];
    const timers: number[] = [];
    /** one step's icon (and its number) moves for 1 second; restarts cleanly if it is already moving */
    const play = (el: HTMLElement) => {
      el.classList.remove("is-anim");
      void el.offsetWidth; // restart the CSS animation
      el.classList.add("is-anim");
      timers.push(window.setTimeout(() => el.classList.remove("is-anim"), STEP_MS));
    };
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      steps.forEach((el, i) => timers.push(window.setTimeout(() => play(el), i * STEP_MS)));
    }, { threshold: 0.35 });
    io.observe(ol);
    const onEnter = (e: Event) => play(e.currentTarget as HTMLElement);
    steps.forEach((el) => el.addEventListener("mouseenter", onEnter));
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      steps.forEach((el) => el.removeEventListener("mouseenter", onEnter));
    };
  }, []);
  return null;
}
