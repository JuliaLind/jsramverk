import { test, expect } from 'playwright-test-coverage';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('div.delayed-header > h1')).toHaveText('Försenade tåg');
})
