export type ResizeOptions = {
  width: number;
  height: number;
  outputType?: "image/jpeg" | "image/webp" | "image/png";
  quality?: number; // 0..1 used for jpeg/webp
  enhanceDownscale?: boolean;
  sharpenAmount?: number; // 0..1, effective mostly for downscaling
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

function sourceDimensions(source: ImageBitmap | HTMLImageElement): { width: number; height: number } {
  if (source instanceof ImageBitmap) {
    return { width: source.width, height: source.height };
  }
  return {
    width: source.naturalWidth || source.width,
    height: source.naturalHeight || source.height,
  };
}

function applySharpen(canvas: HTMLCanvasElement, amount: number): void {
  const clamped = clamp(amount, 0, 1);
  if (clamped <= 0) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const src = imageData.data;
  const out = new Uint8ClampedArray(src);

  const a = clamped * 0.3;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;
      const left = i - 4;
      const right = i + 4;
      const up = i - width * 4;
      const down = i + width * 4;

      for (let c = 0; c < 3; c++) {
        const value =
          src[i + c] * (1 + 4 * a) -
          a * (src[left + c] + src[right + c] + src[up + c] + src[down + c]);
        out[i + c] = Math.max(0, Math.min(255, Math.round(value)));
      }
    }
  }

  imageData.data.set(out);
  ctx.putImageData(imageData, 0, 0);
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
  const enhanceDownscale = options.enhanceDownscale ?? false;
  const sharpenAmount = options.sharpenAmount ?? 0.4;

  const source = await decodeImage(file, signal);
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const srcDims = sourceDimensions(source);

  const canvas = drawToCanvas({ source, width, height });

  const downscaleRatio = Math.max(srcDims.width / width, srcDims.height / height);
  if (enhanceDownscale && downscaleRatio > 1.2) {
    applySharpen(canvas, sharpenAmount);
  }

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
  const workerSupported =
    typeof window !== "undefined" &&
    typeof Worker === "function" &&
    typeof OffscreenCanvas === "function";

  if (!workerSupported) {
    return await resizeImageToTargetBytesMain(args);
  }

  try {
    return await resizeImageToTargetBytesWorker(args);
  } catch {
    // Fall back to main-thread implementation if worker startup/execution fails.
    return await resizeImageToTargetBytesMain(args);
  }
}

async function resizeImageToTargetBytesWorker(args: {
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

  const worker = new Worker(new URL("./resizeImageTarget.worker.ts", import.meta.url));

  return await new Promise<ResizeToTargetResult>((resolve, reject) => {
    const cleanup = () => {
      worker.onmessage = null;
      worker.onerror = null;
      signal.removeEventListener("abort", onAbort);
      worker.terminate();
    };

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal.addEventListener("abort", onAbort, { once: true });

    worker.onmessage = (event: MessageEvent) => {
      const data = event.data as
        | { type: "progress"; percent: number }
        | { type: "done"; blob: Blob; chosenQuality: number; metTarget: boolean }
        | { type: "error"; message: string };

      if (!data || typeof data !== "object" || !("type" in data)) return;

      if (data.type === "progress") {
        const percent = Number.isFinite(data.percent) ? clamp(Math.round(data.percent), 0, 100) : 0;
        onProgress?.(percent);
        return;
      }

      if (data.type === "error") {
        cleanup();
        reject(new Error(data.message || "Resize failed"));
        return;
      }

      if (data.type === "done") {
        const filename = replaceExt(file.name, "jpg");
        cleanup();
        resolve({
          blob: data.blob,
          filename,
          mimeType: "image/jpeg",
          originalBytes: file.size,
          resizedBytes: data.blob.size,
          chosenQuality: clamp(data.chosenQuality, 0.05, 0.98),
          metTarget: data.metTarget,
          targetBytes: target,
        });
      }
    };

    worker.onerror = (event) => {
      cleanup();
      reject(new Error(event.message || "Resize failed"));
    };

    worker.postMessage({
      type: "run",
      payload: {
        file,
        width: w,
        height: h,
        targetBytes: target,
        maxIterations,
      },
    });
  });
}

async function resizeImageToTargetBytesMain(args: {
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
