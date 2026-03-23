export type CompressOptions = {
  targetSizeMB: number;
  quality: number;
  maxWidth: number;
};

export type CompressedOutput = {
  file: File;
  originalBytes: number;
  compressedBytes: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export async function compressImage(args: {
  file: File;
  options: CompressOptions;
  signal: AbortSignal;
  onProgress?: (percent: number) => void;
}): Promise<CompressedOutput> {
  const { file, options, signal, onProgress } = args;

  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const { default: imageCompression } = await import("browser-image-compression");

  const quality = clamp(options.quality, 0.05, 1);
  const targetSizeMB = clamp(options.targetSizeMB, 0.05, 50);
  const maxWidthOrHeight = clamp(options.maxWidth, 320, 30000);

  try {
    const outFile: File = await imageCompression(file, {
      maxSizeMB: targetSizeMB,
      maxWidthOrHeight,
      initialQuality: quality,
      useWebWorker: true,
      onProgress: (p: number) => {
        if (signal.aborted) return;
        const percent = Number.isFinite(p) ? clamp(Math.round(p), 0, 100) : 0;
        onProgress?.(percent);
      },
    });

    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    return {
      file: outFile,
      originalBytes: file.size,
      compressedBytes: outFile.size,
    };
  } catch (caught) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const message =
      caught instanceof Error
        ? caught.message
        : typeof caught === "string"
          ? caught
          : "Compression failed";

    throw new Error(message);
  }
}
