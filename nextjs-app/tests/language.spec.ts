import { test, expect } from "@playwright/test";

test.describe("Language switcher", () => {
  test("should switch between Thai and English", async ({ page }) => {
    await page.goto("/auth/login");

    // Default locale is Thai – title should be in Thai.
    await expect(page.getByTestId("login-form-title")).toHaveText("เข้าสู่ระบบ");

    // Open language menu and switch to English
    await page.getByRole("button", { name: "ไทย" }).click();
    await page.getByRole("menuitemradio", { name: "EN" }).click();

    // Title should now be in English
    await expect(page.getByTestId("login-form-title")).toHaveText("Login");

    // Switch back to Thai to restore state
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await page.getByRole("menuitemradio", { name: "ไทย" }).click();

    // Title should be back in Thai
    await expect(page.getByTestId("login-form-title")).toHaveText("เข้าสู่ระบบ");
  });
});

test.describe("Language switcher loading state", () => {
  test("should show a spinner and disable the button while switching", async ({ page }) => {
    await page.goto("/auth/login");

    // Open dropdown via current language button
    await page.getByRole("button", { name: "ไทย" }).click();

    // Click English option to initiate locale switch
    await page.getByRole("menuitemradio", { name: "EN" }).click();

    // Locator for the button that now contains the spinner
    const spinnerButton = page.locator("button:has(svg.animate-spin)");

    // Expect spinner visible and button disabled
    await expect(spinnerButton).toBeDisabled();
    await expect(spinnerButton.locator("svg.animate-spin")).toBeVisible();

    // Wait until the title appears in English to confirm refresh is done
    await expect(page.getByTestId("login-form-title")).toHaveText("Login");
  });
}); 