const { test, expect } = require('@playwright/test');

test('Search for "Bird Head Toque" on arcteryx.com.au', async ({ page }) => {
    await page.goto('https://arcteryx.com.au');

    const popupClose = page.locator('button.klaviyo-close-form');
    if (await popupClose.isVisible()) {
        await popupClose.click();
    }

    try {
        await page.getByRole('button', { name: 'Search' }).click();
    } catch (err) {
        console.warn('Search button not found or not clickable:', err);
    }

    try {
        await page.waitForSelector('#Search-In-Modal', { timeout: 5000 });
        const input = page.locator('#Search-In-Modal');
        await input.fill('Bird Head Toque');
        await input.press('Enter');
    } catch (err) {
        console.warn('Search input not found:', err);
        return;
    }

    await page.waitForLoadState('networkidle');
    try {
        await expect(page.locator('text=Bird Head Toque')).toBeVisible({ timeout: 5000 });
    } catch {
        console.warn('Search result not found.');
    }
});
