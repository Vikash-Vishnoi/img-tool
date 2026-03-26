"use client";

import NextImage from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppDropdown } from "@/components/AppDropdown";
import { FileUploader } from "@/components/FileUploader";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { RemoveButton } from "@/components/RemoveButton";
import { useConversion } from "@/hooks/useConversion";
import { useUploadFlowScroll } from "@/hooks/useUploadFlowScroll";
import { downloadBlob, formatFileSize, shareFileToWhatsApp } from "@/lib/utils";

type PageSize = "a3" | "a4" | "a5" | "letter" | "legal" | "image-fit";

export type ImageToPdfClientProps = {
  title?: string;
  description?: string;
  inputLabel?: string;
  accept?: string[];
  uploadHelperText?: string;
};

const MAX_SIZE_BYTES = 100 * 1024 * 1024;

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

function stripExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx > 0 ? name.slice(0, idx) : name;
}

function isHeicLike(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".heic") || name.endsWith(".heif")) return true;

  const type = file.type.toLowerCase();
  return type === "image/heic" || type === "image/heif";
}

async function convertHeicToPngFile(args: {
  file: File;
  signal: AbortSignal;
}): Promise<File> {
  const { file, signal } = args;
  if (signal.aborted) throw new Error("PDF conversion cancelled");

  const { default: heic2any } = await import("heic2any");
  const converted = await heic2any({
    blob: file,
    toType: "image/png",
  });

  if (signal.aborted) throw new Error("PDF conversion cancelled");

  const blob = Array.isArray(converted) ? converted[0] : converted;
  if (!(blob instanceof Blob)) {
    throw new Error(`Could not convert HEIC file: ${file.name}`);
  }

  return new File([blob], `${stripExtension(file.name)}.png`, {
    type: "image/png",
  });
}

function pageSizeLabel(size: PageSize): string {
  if (size === "image-fit") return "Same as image (fit)";
  if (size === "a3") return "A3 (297 x 420 mm)";
  if (size === "a5") return "A5 (148 x 210 mm)";
  if (size === "letter") return "Letter (8.5 x 11 in)";
  if (size === "legal") return "Legal (8.5 x 14 in)";
  return "A4 (210 x 297 mm)";
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.decoding = "async";

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read image: ${file.name}`));
    };

    img.src = url;
  });
}

async function toJpegDataUrl(file: File, quality: number): Promise<{
  dataUrl: string;
  width: number;
  height: number;
}> {
  const img = await loadImage(file);

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid image dimensions: ${file.name}`);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image canvas");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL("image/jpeg", quality),
    width,
    height,
  };
}

async function buildPdf(args: {
  files: File[];
  pageSize: PageSize;
  marginMm: number;
  jpegQuality: number;
  signal: AbortSignal;
  onProgress: (percent: number) => void;
}): Promise<Blob> {
  const { files, pageSize, marginMm, jpegQuality, signal, onProgress } = args;

  const { jsPDF } = await import("jspdf");

  let doc: InstanceType<typeof jsPDF> | null = null;
  const safeMargin = Math.max(0, Math.min(30, marginMm));

  for (let i = 0; i < files.length; i += 1) {
    if (signal.aborted) {
      throw new Error("PDF conversion cancelled");
    }

    const inputFile = files[i];
    const source = isHeicLike(inputFile)
      ? await convertHeicToPngFile({ file: inputFile, signal })
      : inputFile;

    const { dataUrl, width, height } = await toJpegDataUrl(source, jpegQuality);

    if (!doc) {
      if (pageSize === "image-fit") {
        doc = new jsPDF({
          orientation: width >= height ? "landscape" : "portrait",
          unit: "px",
          format: [width, height],
          compress: true,
        });
      } else {
        doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: pageSize,
          compress: true,
        });
      }
    }

    if (pageSize === "image-fit") {
      if (i > 0) {
        doc.addPage([width, height], width >= height ? "landscape" : "portrait");
      }

      doc.addImage(dataUrl, "JPEG", 0, 0, width, height, undefined, "FAST");
      onProgress(Math.round(((i + 1) / files.length) * 100));
      continue;
    }

    if (i > 0) {
      doc.addPage(pageSize, "portrait");
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = Math.max(1, pageWidth - safeMargin * 2);
    const usableHeight = Math.max(1, pageHeight - safeMargin * 2);

    const imageRatio = width / height;
    const boxRatio = usableWidth / usableHeight;

    let drawWidth = usableWidth;
    let drawHeight = usableHeight;

    if (imageRatio > boxRatio) {
      drawHeight = drawWidth / imageRatio;
    } else {
      drawWidth = drawHeight * imageRatio;
    }

    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    doc.addImage(dataUrl, "JPEG", x, y, drawWidth, drawHeight, undefined, "FAST");
    onProgress(Math.round(((i + 1) / files.length) * 100));
  }

  if (!doc) {
    throw new Error("No files to convert");
  }

  const arrayBuffer = doc.output("arraybuffer");
  return new Blob([arrayBuffer], { type: "application/pdf" });
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
    () =>
      conversion.inputFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [conversion.inputFiles]
  );

  useEffect(() => {
    return () => {
      previews.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, [previews]);

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
      <header className="space-y-3 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4cfc4] bg-[#ede8df] px-4 py-2 text-xs font-semibold text-[#6b6760]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8672a] text-white">✦</span>
          Browser-only conversion · private by default
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-[#6b6760]">
          {description}
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
        <PrivacyBadge className="mb-5" />

        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 1</div>

        <FileUploader
          label={inputLabel}
          helperText={helperText}
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
                        <NextImage
                          src={url}
                          alt={file.name}
                          fill
                          sizes="80px"
                          unoptimized
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
                    const pdfBlob = await buildPdf({
                      files,
                      pageSize,
                      marginMm,
                      jpegQuality: safeQuality,
                      signal,
                      onProgress,
                    });

                    const base = files[0] ? stripExtension(files[0].name) : "images";
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
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 text-[#25D366]" fill="currentColor">
                          <path d="M20.52 3.48A11.85 11.85 0 0 0 12.08 0C5.5 0 .15 5.34.15 11.9c0 2.1.55 4.16 1.6 5.98L0 24l6.31-1.65a11.9 11.9 0 0 0 5.77 1.47h.01c6.57 0 11.92-5.34 11.92-11.9a11.8 11.8 0 0 0-3.49-8.44Zm-8.44 18.32h-.01a9.93 9.93 0 0 1-5.06-1.39l-.36-.21-3.75.98 1-3.65-.24-.37a9.9 9.9 0 0 1-1.53-5.24c0-5.5 4.49-9.98 10-9.98 2.67 0 5.18 1.04 7.06 2.92a9.9 9.9 0 0 1 2.93 7.06c0 5.5-4.49 9.98-10.01 9.98Zm5.47-7.47c-.3-.15-1.77-.88-2.04-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52 0 1.48 1.08 2.92 1.23 3.12.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.03-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                        </svg>
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
                <NextImage
                  src={previews[previewIndex].url}
                  alt={previews[previewIndex].file.name}
                  fill
                  sizes="(max-width: 640px) 95vw, 80vw"
                  unoptimized
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
