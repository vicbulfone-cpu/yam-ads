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
export default function SelectionsSummary({ firstName, blocks, note, onNote }: {
  firstName: string; blocks: SummaryBlock[]; note: string; onNote: (v: string) => void;
}) {
  const text = firstName ? S.text.replace("{name}", firstName) : S.text.replace(", {name}", "");
  return (
    <div className="sel-sum">
      <h3 className="sel-sum-title">{S.title}</h3>
      <p className="sel-sum-text">{text}</p>
      <ul className="sel-sum-list">
        {blocks.map((b) => (
          <li key={b.key} className="sel-card">
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
      <label className="sel-note">
        <span className="sel-note-title">{S.note.title} <span className="sel-note-optional">{S.note.optional}</span></span>
        <span className="sel-note-hint">{S.note.hint}</span>
        <textarea value={note} onChange={(e) => onNote(e.target.value)} placeholder={S.note.placeholder} rows={2} className="sel-note-field" />
      </label>
    </div>
  );
}

/** The small line under "Confirm and continue" in the questionnaire's footer (summary page only). */
export function SummaryConfirmNote() {
  return <p className="sel-confirm-note">{S.confirmNote}</p>;
}
