import { test, expect } from "@playwright/test";

test.describe("Language switcher", () => {
  test("should switch between Thai and English", async ({ page }) => {
    await page.goto("/auth/login");

    // Default locale is Thai – title should be in Thai.
    await expect(page.getByTestId("login-form-title")).toHaveText("เข้าสู่ระบบ");

    // Switch to English
    await page.getByRole("button", { name: "EN" }).click();

    // Title should now be in English
    await expect(page.getByTestId("login-form-title")).toHaveText("Login");

    // Switch back to Thai to restore state
    await page.getByRole("button", { name: "ไทย" }).click();
    await expect(page.getByTestId("login-form-title")).toHaveText("เข้าสู่ระบบ");
  });
}); 