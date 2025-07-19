import { test, expect } from "@playwright/test";

import { isAdmin, isUser } from "@/lib/roles";

// These tests run entirely in Node but still count as e2e because they
// execute inside the Playwright test runner which mimics real-world usage.
// They give us confidence that the helper behaves consistently on both the
// client- and server-side runtimes.

test.describe("Role helpers", () => {
  const adminUsername = ["super-admin", "some-admin", "blah-admin"];
  const userUsername = ["simple-user", "some-user", "asdsad-user"];

  const neitherAdminNorUserUsername = ['blah','blah-blah','blah-blah-blah'];

  test("isAdmin() identifies admins correctly", async () => {
    // Test with various admin usernames
    for (const username of adminUsername) {
      expect(isAdmin(username)).toBe(true);
      expect(isUser(username)).toBe(false);
    }
  });

  test("isUser() identifies users correctly", async () => {
    // Test with various user usernames
    for (const username of userUsername) {
      expect(isAdmin(username)).toBe(false);
      expect(isUser(username)).toBe(true);
    }
  });

  test("isAdmin() and isUser() identifies non-admins/users correctly", async () => {
    // Test with various non-admin usernames
    for (const username of neitherAdminNorUserUsername) {
      expect(isAdmin(username)).toBe(false);
      expect(isUser(username)).toBe(false);
    }
  });
}); 