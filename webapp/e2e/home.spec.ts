import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display all three main navigation links', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Check if all three links are present
    const configureLink = page.getByRole('link', { name: 'Configure' });
    const administerLink = page.getByRole('link', { name: 'Administer' });
    const viewLink = page.getByRole('link', { name: 'View' });

    // Verify links are visible
    await expect(configureLink).toBeVisible();
    await expect(administerLink).toBeVisible();
    await expect(viewLink).toBeVisible();

    // Verify links have correct href attributes
    await expect(configureLink).toHaveAttribute('href', '/configure');
    await expect(administerLink).toHaveAttribute('href', '/administer');
    await expect(viewLink).toHaveAttribute('href', '/view');
  });

  test('should navigate to correct pages when links are clicked', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Test Configure link
    await page.getByRole('link', { name: 'Configure' }).click();
    await expect(page).toHaveURL(/.*\/configure/);
    await page.goBack();

    // Test Administer link
    await page.getByRole('link', { name: 'Administer' }).click();
    await expect(page).toHaveURL(/.*\/administer/);
    await page.goBack();

    // Test View link
    await page.getByRole('link', { name: 'View' }).click();
    await expect(page).toHaveURL(/.*\/view/);
  });
}); 