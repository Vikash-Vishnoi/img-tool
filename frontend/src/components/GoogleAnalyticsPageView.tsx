"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GoogleAnalyticsPageViewProps = {
  gaId: string;
};

export default function GoogleAnalyticsPageView({
  gaId,
}: GoogleAnalyticsPageViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const didTrackInitialPage = useRef(false);

  useEffect(() => {
    if (!gaId) {
      return;
    }

    // The initial page view is handled by the base GA config script.
    if (!didTrackInitialPage.current) {
      didTrackInitialPage.current = true;
      return;
    }

    if (typeof window.gtag !== "function") {
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("config", gaId, {
      page_path: pagePath,
      anonymize_ip: true,
    });
  }, [gaId, pathname, searchParams]);

  return null;
}