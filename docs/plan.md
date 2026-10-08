# YAM v4 — build plan

Project: Your Accountant Match (youraccountantmatch.com.au), rebuilt as Next.js 16 / TypeScript / Tailwind.
Repository: https://github.com/vicbulfone-cpu/yam-v4.git
Rules live in `CLAUDE.md`. The user commands each stage; only that stage is done, then work stops for review.

## Stage status

| # | Stage | Status |
|---|---|---|
| 1 | Setup and inventory | Complete (reviewed) |
| 2 | Design sample | **Complete — awaiting review** |
| 3 | All pages | Not started |
| 4 | Questionnaire | Not started |
| 5 | Matching connection | Not started |
| 6 | Hidden accountants page | Not started |
| 7 | Finish and go live | Not started |
| later | Google Ads landing pages and ads questionnaire (4 ad types, subdomains) | After main build |

## What the old site is

- `/source` is a **React + Vite single-page app** (not static HTML files). Page content lives in code files; titles, meta tags and structured data are added in the browser.
- Because of that, `scripts/extract-source.mjs` renders every page in a real browser (from a working copy in `.work/`, so `/source` is never touched), opens every collapsed accordion, and saves each page as JSON in `data/extracted/pages/`. `scripts/build-inventory.mjs` turns that into `docs/page-inventory.md` and `data/extracted/page-types.json`.
- Re-run with `npm run extract` then `npm run inventory` (needs the working copy built; see "Re-running the extraction").

## Page types and counts (190 recorded: 175 in the old sitemap + 15 extra routes)

| Type | Count | Rebuilt? |
|---|---:|---|
| Homepage `/` | 1 | Yes |
| City pages `/locations/<city>` | 13 | Yes |
| Locations hub `/locations` | 1 | Yes |
| Industry-by-city pages `/industry/<industry>/<city>` (8 industries x 13 cities) | 104 | Yes |
| Service pages `/accountant/<slug>` | 18 | Yes |
| Guides `/guide/<slug>` | 14 | Yes |
| Guides hub `/guides` | 1 | Yes |
| Blog articles `/blog/<slug>` | 16 | Yes |
| Blog hub `/blog` | 1 | Yes |
| About, Contact, How it works, How we select accountants | 4 | Yes (How we select uses the approved new wording) |
| Privacy, Terms | 2 | Yes |
| Questionnaire (old `/ghl-redirect`, noindex, not in sitemap) | 1 | Rebuilt (Stage 4) |
| Retired location URLs (redirect to a live city) | 12 | Redirects kept |
| Admin login / dashboard | 2 | **No** (not rebuilt) |
| **New pages** (specified in CLAUDE.md): `/match/[leadId]`, `/llms.txt` (the hidden accountants demo page was dropped by the owner, 7 Oct 2026) | — | Stages 5–7 |

Cities (13): Sydney, Newcastle - Maitland, Melbourne, Geelong, Brisbane, Gold Coast, Sunshine Coast, Perth, Adelaide, Hobart, Launceston, Canberra - Queanbeyan, Darwin. **No suburb pages** exist or will be built. The city, state/region and picture-file mapping is in `docs/page-inventory.md` and in `scripts/build-inventory.mjs`.

## How URLs will be kept exactly

- Every sitemap URL keeps its exact path (no trailing slash, no `.html`), the same as the old site.
- The 12 retired location URLs (Rockhampton, Coffs Harbour, Wagga Wagga, Shepparton-Mooroopna, Port Macquarie, Warragul-Drouin, Traralgon-Morwell, Dubbo, Wollongong, Ballarat, Bendigo, Shellharbour area) and their matching `/industry/<industry>/<retired-city>` URLs keep their existing permanent redirects (taken from the old `vercel.json`). Next.js sends these as permanent redirects (status 308, which Google treats the same as 301).

### URLs that cannot (or should not) be kept exactly — need your decision

| Old URL | Issue | Proposed handling |
|---|---|---|
| `/ghl-redirect` | The old questionnaire page; its address is a leftover from the old GoHighLevel test setup. | New questionnaire at `/questionnaire` (noindex); permanent redirect from `/ghl-redirect`. It was never in the sitemap. |
| `/admin-login`, `/admin-dashboard` | Old browser-only admin; not rebuilt. | Return "not found" (or redirect to home). |
| `/locations/melbourne` | Removed at the owner's request (6 Oct 2026); it was this site's only city page. | Permanent redirect (308) to the home page (`next.config.ts`); out of the sitemap; footer "Locations" column and the coverage-section link removed (Melbourne stays listed, unlinked). |
| `/privacy` | In the old site this page has **no meta tags of its own**: its title is the home page title, its canonical points to `/`, and it has no robots tag. | I recommend giving it its own title and a canonical to itself. This is a fix, so needs your OK. |

## Approved exceptions to "no word changes"

1. `/how-we-select-accountants`: the user-pasted wording replaces the old intro, check text and closing section. Old title, meta description and the "Find My Accountant" CTA are kept.
2. Testimonials removed. **Finding:** the old site has testimonial components (`Testimonials.tsx`, `RealMatch.tsx`, ad-page testimonials) but none is used on any page, and none of the 190 rendered pages contains testimonial text. Nothing needs deleting from the live pages.
3. Wording specified in `CLAUDE.md` for the hidden accountants page and the match screen.
4. No consent tick-box; no language switcher (both dropped by the user).

Any new wording a design element needs will be reused from the old site where possible and listed here.

## Brand findings (from /source)

- Navy `#073265` (191 uses, headings and buttons) and green `#00ae41` (505 uses, the main brand green; the old CSS maps every "emerald" colour to it).
- Supporting: dark navy `#1a2b4a`, darker green `#009937`, pale greens `#e6fcf0` `#ccf9df` `#f6faf8` `#eaf7f0`, page background `#f8fafb`, slate greys for text.
- Fonts: Fraunces (serif headings), Plus Jakarta Sans (body), Caveat (script accent), loaded from Google Fonts.
- The final logo in `/assets` is navy and green (leaf icon, script "Your", "Accountant" in navy, "Match" in green). Exact colours are sampled from it in Stage 2.

## Old questionnaire and matching files (in `/source/src`)

**Questionnaire (to be rebuilt, wording kept):**
- `lib/questionnaireData.ts` — the current questions (`MATCH_CATEGORIES`: categories, options, "Something Else" boxes, software options)
- `pages/GHLRedirectPage.tsx` — the step-by-step flow at `/ghl-redirect` (a test page that simulates the GoHighLevel form)
- `components/home/MatchSelectionCard.tsx` — the "Your perfect match starts here" category picker on the home page (chooses 1–4 categories, then opens the questionnaire)
- Preserve multi-select in Stage 4: customers can choose up to four service categories before opening the questionnaire; the website lead flow must carry all selected services through to submission.
- `components/questionnaire/CategorySubStep.tsx`, `SummaryStep.tsx`, `ContactStep.tsx`, `AddMoreServices.tsx`, `CheckIcon.tsx`
- `lib/crmConfig.ts` — the single questionnaire address setting (points to `/ghl-redirect`)

**Old matching / results (to be removed):**
- `components/questionnaire/MatchResultStep.tsx` (results screen) and `MatchingOverlay.tsx` ("finding your match" animation)
- In `lib/questionnaireData.ts`: `MOCK_TERRITORY`, `FALLBACK_ACCOUNTANT`, `matchAccountantByPostcode`
- `lib/postcodeMatching.ts`, `lib/api.ts`, `lib/AppContext.tsx` (browser matching, leads, accountants, admin state)
- `lib/types.ts`: a **legacy 28-question set** (`DETAILED_QUESTIONS`) used only by the old browser matching, not by the current questionnaire; also sample accountants, lead fee and admin constants
- `server/lead-push-middleware.js`, `server/test-middleware.js` (old billing/lead-push server; not part of the new site)
- `pages/AdminLoginPage.tsx`, `AdminDashboardPage.tsx`

The old results page has no URL of its own (it is a step inside `/ghl-redirect`), so no extra redirect is needed.

## Assets check (`C:\YAM v4\assets`)

- Logo: **present** — `this is final logo.png` (2125 x 551).
- Hero picture: **present** — `hero pic.png` (1916 x 821); a cropped version `ffb62a59-….png` (1536 x 1024) is also there.
- City pictures: **all 13 present** (1916 x 821 each, about 2.5–3 MB each, to be compressed to small WebP). Two file names differ from the page names: `newcastle midland.png` (for Newcastle - Maitland) and `Canberra – Queanbeyan.png` (with an en dash). They are mapped by name in the build scripts.
- Also present: `comparison table.png` and `words table.txt` (the comparison table design and copy).

## Tooling decisions

- `/source`, `/assets`, `/clone-of-this-one` and `/yam-scaffold` are **kept on disk but excluded from git** (`.gitignore`), so the repository stays small. Optimised copies of the pictures go into `public/images` in later stages.
- Extracted page data (`data/extracted/`) **is** committed, so the words can be compared against in later stages.

## Re-running the extraction

```
cd .work/source-build && npm install --legacy-peer-deps && npx vite build   # builds a working copy of /source
cd ../..  && npm run extract && npm run inventory
```

## The 7 stages

1. **Setup and inventory** — this stage.
2. **Design sample** — responsive design document, design system (colours, type, spacing, buttons, header/nav/footer, CTA bands), signature components (hero, feature cards with hover-lift and picture reveal, split checklists, article boxes, rolling banner, how-we-select timeline), images and credits, the homepage plus one example of each page type from the extracted content, automatic word comparison against `/source`, checks at 375 / 768 / 1280px.
3. **All pages** — apply the design to every remaining page, city pictures, keep exact URLs/titles/meta/canonical/robots, sitemap and robots.txt, `docs/seo-check.md`, `npm run build`.
4. **Questionnaire** — rebuild the questionnaire, remove old matching, one questionnaire address setting, hero postcode box, utm/gclid/ref carry-through, temporary `/api/lead`.
5. **Matching connection** — `/api/lead` to GoHighLevel, `/api/match-result` webhook, Upstash Redis (24 hours), `/match/[leadId]`, mock mode, `docs/ghl-fields.md`.
6. **Hidden accountants page** — DROPPED (owner, 7 Oct 2026: no demo page; never built, all references removed).
7. **Finish and go live** — logo/hero final, structured data and `llms.txt`, `docs/ghl-setup.md`, final checks and Lighthouse, Vercel go-live walkthrough.

Later (after the main build): Google Ads landing pages and ads questionnaire on subdomains.

## Stage 1 — what was done

- Next.js 16.3.8 + React 19 + TypeScript + Tailwind 4 project set up in `C:\YAM v4` (builds cleanly); git started and linked to the GitHub repository.
- `CLAUDE.md` written with all agreed rules and overrides.
- Extraction and inventory scripts written and run on all 190 pages (188 extracted; the 2 admin pages are not rebuilt and did not render).
- `docs/page-inventory.md`, this plan, `.env.example` created.
- Findings recorded above (page types, colours, old questionnaire/matching files, assets, URL issues).

## Stage 2 — what was done

- **Design system** (`src/app/globals.css`, `src/config/site.config.ts`): navy/green tokens, fonts (Fraunces, Plus Jakarta Sans), spacing and shadow tokens, buttons, cards, glass panels, scroll-reveal motion. Logo, hero picture, navigation and city pictures are all swapped in **one file**: `src/config/site.config.ts`.
- **Layout:** sticky header with a city picture menu and mobile menu sheet, footer built from each page's own old footer words, mobile bottom call-to-action bar, call-to-action band.
- **Signature components** (`src/components/sections`): hero with the match card, feature cards (hover-lift, picture revealed on hover on desktop, shown by default on phones/tablets), link tiles with pictures, numbered step cards, two-column checklists with custom tick icons, FAQ accordion, article cards, key-date cards, "the difference" panel, audience tiles, rolling picture banner, how-we-select timeline.
- **Content engine** (`src/lib/content.ts`, `SectionRenderer.tsx`): every page's words come from `data/structured` (the old pages re-extracted with their structure: headings, paragraphs, links, cards, FAQ answers, for both phone and desktop). Nothing is typed by hand.
- **Pages built (15):** home, locations hub, one city (Sydney), one industry page, one service page, guides hub, one guide, blog hub, one article, About, Contact, How it works, How we select accountants, Privacy, Terms. The questionnaire page is Stage 4.
- **Pictures:** 13 city panoramas and the hero compressed from ~2.7 MB to ~40–200 KB each; 32 stock photographs (Pexels) sourced and credited (`docs/image-credits.md`).
- **Checks:** all 15 pages load at 375 / 768 / 1280px with no sideways scrolling; `npm run build` passes; word check against the old pages in `docs/word-check-stage2.md`.

### Wording rules applied in Stage 2 (for your review)

1. **Phone wording wins** where the old site's phone and desktop versions differed (Google indexes the phone version first). Every difference is listed in `docs/mobile-desktop-differences.md` (12 strings each way; most are the "Why the right match matters" block and the home page's founder paragraph).
2. **Existing wording reused in new design elements** (no new words were written):
   - Header navigation labels: Locations, Guides, Blog, How It Works, How We Select Accountants, About (from the old footers).
   - Header/bottom-bar buttons: "Find My Accountant" (old buttons) and "Get Matched Now" (the old floating button).
   - Closing call-to-action band on pages that did not have one: "Ready to find your accountant?" / "Your needs. Your area. Your accountant." / "Free matching service · No obligation" (from the old blog articles).
   - The "Vetted accountants" trust point links to /how-we-select-accountants.
3. **Accessibility labels (not page copy):** "Skip to main content" (hidden until keyboard focus) and "Menu" (the menu button's label). Breadcrumb and Footer navigation labels are invisible labels for screen readers.
4. **Words that live only inside the old pictures** (steps graphic, "The difference", "Who we help") are shown as real text, taken from the pictures' descriptions in the old site.
5. **Not built yet / left out in Stage 2:** the site-wide search (old "STILL EXPLORING? Search for something else" button) — Stage 3; the postcode box — Stage 4.
6. Testimonials: none exist on the old pages (see Stage 1), so none are shown.

## SEO pass (Stage 3 work, done 2 Oct)

- **Pages:** all 175 live pages are built (the 13 city pages are the only city pages; the 104 industry pages are those 13 cities × 8 industries). The 12 retired location pages 301/308 straight to the city the old site sent them to (`REDIRECTS` in `src/lib/pages.ts`, applied in `next.config.ts`). Admin pages and the old `ghl-redirect` page are not built.
- **Canonical / tags:** canonicals are now self-referencing on the real domain (the old export said `http://localhost:4173`). Open Graph and Twitter tags added; branded share image `public/images/brand/og-default.png` (`scripts/make-og-image.mjs`).
- **Structured data:** each page emits its own old JSON-LD (FAQ, Service, Breadcrumbs, Article…) plus Organization and WebSite. Dropped: the old search box (SearchAction) and `ProfessionalService` (a LocalBusiness type, not allowed by CLAUDE.md). Allowed exception under SEO-CHECKLIST (structured data).
- **New files:** `src/app/sitemap.ts`, `src/app/robots.ts` (AI crawlers listed), `src/app/llms.txt/route.ts`, `src/lib/seo.ts`, `scripts/seo-audit.mjs`. Security, cache and noindex headers (`/match`, `/api`, demo page, *.vercel.app) in `next.config.ts`.
- **Audit:** `node scripts/seo-audit.mjs <url> --write` → `docs/seo-report.md` (last run: PASS, 175 pages, 0 problems). Wording issues are listed there as report-only.
- **Still to do:** Search Console / Bing verification, GA4/Ads IDs, Rich Results Test, Lighthouse, sameAs links (Vic), and the Stage 7 word-for-word `docs/seo-check.md`. IndexNow is configured through GitHub Actions after a successful Vercel Production deployment; the live event still needs owner-side verification.

## City pages and SEO extras (2 Oct, later)

- **City hero pictures:** `assets/hero 1…10.png` → `public/images/hero/city-N-1672|960.webp` (`scripts/make-city-heroes.mjs`, same crop as the home hero). The 13 city pages use the home-page layout (picture left, match card right, picture tucked behind the card); each city keeps one fixed picture (`CITY_HERO_INDEX` in `site.config.ts`; three pictures are used twice, by far-apart cities). Picture alt text names the person/scene and the city. The city skyline is used twice: a faded wash behind the hero, and as the backdrop of the closing call-to-action band.
- **SEO extras:** Search Console / Bing verification tags and GA4 / Google Ads scripts (all from env vars, loaded after the page is usable, nothing output while empty); `manifest.webmanifest`; IndexNow (`scripts/indexnow.mjs`, public key file in `/public`); `.env.example` updated.
- **Checks:** `scripts/seo-audit.mjs` PASS (175 pages, 0 problems); Lighthouse on this PC: SEO 100, Accessibility 100, Best Practices 96; performance scores are unreliable on this computer (its benchmark swung between 146 and 1063), so re-run with PageSpeed Insights on the Vercel preview.

## Updated SEO checklist (section 17) — run 3 Oct

- **City pages:** the skyline no longer sits behind the header. It is now a full-width framed panel (`CityShowcase`, glass city-name label, soft navy fade) after the first content section on each of the 13 city pages; the closing call-to-action band is plain again.
- **Heading outline:** audit now compares every page's headings with the old page. Found and fixed: the closing "Ready to find your accountant?" band added an extra H2 on 110 pages that had none in the old site (now styled text, not a heading). Result: 0 extra headings. Also fixed a visible bug: five city headlines showed a literal "&amp;".
- **Added:** extra AI crawlers in robots.txt (Amazonbot, Applebot, DuckAssistBot, Meta-ExternalAgent, MistralAI-User, CCBot); rich-preview robots values on any page without its own robots tag (none currently); `vercel.json` region syd1; `src/proxy.ts` (upper-case URL → lowercase, 308, query kept); audit checks for duplicate ids, one title/description, clean links, Googlebot/Bingbot access, query-string-preserving redirects.
- **Not applicable / later:** no paginated listing pages exist (blog hub has no page links); questionnaire spam protection is Stage 4; DNS, Vercel dashboard settings and uptime monitor are in `docs/go-live.md`.

## Wording rewrite, phase 1 (2 Oct) — approved by owner

- New titles and meta descriptions for all 175 pages (`src/content/seo-copy.json`, log in `docs/seo-copy-log.md`); new H1s for the 13 city and 104 industry pages ("Find a Vetted Accountant in Sydney" / "Matched to one of our partner accountants"). Home H1 unchanged by request.
- Site-wide phrase rules (`src/content/wording.ts`): every "one match / one vetted accountant" becomes "matched to one of our partner accountants"; the old credentials text (CPA Australia / NTAA / peak bodies) is replaced by the approved sentence on all pages; FAQ structured data is rewritten the same way so it matches the visible text. `/how-we-select-accountants` updated (step 2 and the closing paragraph).
- Audit passes: 175 pages, 0 problems, 0 extra headings, no old phrases left, every page serves its rewritten title.
- Phase 2 (not done): unique local / industry body content for the 104 industry pages (only ~3% unique today) and for the five thinnest city pages (Hobart, Sunshine Coast, Launceston, Geelong, Gold Coast).

## Owner update: homepage conversion and AI search (3 Oct 2026)

- The owner's full direction is recorded in `CLAUDE.md` as a standing instruction for every session. The visual treatment applies to the homepage only; search-readiness changes cover the public site.
- **Homepage:** warm ivory/green background, softly rounded picture frame and shadow, the hero text and image remain in their requested raised position, and the matching card now carries the owner's added "Skip directories" message. Existing page copy and headings were not rewritten.
- **Quick answers:** new, short, server-rendered answer blocks appear on all existing service pages and the 13 city pages. No suburb pages were created. The homepage and service pages already contain eight visible FAQ entries each; those were retained, not duplicated.
- **Crawler access:** robots.txt names all requested AI crawlers, allows public content, disallows API/noindex/hidden areas, and links the sitemap. `/llms.txt` now gives a concise and factual service summary and only links public indexable pages.
- **Metadata and schema:** canonical URLs remain self-referencing; any extracted hreflang pairs are carried into Next.js metadata (none are present in the current 190 extracted records). Organization and WebSite schema are emitted site-wide; matching Service providers, breadcrumbs and FAQ markup now use accurate business identity and visible content. No accountant identities or contact details are published.
- **Noindex confirmation:** per the owner's choice, preserve the extracted `index, follow` tags on all 13 city pages; the existing source directives were not changed.
- **IndexNow:** `.github/workflows/indexnow.yml` submits the 175 indexable URLs only when GitHub receives a successful Vercel `Production` deployment status. The verification key is public and already in `/public`; no secret is required. Verify the live Vercel → GitHub deployment-status event after merging.
- **Validation:** `npm run build` succeeded (184 generated pages); `npm run lint` had no errors (one pre-existing unused-import warning); `scripts/seo-audit.mjs` passed across 175 sitemap URLs with zero page or site-level failures. The audit reports zero extra headings; its 237 old-heading omissions are report-only and predate this additive update.
- **Owner follow-up:** enable GitHub Actions and confirm Vercel deployment statuses reach the repository. Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools. The questionnaire itself remains Stage 4; it has not been implemented as part of this SEO task.

## Shared match card update (3 Oct 2026)

- The homepage match card now appears on all 175 public sitemap pages, including the custom accountant-selection page. Its service choices and wording are taken from the extracted homepage content; the warm blue/green styling is shared.
- Pages that did not previously have a match-card heading render the new prompt as styled paragraph text, preserving their existing heading outline.
- The shared service choices are now accessible multi-select checkboxes and append every selected category as a repeated `category` parameter on the questionnaire link. Stage 4 still needs to read those parameters, preserve the source's 1–4 selection flow, and carry every selected service through lead submission; the questionnaire itself is not yet built.

## Questionnaire popup (owner request, 3 Oct 2026)

- **Approved exception to "no popups":** the owner asked for the questionnaire to open as a popup. Every link to the questionnaire address (`NEXT_PUBLIC_QUESTIONNAIRE_URL`, default `/questionnaire`) opens `src/components/layout/QuestionnaireModal.tsx`: a native `<dialog>` at 3/4 of the screen on desktop (75vw � 75vh), 92% wide on tablets, almost full screen on phones, with the page behind blurred.
- **Two entry routes.** (1) The match card's "Start My Match" button, with services ticked, goes straight to questionnaire page 1 (the first chosen service). (2) Every other CTA (header, sticky bar, CTA bands, page buttons) first shows the match card inside the popup; after choosing services, page 1 appears. A match box's Start button never opens the service-choice popup: with nothing ticked it shows the old card's message "Please select at least one option to continue." on the card itself (on the page or in the popup).
- **Questionnaire pages built so far:** one page per chosen service, in the old order, with the old progress header ("Your Match in Progress", "We ask a couple more questions than most.", "Step N of M"), options, "Something Else" detail box, the software sub-question and the old error messages. The wording is copied from `/source` by `scripts/extract-questionnaire.mjs` into `src/content/questionnaire.ts`, which also checks every on-screen sentence still exists in the old files.
- **Still to do (Stage 4):** the Summary and Contact pages. Until then, pressing Next on the last service page shows a temporary "Content coming soon" panel (same placeholder wording as the hidden demo page) with a Back button. No answers are sent anywhere yet.
- **SEO:** the popup's contents are only created after a click, so no page's HTML, headings or word count changes. The CTA links remain ordinary links. `/questionnaire` itself is a noindex page (also blocked in robots.txt and absent from the sitemap) showing the match card; with `?category=` it opens the popup at page 1.
- **Closing:** the � button or Esc closes the popup and clears the answers. Clicking the blurred background closes it only on the service-choice step, so answers are never lost by a stray click. Back on page 1 closes the popup when it was opened from a page's match box (the ticks stay on the card); when it was opened from another CTA, Back returns to the match box in the popup with the ticks kept.

## Site questionnaire = the four ad questionnaires combined (owner, 6 Oct 2026)

Replaces the old site questionnaire (and the "Questionnaire popup" pages described above). Applies to every site page with
the match box (home, How it works, How we select, About, Contact, Privacy, Terms) and every questionnaire link.
The ad landing pages and their four questionnaires are unchanged.

- **Match box:** tick one or more of the four services. Start links to `/questionnaire?service=…` (one per service).
- **Popup** (`src/components/layout/SiteQuestionnaire.tsx`): for each ticked service, in the box's order, that ad's
  sub-section page (the ad match box's question and choices) and then that ad's own pages:
  Personal (Ad 2): main reason → follow-up page → "Does your return include any of these?" (returns only);
  Business (Ad 1): one page per ticked category; SMSF (Ad 3): category pages → quick questions;
  Registrations (Ad 4): category pages → new or existing business?
  Then once: name → summary (Change links per page and per service) → in person/remote → postcode → search → email →
  mobile → email my match? → match page (/match). Back on page 1 returns to the box with the ticks kept.
- **Wording:** all from the ad wording files (`src/content/site-questionnaire.ts` gathers it); the progress badge
  "Your Match in Progress" is the old site questionnaire's. Match page: one service → that ad's wording; several → the
  general (business) wording.
- **Lead:** `questionnaire: "site"`, no `adType`, so it stays **Organic** (postcode owner); `answers` grouped per service.
- **Removed:** `QuestionnaireModal.tsx`, `src/content/questionnaire.ts` and `scripts/extract-questionnaire.mjs` (the old
  per-category questionnaire). Old `?category=` links still open the new questionnaire for that service.
- **Fix (6 Oct):** the popup now closes when the match page opens (it lives in the site layout and was left on top of
  the match page, stuck on "Preparing your match…").

## "Searching for your match" screen before the match page (owner, 6 Oct 2026)

All five questionnaires (site popup and Ads 1–4): after "Show my match", a personal screen shows for 5 seconds:
"{first name}, we are now searching for a local accountant who is well matched for the services you requested."
(owner's wording; `src/content/match-search.ts`), with the radar icon and a 5-second progress bar. The lead is sent
meanwhile; the match page opens once both are done. If sending fails, the screen closes and the usual error shows.
Component `MatchSearching` in `src/components/ads/QuestionnaireParts.tsx`; styles `.bq-matching*` in `src/app/ads.css`.

## New hero, header and logo for the home and city pages (owner's design, 4 Oct 2026)

Built from the owner's picture "how it should look" and the artwork in `hero section/` (git-ignored; web copies are made by `node scripts/make-hero-assets.mjs`).

- **Logo:** `hero section/new logo.jpg` replaces the old logo everywhere (header, questionnaire popup, share image, structured data). Files: `public/images/brand/logo-v5-*.webp`; set in `src/config/site.config.ts`. The browser tab icon is unchanged (the new logo has no square mark).
- **Header (site-wide):** white bar, new logo, plain text links in the middle, green button with an arrow. The pill links are gone.
- **Hero (home + 13 city pages):** `src/components/sections/DeskHero.tsx`. Full-width desk photograph, headline with one green phrase, supporting line, three icon points, the match box on the right running over a white strip of three reassurance lines. The hero carousel and the photo mosaic under the match box are no longer used.
- **Wording (from the design, in `src/content/hero-copy.ts`):** home H1 is now "Looking for an accountant near you?" (the old closing words "We'll find your match." are replaced by the supporting line "Let us do the heavy lifting and find your perfect match."); three points ("Local accountants in your area", "Matched to your exact needs", "Free and no obligation"); three reassurance lines ("Your details are never sold or sent to a list.", "One local accountant per area.", "Matched to your needs and location."). City pages keep their own H1 and supporting line from `seo-copy.json`.
- **Kept:** each page's own introduction paragraphs and its three trust points (with the "Vetted accountants" link) now sit straight under the hero. City pages keep a small breadcrumb above the headline.
- **Match box:** the existing box is used for now; the new match box design in the picture is to be added later (owner).

## Leave confirmation and returning-visitor memory in the questionnaire (owner, 4 Oct 2026)

- **Leave box:** closing the questionnaire popup part-way (close button, Esc key, or Back on the first question page) shows "Are you sure you want to leave?" / "Your match is less than 60 seconds away" with Stay and Leave. Wording: `src/content/leave-prompt.ts`. The match-box-only popup (nothing started) closes without asking. Closing the browser tab part-way shows the browser's own standard warning (browsers do not allow a custom box there).
- **Remembering the visitor:** `src/lib/visitor.ts` keeps a record in the visitor's own browser (random visitor id, first/last visit, times opened, times they chose Leave and where, and their ticked answers; never name, phone or email). When they come back through any "Find My Accountant" button the popup carries on where they stopped with their answers still ticked.
- **Reporting:** events `questionnaire_start`, `questionnaire_abandon`, `questionnaire_return` (and `questionnaire_complete`, for Stage 4/5 to call) go to Google Analytics when its ID is set. `getVisitorRecord()` is ready for the lead form to attach to each lead (Stage 4/5), so GHL can see a lead came from a returning visitor.
- **To do with Stage 4/5:** attach the record to the lead; mention this storage in the privacy policy (owner wording needed).

## Match box redesign (owner's picture, 4 Oct 2026)

- New look everywhere the match box appears (home and city hero, other page heroes, how-we-select, the popup): bold heading "Your perfect accountant match starts here" with a green underlined "match", an Australia map marked "Australia Wide", a green "Skip directories…" strip with a shield, "What do you need help with?" / "Select one option to get started.", four service rows (colour tile, name, description, circle on the right), a large "Start My Match" button, and a lock line "It only takes 60 seconds. Free and no obligation."
- Wording lives in `src/content/match-card-copy.ts`. The third service is shown as "SMSF and Wealth Advisory" on the box; the questionnaire still receives and shows the original name "SMSF and Financial Planning".
- The four service rows are 140% of their previous height (95px in a narrow box, 78px in a wide box).
- The box still lets a visitor tick more than one service (as before), although the hint says "Select one option".
- The earlier small print under the button ("Tell us what you need help with. We'll connect you with one of our national partner firms… The matched firm provides its own accounting, tax or financial services directly.") is no longer on the box; the same statement remains in the page text of the home page.
- Map artwork is cut from the owner's design by `scripts/make-hero-assets.mjs` (`public/images/ui/australia-map.webp`).

## Home page rebuilt to the owner's "home page 1" and "home page 2" pictures (4 Oct 2026)
- The home page now shows only the sections in the owner's two pictures, in their order: hero (unchanged), What is Your Accountant Match?, How it works, Why it matters, Matching accountants to every kind of client, mid-page call to action, The right expertise, Tax & Accounting Insights, FAQ, Coverage, tagline, closing call to action, home footer. The old extracted home sections are no longer shown on the home page. Code: `ContentPage.tsx` (home branch) and one component per section in `src/components/sections/`.
- Owner exceptions to the pictures: the FAQ keeps the site's 8 questions and answers word for word (read from `data/extracted/pages/_home.json`, the same source as the FAQPage structured data); "The right expertise" lists every service page, each linked (18), instead of the 10 pictured labels; the client cards are not links; Coverage and the home footer show only the 13 city pages plus "Regional Australia" as plain text (no other towns).
- Wording on the new sections is the owner's, copied from the pictures (typo "savee" written as "saves"). The home footer uses the picture's wording; the old disclaimer paragraph is not shown on the home footer (other pages keep their footer unchanged).
- Photos: the owner's own photos from `hero section/` converted by `scripts/make-home-assets.mjs` into `public/images/home/`; a few gaps are filled with existing stock/Australian photos.
- Home section headings use the heavy sans of the hero (`.home-v2` rule in globals.css); the hero itself is untouched.
- The rolling photo strip is removed site-wide (component deleted).
- Article pages (`/articles/...`) fixed for Next 16 (they showed "Article not found"), use the same photos as the home cards, and their button opens the questionnaire.
- SEO check: the home page reports new headings not on the old site — expected and owner-approved by this redesign (the old "no heading changes" rule is superseded for the home page). All site-level checks pass.

## Ad 1 — business ad landing page and business questionnaire; the match page (5 Oct 2026; at /match since 6 Oct 2026)

Owner's request and design picture (`hero section/ad landing pages/business.png`). Both pages stay noindex (ad traffic only).

- **/ad-1** (`src/components/ads/BusinessAdPage.tsx`): slim ad header (logo, "Free matching. No obligation."), headline, steps, three benefit circles, handwritten line over the desk photograph (`hero-no-writing.png`), business match box, trust strip and information links. The site header and phone CTA bar are hidden on ad pages. Phones: headline → match box → steps/benefits → photo.
- **Business questionnaire** (`BusinessQuestionnaire.tsx`, wording in `src/content/business-questionnaire.ts`): same popup, progress header and option cards as the site questionnaire. Flow (name moved up and later questions personalised with the first name, owner 5 Oct): one page per ticked category (each = one progress step; every category has "Other — tell us what you need" (text box) and "Not sure — help me choose"; the two software options reveal Xero · MYOB · QuickBooks · Other · Help me choose) → name → summary with Change links → in person / remotely / not sure yet → postcode or suburb with suggestions as you type → 3-second search → "Great news" box asking for email → mobile (with the owner's sharing note) → "email my match details?" → /match. A faded accountant-related picture sits in every step's box.
- **Postcode suggestions** (`PostcodeBox.tsx`): `public/data/au-postcodes.txt` (18,291 places) built by `scripts/build-postcodes.mjs` from GeoNames AU postal codes (CC BY 4.0, credited under the box). Typing "316" lists every suburb in 3160–3169, including Hughesdale 3166.
- **/api/lead** (`src/app/api/lead/route.ts`): validates name/email/Australian mobile/postcode, hidden spam field, per-visitor rate limit (`LEAD_RATE_LIMIT_PER_MINUTE`), adds leadId, lead source (Paid when from an ad or with gclid), utm/gclid/ref, work mode, `emailMatchDetails` (the customer's yes/no) and `matchPageUrl`, then posts to `GHL_INBOUND_WEBHOOK_URL`. With no webhook or `MOCK_GHL=true` it only logs (mock). **Emailing the match details is done by GHL** using `emailMatchDetails`.
- **/match** (`BizMatchPage.tsx`): the customer's match page — accountant photo, name, firm, blurb, call/email/website, specialties; the customer's own services, work mode and area (kept in their browser tab only); "What happens next". Shows the clearly labelled sample accountant (`src/content/sample-match.ts`) until GHL is connected in Stage 5. noindex, nofollow + X-Robots-Tag.
- New wording on these pages is the owner's (request and design picture); questionnaire helper wording (step labels, errors, summary/match page text) is new and listed in `src/content/business-questionnaire.ts` for the owner to edit.
- **Match box size (owner, 5 Oct 2026):** on laptops/desktops (1200px+) every page's match box (home, city, ad pages) is 1.5cm wider with its contents about 4.5% larger (about 1cm taller); the popup match box is 1.5cm wider from 1024px. Short screens still shrink the box to fit the visible area. Controlled by `--mc-extra-w` in `globals.css`.
- **Business match box = home match box (owner, 5 Oct 2026):** on laptops/desktops (1024px+) the /ad-1 box is locked to the home box's width, position and proportions (`--home-mc-ratio` in `src/app/ads.css`), so both show at the same size on every screen. If the home match box design changes, re-measure and update those ratios.

## Ad 2 — personal tax ad landing page and personal questionnaire (5 Oct 2026)

Owner's request and design picture (`hero section/ad landing pages/personal.png`). Built the Ad 1 way (`docs/ad-pages.md`); noindex.

- **/ad-2** (`src/components/ads/PersonalAdPage.tsx`, styles `.pz-` in `src/app/ads.css`): the desk photograph sits exactly as on the home page and Ad 1 (top just under the header; owner, 5 Oct 2026), benefits and small print in the white strip under it; two-line headline with "personal tax accountant" in green, line under it, steps with arrows, three green outline benefit icons (Local accountants · One accountant per area · Free matching), handwritten "The smarter way / to get your tax sorted." by the photo's arrow, two-line small print bottom left. Footer: trust strip (padlock, people, handshake) then one line with the copyright and the six information links (`AdFooter variant="personal"`).
- **Personal match box** (`PersonalMatchCard.tsx`): home page match box style and size (owner, 5 Oct 2026, now the rule for every ad page): navy panel "Your personal tax / match starts here." with the map and "One local accountant, never a list.", "What do you need help with?", four one-choice rows with short lines (This Year’s Tax Return · Overdue Tax Returns · Amend a Lodged Return · Tax Planning & Advice), a small "Not sure — help me choose" link, "Start My Tax Match", "60 seconds • Free • No obligation" and the mint band.
- **Personal questionnaire** (`PersonalQuestionnaire.tsx`, wording in `src/content/personal-questionnaire.ts`): ["Not sure — help me choose" page: the four reasons explained, plus "I'm still not sure"] → the reason's follow-up page (This year's return: Which financial year? + Is this your first tax return? · Overdue: Which financial years need lodging? (several, Earlier years, Not sure) · Amend: Which financial year? + optional "What needs correcting?" · Planning: What would you like advice about? (Investment property, Capital gains, Income and deductions, Other with text box, Not sure)) → "Does your return include any of these?" (return preparation only; 8 options, "Not sure" can't be combined) → name → summary with Change links and the optional "Anything else your accountant should know?" → in person / remotely / not sure yet → postcode or suburb → 3-second search → "Great news" email box → mobile with the sharing note → "email my match details?" → /match. Each page = one progress step (max 5 milestones). Financial years are worked out from today's date (newest completed year first).
- **Name position:** the owner's message listed the name after the mobile; the standing name rule (name straight after the service questions, later questions personalised) was followed, as on Ad 1.
- **/match** now shows personal wording ("Meet your local tax accountant", "understand your situation better") and, until GHL is connected, a personal-tax sample accountant when the customer came from /ad-2. `/api/lead` receives `adType: "personal"` with the answers and a readable services list.
- Shared questionnaire pieces (progress header, option/choice cards, text boxes, checks, tracking) now live in `src/components/ads/QuestionnaireParts.tsx`, used by both questionnaires.

## Ad 3 — SMSF & wealth ad landing page and SMSF questionnaire (5 Oct 2026)

Owner's request and design picture (`hero section/ad landing pages/smsf.png`). Built the Ad 1 way (`docs/ad-pages.md`); noindex.

- **/ad-3** (`src/components/ads/SmsfAdPage.tsx`, styles `.sz-` in `src/app/ads.css`): desk photograph exactly as on the home page, Ad 1 and Ad 2; headline "Looking for / SMSF or wealth advice?" ("SMSF or wealth" in green), line under it, the three steps with pale green icon circles and arrows (as the design), benefits (Local support · One accountant per area · Free matching) and the two lines of small print in the white strip under the photo, handwritten "The smarter way to plan / your next chapter." by the photo's arrow. Footer: trust strip (padlock, people, map pin) then one line with the copyright and links (`AdFooter variant="smsf"`).
- **SMSF match box** (`SmsfMatchCard.tsx`, which reuses `BizMatchCard.tsx` with SMSF wording; the business box now takes its wording as props): home page box style and size. "Your SMSF & wealth / match starts here.", "What do you need help with? Select all that apply.", four rows (SMSF Setup & Accounting · SMSF Audit & Borrowing · Super & Retirement Planning · Wealth & Investment Advice) with calculator, house, bar chart and sprout icons, "Start My Match", "60 seconds • Free • No obligation", mint band. Measured against the Ad 1 box at 768, 1024, 1366x768, 1536x864 and 1920x1080: same position, width, height and text size.
- **Wording differences from the design picture (box rule):** the design's line "Your enquiry goes to one local accountant, never a list." is shortened on the box to "One local accountant, never a list." (as Ad 2) because the longer line wraps at 1024 wide and makes the box a different size. Short row descriptions were added (the home box style needs a line under each row name). The design's three trust items under the box are in the footer strip, and "Matching is free. Professional fees are agreed separately. Financial advice requires an appropriately licensed adviser." is the second line of the small print.
- **SMSF questionnaire** (`SmsfQuestionnaire.tsx`, wording in `src/content/smsf-questionnaire.ts`): one page per ticked category with the owner's follow-up options plus "Not sure — help me choose" (can't be combined with other ticks) and "Other — tell us what you need" (text box) → "Just a couple of quick questions": Do you currently have an SMSF? (Yes / No / Considering one), When do you need help? (As soon as possible / Within a month / Just exploring), optional "Anything else you'd like your accountant to know?" → name ("Your name please") → summary with Change links (categories plus "About you") → in person / remotely / not sure yet → postcode or suburb with suggestions ("316" lists every suburb 3160–3169) → 3-second search → "Great news" email box → mobile with the sharing note → "email my match details?" → /match. Each page = one progress step, max 5 milestones.
- **/match** shows SMSF wording ("Meet your local SMSF accountant", "understand your fund and goals better", disclaimer mentioning licensed financial advice) and, until GHL is connected, an SMSF sample accountant when the customer came from /ad-3. `/api/lead` receives `adType: "smsf"` with the answers (`haveSmsf`, `notes`; `timing` removed with the "When do you need help?" question, owner 8 Oct 2026; `haveSmsf` is "no" automatically when "Establishing an SMSF" is ticked) and a readable services list.
- Tested: full journey at 1280 and 375 wide to the match page with no browser errors; `npm run build` passes; `npm run seo-check` problems=0.

## Ad 4 — registration ad landing page and registration questionnaire (6 Oct 2026)

Owner's request and design picture (`hero section/ad landing pages/registration.png`). Built the Ad 1 way (`docs/ad-pages.md`) with Ad 1's hero layout; noindex.

- **/ad-4** (`src/components/ads/RegistrationAdPage.tsx`, styles `.rz-` in `src/app/ads.css`): desk photograph as on the home page; headline on two lines as the design, "Starting a **business** or / need **registrations?**" (green words); line under it; the three steps with arrows; benefits (Local support · One accountant per area · Free matching; people, person and shield icons); handwritten "The smarter way / to get started." by the photo's arrow; small print "We provide the matching service. Your accountant provides the accounting services. Matching is free. Accountant and government fees may apply." Footer trust strip with padlock, map pin and people (`AdFooter variant="registration"`).
- **Match box** (`RegistrationMatchCard.tsx`, reuses `BizMatchCard.tsx`): home page box style, Ad 1 size. "Your registration / match starts here.", "What do you need help with? Select all that apply.", four rows (Company Registration · ABN & Tax Registrations · Business Name Registration · Business Structure & Setup) with document, gear, tag and bar chart icons, "Start My Match". Measured against the Ad 3 box at 1024, 1366x768, 1536x864 and 1920x1080: identical position and size.
- **Wording differences from the design picture (box rule):** "Your enquiry goes to one local accountant, never a list." is "One local accountant, never a list." on the box, and the mint band says "Your details go to one local accountant only."; the design's longer lines wrap at 1024 wide and change the box size. "Matching is free. Accountant and government fees may apply." is in the page's small print. Short row descriptions added (home box style).
- **Registration questionnaire** (`RegistrationQuestionnaire.tsx`, wording in `src/content/registration-questionnaire.ts`): one page per ticked category with the owner's sub-selections plus "Other — tell us what you need" (text box) → "Is this a new or existing business?" (New / Existing) with optional "Anything else your accountant should know?" → "Your name please" → summary with Change links → in person / remotely / not sure yet → postcode or suburb with suggestions ("316" lists Hughesdale 3166 and every suburb 3160–3169) → 3-second search → "Great news, {name} — we've found a local accountant who's a perfect match." asking for email → "Thank you {name}, now your mobile number please so your accountant can reach you." with the sharing note → "email my match details?" → /match. Max 5 progress milestones; faded accountant-related picture in each step.
- **/match** shows registration wording ("Meet your local accountant", "understand your business and registrations better", fees disclaimer mentioning government fees) and, until GHL is connected, a registration sample accountant. `/api/lead` receives `adType: "registration"` with the answers (`businessStage`, `notes`), `emailMatchDetails` and tracking.
- Tested: full journey at 1280 and 375 wide to the match page with no browser errors.

## Questionnaires on phones: full screen (5 Oct 2026)
Owner: on phones, no popup box; the questionnaire fills the screen, the screen is fixed (no scrolling) until the match page,
with the small "x" and the "Are you sure you want to leave?" box. Done for all four questionnaires (see
`docs/questionnaire-design.md`, "Phones"). Tested at 375x667, 360x740 and 390x844: every step fits except the business
bookkeeping page with the software choice open on a 375x667 phone (29px). Tablets/desktops unchanged.

## Ad 1: bigger match box (5 Oct 2026)
Owner asked for the business ad page's match box to be as big as in their picture, on the business page only. Done for
1200px and wider: ~40% of the screen width, same text sizes, full design wording on the rows from 1500px. Phones and
tablets unchanged. Recorded as an exception in `docs/ad-pages.md`.

## Ad pages: four landing pages, match page at /match (6 Oct 2026)
Owner: the footer's "Ad 1–4" links now carry each landing page's own name (its page title, from `AD_LANDING_PAGES` in
`src/lib/pages.ts`); the blank Ad 5 page and the Ad 6 address are removed as if they never existed (no redirects; both
return "page not found"). The match page every questionnaire finishes on now lives at `/match` (`src/app/match/page.tsx`):
noindex/nofollow, X-Robots-Tag header, blocked in robots.txt, not in the sitemap or llms.txt. `seo/index-status.json`
lists only pages the site builds; `npm run seo-status` now reads the page list from `src/lib/pages.ts` (it used to re-add
~160 removed pages) and always keeps the ad pages noindex.

## Match box popup from CTAs, tablets and desktops (owner, 7 Oct 2026)

- **Home page and the four ad pages (/ad-1 to /ad-4), 768px and wider:** every call-to-action button that is not the
  match box itself opens a popup showing that page's match box, with a "Start here" message (`src/content/start-here.ts`,
  `src/components/ui/StartHere.tsx`). Laptops/desktops: message on the left, box on the right; tablets: message above.
- **Fits with no scrolling:** `src/components/ui/FitBox.tsx` draws the box just small enough to fit the popup (checked
  at 768×1024, 1024×768, 1280×720, 1440×900, 1920×1080).
- **Home:** the existing site popup (`SiteQuestionnaire.tsx`, box step) gains the message (home page only) and the fit
  (every site page's box popup). **Ad pages:** `src/components/ads/AdBoxPopup.tsx` catches the `#match-box` CTA links
  and the information popup's "Start My Match"; Start opens the ad's own questionnaire (paid lead), so the four ad
  questionnaires are unchanged.
- **Phones (below 768px) unchanged:** home CTAs open the full-screen box as before; ad CTAs still scroll up to the box.
- New wording (owner-requested): "Start here" / "Your match is about 60 seconds away" / "Choose what you need below to
  begin. It won't take long, and we're excited to match you with a local partner accountant." ("60 seconds" is the match
  box's own note.)

## About popup content (owner, 7 Oct 2026)

- The "About" popup opened from the ad pages' footers (and the /match page footer) shows ONLY the owner's new "About Us"
  wording (`src/content/about-popup.ts`, laid out by `src/components/ads/AboutPopup.tsx`, styles ".abp" in ads.css):
  "Finding the Right Accountant Shouldn't Be a Game of Chance", "Backed by 19+ Years of Industry Expertise" (navy band
  with the 19+ figure) and "Why Choose Us?" (four cards). All screen sizes. Replaces the earlier combined version
  (About + How it works + How we select). The /about page itself keeps its own words.
- Owner's wording used as supplied, except "specializes" spelt "specialises" (Australian spelling).
- (later, 7 Oct 2026) The /about page itself now shows the same About Us content (src/components/AboutPage.tsx, rendered by the catch-all route for /about), with the site header, the closing call-to-action band and footer. Title, description, canonical and robots unchanged.

## Lead source rule (owner, 7 Oct 2026)

- `leadSource` is **Paid** only when the visit came from a Google Ads click: the lead carries a `gclid` (or `gbraid` /
  `wbraid`, used on some iPhone traffic). Otherwise **Organic**, including visitors who reach an ad page from the home
  page footer's "Services" links. `adType` is still sent and only says which ad questionnaire was used.
  (Before: any lead from an ad page questionnaire was Paid.) `src/app/api/lead/route.ts`.
- The tracking values (utm_*, the click IDs, ref) are remembered for the visit in the browser tab (sessionStorage), so
  they survive moving between pages before the questionnaire is finished (`readTracking` in QuestionnaireParts.tsx).
- GoHighLevel can branch on `leadSource` alone. The owner's ad payer is the postcode owner, so routing is unaffected;
  the rule keeps reports and any source-based billing accurate.
- (Owner, 7 Oct 2026: there are no further build stages; from now on the work is page edits.)

## Questionnaire wording and match page (owner, 7 Oct 2026)

- Name page: "Your name please" → "Hi, what is your name please"; the box's "First and last name" placeholder removed.
  Summary: "{name}, here's what you need help with" → "{name}, here's what you told us you need help with". (Shared by all
  five questionnaires, src/content/business-questionnaire.ts.)
- "Suburb data © GeoNames (CC BY 4.0)" removed from under the postcode box. The licence requires a visible credit, so it
  now sits in the footers' small print (src/components/ui/DataCredit.tsx: site footers, ad page footer, match page).
- Match page (/match) rebuilt from the owner's "match page" design (hero section/ad landing pages/match page.png):
  "Match complete" pill in the header, "Meet your business accountant." headline, the accountant's card (photo, firm,
  specialty and location, years' experience, blurb, phone/email/website/address/hours, Call/Email buttons, website link,
  service chips), "Your selected services" (the customer's own answers), "Why this looks like a good fit", a "Ready to
  take the next step?" band with "Contact {first} directly", and a slim footer line. New optional accountant fields for
  GoHighLevel: specialty, location, years, address, hours (empty fields are hidden). The sample accountant is now
  "Alex Morgan" with placeholder details, labelled "Illustrative profile • Sample details".
- Note: "Your area — A local partner for your postcode." is an area claim (an earlier rule asked for neutral wording);
  it comes from the owner's design and is true because ad payers are also the postcode owners.
- (later, 7 Oct 2026) Questionnaire changes:
  - Site questionnaire, "Personal Tax & Planning / What do you need help with?": tick one or more (hint "Select all that
    apply."); "I'm still not sure" only on its own. Each ticked reason gets its own follow-up page (this year's return,
    amend, planning, in that order), then the shared "Does your return include any of these?" page; the summary shows one
    card per reason. Lead answers: personal.needs (list), thisYear, amend, adviceTopics, returnIncludes. The Ad 2 box
    still takes one choice.
  - "Which financial years need lodging?" (overdue) removed from the site questionnaire and Ad 2.
  - "Not sure — help me choose" removed from every question (business and SMSF category pages, planning topics) and
    from under the Ad 2 match box.
  - SMSF: "Establishing an SMSF after receiving advice" → "Establishing an SMSF".
- (later, 7 Oct 2026) No year or first-tax-return questions in any questionnaire ("This year's tax return" has no follow-up
  page; "Amend a lodged return" asks only "What needs correcting?" with an optional note). "Not sure" options removed from
  the question boxes ("Does your return include any of these?", "Not sure yet" on in person/remote, "Not sure which
  company setup I need"); the big "I'm still not sure" card on the personal page is kept. The GeoNames credit is removed
  site-wide at the owner's request (the CC BY 4.0 licence of the suburb list asks for a visible credit: owner's decision).
  The "Start here" arrow is a larger curved green arrow (right on laptops/desktops, down on tablets).

## Ad 2 — new personal tax hero (owner, 9 Oct 2026)

Owner's request, example picture `hero section/ad landing pages/personal tax/personal example.png` and two photos
(`personal hero pic.png` desktop, `personal hero pic mobile.png` phones/tablets). Only the hero of `/ad-2` was replaced;
everything under it (`AdHomeSections`), the header and the footer are unchanged.

- **Removed from the /ad-2 hero:** the home desk photo, the navy bar, the three-line headline "Looking for a personal tax
  accountant near you?", the phone Start button, the line under the headline, the steps and the match box beside them.
- **New hero** (`src/components/ads/PersonalHero.tsx`, wording `PERSONAL_HERO` in `src/content/personal-questionnaire.ts`,
  styles `.pth-` in `src/app/ads.css`, pictures `personalHeroPictures` in `site.config.ts`, made by
  `scripts/make-personal-hero.mjs`): eyebrow "PERSONAL TAX", H1 "Personal Tax / Accountant" (green second line),
  "Find an accountant matched to your personal tax needs.", button "Find My Tax Accountant →", "60 seconds • Free • No
  obligation", then the home page's three trust points (owner chose to add them, as in the example).
- **Owner's choices (9 Oct):** words ON the photo's sky as in the example (not a separate picture beside them); the short
  sub-line (the longer line and the "Personal tax made simpler…" supporting line were not used); trust icon row added;
  the button opens the personal match box popup.
- **Layout:** desktop (1200px+): desktop photo fills a 650–750px hero, words on the left 45% over a soft white wash,
  woman on the right. Phones and tablets (below 1200px): mobile photo, words at the top on the sky, skyline and trees
  under them, then the three points on white. H1 45–50px on phones; button 60px tall, full width on phones.
- **Button:** a `#match-box` link. The page no longer has a match box of its own, so `AdBoxPopup` takes a `phones` prop
  (used only on /ad-2) and opens the personal match box popup on every screen size; the lower buttons on the page do the
  same. Start → the personal questionnaire (paid lead, unchanged).
- **Checked:** 390, 430, 768, 1024, 1200, 1440, 1920 wide, no sideways scroll; hero button and lower buttons open the box
  and Start opens the questionnaire (phone and desktop), no browser errors; `npm run build` passes; `npm run seo-check`
  problems=0.
- **Below the hero:** the owner's new wording for sections 2–6 (Personal Tax Services, Find the Right Accountant, Why Use
  an Accountant, How It Works, FAQ) was supplied with this request but is for later; nothing below the hero was changed.
- **Phones redone to the owner's "mobile look" picture (9 Oct 2026, same folder):** short hero with the mobile photo
  soft (slight blur, white wash) behind the words only — skyline behind the line under the headline, trees along the
  bottom — and no tall photo strip under the words; magnifier at the start of the button; the three points on white
  straight under the photo with larger icons. Wording kept as approved (the picture's own wording — "Personal Tax
  Returns & Tax Accountants", "Find my match", "It only takes 60 seconds…" — was not used). Tablets and desktops unchanged.
- **Desktop and tablets: owner's replaced "personal hero pic.png" (9 Oct 2026, 07:31; woman in a cream jumper, further
  right)** → `public/images/hero/personal-desk-v2-1983.webp`. Desktop layout unchanged. Tablets (768–1199px) now use
  this photo too instead of the phone photo: words on a light sky, then the photo in full width under them (its sky
  fades into the light sky), then the three points on white in one row. Phones keep the mobile photo. (The other new file
  in the folder, "desktop hero personal tax.jpg", is not used.)
- **Desktop and tablets: "personal hero pic.png" updated again by the owner (9 Oct 2026, 07:34; same scene with the logo
  mug)** → `public/images/hero/personal-desk-v3-1983.webp`. Layout unchanged; phones unchanged.
- **Desktop and tablets: "personal hero pic.png" updated again (9 Oct 2026, 07:39; woman smaller and further right)** →
  `public/images/hero/personal-desk-v4-1983.webp`. Layout unchanged; phones unchanged.
- **Desktop: photo 4cm higher (owner, 9 Oct 2026).** The photo's box starts 4cm above the hero (`.pth-pic { top: -4cm }`,
  1200px+ only), so the photo shows 4cm higher; to still fill the hero to its bottom edge it is drawn about 20% larger.
  Tablets and phones unchanged.
- **Hero wording per the owner's hero instructions (9 Oct 2026, later):** sub-line now "Looking for help with your personal
  tax return? Find an accountant matched to your individual tax needs."; supporting line added under the reassurance:
  "Personal tax made simpler." (green, bold) + "Find an accountant who can help with your tax return, deductions,
  investments, rental property and other personal tax matters." (`PERSONAL_HERO.support`). H1, button and reassurance
  unchanged; the "PERSONAL TAX" eyebrow and the three trust points kept. Phones: the supporting line sits on a soft
  frosted white panel (it falls over the treetops). Desktop: supporting line max 25rem wide and a stronger white wash on
  the left so the words and points read clearly where the laptop reaches under them (the taller hero draws the photo larger).
- **Desktop: photo zoomed out (owner, 9 Oct 2026; replaces "4cm higher").** The whole photo at its own shape, full width
  along the bottom of the hero (no cropping, no enlarging); its top edge fades into the same blue sky (rgb 99,185,247)
  that fills the hero above it. The scene is drawn smaller and the laptop no longer reaches under the words. Tablets and
  phones unchanged.
- **Desktop and tablet: photo 7cm higher, then another 1.5cm = 8.5cm (owner, 9 Oct 2026).** Desktop: the zoomed-out photo's bottom edge sits 7cm
  above the hero's bottom; that 7cm strip is plain white and left empty for high-impact hero words the owner will add
  later (the photo's top sky is cut off by the hero's top). Tablet: the photo moved up 7cm with nothing else changed
  (the empty gap above the points strip is left; the supporting line now sits over the skyline, readability to revisit).
- **Sections 2–6 added under the hero (owner, 9 Oct 2026; all views).** `PersonalSections.tsx` (wording exactly as supplied
  in `src/content/personal-sections.ts`, styles `.pps-` in ads.css) sits between the hero and the page's existing
  sections; nothing existing was removed or changed (the owner will delete or edit the older sections later).
  2 "Personal Tax Services": eyebrow "What we can help you with", intro, six cards with the owner's green line icons
  (`scripts/make-personal-icons.mjs` → `public/images/ad-personal/`); 3 "Find the Right Accountant for Your Tax Needs":
  navy band, "Tell us what you need. / We'll do the matching." and "Find My Accountant →"; 4 "Why Use an Accountant for
  Your Tax Return?": six ticks; 5 "Finding Your Accountant Is Simple" (eyebrow "How it works"): three numbered steps and
  "Find My Tax Accountant →"; 6 "Personal Tax Questions": four questions in the site's FAQ boxes (no FAQPage markup; the
  page is noindex). Both buttons open the personal match box popup. Phones one column, tablets two, desktops three cards.
- **Sections 2–6 on laptops and desktops (1200px+) laid out as the owner's "personal example" picture (9 Oct 2026).**
  Row 1: "Why Use an Accountant…" with plain ticks on the left; "Personal Tax Services" in a mint panel with a round
  green icon badge and the six services as a compact two-column list on the right. Row 2: "Find the Right Accountant…"
  as a light panel (as the example's "Who is it for?") with five white tiles — Employees, Investors, Landlords,
  Contractors, Self-employed (words taken from the section's own sentence; decorative, `aria-hidden`; icons
  person/screen added to `scripts/make-personal-icons.mjs`) — and the closing lines and button on the right. Then
  "How it works" and the FAQ, left edges lined up with the rows above. Same CSS grid reorders the sections (no
  duplicated words). Phones and tablets unchanged; no words removed.
- **Hero wording (owner, 9 Oct 2026, later):** sub-line now "Find an accountant who can help with your tax return,
  deductions, investments, rental property and other personal tax matters."; the supporting line under the reassurance
  ("Personal tax made simpler." + that sentence) removed. Nothing else changed.
- **Photo back to its original position, then 6cm up (owner, 9 Oct 2026).** The 8.5cm lift was undone (desktop: zoomed-out
  photo along the hero's bottom on the blue sky; tablet: photo straight under the words), then the photo was moved 6cm up
  on desktop and tablet (desktop: the 6cm strip under the table is plain white). Hero sub-line back to "Looking for help
  with your personal tax return? Find an accountant matched to your individual tax needs." (the supporting line under
  the reassurance stays removed).
- **Desktop hero headline and sub-line (owner, 9 Oct 2026).** "Personal Tax Accountant" (with the small label) 1.5cm
  higher, at its original size, on one line (it was briefly 70%). The sub-line is exactly two lines (one sentence each)
  and its right edge stops 3cm short of the notepad in the photo (notepad left = 48.66% of the hero width; the font is
  sized from that width, 15.5–17.3px). Phones and tablets unchanged.
- **Desktop headline (owner, 9 Oct 2026, later):** "Personal Tax Accountant" at 80% of its original size (still one line;
  50–69px), and the label + headline moved up another 2cm (3.5cm in all).
- **Desktop headline at 90% of its 80% size (owner, 9 Oct 2026)** = 72% of the original (45–62px), still one line.
- **Project rule added to CLAUDE.md:** "noc" in a request means "no other changes".
