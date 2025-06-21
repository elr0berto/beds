import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Attempt to read the preferred locale from a cookie named "locale".
  // Fallback to English.
  const localeCookie = (await cookies()).get("locale")?.value;
  const locale = localeCookie === "en" ? "en" : "th";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
}); 