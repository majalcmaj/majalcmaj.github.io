# modernize — plan

Versionable red/green/refactor plan. One phase doc per step + a `prompt.md` runner.

## How to run
`/plan execute phase1` (one phase at a time). See `prompt.md` for the ceremony and guardrails.

## Context

Static 6-file dental-office site (`index/godziny/oferta/galeria/kontakt.html` + `popups/implants.html`),
jQuery 3.4.1 + Magnific Popup, one shared `css/style.css`. No build step, no CI, no `package.json`.
Fixed 1000px layout, no semantic landmarks, no `lang`, no meta description, generic `alt="obrazek"`,
no media queries. Deployed as plain static files (no deploy config in repo) — that constraint is
preserved: **no SSG/build step is introduced**, pages stay flat HTML files shipped as-is.

## Why these steps (and why not bespoke)

- **html-validate + axe-core (via Playwright)** for phase 1 — industry-standard accessibility/HTML
  linting instead of hand-rolled checks. Both run as dev-only `npm` deps; nothing ships to prod.
- **Playwright** for phase 2's responsive assertions (real browser, real viewport, checks actual
  `scrollWidth` overflow) instead of guessing from CSS alone.
- **Lighthouse CLI** for phase 3's SEO score gate — the standard way to grade SEO objectively.
- **stylelint-config-standard** for phase 4 — proxies "not ugly/sloppy CSS" with an objective,
  industry-standard rule set, since "beautiful" itself isn't machine-checkable.
- **No SSG (11ty/Astro/etc.)** even though the 6 pages duplicate header/nav/footer markup:
  introducing a build step changes how the site is deployed, and nothing in the repo says how/where
  it's hosted today. Risk of breaking deploy outweighs the dedup win for 6 small files. Duplication
  across files is accepted here per "no abstraction beyond what's needed."
- **No jQuery/Magnific Popup removal**: out of scope — it works, replacing it is a rewrite, not a
  modernization step the task asked for.
- **No GDPR/cookie-consent work for the embedded YouTube/Google Maps iframes**: real gap, but a
  legal/compliance concern outside "modernise the design" — flagged here, not solved here.

## Verify command
`npm test` (added in phase 1) runs the full gate: html-validate + axe a11y scan + Playwright
responsive checks + stylelint. Lighthouse SEO/perf audits (phase 3/4) run via
`npm run test:lighthouse` against a local static server (`npx serve` or `python3 -m http.server`).

## Phases
| id | title |
|---|---|
| phase01 | a11y-semantic-foundation |
| phase02 | responsive-layout |
| phase03 | seo-essentials |
| phase04 | visual-refresh |
