"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppDropdown } from "@/components/AppDropdown";
import { FileUploader } from "@/components/FileUploader";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { RemoveButton } from "@/components/RemoveButton";
import { useConversion } from "@/hooks/useConversion";
import { useUploadFlowScroll } from "@/hooks/useUploadFlowScroll";
import {
  convertImageFiles,
  formatLabel,
  type RasterFormat,
} from "@/lib/formatConvert";
import { downloadBlob, formatFileSize, shareFileToWhatsApp } from "@/lib/utils";

const MAX_SIZE_BYTES = 100 * 1024 * 1024;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toPercentChange(beforeBytes: number, afterBytes: number): number {
  if (beforeBytes <= 0) return 0;
  return Math.round(((beforeBytes - afterBytes) / beforeBytes) * 100);
}

export type FormatConvertClientProps = {
  from: RasterFormat;
  to: RasterFormat;
  title: string;
  description: string;
  inputLabel?: string;
  allowOutputSourceFormat?: boolean;
};

export function FormatConvertClient({
  from,
  to,
  title,
  description,
  inputLabel,
  allowOutputSourceFormat = false,
}: FormatConvertClientProps) {
  const conversion = useConversion();
  const addMoreInputRef = useRef<HTMLInputElement | null>(null);

  const outputOptions = useMemo<RasterFormat[]>(
    () =>
      (["jpg", "png", "webp", "avif"] as RasterFormat[]).filter(
        (f) => allowOutputSourceFormat || f !== from
      ),
    [allowOutputSourceFormat, from]
  );
  const [outputFormat, setOutputFormat] = useState<RasterFormat>(to);
  const [qualityPercent, setQualityPercent] = useState<number>(100);
  const [fillWhiteForJpg, setFillWhiteForJpg] = useState<boolean>(true);
  const autoDownloadKeyRef = useRef<string>("");
  const { optionsRef, onUpload, resetUploadFlow } = useUploadFlowScroll();

  const accept = useMemo(
    () => [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".avif",
    ],
    []
  );
  const acceptAttr = useMemo(() => accept.join(","), [accept]);
  const qualitySafe = useMemo(() => clamp(qualityPercent, 50, 100), [qualityPercent]);

  const runConversion = useCallback(async () => {
    await conversion.run(async ({ files, signal, onProgress }) => {
      const outputs = await convertImageFiles({
        files,
        to: outputFormat,
        qualityPercent: qualitySafe,
        fillJpgWhite: fillWhiteForJpg,
        signal,
        onProgress,
      });

      return outputs.map((o) => ({
        blob: o.blob,
        filename: o.filename,
        mimeType: o.mimeType,
        originalBytes: o.originalBytes,
        originalName: o.originalName,
      }));
    });
  }, [conversion, fillWhiteForJpg, outputFormat, qualitySafe]);

  useEffect(() => {
    setOutputFormat(to);
  }, [to]);

  useEffect(() => {
    if (outputOptions.includes(outputFormat)) return;
    setOutputFormat(outputOptions[0] ?? to);
  }, [outputFormat, outputOptions, to]);

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

      <section
        className={
          "mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6 " +
          (conversion.inputFiles.length > 0 ? "pb-24 sm:pb-6" : "")
        }
      >
        <PrivacyBadge className="mb-5" />

        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 1</div>

        {conversion.inputFiles.length === 0 ? (
          <FileUploader
            label={inputLabel ?? "Upload images"}
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
        ) : (
          <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
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

            <div className="mt-2 text-xs text-[#6b6760]">
              {conversion.inputFiles.length} file{conversion.inputFiles.length > 1 ? "s" : ""}
            </div>

            <ul className="mt-3 divide-y divide-[#ede8df] rounded-xl border border-[#d4cfc4] bg-white">
              {conversion.inputFiles.map((file, index) => (
                <li key={`${file.name}-${file.size}-${index}`} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{file.name}</div>
                      <div className="text-xs text-[#6b6760]">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                    <RemoveButton
                      compact
                      onClick={() => {
                        const nextFiles = conversion.inputFiles.filter((_, fileIndex) => fileIndex !== index);
                        conversion.setInputFiles(nextFiles);
                        if (nextFiles.length === 0) {
                          resetUploadFlow();
                        }
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-[#d4cfc4] px-4 py-2 text-xs font-semibold text-[#1c1a14] transition hover:bg-[#f7f3ec]"
                onClick={() => addMoreInputRef.current?.click()}
              >
                Add more
              </button>
              <input
                ref={addMoreInputRef}
                type="file"
                className="hidden"
                accept={acceptAttr}
                multiple
                onChange={(e) => {
                  const pickedFiles = Array.from(e.currentTarget.files ?? []);
                  e.currentTarget.value = "";
                  if (pickedFiles.length === 0) return;

                  const allowed = pickedFiles.filter((file) => file.size <= MAX_SIZE_BYTES);
                  if (allowed.length === 0) return;

                  const merged = [...conversion.inputFiles, ...allowed];
                  conversion.setInputFiles(merged.slice(0, 20));
                  onUpload();
                }}
              />
            </div>
          </div>
        )}

        {conversion.inputFiles.length > 0 ? (
        <div ref={optionsRef} className="mb-5 mt-6">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 2</div>
          <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Output format</div>
              <AppDropdown
                value={outputFormat}
                onChange={(value) => setOutputFormat(value)}
                ariaLabel="Output format"
                menuAlign="right"
                buttonClassName="inline-flex min-w-[122px] items-center justify-between gap-2 rounded-lg border border-[#d4cfc4] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c1a14] shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:border-[#e8672a]/55 focus:outline-none focus:ring-2 focus:ring-[#e8672a]/25"
                options={outputOptions.map((fmt) => ({
                  value: fmt,
                  label: formatLabel(fmt),
                }))}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Quality</div>
              <div className="text-sm font-medium text-[#1c1a14]">
                {qualitySafe}%
              </div>
            </div>

            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={qualitySafe}
              onChange={(e) => setQualityPercent(Number(e.currentTarget.value))}
              className="mt-3 w-full accent-[#e8672a]"
            />

            <div className="mt-2 text-xs text-[#6b6760]">
              Default 100% keeps quality. Lower only if you want smaller files.
            </div>

            {outputFormat === "jpg" && from !== "jpg" ? (
              <label className="mt-3 flex items-start gap-2 text-xs text-[#6b6760]">
                <input
                  type="checkbox"
                  checked={fillWhiteForJpg}
                  onChange={(e) => setFillWhiteForJpg(e.currentTarget.checked)}
                  className="mt-0.5 accent-[#e8672a]"
                />
                <span>
                  Fill transparent background with white (recommended for JPG)
                </span>
              </label>
            ) : null}
          </div>
        </div>
        ) : null}

        {conversion.inputFiles.length > 0 ? (
          <div className="mt-6">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 3</div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={!conversion.canRun}
                onClick={runConversion}
                className="inline-flex items-center justify-center rounded-full bg-[#e8672a] px-9 py-3.5 text-lg font-semibold text-white transition hover:bg-[#ff8c5a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Convert to {formatLabel(outputFormat)}
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
                            {formatLabel(outputFormat)}
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
                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#d4cfc4] bg-white px-3 py-1.5 text-xs font-medium transition hover:bg-[#f7f3ec]"
                            onClick={async () => {
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
                            className="rounded-full bg-[#2a7a5e] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                            onClick={() => downloadBlob(out.blob, out.filename)}
                          >
                            Download
                          </button>
                        </div>
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

      {conversion.inputFiles.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#d4cfc4] bg-[rgba(255,253,249,0.96)] p-3 backdrop-blur sm:hidden">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-3">
            <div className="min-w-0 flex-1 text-xs font-semibold text-[#6b6760]">
              {conversion.status === "running"
                ? `Converting ${conversion.progress}%`
                : `${conversion.inputFiles.length} file${conversion.inputFiles.length > 1 ? "s" : ""} ready`}
            </div>

            {conversion.status === "running" ? (
              <button
                type="button"
                onClick={() => conversion.cancel()}
                className="inline-flex items-center justify-center rounded-full border border-[#d4cfc4] px-4 py-2 text-sm font-medium transition hover:bg-[#f7f3ec]"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                disabled={!conversion.canRun}
                onClick={runConversion}
                className="inline-flex items-center justify-center rounded-full bg-[#e8672a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff8c5a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Convert
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
