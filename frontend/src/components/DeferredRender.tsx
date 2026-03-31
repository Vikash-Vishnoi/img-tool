"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const OBSERVER_ROOT_MARGIN = "280px 0px";
const PLACEHOLDER_MIN_HEIGHT = 320;
const DEFERRED_FAQ_STYLESHEET_HREF = "/deferred-faq.css";

let deferredFaqStylesReady = false;
let deferredFaqStylesPromise: Promise<void> | null = null;

function ensureDeferredFaqStylesheet(): Promise<void> {
  if (deferredFaqStylesReady || typeof document === "undefined") {
    return Promise.resolve();
  }

  if (deferredFaqStylesPromise) {
    return deferredFaqStylesPromise;
  }

  deferredFaqStylesPromise = new Promise((resolve) => {
    const existing = document.head.querySelector<HTMLLinkElement>(
      'link[data-deferred-faq-css="true"]'
    );

    if (existing) {
      if (existing.dataset.loaded === "true") {
        deferredFaqStylesReady = true;
        resolve();
        return;
      }

      const markReady = () => {
        existing.dataset.loaded = "true";
        deferredFaqStylesReady = true;
        resolve();
      };

      existing.addEventListener("load", markReady, { once: true });
      existing.addEventListener("error", markReady, { once: true });
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = DEFERRED_FAQ_STYLESHEET_HREF;
    link.dataset.deferredFaqCss = "true";

    const markReady = () => {
      link.dataset.loaded = "true";
      deferredFaqStylesReady = true;
      resolve();
    };

    link.addEventListener("load", markReady, { once: true });
    link.addEventListener("error", markReady, { once: true });
    document.head.appendChild(link);
  });

  return deferredFaqStylesPromise;
}

export type DeferredRenderProps = {
  children: ReactNode;
};

export function DeferredRender({ children }: DeferredRenderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [areDeferredStylesReady, setAreDeferredStylesReady] = useState(deferredFaqStylesReady);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const shouldRender = isVisible && areDeferredStylesReady;

  useEffect(() => {
    if (isVisible) return;

    const host = hostRef.current;
    if (!host) return;

    if (typeof IntersectionObserver === "undefined") {
      const timeoutId = globalThis.setTimeout(() => {
        setIsVisible(true);
      }, 0);

      return () => {
        globalThis.clearTimeout(timeoutId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: OBSERVER_ROOT_MARGIN,
        threshold: 0.01,
      }
    );

    observer.observe(host);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || areDeferredStylesReady) return;

    let isCancelled = false;

    ensureDeferredFaqStylesheet().then(() => {
      if (!isCancelled) {
        setAreDeferredStylesReady(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [areDeferredStylesReady, isVisible]);

  return (
    <div
      ref={hostRef}
      className="deferred-content"
      style={shouldRender ? undefined : { minHeight: `${PLACEHOLDER_MIN_HEIGHT}px` }}
    >
      {shouldRender ? children : null}
    </div>
  );
}
