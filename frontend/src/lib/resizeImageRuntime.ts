import type { ConversionOutput } from "@/hooks/useConversion";

type ResizeRuntimeArgs = {
  files: File[];
  width: number;
  height: number;
  useTargetSize: boolean;
  targetKb: number | null;
  signal: AbortSignal;
  onProgress: (percent: number) => void;
};

function outputTypeForFile(file: File): "image/jpeg" | "image/png" | "image/webp" {
  const type = file.type.toLowerCase();
  if (type === "image/png") return "image/png";
  if (type === "image/webp") return "image/webp";
  return "image/jpeg";
}

function isHeicLike(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".heic") || name.endsWith(".heif")) return true;

  const type = file.type.toLowerCase();
  return type === "image/heic" || type === "image/heif";
}

async function normalizeResizeInputFile(args: {
  file: File;
  signal: AbortSignal;
}): Promise<File> {
  const { file, signal } = args;
  if (!isHeicLike(file)) return file;
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const { default: heic2any } = await import("heic2any");
  const converted = await heic2any({
    blob: file,
    toType: "image/png",
  });

  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const blob = Array.isArray(converted) ? converted[0] : converted;
  if (!(blob instanceof Blob)) {
    throw new Error(`Could not convert HEIC file: ${file.name}`);
  }

  const baseName = file.name.replace(/\.(heic|heif)$/i, "") || "image";
  return new File([blob], `${baseName}.png`, { type: "image/png" });
}

export async function runResizeConversion({
  files,
  width,
  height,
  useTargetSize,
  targetKb,
  signal,
  onProgress,
}: ResizeRuntimeArgs): Promise<ConversionOutput[]> {
  const total = Math.max(1, files.length);

  const { resizeImage, resizeImageToTargetBytes } = await import("@/lib/resizeImage");

  if (useTargetSize) {
    if (targetKb === null) {
      throw new Error("Target size is required");
    }

    const outputs: ConversionOutput[] = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i]!;
      const normalizedFile = await normalizeResizeInputFile({ file, signal });
      const result = await resizeImageToTargetBytes({
        file: normalizedFile,
        width,
        height,
        targetBytes: Math.round(targetKb * 1024),
        signal,
        maxIterations: 12,
        onProgress: (percent) => {
          const done = i + percent / 100;
          onProgress(Math.round((done / total) * 100));
        },
      });

      outputs.push({
        blob: result.blob,
        filename: result.filename,
        mimeType: result.mimeType,
        originalBytes: result.originalBytes,
        originalName: file.name,
      });
    }

    return outputs;
  }

  const outputs: ConversionOutput[] = [];

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i]!;
    const normalizedFile = await normalizeResizeInputFile({ file, signal });
    const outputType = outputTypeForFile(normalizedFile);
    const result = await resizeImage({
      file: normalizedFile,
      options: {
        width,
        height,
        outputType,
        quality: outputType === "image/png" ? undefined : 1,
        enhanceDownscale: true,
        sharpenAmount: 0.4,
      },
      signal,
    });

    outputs.push({
      blob: result.blob,
      filename: result.filename,
      mimeType: result.mimeType,
      originalBytes: result.originalBytes,
      originalName: file.name,
    });
    onProgress(Math.round(((i + 1) / total) * 100));
  }

  return outputs;
}