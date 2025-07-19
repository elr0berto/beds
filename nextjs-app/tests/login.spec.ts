import { test, expect } from "@playwright/test";
import {loginAsAdmin, VALID_USERS} from "@/tests/helpers/login-helpers";

test.describe("Login page", () => {
  test("should display username and password fields", async ({ page }) => {
    await page.goto("/auth/login");

    // Expect form inputs to be visible
    await expect(page.getByTestId("username-input")).toBeVisible();
    await expect(page.getByTestId("password-input")).toBeVisible();
    // And the submit button
    await expect(page.getByTestId("login-submit")).toBeVisible();
  });

  test("should show an error with invalid credentials", async ({ page }) => {
    await page.goto("/auth/login");

    await page.getByTestId("username-input").fill("invalid-user");
    await page.getByTestId("password-input").fill("invalid-pass");
    await page.getByTestId("login-submit").click();

    // Supabase returns "Invalid login credentials" – that message should surface to the user
    await expect(page.locator("text=Invalid login credentials")).toBeVisible();
    // URL should remain on /auth/login
    await expect(page).toHaveURL(/\/auth\/login$/);
  });

  for (const { username, password } of VALID_USERS) {
    test(`should allow ${username} to sign in and out successfully`, async ({ page }) => {
      await page.goto("/auth/login");
      await page.getByTestId("username-input").fill(username);
      await page.getByTestId("password-input").fill(password);
      await page.getByTestId("login-submit").click();

      // Successful login redirects to the app root
      await page.waitForURL("/");
      await expect(page).toHaveURL("/");

      // The authenticated UI should display a logout button
      await expect(page.getByTestId("logout-button")).toBeVisible();

      // Sign out again to keep test state isolated
      await page.getByTestId("logout-button").click();
      await page.waitForURL("/auth/login");
    });
  }

  test("should prompt signed-in users to sign out first when visiting /auth/login", async ({ page }) => {
    // Sign in first
    await loginAsAdmin(page);

    // We should now be authenticated and at the root page
    await page.waitForURL("/");

    // Navigate back to the login page
    await page.goto("/auth/login");

    // Expect a message telling the user they're already signed in
    await expect(page.locator('[data-testid="already-signed-in-card"]')).toBeVisible();
  });
}); 