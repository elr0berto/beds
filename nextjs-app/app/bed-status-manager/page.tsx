import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { Bed } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { Fragment } from "react";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const beds = await prisma.bed.findMany();

  const tBedsAdmin = await getTranslations("BedsAdmin");

  // Hours to display across the schedule – inclusive from 08:00 to 22:00
  const hours = Array.from({ length: 15 }, (_, i) => i + 8);

  const renderGrid = (beds: Bed[]) => (
    <div data-testid="bed-grid" className="overflow-x-auto">
      <div className="grid w-full text-sm grid-cols-[auto_repeat(15,minmax(0,1fr))]">
        {/* Header cells */}
        <div className="px-4 py-2 border-r font-medium whitespace-nowrap sticky top-0 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100">
          Bed
        </div>
        {hours.map((hour) => (
          <div
            key={`header-${hour}`}
            className="px-4 py-2 border-r last:border-r-0 text-left sticky top-0 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100"
          >
            {`${String(hour).padStart(2, "0")}:00`}
          </div>
        ))}

        {/* Bed rows */}
        {beds.map((bed, rowIdx) => (
          <Fragment key={bed.id}>
            <div
              data-testid="bed-card"
              className={
                `px-4 py-2 border-r font-medium whitespace-nowrap ` +
                (rowIdx % 2 === 1 ? "bg-gray-50 dark:bg-slate-800" : "bg-white dark:bg-slate-900")
              }
            >
              {bed.name}
            </div>
            {hours.map((hour) => (
              <div
                key={`${bed.id}-${hour}`}
                className={`px-4 py-2 border-r last:border-r-0 ` +
                  (rowIdx % 2 === 1 ? "bg-gray-50 dark:bg-slate-800" : "bg-white dark:bg-slate-900")}
              ></div>
            ))}
          </Fragment>
        ))}

        {/* Empty state */}
        {beds.length === 0 && (
          <p
            data-testid="no-beds-message"
            className="col-span-full text-center text-gray-500 py-4"
          >
            {tBedsAdmin("noBeds")}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <PageLayout>
      {renderGrid(beds)}
    </PageLayout>
  );
}