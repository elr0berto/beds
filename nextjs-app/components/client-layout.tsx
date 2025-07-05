"use client";

import { LoadingProvider } from "./loading-context";
import { NavigationLoading } from "./navigation-loading";
import { LoadingOverlay } from "./ui/loading-overlay";
import { useLoading } from "./loading-context";

function LoadingOverlayContainer() {
  const { isLoading } = useLoading();
  return <LoadingOverlay isLoading={isLoading} />;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <NavigationLoading />
      <LoadingOverlayContainer />
      {children}
    </LoadingProvider>
  );
}