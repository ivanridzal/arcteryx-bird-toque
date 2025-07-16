const { test, expect } = require('@playwright/test');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmailNotification(subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    await transporter.sendMail({
        from: `"Arcteryx Head Toque Checker" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: subject,
        text: message
    });
}

test('Search for "Bird Head Toque" on arcteryx.com.au', async ({ page }) => {
    await page.goto('https://arcteryx.com.au');

    const popupClose = page.locator('button.klaviyo-close-form');
    await page.waitForTimeout(5000);
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

    await page.waitForTimeout(5000);

    const matchingImages = page.locator('img[alt*="Word Toque"]');
    const count = await matchingImages.count();

    if (count > 0) {
        await sendEmailNotification(
            'Arcteryx Bird Head Toque AVAILABLE',
            `Bird Head Toque is now available on the Arcteryx website.`
        );
    }
});
