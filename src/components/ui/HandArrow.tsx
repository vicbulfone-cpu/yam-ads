// The site's one arrow style (owner, 8 Oct 2026: "any arrows on the site the same style as the green arrow in the tradie
// picture on the home page"). Every decorative green arrow is drawn here from the tradie arrow (HomeMatchIntro.tsx):
// the same curve, the same open arrowhead, the same green and the same line thickness (".hand-arrow" in globals.css).
// Each arrow keeps its own start and tip: the tradie curve is stretched and turned to run from `from` to `to`.
import type { SVGProps } from "react";

type Pt = [number, number];

// the tradie arrow (viewBox 0 0 70 60): "M4 8c22-4 46 6 56 40" with the head "M50 42l10 8 4-12"
const T_START: Pt = [4, 8];
const T_C1: Pt = [26, 4];
const T_C2: Pt = [50, 14];
const T_END: Pt = [60, 48];
const T_TIP: Pt = [60, 50];
const T_ARMS: Pt[] = [[50, 42], [64, 38]];

const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const len = (a: Pt) => Math.hypot(a[0], a[1]);
const r = (n: number) => Math.round(n * 100) / 100;

/** A point given in the tradie arrow's own frame (along its start→end line, and across it), placed on a new line. */
function frame(start: Pt, end: Pt, flip: boolean) {
  const d = sub(T_END, T_START);
  const L = len(d);
  const u: Pt = [d[0] / L, d[1] / L];
  const v: Pt = [-u[1], u[0]];
  const nd = sub(end, start);
  const NL = len(nd);
  const nu: Pt = [nd[0] / NL, nd[1] / NL];
  const nv: Pt = flip ? [nu[1], -nu[0]] : [-nu[1], nu[0]];
  const k = NL / L;
  return (p: Pt): Pt => {
    const q = sub(p, T_START);
    const a = (q[0] * u[0] + q[1] * u[1]) * k;
    const b = (q[0] * v[0] + q[1] * v[1]) * k;
    return [start[0] + a * nu[0] + b * nv[0], start[1] + a * nu[1] + b * nv[1]];
  };
}

/** Path data for a tradie-style arrow from `from` to `to` (tip). `flip` bends it the other way. `headScale` sizes the head
 *  relative to the arrow's length (1 = the tradie proportions). */
export function handArrowPaths(from: Pt, to: Pt, flip = false, headScale = 1) {
  // the tradie line ends 2 units short of its tip; keep that proportion
  const total = len(sub(T_TIP, T_START));
  const lineEnd: Pt = [to[0] - (to[0] - from[0]) * (2 / total), to[1] - (to[1] - from[1]) * (2 / total)];
  const f = frame(from, lineEnd, flip);
  const [c1, c2, e] = [f(T_C1), f(T_C2), f(T_END)];
  const tip = to;
  const ft = frame(from, lineEnd, flip);
  const tTip = ft(T_TIP);
  const arms = T_ARMS.map((a) => {
    const p = ft(a);
    return [tip[0] + (p[0] - tTip[0]) * headScale, tip[1] + (p[1] - tTip[1]) * headScale] as Pt;
  });
  return {
    line: `M${r(from[0])} ${r(from[1])}C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(e[0])} ${r(e[1])}`,
    head: `M${r(arms[0][0])} ${r(arms[0][1])}L${r(tip[0])} ${r(tip[1])}L${r(arms[1][0])} ${r(arms[1][1])}`,
  };
}

/** A green hand-drawn arrow in the tradie style inside its own viewBox. */
export default function HandArrow({ viewBox, from, to, flip = false, headScale = 1, ...rest }: {
  viewBox: string; from: Pt; to: Pt; flip?: boolean; headScale?: number;
} & Omit<SVGProps<SVGSVGElement>, "from" | "to">) {
  const { line, head } = handArrowPaths(from, to, flip, headScale);
  return (
    <svg viewBox={viewBox} fill="none" aria-hidden {...rest} className={`hand-arrow ${rest.className ?? ""}`}>
      <path d={line} />
      <path d={head} />
    </svg>
  );
}
