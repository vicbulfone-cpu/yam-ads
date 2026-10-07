"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { BIZ_Q } from "@/content/business-questionnaire";
import { Check, Pin } from "../ui/Icons";

/**
 * Postcode or suburb box with suggestions as you type: "316" already offers Hughesdale 3166, "hughes" offers Hughesdale.
 * The visitor picks a suggestion (keyboard or tap). Data: public/data/au-postcodes.txt, built by scripts/build-postcodes.mjs
 * from GeoNames (CC BY 4.0). Accessible combobox pattern (arrow keys, Enter, Escape).
 */
export type Place = { postcode: string; suburb: string; state: string };

let cache: Promise<Place[]> | null = null;
function loadPlaces() {
  cache ??= fetch("/data/au-postcodes.txt")
    .then((r) => r.text())
    .then((t) => t.split("\n").filter(Boolean).map((l) => {
      const [postcode, suburb, state] = l.split("|");
      return { postcode, suburb, state };
    }))
    .catch(() => { cache = null; return []; });
  return cache;
}

const label = (p: Place) => `${p.suburb} ${p.state} ${p.postcode}`;
const MAX = 12;
const MAX_POSTCODES = 60; // a partial postcode can match many suburbs; the list scrolls

function search(places: Place[], q: string): Place[] {
  const s = q.trim().toLowerCase().replace(/\s+/g, " ");
  if (!s) return [];
  if (/^\d+$/.test(s)) return places.filter((p) => p.postcode.startsWith(s)).slice(0, MAX_POSTCODES);
  // "hughesdale 3166" or "hughesdale vic": match the words, best first (suburb starts with the text, then a word in it does)
  const digits = s.match(/\d{1,4}/)?.[0];
  const words = s.replace(/\d+/g, "").replace(/\b(vic|nsw|qld|wa|sa|tas|act|nt)\b/g, "").trim();
  const starts: Place[] = [];
  const contains: Place[] = [];
  for (const p of places) {
    if (digits && !p.postcode.startsWith(digits)) continue;
    const name = p.suburb.toLowerCase();
    if (!words || name.startsWith(words)) starts.push(p);
    else if (name.includes(` ${words}`)) contains.push(p);
    if (starts.length >= MAX) break;
  }
  return [...starts, ...contains].slice(0, MAX);
}

export default function PostcodeBox({ value, onChange, invalid }: { value: Place | null; onChange: (p: Place | null) => void; invalid?: boolean }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [text, setText] = useState(value ? label(value) : "");
  const [openList, setOpenList] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let live = true;
    void loadPlaces().then((p) => { if (live) setPlaces(p); });
    window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => { live = false; };
  }, []);

  const results = useMemo(() => (places && !value ? search(places, text) : []), [places, text, value]);
  const showList = openList && !value && text.trim().length > 0;

  const choose = (p: Place) => {
    onChange(p);
    setText(label(p));
    setOpenList(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList || !results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % results.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + results.length) % results.length); }
    else if (e.key === "Enter") { e.preventDefault(); choose(results[active]); }
    else if (e.key === "Escape") { setOpenList(false); }
  };

  return (
    <div className="relative">
      <label htmlFor={`${id}-input`} className="mb-1.5 block text-sm font-semibold text-navy-900">{BIZ_Q.location.label}</label>
      <div className="relative">
        <Pin aria-hidden width={20} height={20} strokeWidth={2.2} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700" />
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={showList && results[active] ? `${id}-opt-${active}` : undefined}
          aria-invalid={invalid || undefined}
          autoComplete="off"
          inputMode="search"
          value={text}
          placeholder={BIZ_Q.location.placeholder}
          onChange={(e) => {
            setText(e.target.value);
            setActive(0);
            setOpenList(true);
            if (value) onChange(null);
          }}
          onFocus={() => setOpenList(true)}
          onBlur={() => window.setTimeout(() => setOpenList(false), 150)}
          onKeyDown={onKey}
          className={`bq-input !pl-11 ${value ? "!border-green-500 !bg-green-50/60 font-semibold" : ""} ${invalid ? "is-invalid" : ""}`}
        />
        {value && <Check aria-hidden width={20} height={20} strokeWidth={3} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-600" />}
      </div>
      {showList && (
        <ul id={`${id}-list`} role="listbox" aria-label={BIZ_Q.location.label} className="bq-suggest">
          {places === null ? (
            <li className="px-4 py-3 text-sm text-muted">{BIZ_Q.location.loading}</li>
          ) : results.length ? (
            results.map((p, i) => (
              <li
                key={`${p.postcode}-${p.suburb}`}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => { e.preventDefault(); choose(p); }}
                onMouseEnter={() => setActive(i)}
                className={i === active ? "is-active" : ""}
              >
                <span className="font-semibold text-navy-900">{p.suburb}</span>
                <span className="text-muted">{p.state} {p.postcode}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-muted">{BIZ_Q.location.none}</li>
          )}
        </ul>
      )}
      {/* (the suburb list's CC BY 4.0 credit is in the footers' small print: DataCredit.tsx, owner 7 Oct 2026) */}
    </div>
  );
}
