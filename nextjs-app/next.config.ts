import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* other Next.js config options can stay here */
};

// Enable next-intl plugin (default path: ./i18n/request.ts)
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
