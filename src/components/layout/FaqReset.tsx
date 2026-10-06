"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Every FAQ question starts closed whenever a page is shown (owner, 6 Oct 2026). FAQ boxes are marked `data-faq`
 * (FAQSection.tsx, Blocks.tsx Faq). The pages already render them closed; this also closes any the browser brings back
 * open: moving between pages, and Back/Forward where the browser restores the old page as it was left.
 */
export default function FaqReset() {
  const pathname = usePathname();

  useEffect(() => {
    const closeAll = () => document.querySelectorAll<HTMLDetailsElement>("details[data-faq][open]").forEach((d) => { d.open = false; });
    closeAll();
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) closeAll(); };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, [pathname]);

  return null;
}
