/// <reference lib="webworker" />

export {};

type WorkerRequest = {
  type: "run";
  payload: {
    file: File;
    targetBytes: number;
    maxWidth: number;
    maxIterations: number;
    minQuality: number;
    maxQuality: number;
  };
};

type WorkerProgress = {
  type: "progress";
  percent: number;
};

type WorkerDone = {
  type: "done";
  blob: Blob;
  chosenQuality: number;
  metTarget: boolean;
};

type WorkerError = {
  type: "error";
  message: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  if (!message || message.type !== "run") return;

  try {
    const { file, targetBytes, maxWidth, maxIterations, minQuality, maxQuality } = message.payload;

    const bitmap = await createImageBitmap(file);

    const srcWidth = bitmap.width;
    const srcHeight = bitmap.height;
    const scale = Math.min(1, maxWidth / Math.max(srcWidth, srcHeight));
    const outW = Math.max(1, Math.round(srcWidth * scale));
    const outH = Math.max(1, Math.round(srcHeight * scale));

    const canvas = new OffscreenCanvas(outW, outH);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      const errorMessage: WorkerError = { type: "error", message: "Canvas is not supported in this browser" };
      self.postMessage(errorMessage);
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, outW, outH);
    ctx.drawImage(bitmap, 0, 0, outW, outH);
    bitmap.close();

    let lo = minQuality;
    let hi = maxQuality;
    let bestBlob: Blob | null = null;
    let bestQuality = lo;
    let smallestBlob: Blob | null = null;
    let smallestQuality = lo;

    for (let i = 0; i < maxIterations; i += 1) {
      const mid = (lo + hi) / 2;
      const blob = await canvas.convertToBlob({
        type: "image/jpeg",
        quality: clamp(mid, 0.05, 0.98),
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

      const progressMessage: WorkerProgress = {
        type: "progress",
        percent: Math.round(((i + 1) / maxIterations) * 100),
      };
      self.postMessage(progressMessage);
    }

    const finalBlob = bestBlob ?? smallestBlob;
    const chosenQuality = clamp(bestBlob ? bestQuality : smallestQuality, 0.05, 0.98);

    if (!finalBlob) {
      const errorMessage: WorkerError = { type: "error", message: "Compression failed" };
      self.postMessage(errorMessage);
      return;
    }

    const doneMessage: WorkerDone = {
      type: "done",
      blob: finalBlob,
      chosenQuality,
      metTarget: finalBlob.size <= targetBytes,
    };

    self.postMessage(doneMessage);
  } catch (caught) {
    const message =
      caught instanceof Error
        ? caught.message
        : typeof caught === "string"
          ? caught
          : "Compression failed";

    const errorMessage: WorkerError = {
      type: "error",
      message,
    };
    self.postMessage(errorMessage);
  }
};
