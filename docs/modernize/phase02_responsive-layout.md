<!-- plan-status: pending -->
# Phase 02 — responsive-layout

> **Status:** ⬜ PENDING

Read `docs/modernize/prompt.md` first.

## Goal
The site renders without horizontal overflow or unreachable nav at mobile (375px), tablet (768px),
and desktop (1280px) widths, using fluid/responsive CSS instead of the current fixed 1000px layout.

## Red
Extend `tests/` with `responsive.spec.js`: for each of the 6 pages, Playwright sets viewport widths
375/768/1280, navigates, and asserts `document.documentElement.scrollWidth <=
document.documentElement.clientWidth` (no horizontal scroll) and that every `.navigation_bar_list
li a` is visible and has a tap target ≥24px. Add npm script `test:responsive`; wire into `test`.
Run it — fails now: `#main_container`/`#head_container` are hard-coded `width: 1000px` in
`css/style.css`, `#title_img`/`#obrazek_godziny` are absolutely positioned by pixel offsets, and
`galeria.html`'s gallery is a `<table>` with fixed `300px` columns — all overflow badly under 375px.

## Green
In `css/style.css`: replace `#main_container { width: 1000px }` with `max-width: 1000px; width:
100%;`. Replace `#head_container`'s fixed `width: 1000px; height: 230px` with fluid sizing
(`width: 100%`, `min-height` + `aspect-ratio` or flexible padding instead of a hard pixel height).
Turn `.navigation_bar_list` into a flex container that wraps/stacks under a `@media (max-width:
700px)` breakpoint instead of `float: left` fixed-`180px`-wide items. Make `#logo` and `#title_img`
flow with flexbox instead of `position: absolute` pixel offsets (these were already touched in
phase 1's refactor for the gallery hack — apply the same fix here for the header images).
Convert `galeria.html`'s `<table id="gallery_table">` into a semantic `<ul>` with `display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` — removing the fixed `300px` `<td>`
width and the inline position hacks removed in phase 1. Add `max-width: 100%; height: auto;` to
all content images (`.razem`, `#obrazek_godziny`, gallery thumbnails) and make the YouTube/Google
Maps iframes responsive (wrap in a `.video-wrapper { aspect-ratio: 16/9; }`, `width: 100%`).
Run `npm test` — `test:responsive` passes at all three widths, `test:html`/`test:a11y` still pass.

## Refactor
Audit `css/style.css` for now-dead fixed-pixel rules superseded by the fluid versions (e.g. any
leftover `width: 1000px`/`height: 230px`/absolute `top`/`right` declarations not removed above).
Consolidate the three breakpoint-specific nav rules into one `@media` block rather than scattering
them. Re-run `npm test` to confirm nothing regressed.

## Verify
`npm test` (adds `test:responsive` to the existing phase-1 gate) green at 375/768/1280px on all 6
pages. Manually resize a browser window across that range and confirm nav, gallery, and embeds
stay usable with no horizontal scrollbar.

## Commit
`feat(layout): make header, nav, gallery, and embeds fluid/responsive`
