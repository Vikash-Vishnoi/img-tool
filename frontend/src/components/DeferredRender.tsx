"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type DeferredRenderProps = {
  children: ReactNode;
  placeholderClassName?: string;
  rootMargin?: string;
};

export function DeferredRender({
  children,
  placeholderClassName = "mt-8 min-h-[120px]",
  rootMargin = "320px 0px",
}: DeferredRenderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div ref={containerRef}>
      {shouldRender ? children : <div className={placeholderClassName} aria-hidden="true" />}
    </div>
  );
}
