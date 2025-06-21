"use client";

import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchTo = (newLocale: "en" | "th") => {
    if (newLocale === locale) return;
    // Set cookie that our i18n/request.ts reads
    document.cookie = `locale=${newLocale}; path=/`;
    // Refresh to re-render with new locale
    router.refresh();
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant={locale === "th" ? "default" : "outline"}
        size="sm"
        onClick={() => switchTo("th")}
      >
        ไทย
      </Button>
      <Button
        variant={locale === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => switchTo("en")}
      >
        EN
      </Button>
    </div>
  );
} 