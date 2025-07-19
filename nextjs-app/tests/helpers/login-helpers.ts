
// Use environment-provided credentials so tests are portable
import {Page} from "@playwright/test";

const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME ?? "";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "";

// Helper to sign in as admin
export async function loginAsAdmin(page: Page) {
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

export async function loginAsUser(page: Page) {
  await page.goto("/auth/login");
  await page.getByTestId("username-input").fill(USER_USERNAME);
  await page.getByTestId("password-input").fill(USER_PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/");
}


export const VALID_USERS: { username: string; password: string }[] = [
  { username: ADMIN_USERNAME, password: ADMIN_PASSWORD },
  { username: USER_USERNAME, password: USER_PASSWORD },
];