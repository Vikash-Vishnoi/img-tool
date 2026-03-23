"use client";

import { useMemo } from "react";
import { FileUploader } from "@/components/FileUploader";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { useConversion } from "@/hooks/useConversion";
import { heicFilesToJpg } from "@/lib/heicToJpg";
import { downloadBlob, formatFileSize } from "@/lib/utils";

const MAX_SIZE_BYTES = 30 * 1024 * 1024;

export function HeicToJpgClient() {
  const conversion = useConversion();

  const accept = useMemo(
    () => [".heic", ".heif", "image/heic", "image/heif"],
    []
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
          HEIC to JPG Converter
        </h1>
        <p className="max-w-3xl text-pretty text-base leading-7 text-foreground/70">
          Convert iPhone HEIC photos to JPG instantly in your browser. Your files
          never leave your device.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
        <PrivacyBadge className="mb-5" />
        <FileUploader
          label="Upload HEIC photos"
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
                      HEIC
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
                    const outputs = await heicFilesToJpg({
                      files,
                      signal,
                      onProgress,
                    });
                    return outputs;
                  });
                }}
                className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Convert to JPG
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
                  {conversion.outputs.map((out) => (
                    <li key={out.filename} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{out.filename}</div>
                        <div className="text-xs text-foreground/60">JPG</div>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
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

      <section className="mt-10 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Tips</h2>
        <ul className="mt-3 space-y-2 text-sm text-foreground/70">
          <li>• If Windows can’t open HEIC, converting to JPG fixes that.</li>
          <li>• Large photos may take longer on low-memory devices.</li>
          <li>• Your files stay on-device; no upload required.</li>
        </ul>
      </section>
    </div>
  );
}
