"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

export type FileUploaderProps = {
  accept?: string[];
  multiple?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  onFiles: (files: File[]) => void;
};

type ValidationResult = {
  accepted: File[];
  rejected: Array<{ fileName: string; reason: string }>;
};

function matchesAccept(file: File, accept: string[] | undefined): boolean {
  if (!accept || accept.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type;

  return accept.some((rule) => {
    const normalized = rule.trim().toLowerCase();
    if (!normalized) return false;

    if (normalized.startsWith(".")) {
      return fileName.endsWith(normalized);
    }

    if (normalized.endsWith("/*")) {
      const prefix = normalized.slice(0, -2);
      return fileType.toLowerCase().startsWith(`${prefix}/`);
    }

    return fileType.toLowerCase() === normalized;
  });
}

function validateFiles(args: {
  files: File[];
  accept?: string[];
  multiple: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
}): ValidationResult {
  const { files, accept, multiple, maxFiles, maxSizeBytes } = args;

  const limited = multiple ? files : files.slice(0, 1);
  const capped = typeof maxFiles === "number" ? limited.slice(0, maxFiles) : limited;

  const accepted: File[] = [];
  const rejected: Array<{ fileName: string; reason: string }> = [];

  for (const file of capped) {
    if (!matchesAccept(file, accept)) {
      rejected.push({ fileName: file.name, reason: "File type not allowed" });
      continue;
    }

    if (typeof maxSizeBytes === "number" && file.size > maxSizeBytes) {
      rejected.push({ fileName: file.name, reason: "File is too large" });
      continue;
    }

    accepted.push(file);
  }

  if (typeof maxFiles === "number" && limited.length > maxFiles) {
    rejected.push({
      fileName: "",
      reason: `Too many files (max ${maxFiles})`,
    });
  }

  return { accepted, rejected };
}

export function FileUploader({
  accept,
  multiple = true,
  maxFiles,
  maxSizeBytes,
  disabled = false,
  label = "Upload images",
  helperText = "Drag & drop, tap to choose, or paste from clipboard.",
  onFiles,
}: FileUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const acceptAttr = useMemo(() => (accept && accept.length ? accept.join(",") : undefined), [
    accept,
  ]);

  const pushFiles = useCallback(
    (files: File[]) => {
      if (disabled) return;

      const { accepted, rejected } = validateFiles({
        files,
        accept,
        multiple,
        maxFiles,
        maxSizeBytes,
      });

      setErrors(rejected.map((r) => (r.fileName ? `${r.fileName}: ${r.reason}` : r.reason)));

      if (accepted.length > 0) {
        onFiles(accepted);
      }
    },
    [accept, disabled, maxFiles, maxSizeBytes, multiple, onFiles]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const dropped = Array.from(event.dataTransfer.files ?? []);
      if (dropped.length > 0) pushFiles(dropped);
    },
    [pushFiles]
  );

  const onPaste = useCallback(
    (event: ClipboardEvent) => {
      if (disabled) return;
      if (!event.clipboardData) return;

      const pastedFiles = Array.from(event.clipboardData.files ?? []);
      if (pastedFiles.length === 0) return;

      event.preventDefault();
      pushFiles(pastedFiles);
    },
    [disabled, pushFiles]
  );

  useEffect(() => {
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [onPaste]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-4">
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
        {accept?.length ? (
          <span className="text-xs text-foreground/60">{accept.join(", ")}</span>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="sr-only"
        accept={acceptAttr}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          const files = Array.from(e.currentTarget.files ?? []);
          if (files.length > 0) pushFiles(files);
          e.currentTarget.value = "";
        }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        className={
          "relative flex w-full flex-col items-center justify-center gap-2 rounded-2xl border p-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:cursor-not-allowed disabled:opacity-60 " +
          (isDragging
            ? "border-foreground/30 bg-foreground/[0.04]"
            : "border-foreground/15 bg-background hover:bg-foreground/[0.03]")
        }
        aria-label={label}
      >
        <div className="text-sm font-medium">Drag & drop files here</div>
        <div className="text-xs text-foreground/70">{helperText}</div>
        <div className="mt-2 inline-flex items-center rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background">
          Choose files
        </div>
      </button>

      {errors.length > 0 ? (
        <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
          <div className="font-medium">Upload error</div>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
