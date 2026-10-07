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
Source: owner-supplied files in `hero section/ad landing pages/` (01-clock … 09-clipboard; owner's own images,
supplied for use on this site). `scripts/faq-icons.mjs` makes their white background transparent, trims them and saves WebP to
`public/images/home/faq-icons/`: 01-clock, 02-shield, 03-coins, 04-document, 05-phone, 06-gears, 07-people,
08-location-pin, 09-clipboard. (They replace the earlier set from `hero section/icons faq/`.)

## Data

- `public/data/au-postcodes.txt` (postcode and suburb suggestions in the business questionnaire): GeoNames Australian postal codes, https://download.geonames.org/export/zip/ — Creative Commons Attribution 4.0 (commercial use allowed with credit; credit shown under the postcode box).

## Home page "How we select accountants" icons supplied by the owner (6 Oct 2026)
Source: owner-supplied files in `hero section/ad landing pages/` (01-identity-card … 07-customer-concerns; owner's own images,
supplied for use on this site, transparent background), converted to WebP in `public/images/home/select-icons/`.

## "Meet Your Accountant Match" tradie photo, tablets and desktops (owner, 7 Oct 2026)
Source: owner-supplied `hero section/ad landing pages/tradie.png` (owner's own image, supplied for use on this site), converted to
WebP (1532 × 1027, quality 80) as `public/images/home/tradie-ute-driveway.webp`. Shown from 768px up on the home page and
all ad pages; phones keep `tradie-drill-ute.webp`.

## "Meet Your Accountant Match" tradie picture, phones (owner, 7 Oct 2026)
Source: owner-supplied `hero section/ad landing pages/home page tradie.png` (owner's own image, with the handwriting and
the navy badge drawn in), converted to WebP (941 × 1672, quality 80) as `public/images/home/tradie-mobile.webp`. Shown
below 768px on the home page and all ad pages (the page's own note and badge are hidden there). `tradie-drill-ute.webp`
is no longer shown.

## Match page sample accountant photo (owner, 7 Oct 2026)
`public/images/home/accountant-portrait.webp`: a portrait crop (640 × 768) of the owner-supplied `accountant-client-desk`
photo (owner's own image, see "Home page photos supplied by the owner"). Used for the sample accountant "Daniel Harper"
on /match until GoHighLevel supplies the real accountant's photo.
- (later, 7 Oct 2026) The sample accountant's photo is now `public/images/home/accountant-portrait-2.webp`: a crop
  (480 × 576) of one person from the owner-supplied `team-meeting` photo (owner's own image). `accountant-portrait.webp`
  is no longer shown.

`public/images/home/step-1-woman-phone-sofa.webp` and `public/images/home/step-3-accountant-client-desk.webp`: owner-supplied photos (7 Oct 2026, `hero section/10.png` and `11.png`), used in step boxes 1 and 3 of the "How it works" steps (home page, ad pages, /how-it-works). The second has a thin white strip trimmed from its left edge. The older `woman-phone-sofa` and `accountant-client-desk` files stay (the latter is still used in the questionnaires).
