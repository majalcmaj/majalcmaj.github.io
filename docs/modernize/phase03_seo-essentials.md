<!-- plan-status: pending -->
# Phase 03 — seo-essentials

> **Status:** ⬜ PENDING

Read `docs/modernize/prompt.md` first.

## Goal
Each page scores ≥95 on Lighthouse's SEO category, with unique titles/descriptions, canonical
links, Open Graph tags, LocalBusiness/Dentist structured data, and a `robots.txt`/`sitemap.xml`.

## Red
Add devDep `lighthouse` + npm script `test:lighthouse`: serve the repo with `npx serve -p 4173`,
run `lighthouse http://localhost:4173/<page> --only-categories=seo --output=json` for each of the
6 pages via a small Node script (`scripts/lighthouse-gate.js`) that fails (non-zero exit) if any
page's SEO score < 0.95. Wire into `test`. Run it now — fails: no canonical link, no Open Graph
tags, no structured data, no `robots.txt`/`sitemap.xml` (404s), and Lighthouse's
"crawlable links"/"document has a valid hreflang" type checks ding the missing `lang` follow-ups.
(Titles/meta descriptions were already fixed in phase 1, so this isolates the *remaining* SEO gap.)

## Green
On all 6 pages' `<head>`: add `<link rel="canonical" href="https://.../<page>">` (use the
existing contact address's domain pattern — if no real domain is known, use a placeholder
`https://stomatologia-ciesielscy.pl/...` and flag it in the commit body for the user to swap),
Open Graph tags (`og:title`, `og:description`, `og:type=business.business`, `og:image` pointing at
`images/Logo.png` or a hero photo), and `<meta name="robots" content="index,follow">`.
Add a single JSON-LD `<script type="application/ld+json">` block (on `index.html`, or duplicated
where relevant) describing a `Dentist`/`LocalBusiness`: name, address (`ul. Kajki 2b, 11-100
Lidzbark Warmiński`), telephone (`+48 89 767 58 18`), and `openingHoursSpecification` built from
the hours already listed in `godziny.html`.
Add `robots.txt` (allow all, point to sitemap) and `sitemap.xml` listing the 6 public pages
(exclude `popups/implants.html` — it's a fragment, not a page).
Run `npm test` — `test:lighthouse` passes ≥95 SEO on every page.

## Refactor
Factor the repeated Open Graph/canonical/JSON-LD boilerplate that's now duplicated across 6 files
into the smallest reasonable form (e.g. keep it inline per the project's no-build-step constraint,
but make sure the shared business-info values — address/phone/hours — read identically everywhere
so there's no copy-paste drift; double check by `grep`-ing for the phone/address strings across
all pages). Remove the placeholder domain TODO from anywhere it leaked into visible content.

## Verify
`npm test` (full gate incl. `test:lighthouse`) green, SEO ≥95 on all 6 pages. Manually validate the
JSON-LD with Google's Rich Results Test format expectations (structure only, no live network
call required) and confirm `robots.txt`/`sitemap.xml` are reachable.

## Commit
`feat(seo): add canonical/OG tags, LocalBusiness structured data, robots.txt and sitemap`
