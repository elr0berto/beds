"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const t = useTranslations("Common");

  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "local" });
    router.push("/auth/login");
  };

  return (
    <Button
      data-testid="logout-button"
      onClick={logout}
      disabled={loading}
    >
      {loading && <Loader2 className="animate-spin" />}
      {t("logout")}
    </Button>
  );
}
