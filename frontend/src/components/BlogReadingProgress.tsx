"use client";

import { useEffect, useState } from "react";

type BlogReadingProgressProps = {
  targetId?: string;
  topOffset?: number;
};

export default function BlogReadingProgress({
  targetId = "blog-article-content",
  topOffset = 62,
}: BlogReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      const target = document.getElementById(targetId);
      if (!target) {
        setProgress(0);
        frameId = 0;
        return;
      }

      const targetRect = target.getBoundingClientRect();
      const targetTop = window.scrollY + targetRect.top;
      const start = targetTop - topOffset;
      const end = targetTop + target.offsetHeight - window.innerHeight;
      const total = Math.max(end - start, 1);
      const next = ((window.scrollY - start) / total) * 100;

      setProgress(Math.max(0, Math.min(100, next)));
      frameId = 0;
    };

    const scheduleUpdate = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [targetId, topOffset]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 z-[59] h-[3px] w-full bg-[#d4cfc4]/50"
      style={{ top: `${topOffset}px` }}
    >
      <div
        className="h-full bg-[#e8672a] transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
