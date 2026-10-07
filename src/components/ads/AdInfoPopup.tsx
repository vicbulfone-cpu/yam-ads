"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { logo, QUESTIONNAIRE_URL } from "@/config/site.config";
import { ArrowRight } from "../ui/Icons";
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import { OPEN_AD_BOX } from "@/lib/questionnaire-events";
import { ABOUT_POPUP } from "@/content/about-popup";
import AboutPopup from "./AboutPopup";

/**
 * Ad pages (owner, 6 Oct 2026): the footer's information links (About, Contact, Privacy, Terms, How we select
 * accountants) open in a popup over the ad page instead of leaving it. The links stay real links in the page HTML, so
 * search engines, Google Ads' checker and visitors without JavaScript still reach the normal pages; nothing opens in a
 * new tab (owner, 7 Oct 2026).
 * The popup fetches the real page and shows its own words (headline, introduction and sections); the page's match boxes
 * and "Find My Accountant" buttons are left out, and any other questionnaire link goes back to the ad's own match box,
 * so ad visitors stay in the ad questionnaire (paid lead). One copy of every page's wording, nothing duplicated.
 * Links marked data-info open here; links to other pages inside the popup open normally. Styles: ".adi" in ads.css.
 */
const INFO_PATHS = new Set(["/about", "/contact", "/privacy", "/terms", "/how-we-select-accountants", "/how-it-works"]);
const norm = (p: string) => p.replace(/\/$/, "") || "/";

type Page = { title: string; html: string; own?: ReactNode };
const cache = new Map<string, Page>();

function extract(text: string, base: URL): Page {
  const doc = new DOMParser().parseFromString(text, "text/html");
  const sections = [...(doc.querySelector("main")?.children ?? [])].filter((e) => e.tagName === "SECTION");
  const h1 = sections[0]?.querySelector("h1");
  const out = doc.createElement("div");
  // the hero: only the words beside the headline (no breadcrumb, headline or match box)
  [...(h1?.parentElement?.children ?? [])].forEach((c) => {
    if (c === h1 || c.tagName === "NAV" || c.tagName === "SCRIPT" || c.querySelector(".mc")) return;
    out.appendChild(c);
  });
  // the page's sections that carry a heading (the closing "Find My Accountant" band has none)
  sections.slice(1).filter((s) => s.querySelector("h2, h3")).forEach((s) => out.appendChild(s));
  out.querySelectorAll("script, noscript, .mc, .mc-hero-card").forEach((e) => e.remove());

  const qPath = norm(new URL(QUESTIONNAIRE_URL, window.location.href).pathname);
  out.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
    const url = new URL(a.getAttribute("href") ?? "", base);
    const same = url.origin === window.location.origin;
    if (same && norm(url.pathname) === qPath) {
      if (a.classList.contains("btn")) a.remove(); // the page's own call-to-action buttons
      else { a.setAttribute("href", `#${AD_MATCH_BOX_ID}`); a.setAttribute("data-info-start", ""); }
      return;
    }
    if (same && url.hash && norm(url.pathname) === norm(base.pathname)) return; // in-page jump
    if (same && INFO_PATHS.has(norm(url.pathname))) a.setAttribute("data-info", "");
    a.removeAttribute("target"); // never a new tab (owner, 7 Oct 2026)
  });
  return { title: h1?.textContent?.trim() ?? "", html: out.innerHTML };
}

/** About popup (owner, 7 Oct 2026): the owner's own About Us wording (AboutPopup.tsx), not the /about page's words. */
const OWN_CONTENT: Record<string, Page> = { "/about": { title: ABOUT_POPUP.title, html: "", own: <AboutPopup /> } };

async function loadPage(url: URL): Promise<Page> {
  const key = norm(url.pathname);
  if (OWN_CONTENT[key]) return OWN_CONTENT[key];
  const hit = cache.get(key);
  if (hit) return hit;
  const res = await fetch(url.pathname, { credentials: "same-origin" });
  if (!res.ok) throw new Error(String(res.status));
  const p = extract(await res.text(), url);
  cache.set(key, p);
  return p;
}

export default function AdInfoPopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [open, setOpen] = useState(false);

  // close the popup and go back to the ad's own match box: tablets and desktops open it in its own popup
  // (AdBoxPopup.tsx cancels the event); phones scroll back up to it
  const backToBox = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => {
      if (!window.dispatchEvent(new Event(OPEN_AD_BOX, { cancelable: true }))) return;
      document.getElementById(AD_MATCH_BOX_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    const load = async (href: string) => {
      const url = new URL(href, window.location.href);
      setOpen(true);
      bodyRef.current?.scrollTo(0, 0);
      setPage(null);
      try {
        setPage(await loadPage(url));
      } catch {
        // never a dead end: open the normal page instead (same tab, owner 7 Oct 2026)
        setOpen(false);
        window.location.assign(url.href);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[data-info], a[data-info-start]") as HTMLAnchorElement | null;
      if (!a) return;
      e.preventDefault();
      if (a.hasAttribute("data-info-start")) backToBox();
      else load(a.href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [backToBox]);

  // native dialog: focus trap, Esc key and top layer come for free; the page behind stays still
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.classList.toggle("q-modal-open", open);
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="q-modal adi"
      aria-labelledby="adi-title"
      onClose={() => setOpen(false)}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="relative flex h-full max-h-[inherit] flex-col">
        <div className="q-modal-top flex shrink-0 items-center justify-between gap-3 border-b border-line/70 bg-white/90 px-4 py-2.5 sm:px-6">
          <Image src={logo.srcSmall} alt={logo.alt} width={680} height={91} className="h-auto w-[170px] sm:w-[210px]" />
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="q-modal-close">
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div ref={bodyRef} className="adi-body min-h-0 flex-1 overflow-y-auto">
          {page ? (
            <>
              <h2 id="adi-title" className="adi-title">{page.title}</h2>
              {page.own ?? <div className="adi-content" dangerouslySetInnerHTML={{ __html: page.html }} />}
            </>
          ) : (
            <div className="adi-loading" role="status" aria-label="Loading"><span aria-hidden /></div>
          )}
        </div>
        <div className="q-modal-footer flex shrink-0 justify-center border-t border-line/70 bg-white px-4 py-3">
          <button type="button" onClick={backToBox} className="btn btn-primary min-w-[14rem] rounded-full px-8">
            Start My Match <ArrowRight />
          </button>
        </div>
      </div>
    </dialog>
  );
}
