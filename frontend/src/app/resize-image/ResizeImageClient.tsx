"use client";

import { useMemo, useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { useConversion } from "@/hooks/useConversion";
import { resizeImage } from "@/lib/resizeImage";
import { downloadBlob, formatFileSize } from "@/lib/utils";

type PresetKey =
  | "passport-india"
  | "aadhar"
  | "whatsapp-dp"
  | "instagram"
  | "facebook-cover"
  | "custom";

type Preset = {
  key: PresetKey;
  title: string;
  width: number;
  height: number;
  helper: string;
};

const MAX_SIZE_BYTES = 30 * 1024 * 1024;

function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm * dpi) / 25.4);
}

export function ResizeImageClient() {
  const conversion = useConversion();

  const presets = useMemo<Preset[]>(() => {
    const dpi = 300;
    return [
      {
        key: "passport-india",
        title: "Passport photo India",
        width: 413,
        height: 531,
        helper: "35×45mm (413×531px @ 300dpi)",
      },
      {
        key: "aadhar",
        title: "Aadhar card photo",
        width: mmToPx(35, dpi),
        height: mmToPx(35, dpi),
        helper: "35×35mm (413×413px @ 300dpi)",
      },
      {
        key: "whatsapp-dp",
        title: "WhatsApp DP",
        width: 500,
        height: 500,
        helper: "500×500px",
      },
      {
        key: "instagram",
        title: "Instagram post",
        width: 1080,
        height: 1080,
        helper: "1080×1080px",
      },
      {
        key: "facebook-cover",
        title: "Facebook cover",
        width: 820,
        height: 312,
        helper: "820×312px",
      },
      {
        key: "custom",
        title: "Custom",
        width: 1000,
        height: 1000,
        helper: "Set your own size",
      },
    ];
  }, []);

  const [presetKey, setPresetKey] = useState<PresetKey>("passport-india");
  const preset = presets.find((p) => p.key === presetKey) ?? presets[0];

  const [lockAspect, setLockAspect] = useState(true);
  const [customWidth, setCustomWidth] = useState<number>(preset.width);
  const [customHeight, setCustomHeight] = useState<number>(preset.height);
  const [aspectRatio, setAspectRatio] = useState<number>(preset.width / preset.height);

  const accept = useMemo(
    () => ["image/jpeg", "image/png", "image/webp", ".jpg", ".jpeg", ".png", ".webp"],
    []
  );

  const target = useMemo(() => {
    if (presetKey !== "custom") return { width: preset.width, height: preset.height };
    return {
      width: Math.max(1, Math.round(customWidth)),
      height: Math.max(1, Math.round(customHeight)),
    };
  }, [customHeight, customWidth, preset.height, preset.width, presetKey]);

  const beforeBytes = conversion.inputFiles[0]?.size ?? 0;
  const afterBytes = conversion.outputs[0]?.blob.size ?? 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
          Resize Image
        </h1>
        <p className="max-w-3xl text-pretty text-base leading-7 text-foreground/70">
          Resize photos for passport, Aadhar, WhatsApp, Instagram, and more.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Preset sizes</div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {presets.map((p) => {
                const active = p.key === presetKey;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setPresetKey(p.key);
                      if (p.key !== "custom") {
                        setCustomWidth(p.width);
                        setCustomHeight(p.height);
                        setAspectRatio(p.width / p.height);
                      }
                    }}
                    className={
                      "rounded-2xl border p-4 text-left transition-colors " +
                      (active
                        ? "border-foreground/30 bg-foreground/[0.04]"
                        : "border-foreground/10 hover:bg-foreground/[0.03]")
                    }
                  >
                    <div className="text-sm font-semibold">{p.title}</div>
                    <div className="mt-1 text-xs text-foreground/70">{p.helper}</div>
                  </button>
                );
              })}
            </div>

            {presetKey === "custom" ? (
              <div className="mt-5 rounded-2xl border border-foreground/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">Custom size (px)</div>
                  <label className="inline-flex items-center gap-2 text-sm text-foreground/70">
                    <input
                      type="checkbox"
                      checked={lockAspect}
                      onChange={(e) => setLockAspect(e.currentTarget.checked)}
                    />
                    Lock aspect ratio
                  </label>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="block">
                    <div className="text-xs text-foreground/70">Width</div>
                    <input
                      type="number"
                      min={1}
                      value={customWidth}
                      onChange={(e) => {
                        const nextW = Number(e.currentTarget.value);
                        if (!Number.isFinite(nextW) || nextW <= 0) return;
                        setCustomWidth(nextW);
                        if (lockAspect) {
                          setCustomHeight(Math.round(nextW / aspectRatio));
                        } else {
                          setAspectRatio(nextW / Math.max(1, customHeight));
                        }
                      }}
                      className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block">
                    <div className="text-xs text-foreground/70">Height</div>
                    <input
                      type="number"
                      min={1}
                      value={customHeight}
                      onChange={(e) => {
                        const nextH = Number(e.currentTarget.value);
                        if (!Number.isFinite(nextH) || nextH <= 0) return;
                        setCustomHeight(nextH);
                        if (lockAspect) {
                          setCustomWidth(Math.round(nextH * aspectRatio));
                        } else {
                          setAspectRatio(Math.max(1, customWidth) / nextH);
                        }
                      }}
                      className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                <div className="mt-2 text-xs text-foreground/70">
                  Output will be exactly {target.width}×{target.height}px.
                </div>
              </div>
            ) : null}
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
                        const result = await resizeImage({
                          file: files[0]!,
                          options: {
                            width: target.width,
                            height: target.height,
                            outputType: "image/jpeg",
                            quality: 0.92,
                          },
                          signal,
                        });

                        onProgress(100);
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
                    Resize
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
                      ? `Resizing… ${conversion.progress}%`
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
                      <div className="mt-1 text-sm text-foreground/70">
                        Output size: {target.width}×{target.height}px
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
