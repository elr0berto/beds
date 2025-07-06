"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBedStatus(formData: FormData) {
  const bedId = parseInt(formData.get("bedId") as string);
  const startDate = new Date(formData.get("startDate") as string);
  const duration = parseInt(formData.get("duration") as string);
  const status = formData.get("status") as string;

  if (!bedId || !startDate || !duration || !status) {
    throw new Error("Missing required fields");
  }

  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

  try {
    await prisma.bedStatus.create({
      data: {
        bedId,
        startDate,
        endDate,
        status,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating bed status:", error);
    throw new Error("Failed to create bed status");
  }
} 