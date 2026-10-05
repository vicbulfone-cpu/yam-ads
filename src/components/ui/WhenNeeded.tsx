"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

/**
 * Loads a questionnaire's code only when it may be needed, so pages start faster (owner speed pass, 6 Oct 2026).
 *
 * - The code is fetched at the visitor's first sign of activity (mouse movement, touch, scroll, key press, focus), which
 *   always comes before they can press Start, or after a few seconds of the page being idle.
 * - If an "open" event (or, with `linkPath`, a click on a link to the questionnaire address) arrives before the code is
 *   ready, it is held and replayed as soon as the questionnaire has mounted, so nothing is lost.
 * Nothing is drawn until then; the questionnaires show nothing until they are opened anyway.
 */
type Loaded<P> = { default: ComponentType<P> };

const ACTIVITY = ["pointermove", "pointerdown", "touchstart", "keydown", "scroll", "focusin"] as const;
const IDLE_FALLBACK_MS = 8000;

export default function WhenNeeded<P extends object>({ load, props, events = [], linkPath, preloadEvents = [], waitForEvent = false }: {
  load: () => Promise<Loaded<P>>;
  props: P;
  /** events that open this questionnaire (held and replayed if they arrive early) */
  events?: string[];
  /** questionnaire address: early clicks on links to it are held and replayed */
  linkPath?: string;
  /** events that only start loading the code (nothing is held or replayed) */
  preloadEvents?: string[];
  /** true: load only on an open/preload event or link click, not at the first sign of activity (for questionnaires a
   *  page rarely opens, e.g. the ad questionnaires on the main site) */
  waitForEvent?: boolean;
}) {
  const [Comp, setComp] = useState<ComponentType<P> | null>(null);
  const started = useRef(false);
  const ready = useRef(false);
  const pending = useRef<(() => void)[]>([]);

  useEffect(() => {
    const start = () => {
      if (started.current) return;
      started.current = true;
      void load().then((m) => setComp(() => m.default)).catch(() => { started.current = false; });
    };
    const onActivity = () => start();
    if (!waitForEvent) ACTIVITY.forEach((t) => window.addEventListener(t, onActivity, { once: true, passive: true, capture: true }));
    const idle = waitForEvent ? undefined : window.setTimeout(start, IDLE_FALLBACK_MS);
    preloadEvents.forEach((t) => window.addEventListener(t, onActivity));

    // an "open" event that arrives before the questionnaire is ready: hold it
    const onOpen = (e: Event) => {
      if (ready.current) return;
      const detail = (e as CustomEvent).detail;
      pending.current.push(() => window.dispatchEvent(new CustomEvent(e.type, { detail })));
      start();
    };
    events.forEach((t) => window.addEventListener(t, onOpen));

    // a click on a link to the questionnaire before it is ready: stop the page change, hold the click
    const target = linkPath ? new URL(linkPath, window.location.href) : null;
    const onClick = (e: MouseEvent) => {
      if (ready.current || !target || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== target.origin || url.pathname.replace(/\/$/, "") !== target.pathname.replace(/\/$/, "")) return;
      e.preventDefault();
      pending.current.push(() => a.click());
      start();
    };
    if (target) window.addEventListener("click", onClick, true);

    return () => {
      ACTIVITY.forEach((t) => window.removeEventListener(t, onActivity, { capture: true }));
      window.clearTimeout(idle);
      preloadEvents.forEach((t) => window.removeEventListener(t, onActivity));
      events.forEach((t) => window.removeEventListener(t, onOpen));
      if (target) window.removeEventListener("click", onClick, true);
    };
    // load, events and linkPath are fixed for each questionnaire
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the questionnaire has mounted (its own listeners are set up first, as a child): replay anything held
  useEffect(() => {
    if (!Comp) return;
    ready.current = true;
    const queued = pending.current.splice(0);
    queued.forEach((run) => run());
  }, [Comp]);

  return Comp ? <Comp {...props} /> : null;
}
