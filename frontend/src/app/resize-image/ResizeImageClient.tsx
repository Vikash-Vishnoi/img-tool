"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppDropdown } from "@/components/AppDropdown";
import { FileUploader } from "@/components/FileUploader";
import { RemoveButton } from "@/components/RemoveButton";
import { useConversion } from "@/hooks/useConversion";
import { useUploadFlowScroll } from "@/hooks/useUploadFlowScroll";
import { downloadBlob, formatFileSize, shareFileToWhatsApp } from "@/lib/utils";

type PresetKey =
  | "passport-standard"
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

const MAX_SIZE_BYTES = 100 * 1024 * 1024;

function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm * dpi) / 25.4);
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const dims = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      if (dims.width > 0 && dims.height > 0) return dims;
    } catch {
      // Fall back to HTMLImageElement decoding if bitmap decode fails.
    }
  }

  return await new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || 0;
      const height = img.naturalHeight || 0;
      URL.revokeObjectURL(url);
      resolve(width > 0 && height > 0 ? { width, height } : null);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}

export type ResizeImageClientProps = {
  fixedTargetKb?: number;
  hideTargetSizeBox?: boolean;
  defaultPresetKey?: PresetKey;
  title?: string;
  description?: string;
  inputLabel?: string;
  accept?: string[];
  uploadHelperText?: string;
};

export function ResizeImageClient({
  fixedTargetKb,
  hideTargetSizeBox = false,
  defaultPresetKey = "custom",
  title = "Image Resizer",
  description =
    "Resize images by pixels or pick a preset size (passport photo, Aadhaar, WhatsApp DP, Instagram, Facebook cover). Optionally target a file size like 200KB.",
  inputLabel = "Upload images",
  accept: acceptProp,
  uploadHelperText,
}: ResizeImageClientProps = {}) {
  const conversion = useConversion();
  const addMoreInputRef = useRef<HTMLInputElement | null>(null);
  const { optionsRef, onUpload, resetUploadFlow } = useUploadFlowScroll();

  const presets = useMemo<Preset[]>(() => {
    const dpi = 300;
    return [
      {
        key: "passport-standard",
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

  const [presetKey, setPresetKey] = useState<PresetKey>(defaultPresetKey);
  const preset = presets.find((p) => p.key === presetKey) ?? presets[0];

  const [lockAspect, setLockAspect] = useState(false);
  const [customWidth, setCustomWidth] = useState<number>(preset.width);
  const [customHeight, setCustomHeight] = useState<number>(preset.height);
  const [customWidthInput, setCustomWidthInput] = useState<string>(String(preset.width));
  const [customHeightInput, setCustomHeightInput] = useState<string>(String(preset.height));
  const [aspectRatio, setAspectRatio] = useState<number>(preset.width / preset.height);

  const [targetKbInput, setTargetKbInput] = useState<string>(
    fixedTargetKb !== undefined ? String(Math.max(20, Math.round(fixedTargetKb))) : ""
  );

  const accept = useMemo(
    () =>
      acceptProp ?? [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
        "image/heic",
        "image/heif",
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".avif",
        ".heic",
        ".heif",
      ],
    [acceptProp]
  );
  const acceptAttr = useMemo(() => accept.join(","), [accept]);
  const helperText =
    uploadHelperText ??
    `You can select multiple images (JPG, PNG, WebP, AVIF, HEIC). Max file size ${formatFileSize(MAX_SIZE_BYTES)} each.`;

  const target = useMemo(() => {
    if (presetKey !== "custom") return { width: preset.width, height: preset.height };
    return {
      width: Math.max(1, Math.round(customWidth)),
      height: Math.max(1, Math.round(customHeight)),
    };
  }, [customHeight, customWidth, preset.height, preset.width, presetKey]);

  const parsedTargetKb = useMemo(() => {
    if (fixedTargetKb !== undefined) {
      if (!Number.isFinite(fixedTargetKb)) return null;
      return Math.max(20, Math.round(fixedTargetKb));
    }

    const raw = targetKbInput.trim();
    if (!raw) return null;

    const value = Number(raw);
    if (!Number.isFinite(value)) return null;

    return Math.max(20, Math.round(value));
  }, [fixedTargetKb, targetKbInput]);

  const usesTargetSize = parsedTargetKb !== null;

  useEffect(() => {
    let cancelled = false;

    const firstFile = conversion.inputFiles[0];
    if (!firstFile) return;
    if (presetKey !== "custom") return;

    (async () => {
      const dims = await getImageDimensions(firstFile);
      if (!dims || cancelled) return;

      setCustomWidth(dims.width);
      setCustomHeight(dims.height);
      setCustomWidthInput(String(dims.width));
      setCustomHeightInput(String(dims.height));
      setAspectRatio(dims.width / dims.height);
    })();

    return () => {
      cancelled = true;
    };
  }, [conversion.inputFiles, presetKey]);

  const beforeBytes = useMemo(
    () => conversion.inputFiles.reduce((sum, file) => sum + file.size, 0),
    [conversion.inputFiles]
  );
  const afterBytes = useMemo(
    () => conversion.outputs.reduce((sum, out) => sum + out.blob.size, 0),
    [conversion.outputs]
  );

  const selectPreset = (nextKey: PresetKey) => {
    setPresetKey(nextKey);
    const selected = presets.find((p) => p.key === nextKey);
    if (selected && nextKey !== "custom") {
      setCustomWidth(selected.width);
      setCustomHeight(selected.height);
      setCustomWidthInput(String(selected.width));
      setCustomHeightInput(String(selected.height));
      setAspectRatio(selected.width / selected.height);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4cfc4] bg-[#ede8df] px-4 py-2 text-xs font-semibold text-[#6b6760]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8672a] text-white">✦</span>
          Resize presets for forms and social
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-[#6b6760]">
          {description}
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 1</div>

        <div className="mx-auto max-w-5xl">
          {conversion.inputFiles.length === 0 ? (
            <FileUploader
              label={inputLabel}
              helperText={helperText}
              accept={accept}
              multiple
              maxFiles={20}
              maxSizeBytes={MAX_SIZE_BYTES}
              onFiles={(files) => {
                const merged = [...conversion.inputFiles, ...files];
                conversion.setInputFiles(merged.slice(0, 20));
                onUpload();
              }}
            />
          ) : (
            <div className="rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="flex items-center justify-between gap-3">
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
                {conversion.inputFiles.length} files · {formatFileSize(beforeBytes)}
              </div>

              <ul className="mt-3 max-h-56 divide-y divide-[#ede8df] overflow-auto rounded-xl border border-[#d4cfc4] bg-white">
                {conversion.inputFiles.map((file, index) => (
                  <li key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{file.name}</div>
                      <div className="text-xs text-[#6b6760]">{formatFileSize(file.size)}</div>
                    </div>
                    <RemoveButton
                      onClick={() => {
                        const nextFiles = conversion.inputFiles.filter((_, fileIndex) => fileIndex !== index);
                        conversion.setInputFiles(nextFiles);
                        if (nextFiles.length === 0) {
                          resetUploadFlow();
                        }
                      }}
                    />
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
                    const capped = merged.slice(0, 20);
                    conversion.setInputFiles(capped);
                    onUpload();
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {conversion.inputFiles.length > 0 ? <div className="mt-6 mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e8672a]">Step 2</div> : null}

        {conversion.inputFiles.length > 0 ? (
        <div ref={optionsRef} className="mt-6 mx-auto grid max-w-5xl grid-cols-1 gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">Preset sizes</div>
            <div className="mt-3 rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <AppDropdown
                value={presetKey}
                onChange={selectPreset}
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
              <div className="mt-2 text-xs text-[#6b6760]">{preset.helper}</div>
            </div>

            {presetKey === "custom" ? (
              <div className="mt-5 rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">Custom size (px)</div>
                  <label className="inline-flex items-center gap-2 text-sm text-[#6b6760]">
                    <input
                      type="checkbox"
                      checked={lockAspect}
                      onChange={(e) => setLockAspect(e.currentTarget.checked)}
                      className="accent-[#e8672a]"
                    />
                    Lock aspect ratio
                  </label>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
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
                          const nextH = Math.round(nextW / aspectRatio);
                          setCustomHeight(nextH);
                          setCustomHeightInput(String(nextH));
                        } else {
                          setAspectRatio(nextW / Math.max(1, customHeight));
                        }
                      }}
                      onBlur={() => {
                        if (customWidthInput.trim() === "") {
                          setCustomWidthInput(String(customWidth));
                          return;
                        }

                        const parsed = Number(customWidthInput);
                        if (!Number.isFinite(parsed) || parsed <= 0) {
                          setCustomWidthInput(String(customWidth));
                          return;
                        }

                        const rounded = Math.round(parsed);
                        setCustomWidth(rounded);
                        setCustomWidthInput(String(rounded));
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
                        if (customHeightInput.trim() === "") {
                          setCustomHeightInput(String(customHeight));
                          return;
                        }

                        const parsed = Number(customHeightInput);
                        if (!Number.isFinite(parsed) || parsed <= 0) {
                          setCustomHeightInput(String(customHeight));
                          return;
                        }

                        const rounded = Math.round(parsed);
                        setCustomHeight(rounded);
                        setCustomHeightInput(String(rounded));
                      }}
                      className="mt-1 w-full rounded-xl border border-[#d4cfc4] bg-white px-3 py-2 text-sm"
                    />
                  </label>
                </div>

              </div>
            ) : null}

            {!hideTargetSizeBox ? (
              <div className="mt-5 rounded-xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div>
                <div className="text-sm font-medium">Resize to exact file size (optional)</div>
                <div className="mt-1 text-xs text-[#6b6760]">
                  Enter a size to target that output; leave blank to only resize dimensions.
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <div className="text-xs text-[#6b6760]">Target (KB)</div>
                  <input
                    type="number"
                    min={20}
                    value={targetKbInput}
                    onChange={(e) => setTargetKbInput(e.currentTarget.value)}
                    onBlur={() => {
                      if (parsedTargetKb !== null) {
                        setTargetKbInput(String(parsedTargetKb));
                      }
                    }}
                    placeholder="Enter target size in KB"
                    className="mt-1 w-full rounded-xl border border-[#d4cfc4] bg-white px-3 py-2 text-sm"
                  />
                </label>

                <div className="text-xs text-[#6b6760] sm:pt-6">
                  {usesTargetSize ? "Output: JPEG" : "Output: Original format"}
                </div>
              </div>
              </div>
            ) : null}
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
                        const { runResizeConversion } = await import("@/lib/resizeImageRuntime");

                        return await runResizeConversion({
                          files,
                          width: target.width,
                          height: target.height,
                          useTargetSize: usesTargetSize,
                          targetKb: parsedTargetKb,
                          signal,
                          onProgress,
                        });
                      });
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-[#e8672a] px-9 py-3.5 text-lg font-semibold text-white transition hover:bg-[#ff8c5a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Resize
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
                      ? `Resizing… ${conversion.progress}%`
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
                      <div className="text-sm font-semibold text-[var(--forest-ink)]">Result</div>
                      <div className="mt-2 text-sm text-[var(--forest-ink)]">
                        {formatFileSize(beforeBytes)} → {formatFileSize(afterBytes)}
                      </div>
                      <div className="mt-1 text-sm text-[var(--forest-ink)]">
                        Output dimensions: {target.width}×{target.height}px
                      </div>
                      {usesTargetSize ? (
                        <div className="mt-1 text-xs text-[var(--forest-ink)]">
                          Target: {formatFileSize(Math.round(parsedTargetKb * 1024))} (JPEG)
                        </div>
                      ) : null}
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
