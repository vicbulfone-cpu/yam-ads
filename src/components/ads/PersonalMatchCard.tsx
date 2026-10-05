"use client";

import { useEffect, useRef, useState } from "react";
import { matchFit } from "@/lib/match-fit";
import { PERSONAL_CARD as C, PERSONAL_NEEDS } from "@/content/personal-questionnaire";
import { ArrowRight, Check } from "../ui/Icons";
import { LockIcon, PERSONAL_NEED_ICONS, ShieldCheck } from "./BizIcons";
import { OPEN_PERSONAL_QUESTIONNAIRE } from "./PersonalQuestionnaire";

/**
 * Personal tax match box (owner's "personal" design picture): white heading with a green swoosh and the map of
 * Australia, a mint "one local accountant" band, four bordered one-choice rows and a small "Not sure — help me choose".
 * Built on the home page box (".mc" in globals.css) so sizes match; differences are the ".pz-card" rules in ads.css.
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
    <div ref={boxRef} data-match-card="" className="mc pz-card">
      <div className="mc-head">
        <h2 className="mc-title">
          <span className="pz-title-1 block">{C.title[0]}</span> <span className="pz-swoosh">{C.title[1]}</span>
        </h2>
        <span aria-hidden className="pz-map"><span className="mc-map" /><span className="pz-map-label">{C.map}</span></span>
      </div>

      <p className="pz-band">
        <ShieldCheck className="mc-shield" />
        <span>{C.band[0]}<strong>{C.band[1]}</strong>{C.band[2]}</span>
      </p>

      <div className="mc-in">
        <p className="mc-q">{C.question}</p>
        <p className="mc-hint">{C.hint}</p>
        <fieldset className="mc-rows">
          <legend className="sr-only">{C.question}</legend>
          {PERSONAL_NEEDS.map((n) => {
            const on = selected === n.id;
            return (
              <label key={n.id} className={`mc-row${on ? " is-on" : ""}`}>
                <input type="radio" name="pz-need" checked={on} onChange={() => { setSelected(n.id); setError(false); }} aria-label={n.box} className="peer sr-only" />
                <span aria-hidden className={`mc-tile is-${n.tone}`}>
                  <svg viewBox="0 0 24 24" className="mc-tile-icon">{PERSONAL_NEED_ICONS[n.id]}</svg>
                </span>
                <span className="mc-row-title min-w-0 flex-1">{n.box}</span>
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
        <p className="mc-note"><LockIcon className="pz-lock" />{C.note}</p>
        <p className="pz-foot">{C.footer}</p>
      </div>
    </div>
  );
}
