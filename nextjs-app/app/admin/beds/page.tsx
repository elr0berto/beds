import { PageLayout } from '@/components/page-layout';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/roles';
import { redirect } from 'next/navigation';
import BedsAdminTable from './beds-admin-table';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin(user)) {
    redirect('/');
  }

  const beds = await prisma.bed.findMany({ orderBy: { order: 'asc' } });

  return (
    <PageLayout>
      <BedsAdminTable initialBeds={beds} />
    </PageLayout>
  );
}