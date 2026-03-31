"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BlogReadingProgress = dynamic(() => import("@/components/BlogReadingProgress"), {
  ssr: false,
});

export type DeferredBlogReadingProgressProps = {
  targetId?: string;
  topOffset?: number;
};

export default function DeferredBlogReadingProgress(props: DeferredBlogReadingProgressProps) {
  const [isEnabled, setIsEnabled] = useState(
    typeof window !== "undefined" ? window.scrollY > 0 : false
  );

  useEffect(() => {
    if (isEnabled) return;

    const enable = () => {
      setIsEnabled(true);
    };

    window.addEventListener("scroll", enable, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", enable);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return <BlogReadingProgress {...props} />;
}
