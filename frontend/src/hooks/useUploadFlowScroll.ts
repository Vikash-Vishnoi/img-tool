import { useCallback, useRef } from "react";

export function useUploadFlowScroll() {
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const hasAutoFocusedOptionsRef = useRef<boolean>(false);

  const onUpload = useCallback(() => {
    if (hasAutoFocusedOptionsRef.current) return;

    hasAutoFocusedOptionsRef.current = true;

    window.setTimeout(() => {
      const el = optionsRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const topOffset = window.matchMedia("(max-width: 767px)").matches ? 72 : 88;
      const isAlreadyWellPositioned = rect.top >= topOffset && rect.top <= topOffset + 80;

      if (isAlreadyWellPositioned) return;

      const targetTop = Math.max(0, window.scrollY + rect.top - topOffset);
      window.scrollTo({ top: targetTop, behavior: "smooth" });
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
