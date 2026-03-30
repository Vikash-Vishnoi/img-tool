export type ImageToPdfPageSize = "a3" | "a4" | "a5" | "letter" | "legal" | "image-fit";

type BuildPdfRuntimeArgs = {
  files: File[];
  pageSize: ImageToPdfPageSize;
  marginMm: number;
  jpegQuality: number;
  signal: AbortSignal;
  onProgress: (percent: number) => void;
};

function stripExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx > 0 ? name.slice(0, idx) : name;
}

function isHeicLike(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".heic") || name.endsWith(".heif")) return true;

  const type = file.type.toLowerCase();
  return type === "image/heic" || type === "image/heif";
}

async function convertHeicToPngFile(args: {
  file: File;
  signal: AbortSignal;
}): Promise<File> {
  const { file, signal } = args;
  if (signal.aborted) throw new Error("PDF conversion cancelled");

  const { default: heic2any } = await import("heic2any");
  const converted = await heic2any({
    blob: file,
    toType: "image/png",
  });

  if (signal.aborted) throw new Error("PDF conversion cancelled");

  const blob = Array.isArray(converted) ? converted[0] : converted;
  if (!(blob instanceof Blob)) {
    throw new Error(`Could not convert HEIC file: ${file.name}`);
  }

  return new File([blob], `${stripExtension(file.name)}.png`, {
    type: "image/png",
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.decoding = "async";

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read image: ${file.name}`));
    };

    img.src = url;
  });
}

async function toJpegDataUrl(file: File, quality: number): Promise<{
  dataUrl: string;
  width: number;
  height: number;
}> {
  const img = await loadImage(file);

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid image dimensions: ${file.name}`);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image canvas");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL("image/jpeg", quality),
    width,
    height,
  };
}

export async function buildPdfRuntime({
  files,
  pageSize,
  marginMm,
  jpegQuality,
  signal,
  onProgress,
}: BuildPdfRuntimeArgs): Promise<Blob> {
  const { jsPDF } = await import("jspdf");

  let doc: InstanceType<typeof jsPDF> | null = null;
  const safeMargin = Math.max(0, Math.min(30, marginMm));

  for (let i = 0; i < files.length; i += 1) {
    if (signal.aborted) {
      throw new Error("PDF conversion cancelled");
    }

    const inputFile = files[i];
    const source = isHeicLike(inputFile)
      ? await convertHeicToPngFile({ file: inputFile, signal })
      : inputFile;

    const { dataUrl, width, height } = await toJpegDataUrl(source, jpegQuality);

    if (!doc) {
      if (pageSize === "image-fit") {
        doc = new jsPDF({
          orientation: width >= height ? "landscape" : "portrait",
          unit: "px",
          format: [width, height],
          compress: true,
        });
      } else {
        doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: pageSize,
          compress: true,
        });
      }
    }

    if (pageSize === "image-fit") {
      if (i > 0) {
        doc.addPage([width, height], width >= height ? "landscape" : "portrait");
      }

      doc.addImage(dataUrl, "JPEG", 0, 0, width, height, undefined, "FAST");
      onProgress(Math.round(((i + 1) / files.length) * 100));
      continue;
    }

    if (i > 0) {
      doc.addPage(pageSize, "portrait");
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = Math.max(1, pageWidth - safeMargin * 2);
    const usableHeight = Math.max(1, pageHeight - safeMargin * 2);

    const imageRatio = width / height;
    const boxRatio = usableWidth / usableHeight;

    let drawWidth = usableWidth;
    let drawHeight = usableHeight;

    if (imageRatio > boxRatio) {
      drawHeight = drawWidth / imageRatio;
    } else {
      drawWidth = drawHeight * imageRatio;
    }

    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    doc.addImage(dataUrl, "JPEG", x, y, drawWidth, drawHeight, undefined, "FAST");
    onProgress(Math.round(((i + 1) / files.length) * 100));
  }

  if (!doc) {
    throw new Error("No files to convert");
  }

  const arrayBuffer = doc.output("arraybuffer");
  return new Blob([arrayBuffer], { type: "application/pdf" });
}

export function derivePdfOutputBaseName(files: File[]): string {
  return files[0] ? stripExtension(files[0].name) : "images";
}