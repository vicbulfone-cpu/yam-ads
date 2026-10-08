"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { logo } from "@/config/site.config";
import { AD_MATCH_BOX_ID } from "@/lib/ad-match-box";
import { OPEN_AD_BOX } from "@/lib/questionnaire-events";
import FitBox from "../ui/FitBox";
import StartHere from "../ui/StartHere";
import { Close } from "../ui/Icons";

/**
 * Ad pages, tablets and desktops (owner, 7 Oct 2026): every call-to-action button that goes back to the ad's match box
 * (#match-box) opens that same match box in a popup instead, with a "Start here" message above it, drawn small enough
 * that all of it fits with no scrolling. The match box itself never opens it. Pressing the box's Start opens the ad's
 * own questionnaire (paid lead) and this popup closes. Phones keep the jump back up to the page's box.
 * Same look as the home page's match box popup (".q-modal" in globals.css). The links stay ordinary #match-box links.
 */
export default function AdBoxPopup({ openEvent, phones = false, children }: { openEvent: string; phones?: boolean; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handOff = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // phones: a page whose hero has no match box of its own (Ad 2 since 9 Oct 2026) opens the popup on phones too
    const wide = () => phones || window.matchMedia("(min-width: 768px)").matches;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !wide()) return;
      const a = (e.target as Element | null)?.closest?.(`a[href$="#${AD_MATCH_BOX_ID}"]`) as HTMLAnchorElement | null;
      // links inside the information popup go through its own "back to the box" (which sends OPEN_AD_BOX)
      if (!a || a.hasAttribute("data-info-start") || a.closest(`#${AD_MATCH_BOX_ID}, dialog`)) return;
      e.preventDefault(); // Next's <Link> skips its jump when the default is prevented
      setOpen(true);
    };
    const onOpen = (e: Event) => { if (wide()) { e.preventDefault(); setOpen(true); } };
    // the box's Start opened the questionnaire: hand over to it
    const onStart = () => { handOff.current = true; setOpen(false); };
    window.addEventListener("click", onClick, true);
    window.addEventListener(OPEN_AD_BOX, onOpen);
    window.addEventListener(openEvent, onStart);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener(OPEN_AD_BOX, onOpen);
      window.removeEventListener(openEvent, onStart);
    };
  }, [openEvent, phones]);

  // native dialog: focus trap, Esc key and top layer come for free; the page behind stays still
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    // when the questionnaire takes over, it keeps the page still itself
    if (open) document.documentElement.classList.add("q-modal-open");
    else if (!handOff.current) document.documentElement.classList.remove("q-modal-open");
    handOff.current = false;
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="q-modal"
      data-step="select"
      aria-label="Start here"
      onClose={() => setOpen(false)}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      {open && (
        <div className="relative flex h-full max-h-[inherit] flex-col">
          <div className="q-modal-top flex shrink-0 items-center justify-between gap-3 border-b border-line/70 bg-white/90 px-4 py-2.5 sm:px-6">
            <Image src={logo.srcSmall} alt={logo.alt} width={680} height={91} className="h-auto w-[170px] sm:w-[210px]" />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="q-modal-close">
              <Close width={20} height={20} strokeWidth={2.4} />
            </button>
          </div>
          <div data-bg="select" className="q-modal-body q-fit-body min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="q-modal-card q-fit-card flex min-h-full items-center"><div className="w-full">
              <StartHere />
              <FitBox>{children}</FitBox>
            </div></div>
          </div>
        </div>
      )}
    </dialog>
  );
}
