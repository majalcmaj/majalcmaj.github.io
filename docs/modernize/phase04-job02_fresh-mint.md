<!-- plan-status: pending -->
# phase04 · Job 02 — fresh-mint

> **Status:** ⬜ PENDING

Read `docs/modernize/prompt.md` and `docs/modernize/phase04_visual-refresh.md` first. This job runs
in its **own git worktree** and produces a **complete alternative design** of the whole site. It is
**not** merged with the other two jobs — it competes with them; the user picks one (see the phase
file's deviation note).

## Direction — "Fresh Mint / Minimal"
Modern, light, spa-like. Maximum whitespace, thin hairlines instead of boxes, restraint. The site
feels current and effortless.

Tokens (define as CSS custom properties):
```
--color-primary      #2FA98C   (mint)
--color-primary-dark #1F7D67
--color-accent       #BFE9DC   (pale mint wash)
--color-surface      #FFFFFF
--color-line         #E6ECEA   (hairline)
--color-text         #222A2E   (charcoal)
--color-text-muted   #5B6A6E
--font-sans          "Manrope", system-ui, sans-serif   (self-hosted variable)
--radius             4px       (minimal)
--space-1…6          4 / 8 / 16 / 32 / 56 / 96px   (airier scale)
```
Design language: pure-white surfaces, 1px hairline dividers (`--color-line`), big whitespace,
lightweight type with tight headings + airy body, mint used sparingly (links, underlines, small
accents — not big fills). Nav = minimal text links with an animated mint underline on
hover/`:focus-visible`, not solid buttons. Drop `#strip`; replace raster `title_img.png` with a
light text wordmark. Gallery = clean borderless grid with generous gap. Implants popup = minimal
white card.

## Goal
Whole site renders in the Fresh Mint language and passes the phase's shared gate.

## Red
On the phase branch (gate already added), run `npm test` in this worktree — it fails on stylelint
(old ad-hoc blues) + Lighthouse Accessibility (low-contrast text/footer). That red is this job's
starting point. Note: mint on white is light — verify link/accent contrast ≥ AA explicitly.

## Green
Rewrite `css/style.css` with the tokens above; update the 6 HTML pages + `popups/implants.html` as
needed (wordmark, hairline sections, classes). Self-host Manrope (variable `@font-face`,
`font-display: swap`, per-page `<link rel="preload">`). Verify every text/background pair ≥ WCAG AA
(esp. mint links — darken to `--color-primary-dark` for text if needed). Add `:focus-visible`
outlines. Run `npm test` until green on all pages.

## Refactor
Collapse `.text-content` / `.oferta` / `.godziny` / `.contact` into shared tokens; remove every old
color/font literal (`grep` clean). CSS ends with one token block + lean rules.

## Verify
`npm test` green; eyeball all pages at 375/768/1280px. Commit in this worktree, then
`scaffold.sh done modernize phase04-job02 <sha>`. Leave the worktree running on its own `serve` port
for the user's side-by-side comparison.

## Commit
`feat(visual): fresh-mint design — minimal hairlines, Manrope, whitespace`  <!-- in job worktree -->
