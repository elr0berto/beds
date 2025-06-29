import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import LanguageSwitcher from "@/components/language-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Cog } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";

interface PageLayoutProps {
  children: ReactNode;
}

export async function PageLayout({ children }: PageLayoutProps) {
  const tCommon = await getTranslations("Common");

  // Determine whether the current visitor is an authenticated admin
  let showAdminLink = false;
  if (hasEnvVars) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    showAdminLink = !!user && isAdmin(user);
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href="/" className="font-bold">
              {tCommon("bedManagement")}
            </Link>

            <div className="flex items-center gap-4">
              {showAdminLink && (
                <Link
                  href="/admin/beds"
                  aria-label="Admin beds"
                  data-testid="admin-beds-link"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Cog className="w-5 h-5" />
                </Link>
              )}
              <LanguageSwitcher />
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            {children}
          </main>
        </div>
      </div>
    </main>
  );
} 