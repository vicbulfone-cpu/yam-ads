# Image credits

Every picture on the site is listed here. Nothing is taken from the old site or from any other company's website.

## Supplied by the site owner (in `/assets`, optimised copies in `public/images`)

| Files | What | Notes |
|---|---|---|
| `public/images/brand/logo-1000.webp`, `logo-680.webp`, `logo-340.webp`; `src/app/icon.png`, `apple-icon.png`, `favicon.ico` | Your Accountant Match logo (header, footer) and the leaf mark used as the browser-tab / home-screen icon | From `assets/this is final logo.png` by `scripts/make-logo.mjs`. The artwork is unchanged; only its white background is made transparent so no faint box shows on tinted areas |
| `public/images/brand/hero-1916.webp`, `hero-960.webp` | Home page hero artwork (couple on a sofa, "A better way to find an accountant", Local / Vetted / Matched to you) | From `hero pic.png`; the cropped `ffb62a59-….png` version is not used yet |
| `public/images/cities/<city>-1600.webp`, `-800.webp` (13 cities) | One landmark panorama per city page | From the 13 city pictures. Used as a faded backdrop behind each city page's hero, and by that city's industry pages |
| Not yet used | `comparison table.png`, `words table.txt` | The comparison table design (planned for a later stage) |

## Stock photographs (`public/images/stock`) — Pexels

All 32 are free for commercial use without mandatory attribution under the [Pexels License](https://www.pexels.com/license/).
The full table (file, photographer, source page) is in [`image-credits-stock.md`](image-credits-stock.md), and the data is in
`data/stock-images.json`. Two credits were spot-checked against the Pexels pages by hand and matched.

**Australian check:** 11 of the 32 photos are confirmed Australian (the Pexels page states an Australian location, or the scene is clearly Australian): industry-agriculture, industry-real-estate, industry-retail, industry-transport, industry-professional, general-woman-professional, general-phone-call, general-city-office-view, topic-investing, topic-business-structures, topic-new-business. The other 21 are indoor people shots or desk flat-lays that could not be confirmed as Australian (two search passes found no Australian-located versions on Pexels; Unsplash could not be searched from the build environment). `data/stock-images.json` records `australian: true/false` and the evidence for each.

Replace these 21 with your own photos when you have them (drop them in `assets/photos/`). Other weak spots: `topic-investing` and `topic-business-structures` are Sydney skylines (loose fits for their topics); `industry-agriculture` shows sheep and paddock with no farmer; `industry-professional` shows the man from behind.

## Illustrations and icons

Icons are drawn as small inline SVGs in `src/components/ui/Icons.tsx` (original, no icon library).

## Home page photos supplied by the owner (4 Oct 2026)
Source: owner-supplied files in `hero section/` (owner's own images, supplied for use on this site), converted to WebP by `scripts/make-home-assets.mjs` into `public/images/home/`:
tradie-van, woman-laptop-home, woman-laptop-office, couple-laptop, house-front, client-meeting, city-desk-laptop, cafe-owner-man, cafe-owner-woman, rural-couple-portrait, rural-couple-fence, retirees-coast, family-walk, couple-house, team-meeting, market-team, family-table, coast, accountant-client-desk; icons in `public/images/home/icons/`.

## Home page FAQ icons supplied by the owner (6 Oct 2026)
Source: owner-supplied files in `hero section/8 icons faq/` (owner's own images, supplied for use on this site), copied unchanged
(96 × 96 PNG) to `public/images/home/faq/`: 01-clock-contact-time, 02-shield-qualified-accountants, 03-coins-matching-cost,
04-document-accounting-services, 05-phone-online-service, 06-gear-matching-process, 07-people-accountant-fit, 08-pin-regional-coverage.
09-clipboard-your-details was drawn for this site (original artwork, no third-party source) to match the owner's set.

## Data

- `public/data/au-postcodes.txt` (postcode and suburb suggestions in the business questionnaire): GeoNames Australian postal codes, https://download.geonames.org/export/zip/ — Creative Commons Attribution 4.0 (commercial use allowed with credit; credit shown under the postcode box).
