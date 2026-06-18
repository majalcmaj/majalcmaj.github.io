const { test, expect } = require('@playwright/test');

const PAGES = ['index.html', 'godziny.html', 'oferta.html', 'galeria.html', 'kontakt.html'];
const WIDTHS = [375, 768, 1280];

for (const url of PAGES) {
  for (const width of WIDTHS) {
    test(`${url} has no horizontal overflow and reachable nav at ${width}px`, async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('implants-popup-seen', 'true'));
      await page.setViewportSize({ width, height: 800 });
      await page.goto(url);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);

      const links = page.locator('.navigation_bar_list li a');
      const count = await links.count();
      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        await expect(link).toBeVisible();
        const box = await link.boundingBox();
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    });
  }
}
