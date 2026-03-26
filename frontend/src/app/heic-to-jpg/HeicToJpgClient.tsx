"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppDropdown } from "@/components/AppDropdown";
import { FileUploader } from "@/components/FileUploader";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { RemoveButton } from "@/components/RemoveButton";
import { useConversion } from "@/hooks/useConversion";
import { useUploadFlowScroll } from "@/hooks/useUploadFlowScroll";
import { convertImageFiles, type RasterFormat } from "@/lib/formatConvert";
import { heicFilesConvert, type HeicConvertFormat } from "@/lib/heicToJpg";
import { downloadBlob, formatFileSize } from "@/lib/utils";

const MAX_SIZE_BYTES = 100 * 1024 * 1024;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatLabel(format: HeicConvertFormat): string {
  if (format === "png") return "PNG";
  if (format === "webp") return "WebP";
  if (format === "avif") return "AVIF";
  return "JPG";
}

function toPercentChange(beforeBytes: number, afterBytes: number): number {
  if (beforeBytes <= 0) return 0;
  return Math.round(((beforeBytes - afterBytes) / beforeBytes) * 100);
}

function isHeicLike(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".heic") || name.endsWith(".heif")) return true;

  const type = file.type.toLowerCase();
  return type === "image/heic" || type === "image/heif";
}

function toRasterFormat(format: HeicConvertFormat): RasterFormat {
  if (format === "png") return "png";
  if (format === "webp") return "webp";
  if (format === "avif") return "avif";
  return "jpg";
}

export function HeicToJpgClient() {
  const conversion = useConversion();

  const [format, setFormat] = useState<HeicConvertFormat>("jpg");
  const [qualityPercent, setQualityPercent] = useState<number>(100);
  const autoDownloadKeyRef = useRef<string>("");
  const { optionsRef, onUpload, resetUploadFlow } = useUploadFlowScroll();

  const accept = useMemo(
    () => [
      ".heic",
      ".heif",
      "image/heic",
      "image/heif",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".avif",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ],
    []
  );

  const quality = useMemo(() => clamp(qualityPercent / 100, 0.5, 1), [qualityPercent]);

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
          iPhone HEIC support · no upload
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">
          HEIC Converter (JPG, PNG, WebP)
        </h1>
        <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-[#6b6760]">
          Convert iPhone HEIC photos instantly in your browser. Zero upload—your
          files never leave your device.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
        <PrivacyBadge className="mb-5" />

        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 1</div>

        <FileUploader
          label="Upload images"
          helperText={`Max file size ${formatFileSize(MAX_SIZE_BYTES)} each. Paste from clipboard also works.`}
          accept={accept}
          multiple
          maxFiles={20}
          maxSizeBytes={MAX_SIZE_BYTES}
          onFiles={(files) => {
            conversion.setInputFiles(files);
            onUpload();
          }}
        />

        <div ref={optionsRef} className="mb-5 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-h-[220px] rounded-xl border border-[#d4cfc4] bg-[#f7f3ec] p-6 text-center">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 2</div>
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Output format</div>
            <div className="mt-2 flex justify-center">
              <AppDropdown
                value={format}
                onChange={(value) => setFormat(value)}
                ariaLabel="Output format"
                options={(
                  ["jpg", "png", "webp", "avif"] as HeicConvertFormat[]
                ).map((value) => ({
                  value,
                  label: formatLabel(value),
                }))}
              />
            </div>
            <div className="mt-2 text-xs text-[#6b6760]">
              JPG = best compatibility · PNG = transparency · WebP = smaller files
            </div>
          </div>

          <div className="min-h-[220px] rounded-xl border border-[#d4cfc4] bg-[#f7f3ec] p-6 text-center">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 3</div>
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Quality</div>
            <div className="mt-1 text-sm text-[#6b6760]">{qualityPercent}%</div>

            <div className="mx-auto mt-3 max-w-md">
              <input
                type="range"
                min={50}
                max={100}
                step={1}
                value={qualityPercent}
                onChange={(e) => setQualityPercent(Number(e.currentTarget.value))}
                className="w-full accent-[#e8672a]"
              />
            </div>

            <div className="mt-2 text-xs text-[#6b6760]">
              Default 100% keeps quality. Lower only if you want smaller files.
            </div>
          </div>
        </div>

        {conversion.inputFiles.length > 0 ? (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-bold">Selected files</div>
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

            <ul className="mt-3 divide-y divide-[#ede8df] rounded-xl border border-[#d4cfc4] bg-[#fffdf9]">
              {conversion.inputFiles.map((file, index) => (
                <li key={`${file.name}-${file.size}-${index}`} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{file.name}</div>
                      <div className="text-xs text-[#6b6760]">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full border border-[#d4cfc4] bg-white px-2.5 py-1 text-xs font-semibold text-[#6b6760]">
                        Input
                      </span>
                      <RemoveButton
                        compact
                        onClick={() => {
                          conversion.setInputFiles(
                            conversion.inputFiles.filter((_, fileIndex) => fileIndex !== index)
                          );
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!conversion.canRun}
                onClick={async () => {
                  await conversion.run(async ({ files, signal, onProgress }) => {
                    const heicFiles = files.filter((f) => isHeicLike(f));
                    const nonHeicFiles = files.filter((f) => !isHeicLike(f));

                    const total = Math.max(1, files.length);
                    const outputs = [];
                    let processed = 0;

                    if (heicFiles.length > 0) {
                      const heicOutputs = await heicFilesConvert({
                        files: heicFiles,
                        format,
                        quality,
                        signal,
                        onProgress: (percent) => {
                          const heicDone = (percent / 100) * heicFiles.length;
                          onProgress(Math.round(((processed + heicDone) / total) * 100));
                        },
                      });

                      outputs.push(...heicOutputs);
                      processed += heicFiles.length;
                    }

                    if (nonHeicFiles.length > 0) {
                      const fallbackOutputs = await convertImageFiles({
                        files: nonHeicFiles,
                        to: toRasterFormat(format),
                        qualityPercent,
                        fillJpgWhite: true,
                        signal,
                        onProgress: (percent) => {
                          const nonHeicDone = (percent / 100) * nonHeicFiles.length;
                          onProgress(Math.round(((processed + nonHeicDone) / total) * 100));
                        },
                      });

                      outputs.push(...fallbackOutputs);
                    }

                    return outputs.map((o) => ({
                      blob: o.blob,
                      filename: o.filename,
                      mimeType: o.mimeType,
                      originalBytes: o.originalBytes,
                      originalName: o.originalName,
                    }));
                  });
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#e8672a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff8c5a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Convert to {formatLabel(format)}
              </button>

              {conversion.status === "running" ? (
                <button
                  type="button"
                  onClick={() => conversion.cancel()}
                  className="inline-flex items-center justify-center rounded-full border border-[#d4cfc4] px-5 py-2.5 text-sm font-medium transition hover:bg-[#f7f3ec]"
                >
                  Cancel
                </button>
              ) : null}

              <div className="text-sm text-[#6b6760]">
                {conversion.status === "running"
                  ? `Converting… ${conversion.progress}%`
                  : conversion.status === "success"
                    ? "Done"
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
              <div className="mt-6">
                <div className="text-sm font-bold">Downloads</div>
                <ul className="mt-3 divide-y divide-[#ede8df] rounded-xl border border-[#d4cfc4] bg-[#fffdf9]">
                  {conversion.outputs.map((out, index) => {
                    const before = out.originalBytes ?? 0;
                    const after = out.blob.size;
                    const percent = before > 0 ? toPercentChange(before, after) : 0;

                    return (
                      <li
                        key={`${out.filename}-${out.blob.size}-${index}`}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{out.filename}</div>
                          <div className="text-xs text-[#6b6760]">
                            {formatLabel(format)}
                            {before > 0 ? (
                              <>
                                {" · "}
                                Before {formatFileSize(before)} → After {formatFileSize(after)}
                                {" · "}
                                {percent >= 0
                                  ? `${percent}% smaller`
                                  : `${Math.abs(percent)}% larger`}
                              </>
                            ) : null}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="shrink-0 rounded-full bg-[#2a7a5e] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                          onClick={() => downloadBlob(out.blob, out.filename)}
                        >
                          Download
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 text-xs text-[#6b6760]">
                  Downloads start automatically after conversion.
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
        <h2 className="text-lg font-extrabold tracking-[-0.02em]">Tips</h2>
        <ul className="mt-3 space-y-2 text-sm text-[#6b6760]">
          <li>• If Windows can’t open HEIC, converting to JPG fixes that.</li>
          <li>• Large photos may take longer on low-memory devices.</li>
          <li>• Your files stay on-device; no upload required.</li>
        </ul>
      </section>
    </div>
  );
}
