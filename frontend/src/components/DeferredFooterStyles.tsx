"use client";

import { useEffect, useRef } from "react";

const DEFERRED_FOOTER_STYLESHEET_HREF = "/deferred-footer.css";
const FOOTER_STYLES_ROOT_MARGIN = "900px 0px";

let deferredFooterStylesReady = false;
let deferredFooterStylesPromise: Promise<void> | null = null;

function ensureDeferredFooterStylesheet(): Promise<void> {
  if (deferredFooterStylesReady || typeof document === "undefined") {
    return Promise.resolve();
  }

  if (deferredFooterStylesPromise) {
    return deferredFooterStylesPromise;
  }

  deferredFooterStylesPromise = new Promise((resolve) => {
    const existing = document.head.querySelector<HTMLLinkElement>(
      'link[data-deferred-footer-css="true"]'
    );

    if (existing) {
      if (existing.dataset.loaded === "true") {
        deferredFooterStylesReady = true;
        resolve();
        return;
      }

      const markReady = () => {
        existing.dataset.loaded = "true";
        deferredFooterStylesReady = true;
        resolve();
      };

      existing.addEventListener("load", markReady, { once: true });
      existing.addEventListener("error", markReady, { once: true });
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = DEFERRED_FOOTER_STYLESHEET_HREF;
    link.dataset.deferredFooterCss = "true";

    const markReady = () => {
      link.dataset.loaded = "true";
      deferredFooterStylesReady = true;
      resolve();
    };

    link.addEventListener("load", markReady, { once: true });
    link.addEventListener("error", markReady, { once: true });
    document.head.appendChild(link);
  });

  return deferredFooterStylesPromise;
}

export function DeferredFooterStyles() {
  const sentinelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (deferredFooterStylesReady) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (typeof IntersectionObserver === "undefined") {
      void ensureDeferredFooterStylesheet();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          void ensureDeferredFooterStylesheet();
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: FOOTER_STYLES_ROOT_MARGIN,
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <span
      ref={sentinelRef}
      aria-hidden
      style={{ display: "block", width: 0, height: 0 }}
    />
  );
}