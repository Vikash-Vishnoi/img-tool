import { useCallback, useMemo, useRef, useState } from "react";

export type ConversionStatus = "idle" | "running" | "success" | "error";

export type ConversionOutput = {
  blob: Blob;
  filename: string;
  mimeType: string;
  originalBytes?: number;
  originalName?: string;
};

export type ConverterFn = (args: {
  files: File[];
  signal: AbortSignal;
  onProgress: (percent: number) => void;
}) => Promise<ConversionOutput[]>;

export type UseConversionState = {
  status: ConversionStatus;
  progress: number;
  error: string | null;
  inputFiles: File[];
  outputs: ConversionOutput[];

  setInputFiles: (files: File[]) => void;
  reset: () => void;
  run: (converter: ConverterFn) => Promise<void>;
  cancel: () => void;

  canRun: boolean;
};

export function useConversion(): UseConversionState {
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [outputs, setOutputs] = useState<ConversionOutput[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    setStatus("idle");
    setProgress(0);
    setError(null);
    setOutputs([]);
    setInputFiles([]);
  }, []);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    setStatus("idle");
    setProgress(0);
  }, []);

  const run = useCallback(
    async (converter: ConverterFn) => {
      if (status === "running") return;

      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          window.scrollBy({ top: 120, behavior: "smooth" });
        }, 60);
      }

      setStatus("running");
      setProgress(0);
      setError(null);
      setOutputs([]);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const result = await converter({
          files: inputFiles,
          signal: controller.signal,
          onProgress: (percent) => {
            const safe = Number.isFinite(percent)
              ? Math.max(0, Math.min(100, percent))
              : 0;
            setProgress(safe);
          },
        });

        if (controller.signal.aborted) return;

        setOutputs(result);
        setProgress(100);
        setStatus("success");
      } catch (caught) {
        if (controller.signal.aborted) return;

        const message =
          caught instanceof Error
            ? caught.message
            : typeof caught === "string"
              ? caught
              : "Conversion failed";

        setError(message);
        setStatus("error");
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [inputFiles, status]
  );

  const canRun = useMemo(() => inputFiles.length > 0 && status !== "running", [
    inputFiles.length,
    status,
  ]);

  return {
    status,
    progress,
    error,
    inputFiles,
    outputs,
    setInputFiles,
    reset,
    run,
    cancel,
    canRun,
  };
}
