import { SELECTIONS_SUMMARY as S } from "@/content/selections-summary";
import { Check, Pencil } from "../ui/Icons";

/** One choice the customer made: its service, its name, and what they ticked under it (in one or more lists). */
export type SummaryBlock = {
  key: string;
  service: string;
  title: string;
  /** "Change" on the card's top: go back and change the choice itself */
  onChange?: () => void;
  sections: { heading: string; items: string[]; onEdit?: () => void }[];
};

/**
 * The summary page of every questionnaire ("Your selections, at a glance"; owner, 10 Oct 2026, from the owner's "Untitled"
 * picture): a navy card for each choice ("SERVICE SELECTED", the service, the choice in large type, "Change"), its ticked
 * options underneath ("Edit"), then an optional note. The questionnaire's footer shows "Confirm and continue" and the line
 * under it (SummaryConfirmNote). Wording: src/content/selections-summary.ts. Styles: ".sel-sum" in ads.css.
 */
export default function SelectionsSummary({ firstName, blocks, note, onNote, showNote = true, pageOf, current }: {
  firstName: string; blocks: SummaryBlock[]; note: string; onNote: (v: string) => void;
  /** the optional note (only on the last screen when the summary is shown one choice at a time) */
  showNote?: boolean;
  /** "2 of 3" under the title when the summary is shown one choice at a time */
  pageOf?: { n: number; total: number };
  /** one choice at a time: the one showing. Every card is still laid out, in the same place, with the others hidden, so
      every screen is the same height and the popup draws them all at the same size (owner, 10 Oct 2026: "all same size text") */
  current?: number;
}) {
  const paged = current !== undefined;
  const text = firstName ? S.text.replace("{name}", firstName) : S.text.replace(", {name}", "");
  return (
    <div className="sel-sum">
      <h3 className="sel-sum-title">{S.title}</h3>
      <p className="sel-sum-text">{text}{pageOf && pageOf.total > 1 && <span className="sel-sum-count">{S.pageOf.replace("{n}", String(pageOf.n)).replace("{total}", String(pageOf.total))}</span>}</p>
      <ul className={`sel-sum-list${paged ? " is-paged" : ""}`}>
        {blocks.map((b, bi) => (
          <li key={b.key} className={`sel-card${paged && bi !== current ? " is-off" : ""}`} aria-hidden={paged && bi !== current ? true : undefined} inert={paged && bi !== current ? true : undefined}>
            <div className="sel-card-head">
              <div className="min-w-0">
                <p className="sel-card-eyebrow">{S.serviceSelected}</p>
                <p className="sel-card-service">{b.service}</p>
                <p className="sel-card-title">{b.title}</p>
              </div>
              {b.onChange && (
                <button type="button" onClick={b.onChange} className="sel-card-change">
                  <Pencil width={20} height={20} strokeWidth={2} />{S.change}<span className="sr-only"> {b.title}</span>
                </button>
              )}
            </div>
            {b.sections.filter((s) => s.items.length).map((s) => (
              <div key={s.heading} className="sel-card-body">
                <div className="sel-card-row">
                  <p className="sel-card-heading">{s.heading}</p>
                  {s.onEdit && (
                    <button type="button" onClick={s.onEdit} className="sel-card-edit">
                      <Pencil width={18} height={18} strokeWidth={2} />{S.edit}<span className="sr-only"> {s.heading}</span>
                    </button>
                  )}
                </div>
                <ul className="sel-card-items">
                  {s.items.map((i) => (
                    <li key={i}><Check aria-hidden width={20} height={20} strokeWidth={3} className="shrink-0 text-green-600" /><span className="min-w-0 break-words">{i}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </li>
        ))}
      </ul>
      {/* one choice at a time: the note keeps its space on every screen (hidden until the last), so the screens match */}
      {(showNote || paged) && <label className={`sel-note${showNote ? "" : " is-off"}`} aria-hidden={showNote ? undefined : true} inert={showNote ? undefined : true}>
        <span className="sel-note-title">{S.note.title} <span className="sel-note-optional">{S.note.optional}</span></span>
        <span className="sel-note-hint">{S.note.hint}</span>
        <textarea value={note} onChange={(e) => onNote(e.target.value)} placeholder={S.note.placeholder} rows={2} className="sel-note-field" />
      </label>}
    </div>
  );
}

/**
 * The summary one choice at a time (owner, 10 Oct 2026: "a separate selection screen for each service and sub-service
 * confirmation"): screen number "page" shows that choice's card; the optional note is on the last screen. The questionnaire moves
 * between the screens with "Confirm and continue" and Back.
 */
export function SummaryPage({ blocks, page, ...rest }: { firstName: string; blocks: SummaryBlock[]; note: string; onNote: (v: string) => void; page: number }) {
  const i = Math.max(0, Math.min(page, blocks.length - 1));
  return <SelectionsSummary {...rest} blocks={blocks} current={i} showNote={i === blocks.length - 1} pageOf={{ n: i + 1, total: blocks.length }} />;
}

/** The small line under "Confirm and continue" in the questionnaire's footer (summary page only). */
export function SummaryConfirmNote() {
  return <p className="sel-confirm-note">{S.confirmNote}</p>;
}
