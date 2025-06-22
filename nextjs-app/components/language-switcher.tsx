"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
        >
          {locale === "en" ? "EN" : "ไทย"}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(v) => switchTo(v as "en" | "th")}
        >
          <DropdownMenuRadioItem value="th">ไทย</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">EN</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 