"use client";

import { useMemo, useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { useConversion } from "@/hooks/useConversion";
import { resizeImageToTargetBytes } from "@/lib/resizeImage";
import { downloadBlob, formatFileSize } from "@/lib/utils";

const MAX_SIZE_BYTES = 30 * 1024 * 1024;

export function ResizeTo200kbClient() {
  const conversion = useConversion();

  const [targetKb, setTargetKb] = useState<number>(200);
  const [width, setWidth] = useState<number>(413);
  const [height, setHeight] = useState<number>(531);

  const accept = useMemo(
    () => ["image/jpeg", "image/png", "image/webp", ".jpg", ".jpeg", ".png", ".webp"],
    []
  );

  const beforeBytes = conversion.inputFiles[0]?.size ?? 0;
  const afterBytes = conversion.outputs[0]?.blob.size ?? 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
          Resize Image to 200KB
        </h1>
        <p className="max-w-3xl text-pretty text-base leading-7 text-foreground/70">
          Target an exact file size for government form uploads using a quality
          binary search.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-foreground/10 p-4">
            <div className="text-sm font-medium">Target settings</div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="block">
                <div className="text-xs text-foreground/70">Target (KB)</div>
                <input
                  type="number"
                  min={20}
                  value={targetKb}
                  onChange={(e) => setTargetKb(Number(e.currentTarget.value))}
                  className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <div className="text-xs text-foreground/70">Width (px)</div>
                <input
                  type="number"
                  min={1}
                  value={width}
                  onChange={(e) => setWidth(Number(e.currentTarget.value))}
                  className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <div className="text-xs text-foreground/70">Height (px)</div>
                <input
                  type="number"
                  min={1}
                  value={height}
                  onChange={(e) => setHeight(Number(e.currentTarget.value))}
                  className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="mt-3 text-xs text-foreground/70">
              Output is JPEG (quality adjusted to hit the target size).
            </div>
          </div>

          <div>
            <FileUploader
              label="Upload an image"
              helperText={`Max file size ${formatFileSize(MAX_SIZE_BYTES)}. Paste from clipboard also works.`}
              accept={accept}
              multiple={false}
              maxFiles={1}
              maxSizeBytes={MAX_SIZE_BYTES}
              onFiles={(files) => conversion.setInputFiles(files)}
            />

            {conversion.inputFiles.length > 0 ? (
              <div className="mt-5 rounded-2xl border border-foreground/10 p-4">
                <div className="text-sm font-medium">Selected</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {conversion.inputFiles[0]?.name}
                    </div>
                    <div className="text-xs text-foreground/60">
                      {formatFileSize(conversion.inputFiles[0]!.size)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-foreground/70 underline underline-offset-4 hover:text-foreground"
                    onClick={() => conversion.reset()}
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={!conversion.canRun}
                    onClick={async () => {
                      await conversion.run(async ({ files, signal, onProgress }) => {
                        const result = await resizeImageToTargetBytes({
                          file: files[0]!,
                          width,
                          height,
                          targetBytes: Math.round(targetKb * 1024),
                          signal,
                          maxIterations: 12,
                          onProgress,
                        });

                        return [
                          {
                            blob: result.blob,
                            filename: result.filename,
                            mimeType: result.mimeType,
                          },
                        ];
                      });
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Resize to target
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
                      ? `Working… ${conversion.progress}%`
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

                {conversion.status === "success" && conversion.outputs.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-foreground/10 p-4">
                      <div className="text-sm font-medium">Result</div>
                      <div className="mt-2 text-sm text-foreground/70">
                        {formatFileSize(beforeBytes)} → {formatFileSize(afterBytes)}
                      </div>
                      <div className="mt-1 text-xs text-foreground/70">
                        Target: {formatFileSize(Math.round(targetKb * 1024))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90"
                      onClick={() => {
                        const out = conversion.outputs[0]!;
                        downloadBlob(out.blob, out.filename);
                      }}
                    >
                      Download
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
