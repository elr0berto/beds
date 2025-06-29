import { prisma } from "@/lib/prisma";

/**
 * Removes every record from the `beds` table. Useful when you need a guaranteed
 * empty state – e.g. before asserting that the UI shows the *no beds* message.
 *
 * IMPORTANT: This helper executes on the Node side of Playwright tests (the
 * test runner process), **not** inside the browser context.
 */
export async function deleteAllBeds(): Promise<void> {
  // First remove all associated statuses to avoid FK constraint errors when beds
  // are deleted. Although the relation is configured with `onDelete: Cascade`,
  // explicit deletion keeps the helper safe even if that constraint changes.
  await prisma.bedStatus.deleteMany({});
  await prisma.bed.deleteMany({});
}

/**
 * Convenience utility for quickly inserting a new `Bed`
 */
export async function createBed(name: string) {
  return prisma.bed.create({ data: { name } });
}