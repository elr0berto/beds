'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { Prisma } from '@prisma/client';

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) {
    throw new Error("Unauthorized");
  }
}

export async function addBed(name: string) {
  await assertAdmin();
  const max = await prisma.bed.aggregate({ _max: { order: true } });
  const order = ((max._max.order ?? 0) as number) + 1;
  try {
    const newBed = await prisma.bed.create({
      data: { name, order },
    });
    revalidatePath('/admin/beds');
    return newBed;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw new Error('DUPLICATE_BED_NAME');
    }
    throw err;
  }
}

export async function editBed(id: number, name: string) {
  await assertAdmin();
  try {
    const bed = await prisma.bed.update({ where: { id }, data: { name } });
    revalidatePath('/admin/beds');
    return bed;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw new Error('DUPLICATE_BED_NAME');
    }
    throw err;
  }
}

export async function deleteBed(id: number) {
  await assertAdmin();
  await prisma.bed.delete({ where: { id } });
  revalidatePath('/admin/beds');
}

export async function reorderBeds(sortedIds: number[]) {
  await assertAdmin();
  await prisma.$transaction(
    sortedIds.map((id, idx) =>
      prisma.bed.update({ where: { id }, data: { order: idx } }),
    ),
  );
  revalidatePath('/admin/beds');
} 