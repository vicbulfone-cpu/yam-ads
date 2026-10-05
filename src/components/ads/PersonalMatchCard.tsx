"use client";

import { useEffect, useRef, useState } from "react";
import { matchFit } from "@/lib/match-fit";
import { PERSONAL_CARD as C, PERSONAL_NEEDS } from "@/content/personal-questionnaire";
import { ArrowRight, Check } from "../ui/Icons";
import { PERSONAL_NEED_ICONS, ShieldCheck } from "./BizIcons";
import { OPEN_PERSONAL_QUESTIONNAIRE } from "@/lib/questionnaire-events";

/**
 * Personal tax match box. Same look and size as the home page box (".mc" in globals.css; owner, 5 Oct 2026: every ad
 * match box uses the home box style): navy heading panel with the map, open rows with dividers and round ticks, mint band.
 * Personal differences: one choice only, and a small "Not sure — help me choose" link under the rows.
 */
export default function PersonalMatchCard() {
  const [selected, setSelected] = useState<string | null>(null);
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

  const open = (need: string) => window.dispatchEvent(new CustomEvent(OPEN_PERSONAL_QUESTIONNAIRE, { detail: need }));
  const start = () => (selected ? open(selected) : setError(true));

  return (
    <div ref={boxRef} data-match-card="" className="mc bz-card pz-card">
      <div className="mc-head">
        <p className="mc-eyebrow">{C.eyebrow}</p>
        <h2 className="mc-title">
          <span className="block">{C.title[0]}</span> <span className="block">{C.title[1]}</span>
        </h2>
        <span aria-hidden className="mc-rule" />
        <p className="mc-sub">{C.sub}</p>
        <span aria-hidden className="mc-map" />
      </div>

      <div className="mc-in">
        <p className="mc-q">{C.question}</p>
        <p className="mc-hint">{C.hint}</p>
        <fieldset className="mc-rows">
          <legend className="sr-only">{C.question}</legend>
          {PERSONAL_NEEDS.map((n) => {
            const on = selected === n.id;
            return (
              <label key={n.id} className={`mc-row${on ? " is-on" : ""}`}>
                <input type="radio" name="pz-need" checked={on} onChange={() => { setSelected(n.id); setError(false); }} aria-label={n.box.title} className="peer sr-only" />
                <span aria-hidden className={`mc-tile is-${n.tone}`}>
                  <svg viewBox="0 0 24 24" className="mc-tile-icon">{PERSONAL_NEED_ICONS[n.id]}</svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mc-row-title">{n.box.title}</span>
                  <span className="mc-row-desc">{n.box.desc}</span>
                </span>
                <span aria-hidden className="mc-radio"><Check width={20} height={20} strokeWidth={3.2} /></span>
              </label>
            );
          })}
        </fieldset>
        <button type="button" onClick={() => open("choose")} className="pz-unsure">{C.unsure}</button>
        <button type="button" onClick={start} className="btn btn-primary mc-start">
          <span>{C.start}</span>
          <ArrowRight className="mc-start-arrow" strokeWidth={2.6} />
        </button>
        {error && <p role="alert" className="mt-2 text-center text-xs font-semibold text-red-600">{C.error}</p>}
        <p className="mc-note">
          {C.note.map((n, i) => (
            <span key={n}>{i > 0 && <span aria-hidden className="mc-dot">&bull;</span>}{n}</span>
          ))}
        </p>
      </div>

      {/* mint band along the bottom, as on the home page box */}
      <p className="mc-foot">
        <ShieldCheck className="mc-shield" />
        <span>{C.footer}</span>
      </p>
    </div>
  );
}
