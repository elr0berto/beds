import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";
import LanguageSwitcher from "@/components/language-switcher";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tLogin = await getTranslations("LoginPage");
  const tCommon = await getTranslations("Common");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-sm">
        {user ? (
          <Card data-testid="already-signed-in-card">
            <CardHeader>
              <CardTitle className="text-2xl">{tLogin("alreadySignedInTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {tLogin("alreadySignedInDescription")}
              </p>
              <Link
                href="/"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {tCommon("goBack")}
              </Link>
            </CardContent>
          </Card>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
