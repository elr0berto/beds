import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const supabase = await createClient();
  const tCommon = await getTranslations("Common");

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <PageLayout>
      {tCommon("frontPage")}
    </PageLayout>
  );
}
