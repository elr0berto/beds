"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";

export function LogoutButton() {
  const t = useTranslations("Common");
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button
      data-testid="logout-button"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending && <Loader2 className="animate-spin" />}
      {t("logout")}
    </Button>
  );
}
