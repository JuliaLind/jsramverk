import { test, expect } from 'playwright-test-coverage';

// See here how to get started:
// https://playwright.dev/docs/intro
test('redirects to login page when no token', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.locator('div.ticket > h1')).toHaveText('Logga in');
})

// test('visits the admin url when token is set', async ({ page }) => {
//   await page.goto('/admin');

  // await expect(page.locator('div.ticket > h1')).toHaveText('Nytt ärende #');
  // await expect(page.locator('div.old-tickets > h2')).toHaveText('Befintliga ärenden');
// })

