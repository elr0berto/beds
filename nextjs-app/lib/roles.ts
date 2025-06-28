import type { User } from "@supabase/supabase-js";

/**
 * Extracts the username (the part before the `@` sign) from the Supabase
 * `User.email` value. Returns `undefined` when the username cannot be
 * determined.
 */
export function getUsername(user: User | null | undefined): string | undefined {
  return user?.email?.split("@")[0];
}

/**
 * Determines whether the given identifier belongs to an admin.
 * You may pass either a Supabase `User` object or the raw username string.
 */
export function isAdmin(userOrUsername: User | string | null | undefined): boolean {
  const username = typeof userOrUsername === "string" ? userOrUsername : getUsername(userOrUsername);
  return !!username?.toLowerCase().includes("admin");
}

/**
 * Determines whether the given identifier belongs to a regular user.
 * You may pass either a Supabase `User` object or the raw username string.
 */
export function isUser(userOrUsername: User | string | null | undefined): boolean {
  const username = typeof userOrUsername === "string" ? userOrUsername : getUsername(userOrUsername);
  return !!username?.toLowerCase().includes("user");
} 