import { test, expect } from '@playwright/test';

test.describe('Language Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show language switcher on all pages', async ({ page }) => {
    // Check on home page
    await expect(page.getByRole('button', { name: /English|ไทย/ })).toBeVisible();

    // Check on login page
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /English|ไทย/ })).toBeVisible();
  });

  test('should open dropdown when clicked', async ({ page }) => {
    const switcher = page.getByRole('button', { name: /English|ไทย/ });
    await switcher.click();
    
    // Check if dropdown is visible
    await expect(page.getByRole('menuitem', { name: 'English' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'ไทย' })).toBeVisible();
  });

  test('should switch language when selecting a different language', async ({ page }) => {
    // Open the dropdown
    const switcher = page.getByRole('button', { name: /English|ไทย/ });
    await switcher.click();

    // Get current language
    const currentLang = await switcher.textContent();

    // Select the other language
    const otherLang = currentLang?.includes('English') ? 'ไทย' : 'English';
    await page.getByRole('menuitem', { name: otherLang }).click();

    // Check if the switcher text has changed
    await expect(switcher).toHaveText(otherLang);
  });

  test('should update page content when language is changed', async ({ page }) => {
    // Open the dropdown
    const switcher = page.getByRole('button', { name: /English|ไทย/ });
    await switcher.click();

    // Switch to Thai
    await page.getByRole('menuitem', { name: 'ไทย' }).click();

    // Check if some content has been translated
    // Note: We're checking for Thai characters in the page content
    const pageContent = await page.content();
    expect(pageContent).toContain('ระบบจัดการเตียง');
  });

  test('should maintain language selection after page refresh', async ({ page }) => {
    // Switch to Thai
    const switcher = page.getByRole('button', { name: /English|ไทย/ });
    await switcher.click();
    await page.getByRole('menuitem', { name: 'ไทย' }).click();

    // Refresh the page
    await page.reload();

    // Check if language is still Thai
    await expect(switcher).toHaveText('ไทย');
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    // Open the dropdown
    const switcher = page.getByRole('button', { name: /English|ไทย/ });
    await switcher.click();

    // Click outside the dropdown
    await page.mouse.click(0, 0);

    // Check if dropdown is closed
    await expect(page.getByRole('menuitem', { name: 'English' })).not.toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'ไทย' })).not.toBeVisible();
  });
}); 