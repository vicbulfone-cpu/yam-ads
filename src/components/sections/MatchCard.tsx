import { loadContent, mergeViews, type Node } from "@/lib/content";
import { MATCH_CARD_NOTE } from "@/content/home-copy";
import MatchCardView, { type MatchCardData } from "./MatchCardView";

export { MATCH_CARD_HIGHLIGHT, type MatchCardData } from "./MatchCardView";
export default MatchCardView;

type N = Exclude<Node, { t: "sec" }>;

/**
 * Finds the old "Your perfect match starts here" card (four category buttons + a start button) inside a page's
 * nodes. Returns its words and the remaining nodes with the card removed.
 */
export function extractMatchCard(nodes: Node[]): { card: MatchCardData | null; rest: Node[] } {
  const idxs = nodes.map((n, i) => (n.t === "button" && ((n.parts?.length ?? 0) >= 2 || (n.lines?.length ?? 0) >= 2) && n.g != null ? i : -1)).filter((i) => i >= 0);
  if (idxs.length < 2) return { card: null, rest: nodes };
  const first = idxs[0], last = idxs[idxs.length - 1];
  let start = first;
  while (start > 0 && ["h", "text", "img"].includes(nodes[start - 1].t)) {
    start--;
    if (nodes[start].t === "h") break;
  }

  // include a leading short "Start" label if present
  if (start > 0 && nodes[start - 1].t === "text" && (nodes[start - 1] as { text: string }).text.length < 12) start--;
  let end = last;
  const after = (k: number) => nodes[k + 1];
  while (after(end) && (after(end).t === "img" || after(end).t === "button")) end++;
  if (after(end) && after(end).t === "p") end++;

  const slice = nodes.slice(start, end + 1);
  const h = slice.find((n) => n.t === "h") as Extract<N, { t: "h" }> | undefined;
  const cats = slice.filter((n): n is Extract<N, { t: "button" }> => n.t === "button" && n.g != null);
  const startBtn = slice.find((n) => n.t === "button" && n.g == null) as Extract<N, { t: "button" }> | undefined;
  const note = slice.find((n) => n.t === "p") as Extract<N, { t: "p" }> | undefined;
  const card: MatchCardData = {
    title: h?.text,
    categories: cats.map((b) => splitParts(b)),
    startLabel: startBtn?.text ?? "",
    note: note?.text,
  };
  return { card, rest: [...nodes.slice(0, start), ...nodes.slice(end + 1)] };
}

export function getHomeMatchCard(): MatchCardData {
  const { card } = extractMatchCard(mergeViews(loadContent("/")));
  if (!card) throw new Error("The homepage service-selection card could not be extracted.");
  return { ...card, note: MATCH_CARD_NOTE };
}

function splitParts(b: { text: string; parts?: string[] }) {
  const parts = [...new Set(b.parts ?? [])];
  if (parts.length < 2) return { title: b.text, desc: "" };
  const desc = parts.reduce((a, p) => (p.length > a.length ? p : a), "");
  const titleParts = parts.filter((p) => p !== desc && !parts.some((q) => q !== p && q.includes(p) && q !== desc));
  return { title: titleParts.join(" "), desc };
}
