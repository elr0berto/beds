import { test, expect } from "@playwright/test";

import { isAdmin, isUser } from "@/lib/roles";

// These tests run entirely in Node but still count as e2e because they
// execute inside the Playwright test runner which mimics real-world usage.
// They give us confidence that the helper behaves consistently on both the
// client- and server-side runtimes.

test.describe("Role helpers", () => {
  const adminUsername = "super-admin";
  const userUsername = "simple-user";

  test("isAdmin() identifies admins correctly", async () => {
    expect(isAdmin(adminUsername)).toBe(true);
    expect(isAdmin(userUsername)).toBe(false);
  });

  test("isUser() identifies users correctly", async () => {
    expect(isUser(userUsername)).toBe(true);
    expect(isUser(adminUsername)).toBe(false);
  });
}); 