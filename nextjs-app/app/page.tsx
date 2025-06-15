import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/page-layout";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <PageLayout>
      Front page
    </PageLayout>
  );
}
