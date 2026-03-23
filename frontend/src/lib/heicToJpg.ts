export type HeicToJpgOutput = {
  blob: Blob;
  filename: string;
  mimeType: "image/jpeg";
};

function isHeicLike(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".heic") || name.endsWith(".heif")) return true;

  const type = file.type.toLowerCase();
  return type === "image/heic" || type === "image/heif";
}

function toJpgFilename(originalName: string): string {
  const trimmed = originalName.trim();
  if (!trimmed) return "converted.jpg";

  const lower = trimmed.toLowerCase();
  if (lower.endsWith(".heic")) return trimmed.slice(0, -5) + ".jpg";
  if (lower.endsWith(".heif")) return trimmed.slice(0, -5) + ".jpg";

  const lastDot = trimmed.lastIndexOf(".");
  return lastDot > 0 ? trimmed.slice(0, lastDot) + ".jpg" : trimmed + ".jpg";
}

function normalizeHeic2AnyOutput(output: Blob | Blob[]): Blob[] {
  return Array.isArray(output) ? output : [output];
}

export async function heicFilesToJpg(args: {
  files: File[];
  signal: AbortSignal;
  onProgress?: (percent: number) => void;
  quality?: number;
}): Promise<HeicToJpgOutput[]> {
  const { files, signal, onProgress, quality = 0.92 } = args;

  const { default: heic2any } = await import("heic2any");

  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  if (!files.length) return [];

  const bad = files.find((f) => !isHeicLike(f));
  if (bad) {
    throw new Error(
      `Unsupported file type: ${bad.name}. Please upload HEIC/HEIF photos.`
    );
  }

  const results: HeicToJpgOutput[] = [];
  const total = files.length;

  for (let index = 0; index < files.length; index++) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const file = files[index];

    try {
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality,
      });

      const blobs = normalizeHeic2AnyOutput(converted);
      if (blobs.length === 0) {
        throw new Error("Conversion returned no output");
      }

      const baseName = toJpgFilename(file.name);
      for (let i = 0; i < blobs.length; i++) {
        const suffix = blobs.length > 1 ? `-${i + 1}` : "";
        const filename =
          suffix && baseName.toLowerCase().endsWith(".jpg")
            ? baseName.slice(0, -4) + suffix + ".jpg"
            : baseName + suffix;

        results.push({
          blob: blobs[i],
          filename,
          mimeType: "image/jpeg",
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

      throw new Error(
        `Failed to convert ${file.name}. ${message}`.trim()
      );
    } finally {
      const percent = Math.round(((index + 1) / total) * 100);
      onProgress?.(percent);
    }
  }

  return results;
}
