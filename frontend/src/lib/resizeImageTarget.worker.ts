/// <reference lib="webworker" />

export {};

type WorkerRequest = {
  type: "run";
  payload: {
    file: File;
    width: number;
    height: number;
    targetBytes: number;
    maxIterations: number;
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
    const { file, width, height, targetBytes, maxIterations } = message.payload;

    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      bitmap.close();
      const errorMessage: WorkerError = {
        type: "error",
        message: "Canvas is not supported in this browser",
      };
      self.postMessage(errorMessage);
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    let lo = 0.2;
    let hi = 0.95;
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
      const errorMessage: WorkerError = {
        type: "error",
        message: "Failed to encode resized image",
      };
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
          : "Resize failed";

    const errorMessage: WorkerError = {
      type: "error",
      message,
    };
    self.postMessage(errorMessage);
  }
};
