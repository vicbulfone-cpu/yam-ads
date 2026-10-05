import { MATCH_CARD_COPY as COPY } from "@/content/match-card-copy";
import MatchCardServices from "./MatchCardServices";

export type MatchCardData = { title?: string; categories: { title: string; desc: string }[]; startLabel: string; note?: string; highlight?: string };
export const MATCH_CARD_HIGHLIGHT = "Skip directories. Get matched with a local accountant who understands you.";

// Presentational card only (no file-system access), so it can render on the server and inside the questionnaire popup.
// Design: owner's match box picture, 4 Oct 2026. Sizes follow the box's own width (container units), so the box looks
// the same whether it is narrow (phones, laptop hero) or wide (desktop hero, popup). Styles: ".mc" in globals.css.

/** Server-rendered heading, benefit strip and prompt; the service selector is the only interactive part. */
export default function MatchCardView({ data, titleTag = "h2", initialSelected }: { data: MatchCardData; titleTag?: "h2" | "p"; initialSelected?: string | null }) {
  const Title = titleTag;
  return (
    <div data-match-card="" className="mc">
      {/* navy panel: small capitals, heading with a green underline, supporting line, map of Australia */}
      <div className="mc-head">
        <p className="mc-eyebrow">{COPY.eyebrow}</p>
        <Title className="mc-title">
          <span className="block">{COPY.title[0]}</span> <span className="block">{COPY.title[1]}</span>
        </Title>
        <span aria-hidden className="mc-rule" />
        <p className="mc-sub">{COPY.sub}</p>
        <span aria-hidden className="mc-map" />
      </div>

      <div className="mc-in">
        <p className="mc-q">{COPY.question}</p>
        <p className="mc-hint">{COPY.hint}</p>
        <MatchCardServices categories={data.categories} startLabel={data.startLabel} initialSelected={initialSelected} />
      </div>

      <p className="mc-foot">
        <svg aria-hidden viewBox="0 0 24 24" className="mc-shield">
          <path d="M12 2.4 4.4 5.3v5.8c0 4.7 3.1 8.7 7.6 10.1 4.5-1.4 7.6-5.4 7.6-10.1V5.3L12 2.4Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
          <path d="m8.6 11.9 2.4 2.4 4.4-4.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{COPY.footer}</span>
      </p>
    </div>
  );
}
