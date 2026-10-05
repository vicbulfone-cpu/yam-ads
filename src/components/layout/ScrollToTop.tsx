"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Starts every newly opened page at the top. Next.js keeps the scroll position when the new
 * page is already in view (likely on these long pages), so clicking a footer link would land
 * mid-page. Back/forward keep the browser's remembered position, and #anchor links are left alone.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const first = useRef(true);
  const historyNav = useRef(false);

  useEffect(() => {
    const onPop = () => { historyNav.current = true; };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (historyNav.current) { historyNav.current = false; return; }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
