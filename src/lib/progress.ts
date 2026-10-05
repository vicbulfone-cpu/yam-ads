/**
 * Questionnaire progress bar (owner, 5 Oct 2026): never more than 5 milestones, however many pages there really are.
 * With 5 pages or fewer, one milestone per page. With more, the pages are shared out evenly across the 5 milestones,
 * and the last milestone (the finish) is only reached on the last page.
 * Returns how many milestones to draw and which one is current (both counted from 1).
 */
export const MAX_MILESTONES = 5;

export function progressMilestones(page: number, totalPages: number) {
  const shown = Math.min(totalPages, MAX_MILESTONES);
  if (totalPages <= MAX_MILESTONES) return { shown, current: page };
  const current = page >= totalPages ? shown : Math.max(1, Math.ceil((page * (shown - 1)) / (totalPages - 1)));
  return { shown, current };
}
