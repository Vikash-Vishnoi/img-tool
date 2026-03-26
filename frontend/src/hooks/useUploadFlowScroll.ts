import { useCallback, useRef } from "react";

export function useUploadFlowScroll() {
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const hasAutoFocusedOptionsRef = useRef<boolean>(false);

  const onUpload = useCallback(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile || hasAutoFocusedOptionsRef.current) return;

    hasAutoFocusedOptionsRef.current = true;

    window.setTimeout(() => {
      optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, []);

  const resetUploadFlow = useCallback(() => {
    hasAutoFocusedOptionsRef.current = false;
  }, []);

  return {
    optionsRef,
    onUpload,
    resetUploadFlow,
  };
}
