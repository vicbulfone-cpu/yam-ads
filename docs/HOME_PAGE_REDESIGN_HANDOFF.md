# Home Page Redesign – Handoff for Next Session

## Status
- Article page template created at `src/app/articles/[slug]/page.tsx`
- Four articles ready: keeping-your-tax-records-organised, what-to-prepare-before-meeting-an-accountant, choosing-accounting-software-for-your-business, planning-ahead-for-tax-time
- Design reference: `C:\YAM v4\hero section\home page 1.png` and `home page 2.png`

## What Needs to Be Built (Next Session)

### Home Page Sections (in order, matching home page 1 & 2)
1. **Hero** – Keep unchanged (headline, picture, points, match card, reassurance lines)
2. **Introduction under hero** – Keep unchanged
3. **"What is Your Accountant Match?"** – Explanation text + 3 client photos (existing stock)
4. **"Your accountant match, made simple"** – 3-step numbered process (Tell us, We find, You get)
5. **"Why it matters"** – 4 benefit cards (More time, Save money, Less stress, Better outcomes) with icons
6. **"Matching accountants to every kind of client"** – 10 illustrated client cards (no links, illustrative only)
7. **CTA: "Ready to find your accountant?"** – Green button
8. **"The right expertise starts with the right match"** – All 17 services (linked to service pages, plain text, with checkmark icons)
9. **"Tax & Accounting Insights"** – 4 article cards with stock photos + "Explore all articles" + "Find My Accountant" CTA
10. **"Frequently Asked Questions"** – Keep current 8 FAQs with current wording
11. **"Connecting Australians with local accountants"** – Show 13 capital cities only (no regional centres) with location pins + "Regional Australia" plain text (no link)
12. **"One quick match. A year of better tax outcomes."** – Tagline
13. **CTA Section** – "Ready to find your accountant?" blue background
14. **Footer** – 13 cities + "Regional Australia" + existing footer content

### Removals
- Rolling photo strip (site-wide, not just home page)

### Design Notes
- Polished, premium look matching home page examples
- Responsive mobile-first
- All future pages will use this design language (but don't restyle other pages yet – home only)

### Article Pages
Four articles already have content (240–260 words each, fact-checked):
- `/articles/keeping-your-tax-records-organised`
- `/articles/what-to-prepare-before-meeting-an-accountant`
- `/articles/choosing-accounting-software-for-your-business`
- `/articles/planning-ahead-for-tax-time`

Each uses a stock photo and links back to home page articles section.

### Key Constraints
- Hero section: Do not touch
- Match card: Do not change
- Introduction under hero: Do not touch
- FAQ wording: Keep exactly as-is (only text changes if new content added)
- Footer: Add Regional Australia text, show 13 cities with links
- Services: All 17 linked to service pages

### Components to Create
- WhatIsYAM (explanation + photos)
- HowItWorks (3-step process)
- WhyItMatters (4 benefit cards)
- ClientTypes (10 illustrated cards)
- InsightsSection (4 article cards)
- CoverageSection (13 cities)
- ServicesList (all 17, linked)
- HomeCTA sections (2 CTAs as designed)

### CSS Needed
- New sections styling (cards, grid layouts, responsive breakpoints)
- Typography matching home page examples
- Spacing and colour tokens consistent with YAM brand
- Hover effects and interactions

## Next Session: Quick Start
1. Read home page 1 & 2 pictures to confirm layout
2. Create section components one by one
3. Update home page layout to include all sections
4. Add CSS for home design
5. Remove rolling photo strip
6. Update footer with 13 cities + "Regional Australia"
7. Test at 375px, 768px, 1280px
8. Build and verify
9. Commit and push

---

*All work done in this session: article page template created, build plan documented.*
*Ready for full home page redesign in focused follow-up session.*
