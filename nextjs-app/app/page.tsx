import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { Bed, BedStatus } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { BedsGrid } from "@/components/beds-grid";
import "./beds-grid.scss";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));

  const beds = await prisma.bed.findMany({
    include: {
      statuses: {
        where: {
          startDate: {
            lte: todayEnd,
            gte: todayStart
          }
        },
        orderBy: {
          startDate: "asc"
        }
      }
    },
    orderBy: {
      order: "asc"
    }
  });

  const tBedsAdmin = await getTranslations("BedsAdmin");
  const tBedsManager = await getTranslations("BedsManager");

  return (
    <PageLayout>
      <BedsGrid 
        beds={beds} 
        noBeds={tBedsManager("noBeds")} 
      />
    </PageLayout>
  );
}