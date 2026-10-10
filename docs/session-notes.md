# Session notes

Running record of each working session (owner rule, 10 Oct 2026: after every edit, save the session context, then
commit and push). Newest first. No secrets here: tokens, keys and IDs live only in Vercel environment variables.

## 11 Oct 2026

### Changes made (committed and pushed)
- **Match page (/match) is now an honest "Enquiry sent" confirmation** (`EnquirySentPage.tsx`, wording in `src/content/enquiry-sent.ts`):
  - "Thanks {first}, your enquiry has been sent." and "A local accountant who covers {suburb} will contact you, usually within 2 hours."
  - What happens next (3 steps), their selected services and details, and "We'll also email a copy…" when they ticked it.
  - Header pill "Enquiry sent". The sample accountant is no longer shown; `BizMatchPage.tsx` is kept for when GHL sends the real match back.
- **Contact time is "within 2 hours" site-wide** (owner): the FAQ answer (home and ad pages) and the home "how it works" step 3. "Call for immediate assistance" removed (no phone number is shown).

- **Page speed** (Lighthouse on the live site): desktop home 99. Mobile 81 to 85, because the hero photo appears after about 4 s.
  - Fixes: AVIF images site-wide plus a 2560px image width (`next.config.ts`), and the ad pages' phone hero photo preloaded first (`PersonalHero.tsx`).
  - Slowness the owner saw was largely their own internet connection at the time.
  - Fonts: only Plus Jakarta Sans is preloaded now. Fraunces (About, popups) and Caveat (popups) load only when used (`layout.tsx`).

### Owner decisions
- Old GHL site addresses: let Google clear them out (no redirects).
- Promised contact time: usually within 2 hours. GHL workflows should match this, and send the copy email when "email me" is ticked.

## 10 Oct 2026

### Changes made (all committed and pushed)
- **Home hero**
  - Softer, more gradual white tint above the trust points and towards the match box (`HeroGap.tsx` placeHomeFade,
    `globals.css` `.desk-hero-wash::after` at 55%).
  - "Let us do the heavy lifting…" now matches the registration hero's line under its headline: same on-screen size,
    weight and colour; sideways stretch removed. 1024–1199px: wraps before the match box (pushes points and steps one
    line lower; offered to adjust, not done).
- **Ad page heroes**
  - Personal tax (/ad-2) button 1mm lower.
  - SMSF (/ad-3) button 5mm lower; trust icons 7mm lower (5mm, then 2mm), button kept in place.
  - `HeroCtaCentre.tsx` now takes a per-page `--cta-nudge` (in px) on top of its centring.
  - SMSF hero photo restored to `smsf-desk-v28` (its own sky and fade; `site.config.ts`).
    `scripts/make-smsf-hero.mjs` still builds the v30 blue-sky version.
- **Questionnaires (site popup and the four ad pages)**
  - "Is this a new or existing business?" removed site-wide.
  - "Your selections, at a glance" shows one service / sub-service per screen ("1 of 4"), the note on the last screen.
    All screens are laid out at the same height so they are drawn at the same size (`SelectionsSummary.tsx`
    SummaryPage). One set of larger text sizes (`globals.css` `--ss-*`).
  - The summary fits the popup like every other step (PhoneFit).
  - Every "select all that apply" box: one text size per screen size (18px desktop, 17px tablet, about 16px phone),
    even padding, equal row heights.
- **Animations**
  - "What we can help you with" and "Who we help" icons (home and ad pages) start 1 second after the page is scrolled
    to them and animate one by one in reading order, 2 seconds in all (`IconSequence.tsx`).
- **GoHighLevel connection** (`src/lib/ghl.ts`, `/api/lead`)
  - Leads go to the sub-account through a Private Integration token. Each lead upserts a contact, with tags
    `yam-lead`, `lead-organic`/`lead-paid`, `q-<questionnaire>` and `service-…`, plus a note of all answers.
  - It opens an opportunity if `GHL_PIPELINE_ID` is set. The inbound webhook remains as a fallback.
  - `scripts/ghl-check.mjs` checks the connection.

### Survey → HighLevel custom fields (in progress, step by step with the owner)
- **Done by the owner:**
  - Step 1: field list agreed.
  - Step 2: 5 checkbox fields.
  - Step 3: 19 more fields.
  - All 24 are in the sub-account's Contacts custom fields, folder "Website Survey".
- **Done in code:**
  - Every questionnaire (site popup and /ad-1 to /ad-4) sends a `survey` object (field name → answer;
    `src/lib/survey-fields.ts`).
  - `src/lib/ghl.ts` reads the sub-account's contact custom fields by name (cached 10 minutes) and fills them on the
    contact upsert. Tick-box and radio fields take matching options; text fields take plain text.
  - Lead Source, Survey Type, Website Lead ID, Ad Campaign, Google Click ID, UTM Source / Medium, Referral Code,
    Preferred Way to Meet and Email Match Details are filled from the lead itself.
  - If fields can't be read, the contact is still saved and every answer stays in the note.
  - Tested locally in mock mode: the survey is sent correctly from all five questionnaires.
- **Field 3 "Overdue Returns Details":** stays empty; the personal flow no longer asks which years are overdue.
- **Live test passed (10 Oct, late evening):**
  - A test lead from /ad-1 reached the sub-account: contact created, Website Survey fields filled, tags and note present.
  - The test used reserved details: TEST Please-Ignore, test@example.com, 0491 570 006 (ACMA fiction range).
  - The owner can delete that contact.
- **Optional next:** show the Website Survey folder on the contact page; workflow on the `yam-lead` tag to assign the accountant and notify.
- **Site went live on Vercel (10 Oct, evening):**
  - Crazy Domains: `@` A record `216.198.79.1`; `www` CNAME `f2e89ad9aac058b5.vercel-dns-017.com`.
  - www is the main domain; the bare domain redirects to it.
  - The old GHL site's ~168 addresses now show "not found" (owner: standalone site, not rebuilt; redirects offered).
  - The match page still shows the sample accountant.

### Owner rules added
- **Standalone site** (late 10 Oct): no connection to the previous build. The old GHL site's ~168 pages are not rebuilt (Stage 3 dropped); old-site wording-fidelity rules no longer bind (CLAUDE.md "STANDALONE SITE").
- No further build stages planned: only improvements, maybe a few new pages later (owner, 10 Oct).
- After every edit: update this file, then commit and push (CLAUDE.md "SAVE SESSION CONTEXT").
- Every new thread: first read all project context, then ask the owner what to continue, before any work
  (CLAUDE.md "FIRST STEP IN EVERY NEW THREAD").

### Owner decisions
- GHL token and Location ID are stored **only in Vercel** environment variables (not in `.env.local`).
- Keep the domain youraccountantmatch.com.au and keep using the word "match".

### Open items / waiting on the owner
1. **Vercel**
   - Add `GHL_PRIVATE_TOKEN`, `GHL_LOCATION_ID`, `MOCK_GHL=false` (and optional `GHL_PIPELINE_ID`) and redeploy.
   - Then send a test lead and check GHL Contacts.
2. ~~Match page still shows the sample accountant~~: fixed 11 Oct.
   - Replace it with an honest "your enquiry has been sent" screen before real customers use the live site.
3. **Fact-check fixes** (full list given 10 Oct; wording suggestions per item), none made yet:
   - Fake 11-second "searching / found your match" screen.
   - Paid-lead "local" wording and paid-placement disclosure (owner to confirm the paid-lead rule).
   - "Handpick / perfect / best" wording.
   - Privacy page: describes email verification that doesn't exist, and is missing fields and processors.
   - "100% Privacy Guaranteed".
   - "Australian Tax Office" in the FAQ.
   - Business names "reserve".
   - AFSL wording.
   - /ad-3 and /ad-4 show the personal tax FAQs.
   - Contact page: AEST should be AEDT, and "below" should be "above".
4. **Domain move to Vercel: not yet.**
   - The old GHL site has 175 pages; 168 aren't built yet (Stage 3).
   - DNS is at Crazy Domains: `@` A record `162.159.140.166`, `www` CNAME `vibe.ludicrous.cloud`.
   - The domain has no MX records, so hello@ and privacy@ don't receive email.
5. **Business details:** legal business name and ABN needed for the Contact page.
