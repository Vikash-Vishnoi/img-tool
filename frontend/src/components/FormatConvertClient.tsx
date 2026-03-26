"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppDropdown } from "@/components/AppDropdown";
import { FileUploader } from "@/components/FileUploader";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { useConversion } from "@/hooks/useConversion";
import {
  convertImageFiles,
  formatLabel,
  type RasterFormat,
} from "@/lib/formatConvert";
import { downloadBlob, formatFileSize } from "@/lib/utils";

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
  const qualitySafe = useMemo(() => clamp(qualityPercent, 50, 100), [qualityPercent]);

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

      <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
        <PrivacyBadge className="mb-5" />

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Conversion</div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-[#6b6760]">
              <span className="rounded-full border border-[#d4cfc4] bg-white px-2.5 py-1 text-xs font-semibold text-[#1c1a14]">
                {formatLabel(from)}
              </span>
              <span className="text-[#6b6760]">→</span>
              <span className="rounded-full border border-[#d4cfc4] bg-white px-2.5 py-1 text-xs font-semibold text-[#1c1a14]">
                {formatLabel(outputFormat)}
              </span>
            </div>
            <div className="mt-2 text-center text-xs text-[#6b6760]">
              Runs fully in your browser (no upload).
            </div>
          </div>

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

        <FileUploader
          label={inputLabel ?? "Upload images"}
          helperText={`Max file size ${formatFileSize(MAX_SIZE_BYTES)} each. Paste from clipboard also works.`}
          accept={accept}
          multiple
          maxFiles={20}
          maxSizeBytes={MAX_SIZE_BYTES}
          onFiles={(files) => conversion.setInputFiles(files)}
        />

        {conversion.inputFiles.length > 0 ? (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-bold">Selected files</div>
              <button
                type="button"
                className="text-sm text-[#6b6760] underline underline-offset-4 hover:text-[#1c1a14]"
                onClick={() => conversion.reset()}
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
                    <span className="shrink-0 rounded-full border border-[#d4cfc4] bg-white px-2.5 py-1 text-xs font-semibold text-[#6b6760]">
                      Input
                    </span>
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
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#e8672a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff8c5a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Convert to {formatLabel(outputFormat)}
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
    </div>
  );
}
