import { test, expect } from '@playwright/test';

// Adjust the URL if your app runs on a different port or path
const BASE_URL = 'http://localhost:3000/';

// Define a map of localized button texts
const localizedTexts = {
  configure: 'Configure', // Replace with actual localized text
  administer: 'Administer', // Replace with actual localized text
  view: 'View' // Replace with actual localized text
};

test('front page has 3 buttons with localized text', async ({ page }) => {
  await page.goto(BASE_URL);

  // Check for the presence of the three buttons using data-testid attributes
  await expect(page.getByTestId('configure-button')).toBeVisible();
  await expect(page.getByTestId('administer-button')).toBeVisible();
  await expect(page.getByTestId('view-button')).toBeVisible();

  // Check for the displayed text of each button
  await expect(page.getByTestId('configure-button')).toHaveText(localizedTexts.configure);
  await expect(page.getByTestId('administer-button')).toHaveText(localizedTexts.administer);
  await expect(page.getByTestId('view-button')).toHaveText(localizedTexts.view);
}); 