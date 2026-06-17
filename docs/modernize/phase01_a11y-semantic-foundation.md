<!-- plan-status: pending -->
# Phase 01 — a11y-semantic-foundation

> **Status:** ⬜ PENDING

Read `docs/modernize/prompt.md` first.

## Goal
Every page has a valid semantic/landmark structure (`lang`, `<header>/<nav>/<main>/<footer>`,
correct heading order, descriptive `alt` text, a unique `<title>`/meta description, a skip-link,
and an accessible implants popup modal) — provable by a zero-violation html-validate + axe-core scan.

## Red
Add `package.json` with devDeps `html-validate`, `playwright`, `@axe-core/playwright`, and a
static server (`serve`). Add `.html-validate.json` extending `html-validate:recommended` +
`html-validate:document` (catches missing `lang`, missing landmarks, bad heading order, alt-text
rules). Add `tests/a11y.spec.js`: Playwright launches each of the 6 pages against a local static
server and runs `@axe-core/playwright` (`AxeBuilder`), asserting `violations.length === 0`.
Add npm scripts `test:html` (`html-validate "**/*.html"`) and `test:a11y` (`playwright test
tests/a11y.spec.js`); `test` runs both.
Run `npm test` now — it fails: missing `<html lang>`, missing landmark elements, `alt="obrazek"`
flagged as non-descriptive, no `<meta name="description">`, duplicate `<title>Stomatologia
Ciesielscy</title>` on every page, and the implants popup (`popups/implants.html`, opened via
Magnific Popup in `scripts/popups.js`) has no `role="dialog"`/`aria-modal`/focus trap — axe flags it.

## Green
Across `index.html`, `godziny.html`, `oferta.html`, `galeria.html`, `kontakt.html`:
- Add `<html lang="pl">`.
- Replace the `#head_container` div soup with `<header>` wrapping a `<nav aria-label="Główna
  nawigacja">` (the existing `.navigation_bar_list`), and wrap `#content_container` in `<main>`;
  `#footer` becomes `<footer>`.
- Add a visually-hidden skip link (`<a class="skip-link" href="#main-content">Przejdź do
  treści</a>`) as the first body child, target `id="main-content"` on `<main>`.
- Give each page a unique, descriptive `<title>` (e.g. "Godziny przyjęć — Stomatologia
  Ciesielscy") and a unique `<meta name="description">` summarizing that page.
- Replace every `alt="obrazek"`/`alt="logo"`/`alt="kamienica"` with real descriptions — for the
  gallery, reuse the existing `title` attribute text (it's already descriptive) as the `alt` text.
- Fix heading order where `oferta.html` jumps straight to `<p class="text-content">` instead of a
  heading — promote the section labels ("Leczenie zachowawcze", "Protetyka", etc.) to `<h3>`.
- In `popups/implants.html`, add `role="dialog" aria-modal="true" aria-label="Oferta implantów"`
  on `.implants-popup-content`; in `scripts/popups.js`, on the popup's `open` callback, focus the
  dialog container, and rely on Magnific Popup's built-in Escape-to-close (already enabled by
  default) — verify it's not disabled anywhere.
Run `npm test` — all html-validate + axe checks pass.

## Refactor
Remove now-redundant wrapper divs left over from the old non-semantic structure (`#main_container`
can stay as the layout shell, but drop any div that has no styling/JS hook now that `<header>`,
`<main>`, `<footer>` carry the semantics). Delete the inline `style="position: relative; left:
10px"` / `right: -20px"` hacks in `galeria.html`'s gallery `<td>`s — they're presentational and
will be replaced by real layout in phase 2 anyway; leave a plain class hook instead. Confirm no
page still has the old generic alt text or missing description by re-running `test:html`.

## Verify
`npm test` (html-validate + axe) — 0 errors/violations across all 6 pages. Manually open each
page and confirm the skip-link is keyboard-reachable (Tab from page load) and the implants popup
is dismissible via Escape and click-outside.

## Commit
`feat(a11y): add semantic landmarks, alt text, meta descriptions, and modal a11y fixes`
