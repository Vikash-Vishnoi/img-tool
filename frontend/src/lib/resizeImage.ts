export type ResizeOptions = {
  width: number;
  height: number;
  outputType?: "image/jpeg" | "image/webp" | "image/png";
  quality?: number; // 0..1 used for jpeg/webp
};

export type ResizeResult = {
  blob: Blob;
  filename: string;
  mimeType: string;
  originalBytes: number;
  resizedBytes: number;
};

export type ResizeToTargetResult = ResizeResult & {
  chosenQuality: number;
  metTarget: boolean;
  targetBytes: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function assertPositiveInt(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number`);
  }
  return Math.round(value);
}

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  if (mime === "image/png") return "png";
  return "bin";
}

function replaceExt(filename: string, ext: string): string {
  const trimmed = filename.trim() || `image.${ext}`;
  const dot = trimmed.lastIndexOf(".");
  if (dot > 0) return trimmed.slice(0, dot + 1) + ext;
  return `${trimmed}.${ext}`;
}

async function decodeImage(file: File, signal: AbortSignal): Promise<ImageBitmap | HTMLImageElement> {
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  if (typeof createImageBitmap === "function") {
    // createImageBitmap may throw for some formats/browsers
    return await createImageBitmap(file);
  }

  const url = URL.createObjectURL(file);
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

function drawToCanvas(args: {
  source: ImageBitmap | HTMLImageElement;
  width: number;
  height: number;
}): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = args.width;
  canvas.height = args.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(args.source as CanvasImageSource, 0, 0, args.width, args.height);

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

  const q = typeof quality === "number" ? clamp(quality, 0.05, 0.98) : undefined;

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

export async function resizeImage(args: {
  file: File;
  options: ResizeOptions;
  signal: AbortSignal;
}): Promise<ResizeResult> {
  const { file, options, signal } = args;

  const width = assertPositiveInt(options.width, "Width");
  const height = assertPositiveInt(options.height, "Height");

  const outputType = options.outputType ?? "image/jpeg";
  const quality = options.quality;

  const source = await decodeImage(file, signal);
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const canvas = drawToCanvas({ source, width, height });
  const blob = await canvasToBlob({
    canvas,
    mimeType: outputType,
    quality,
    signal,
  });

  if (source instanceof ImageBitmap) {
    source.close();
  }

  const filename = replaceExt(file.name, extFromMime(outputType));

  return {
    blob,
    filename,
    mimeType: outputType,
    originalBytes: file.size,
    resizedBytes: blob.size,
  };
}

export async function resizeImageToTargetBytes(args: {
  file: File;
  width: number;
  height: number;
  targetBytes: number;
  signal: AbortSignal;
  maxIterations?: number;
  onProgress?: (percent: number) => void;
}): Promise<ResizeToTargetResult> {
  const {
    file,
    width,
    height,
    targetBytes,
    signal,
    maxIterations = 12,
    onProgress,
  } = args;

  const w = assertPositiveInt(width, "Width");
  const h = assertPositiveInt(height, "Height");
  const target = assertPositiveInt(targetBytes, "Target size");

  // Always use JPEG here for predictable quality/size tuning.
  const outputType: ResizeOptions["outputType"] = "image/jpeg";

  const source = await decodeImage(file, signal);
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const canvas = drawToCanvas({ source, width: w, height: h });

  if (source instanceof ImageBitmap) {
    source.close();
  }

  // Binary search quality. Track best blob <= target.
  let lo = 0.2;
  let hi = 0.95;

  let bestBlob: Blob | null = null;
  let bestQuality = lo;
  let smallestBlob: Blob | null = null;
  let smallestQuality = lo;

  for (let i = 0; i < maxIterations; i++) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const mid = (lo + hi) / 2;
    const blob = await canvasToBlob({
      canvas,
      mimeType: outputType,
      quality: mid,
      signal,
    });

    if (!smallestBlob || blob.size < smallestBlob.size) {
      smallestBlob = blob;
      smallestQuality = mid;
    }

    if (blob.size <= target) {
      bestBlob = blob;
      bestQuality = mid;
      lo = mid; // try higher quality while staying under target
    } else {
      hi = mid; // too big, reduce quality
    }

    const percent = Math.round(((i + 1) / maxIterations) * 100);
    onProgress?.(percent);
  }

  const finalBlob = bestBlob ?? smallestBlob;
  const chosenQuality = bestBlob ? bestQuality : smallestQuality;

  if (!finalBlob) {
    throw new Error("Failed to encode resized image");
  }

  const metTarget = finalBlob.size <= target;
  const filename = replaceExt(file.name, "jpg");

  return {
    blob: finalBlob,
    filename,
    mimeType: "image/jpeg",
    originalBytes: file.size,
    resizedBytes: finalBlob.size,
    chosenQuality: clamp(chosenQuality, 0.05, 0.98),
    metTarget,
    targetBytes: target,
  };
}
