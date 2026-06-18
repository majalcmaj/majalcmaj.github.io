<!-- plan-status: done; commit=d6dd2b99048590459a28790b44b5f64c6af7bf2f; date=2026-06-18 -->
# phase04 · Job 03 — warm-sand

> **Status:** ✅ DONE — d6dd2b99048590459a28790b44b5f64c6af7bf2f (2026-06-18)

Read `docs/modernize/prompt.md` and `docs/modernize/phase04_visual-refresh.md` first. This job runs
in its **own git worktree** and produces a **complete alternative design** of the whole site. It is
**not** merged with the other two jobs — it competes with them; the user picks one (see the phase
file's deviation note).

## Direction — "Warm Sand"
Warm and reassuring rather than cold-clinical. A calm, human, premium-comfort practice. Still clean
and white, but warm-toned with soft sage + a touch of gold for elegance.

Tokens (define as CSS custom properties):
```
--color-primary      #5E7C6B   (sage)
--color-primary-dark #44604F
--color-accent       #C7A867   (muted gold — sparing, for elegance)
--color-surface      #FBF8F3   (warm off-white base)
--color-surface-alt  #FFFFFF   (cards lift off the warm base)
--color-text         #2C2A26
--color-text-muted   #5A554C
--font-serif         "Source Serif 4", Georgia, serif   (self-hosted variable — headings)
--font-sans          "Inter", system-ui, sans-serif     (self-hosted variable — body)
--radius             8px
--shadow             0 4px 18px rgba(44,42,38,.08)
--space-1…6          4 / 8 / 16 / 24 / 40 / 64px
```
Design language: warm off-white page, white cards lifting off it with soft shadow, serif headings
for an established/elegant tone paired with clean sans body, gold used only as a thin accent (rules,
underlines, small marks). Nav = warm sage with white text + clear `:focus-visible` ring. Replace
`#strip` + raster `title_img.png` with a serif text wordmark. Gallery = warm cards. Implants popup
matched.

## Goal
Whole site renders in the Warm Sand language and passes the phase's shared gate.

## Red
On the phase branch (gate already added), run `npm test` in this worktree — it fails on stylelint
(old ad-hoc blues) + Lighthouse Accessibility (low-contrast text/footer). That red is this job's
starting point. Note: gold on white fails AA for text — keep gold for non-text accents only, or
darken; verify every pair.

## Green
Rewrite `css/style.css` with the tokens above; update the 6 HTML pages + `popups/implants.html` as
needed (serif wordmark, card wrappers, classes). Self-host Source Serif 4 + Inter (variable
`@font-face`, `font-display: swap`, per-page `<link rel="preload">`). Verify every text/background
pair ≥ WCAG AA. Add `:focus-visible` outlines. Run `npm test` until green on all pages.

## Refactor
Collapse `.text-content` / `.oferta` / `.godziny` / `.contact` into shared tokens; remove every old
color/font literal (`grep` clean). CSS ends with one token block + lean rules.

## Verify
`npm test` green; eyeball all pages at 375/768/1280px. Commit in this worktree, then
`scaffold.sh done modernize phase04-job03 <sha>`. Leave the worktree running on its own `serve` port
for the user's side-by-side comparison.

## Commit
`feat(visual): warm-sand design — sage/gold palette, serif headings`  <!-- in job worktree -->
