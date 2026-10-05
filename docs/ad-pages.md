# How to build an ad landing page and its questionnaire

The recipe for every Google Ads landing page on this site. **Ad 1 (business, `/ad-1`) is the finished reference**: copy its
structure, behaviour and look exactly, changing only the words, categories, pictures and anything the owner's design
picture for the new ad shows differently. **Ad 6 (`/ad-6`) is the match page** every ad questionnaire finishes on.

The owner's design pictures are in `hero section/ad landing pages/` (e.g. `business.png`). Read the new one first.

## Files used by Ad 1 (copy these for a new ad)

| What | File |
|---|---|
| All wording: landing page, match box, questionnaire steps, errors, match page | `src/content/business-questionnaire.ts` |
| Landing page layout | `src/components/ads/BusinessAdPage.tsx` |
| Match box on the landing page | `src/components/ads/BizMatchCard.tsx` |
| Questionnaire popup (all steps, progress, submit) | `src/components/ads/BusinessQuestionnaire.tsx` |
| Postcode/suburb box with suggestions | `src/components/ads/PostcodeBox.tsx` (shared, reuse as is) |
| Ad header and footer | `src/components/ads/AdChrome.tsx` (shared, reuse as is) |
| Service and benefit icons | `src/components/ads/BizIcons.tsx` |
| Match page | `src/components/ads/BizMatchPage.tsx` (shared by every ad) |
| Styles (`.bz-` page, `.bq-` questionnaire) | `src/app/ads.css` |
| Lead endpoint | `src/app/api/lead/route.ts` (shared; send a different `adType`) |
| Routing and page titles | `src/app/[[...slug]]/page.tsx` (`/ad-1` and `/ad-6` branches) |
| Progress milestones | `src/lib/progress.ts` (shared) |
| Postcode list | `public/data/au-postcodes.txt`, built by `scripts/build-postcodes.mjs` (GeoNames, CC BY 4.0; keep the credit under the box) |

Best approach for Ad N: create `src/content/<type>-questionnaire.ts` with the same shape as the business file, and make the
page, match box and questionnaire components take that content (or copy them with a new prefix). Keep shared pieces shared.
Route it in `src/app/[[...slug]]/page.tsx` like `/ad-1`. Ad pages stay **noindex** (`seo/index-status.json`).

## Landing page (laptop/desktop)

- Slim ad header (logo + shield + "Free matching. No obligation."); the site header and phone CTA bar are hidden on ad
  pages (`.bz-page` in `ads.css`). Footer: trust strip, copyright, information links in two rows of three.
- Headline on the left (three lines, middle line green), the line under it, then the three steps with arrows.
- The desk photograph (`homeDeskHeroPicture`) sits at the **same height as on the home page**: its top just under the
  header. The handwritten line (two lines, Caveat) sits just above the arrow baked into the photo.
- The three benefit circles and the small print sit in the **white strip under the photo** (where the home page has its
  trust banner), so nothing overlaps the photo.
- Phones: headline → match box → steps → benefits → small print → photo with the handwritten line.

## Match box (must look like and be the same size as the home page box)

- Built from the home box's own classes (`.mc`, `.mc-head`, `.mc-rows`, `.mc-row`, `.mc-tile`, `.mc-row-title`,
  `.mc-row-desc`, `.mc-radio`, `.mc-start`, `.mc-note`, `.mc-foot`), so text sizes are identical. Open rows with thin
  dividers, soft-coloured icon squares (blue, green, orange, purple), round tick circles, mint band at the bottom.
- **Short names on the box** (`box: { title, desc }` per category) so each fits one line at the home box's text size;
  the questionnaire keeps the full names. Keep titles to about 25 characters and descriptions to about 38.
- Wrapper `.bz-card-col` gives the home box's width, position, nudge and fit-to-screen scaling (`MatchFitScript` +
  the `matchFit` effect in the card). Only differences: a longer heading line is drawn a little smaller
  (`.bz-card .mc-title`) with the saved space added below the heading, and rows get the same +1cm as the home box.
- After building, measure both boxes at 768, 1024, 1366x768, 1536x864 and 1920x1080: same width, height, position and
  font sizes, nothing overflowing.

## Questionnaire (same flow and look as Ad 1)

Order: one page per ticked category → **name** → summary (with Change links) → in person / remotely / not sure yet →
postcode or suburb (suggestions as you type: "316" lists every suburb 3160–3169) → 3-second "Searching…" pause →
"Great news" box asking for email → mobile (with the sharing note) → "email my match details?" → match page.

Rules (also in `docs/questionnaire-design.md` and `CLAUDE.md`):
- Every category page offers "Other — tell us what you need" (text box) and "Not sure — help me choose"; software
  options reveal Xero · MYOB · QuickBooks · Other · Help me choose.
- **Name straight after the services; every later question uses the first name** ({name} in the wording, capitalised).
- **Progress: never more than 5 milestones**, pages shared out evenly, the last milestone only on the last page.
- **One typeface** (Plus Jakarta Sans) in every questionnaire box and match box.
- A faded accountant-related picture in each step's box (`STEP_PICTURES`; pictures must be in the image credits).
- Same popup, Leave/Stay box, spam trap (hidden `website` field) and rate limit as Ad 1.
- On submit: POST `/api/lead` with `adType`, tracking (utm_*, gclid, ref), `emailMatchDetails` and `matchPageUrl`; save
  the customer's own answers in sessionStorage (`BIZ_MATCH_KEY`); prefetch the match page while they answer; **keep the
  popup open on "Preparing your match…" until the match page replaces it** (no flash of the landing page).
- GoHighLevel sends the match email when `emailMatchDetails` is true (set up in Stage 5).

## Before finishing

Type-check (`npx tsc --noEmit`), lint, walk the whole questionnaire in a browser at 1280 and 375 wide through to the
match page, run `npm run build` and `npm run seo-check` (with `npx next start -p 3300`), update `docs/plan.md`, then
commit and push.
