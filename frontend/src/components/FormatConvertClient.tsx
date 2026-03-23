"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { useConversion } from "@/hooks/useConversion";
import {
  convertImageFiles,
  formatExtensions,
  formatLabel,
  type RasterFormat,
} from "@/lib/formatConvert";
import { downloadBlob, formatFileSize } from "@/lib/utils";

const MAX_SIZE_BYTES = 30 * 1024 * 1024;

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
};

export function FormatConvertClient({ from, to, title, description }: FormatConvertClientProps) {
  const conversion = useConversion();

  const [qualityPercent, setQualityPercent] = useState<number>(92);
  const [fillWhiteForJpg, setFillWhiteForJpg] = useState<boolean>(true);
  const autoDownloadKeyRef = useRef<string>("");

  const accept = useMemo(() => formatExtensions(from), [from]);
  const showQuality = to !== "png";
  const qualitySafe = useMemo(() => clamp(qualityPercent, 50, 100), [qualityPercent]);

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
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-pretty text-base leading-7 text-foreground/70">
          {description}
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
        <PrivacyBadge className="mb-5" />

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-foreground/10 p-4">
            <div className="text-sm font-medium">Conversion</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-foreground/70">
              <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-xs">
                {formatLabel(from)}
              </span>
              <span className="text-foreground/40">→</span>
              <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-xs">
                {formatLabel(to)}
              </span>
            </div>
            <div className="mt-2 text-xs text-foreground/70">
              Runs fully in your browser (no upload).
            </div>
          </div>

          <div className="rounded-2xl border border-foreground/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Quality</div>
              <div className="text-sm text-foreground/70">
                {showQuality ? `${qualitySafe}%` : "—"}
              </div>
            </div>

            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={qualitySafe}
              disabled={!showQuality}
              onChange={(e) => setQualityPercent(Number(e.currentTarget.value))}
              className="mt-3 w-full"
            />

            <div className="mt-2 text-xs text-foreground/70">
              {showQuality
                ? "Higher quality = larger file."
                : "Quality is not used for PNG."}
            </div>

            {to === "jpg" && from !== "jpg" ? (
              <label className="mt-3 flex items-start gap-2 text-xs text-foreground/70">
                <input
                  type="checkbox"
                  checked={fillWhiteForJpg}
                  onChange={(e) => setFillWhiteForJpg(e.currentTarget.checked)}
                  className="mt-0.5"
                />
                <span>
                  Fill transparent background with white (recommended for JPG)
                </span>
              </label>
            ) : null}
          </div>
        </div>

        <FileUploader
          label={`Upload ${formatLabel(from)} images`}
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
              <div className="text-sm font-medium">Selected files</div>
              <button
                type="button"
                className="text-sm text-foreground/70 underline underline-offset-4 hover:text-foreground"
                onClick={() => conversion.reset()}
              >
                Clear
              </button>
            </div>

            <ul className="mt-3 divide-y divide-foreground/10 rounded-xl border border-foreground/10">
              {conversion.inputFiles.map((file) => (
                <li key={`${file.name}-${file.size}`} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{file.name}</div>
                      <div className="text-xs text-foreground/60">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-foreground/10 px-2.5 py-1 text-xs text-foreground/70">
                      {formatLabel(from)}
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
                      to,
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
                className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Convert to {formatLabel(to)}
              </button>

              {conversion.status === "running" ? (
                <button
                  type="button"
                  onClick={() => conversion.cancel()}
                  className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/[0.03]"
                >
                  Cancel
                </button>
              ) : null}

              <div className="text-sm text-foreground/70">
                {conversion.status === "running"
                  ? `Converting… ${conversion.progress}%`
                  : conversion.status === "success"
                    ? "Done"
                    : null}
              </div>
            </div>

            {conversion.status === "running" ? (
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full bg-foreground transition-[width]"
                    style={{ width: `${conversion.progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            {conversion.error ? (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
                {conversion.error}
              </div>
            ) : null}

            {conversion.outputs.length > 0 ? (
              <div className="mt-6">
                <div className="text-sm font-medium">Downloads</div>
                <ul className="mt-3 divide-y divide-foreground/10 rounded-xl border border-foreground/10">
                  {conversion.outputs.map((out) => {
                    const before = out.originalBytes ?? 0;
                    const after = out.blob.size;
                    const percent = before > 0 ? toPercentChange(before, after) : 0;

                    return (
                      <li
                        key={out.filename}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{out.filename}</div>
                          <div className="text-xs text-foreground/60">
                            {formatLabel(to)}
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
                          className="shrink-0 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
                          onClick={() => downloadBlob(out.blob, out.filename)}
                        >
                          Download
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 text-xs text-foreground/70">
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
