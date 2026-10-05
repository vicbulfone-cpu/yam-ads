"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { QUESTIONNAIRE_URL } from "@/config/site.config";
import { MATCH_CARD_COPY as COPY } from "@/content/match-card-copy";
import { matchFit } from "@/lib/match-fit";
import { ArrowRight, Check } from "../ui/Icons";

type Category = { title: string; desc: string };

type IconProps = { className?: string };

/* Solid white service icons on a flat colour tile (owner's match box design, 4 Oct 2026).
   --tile-ink is the tile's colour, used for the details cut into each icon. */
function PersonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <circle cx="12" cy="7.6" r="4.1" />
      <path d="M3.8 21c0-4.6 3.6-7.4 8.2-7.4s8.2 2.8 8.2 7.4c0 .4-.3.6-.6.6H4.4c-.3 0-.6-.2-.6-.6Z" />
    </svg>
  );
}
function BusinessIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M8.8 7.2V5.4A1.6 1.6 0 0 1 10.4 3.8h3.2a1.6 1.6 0 0 1 1.6 1.6v1.8" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <rect x="2.6" y="6.8" width="18.8" height="13.6" rx="2.4" fill="currentColor" />
      <path d="M2.6 12.4h18.8" stroke="var(--tile-ink)" strokeWidth="1.3" />
      <rect x="10.1" y="10.9" width="3.8" height="3.1" rx=".8" fill="currentColor" stroke="var(--tile-ink)" strokeWidth="1.2" />
    </svg>
  );
}
function SmsfIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <circle cx="11.6" cy="4.1" r="2.3" />
      <path d="M3.6 13.4a8 6.6 0 0 1 13.4-4.9l2.7-1.3-.5 3.4c.5.8.8 1.8.8 2.8 0 2-1 3.8-2.7 5V21h-3v-1.5a9.4 9.4 0 0 1-4.6 0V21h-3v-2.9a6.6 6.6 0 0 1-3.1-4.7Z" />
      <circle cx="16" cy="12" r="1" fill="var(--tile-ink)" />
    </svg>
  );
}
function DocumentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M6.4 2.4h7.4l5 5V20a1.6 1.6 0 0 1-1.6 1.6H6.4A1.6 1.6 0 0 1 4.8 20V4a1.6 1.6 0 0 1 1.6-1.6Z" fill="currentColor" />
      <path d="M8.4 11.2h7.2M8.4 14.4h7.2M8.4 17.6h7.2" stroke="var(--tile-ink)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* One colour per service: blue (personal tax), green (business), orange (SMSF), purple (registrations) */
export const tiles = [
  { Icon: PersonIcon, tile: "bg-[#1565f5]", ink: "#1565f5" },
  { Icon: BusinessIcon, tile: "bg-[#1fa035]", ink: "#1fa035" },
  { Icon: SmsfIcon, tile: "bg-[#f97316]", ink: "#f97316" },
  { Icon: DocumentIcon, tile: "bg-[#7c3aed]", ink: "#7c3aed" },
];

/* Match box (owner's picture, 5 Oct 2026): outline icons in a soft tinted square, one colour per service */
const outline = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const boxIcons = [
  { tone: "is-blue", icon: <><circle cx="12" cy="8" r="3.6" {...outline} /><path d="M5 20.2c0-3.7 3.1-6.2 7-6.2s7 2.5 7 6.2Z" {...outline} /></> },
  { tone: "is-green", icon: <><rect x="3.2" y="7.2" width="17.6" height="12.6" rx="2.2" {...outline} /><path d="M9 7.2V5.6c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6v1.6M3.2 12.6h17.6" {...outline} /><rect x="10.4" y="11.2" width="3.2" height="2.8" rx=".6" {...outline} /></> },
  { tone: "is-orange", icon: <><path d="M5.2 11.8a6.8 5.6 0 0 1 11.3-4.2l2.4-1.1-.4 2.9c.6.7 1 1.6 1.1 2.5h1.2v2.8h-1.6a6.3 6.3 0 0 1-2.4 2.6V20h-2.6v-1.4a8 8 0 0 1-3.4 0V20H8.2v-2.5a5.7 5.7 0 0 1-3-4.2" {...outline} /><path d="M3.4 11.2c.6.8 1.2 1 1.8 1" {...outline} /><circle cx="15.2" cy="10.6" r=".6" fill="currentColor" /><path d="M10 7.4h3" {...outline} /></> },
  { tone: "is-purple", icon: <><path d="M6.4 2.8h7.2l4.8 4.8v12a1.6 1.6 0 0 1-1.6 1.6H6.4a1.6 1.6 0 0 1-1.6-1.6V4.4a1.6 1.6 0 0 1 1.6-1.6Z" {...outline} /><path d="M13.6 2.8v4.8h4.8M8.4 12h7.2M8.4 15h7.2M8.4 18h4.6" {...outline} /></> },
];

function questionnaireHref(selected: string[]) {
  const [pathAndQuery, hash = ""] = QUESTIONNAIRE_URL.split("#", 2);
  const queryStart = pathAndQuery.indexOf("?");
  const path = queryStart === -1 ? pathAndQuery : pathAndQuery.slice(0, queryStart);
  const query = new URLSearchParams(queryStart === -1 ? "" : pathAndQuery.slice(queryStart + 1));
  query.delete("category");
  selected.forEach((category) => query.append("category", category));
  const serialized = query.toString();
  return `${path}${serialized ? `?${serialized}` : ""}${hash ? `#${hash}` : ""}`;
}

export default function MatchCardServices({
  categories,
  startLabel,
  initialSelected = [],
}: {
  categories: Category[];
  startLabel: string;
  initialSelected?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [error, setError] = useState(false);
  const rowsRef = useRef<HTMLFieldSetElement>(null);

  // Hero match box on laptops/desktops: draw it just small enough to fit the visible browser area (layout unchanged)
  useEffect(() => {
    const box = rowsRef.current?.closest<HTMLElement>(":is(.desk-hero-card, .mc-hero-card, .bz-card-col) .mc");
    if (!box) return;
    // first size is set before the page is drawn (MatchFitScript); this keeps it right as the window changes
    const fit = () => {
      const f = matchFit(box);
      if (f == null) box.style.removeProperty("--mc-fit");
      else box.style.setProperty("--mc-fit", String(f));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  function toggleCategory(category: string) {
    setError(false);
    setSelected((current) => current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category]);
  }

  return (
    <>
      <fieldset ref={rowsRef} className="mc-rows">
        <legend className="sr-only">Select accounting services</legend>
        {categories.map((category, index) => {
          const { tone, icon } = boxIcons[index % boxIcons.length];
          const isSelected = selected.includes(category.title);
          // the box may call a service by a different name; the questionnaire still receives the original one
          const shown = COPY.rows[category.title] ?? category;
          return (
            <label key={category.title} className={`mc-row${isSelected ? " is-on" : ""}`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleCategory(category.title)}
                aria-label={shown.title}
                className="peer sr-only"
              />
              <span aria-hidden="true" className={`mc-tile ${tone}`}>
                <svg viewBox="0 0 24 24" className="mc-tile-icon">{icon}</svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="mc-row-title">{shown.title}</span>
                <span className="mc-row-desc">{shown.desc}</span>
              </span>
              <span aria-hidden="true" className="mc-radio peer-focus-visible:ring-2 peer-focus-visible:ring-green-600 peer-focus-visible:ring-offset-2">
                <Check width={20} height={20} strokeWidth={3.2} />
              </span>
            </label>
          );
        })}
      </fieldset>
      <Link
        href={questionnaireHref(selected)}
        // Start always leads to questionnaire page 1; with nothing ticked it shows the old card's message instead
        data-match-start=""
        onClick={(e) => { if (!selected.length) { e.preventDefault(); setError(true); } }}
        className="btn btn-primary mc-start">
        <span>{startLabel}</span>
        <ArrowRight className="mc-start-arrow" strokeWidth={2.6} />
      </Link>
      {error && <p role="alert" className="mt-2 text-center text-xs font-semibold text-red-600">Please select at least one option to continue.</p>}
      <p className="mc-note">
        {COPY.note.map((n, i) => (
          <span key={n}>{i > 0 && <span aria-hidden className="mc-dot">&bull;</span>}{n}</span>
        ))}
      </p>
    </>
  );
}
