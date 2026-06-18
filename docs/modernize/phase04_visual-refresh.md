<!-- plan-status: pending -->
# Phase 04 — visual-refresh (3 competing variants)

> **Status:** ⬜ PENDING

Read `docs/modernize/prompt.md` first.

## Goal
The site gets a modern, elegant, trust-building **medical** look — white, clean, calm — replacing
the default-sans-serif / clashing-navy-on-grey / magic-number layout. This phase produces **three
competing design variants in three isolated worktrees** and the user picks one. All three must pass
the same objective gate: Lighthouse Accessibility (contrast) ≥95 and SEO ≥95 per page, axe clean,
no responsive overflow at 375/768/1280, and a clean `stylelint-config-standard` run.

## ⚠️ Deviation from standard job semantics — READ THIS
Normal `/plan` jobs are **file-disjoint** and get **merged together**. These jobs are **NOT**.
They are three *alternative* designs of the **same** site (each freely rewrites `css/style.css`
and the 6 HTML pages), produced side by side so the user can compare and choose.

- Each job runs in its own worktree branch off the phase branch.
- **Do not merge the three job branches together.** After all three return, the user reviews the
  three running sites and picks **one**. Only the chosen branch is merged back; the other two are
  kept as branches (for reference) or discarded. The phase commit = the winning variant.
- Because they edit the same files, they could only ever run in parallel in *separate worktrees* —
  never inline on one tree.

## Red (shared gate — set up ONCE on the phase branch, before spawning jobs)
The objective bar every variant must clear. Establish it first so each job inherits it:

1. Add devDeps `stylelint` + `stylelint-config-standard`; add `.stylelintrc.json` extending it;
   add npm script `test:style` (`stylelint "css/**/*.css"`); wire `test:style` into `test`.
2. Extend `scripts/lighthouse-gate.mjs` to also run `onlyCategories: ['seo','accessibility']` and
   assert **Accessibility ≥0.95** per page (reuses phase-3 harness; SEO assertion stays).
3. Run `npm test` now — it **fails**: `stylelint` flags the inconsistent units/colors/duplicate
   selectors in `css/style.css` (four ad-hoc blues — `#000086` / `#2E6AF3` / `#444488` /
   `cornflowerblue` — with no shared scale), and Lighthouse Accessibility flags borderline
   contrast (`.text-content` `#444488` bold on `#eeeeee`; white-on-blue footer).

Commit this gate setup on the phase branch as its own commit so all three job worktrees branch
from a tree where `npm test` is red for *design* reasons.

## Green (the three variants — one per job)
Each job implements one full design and makes the shared gate **green**. See the job files:

| job | name | direction (palette · type · feel) |
|---|---|---|
| job01 | clinical-calm | Teal `#0E7C86` + cool white `#F4F8F9`, Inter, rounded cards, soft shadow — hygienic, approachable |
| job02 | fresh-mint | Mint `#2FA98C` on pure white, Manrope, hairlines + generous whitespace — minimal, airy, spa-like |
| job03 | warm-sand | Sage `#5E7C6B` + muted gold `#C7A867` on warm white `#FBF8F3`, Source Serif + Inter — warm, reassuring |

Shared constraints for every variant (do not regress earlier phases):
- Preserve all phase-3 SEO head tags (`canonical`, `og:*`, `robots`, the `Dentist` JSON-LD on
  index) — the Lighthouse SEO + essentials checks still run.
- Preserve phase-1 a11y: `lang`, landmarks (`header`/`nav`/`main`/`footer`), `.skip-link`,
  descriptive `alt`, `aria-label`s; add visible `:focus-visible` outlines on links/buttons.
- Preserve phase-2 responsiveness: no horizontal overflow at 375/768/1280; fluid header, nav,
  gallery grid, video/map embeds.
- Fonts **self-hosted** (variable font via `@font-face` + `font-display: swap` + per-page
  `<link rel="preload">`) — no third-party Google Fonts request (keeps the GDPR-iframe concern
  from worsening).
- Keep the build-free deploy model: flat HTML files, no SSG/bundler. jQuery + Magnific Popup stay.

## Refactor (within each variant)
Define design tokens as CSS custom properties (`--color-*`, `--font-*`, `--space-1…6`) at the top
of `css/style.css`; collapse the repeated typography rules (`.text-content`, `.oferta`, `.godziny`,
`.contact` each re-declare `font-family`/`color`) into those tokens — one source of truth per
token. `grep -n '#000086\|#2E6AF3\|#444488\|cornflowerblue' css/style.css` returns nothing.

## Verify
For each variant: `npm test` green on all pages (html-validate, axe, responsive, Lighthouse
SEO+a11y ≥95, stylelint). Manually view every page at 375/768/1280px. Then present all three to the
user (e.g. each on its own local `serve` port) for the **pick-one** decision.

## Commit
Per job, inside its worktree: `feat(visual): <variant-name> design — tokens, type, spacing`.
Phase commit (the chosen variant, on the phase branch):
`feat(visual): apply modern medical visual identity (variant: <chosen>)`
