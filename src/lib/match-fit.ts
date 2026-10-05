/**
 * Laptop/desktop hero match box: the scale (0.6–1) that draws it just small enough to fit the visible browser area,
 * leaving 1mm clear below it. Returns null on phones and tablets (box keeps its normal size there).
 * Self-contained (no imports or outside names) because MatchFitScript also inlines it as page script.
 */
export function matchFit(box: HTMLElement): number | null {
  if (window.innerWidth < 1024) return null;
  const top = box.parentElement!.getBoundingClientRect().top + window.scrollY + parseFloat(getComputedStyle(box).marginTop);
  const room = document.documentElement.clientHeight - top - (1 * 96) / 25.4;
  return Math.max(0.6, Math.min(1, room / box.offsetHeight));
}
