<!-- plan-status: pending -->
# Phase 04 — visual-refresh

> **Status:** ⬜ PENDING

Read `docs/modernize/prompt.md` first.

## Goal
The site has a modern visual identity (typography, color, spacing) that passes Lighthouse
Accessibility (contrast) ≥95 and a clean `stylelint-config-standard` run, replacing the current
default-sans-serif, navy-on-grey, magic-number layout.

## Red
Add devDep `stylelint` + `stylelint-config-standard`, a `.stylelintrc.json` extending it, and npm
script `test:style` (`stylelint "css/**/*.css"`); wire into `test`. Extend `scripts/lighthouse-
gate.js` to also assert Accessibility category ≥0.95 per page (reuses phase 3's harness).
Run `npm test` now — fails: `stylelint` flags the inconsistent units/colors/duplicate selectors in
`css/style.css` (e.g. `#000086`/`cornflowerblue`/`#2E6AF3`/`#444488` — four different blues with no
shared scale), and Lighthouse Accessibility flags borderline contrast on `.text-content` (`#444488`
bold on `#eeeeee`) and the white-on-`cornflowerblue` footer text.

## Green
Define a small set of CSS custom properties at the top of `css/style.css` (`--color-primary`,
`--color-primary-dark`, `--color-surface`, `--color-text`, `--font-sans`) replacing the four ad-hoc
blues with one WCAG-AA-passing palette (verify each text/background pair with a contrast check —
Lighthouse will confirm). Load a modern font: self-hosted variable font (e.g. Inter or similar)
via `@font-face` with `font-display: swap` in `css/style.css` plus a `<link rel="preload">` per
page — self-hosted, not a third-party Google Fonts request, to avoid adding an external call and
keep the GDPR-iframe issue noted in the README from getting worse. Rework spacing using a
consistent scale (`--space-1` … `--space-6`) instead of one-off `padding: 0 50px 50px 50px`-style
values. Restyle the nav, footer, gallery grid (from phase 2), and the implants popup to match the
new palette/typography — buttons/links get visible `:focus-visible` outlines (a11y carry-over from
phase 1). Run `npm test` — `test:style` clean, Lighthouse Accessibility ≥95 on all 6 pages.

## Refactor
Remove any color/font value left over from the old palette that `stylelint`'s
`color-no-duplicate-rules`-style checks or a manual `grep -n '#000086\|#2E6AF3\|#444488\|cornflowerblue'
css/style.css` still turns up. Collapse repeated typography rules (`.text-content`, `.oferta`,
`.godziny`, `.contact` currently re-declare `font-family`/`color` separately) into the shared custom
properties so there's one source of truth per design token.

## Verify
`npm test` (full gate: html-validate, axe, responsive, lighthouse SEO+a11y, stylelint) green on
all 6 pages. Manually view each page at 375/768/1280px and confirm the new typography/palette reads
as a cohesive, modern dental-office site, not the old default-sans-serif/clashing-blue look.

## Commit
`feat(visual): apply modern typography, color palette, and spacing scale`
