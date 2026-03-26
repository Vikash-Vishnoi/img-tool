export type RasterFormat = "jpg" | "png" | "webp" | "avif";

export type FormatConvertOutput = {
  blob: Blob;
  filename: string;
  mimeType: string;
  originalBytes: number;
  originalName: string;
};

function stripExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot <= 0) return fileName;
  return fileName.slice(0, lastDot);
}

export function formatLabel(format: RasterFormat): string {
  switch (format) {
    case "jpg":
      return "JPG";
    case "png":
      return "PNG";
    case "webp":
      return "WebP";
    case "avif":
      return "AVIF";
    default:
      return format;
  }
}

export function formatMimeType(format: RasterFormat): string {
  switch (format) {
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
  }
}

export function formatExtensions(format: RasterFormat): string[] {
  switch (format) {
    case "jpg":
      return [".jpg", ".jpeg", "image/jpeg"];
    case "png":
      return [".png", "image/png"];
    case "webp":
      return [".webp", "image/webp"];
    case "avif":
      return [".avif", "image/avif"];
  }
}

function ensureNotAborted(signal: AbortSignal): void {
  if (signal.aborted) throw new Error("Cancelled");
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

async function canvasToBlob(args: {
  canvas: HTMLCanvasElement;
  mimeType: string;
  quality?: number;
}): Promise<Blob> {
  const { canvas, mimeType, quality } = args;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode image"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

async function blobToCanvas(args: {
  blob: Blob;
  fillWhite?: boolean;
  signal: AbortSignal;
}): Promise<HTMLCanvasElement> {
  const { blob, fillWhite, signal } = args;

  ensureNotAborted(signal);

  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    if (fillWhite) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    return canvas;
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

    ensureNotAborted(signal);

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    if (fillWhite) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function decodeToCanvas(args: {
  file: File;
  fillWhite?: boolean;
  signal: AbortSignal;
}): Promise<HTMLCanvasElement> {
  const { file, fillWhite, signal } = args;

  ensureNotAborted(signal);

  try {
    const bitmap = await createImageBitmap(file);

    ensureNotAborted(signal);

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    if (fillWhite) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    return canvas;
  } catch {
    // Fallback: decode AVIF/HEIC if the browser can't decode it natively.
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    const isAvif = type === "image/avif" || name.endsWith(".avif");
    const isHeic =
      type === "image/heic" ||
      type === "image/heif" ||
      name.endsWith(".heic") ||
      name.endsWith(".heif");

    if (!isAvif && !isHeic) {
      throw new Error("This image format is not supported by your browser");
    }

    if (isHeic) {
      const { default: heic2any } = await import("heic2any");
      const converted = await heic2any({ blob: file, toType: "image/png", quality: 1 });

      const pngBlob = Array.isArray(converted) ? converted[0] : converted;
      if (!pngBlob) {
        throw new Error("Failed to decode HEIC image");
      }

      return await blobToCanvas({ blob: pngBlob, fillWhite, signal });
    }

    const { decode } = await import("@jsquash/avif");
    const imageData = await decode(await file.arrayBuffer());
    if (!imageData) {
      throw new Error("Failed to decode AVIF image");
    }

    ensureNotAborted(signal);

    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    ctx.putImageData(imageData, 0, 0);

    if (!fillWhite) return canvas;

    const composed = document.createElement("canvas");
    composed.width = canvas.width;
    composed.height = canvas.height;

    const composedCtx = composed.getContext("2d");
    if (!composedCtx) throw new Error("Canvas not supported");

    composedCtx.fillStyle = "#fff";
    composedCtx.fillRect(0, 0, composed.width, composed.height);
    composedCtx.drawImage(canvas, 0, 0);

    return composed;
  }
}

export async function convertImageFiles(args: {
  files: File[];
  to: RasterFormat;
  qualityPercent?: number; // 0-100
  fillJpgWhite?: boolean;
  signal: AbortSignal;
  onProgress: (percent: number) => void;
}): Promise<FormatConvertOutput[]> {
  const {
    files,
    to,
    qualityPercent = 100,
    fillJpgWhite = true,
    signal,
    onProgress,
  } = args;

  if (!files.length) return [];

  const outputs: FormatConvertOutput[] = [];
  const outMime = formatMimeType(to);

  for (let index = 0; index < files.length; index++) {
    ensureNotAborted(signal);

      const file = files[index];
      const base = stripExtension(file.name);
      const outName = `${base}.${to}`;

      let blob: Blob;

      if (to === "avif") {
        const { encode } = await import("@jsquash/avif");

        const canvas = await decodeToCanvas({ file, fillWhite: false, signal });
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const buffer = await encode(imageData, { quality: clamp(qualityPercent, 0, 100) });
        blob = new Blob([buffer], { type: outMime });
      } else {
        const quality = clamp(qualityPercent / 100, 0.5, 1);
        const fillWhite = to === "jpg" ? fillJpgWhite : false;

        const canvas = await decodeToCanvas({ file, fillWhite, signal });

        if (to === "png") {
          blob = await canvasToBlob({ canvas, mimeType: outMime });
        } else {
          blob = await canvasToBlob({ canvas, mimeType: outMime, quality });
        }
      }

      outputs.push({
        blob,
        filename: outName,
        mimeType: outMime,
        originalBytes: file.size,
        originalName: file.name,
      });

    const percent = Math.round(((index + 1) / files.length) * 100);
    onProgress(percent);
  }

  return outputs;
}
