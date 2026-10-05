# Questionnaire design (the purpose of the whole website)

**The one job of this website is to get a visitor to finish the questionnaire and be matched with an accountant.**
Every page leads to it, and every questionnaire page should make the visitor want to carry on to the end.

## Rules for every questionnaire page (popup now, full pages later)
1. **Same look as the site.** Navy `#073265` and green `#00ae41`, Fraunces headings, Plus Jakarta Sans body, rounded cards, soft shadows, the same dotted/glow panel as the call-to-action band.
2. **Always show progress.** Navy header with numbered milestones. Completed steps show a green tick, the current step is lit, the last milestone is the finish (a sparkle). The line fills as the visitor goes, with "Step n of N · %".
3. **Make the next step obvious.** One big green Next button. Once something is chosen it gives a soft, slow glow (switched off for reduced-motion users).
4. **Make choosing feel good.** Big tappable option cards (at least 48px), clear tick circle, selected cards turn green with a gentle lift. Each category shows its own coloured icon, the same one as on the match box.
5. **Keep it short on screen.** Each step must fit the popup without scrolling on a normal laptop screen (1280x800) and tablet. Long steps may scroll on small phones.
6. **Words stay as the old questionnaire.** Questions, options and step order are unchanged. Only existing wording is reused for the progress area (e.g. "Your Match in Progress", "Step n of N"). Any new wording needs the owner's approval first.
7. **No distractions.** No pop-ups on top of the questionnaire, no timers, no exclamation marks, no taglines (marketing taglines are never shown in the questionnaire flow).
8. **Easy to go back.** Back is always available and never loses answers on the same step.

## Where it lives
`src/components/layout/QuestionnaireModal.tsx` (steps, progress, option cards), `src/app/globals.css` (popup size, Next glow), wording in `src/content/questionnaire.ts`.
Summary and contact pages are still placeholders until the questionnaire stage (Stage 4) and must follow the same rules.
