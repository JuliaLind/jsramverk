// const { test, expect } = require('@playwright/test');
const { test, expect } = require('playwright-test-coverage');

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app tickets url', async ({ page }) => {
  await page.goto('/tickets');
  await expect(page.locator('div.ticket > h1')).toHaveText('Nytt ärende #');
  await expect(page.locator('div.old-tickets > h2')).toHaveText('Befintliga ärenden');
})
