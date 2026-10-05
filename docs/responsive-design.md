# Responsive design (mobile-first)

Most visitors use phones, so every page is designed at phone width first and then enhanced for larger screens.
Everything below describes what is actually built in `src/` (tokens in `src/app/globals.css`, pictures and navigation in
`src/config/site.config.ts`).

## Breakpoints and tokens

| Name | Width | Tailwind prefix | Notes |
|---|---|---|---|
| Mobile | 320–480px (designed at 375px) | none | Base styles. Also covers larger phones up to 639px |
| Large phone / small tablet | 640px+ | `sm:` | Two-column card grids start |
| Tablet | 768–1279px | `md:` / `lg:` | Header CTA button, 2–3 column grids, bigger type, menu sheet |
| Desktop | 1280px+ | `xl:` | Inline navigation, hover effects, side-by-side hero (hover effects and the side-by-side hero start at 1024px) |
| Wide desktop | 1440px+ / 1600px+ | `min-[1440px]:` / `min-[1600px]:` | Adds "About" at 1440px and "How We Select Accountants" at 1600px to the header |

| Token | Phone | Tablet (768) | Desktop (1280) |
|---|---|---|---|
| Page gutter (`--gutter`) | 16px | 24px | 32px |
| Section spacing (`--section-y`) | 56px | 80px | 112px |
| Header height (`--header-h`) | 76px | 92px | 96px |
| Max content width | 100% | 100% | 1240px (centred) |
| Card radius | 20px | 20px | 20px (large panels 28–32px) |
| Heading sizes (fluid) | H1 36–44px · H2 28–34px · card 18px | H1 ≈ 52px · H2 ≈ 38px | H1 68px · H2 48px · card 22px |
| Body text | 16px / 1.7 | 16px | 16–17px (lead paragraph 17–20px) |
| Minimum touch target | 48px high | 48px | 44–48px |
| Brand colours | navy `#073265` · green `#00ae41` (buttons use deeper green `#00873a` so white text passes contrast) | | |

## 1. Mobile (320–480px)

**Content priority order (home page):** compact headline (about 3 lines) → **hero picture** → **the match card** (four category tiles + the start button) → first paragraph and trust points (Free / Vetted / No obligation) → remaining intro paragraphs → what is
Your Accountant Match → how it works (3 step cards) → the difference → who we help → specialist network → trust and vetting → guides → articles → FAQ → call-to-action → footer.

**Thumb-zone placement:** the main call-to-action is a full-width bar fixed to the bottom of the screen
(`StickyCta`, 56px high, 12px margin, respects the phone's safe area). The header logo is 240px wide on phones so it fits beside the menu button, so it is always one tap away. The match card
tiles are 88px-high full-width buttons directly under the intro.

**Collapsed / hidden:**
- The desktop navigation is hidden; a menu button (48 x 48px) opens a full-screen sheet below the header with 56px-high links and the main button.
- FAQ answers are collapsed (native `<details>`); the answers stay in the page for search engines.
- The header "Find My Accountant" button is hidden below 640px (the bottom bar does that job).
- Picture reveal on hover does not exist on touch screens, so pictures are **shown by default** (top strip on cards, small thumbnail on link tiles).
- Nothing that carries page words is deleted on phones — text is only reflowed or collapsed.

**Reflows / stacks:** every grid becomes a single column (cards 100% width, 20px gap); the two-column checklists stack;
the "difference" panel is 1 column; step cards stack with the large step number as a watermark.

## 2. Tablet (768–1024px)

- **Expands:** card grids go to 2 columns (3 for six-item grids); the header gains the "Find My Accountant" button next to the menu button; section spacing grows to 80px; headings step up.
- **Navigation:** still the full-screen menu sheet (the inline menu would be cramped), now with the header button visible.
- **Hero:** the match card stays under the headline in one column, centred within a 720px content width; the hero picture is full width.
- **Bottom call-to-action bar** is removed at 768px (the header button replaces it).
- Two-column checklists switch on at 768px.

## 3. Desktop (1280px+)

- **Header:** the logo (304px wide) with inline navigation (Locations · Guides · Blog · How It Works at 1280px; "About" joins at 1440px and "How We Select Accountants" at 1600px) and the main button, 96px high, sticky with a blurred background. Below 1280px the menu sheet is used because the logo plus links need that much room.
- **Locations menu:** hovering or keyboard-focusing "Locations" opens a 640px panel listing all 13 cities (no JavaScript).
- **Hero sections and match cards:** every public content page uses the same homepage match card and service choices. The customer can check any combination of the four service options; their selections are carried as repeated `category` query parameters to the questionnaire for the upcoming questionnaire build. The prompt is centered in the same Jakarta Sans family as the home H1, set in a brand-blue gradient on a soft blue panel with a navy-to-green accent bar and a solid green underline under the whole word "match"; the "Start My Match" button has an extra 3mm of space above it. In the desktop header the four navigation pills sit 2cm to the left of the CTA, 19px apart (8px + 3mm); the "Skip directories" benefit callout appears consistently. At desktop widths, the compressed card sticks below the header while the hero is in view. The green wash behind the upper-right match card is deliberately subtle. A blue/green circular Return to Top button appears on desktop after scrolling halfway down a page and disappears again at the top. The home and city hero pictures use the same softly rounded frame. Their H1s use brand navy for non-highlighted words and green for highlighted words; no H1 text is black. The home hero cycles through hero images 1–10, holding each for 25 seconds with a gentle 0.9-second crossfade; it pauses on hover/focus and stays still when reduced motion is preferred. The first image is server-rendered with high fetch priority, while the rest are lazy-loaded and hidden until needed; a fixed aspect ratio prevents layout shift. The home hero keeps its two-column layout: left picture, headline, intro and trust points; right sticky match card. The page code still starts with the headline and intro (only the on-screen order changes), which keeps search engines reading the headline first. On city pages the breadcrumbs sit 1cm closer to the header (desktop top padding 40px − 1cm ≈ 2px; phones 4px), and the H1, picture and match card move up with them. All styling lives in the shared templates and the single `src/app/globals.css`; no page has its own stylesheet.
- **Other pages' hero:** two columns (headline and text left, match card right, 1.05fr / 1fr). The match card stays 4 tiles in a 2 x 2 grid.
- **Cards:** 3–4 column grids; hovering lifts a card 8px with a deeper shadow, and a picture fades in behind it (see below).
- **Sidebar options:** pages are single-column editorial layouts (max 1240px) — no sidebars were needed; the how-we-select timeline uses the full width instead.
- **Hover states:** buttons rise 2px and their arrow slides 3px; link tiles lift and reveal their picture; checklist rows lift; the menu items tint green.
- Scroll motion (headings and cards fade up) uses CSS only and is switched off for visitors who prefer reduced motion.

## What reflows, stacks or disappears (summary)

| Element | Phone | Tablet | Desktop |
|---|---|---|---|
| Navigation | Menu sheet | Menu sheet + header button | Inline links + city menu |
| Main call-to-action | Fixed bottom bar | Header button | Header button |
| Hero | 1 column, card under intro | 1 column | 2 columns |
| Card grids | 1 column | 2–3 columns | 3–4 columns |
| Card pictures | Always visible (top strip) | Always visible | Revealed on hover (full-bleed) |
| Checklists | 1 column | 2 columns | 2 columns |
| FAQ | Collapsed list | Collapsed list | Collapsed list (max 768px wide) |
| Timeline (how we select) | Single column, line on the left | Single column | Alternating left/right around a centre line |
| Rolling picture banner | 160px-high pictures | 208px | 208px, 320px wide |

## Three components designed differently per breakpoint (not just resized)

1. **Navigation** — phones/tablets: full-screen sheet with big tap targets and a bottom-anchored main button. Desktop: inline links plus a hover/focus city menu with pins. They are separate layouts, not one squeezed.
2. **Feature cards and link tiles** — phones/tablets: the picture is part of the card (strip on top / thumbnail) because there is no hover. Desktop: the card is text-only at rest; on hover (or keyboard focus) the picture fills the whole card behind white text.
3. **"How we select accountants" timeline** — phones: a single column with a vertical rail on the left and the number badge on the rail. Desktop: cards alternate left and right of a centre rail; the green progress line grows as you scroll.
   (The home hero also differs: stacked and thumb-friendly on phones, side-by-side with a floating match card on desktop.)

## One navigation pattern that works across all breakpoints

A single list of links (`navItems` in `src/config/site.config.ts`) feeds both the menu sheet and the inline navigation, with
the same labels in the same order, plus the same main button. The logo always links home, the footer repeats the
page links and lists all 13 cities, and every page has breadcrumbs under the header (Home / Locations / Sydney).

## Checks run

Every sample page was loaded at 375px, 768px and 1280px: all returned successfully, with **no sideways scrolling**
(checked by script) and no errors. Screenshots were reviewed by eye for the home page, the Sydney page and the
how-we-select page at phone and desktop widths.

## Questionnaire popup (`QuestionnaireModal.tsx`, styles `.q-modal*` in globals.css)

| Breakpoint | Size | Notes |
|---|---|---|
| Mobile 320�767px | `100vw - 1rem` � `100dvh - 1rem`, radius 20px | Near full screen; options in one column; Back/Next bar pinned at the bottom (thumb zone, 48px Next button, 44px Back). |
| Tablet 768�1023px | `min(92vw, 60rem)` � `min(88dvh, 60rem)`, radius 28px | Options in two columns. |
| Desktop 1024px+ | `75vw` � `75vh` (min 36rem tall), radius 28px | 3/4-screen popup; compact progress header; match card at 33rem wide so each description stays on one line. |

- The service-choice step uses `height: fit-content`, so the popup hugs the match box instead of leaving empty space.
- Page behind: navy tint `rgba(4,26,54,.38)` + `backdrop-filter: blur(10px)`; page scroll is locked while open (`html.q-modal-open`).
- Layout: logo bar with a 44px round � button ? scrolling body ? pinned Back/Next bar. Entrance is a 0.32s fade/rise, off for reduced-motion users.
- Hidden checkboxes sit inside `relative` option boxes and the dialog uses `overflow: clip`, so ticking an option never scrolls the popup itself.

## Home hero picture order

The 10 home hero pictures rotate (25s each) in this order, so the same kind of picture never follows itself, including the loop back to the start: 1 couple ? 4 woman ? 3 man ? 2 couple ? 5 woman ? 6 couple (florists) ? 8 man ? 9 woman ? 7 older couple ? 10 woman. Set in `HOME_HERO_ORDER` in `src/config/site.config.ts`.
