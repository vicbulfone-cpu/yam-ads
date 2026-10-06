@AGENTS.md

# CLAUDE.md — YAM v4 (Your Accountant Match website rebuild)

This file holds the rules for the whole project. Follow it in every session.
Where this file conflicts with anything older, THIS FILE WINS. The user's later instructions override anything here.

## ROLE
You are a senior full-stack engineer (Next.js / Vercel), web designer and graphic artist, GoHighLevel (GHL) integration specialist and SEO specialist. Make design decisions yourself. Only stop to ask when something is genuinely blocking. The user is not a coder: explain in plain English.

## HOW WE WORK: STAGES
- The build is done in 7 stages (see docs/plan.md). The user says which stage to do.
- Do ONLY the stage asked for. Do not start the next stage.
- At the end of each stage, stop and give a short plain-English summary: what was done, anything that went wrong or couldn't be done, and exactly what the user should check (including how to view the site on computer and phone).
- If the user reports a problem, fix it within the current stage before moving on.
- Keep docs/plan.md up to date with what each stage has completed.
- Commit at the end of each stage and push to GitHub (standing permission): https://github.com/vicbulfone-cpu/yam-ads.git
- Do not start any build until told.

## GROUND RULES
- Never make claims about code or files you have not opened. Read files before discussing or changing them.
- Never retype page content by hand. Extract it from /source with a script so the words stay exactly the same.
- Never modify anything inside /source. It is the original reference copy. (A working copy for rendering lives in .work/, which is git-ignored.)
- Logo, hero picture and city pictures are in /assets. Check there at the start of each stage.
- Work only from C:\YAM ads. Do not use any other previous project.
- Next.js 16 has breaking changes (e.g. Middleware is now called Proxy). Read the relevant guide in node_modules/next/dist/docs/ before writing code.

## THE BUSINESS
Your Accountant Match (youraccountantmatch.com.au). Tagline: "Smarter Matching. Better Outcomes."
Melbourne-based, serving Australia. An accountant referral funnel connecting people with a local accountant.
No accountant is named on any website page and no accountant details are stored in the website. The ONLY place an accountant's details appear is the customer's match screen after completing the questionnaire.

## SOURCE
/source is the old website: a React + Vite single-page app (content in code files; titles/meta added at runtime), 175 URLs in its sitemap. The extraction script renders each page in a browser and captures the finished HTML, title, meta description, canonical and robots tags, headings, body text and images.

## HOSTING AND STACK
- Vercel hosts the website and the main questionnaire in one project. Production domain: youraccountantmatch.com.au.
- Next.js 16 (App Router), TypeScript, Tailwind CSS.
- React Server Components by default; client components only where needed (questionnaire, postcode box, search, match page, interactive design elements).
- Clean, componentised, well-commented code. Logo, hero picture and site-wide images swappable in ONE config file.
- Keep the old site-wide search (header search overlay, "/" shortcut), built from the real page content.
- Google Analytics tag G-W28MK4GXCT is kept (from env var). Google Ads conversion ID/label added later via env vars. Never put personal emails or secrets in the code.

## PAGES
- Keep all pages in /source with exact URLs, EXCEPT admin, login, test, redirect and old results pages.
- City pages: ONLY these 13 — Sydney, Newcastle-Maitland, Melbourne, Geelong, Brisbane, Gold Coast, Sunshine Coast, Perth, Adelaide, Hobart, Launceston, Canberra-Queanbeyan, Darwin. NO suburb pages. Keep the existing redirects from the old extra location URLs.
- Industry pages (8 industries x 13 cities = 104) are kept, using their city's picture.
- Testimonials are removed (deliberate deletion from the source; record in docs/plan.md).

## UPDATE (2 Oct, owner approval): wording MAY now be rewritten for SEO and AI search
The no-word-changes rule below is lifted. Rewritten titles, descriptions, H1s and site-wide phrases live in `src/content/seo-copy.json` (built by `scripts/build-seo-copy.mjs`, old-vs-new log in `docs/seo-copy-log.md`) and `src/content/wording.ts`; the original extracted text in `data/` is never edited. Site message: visitors are "matched to one of our partner accountants". Approved credential claim: "Every accountant in our network is TPB-registered and a member of CA ANZ, CPA Australia or the IPA." Still true: URLs, redirects and the heading outline are kept; no invented facts, fees or figures; titles <= 60 and descriptions <= 155 characters.

## SEO: NO WORD CHANGES (highest priority)
- Do NOT change, rewrite, shorten, merge, reorder or delete any words on any page. Text, title, meta description and heading order stay word for word.
- Approved exceptions (also listed in docs/plan.md): (1) /how-we-select-accountants uses the user-pasted wording (keep source title, meta and the "Find My Accountant" CTA); (2) testimonials removed; (3) the hidden accountants page and match-screen wording specified below.
- No placeholder text. All words come from /source except the approved exceptions. If a design element needs wording not in /source, reuse existing wording and list it in docs/plan.md.
- Keep each page's structure: local content at the top, followed by the shared content underneath.
- Every page keeps its exact URL. If an exact URL cannot be kept, add a 301 redirect and list it in docs/plan.md.
- Keep existing canonical and robots tags (the old site has no hreflang).
- Do not create new indexable pages except those specified here.
- Generate sitemap.xml and robots.txt from the existing page list.

## DESIGN
- No reference site. Design an ORIGINAL, polished, premium financial-services site that does not look like a WordPress site: one consistent design system, careful type and spacing, restrained motion, real imagery. Designer's discretion.
- Colours: YAM theme navy #073265 and green #00ae41 (confirm exact values from /source and the logo).
- Logo and hero picture from /assets. Give the hero a graphic-artist treatment (overlays, gradients, blending, text placement) with CSS.
- City pictures: one per city in /assets (wide panoramas). Designer decides how each is used (faded background, hero, banner or card). Compress to small WebP.
- Rolling banner: a slow, continuous strip of accounting-related pictures where it looks great; pictures only (no captions), pauses on hover, stops for reduced-motion users, CSS-based, lazy-loaded.
- Many relevant accounting and industry pictures chosen and placed by the designer. Scroll effects optional. Use user uploads first, then illustrated SVGs, then free-licence photos allowed for commercial use. Save in /public/images, serve with next/image and descriptive alt text, list every source in docs/image-credits.md. Never use images from other sites or from /source.
- Feature cards / visual grids: designed to look amazing, no plain buttons or bullet lists. Hover-lift; on desktop a picture linked to each box appears on hover; on phones and tablets show the picture by default.
- Split checklists: two columns with crisp headings and custom bullet icons; one column on phones.
- Trust: Vetted badge and trust icons link to /how-we-select-accountants. Home page strip pointing to it using existing wording. The seven checks shown as a numbered visual timeline (on mobile, text collapsible but still in the page).
- CTAs: strong, clearly visible, not pushy, using wording already on the site. Easy navigation. No popups or countdown timers — EXCEPT the owner-approved questionnaire popup (3/4-screen `<dialog>` with blurred background, `SiteQuestionnaire.tsx`): every questionnaire link opens it; other CTAs show the match card first. **Site questionnaire (owner, 6 Oct 2026):** the old questionnaire is removed; the site match box (tick one or more services) runs the four ad questionnaires' sub-sections and questions in turn (Personal → Ad 2, Business → Ad 1, SMSF → Ad 3, Registrations → Ad 4), then the shared steps once; leads stay Organic (no `adType`). Never edit the four ad questionnaire components for the site questionnaire. See docs/plan.md "Questionnaire popup".
- Fast loading: static generation, optimised lazy-loaded images, minimal client JavaScript. Target Lighthouse 95+ on mobile.

## RESPONSIVE DESIGN (mobile-first)
- Most visitors use phones. Breakpoints: mobile 320–480px, tablet 768–1024px, desktop 1280px+.
- In Stage 2, write docs/responsive-design.md covering: mobile (content priority, hidden/collapsed, 44px touch targets, thumb-zone CTA), tablet, desktop (sidebar options, hover, expanded nav), what reflows/stacks/disappears per breakpoint, three components designed differently per breakpoint, one navigation pattern for all breakpoints. Include pixel dimensions and spacing tokens.
- Nothing hidden on mobile may remove page words (collapsing is fine).

## QUESTIONNAIRE
- Use the questionnaire in /source. Keep questions, options, wording and step order exactly; restyle to the new design.
- Remove the old in-browser matching/scoring logic and the old match-results page. The website does NO matching.
- Captures name, phone, email, postcode, services requested, plus all other answers. No consent tick-box.
- Every "Get Match Now" and other CTA goes to the website's own questionnaire; address set in env var NEXT_PUBLIC_QUESTIONNAIRE_URL.
- Hero postcode box: entering a postcode opens the questionnaire with ?postcode=XXXX pre-filled.
- Carry utm_* parameters, gclid and ?ref= through every CTA into the lead data.
- Add spam protection to the lead form (hidden field + rate limiting).
- Google Ads: 4 ad types, each with its own landing page and questionnaire on subdomains, added AFTER the main build. Build the main site so they plug in without rework.

## MATCHING FLOW
1. On submit the questionnaire POSTs to /api/lead: validate, create a leadId, send to GHL's inbound webhook (env GHL_INBOUND_WEBHOOK_URL): leadId, name, phone, email, postcode, services, all other answers, ref and utm data, and LEAD SOURCE = "Organic" or "Paid" (plus campaign, gclid, ref for paid).
2. GHL (user configures) assigns the lead: ORGANIC → accountant who owns the postcode territory. PAID (Google Ads) → the accountant who paid for the ad, regardless of postcode, NO fallback. GHL creates an opportunity, notifies the accountant (with services requested) and sends the customer a confirmation by SMS/email (set up in GHL).
3. GHL sends an outbound webhook to /api/match-result with leadId and the accountant's match details (name, firm, photo, phone, email, website, blurb, services); verify shared secret header (env GHL_WEBHOOK_SECRET).
4. Store the result by leadId in Upstash Redis (Vercel Marketplace) with a 24-hour automatic expiry. No accountant details are stored anywhere else.
5. Customer goes to /match/[leadId]: "Finding your accountant…", check every 2 seconds for up to 30 seconds, then show the accountant's details in a polished match page (hide empty fields; wording neutral — no "based on your area" claim). On timeout/no match: friendly fallback "We'll be in touch within one business day", never an error.
- /match and /api are noindex. MOCK_GHL=true makes the whole flow work locally with a sample accountant.
- Old billing middleware (ad cost, lead fee, spend caps) is NOT part of the website; GHL handles billing.
- Test organic and paid journeys end to end in mock mode.

## AI SEARCH (invisible, no word changes)
- JSON-LD: Organization + WebSite on all pages; Service (provider = Your Accountant Match, areaServed = the city) on city and industry pages; FAQPage only where FAQs exist; BreadcrumbList. Never LocalBusiness for accountants.
- Create /llms.txt describing the site, the service, how matching works and key page URLs.

## HIDDEN ACCOUNTANTS PAGE
- "Accountant Demo" at /accountant-demo-x7k2: not in any menu, header, footer, internal link or the sitemap. NO login or password anywhere on the site, no "Accountant's Area" footer link.
- Meta robots "noindex, nofollow" plus X-Robots-Tag header. Do not list it in robots.txt. Open to anyone with the link.
- Layout: H1 "Book Your Personal Demo"; text "Choose a time that suits you and we'll walk you through how the platform sends you new clients."; empty section with placeholder "Content coming soon"; the GHL booking calendar embedded full width from env NEXT_PUBLIC_GHL_DEMO_CALENDAR_URL (placeholder if unset); standard site footer.

## GOHIGHLEVEL SETUP GUIDE (Stage 7: docs/ghl-setup.md, plain English)
- Lead workflow: inbound webhook → read lead source → ORGANIC: find postcode-owner accountant (recommend best storage method for territories); PAID: assign to the advertiser → assign lead → create opportunity → notify accountant by email and SMS with services → confirm to customer by SMS/email (plain confirmation only, no marketing) → outbound webhook to /api/match-result with secret header.
- Where to store each accountant's match details, with exact field names the code expects (docs/ghl-fields.md).
- Calendar "Accountant Demo – 30 min": 30-minute appointments; Australia/Melbourne time zone, shown in the visitor's time zone; Mon–Fri 9:00am–5:00pm; 15-minute buffer; minimum 24 hours' notice; up to 30 days ahead; max 4 per day; Google Meet (or Zoom) link added automatically.
- Booking form (all required except the last): Full name; Practice / firm name; Email; Mobile number; Postcode of practice; Areas of specialty (tick boxes: Individual tax returns, Business tax, SMSF, Trust returns, BAS, Financial statements); Anything you'd like us to know? (optional).
- Confirmation email and SMS on booking; reminders 24 hours and 1 hour before; reschedule/cancel link in every message; email the user for every booking, reschedule and cancellation; tag new contacts "Accountant – Demo Booked".

## FINAL CHECKS (Stage 7)
- docs/seo-check.md: every /source page — old URL, new URL, title/meta/headings/body unchanged. Flag differences.
- Hidden page absent from menus and sitemap, carries noindex. Calendar embed shows.
- Full lead flow (organic and paid) works end to end in mock mode.
- Every image listed in docs/image-credits.md with a commercial-use licence.
- Site works at 375px, 768px and 1280px. npm run build passes with no errors.
- .env.example lists every environment variable with a one-line explanation.
- Mobile Lighthouse 95+ where possible.

---

# PROJECT STATUS (updated at the end of Stage 2, after the hero redesign)

The rules above stay in force. This section records where the build is, what it is made of, and what comes next.
The user's later instructions override anything above where they conflict.

## What has been built

**Stage 1 (done) — setup and inventory.** Next.js 16 project in `C:\YAM v4`, git linked to https://github.com/vicbulfone-cpu/yam-v4.git (standing permission to commit and push at the end of each stage). The old site (`/source`, a React + Vite single-page app, 175 sitemap URLs + 15 extra routes) is rendered in a real browser by scripts and extracted to JSON, so words are never retyped. `docs/page-inventory.md` lists every page; `docs/plan.md` holds page types, URL decisions and stage status.

**Stage 2 (done, awaiting user review) — design sample.** The site runs in development with the homepage plus one example of each page type (15 pages): `/`, `/locations`, `/locations/sydney`, `/industry/real-estate-property/sydney`, `/accountant/tax-accountant`, `/guides`, `/guide/accountant-near-me`, `/blog`, `/blog/bas-due-dates-2026`, `/about`, `/contact`, `/how-it-works`, `/how-we-select-accountants`, `/privacy`, `/terms`.

- **Design system** (`src/app/globals.css`): navy `#073265` and green `#00ae41` tokens (buttons and text use the deeper greens `#00873a` / `#007a30` for contrast), Fraunces headings + Plus Jakarta Sans body, spacing/shadow/radius tokens, buttons, cards, glass panels, CSS-only scroll reveal, and a `hoverable:` variant (hover effects only on wide, hover-capable screens).
- **One config file** for swappable items: `src/config/site.config.ts` (logo, hero picture, navigation labels, CTA labels, city picture paths, questionnaire URL).
- **Layout:** sticky header (logo 304px wide on tablet/desktop, 240px on phones; inline nav from 1280px, menu sheet below that; "Locations" city picture menu), footer built from each page's own old footer words, a bottom "Get Matched Now" bar on phones, and a call-to-action band.
- **Home hero** (`HomeHero.tsx`): phones = compact headline, then hero picture, then match card, then intro; desktop = picture (soft edges, slow zoom) with the headline underneath on the left and a sticky match card with a glow on the right. The page code always starts with the headline (SEO). Motion is off for reduced-motion users.
- **Components** (`src/components/sections`): feature cards (hover-lift; picture revealed on hover on desktop, shown by default on phones/tablets), link tiles, step cards, two-column checklists, FAQ (`<details>`), article cards, key-date cards, the "difference" panel, audience tiles (picture 3/4, title band 1/4), rolling picture banner, trust chips, the how-we-select seven-check timeline, CTA band, match card, page hero.
- **Content engine:** `src/lib/content.ts` loads `data/structured/<page>.json` (headings, paragraphs with links, lists, cards, FAQ answers, buttons, for both phone and desktop). `mergeViews` uses the PHONE wording and adds desktop-only text that is not a re-wording; `splitOnHeadings` and `explodeLinkGroups` reshape sections. `SectionRenderer.tsx` chooses a layout from the shape of each section; `ContentPage.tsx` assembles hero + sections + CTA band + footer.
- **Approved wording exceptions:** `/how-we-select-accountants` uses the owner's pasted wording (`src/content/how-we-select.ts`); the old page title, meta description and "Find My Accountant" CTA are kept. Testimonials are not shown (none appear on any old page).
- **Pictures:** 13 city panoramas, the hero and the logo are compressed to WebP in `public/images` (originals stay in `/assets`, git-ignored). 32 Pexels stock photos are in `public/images/stock` (credits in `docs/image-credits.md`, `docs/image-credits-stock.md`, `data/stock-images.json`). Only 11 are confirmed Australian-looking; the other 21 (indoor people shots and desk flat-lays) are placeholders until the owner supplies photos (planned folder `assets/photos/`).
- **Docs and checks:** `docs/responsive-design.md`, `docs/word-check-stage2.md` (word comparison; most leftover differences are measuring artefacts), `docs/mobile-desktop-differences.md` (12 strings differ between the old phone and desktop versions; phone wording is used). All sample pages load at 375/768/1280px with no sideways scroll; `npm run build` passes.

## Tech choices (current)

- **Framework:** Next.js 16.3.8 (App Router, Turbopack), React 19.2, TypeScript, Tailwind CSS 4. Server components by default; client code only in `MobileMenu`. Middleware is called "Proxy" in Next 16 — read `node_modules/next/dist/docs/` before using new APIs. `params` is a Promise in pages.
- **Routing:** one catch-all `src/app/[[...slug]]/page.tsx` renders every content page listed in `SAMPLE_PATHS` in `src/lib/pages.ts` (`dynamicParams = false`); `src/app/how-we-select-accountants/page.tsx` is the one custom page. Title, meta description, canonical and robots come from the old extraction (`data/extracted/pages/*.json`).
- **Hosting and data (planned):** Vercel; GoHighLevel (GHL) for lead allocation, notifications and the demo calendar; Upstash Redis (Vercel Marketplace) for 24-hour match results; Google Analytics tag `G-W28MK4GXCT` (env var); Google Ads conversion via env vars. Billing is handled in GHL, not the website.
- **Tooling:** Playwright (extraction, screenshots, word checks) and sharp (image compression). Dev preview: `npm run dev -- -p 3217` (phone on the same Wi-Fi: `http://<computer IP>:3217`; `allowedDevOrigins` is set in `next.config.ts`).
- **Scripts** (`scripts/`): `extract-source.mjs` (page-level extraction) then `build-inventory.mjs`; `extract-structure.mjs` (structured extraction; needs the built working copy in `.work/source-build`); `optimise-images.mjs`; `make-logo.mjs` (logo files + browser icons from `assets/this is final logo.png`); `compare-words.mjs <port>` and `compare-views.mjs`; `shots.mjs`, `shot-section.mjs`, `split.cjs` (screenshots). `.work/`, `/source`, `/assets`, `/clone-of-this-one` and `/yam-scaffold` are git-ignored; `data/` and `public/images` are committed.
- **Gotchas learned:** (1) when writing regexes through node heredocs the backslashes get lost, so use the Edit/Write tools for regex code; (2) the Next image cache can show stale pictures, so delete `.next` and restart; (3) an `overflow-hidden` ancestor breaks `position: sticky`; (4) the old pages' CSS hides some words from `innerText` (uppercase transforms, stacked spans), so structured extraction records both HTML and text.

## Decisions already made (do not re-ask)

13 city pages only (no suburb pages); 104 industry pages kept; no accountant login or footer link (hidden `/accountant-demo-x7k2`, noindex, no password); organic leads go to the postcode owner via GHL, Google Ads leads go to the accountant who paid (no fallback); no consent tick-box; confirmation SMS/email is handled in GHL; no reference site for design; no language switcher; phone wording wins where the old phone and desktop wording differed; `/privacy` gets its own title and canonical; the old `/ghl-redirect` becomes `/questionnaire` with a permanent redirect; admin pages are not rebuilt; Google Ads landing pages and the ads questionnaire (4 ad types, subdomains) come after the main build.

## What needs to be done next

**Waiting on the user:** review Stage 2 and say "go Stage 3". Open items: where to use `assets/comparison table.png` (its new wording needs approval); Australian photos for the 21 placeholder stock images; the Google Ads conversion ID/label (later); the GHL webhook URL, secret and calendar URL, plus Vercel and Upstash accounts (Stages 5–7).

**Stage 3 — all pages (next).** Widen `SAMPLE_PATHS` to every page in `data/extracted/page-types.json` (13 cities, 104 industry pages using their city picture, 18 services, 14 guides, 16 articles, hubs, about/contact/how-it-works/privacy/terms). Keep exact URLs, titles, meta descriptions, canonicals and robots tags. Add permanent redirects (12 retired locations and their industry URLs from the old `vercel.json`; `/ghl-redirect` to `/questionnaire`) and make the admin URLs return not-found. Generate `sitemap.xml` and `robots.txt` from the page list (the hidden demo page is excluded and not listed in robots.txt). Build the site-wide search from real page content (old header search with the "/" shortcut; this also restores the "Search for something else" button). Write `docs/seo-check.md` (old URL, new URL, title/meta/headings/body match) and fix any word differences. Run `npm run build`, commit and push, then report how many pages match exactly, any that do not, and which picture each location page uses.

**Stage 4 — questionnaire.** Rebuild the old questionnaire (the `MATCH_CATEGORIES` flow: category picker, per-category pages, summary, contact) mobile-first, with wording and step order unchanged, at `/questionnaire` (noindex). `NEXT_PUBLIC_QUESTIONNAIRE_URL` is the single address. Add the hero postcode box (`?postcode=`), carry `utm_*`, `gclid` and `?ref=`, add spam protection and a temporary `/api/lead`. Remove all old in-browser matching.

**Stage 5 — matching connection.** `/api/lead` to the GHL inbound webhook (with lead source Organic/Paid); `/api/match-result` (secret header) to Upstash Redis for 24 hours; the `/match/[leadId]` polling screen (every 2 seconds for up to 30, friendly fallback, neutral wording, noindex); `MOCK_GHL=true`; `docs/ghl-fields.md`; test the organic and paid journeys in mock mode.

**Stage 6 — hidden accountants page.** `/accountant-demo-x7k2` with the exact heading, text, "Content coming soon" placeholder and the GHL calendar embed (`NEXT_PUBLIC_GHL_DEMO_CALENDAR_URL`); noindex plus `X-Robots-Tag`; no menu, sitemap or robots.txt entry; no login.

**Stage 7 — finish and go live.** JSON-LD (Organization, WebSite, Service on city/industry pages, FAQPage where FAQs exist, BreadcrumbList; never LocalBusiness for accountants), `/llms.txt`, `docs/ghl-setup.md` (plain English), the final checks above, Lighthouse mobile 95+, and a Vercel go-live walkthrough with environment variables. After the main build: Google Ads landing pages and the ads questionnaire on subdomains.

**Open risks to keep in view:** word-for-word SEO fidelity across 100+ templated pages (run the word-check script on every page in Stage 3); hover effects, scroll reveal and the banner motion have not been seen in motion (screenshots only); no real-device phone test yet; the stock photos are not all Australian-looking.

## OWNER UPDATE (3 Oct 2026): homepage conversion direction and AI search

This section is a standing project requirement. Read and follow it in every session, together with the rest of this file. It is the owner's latest direction where earlier wording or design notes conflict.

### Homepage design and conversion

- This visual direction applies to the **homepage only**: make it warm, professional, personal, inviting, modern and polished.
- The primary audience is people seeking personal tax, business tax, sole-trader/company accounting or SMSF help, especially self-employed people and business owners.
- The primary action is completing the match-card questionnaire. Make the card and its next step prominent and easy to understand; the reason to use it is to skip directory browsing and be matched with a local partner accountant who understands the customer's needs.
- New homepage design blocks may be added, but do not change existing page wording. Do not apply this visual direction to other pages unless separately asked.

### Whole-site AI and traditional search

- Apply technical search improvements across the whole public site. Existing page wording, titles, descriptions, canonical intent, heading order and all existing `noindex` directives must remain unchanged; only add new content blocks or code.
- Public page content must be in server-delivered HTML; do not make important text depend on client-side JavaScript.
- Allow GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot and Applebot-Extended on public pages. Keep API, hidden, and noindex areas out of discovery feeds and blocked from crawling as directed.
- Keep `/llms.txt` concise and factual, describing the matching/referral service, audiences, services, service areas and important public pages.
- Use truthful Organization, WebSite, Service, BreadcrumbList and visible-content FAQPage structured data. The business is an accountant matching/referral service, not an accounting firm. Never expose a partner accountant's name or contact details on a public page.
- Add short Quick Answer blocks to existing service and city pages where useful. **Do not create suburb pages**; the approved location set remains the 13 cities above.
- Preserve any extracted reciprocal hreflang pairs, correct self-canonicals, and keep sitemap entries limited to public indexable pages.
- The current extracted metadata marks all 13 city pages `index, follow`; preserve those directives unless the owner explicitly asks to change them.
- A GitHub Actions workflow must notify IndexNow only after Vercel reports a successful Production deployment. The existing IndexNow key and root verification file are public; do not add them as secrets. Search Console/Bing account creation and sitemap submission still require the owner.
- Keep About, Contact, accountant-selection and matching-process information discoverable through existing public pages. Never invent missing business contact information.

## QUESTIONNAIRE PURPOSE (owner, 3 Oct 2026)
The whole purpose of the website is to get visitors to complete the questionnaire and be matched. Every questionnaire page must look like the rest of the site and encourage the visitor to finish. Follow `docs/questionnaire-design.md` for any questionnaire page, including the summary and contact pages built in Stage 4.
**Ad landing pages (owner, 5 Oct 2026):** every new Google Ads landing page and questionnaire is built the same way as Ad 1 (business, `/ad-1`), following `docs/ad-pages.md`. The shared match page every questionnaire finishes on is `/match` (owner, 6 Oct 2026). Ad landing pages are `/ad-1` to `/ad-4` only.
**Ad match boxes (owner, 5 Oct 2026):** every ad landing page's match box uses the HOME PAGE match box style and size (navy heading panel with eyebrow, two-line title, green rule, line under it and the map; open rows with dividers, coloured icon squares, title + short line, round tick circles; green Start button; dotted note; mint band at the bottom), even where the owner's design picture draws the box differently. Only the wording, rows and icons change per ad (see `docs/ad-pages.md`).
**Name rule (owner, 5 Oct 2026):** every questionnaire asks for the visitor's name straight after the service selection, and every later question box is personalised with their first name (e.g. "John, could I please have your mobile number so…").

## SEO & AI-SEARCH RULES (owner-supplied, merged 3 Oct 2026; where they differ from older notes, this section and the dated owner updates win)
- **Markup first.** SEO work is markup, metadata, structure and performance. Wording changes are allowed only as set out in the 2 Oct owner update; log each change in `docs/seo-copy-log.md`.
- **Static HTML.** Every page has all text, headings and links in the page source with JavaScript disabled (AI crawlers mostly don't run JS).
- **URLs.** Keep existing URLs; any changed URL gets a permanent (301/308) redirect, listed in `docs/plan.md`.
- **One indexing file: `seo/index-status.json`** (page path -> "index" | "noindex"). Sitemap, robots tags and `seo-check` all read it. `npm run seo-status` adds new pages and keeps your edits. Always noindex: questionnaire, match pages, `/accountant-demo-x7k2`, test and thank-you pages. noindex pages use `noindex, follow` and stay out of the sitemap. `/api` and `/match` are also blocked in robots.txt (owner direction); the hidden demo page is never listed in robots.txt.
- **City pages stay `index`** (owner, 3 Oct). There are NO suburb pages, so no suburb links or suburb breadcrumbs.
- **Every page:** unique title (<= 60) and description (<= 155); exactly one H1 with H2/H3 in order; self-referencing absolute canonical; `lang="en-AU"`; Open Graph and Twitter tags; BreadcrumbList; descriptive link text (never "click here"); images with alt text, width/height, WebP, lazy-load below the fold.
- **Structured data (visible content only):** Organization + WebSite on all pages; Service with areaServed on city/industry/service pages; FAQPage only where FAQs exist. Never LocalBusiness for accountants.
- **hreflang:** keep only reciprocal pairs that exist in the old extraction (there are none today); no language auto-redirect.
- **Site files:** `sitemap.xml` from `seo/index-status.json` ("index" only) with lastmod; `robots.txt` allows all and names Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended; `llms.txt`; a custom 404 linking to home and the main city pages.
- **Performance (mobile):** LCP < 2.5s, CLS < 0.1, INP < 200ms, Lighthouse SEO and Performance 90+; minimal JavaScript; self-hosted fonts.
- **Trust and consistency:** the same business name (and phone, email, ABN only once the owner supplies real ones; never invent them) in every footer; About and Contact linked from the footer.
- **Stage gate:** at the end of every stage run `npm run build`, start the site (`npx next start -p 3300`) and run `npm run seo-check`. Fix every failure that needs no wording change, log the rest in `docs/seo-report.md`, and report in plain English. A stage is not finished until it passes.

## "FADE BEHIND WORDS" (owner rule, 5 Oct 2026)
When the owner says **"fade behind words"**, it always means the soft white cloud fade used behind the home page's three
trust points ("Local accountants in your area · Matched to your exact needs · Free and no obligation"). It is the
reusable class `fade-behind` in `src/app/globals.css`: add `fade-behind` to the element holding the words (the element must
be `position: relative` or `absolute`); set `--fade-inset` only if the cloud needs to reach further or less far (default
3rem above/below, 12% each side). Make sure nearby words stay in front of it and are not washed out: where several fades sit close together, put them in
one shared layer under all the words (`isolation: auto` on those elements, as `.bz-grid` does on the business page);
keep a fade off words or picture details it must not touch with `--fade-inset` or a mask, and check it pixel by pixel
(`node scripts/fade-check.mjs`). Used on the business ad page behind the line under the headline, the three steps and the
handwriting (the handwriting's fade stops at the bottom of the words so the photo's green arrow is never lightened).
