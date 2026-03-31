import { useCallback, useEffect, useRef } from "react";

const MAX_WAIT_FRAMES = 10;

export function useUploadFlowScroll() {
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const hasAutoFocusedOptionsRef = useRef<boolean>(false);
  const pendingFrameRef = useRef<number | null>(null);

  const cancelPendingScrollAttempt = useCallback(() => {
    if (pendingFrameRef.current === null) return;

    window.cancelAnimationFrame(pendingFrameRef.current);
    pendingFrameRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cancelPendingScrollAttempt();
    };
  }, [cancelPendingScrollAttempt]);

  const onUpload = useCallback(() => {
    if (hasAutoFocusedOptionsRef.current) return;
    if (typeof window === "undefined") return;

    hasAutoFocusedOptionsRef.current = true;
    cancelPendingScrollAttempt();

    let frameCount = 0;

    const attemptScroll = () => {
      const el = optionsRef.current;

      if (!el) {
        if (frameCount < MAX_WAIT_FRAMES) {
          frameCount += 1;
          pendingFrameRef.current = window.requestAnimationFrame(attemptScroll);
        }
        return;
      }

      const topOffset = window.matchMedia("(max-width: 767px)").matches ? 72 : 88;
      el.style.scrollMarginTop = `${topOffset}px`;
      el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      pendingFrameRef.current = null;
    };

    pendingFrameRef.current = window.requestAnimationFrame(attemptScroll);
  }, [cancelPendingScrollAttempt]);

  const resetUploadFlow = useCallback(() => {
    cancelPendingScrollAttempt();
    hasAutoFocusedOptionsRef.current = false;
  }, [cancelPendingScrollAttempt]);

  return {
    optionsRef,
    onUpload,
    resetUploadFlow,
  };
}
