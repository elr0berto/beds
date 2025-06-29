import { test, expect, type Page } from "@playwright/test";

// Reuse environment-provided credentials when available so tests run in all envs
const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME ?? "";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "";

const USER_USERNAME = process.env.TEST_USER_USERNAME ?? "";
const USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? "";

async function loginAs(page: Page, username: string, password: string) {
  await page.goto("/auth/login");
  await page.getByTestId("username-input").fill(username);
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/");
}

async function loginAsAdmin(page: Page) {
  await loginAs(page, ADMIN_USERNAME, ADMIN_PASSWORD);
}

async function loginAsUser(page: Page) {
  await loginAs(page, USER_USERNAME, USER_PASSWORD);
}

test.describe("Navbar – admin link", () => {
  test("shows cog link for admin users and navigates correctly", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/");

    const adminLink = page.getByTestId("admin-beds-link");
    await expect(adminLink).toBeVisible();

    await adminLink.click();
    await page.waitForURL("/admin/beds");
    await expect(page).toHaveURL("/admin/beds");
  });

  test("hides cog link for regular users", async ({ page }) => {
    await loginAsUser(page);

    await page.goto("/");

    await expect(page.getByTestId("admin-beds-link")).toHaveCount(0);
  });

  test("hides cog link when not signed in", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("admin-beds-link")).toHaveCount(0);
  });
}); 