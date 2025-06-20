import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/page-layout";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const beds = await prisma.bed.findMany()

  return (
    <PageLayout>
      <pre>{JSON.stringify(beds, null, 2)}</pre>
    </PageLayout>
  );
}