<!-- plan-status: pending -->
# phase04 · Job 01 — clinical-calm

> **Status:** ⬜ PENDING

Read `docs/modernize/prompt.md` and `docs/modernize/phase04_visual-refresh.md` first. This job runs
in its **own git worktree** and produces a **complete alternative design** of the whole site. It is
**not** merged with the other two jobs — it competes with them; the user picks one (see the phase
file's deviation note).

## Direction — "Clinical Calm"
The classic trusted-dental look: hygienic, friendly, approachable. Lots of white, soft rounded
cards, gentle shadows, calm teal.

Tokens (define as CSS custom properties):
```
--color-primary      #0E7C86   (teal)
--color-primary-dark #0A5C63
--color-accent       #4FB3BF
--color-surface      #FFFFFF
--color-surface-alt  #F4F8F9   (cool off-white for cards/sections)
--color-text         #1F2D33   (slate)
--color-text-muted   #4A5A62
--font-sans          "Inter", system-ui, sans-serif   (self-hosted variable)
--radius             12px
--shadow             0 2px 12px rgba(15,124,134,.10)
--space-1…6          4 / 8 / 16 / 24 / 40 / 64px
```
Design language: rounded cards on `--color-surface-alt`, soft shadows, teal nav with white text and
clear `:focus-visible` ring, generous line-height, no harsh borders. Replace the decorative `#strip`
+ raster `title_img.png` with a clean text wordmark (full HTML freedom granted this phase). Header
becomes a calm white/teal band with the logo. Gallery = rounded image cards. Implants popup restyled
to match.

## Goal
Whole site renders in the Clinical Calm language and passes the phase's shared gate.

## Red
On the phase branch (gate already added), run `npm test` in this worktree — it fails on stylelint
(old ad-hoc blues) + Lighthouse Accessibility (low-contrast text/footer). That red is this job's
starting point.

## Green
Rewrite `css/style.css` with the tokens above; update the 6 HTML pages + `popups/implants.html` as
needed (wordmark, card wrappers, classes). Self-host Inter (variable `@font-face`, `font-display:
swap`, per-page `<link rel="preload">`). Verify every text/background pair ≥ WCAG AA. Add
`:focus-visible` outlines. Run `npm test` until green on all pages.

## Refactor
Collapse `.text-content` / `.oferta` / `.godziny` / `.contact` into shared tokens; remove every old
color/font literal (`grep` clean). CSS ends with one token block + lean rules.

## Verify
`npm test` green; eyeball all pages at 375/768/1280px. Commit in this worktree, then
`scaffold.sh done modernize phase04-job01 <sha>`. Leave the worktree running on its own `serve` port
for the user's side-by-side comparison.

## Commit
`feat(visual): clinical-calm design — teal palette, Inter, rounded cards`  <!-- in job worktree -->
