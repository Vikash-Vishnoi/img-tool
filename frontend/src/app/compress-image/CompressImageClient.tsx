"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppDropdown } from "@/components/AppDropdown";
import { FileUploader } from "@/components/FileUploader";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { RemoveButton } from "@/components/RemoveButton";
import { useConversion } from "@/hooks/useConversion";
import { useUploadFlowScroll } from "@/hooks/useUploadFlowScroll";
import { compressImage, compressImageToTargetBytes } from "@/lib/compressImage";
import { downloadBlob, formatFileSize, shareFileToWhatsApp } from "@/lib/utils";

const MAX_SIZE_BYTES = 100 * 1024 * 1024;
const MAX_WIDTH_DEFAULT = 1920;
type PresetKey =
  | "passport-india"
  | "aadhar"
  | "whatsapp-dp"
  | "instagram"
  | "instagram-story"
  | "youtube-thumbnail"
  | "facebook-post"
  | "facebook-cover"
  | "signature"
  | "photo-2x2"
  | "product-square"
  | "custom";

type Preset = {
  key: PresetKey;
  title: string;
  width: number;
  height: number;
  helper: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm * dpi) / 25.4);
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  if (typeof createImageBitmap === "function") {
    const bmp = await createImageBitmap(file);
    const width = bmp.width;
    const height = bmp.height;
    bmp.close();
    return { width, height };
  }

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to decode image"));
    });

    return {
      width: img.naturalWidth || 0,
      height: img.naturalHeight || 0,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toPercentReduction(beforeBytes: number, afterBytes: number): number {
  if (beforeBytes <= 0) return 0;
  const reduction = ((beforeBytes - afterBytes) / beforeBytes) * 100;
  return Math.max(0, Math.min(100, Math.round(reduction)));
}

export function CompressImageClient() {
  const conversion = useConversion();
  const hasInputFile = conversion.inputFiles.length > 0;
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [qualityPercent, setQualityPercent] = useState<number>(80);
  const [targetSizeKbInput, setTargetSizeKbInput] = useState<string>("");
  const [presetKey, setPresetKey] = useState<PresetKey>("custom");

  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [customWidth, setCustomWidth] = useState<number>(MAX_WIDTH_DEFAULT);
  const [customHeight, setCustomHeight] = useState<number>(MAX_WIDTH_DEFAULT);
  const [customWidthInput, setCustomWidthInput] = useState<string>(String(MAX_WIDTH_DEFAULT));
  const [customHeightInput, setCustomHeightInput] = useState<string>(String(MAX_WIDTH_DEFAULT));
  const [lockAspect, setLockAspect] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const { optionsRef, onUpload, resetUploadFlow } = useUploadFlowScroll();

  const accept = useMemo(
    () => ["image/jpeg", "image/png", "image/webp", ".jpg", ".jpeg", ".png", ".webp"],
    []
  );
  const acceptAttr = useMemo(() => accept.join(","), [accept]);

  const presets = useMemo<Preset[]>(() => {
    const dpi = 300;
    return [
      {
        key: "passport-india",
        title: "Passport photo",
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
        key: "instagram-story",
        title: "Instagram story / reel",
        width: 1080,
        height: 1920,
        helper: "1080×1920px",
      },
      {
        key: "youtube-thumbnail",
        title: "YouTube thumbnail",
        width: 1280,
        height: 720,
        helper: "1280×720px",
      },
      {
        key: "facebook-post",
        title: "Facebook post",
        width: 1200,
        height: 630,
        helper: "1200×630px",
      },
      {
        key: "facebook-cover",
        title: "Facebook cover",
        width: 820,
        height: 312,
        helper: "820×312px",
      },
      {
        key: "signature",
        title: "Signature upload",
        width: 400,
        height: 150,
        helper: "400×150px",
      },
      {
        key: "photo-2x2",
        title: "2×2 inch photo",
        width: 600,
        height: 600,
        helper: "600×600px @ 300dpi",
      },
      {
        key: "product-square",
        title: "Product image square",
        width: 1000,
        height: 1000,
        helper: "1000×1000px",
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

  const selectedPreset = useMemo(
    () => presets.find((p) => p.key === presetKey) ?? presets[presets.length - 1],
    [presetKey, presets]
  );

  const quality = clamp(qualityPercent / 100, 0.05, 1);

  const parsedTargetSizeKb = useMemo(() => {
    const raw = targetSizeKbInput.trim();
    if (!raw) return null;

    const value = Number(raw);
    if (!Number.isFinite(value)) return null;

    return clamp(Math.round(value), 20, 102400);
  }, [targetSizeKbInput]);

  const usesExactTargetSize = parsedTargetSizeKb !== null;

  const targetSizeMB = useMemo(() => {
    const file = conversion.inputFiles[0];
    if (!file) return 1;

    const originalMB = file.size / (1024 * 1024);
    const normalized = (qualityPercent - 20) / 75;
    const ratio = 0.2 + normalized * 0.75;
    return clamp(originalMB * ratio, 0.05, 50);
  }, [conversion.inputFiles, qualityPercent]);

  const maxWidth = useMemo(() => {
    if (presetKey === "custom") {
      return clamp(Math.max(Math.round(customWidth), Math.round(customHeight)), 320, 30000);
    }
    return clamp(Math.max(selectedPreset.width, selectedPreset.height), 320, 30000);
  }, [customHeight, customWidth, presetKey, selectedPreset.height, selectedPreset.width]);

  const beforeBytes = conversion.inputFiles[0]?.size ?? 0;
  const afterBytes =
    conversion.outputs.length > 0 ? conversion.outputs[0]?.blob.size ?? 0 : 0;
  const reductionPercent =
    afterBytes > 0 ? toPercentReduction(beforeBytes, afterBytes) : 0;

  useEffect(() => {
    const file = conversion.inputFiles[0];
    if (!file) {
      setOriginalDimensions(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const dims = await getImageDimensions(file);
        const valid = dims.width > 0 && dims.height > 0 ? dims : null;
        if (!cancelled) {
          setOriginalDimensions(valid);
          if (valid) {
            setCustomWidth(valid.width);
            setCustomHeight(valid.height);
            setCustomWidthInput(String(valid.width));
            setCustomHeightInput(String(valid.height));
            setAspectRatio(valid.width / Math.max(1, valid.height));
          }
        }
      } catch {
        if (!cancelled) setOriginalDimensions(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversion.inputFiles]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4cfc4] bg-[#ede8df] px-4 py-2 text-xs font-semibold text-[#6b6760]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8672a] text-white">✦</span>
          Fast image compression · no upload
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">
          Compress Image
        </h1>
        <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-[#6b6760]">
          Reduce image file size in your browser—no uploads.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
        <PrivacyBadge className="mb-5" />

        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 1</div>

        <div className="mx-auto max-w-5xl">
          {!hasInputFile ? (
            <FileUploader
              label="Upload an image"
              helperText={`Max file size ${formatFileSize(MAX_SIZE_BYTES)}. Paste from clipboard also works.`}
              accept={accept}
              multiple={false}
              maxFiles={1}
              maxSizeBytes={MAX_SIZE_BYTES}
              onFiles={(files) => {
                conversion.setInputFiles(files);
                onUpload();
              }}
            />
          ) : (
            <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-bold">Selected image</div>
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

              <ul className="mt-3 divide-y divide-[#ede8df] overflow-hidden rounded-xl border border-[#d4cfc4] bg-white">
                <li className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{conversion.inputFiles[0]?.name}</div>
                    <div className="text-xs text-[#6b6760]">{formatFileSize(conversion.inputFiles[0]!.size)}</div>
                  </div>
                  <RemoveButton
                    onClick={() => {
                      conversion.setInputFiles([]);
                      resetUploadFlow();
                    }}
                  />
                </li>
              </ul>

              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-[#d4cfc4] px-4 py-2 text-xs font-semibold text-[#1c1a14] transition hover:bg-[#f7f3ec]"
                  onClick={() => replaceInputRef.current?.click()}
                >
                  Change image
                </button>
                <input
                  ref={replaceInputRef}
                  type="file"
                  className="hidden"
                  accept={acceptAttr}
                  onChange={(e) => {
                    const nextFile = e.currentTarget.files?.[0] ?? null;
                    e.currentTarget.value = "";
                    if (!nextFile || nextFile.size > MAX_SIZE_BYTES) return;
                    conversion.setInputFiles([nextFile]);
                    onUpload();
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {hasInputFile ? <div className="mt-6 mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 2</div> : null}

        {hasInputFile ? (
        <div ref={optionsRef} className="mt-6 mx-auto grid max-w-5xl grid-cols-1 gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Compression level</div>
            <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div>
                <div className="text-sm font-medium">Exact target size</div>
                <div className="mt-1 text-xs text-[#6b6760]">
                  Enter a size and we will generate output at or below that size.
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <div className="text-xs text-[#6b6760]">Target size (KB)</div>
                  <input
                    type="number"
                    min={20}
                    value={targetSizeKbInput}
                    onChange={(e) => setTargetSizeKbInput(e.currentTarget.value)}
                    onBlur={() => {
                      if (parsedTargetSizeKb !== null) {
                        setTargetSizeKbInput(String(parsedTargetSizeKb));
                      }
                    }}
                    placeholder="Enter target size in KB"
                    className="mt-1 w-full rounded-xl border border-[#d4cfc4] bg-white px-3 py-2 text-sm"
                  />
                </label>

                <div className="text-xs text-[#6b6760] sm:pt-6">
                  Expected final output: {usesExactTargetSize
                    ? `<= ${formatFileSize(Math.round(parsedTargetSizeKb * 1024))}`
                    : "Managed by quality"}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="text-sm font-medium">Quality</div>
              <div className="mt-2 text-sm text-[#6b6760]">{qualityPercent}%</div>
              <input
                type="range"
                min={20}
                max={95}
                step={1}
                value={qualityPercent}
                onChange={(e) => setQualityPercent(Number(e.currentTarget.value))}
                className="mt-3 w-full accent-[#e8672a]"
              />
              <div className="mt-2 text-xs text-[#6b6760]">
                {usesExactTargetSize
                  ? "Exact target size is active, so quality is ignored."
                  : "Higher quality keeps more detail but creates larger files."}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="text-sm font-medium">Dimensions</div>
              <div className="mt-1 text-xs text-[#6b6760]">
                Choose a preset or select Custom.
              </div>

              <div className="mt-3">
                <AppDropdown
                  value={presetKey}
                  onChange={(value) => setPresetKey(value)}
                  ariaLabel="Preset sizes"
                  options={presets.map((p) => ({
                    value: p.key,
                    label: p.title,
                    helper: p.helper,
                  }))}
                  buttonClassName="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-[#d4cfc4] bg-white px-3 py-2 text-left text-sm font-semibold text-[#1c1a14] shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:border-[#e8672a]/55 focus:outline-none focus:ring-2 focus:ring-[#e8672a]/25"
                  menuClassName="z-30 w-full overflow-hidden rounded-xl border border-[#d4cfc4] bg-white p-1.5 shadow-[0_12px_28px_rgba(28,26,20,0.14)]"
                  renderButtonContent={(selected) => (
                    <span className="min-w-0">
                      <span className="block truncate">{selected.label}</span>
                      <span className="block truncate text-xs font-medium text-[#6b6760]">{selected.helper}</span>
                    </span>
                  )}
                  renderOptionContent={(option, active) => (
                    <span className="min-w-0">
                      <span className="block truncate">{option.label}</span>
                      <span className={"block truncate text-xs font-medium " + (active ? "text-[#f7f3ec]/85" : "text-[#6b6760]")}>{option.helper}</span>
                    </span>
                  )}
                />
              </div>

              {presetKey === "custom" ? (
                <div className="mt-3">
                  <label className="mb-3 inline-flex items-center gap-2 text-sm text-[#6b6760]">
                    <input
                      type="checkbox"
                      checked={lockAspect}
                      onChange={(e) => setLockAspect(e.currentTarget.checked)}
                      className="accent-[#e8672a]"
                    />
                    Lock aspect ratio
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <div className="text-xs text-[#6b6760]">Width</div>
                    <input
                      type="number"
                      min={1}
                      value={customWidthInput}
                      onChange={(e) => {
                        const raw = e.currentTarget.value;
                        setCustomWidthInput(raw);
                        if (raw.trim() === "") return;

                        const nextW = Number(raw);
                        if (!Number.isFinite(nextW) || nextW <= 0) return;
                        setCustomWidth(nextW);

                        if (lockAspect) {
                          const nextH = Math.round(nextW / Math.max(0.0001, aspectRatio));
                          setCustomHeight(nextH);
                          setCustomHeightInput(String(nextH));
                        } else {
                          setAspectRatio(nextW / Math.max(1, customHeight));
                        }
                      }}
                      onBlur={() => {
                        const raw = customWidthInput.trim();
                        if (!raw) {
                          setCustomWidthInput(String(customWidth));
                          return;
                        }
                        const parsed = Number(raw);
                        if (!Number.isFinite(parsed) || parsed <= 0) {
                          setCustomWidthInput(String(customWidth));
                          return;
                        }
                        const next = Math.round(parsed);
                        setCustomWidth(next);
                        setCustomWidthInput(String(next));
                      }}
                      className="mt-1 w-full rounded-xl border border-[#d4cfc4] bg-white px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block">
                    <div className="text-xs text-[#6b6760]">Height</div>
                    <input
                      type="number"
                      min={1}
                      value={customHeightInput}
                      onChange={(e) => {
                        const raw = e.currentTarget.value;
                        setCustomHeightInput(raw);
                        if (raw.trim() === "") return;

                        const nextH = Number(raw);
                        if (!Number.isFinite(nextH) || nextH <= 0) return;
                        setCustomHeight(nextH);

                        if (lockAspect) {
                          const nextW = Math.round(nextH * aspectRatio);
                          setCustomWidth(nextW);
                          setCustomWidthInput(String(nextW));
                        } else {
                          setAspectRatio(Math.max(1, customWidth) / nextH);
                        }
                      }}
                      onBlur={() => {
                        const raw = customHeightInput.trim();
                        if (!raw) {
                          setCustomHeightInput(String(customHeight));
                          return;
                        }
                        const parsed = Number(raw);
                        if (!Number.isFinite(parsed) || parsed <= 0) {
                          setCustomHeightInput(String(customHeight));
                          return;
                        }
                        const next = Math.round(parsed);
                        setCustomHeight(next);
                        setCustomHeightInput(String(next));
                      }}
                      className="mt-1 w-full rounded-xl border border-[#d4cfc4] bg-white px-3 py-2 text-sm"
                    />
                  </label>

                  <div className="col-span-2 mt-1 text-xs text-[#6b6760]">
                    Starts from original image size. Compression preserves aspect ratio.
                  </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-xs text-[#6b6760]">
                  Using {selectedPreset.width} x {selectedPreset.height}px
                </div>
              )}

            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 3</div>
            <div className="mt-5">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={!conversion.canRun}
                    onClick={async () => {
                      await conversion.run(async ({ files, signal, onProgress }) => {
                        const output = usesExactTargetSize
                          ? await compressImageToTargetBytes({
                              file: files[0]!,
                              options: {
                                targetBytes: Math.round(parsedTargetSizeKb * 1024),
                                maxWidth,
                                maxIterations: 14,
                              },
                              signal,
                              onProgress,
                            })
                          : await compressImage({
                              file: files[0]!,
                              options: {
                                targetSizeMB,
                                quality,
                                maxWidth,
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
                    className="inline-flex items-center justify-center rounded-full bg-[#e8672a] px-9 py-3.5 text-lg font-semibold text-white transition hover:bg-[#ff8c5a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Compress
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
                      ? `Compressing… ${conversion.progress}%`
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

                {conversion.status === "success" && conversion.outputs.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-[#b8ddc9] bg-[#e8f5ee] p-4">
                      <div className="text-sm font-semibold text-[#2a7a5e]">Result</div>
                      <div className="mt-2 text-sm text-[#2a7a5e]">
                        <span className="font-semibold text-[#1c1a14]">
                          {formatFileSize(beforeBytes)}
                        </span>{" "}
                        →{" "}
                        <span className="font-semibold text-[#e8672a]">
                          {formatFileSize(afterBytes)}
                        </span>{" "}
                        ({reductionPercent}% reduction)
                      </div>
                      <div className="mt-2 text-sm font-semibold text-[#2a7a5e]">
                        🎉 {reductionPercent}% smaller!
                      </div>
                    </div>

                    <ul className="divide-y divide-[#d4cfc4] overflow-hidden rounded-xl border border-[#d4cfc4] bg-white">
                      {conversion.outputs.map((out, index) => (
                        <li key={`${out.filename}-${out.blob.size}-${index}`} className="flex items-center justify-between gap-3 px-3 py-2.5">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{out.filename}</div>
                            <div className="text-xs text-[#6b6760]">{formatFileSize(out.blob.size)}</div>
                          </div>
                          <div className="flex items-center gap-2">
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
                              className="rounded-full bg-[#2a7a5e] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                              onClick={() => downloadBlob(out.blob, out.filename)}
                            >
                              Download
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
            </div>
          </div>
        </div>
        ) : null}
      </section>
    </div>
  );
}
