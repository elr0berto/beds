import { test, expect, type Page } from "@playwright/test";

// Database helper utilities used across tests – destructive so lives in serial
import { deleteAllBeds, createBed } from "../helpers/beds";

// Use environment-provided credentials so tests are portable
const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME ?? "";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "";

// Helper to sign in as admin
async function loginAsAdmin(page: Page) {
  await page.goto("/auth/login");
  await page.getByTestId("username-input").fill(ADMIN_USERNAME);
  await page.getByTestId("password-input").fill(ADMIN_PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/");
}

// ---------------------------------------------------------------------------
// Regular user credentials & login helper
// ---------------------------------------------------------------------------

const USER_USERNAME = process.env.TEST_USER_USERNAME ?? "";
const USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? "";

async function loginAsUser(page: Page) {
  await page.goto("/auth/login");
  await page.getByTestId("username-input").fill(USER_USERNAME);
  await page.getByTestId("password-input").fill(USER_PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/");
}

// ---------------------------------------------------------------------------
// The tests – run serially by project configuration
// ---------------------------------------------------------------------------

test.describe.serial("Bed status manager page – Grid View (serial)", () => {
  test("displays beds in a grid", async ({ page }) => {
    await loginAsAdmin(page);

    // Ensure at least one known bed exists (create it deterministically)
    const bedName = `Grid Test Bed ${Date.now()}`;

    await page.goto("/admin/beds");
    await page.getByTestId("add-bed-button").click();
    await page.getByTestId("bed-name-input").fill(bedName);
    await page.getByTestId("bed-save-button").click();
    await expect(page.getByTestId("bed-added-toast")).toBeVisible();

    // Navigate to the public beds page
    await page.goto("/bed-status-manager");

    // Expect the grid container to be visible
    await expect(page.getByTestId("bed-grid")).toBeVisible();

    // Expect our newly created bed to appear in the grid
    await expect(page.getByTestId("bed-card").filter({ hasText: bedName })).toBeVisible();
  });

  test("is accessible to regular users", async ({ page }) => {
    // Ensure a deterministic bed exists directly via the DB for speed
    const bedName = `User Accessible Bed ${Date.now()}`;
    await createBed(bedName);

    await loginAsUser(page);

    await page.goto("/bed-status-manager");

    await expect(page.getByTestId("bed-grid")).toBeVisible();
    await expect(page.getByTestId("bed-card").filter({ hasText: bedName })).toBeVisible();
  });

  test("shows 'no beds' message when there are zero beds", async ({ page }) => {
    // Remove all beds so we can assert the empty state reliably
    await deleteAllBeds();

    await loginAsAdmin(page);

    await page.goto("/bed-status-manager");

    await expect(page.getByTestId("no-beds-message")).toBeVisible();
  });

  test("does not show 'no beds' message when there are beds", async ({ page }) => {
    const bedName = `Header Test Bed ${Date.now()}`;
    await createBed(bedName);

    await loginAsUser(page);
    await page.goto("/bed-status-manager");

    await expect(page.getByTestId("no-beds-message")).not.toBeVisible();
  });

  test("displays hour header from 08:00 to 22:00", async ({ page }) => {
    const bedName = `Header Test Bed ${Date.now()}`;
    await createBed(bedName);

    await loginAsUser(page);
    await page.goto("/bed-status-manager");

    // Expect header cells for 08:00 and 22:00 to be visible
    await expect(page.getByText("08:00")).toBeVisible();
    await expect(page.getByText("22:00")).toBeVisible();
  });
}); 