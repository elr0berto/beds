import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test("should display username and password fields", async ({ page }) => {
    await page.goto("/auth/login");

    // Expect form inputs to be visible
    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    // And the submit button
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("should show an error with invalid credentials", async ({ page }) => {
    await page.goto("/auth/login");

    await page.getByLabel("Username").fill("invalid-user");
    await page.getByLabel("Password").fill("invalid-pass");
    await page.getByRole("button", { name: "Login" }).click();

    // Supabase returns "Invalid login credentials" – that message should surface to the user
    await expect(page.locator("text=Invalid login credentials")).toBeVisible();
    // URL should remain on /auth/login
    await expect(page).toHaveURL(/\/auth\/login$/);
  });

  const validUsers: { username: string; password: string }[] = [
    { username: "admin", password: "admin" },
    { username: "user", password: "user" },
  ];

  for (const { username, password } of validUsers) {
    test(`should allow ${username} to sign in and out successfully`, async ({ page }) => {
      await page.goto("/auth/login");
      await page.getByLabel("Username").fill(username);
      await page.getByLabel("Password").fill(password);
      await page.getByRole("button", { name: "Login" }).click();

      // Successful login redirects to the app root
      await page.waitForURL("/");
      await expect(page).toHaveURL("/");

      // The authenticated UI should display a logout button
      await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

      // Sign out again to keep test state isolated
      await page.getByRole("button", { name: "Logout" }).click();
      await page.waitForURL("/auth/login");
    });
  }

  test("should prompt signed-in users to sign out first when visiting /auth/login", async ({ page }) => {
    // Sign in first
    await page.goto("/auth/login");
    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password").fill("admin");
    await page.getByRole("button", { name: "Login" }).click();

    // We should now be authenticated and at the root page
    await page.waitForURL("/");

    // Navigate back to the login page
    await page.goto("/auth/login");

    // Expect a message telling the user they're already signed in
    await expect(page.locator("text=already signed in")).toBeVisible();
    await expect(page.locator("text=sign out first")).toBeVisible();
  });
}); 