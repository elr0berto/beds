import { prisma } from "@/lib/prisma";

export default async function Page() {
  const beds = await prisma.bed.findMany()

  return <pre>{JSON.stringify(beds, null, 2)}</pre>
}