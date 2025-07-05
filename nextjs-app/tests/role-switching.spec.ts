import { test, expect } from "@playwright/test";

// This test validates that user roles are properly updated between logout/login sessions
// and that the admin cog wheel visibility updates correctly.

const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? '';
const USER_USERNAME = process.env.TEST_USER_USERNAME ?? '';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? '';

test.describe("Role switching between logout/login", () => {
  test("admin cog wheel should be disabled after admin logs out and user logs in", async ({ page }) => {
    // First, sign in as admin
    await page.goto("/auth/login");
    await page.getByTestId("username-input").fill(ADMIN_USERNAME);
    await page.getByTestId("password-input").fill(ADMIN_PASSWORD);
    await page.getByTestId("login-submit").click();
    
    // We should now be at the root page as an admin
    await page.waitForURL("/");
    
    // The admin link should be enabled (clickable)
    const adminLinkAsAdmin = page.getByTestId("admin-beds-link");
    await expect(adminLinkAsAdmin).toBeVisible();
    
    // Verify it's actually clickable by checking it's not disabled
    await expect(adminLinkAsAdmin).not.toHaveClass(/opacity-50/);
    await expect(adminLinkAsAdmin).not.toHaveClass(/cursor-not-allowed/);
    
    // Sign out
    await page.getByTestId("logout-button").click();
    await page.waitForURL("/auth/login");
    
    // Now sign in as a regular user
    await page.getByTestId("username-input").fill(USER_USERNAME);
    await page.getByTestId("password-input").fill(USER_PASSWORD);
    await page.getByTestId("login-submit").click();
    
    // We should now be at the root page as a user
    await page.waitForURL("/");
    
    // The admin link should now be disabled (not clickable)
    const adminLinkAsUser = page.getByTestId("admin-beds-link");
    await expect(adminLinkAsUser).toBeVisible();
    
    // Verify it's disabled by checking for disabled styling
    await expect(adminLinkAsUser).toHaveClass(/opacity-50/);
    await expect(adminLinkAsUser).toHaveClass(/cursor-not-allowed/);
  });
  
  test("admin cog wheel should be enabled after user logs out and admin logs in", async ({ page }) => {
    // First, sign in as user
    await page.goto("/auth/login");
    await page.getByTestId("username-input").fill(USER_USERNAME);
    await page.getByTestId("password-input").fill(USER_PASSWORD);
    await page.getByTestId("login-submit").click();
    
    // We should now be at the root page as a user
    await page.waitForURL("/");
    
    // The admin link should be disabled (not clickable)
    const adminLinkAsUser = page.getByTestId("admin-beds-link");
    await expect(adminLinkAsUser).toBeVisible();
    await expect(adminLinkAsUser).toHaveClass(/opacity-50/);
    await expect(adminLinkAsUser).toHaveClass(/cursor-not-allowed/);
    
    // Sign out
    await page.getByTestId("logout-button").click();
    await page.waitForURL("/auth/login");
    
    // Now sign in as admin
    await page.getByTestId("username-input").fill(ADMIN_USERNAME);
    await page.getByTestId("password-input").fill(ADMIN_PASSWORD);
    await page.getByTestId("login-submit").click();
    
    // We should now be at the root page as an admin
    await page.waitForURL("/");
    
    // The admin link should now be enabled (clickable)
    const adminLinkAsAdmin = page.getByTestId("admin-beds-link");
    await expect(adminLinkAsAdmin).toBeVisible();
    await expect(adminLinkAsAdmin).not.toHaveClass(/opacity-50/);
    await expect(adminLinkAsAdmin).not.toHaveClass(/cursor-not-allowed/);
  });
});