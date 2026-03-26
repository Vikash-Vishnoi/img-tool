export type HeicOutputMimeType = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

export type HeicConvertFormat = "jpg" | "png" | "webp" | "avif";

export type HeicConvertOutput = {
  blob: Blob;
  filename: string;
  mimeType: HeicOutputMimeType;
  originalBytes: number;
  originalName: string;
};

function isHeicLike(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".heic") || name.endsWith(".heif")) return true;

  const type = file.type.toLowerCase();
  return type === "image/heic" || type === "image/heif";
}

function replaceExt(originalName: string, ext: string): string {
  const trimmed = originalName.trim();
  if (!trimmed) return `converted.${ext}`;

  const lower = trimmed.toLowerCase();
  if (lower.endsWith(".heic")) return trimmed.slice(0, -5) + `.${ext}`;
  if (lower.endsWith(".heif")) return trimmed.slice(0, -5) + `.${ext}`;

  const lastDot = trimmed.lastIndexOf(".");
  return lastDot > 0 ? trimmed.slice(0, lastDot) + `.${ext}` : trimmed + `.${ext}`;
}

function normalizeHeic2AnyOutput(output: Blob | Blob[]): Blob[] {
  return Array.isArray(output) ? output : [output];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

async function decodeBlobToImage(args: { blob: Blob; signal: AbortSignal }): Promise<ImageBitmap | HTMLImageElement> {
  const { blob, signal } = args;

  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  if (typeof createImageBitmap === "function") {
    return await createImageBitmap(blob);
  }

  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;

    await new Promise<void>((resolve, reject) => {
      const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
      signal.addEventListener("abort", onAbort, { once: true });

      img.onload = () => {
        signal.removeEventListener("abort", onAbort);
        resolve();
      };
      img.onerror = () => {
        signal.removeEventListener("abort", onAbort);
        reject(new Error("Failed to decode image"));
      };
    });

    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawToCanvas(source: ImageBitmap | HTMLImageElement): HTMLCanvasElement {
  const w = source instanceof ImageBitmap ? source.width : source.naturalWidth;
  const h = source instanceof ImageBitmap ? source.height : source.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, w);
  canvas.height = Math.max(1, h);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source as CanvasImageSource, 0, 0);

  return canvas;
}

async function canvasToBlob(args: {
  canvas: HTMLCanvasElement;
  mimeType: string;
  quality?: number;
  signal: AbortSignal;
}): Promise<Blob> {
  const { canvas, mimeType, quality, signal } = args;
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const q = typeof quality === "number" ? clamp(quality, 0.5, 1) : undefined;

  return await new Promise<Blob>((resolve, reject) => {
    const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
    signal.addEventListener("abort", onAbort, { once: true });

    canvas.toBlob(
      (blob) => {
        signal.removeEventListener("abort", onAbort);
        if (!blob) {
          reject(new Error("Failed to encode image"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      q
    );
  });
}

async function encodeWebpFromBlob(args: {
  sourceBlob: Blob;
  quality: number;
  signal: AbortSignal;
}): Promise<Blob> {
  const { sourceBlob, quality, signal } = args;

  const decoded = await decodeBlobToImage({ blob: sourceBlob, signal });
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const canvas = drawToCanvas(decoded);
  const webp = await canvasToBlob({
    canvas,
    mimeType: "image/webp",
    quality,
    signal,
  });

  if (decoded instanceof ImageBitmap) decoded.close();
  return webp;
}

function toHeic2AnyType(format: HeicConvertFormat): "image/jpeg" | "image/png" {
  if (format === "png") return "image/png";
  if (format === "avif") return "image/png";
  // For webp we convert via canvas from PNG to preserve alpha when possible.
  if (format === "webp") return "image/png";
  return "image/jpeg";
}

function extForFormat(format: HeicConvertFormat): string {
  if (format === "png") return "png";
  if (format === "webp") return "webp";
  if (format === "avif") return "avif";
  return "jpg";
}

function mimeForFormat(format: HeicConvertFormat): HeicOutputMimeType {
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  if (format === "avif") return "image/avif";
  return "image/jpeg";
}

async function encodeAvifFromBlob(args: {
  sourceBlob: Blob;
  quality: number;
  signal: AbortSignal;
}): Promise<Blob> {
  const { sourceBlob, quality, signal } = args;

  const decoded = await decodeBlobToImage({ blob: sourceBlob, signal });
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const canvas = drawToCanvas(decoded);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { encode } = await import("@jsquash/avif");
  const buffer = await encode(imageData, { quality: Math.round(clamp(quality, 0, 1) * 100) });

  if (decoded instanceof ImageBitmap) decoded.close();
  return new Blob([buffer], { type: "image/avif" });
}

export async function heicFilesConvert(args: {
  files: File[];
  format: HeicConvertFormat;
  signal: AbortSignal;
  onProgress?: (percent: number) => void;
  quality?: number;
}): Promise<HeicConvertOutput[]> {
  const { files, format, signal, onProgress, quality = 1 } = args;

  const { default: heic2any } = await import("heic2any");

  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  if (!files.length) return [];

  const bad = files.find((f) => !isHeicLike(f));
  if (bad) {
    throw new Error(
      `Unsupported file type: ${bad.name}. Please upload HEIC/HEIF photos.`
    );
  }

  const results: HeicConvertOutput[] = [];
  const total = files.length;

  const clampedQuality = clamp(quality, 0.5, 1);
  const toType = toHeic2AnyType(format);
  const outExt = extForFormat(format);
  const outMime = mimeForFormat(format);

  for (let index = 0; index < files.length; index++) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const file = files[index];

    try {
      const converted = await heic2any({
        blob: file,
        toType,
        quality: clampedQuality,
      });

      const blobs = normalizeHeic2AnyOutput(converted);
      if (blobs.length === 0) {
        throw new Error("Conversion returned no output");
      }

      const baseName = replaceExt(file.name, outExt);

      for (let i = 0; i < blobs.length; i++) {
        const suffix = blobs.length > 1 ? `-${i + 1}` : "";
        const filename = suffix
          ? baseName.replace(new RegExp(`\\.${outExt}$`, "i"), `${suffix}.${outExt}`)
          : baseName;

        const blob =
          format === "webp"
            ? await encodeWebpFromBlob({
                sourceBlob: blobs[i],
                quality: clampedQuality,
                signal,
              })
            : format === "avif"
              ? await encodeAvifFromBlob({
                  sourceBlob: blobs[i],
                  quality: clampedQuality,
                  signal,
                })
            : blobs[i];

        results.push({
          blob,
          filename,
          mimeType: outMime,
          originalBytes: file.size,
          originalName: file.name,
        });
      }
    } catch (caught) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      const message =
        caught instanceof Error
          ? caught.message
          : typeof caught === "string"
            ? caught
            : "Conversion failed";

      throw new Error(`Failed to convert ${file.name}. ${message}`.trim());
    } finally {
      const percent = Math.round(((index + 1) / total) * 100);
      onProgress?.(percent);
    }
  }

  return results;
}

export async function heicFilesToJpg(args: {
  files: File[];
  signal: AbortSignal;
  onProgress?: (percent: number) => void;
  quality?: number;
}): Promise<HeicConvertOutput[]> {
  const { files, signal, onProgress, quality } = args;
  return await heicFilesConvert({
    files,
    format: "jpg",
    signal,
    onProgress,
    quality,
  });
}
