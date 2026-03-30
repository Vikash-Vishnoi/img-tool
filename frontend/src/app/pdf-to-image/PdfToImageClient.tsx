"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppDropdown } from "@/components/AppDropdown";
import { FileUploader } from "@/components/FileUploader";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { RemoveButton } from "@/components/RemoveButton";
import { useConversion } from "@/hooks/useConversion";
import { useUploadFlowScroll } from "@/hooks/useUploadFlowScroll";
import type { PdfToImageOutputFormat } from "@/lib/pdfToImageRuntime";
import { downloadBlob, formatFileSize } from "@/lib/utils";

type OutputFormat = PdfToImageOutputFormat;

export type PdfToImageClientProps = {
  title?: string;
  description?: string;
  defaultOutputFormat?: OutputFormat;
  lockOutputFormat?: boolean;
};

const MAX_SIZE_BYTES = 100 * 1024 * 1024;

function formatLabel(format: OutputFormat): string {
  if (format === "jpg") return "JPG";
  if (format === "png") return "PNG";
  if (format === "webp") return "WebP";
  return "AVIF";
}

function supportsQuality(format: OutputFormat): boolean {
  return format === "jpg" || format === "webp" || format === "avif";
}

export function PdfToImageClient({
  title = "PDF to Image Converter",
  description =
    "Upload a PDF, choose output type (JPG, PNG, WebP, AVIF), and download each page as an image.",
  defaultOutputFormat = "jpg",
  lockOutputFormat = false,
}: PdfToImageClientProps = {}) {
  const conversion = useConversion();
  const { optionsRef, onUpload, resetUploadFlow } = useUploadFlowScroll();

  const [outputFormat, setOutputFormat] = useState<OutputFormat>(defaultOutputFormat);
  const [qualityPercent, setQualityPercent] = useState<number>(100);
  const renderScale = 2;

  const runStepRef = useRef<HTMLDivElement | null>(null);
  const downloadsRef = useRef<HTMLDivElement | null>(null);

  const accept = useMemo(() => ["application/pdf", ".pdf"], []);
  const totalOutputBytes = useMemo(
    () => conversion.outputs.reduce((sum, out) => sum + out.blob.size, 0),
    [conversion.outputs]
  );

  const shouldAutoScroll = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  useEffect(() => {
    if (conversion.status !== "success") return;
    if (!shouldAutoScroll()) return;
    downloadsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [conversion.status]);

  useEffect(() => {
    setOutputFormat(defaultOutputFormat);
  }, [defaultOutputFormat]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4cfc4] bg-[#ede8df] px-4 py-2 text-xs font-semibold text-[#6b6760]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8672a] text-white">✦</span>
          PDF pages to images · browser-only
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

        {conversion.inputFiles.length === 0 ? (
          <FileUploader
            label="Upload PDF"
            helperText={`Upload one PDF (max ${formatFileSize(MAX_SIZE_BYTES)}).`}
            accept={accept}
            multiple={false}
            maxFiles={1}
            maxSizeBytes={MAX_SIZE_BYTES}
            onFiles={(files) => {
              conversion.setInputFiles(files.slice(0, 1));
              if (shouldAutoScroll()) {
                onUpload();
              }
            }}
          />
        ) : (
          <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold">Selected file</div>
              <button
                type="button"
                className="text-sm text-[#6b6760] underline underline-offset-4 hover:text-[#1c1a14]"
                onClick={() => {
                  conversion.reset();
                  resetUploadFlow();
                }}
              >
                Clear
              </button>
            </div>

            <ul className="mt-3 divide-y divide-[#ede8df] rounded-xl border border-[#d4cfc4] bg-white">
              {conversion.inputFiles.map((file, index) => (
                <li key={`${file.name}-${file.size}-${index}`} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{file.name}</div>
                      <div className="text-xs text-[#6b6760]">{formatFileSize(file.size)}</div>
                    </div>
                    <RemoveButton
                      compact
                      onClick={() => {
                        conversion.setInputFiles([]);
                        resetUploadFlow();
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {conversion.inputFiles.length > 0 ? (
          <div ref={optionsRef} className="mb-5 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 2</div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Output image type</div>
              <div className="mt-2">
                {lockOutputFormat ? (
                  <div className="inline-flex min-w-[122px] items-center justify-center rounded-lg border border-[#d4cfc4] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c1a14]">
                    {formatLabel(outputFormat)}
                  </div>
                ) : (
                  <AppDropdown
                    value={outputFormat}
                    onChange={(value) => {
                      setOutputFormat(value);
                      if (shouldAutoScroll()) {
                        runStepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    ariaLabel="Output image format"
                    options={(["jpg", "png", "webp", "avif"] as OutputFormat[]).map((value) => ({
                      value,
                      label: formatLabel(value),
                    }))}
                  />
                )}
              </div>
              <div className="mt-2 text-xs text-[#6b6760]">
                PNG keeps transparency. JPG is best compatibility.
              </div>
            </div>

            <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 3</div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Image quality</div>
                <div className="text-sm text-[#6b6760]">{qualityPercent}%</div>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                step={1}
                value={qualityPercent}
                onChange={(e) => setQualityPercent(Number(e.currentTarget.value))}
                disabled={!supportsQuality(outputFormat)}
                className="mt-3 w-full accent-[#e8672a] disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="mt-2 text-xs text-[#6b6760]">
                {supportsQuality(outputFormat)
                  ? "Lower quality can reduce output size."
                  : "PNG uses lossless quality."}
              </div>
            </div>
          </div>
        ) : null}

        {conversion.inputFiles.length > 0 ? (
          <div ref={runStepRef} className="mt-6">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 4</div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={!conversion.canRun}
                onClick={async () => {
                  await conversion.run(async ({ files, signal, onProgress }) => {
                    const sourceFile = files[0];
                    if (!sourceFile) return [];

                    const { convertPdfToImagesRuntime } = await import("@/lib/pdfToImageRuntime");

                    const outputs = await convertPdfToImagesRuntime({
                      file: sourceFile,
                      format: outputFormat,
                      qualityPercent,
                      scale: renderScale,
                      signal,
                      onProgress,
                    });

                    return outputs.map((o) => ({
                      blob: o.blob,
                      filename: o.filename,
                      mimeType: o.mimeType,
                      originalBytes: sourceFile.size,
                      originalName: sourceFile.name,
                    }));
                  });
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#e8672a] px-9 py-3.5 text-lg font-semibold text-white transition hover:bg-[#ff8c5a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Convert PDF to {formatLabel(outputFormat)}
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
                  ? `Converting pages... ${conversion.progress}%`
                  : conversion.status === "success"
                    ? `Done (${conversion.outputs.length} page${conversion.outputs.length > 1 ? "s" : ""})`
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

            {conversion.outputs.length > 0 ? (
              <div ref={downloadsRef} className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold">
                    Downloads ({conversion.outputs.length} files · {formatFileSize(totalOutputBytes)})
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-[#2a7a5e] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                    onClick={() => {
                      conversion.outputs.forEach((out, index) => {
                        window.setTimeout(() => {
                          downloadBlob(out.blob, out.filename);
                        }, index * 180);
                      });
                    }}
                  >
                    Download all
                  </button>
                </div>

                <ul className="mt-3 divide-y divide-[#ede8df] rounded-xl border border-[#d4cfc4] bg-[#fffdf9]">
                  {conversion.outputs.map((out, index) => (
                    <li
                      key={`${out.filename}-${out.blob.size}-${index}`}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{out.filename}</div>
                        <div className="text-xs text-[#6b6760]">
                          Page {index + 1} · {formatFileSize(out.blob.size)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-[#d4cfc4] px-3 py-1.5 text-xs font-semibold hover:bg-[#f7f3ec]"
                        onClick={() => downloadBlob(out.blob, out.filename)}
                      >
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
