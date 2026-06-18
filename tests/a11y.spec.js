const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const PAGES = ['index.html', 'godziny.html', 'oferta.html', 'galeria.html', 'kontakt.html'];

// Embedded YouTube/Google Maps iframes are third-party pages we don't control;
// scan only our own host document.
function scan(page) {
  return new AxeBuilder({ page }).exclude('iframe').analyze();
}

for (const url of PAGES) {
  test(`${url} has no detectable a11y violations`, async ({ page }) => {
    // Suppress the implants popup so the base-page scan is deterministic;
    // the popup itself is covered by the dedicated test below.
    await page.addInitScript(() => localStorage.setItem('implants-popup-seen', 'true'));
    await page.goto(url);
    const results = await scan(page);
    expect(results.violations).toEqual([]);
  });
}

test('implants popup has no detectable a11y violations', async ({ page }) => {
  await page.goto('index.html');
  await page.waitForSelector('.implants-popup-content[role="dialog"]');
  const results = await scan(page);
  expect(results.violations).toEqual([]);
});
