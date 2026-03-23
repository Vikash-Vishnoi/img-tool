"use client";

import { useMemo, useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { useConversion } from "@/hooks/useConversion";
import { compressImage } from "@/lib/compressImage";
import { downloadBlob, formatFileSize } from "@/lib/utils";

type PresetKey = "whatsapp" | "email" | "gov" | "custom";

type Preset = {
  key: PresetKey;
  title: string;
  targetSizeMB: number;
  quality: number;
  helper: string;
};

const MAX_SIZE_BYTES = 30 * 1024 * 1024;
const MAX_WIDTH_DEFAULT = 1920;

function toPercentReduction(beforeBytes: number, afterBytes: number): number {
  if (beforeBytes <= 0) return 0;
  const reduction = ((beforeBytes - afterBytes) / beforeBytes) * 100;
  return Math.max(0, Math.min(100, Math.round(reduction)));
}

async function shareToWhatsApp(args: { file: File }): Promise<boolean> {
  // Prefer native share with a file (mobile works best)
  if (typeof navigator !== "undefined" && "share" in navigator) {
    const n = navigator as Navigator & {
      canShare?: (data: { files: File[] }) => boolean;
      share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
    };

    if (n.canShare?.({ files: [args.file] }) && n.share) {
      await n.share({
        title: "Compressed image",
        text: "Here’s a smaller image I compressed.",
        files: [args.file],
      });
      return true;
    }
  }

  // Fallback: open WhatsApp with prefilled text (file sharing not possible without Web Share API)
  const text = encodeURIComponent("Here’s a smaller image I compressed.");
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  return false;
}

export function CompressImageClient() {
  const conversion = useConversion();

  const presets = useMemo<Preset[]>(
    () => [
      {
        key: "whatsapp",
        title: "WhatsApp",
        targetSizeMB: 1,
        quality: 0.8,
        helper: "Under 1MB · Quality 80%",
      },
      {
        key: "email",
        title: "Email attachment",
        targetSizeMB: 0.5,
        quality: 0.7,
        helper: "Under 500KB · Quality 70%",
      },
      {
        key: "gov",
        title: "Government form upload",
        targetSizeMB: 0.2,
        quality: 0.55,
        helper: "Under 200KB · Quality 55%",
      },
      {
        key: "custom",
        title: "Custom",
        targetSizeMB: 1,
        quality: 0.8,
        helper: "Pick quality",
      },
    ],
    []
  );

  const [presetKey, setPresetKey] = useState<PresetKey>("whatsapp");
  const [customQuality, setCustomQuality] = useState<number>(80);

  const accept = useMemo(
    () => ["image/jpeg", "image/png", "image/webp", ".jpg", ".jpeg", ".png", ".webp"],
    []
  );

  const selectedPreset = presets.find((p) => p.key === presetKey) ?? presets[0];
  const quality = presetKey === "custom" ? customQuality / 100 : selectedPreset.quality;

  const beforeBytes = conversion.inputFiles[0]?.size ?? 0;
  const afterBytes =
    conversion.outputs.length > 0 ? conversion.outputs[0]?.blob.size ?? 0 : 0;
  const reductionPercent =
    afterBytes > 0 ? toPercentReduction(beforeBytes, afterBytes) : 0;

  const outputFile = useMemo(() => {
    if (conversion.outputs.length === 0) return null;

    const out = conversion.outputs[0];
    if (out.blob instanceof File) return out.blob;
    return new File([out.blob], out.filename, { type: out.mimeType });
  }, [conversion.outputs]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
          Compress Image
        </h1>
        <p className="max-w-3xl text-pretty text-base leading-7 text-foreground/70">
          Reduce image file size in your browser—no uploads.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Presets</div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {presets.map((p) => {
                const active = p.key === presetKey;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPresetKey(p.key)}
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
                  <div className="text-sm font-medium">Quality</div>
                  <div className="text-sm text-foreground/70">{customQuality}%</div>
                </div>
                <input
                  type="range"
                  min={20}
                  max={95}
                  step={1}
                  value={customQuality}
                  onChange={(e) => setCustomQuality(Number(e.currentTarget.value))}
                  className="mt-3 w-full"
                />
                <div className="mt-2 text-xs text-foreground/70">
                  Higher quality = larger file.
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
                        const output = await compressImage({
                          file: files[0]!,
                          options: {
                            targetSizeMB: selectedPreset.targetSizeMB,
                            quality,
                            maxWidth: MAX_WIDTH_DEFAULT,
                          },
                          signal,
                          onProgress,
                        });

                        return [
                          {
                            blob: output.file,
                            filename: output.file.name,
                            mimeType: output.file.type || "application/octet-stream",
                          },
                        ];
                      });
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Compress
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
                      ? `Compressing… ${conversion.progress}%`
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
                        <span className="font-semibold text-foreground">
                          {formatFileSize(beforeBytes)}
                        </span>{" "}
                        →{" "}
                        <span className="font-semibold text-foreground">
                          {formatFileSize(afterBytes)}
                        </span>{" "}
                        ({reductionPercent}% reduction)
                      </div>
                      <div className="mt-2 text-sm font-semibold">
                        🎉 {reductionPercent}% smaller!
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
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

                      <button
                        type="button"
                        className="rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/[0.03]"
                        onClick={async () => {
                          if (!outputFile) return;
                          await shareToWhatsApp({ file: outputFile });
                        }}
                        disabled={!outputFile}
                      >
                        Share to WhatsApp
                      </button>
                    </div>
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
