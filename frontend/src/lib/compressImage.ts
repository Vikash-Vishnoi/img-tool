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

export type CompressToTargetOptions = {
  targetBytes: number;
  maxWidth: number;
  maxIterations?: number;
  minQuality?: number;
  maxQuality?: number;
};

export type CompressToTargetOutput = CompressedOutput & {
  metTarget: boolean;
  chosenQuality: number;
  targetBytes: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
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

function sourceDimensions(source: ImageBitmap | HTMLImageElement): { width: number; height: number } {
  if (source instanceof ImageBitmap) {
    return { width: source.width, height: source.height };
  }
  return {
    width: source.naturalWidth || source.width,
    height: source.naturalHeight || source.height,
  };
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

export async function compressImage(args: {
  file: File;
  options: CompressOptions;
  signal: AbortSignal;
  onProgress?: (percent: number) => void;
}): Promise<CompressedOutput> {
  const { file, options, signal, onProgress } = args;

  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const quality = clamp(options.quality, 0.05, 1);
  const targetSizeMB = clamp(options.targetSizeMB, 0.05, 50);
  const maxWidthOrHeight = clamp(options.maxWidth, 320, 30000);
  const targetBytes = Math.round(targetSizeMB * 1024 * 1024);

  try {
    onProgress?.(10);

    const source = await decodeImage(file, signal);
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const src = sourceDimensions(source);
    const scale = Math.min(1, maxWidthOrHeight / Math.max(src.width, src.height));
    const outW = Math.max(1, Math.round(src.width * scale));
    const outH = Math.max(1, Math.round(src.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported in this browser");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, outW, outH);
    ctx.drawImage(source as CanvasImageSource, 0, 0, outW, outH);

    if (source instanceof ImageBitmap) {
      source.close();
    }

    onProgress?.(55);

    const inputMime = (file.type || "").toLowerCase();
    const outputMime =
      inputMime === "image/jpeg" || inputMime === "image/webp"
        ? inputMime
        : inputMime === "image/png"
          ? "image/webp"
          : "image/jpeg";
    const supportsQuality = outputMime === "image/jpeg" || outputMime === "image/webp";

    let outBlob = await canvasToBlob({
      canvas,
      mimeType: outputMime,
      quality: supportsQuality ? quality : undefined,
      signal,
    });

    // Keep this path fast: at most one adaptive retry when output overshoots target.
    if (supportsQuality && outBlob.size > targetBytes && targetBytes > 0) {
      const adjustedQuality = clamp(quality * Math.sqrt(targetBytes / outBlob.size), 0.05, quality);
      if (adjustedQuality < quality - 0.01) {
        outBlob = await canvasToBlob({
          canvas,
          mimeType: outputMime,
          quality: adjustedQuality,
          signal,
        });
      }
    }

    onProgress?.(100);

    const filename = replaceExt(file.name, extFromMime(outputMime));
    const outFile = new File([outBlob], filename, { type: outputMime });

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

export async function compressImageToTargetBytes(args: {
  file: File;
  options: CompressToTargetOptions;
  signal: AbortSignal;
  onProgress?: (percent: number) => void;
}): Promise<CompressToTargetOutput> {
  const workerSupported =
    typeof window !== "undefined" &&
    typeof Worker === "function" &&
    typeof OffscreenCanvas === "function";

  if (!workerSupported) {
    return await compressImageToTargetBytesMain(args);
  }

  try {
    return await compressImageToTargetBytesWorker(args);
  } catch {
    // Fall back to main-thread implementation if worker startup/execution fails.
    return await compressImageToTargetBytesMain(args);
  }
}

async function compressImageToTargetBytesWorker(args: {
  file: File;
  options: CompressToTargetOptions;
  signal: AbortSignal;
  onProgress?: (percent: number) => void;
}): Promise<CompressToTargetOutput> {
  const { file, options, signal, onProgress } = args;

  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const targetBytes = Math.max(1024, Math.round(options.targetBytes));
  const maxWidth = clamp(Math.round(options.maxWidth), 320, 30000);
  const maxIterations = Math.max(6, Math.min(24, Math.round(options.maxIterations ?? 14)));
  const minQuality = clamp(options.minQuality ?? 0.2, 0.05, 0.95);
  const maxQuality = clamp(options.maxQuality ?? 0.95, minQuality, 0.98);

  const worker = new Worker(new URL("./compressImageTarget.worker.ts", import.meta.url));

  return await new Promise<CompressToTargetOutput>((resolve, reject) => {
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
        reject(new Error(data.message || "Compression failed"));
        return;
      }

      if (data.type === "done") {
        const filename = replaceExt(file.name, extFromMime("image/jpeg"));
        const outFile = new File([data.blob], filename, { type: "image/jpeg" });

        cleanup();
        resolve({
          file: outFile,
          originalBytes: file.size,
          compressedBytes: outFile.size,
          metTarget: data.metTarget,
          chosenQuality: clamp(data.chosenQuality, 0.05, 0.98),
          targetBytes,
        });
      }
    };

    worker.onerror = (event) => {
      cleanup();
      reject(new Error(event.message || "Compression failed"));
    };

    worker.postMessage({
      type: "run",
      payload: {
        file,
        targetBytes,
        maxWidth,
        maxIterations,
        minQuality,
        maxQuality,
      },
    });
  });
}

async function compressImageToTargetBytesMain(args: {
  file: File;
  options: CompressToTargetOptions;
  signal: AbortSignal;
  onProgress?: (percent: number) => void;
}): Promise<CompressToTargetOutput> {
  const { file, options, signal, onProgress } = args;

  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const targetBytes = Math.max(1024, Math.round(options.targetBytes));
  const maxWidth = clamp(Math.round(options.maxWidth), 320, 30000);
  const maxIterations = Math.max(6, Math.min(24, Math.round(options.maxIterations ?? 14)));
  const minQuality = clamp(options.minQuality ?? 0.2, 0.05, 0.95);
  const maxQuality = clamp(options.maxQuality ?? 0.95, minQuality, 0.98);

  const source = await decodeImage(file, signal);
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");

  const src = sourceDimensions(source);
  const scale = Math.min(1, maxWidth / Math.max(src.width, src.height));
  const outW = Math.max(1, Math.round(src.width * scale));
  const outH = Math.max(1, Math.round(src.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, outW, outH);
  ctx.drawImage(source as CanvasImageSource, 0, 0, outW, outH);

  if (source instanceof ImageBitmap) {
    source.close();
  }

  // JPEG gives predictable quality-vs-size behavior for binary search.
  const mimeType = "image/jpeg";

  let lo = minQuality;
  let hi = maxQuality;
  let bestBlob: Blob | null = null;
  let bestQuality = lo;
  let smallestBlob: Blob | null = null;
  let smallestQuality = lo;

  for (let i = 0; i < maxIterations; i++) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const mid = (lo + hi) / 2;
    const blob = await canvasToBlob({
      canvas,
      mimeType,
      quality: mid,
      signal,
    });

    if (!smallestBlob || blob.size < smallestBlob.size) {
      smallestBlob = blob;
      smallestQuality = mid;
    }

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      bestQuality = mid;
      lo = mid;
    } else {
      hi = mid;
    }

    onProgress?.(Math.round(((i + 1) / maxIterations) * 100));
  }

  const finalBlob = bestBlob ?? smallestBlob;
  const chosenQuality = bestBlob ? bestQuality : smallestQuality;

  if (!finalBlob) {
    throw new Error("Compression failed");
  }

  const filename = replaceExt(file.name, extFromMime(mimeType));

  return {
    file: new File([finalBlob], filename, { type: mimeType }),
    originalBytes: file.size,
    compressedBytes: finalBlob.size,
    metTarget: finalBlob.size <= targetBytes,
    chosenQuality: clamp(chosenQuality, 0.05, 0.98),
    targetBytes,
  };
}
