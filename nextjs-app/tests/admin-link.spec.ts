import { test, expect } from "@playwright/test";
import {loginAsAdmin, loginAsUser} from "@/tests/helpers/login-helpers";

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

  test("shows disabled cog link for regular users", async ({ page }) => {
    await loginAsUser(page);

    await page.goto("/");

    const adminLink = page.getByTestId("admin-beds-link");
    await expect(adminLink).toBeVisible();
    
    // Verify it's disabled (rendered as span, not clickable)
    await expect(adminLink).toHaveAttribute("aria-label", "Admin beds (disabled)");
    
    // Verify it doesn't navigate when clicked
    await adminLink.click();
    await expect(page).toHaveURL("/"); // Should stay on same page
  });

  test("hides cog link when not signed in", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("admin-beds-link")).toHaveCount(0);
  });
}); 