"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "../ui/Icons";

export default function ReturnToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const updateVisibility = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
        setVisible(window.scrollY > 0 && window.scrollY >= scrollableDistance / 2);
      });
    };

    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    updateVisibility();
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Return to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={(event) => {
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
        event.currentTarget.blur();
        window.scrollTo({ top: 0, behavior });
      }}
      className={`fixed bottom-7 right-7 z-40 hidden h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-navy-700 via-navy-900 to-green-700 text-white shadow-[0_10px_28px_rgba(7,50,101,.3)] ring-1 ring-white/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(7,50,101,.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300 lg:grid ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp width={23} height={23} strokeWidth={2.5} />
    </button>
  );
}
