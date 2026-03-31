"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const DEFAULT_ROOT_MARGIN = "280px 0px";
const DEFAULT_THRESHOLD = 0.01;

export type DeferredOnVisibleProps = {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  placeholderMinHeight?: number;
};

export default function DeferredOnVisible({
  children,
  className,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = DEFAULT_THRESHOLD,
  placeholderMinHeight,
}: DeferredOnVisibleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible) return;

    const host = hostRef.current;
    if (!host) return;

    if (typeof IntersectionObserver === "undefined") {
      const timeoutId = window.setTimeout(() => {
        setIsVisible(true);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
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
        rootMargin,
        threshold,
      }
    );

    observer.observe(host);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, rootMargin, threshold]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={
        isVisible || !placeholderMinHeight
          ? undefined
          : { minHeight: `${placeholderMinHeight}px` }
      }
    >
      {isVisible ? children : null}
    </div>
  );
}
