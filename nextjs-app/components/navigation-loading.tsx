"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "./loading-context";

export function NavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // Hide loading when the route changes (page has loaded)
    setIsLoading(false);
  }, [pathname, searchParams, setIsLoading]);

  useEffect(() => {
    // Intercept link clicks to show loading state
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");
      
      if (link && link.href && !link.href.startsWith("#") && !link.href.startsWith("mailto:") && !link.href.startsWith("tel:")) {
        // Check if it's an internal link
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          setIsLoading(true);
        }
      }
    };

    // Intercept form submissions to show loading state
    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      if (form && form.action) {
        setIsLoading(true);
      }
    };

    // Add event listeners
    document.addEventListener("click", handleLinkClick);
    document.addEventListener("submit", handleFormSubmit);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, [setIsLoading]);

  return null;
}