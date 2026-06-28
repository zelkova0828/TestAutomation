import { test, expect } from '@playwright/test';

test('sample test - check page title', async ({ page }) => {
  // baseURL is read from config.json via playwright.config.ts
  await page.goto('/');

  // Verify that the title is 'Example Domain'
  await expect(page).toHaveTitle('Example Domain');
});
