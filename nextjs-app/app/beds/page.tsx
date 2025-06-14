import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient()
  const { data: beds } = await supabase.from('beds').select()

  return <pre>{JSON.stringify(beds, null, 2)}</pre>
}