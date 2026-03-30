export type PdfToImageOutputFormat = "jpg" | "png" | "webp" | "avif";

type PdfToImageRuntimeArgs = {
  file: File;
  format: PdfToImageOutputFormat;
  qualityPercent: number;
  scale: number;
  signal: AbortSignal;
  onProgress: (percent: number) => void;
};

function stripExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx > 0 ? name.slice(0, idx) : name;
}

function mimeForFormat(format: PdfToImageOutputFormat): string {
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  if (format === "avif") return "image/avif";
  return "image/jpeg";
}

function extForFormat(format: PdfToImageOutputFormat): string {
  if (format === "jpg") return "jpg";
  return format;
}

function supportsQuality(format: PdfToImageOutputFormat): boolean {
  return format === "jpg" || format === "webp" || format === "avif";
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

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Failed to encode ${mimeType}. Try PNG or JPG.`));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

export async function convertPdfToImagesRuntime({
  file,
  format,
  qualityPercent,
  scale,
  signal,
  onProgress,
}: PdfToImageRuntimeArgs): Promise<Array<{ blob: Blob; filename: string; mimeType: string }>> {
  if (signal.aborted) throw new Error("Conversion cancelled");

  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const bytes = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: bytes });

  let pdfDoc: Awaited<typeof loadingTask.promise> | null = null;

  try {
    pdfDoc = await loadingTask.promise;

    const totalPages = Math.max(1, pdfDoc.numPages);
    const ext = extForFormat(format);
    const mimeType = mimeForFormat(format);
    const quality = supportsQuality(format) ? clamp(qualityPercent / 100, 0.5, 1) : undefined;

    const outputs: Array<{ blob: Blob; filename: string; mimeType: string }> = [];
    const base = stripExtension(file.name);

    for (let pageNum = 1; pageNum <= totalPages; pageNum += 1) {
      if (signal.aborted) throw new Error("Conversion cancelled");

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: clamp(scale, 1, 3) });

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));

      const context = canvas.getContext("2d", { alpha: true });
      if (!context) throw new Error("Canvas is not supported in this browser");

      if (format === "jpg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      const renderTask = page.render({ canvas, canvasContext: context, viewport });
      await renderTask.promise;

      const blob = await canvasToBlob({ canvas, mimeType, quality });
      const filename = `${base}-page-${String(pageNum).padStart(2, "0")}.${ext}`;

      outputs.push({ blob, filename, mimeType });
      onProgress(Math.round((pageNum / totalPages) * 100));
    }

    return outputs;
  } finally {
    try {
      await loadingTask.destroy();
    } catch {
      // Ignore teardown errors.
    }

    if (pdfDoc) {
      try {
        await pdfDoc.cleanup();
      } catch {
        // Ignore cleanup errors.
      }
    }
  }
}