"use client";

import Script from "next/script";
import { Suspense, useEffect, useState } from "react";
import GoogleAnalyticsPageView from "@/components/GoogleAnalyticsPageView";

const ANALYTICS_FALLBACK_DELAY_MS = Number(
  process.env.NEXT_PUBLIC_ANALYTICS_FALLBACK_MS ?? "0"
);
const HAS_ANALYTICS_FALLBACK_DELAY =
  Number.isFinite(ANALYTICS_FALLBACK_DELAY_MS) && ANALYTICS_FALLBACK_DELAY_MS > 0;

export type DeferredAnalyticsProps = {
  gaId: string;
};

export function DeferredAnalytics({ gaId }: DeferredAnalyticsProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!gaId || isEnabled) return;

    const enableAnalytics = () => {
      setIsEnabled(true);
    };

    const interactionEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
      "wheel",
      "scroll",
    ];

    for (const eventName of interactionEvents) {
      window.addEventListener(eventName, enableAnalytics, { once: true });
    }

    const timeoutId = HAS_ANALYTICS_FALLBACK_DELAY
      ? window.setTimeout(enableAnalytics, ANALYTICS_FALLBACK_DELAY_MS)
      : null;

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      for (const eventName of interactionEvents) {
        window.removeEventListener(eventName, enableAnalytics);
      }
    };
  }, [gaId, isEnabled]);

  if (!isEnabled || !gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-gtag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView gaId={gaId} />
      </Suspense>
    </>
  );
}