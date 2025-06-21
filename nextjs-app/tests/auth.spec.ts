import { test, expect } from '@playwright/test';

test.describe('Authentication redirect', () => {
  test('visiting / when not authenticated redirects to /auth/login', async ({ page }) => {
    // Navigate to the app root; the dev server's baseURL can be provided via the CLI or playwright.config.ts.
    await page.goto('/');

    // The middleware should redirect unauthenticated users to the login page.
    await page.waitForURL('**/auth/login');

    // Verify that the current URL indeed ends with /auth/login
    expect(page.url()).toContain('/auth/login');
  });
}); 