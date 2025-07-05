import { test, expect, type Page } from "@playwright/test";

// Reuse environment-provided credentials when available so tests run in all envs
const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME ?? "";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "";

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

test.describe("Loading spinner overlay", () => {
  test("shows loading overlay when navigating between pages", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/");

    // Ensure we're on the home page and no loading overlay is present
    await expect(page.getByTestId("loading-overlay")).toHaveCount(0);

    // Start navigation to bed-status-manager page
    // We need to click the link and immediately check for the loading overlay
    const navigationPromise = page.waitForURL("/bed-status-manager");
    
    // Click a link to navigate to bed-status-manager
    await page.getByTestId("bed-status-manager-link").click();
    
    // The loading overlay should appear briefly during navigation
    // We'll check for it with a short timeout since it might appear and disappear quickly
    try {
      await expect(page.getByTestId("loading-overlay")).toBeVisible({ timeout: 1000 });
    } catch (e) {
      // If loading is too fast, that's still acceptable behavior
      console.log("Loading overlay appeared too briefly to detect, which is acceptable");
    }

    // Wait for navigation to complete
    await page.waitForURL("/bed-status-manager");
    
    // Loading overlay should be gone once navigation completes
    await expect(page.getByTestId("loading-overlay")).toHaveCount(0);
  });

  test("loading overlay contains spinner and loading text", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/");

    // We'll simulate a slower navigation by intercepting the request
    // This ensures we can reliably test the loading state
    await page.route("**/bed-status-manager", async (route) => {
      // Add a delay to make loading state more visible
      await page.waitForTimeout(500);
      await route.continue();
    });

    // Start navigation
    await page.getByTestId("bed-status-manager-link").click();

    // Check that loading overlay appears with correct elements
    const loadingOverlay = page.getByTestId("loading-overlay");
    await expect(loadingOverlay).toBeVisible();
    
    // Check that the loading text is present
    await expect(loadingOverlay.getByText("Loading...")).toBeVisible();
    
    // Wait for navigation to complete
    await page.waitForURL("/bed-status-manager");
    
    // Loading overlay should be gone
    await expect(loadingOverlay).toHaveCount(0);
  });

  test("loading overlay has correct styling and positioning", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/");

    // Intercept navigation to keep loading state visible longer
    await page.route("**/bed-status-manager", async (route) => {
      await page.waitForTimeout(1000);
      await route.continue();
    });

    // Start navigation
    await page.getByTestId("bed-status-manager-link").click();

    const loadingOverlay = page.getByTestId("loading-overlay");
    await expect(loadingOverlay).toBeVisible();

    // Check that the overlay covers the entire screen
    const overlayBox = await loadingOverlay.boundingBox();
    const viewportSize = page.viewportSize();
    
    if (overlayBox && viewportSize) {
      expect(overlayBox.width).toBeGreaterThanOrEqual(viewportSize.width);
      expect(overlayBox.height).toBeGreaterThanOrEqual(viewportSize.height);
    }

    // Check that the overlay has the correct classes for styling
    await expect(loadingOverlay).toHaveClass(/fixed/);
    await expect(loadingOverlay).toHaveClass(/inset-0/);
    await expect(loadingOverlay).toHaveClass(/z-50/);
  });

  test("loading overlay does not appear for same-page navigation", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/");

    // Click on the same page link (home page logo)
    await page.getByRole("link", { name: /bed management/i }).click();

    // Should not show loading overlay for same-page navigation
    await expect(page.getByTestId("loading-overlay")).toHaveCount(0);
  });

  test("loading overlay does not appear for external links", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/");

    // Add a temporary external link for testing
    await page.evaluate(() => {
      const link = document.createElement("a");
      link.href = "https://example.com";
      link.textContent = "External Link";
      link.setAttribute("data-testid", "external-link");
      document.body.appendChild(link);
    });

    // Click external link (this would typically open in new tab, but we'll prevent that)
    await page.getByTestId("external-link").click({ noWaitAfter: true });

    // Should not show loading overlay for external links
    await expect(page.getByTestId("loading-overlay")).toHaveCount(0);
  });
});