"use client";

import { useEffect } from "react";

const STEP_MS = 2000;
const START_AFTER_LOAD_MS = 2000;

/**
 * Moves the /ad-2 "How it works" step icons (PersonalHowSteps.tsx; owner, 9 Oct 2026): 2 seconds after the page loads,
 * step 1 for 2 seconds (the pen writes), then step 2 (the puzzle pieces join), then step 3 (the hands greet), then
 * stop. If the steps are still off screen by then, the run waits until they come into view, so it is always seen.
 * Hovering a step plays its icon again. Off for visitors who turn motion off.
 */
export default function PersonalHowStepsAnim() {
  useEffect(() => {
    const ol = document.querySelector<HTMLElement>(".phs");
    if (!ol || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const steps = [...ol.querySelectorAll<HTMLElement>(".phs-step")];
    const timers: number[] = [];
    /** one step's icon (and its number) moves for 2 seconds; restarts cleanly if it is already moving */
    const play = (el: HTMLElement) => {
      el.classList.remove("is-anim");
      void el.offsetWidth; // restart the CSS animation
      el.classList.add("is-anim");
      timers.push(window.setTimeout(() => el.classList.remove("is-anim"), STEP_MS));
    };
    let ready = false, inView = false, started = false;
    const run = () => {
      if (started || !ready || !inView) return;
      started = true;
      io.disconnect();
      steps.forEach((el, i) => timers.push(window.setTimeout(() => play(el), i * STEP_MS)));
    };
    const io = new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting);
      run();
    }, { threshold: 0.35 });
    io.observe(ol);
    const onLoad = () => timers.push(window.setTimeout(() => { ready = true; run(); }, START_AFTER_LOAD_MS));
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    const onEnter = (e: Event) => play(e.currentTarget as HTMLElement);
    steps.forEach((el) => el.addEventListener("mouseenter", onEnter));
    return () => {
      io.disconnect();
      window.removeEventListener("load", onLoad);
      timers.forEach(clearTimeout);
      steps.forEach((el) => el.removeEventListener("mouseenter", onEnter));
    };
  }, []);
  return null;
}
