"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { matchFit } from "@/lib/match-fit";
import { BIZ_CARD, BIZ_CATEGORIES, type BizCategory } from "@/content/business-questionnaire";
import { ArrowRight, Check } from "../ui/Icons";
import { BIZ_CATEGORY_ICONS, ShieldCheck } from "./BizIcons";
import { OPEN_BIZ_QUESTIONNAIRE } from "./BusinessQuestionnaire";

/**
 * Business match box (owner's "business" design picture). Same look as the site's match box (".mc" styles in
 * globals.css); ticking one or more needs and pressing Start opens the business questionnaire at the first need.
 * Other "select all that apply" ads (SMSF /ad-3) pass their own wording, categories, icons and opening event.
 */
export type CardWords = { eyebrow: string; title: string[]; sub: string; question: string; hint: string; start: string; note: string[]; footer: string; error: string };
const BUSINESS_WORDS: CardWords = { ...BIZ_CARD, sub: BIZ_CARD.sub.join(" "), footer: BIZ_CARD.footer[0] };

export default function BizMatchCard({
  words: W = BUSINESS_WORDS, categories = BIZ_CATEGORIES, icons = BIZ_CATEGORY_ICONS, openEvent = OPEN_BIZ_QUESTIONNAIRE, className = "",
}: { words?: CardWords; categories?: BizCategory[]; icons?: Record<string, ReactNode>; openEvent?: string; className?: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // laptops/desktops: drawn just small enough to fit the visible browser area, exactly as the home page match box
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const fit = () => {
      const f = matchFit(box);
      if (f == null) box.style.removeProperty("--mc-fit");
      else box.style.setProperty("--mc-fit", String(f));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const toggle = (id: string) => {
    setError(false);
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };
  const start = () => {
    if (!selected.length) return setError(true);
    // always in the match box's order, whatever order they were ticked in
    const ids = categories.map((c) => c.id).filter((id) => selected.includes(id));
    window.dispatchEvent(new CustomEvent(openEvent, { detail: ids }));
  };

  return (
    <div ref={boxRef} data-match-card="" className={`mc bz-card ${className}`}>
      <div className="mc-head">
        <p className="mc-eyebrow">{W.eyebrow}</p>
        <h2 className="mc-title">
          <span className="block">{W.title[0]}</span> <span className="block">{W.title[1]}</span>
        </h2>
        <span aria-hidden className="mc-rule" />
        <p className="mc-sub">{W.sub}</p>
        <span aria-hidden className="mc-map" />
      </div>

      <div className="mc-in">
        <p className="mc-q">{W.question}</p>
        <p className="mc-hint">{W.hint}</p>
        <fieldset className="mc-rows">
          <legend className="sr-only">{W.question}</legend>
          {categories.map((c) => {
            const on = selected.includes(c.id);
            return (
              <label key={c.id} className={`mc-row${on ? " is-on" : ""}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(c.id)} aria-label={c.box.title} className="peer sr-only" />
                <span aria-hidden className={`mc-tile is-${c.tone}`}>
                  <svg viewBox="0 0 24 24" className="mc-tile-icon">{icons[c.id]}</svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mc-row-title">{c.box.title}</span>
                  <span className="mc-row-desc">{c.box.desc}</span>
                </span>
                <span aria-hidden className="mc-radio"><Check width={20} height={20} strokeWidth={3.2} /></span>
              </label>
            );
          })}
        </fieldset>
        <button type="button" onClick={start} className="btn btn-primary mc-start">
          <span>{W.start}</span>
          <ArrowRight className="mc-start-arrow" strokeWidth={2.6} />
        </button>
        {error && <p role="alert" className="mt-2 text-center text-xs font-semibold text-red-600">{W.error}</p>}
        <p className="mc-note">
          {W.note.map((n, i) => (
            <span key={n}>{i > 0 && <span aria-hidden className="mc-dot">&bull;</span>}{n}</span>
          ))}
        </p>
      </div>

      {/* mint band along the bottom, as on the home page box */}
      <p className="mc-foot">
        <ShieldCheck className="mc-shield" />
        <span>{W.footer}</span>
      </p>
    </div>
  );
}
