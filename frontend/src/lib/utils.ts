export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / 1024 ** exponent;
  const rounded = value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${rounded} ${units[exponent]}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export async function shareFileToWhatsApp(file: File): Promise<boolean> {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    const n = navigator as Navigator & {
      canShare?: (data: { files: File[] }) => boolean;
      share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
    };

    if (n.canShare?.({ files: [file] }) && n.share) {
      await n.share({
        title: "Converted file",
        text: "Here is the converted file.",
        files: [file],
      });
      return true;
    }
  }

  const text = encodeURIComponent("Here is the converted file.");
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  return false;
}
