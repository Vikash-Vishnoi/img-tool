"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { LazyAppDropdown as AppDropdown } from "@/components/LazyAppDropdown";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { useConversion } from "@/hooks/useConversion";
import { useUploadFlowScroll } from "@/hooks/useUploadFlowScroll";
import type { ImageToPdfPageSize } from "@/lib/imageToPdfRuntime";
import { downloadBlob, formatFileSize, shareFileToWhatsApp } from "@/lib/utils";

type PageSize = ImageToPdfPageSize;

export type ImageToPdfClientProps = {
  title?: string;
  description?: string;
  inputLabel?: string;
  accept?: string[];
  uploadHelperText?: string;
};

const MAX_SIZE_BYTES = 100 * 1024 * 1024;

const RemoveButton = dynamic(
  () => import("@/components/RemoveButton").then((mod) => mod.RemoveButton),
  { ssr: false }
);

function swapItems<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items;
  }

  const next = [...items];
  const temp = next[from];
  next[from] = next[to];
  next[to] = temp;
  return next;
}

function pageSizeLabel(size: PageSize): string {
  if (size === "image-fit") return "Same as image (fit)";
  if (size === "a3") return "A3 (297 x 420 mm)";
  if (size === "a5") return "A5 (148 x 210 mm)";
  if (size === "letter") return "Letter (8.5 x 11 in)";
  if (size === "legal") return "Legal (8.5 x 14 in)";
  return "A4 (210 x 297 mm)";
}

export function ImageToPdfClient({
  title = "Image to PDF Converter",
  description = "Combine multiple images into one PDF in your browser. Files never leave your device.",
  inputLabel = "Upload images",
  accept: acceptProp,
  uploadHelperText,
}: ImageToPdfClientProps) {
  const conversion = useConversion();
  const autoDownloadKeyRef = useRef<string>("");
  const previewUrlByFileRef = useRef<Map<File, string>>(new Map());
  const { optionsRef, onUpload, resetUploadFlow } = useUploadFlowScroll();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [marginMm, setMarginMm] = useState<number>(10);
  const [jpegQualityPercent, setJpegQualityPercent] = useState<number>(100);

  const accept = useMemo(
    () =>
      acceptProp ?? [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
        "image/heic",
        "image/heif",
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".avif",
        ".heic",
        ".heif",
      ],
    [acceptProp]
  );

  const helperText =
    uploadHelperText ??
    `You can select multiple images (JPG, PNG, WebP, AVIF, HEIC). Max file size ${formatFileSize(MAX_SIZE_BYTES)} each (up to 30 images).`;

  const totalInputBytes = useMemo(
    () => conversion.inputFiles.reduce((sum, file) => sum + file.size, 0),
    [conversion.inputFiles]
  );

  const previews = useMemo(
    () => {
      const active = new Set(conversion.inputFiles);
      const previewMap = previewUrlByFileRef.current;

      for (const file of conversion.inputFiles) {
        if (!previewMap.has(file)) {
          previewMap.set(file, URL.createObjectURL(file));
        }
      }

      for (const [file, url] of previewMap) {
        if (active.has(file)) continue;
        URL.revokeObjectURL(url);
        previewMap.delete(file);
      }

      return conversion.inputFiles.map((file) => ({
        file,
        url: previewMap.get(file) ?? "",
      }));
    },
    [conversion.inputFiles]
  );

  useEffect(() => {
    const previewMap = previewUrlByFileRef.current;

    return () => {
      for (const url of previewMap.values()) {
        URL.revokeObjectURL(url);
      }
      previewMap.clear();
    };
  }, []);

  useEffect(() => {
    if (previewIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewIndex(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewIndex]);

  useEffect(() => {
    if (conversion.status !== "success") return;
    if (conversion.outputs.length === 0) return;

    const key = conversion.outputs
      .map((o) => `${o.filename}:${o.blob.size}:${o.mimeType}`)
      .join("|");

    if (!key || autoDownloadKeyRef.current === key) return;
    autoDownloadKeyRef.current = key;

    conversion.outputs.forEach((out, index) => {
      window.setTimeout(() => {
        downloadBlob(out.blob, out.filename);
      }, index * 250);
    });
  }, [conversion.outputs, conversion.status]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2 text-center sm:space-y-3">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4cfc4] bg-[#ede8df] px-4 py-2 text-xs font-semibold text-[#6b6760]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8672a] text-white">✦</span>
          Browser-only conversion · private by default
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto hidden max-w-3xl text-pretty text-base leading-7 text-[#6b6760] sm:block">
          {description}
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
        <PrivacyBadge className="mb-5" />

        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 1</div>

        <FileUploader
          label={inputLabel}
          helperText={helperText}
          hideHelperTextOnMobile
          accept={accept}
          multiple
          maxFiles={30}
          maxSizeBytes={MAX_SIZE_BYTES}
          onFiles={(files) => {
            const merged = [...conversion.inputFiles, ...files];
            conversion.setInputFiles(merged.slice(0, 30));
            onUpload();
          }}
        />

        {conversion.inputFiles.length > 0 ? (
          <div ref={optionsRef} className="mb-5 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 2</div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Page size</div>
              <div className="mt-2">
                <AppDropdown
                  value={pageSize}
                  onChange={(value) => setPageSize(value)}
                  ariaLabel="Page size"
                  options={(["a4", "letter", "legal", "a3", "a5", "image-fit"] as PageSize[]).map((size) => ({
                    value: size,
                    label: pageSizeLabel(size),
                  }))}
                />
              </div>
              <div className="mt-2 text-xs text-[#6b6760]">
                {pageSize === "image-fit"
                  ? "Each PDF page uses the original image dimensions (best fit)."
                  : "Standard paper-size output."}
              </div>
            </div>

            <label className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 3</div>
              <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">
                <span>Page margin</span>
                <span>{pageSize === "image-fit" ? "Not used" : `${Math.max(0, Math.min(30, marginMm))} mm`}</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={marginMm}
                onChange={(e) => setMarginMm(Number(e.currentTarget.value))}
                disabled={pageSize === "image-fit"}
                className="mt-3 w-full accent-[#e8672a] disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="mt-2 text-xs text-[#6b6760]">
                {pageSize === "image-fit"
                  ? "Margins are ignored in Same as image mode."
                  : "Applied to all pages."}
              </div>
            </label>

            <label className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 4</div>
              <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">
                <span>JPEG quality</span>
                <span>{Math.max(60, Math.min(100, jpegQualityPercent))}%</span>
              </div>
              <input
                type="range"
                min={60}
                max={100}
                step={1}
                value={jpegQualityPercent}
                onChange={(e) => setJpegQualityPercent(Number(e.currentTarget.value))}
                className="mt-3 w-full accent-[#e8672a]"
              />
            </label>
          </div>
        ) : null}

        {conversion.inputFiles.length > 0 ? (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-bold">
                Selected files: {conversion.inputFiles.length} ({formatFileSize(totalInputBytes)})
              </div>
              <button
                type="button"
                className="text-sm text-[#6b6760] underline underline-offset-4 hover:text-[#1c1a14]"
                onClick={() => {
                  setPreviewIndex(null);
                  conversion.reset();
                  resetUploadFlow();
                }}
              >
                Clear
              </button>
            </div>

            <ul className="mt-3 divide-y divide-[#ede8df] rounded-xl border border-[#d4cfc4] bg-[#fffdf9]">
              {previews.map(({ file, url }, index) => (
                <li key={`${file.name}-${file.size}-${index}`} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewIndex(index)}
                        className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#d4cfc4] bg-[linear-gradient(45deg,#f3eee4_25%,#fff_25%,#fff_50%,#f3eee4_50%,#f3eee4_75%,#fff_75%,#fff_100%)] bg-[length:16px_16px]"
                        aria-label={`Preview ${file.name}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={file.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain p-1 transition group-hover:scale-[1.03]"
                        />
                        <span className="pointer-events-none absolute bottom-1 right-1 rounded bg-[#1c1a14]/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          View
                        </span>
                      </button>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{file.name}</div>
                        <div className="text-xs text-[#6b6760]">
                          {formatFileSize(file.size)} · Page {index + 1}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          conversion.setInputFiles(swapItems(conversion.inputFiles, index, index - 1));
                        }}
                        className="rounded-lg border border-[#d4cfc4] px-2 py-1 text-xs disabled:opacity-40"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        disabled={index === conversion.inputFiles.length - 1}
                        onClick={() => {
                          conversion.setInputFiles(swapItems(conversion.inputFiles, index, index + 1));
                        }}
                        className="rounded-lg border border-[#d4cfc4] px-2 py-1 text-xs disabled:opacity-40"
                      >
                        Down
                      </button>
                                <RemoveButton
                                  compact
                                  onClick={() => {
                                    const next = conversion.inputFiles.filter((_, i) => i !== index);
                                    conversion.setInputFiles(next);
                                  }}
                                />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={!conversion.canRun}
                onClick={async () => {
                  await conversion.run(async ({ files, signal, onProgress }) => {
                    const safeQuality = Math.max(0.6, Math.min(1, jpegQualityPercent / 100));
                    const { buildPdfRuntime, derivePdfOutputBaseName } = await import("@/lib/imageToPdfRuntime");

                    const pdfBlob = await buildPdfRuntime({
                      files,
                      pageSize,
                      marginMm,
                      jpegQuality: safeQuality,
                      signal,
                      onProgress,
                    });

                    const base = derivePdfOutputBaseName(files);
                    return [
                      {
                        blob: pdfBlob,
                        filename: `${base}-combined.pdf`,
                        mimeType: "application/pdf",
                        originalBytes: totalInputBytes,
                      },
                    ];
                  });
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#e8672a] px-9 py-3.5 text-lg font-semibold text-white transition hover:bg-[#ff8c5a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Convert to PDF
              </button>

              {conversion.status === "running" ? (
                <button
                  type="button"
                  onClick={() => conversion.cancel()}
                  className="inline-flex items-center justify-center rounded-full border border-[#d4cfc4] px-7 py-3.5 text-lg font-medium transition hover:bg-[#f7f3ec]"
                >
                  Cancel
                </button>
              ) : null}

              <div className="text-sm text-[#6b6760]">
                {conversion.status === "running"
                  ? `Building PDF... ${conversion.progress}%`
                  : conversion.status === "success"
                    ? "PDF ready"
                    : null}
              </div>
            </div>

            {conversion.status === "running" ? (
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#ede8df]">
                  <div
                    className="h-full bg-[#e8672a] transition-[width]"
                    style={{ width: `${conversion.progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            {conversion.error ? (
              <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                {conversion.error}
              </div>
            ) : null}

            {conversion.outputs[0] ? (
              <div className="mt-6">
                <div className="text-sm font-bold">Downloads</div>
                <ul className="mt-3 divide-y divide-[#ede8df] rounded-xl border border-[#d4cfc4] bg-[#fffdf9]">
                  <li className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{conversion.outputs[0].filename}</div>
                      <div className="text-xs text-[#6b6760]">PDF · {formatFileSize(conversion.outputs[0].blob.size)}</div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#d4cfc4] bg-white px-3 py-1.5 text-xs font-medium transition hover:bg-[#f7f3ec]"
                        onClick={async () => {
                          const out = conversion.outputs[0];
                          if (!out) return;
                          const fileToShare =
                            out.blob instanceof File
                              ? out.blob
                              : new File([out.blob], out.filename, { type: out.mimeType });
                          await shareFileToWhatsApp(fileToShare);
                        }}
                      >
                        <span aria-hidden="true" className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#25D366] px-1 text-[10px] font-bold leading-none text-white">W</span>
                        Share
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-[#2a7a5e] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                        onClick={() =>
                          downloadBlob(conversion.outputs[0].blob, conversion.outputs[0].filename)
                        }
                      >
                        Download
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {previewIndex !== null && previews[previewIndex] ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1a14]/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewIndex(null)}
        >
          <div
            className="w-full max-w-5xl rounded-2xl border border-[#d4cfc4] bg-white p-3 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{previews[previewIndex].file.name}</div>
                <div className="text-xs text-[#6b6760]">
                  {formatFileSize(previews[previewIndex].file.size)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewIndex(null)}
                className="rounded-lg border border-[#d4cfc4] px-3 py-1.5 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="flex max-h-[75vh] items-center justify-center overflow-auto rounded-xl border border-[#d4cfc4] bg-[linear-gradient(45deg,#f3eee4_25%,#fff_25%,#fff_50%,#f3eee4_50%,#f3eee4_75%,#fff_75%,#fff_100%)] bg-[length:20px_20px] p-2">
              <div className="relative h-[70vh] w-full max-w-[90vw]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previews[previewIndex].url}
                  alt={previews[previewIndex].file.name}
                  loading="lazy"
                  decoding="async"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
