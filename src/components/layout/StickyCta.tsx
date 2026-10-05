"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QUESTIONNAIRE_URL, stickyCtaLabel } from "@/config/site.config";
import { ArrowRight } from "../ui/Icons";

/**
 * Phones only: a small bottom bar holding the main CTA, right where the thumb rests.
 * It stays hidden until the visitor has scrolled one full screen past the bottom of the page's match box, so it
 * never competes with the match box itself. Hidden on 768px+ (the header carries the CTA there).
 * Label is the old site's floating button wording. The link is always in the page HTML.
 */
export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const card = document.querySelector("main [data-match-card]");
        // bottom edge of the match box measured from the top of the page (falls back to the top if a page has none)
        const cardBottom = card ? card.getBoundingClientRect().bottom + window.scrollY : 0;
        setVisible(window.scrollY > cardBottom + window.innerHeight);
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`sticky-cta fixed inset-x-0 bottom-0 z-40 px-[12.5%] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.75rem))] pt-1 transition duration-300 md:hidden ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
    >
      <Link
        href={QUESTIONNAIRE_URL}
        tabIndex={visible ? 0 : -1}
        className="btn btn-primary w-full !min-h-[2.625rem] !gap-2 !px-3 !py-1.5 whitespace-nowrap !text-[1.05rem] shadow-[0_13px_30px_-9px_rgba(0,100,40,.6)]"
      >
        <span>{stickyCtaLabel}</span>
        <span className="btn-arrow !h-6 !w-6"><ArrowRight width={13} height={13} strokeWidth={2.5} /></span>
      </Link>
    </div>
  );
}
