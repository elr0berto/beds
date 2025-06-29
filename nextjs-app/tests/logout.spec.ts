import { test, expect } from "@playwright/test";

// This test ensures the logout button shows a loading state (disabled + spinner)
// while the sign-out request is in progress.

// Load admin credentials from environment variables with sensible defaults for local runs
const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? '';

test.describe("Logout button loading state", () => {
  test("should show spinner and be disabled while signing out", async ({ page }) => {
    // Sign in first (reuse admin credentials seeded for tests)
    await page.goto("/auth/login");
    await page.getByTestId("username-input").fill(ADMIN_USERNAME);
    await page.getByTestId("password-input").fill(ADMIN_PASSWORD);
    await page.getByTestId("login-submit").click();

    // We should now be authenticated and at the root page.
    await page.waitForURL("/");

    const logoutButton = page.getByTestId("logout-button");
    await expect(logoutButton).toBeVisible();

    // Trigger sign-out.
    await logoutButton.click();

    // The button should immediately enter a loading state.
    await expect(logoutButton).toBeDisabled();
    await expect(logoutButton.locator("svg")).toBeVisible();

    // Finally we should be redirected back to the login page.
    await page.waitForURL("/auth/login");
  });
}); 