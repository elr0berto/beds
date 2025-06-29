import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { Bed } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const beds = await prisma.bed.findMany();

  const tBedsAdmin = await getTranslations("BedsAdmin");

  const renderGrid = (beds: Bed[]) => (
    <div
      data-testid="bed-grid"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4"
    >
      {beds.map((bed) => (
        <div
          key={bed.id}
          data-testid="bed-card"
          className="border rounded-md p-4 flex items-center justify-center text-center bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700"
        >
          {bed.name}
        </div>
      ))}
      {beds.length === 0 && (
        <p
          data-testid="no-beds-message"
          className="col-span-full text-center text-gray-500"
        >
          {tBedsAdmin("noBeds")}
        </p>
      )}
    </div>
  );

  return (
    <PageLayout>
      {renderGrid(beds)}
    </PageLayout>
  );
}