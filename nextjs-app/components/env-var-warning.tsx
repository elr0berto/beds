import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { getTranslations } from "next-intl/server";

export async function EnvVarWarning() {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("EnvVarWarning");

  return (
    <div className="flex gap-4 items-center">
      <Badge variant={"outline"} className="font-normal">
        {t("supabaseEnvVarsRequired")}
      </Badge>
      <div className="flex gap-2">
        <Button size="sm" variant={"outline"} disabled>
          {tCommon("signIn")}
        </Button>
        <Button size="sm" variant={"default"} disabled>
          {tCommon("signUp")}
        </Button>
      </div>
    </div>
  );
}
