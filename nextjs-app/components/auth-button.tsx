import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { getTranslations } from "next-intl/server";

export async function AuthButton() {
  const supabase = await createClient();
  const tCommon = await getTranslations("Common");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <LogoutButton />
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">{tCommon("signIn")}</Link>
      </Button>
    </div>
  );
}
