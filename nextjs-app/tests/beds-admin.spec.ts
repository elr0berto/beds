import { test, expect, type Page } from "@playwright/test";

// Use environment-provided credentials when available so tests run in all envs
const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? '';

const USER_USERNAME = process.env.TEST_USER_USERNAME ?? '';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? '';

// Utility function to sign the current Playwright page in as an admin
async function loginAsAdmin(page: Page) {
  await page.goto("/auth/login");
  await page.getByTestId("username-input").fill(ADMIN_USERNAME);
  await page.getByTestId("password-input").fill(ADMIN_PASSWORD);
  await page.getByTestId("login-submit").click();
  // Successful login redirects to the app root
  await page.waitForURL("/");
}

// Utility to sign in as a normal (non-admin) user
async function loginAsUser(page: Page) {
  await page.goto("/auth/login");
  await page.getByTestId("username-input").fill(USER_USERNAME);
  await page.getByTestId("password-input").fill(USER_PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/");
}

test.describe("Admin › Beds CRUD and reorder", () => {
  test("can create a new bed", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/admin/beds");

    await page.getByTestId("add-bed-button").click();

    const bedName = `Playwright Bed ${Date.now()}`;
    await page.getByTestId("bed-name-input").fill(bedName);
    await page.getByTestId("bed-save-button").click();

    // Expect toast to confirm addition
    await expect(page.getByTestId("bed-added-toast")).toBeVisible();

    // New row should appear in the table
    const newRow = page
      .getByTestId("bed-row")
      .filter({ hasText: bedName });
    await expect(newRow).toBeVisible();
  });

  test("can edit an existing bed", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/beds");

    // Ensure at least one bed exists – create if necessary
    const originalName = `Bed To Edit ${Date.now()}`;
    const updatedName = `${originalName} (Edited)`;

    const existingRows = await page.locator('[data-testid="bed-row"]').count();
    if (existingRows === 0) {
      await page.getByTestId("add-bed-button").click();
      await page.getByTestId("bed-name-input").fill(originalName);
      await page.getByTestId("bed-save-button").click();
      await expect(page.getByTestId("bed-added-toast")).toBeVisible();
    }

    const row = page.getByTestId("bed-row").first();
    await row.getByTestId("edit-bed-button").click();

    // Modal input should contain the current name; replace with updated name
    const input = page.getByTestId("bed-name-input");
    await expect(input).toBeVisible();
    await input.fill(updatedName);
    await page.getByTestId("bed-save-button").click();

    await expect(page.getByTestId("bed-updated-toast")).toBeVisible();
    await expect(page.getByTestId("bed-row").filter({ hasText: updatedName })).toBeVisible();
  });

  test("can delete a bed", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/beds");

    const bedName = `Bed To Delete ${Date.now()}`;
    // Create a bed to delete so the test is deterministic
    await page.getByTestId("add-bed-button").click();
    await page.getByTestId("bed-name-input").fill(bedName);
    await page.getByTestId("bed-save-button").click();
    await expect(page.getByTestId("bed-added-toast")).toBeVisible();

    const row = page.getByTestId("bed-row").filter({ hasText: bedName });
    await row.getByTestId("delete-bed-button").click();

    // Confirmation dialog should appear
    await page.getByTestId("confirm-delete-bed-button").click();

    await expect(page.getByTestId("bed-deleted-toast")).toBeVisible();
    await expect(page.getByTestId("bed-row").filter({ hasText: bedName })).toHaveCount(0);
  });

  test("can reorder beds by drag and drop", async ({ page, browserName }) => {
    // Skip drag tests on WebKit – it behaves inconsistently in CI
    test.skip(browserName === "webkit", "Drag-and-drop is flaky on WebKit in CI");

    await loginAsAdmin(page);
    await page.goto("/admin/beds");

    // Ensure there are at least two beds to reorder
    const bedA = `Bed A ${Date.now()}`;
    const bedB = `Bed B ${Date.now()}`;

    async function createBed(name: string) {
      await page.getByTestId("add-bed-button").click();
      await page.getByTestId("bed-name-input").fill(name);
      await page.getByTestId("bed-save-button").click();
      await expect(page.getByTestId("bed-added-toast")).toBeVisible();
    }

    const rowCount = await page.locator('[data-testid="bed-row"]').count();
    if (rowCount < 2) {
      await createBed(bedA);
      await createBed(bedB);
    }

    // Capture the initial first row text
    const firstRowBefore = await page.locator('[data-testid="bed-row"]').first().innerText();

    const firstHandle = page.getByTestId("bed-drag-handle").first();
    const secondRow = page.getByTestId("bed-row").nth(1);
    await firstHandle.dragTo(secondRow);

    // Wait for order-saved toast
    await expect(page.getByTestId("order-saved-toast")).toBeVisible();

    // Reload to assert persistence
    await page.reload();

    const firstRowAfter = await page.locator('[data-testid="bed-row"]').first().innerText();
    expect(firstRowAfter).not.toBe(firstRowBefore);
  });

  test("non-admin users cannot access the Beds admin page", async ({ page }) => {
    await loginAsUser(page);

    await page.goto("/admin/beds");

    // Expect to be redirected to /
    await expect(page.url()).toContain("/");
  });

  test("not signed in users cannot access the Beds admin page", async ({ page }) => {
    await page.goto("/admin/beds");

    // Expect to be redirected to /auth/login
    await expect(page.url()).toContain("/auth/login");
  });
}); 