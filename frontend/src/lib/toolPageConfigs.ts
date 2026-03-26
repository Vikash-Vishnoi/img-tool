import type { FormatConvertClientProps } from "@/components/FormatConvertClient";
import type { ImageToPdfClientProps } from "@/app/image-to-pdf/ImageToPdfClient";

export type FormatToolPageConfig = Pick<
  FormatConvertClientProps,
  "from" | "to" | "title"
> & {
  description?: string;
  inputLabel?: string;
  allowOutputSourceFormat?: boolean;
};

export type PdfToolPageConfig = Partial<ImageToPdfClientProps>;

export const FORMAT_TOOL_PAGE_CONFIGS = {
  "avif-to-jpg": {
    from: "avif",
    to: "jpg",
    title: "AVIF to JPG Converter",
  },
  "avif-to-png": {
    from: "avif",
    to: "png",
    title: "AVIF to PNG Converter",
  },
  "avif-to-webp": {
    from: "avif",
    to: "webp",
    title: "AVIF to WebP Converter",
  },
  "jpg-to-avif": {
    from: "jpg",
    to: "avif",
    title: "JPG to AVIF Converter",
  },
  "jpg-to-png": {
    from: "jpg",
    to: "png",
    title: "JPG to PNG Converter",
  },
  "jpg-to-webp": {
    from: "jpg",
    to: "webp",
    title: "JPG to WebP Converter",
  },
  "png-to-avif": {
    from: "png",
    to: "avif",
    title: "PNG to AVIF Converter",
  },
  "png-to-jpg": {
    from: "png",
    to: "jpg",
    title: "PNG to JPG Converter",
  },
  "png-to-webp": {
    from: "png",
    to: "webp",
    title: "PNG to WebP Converter",
  },
  "webp-to-avif": {
    from: "webp",
    to: "avif",
    title: "WebP to AVIF Converter",
  },
  "webp-to-jpg": {
    from: "webp",
    to: "jpg",
    title: "WebP to JPG Converter",
  },
  "webp-to-png": {
    from: "webp",
    to: "png",
    title: "WebP to PNG Converter",
  },
  "heic-to-png": {
    from: "heic",
    to: "png",
    title: "HEIC to PNG Converter",
    description:
      "Convert iPhone HEIC/HEIF photos to PNG in your browser with no upload. Files stay on your device.",
    inputLabel: "Upload HEIC/HEIF images",
  },
  "image-converter": {
    from: "jpg",
    to: "png",
    title: "Universal Image Converter",
    description:
      "Upload JPG, JPEG, PNG, WebP, AVIF, or HEIC/HEIF and convert to your chosen output extension directly in the browser.",
    inputLabel: "Upload image files",
    allowOutputSourceFormat: true,
  },
} as const satisfies Record<string, FormatToolPageConfig>;

export const PDF_TOOL_PAGE_CONFIGS = {
  "image-to-pdf": {},
  "avif-to-pdf": {
    title: "AVIF to PDF Converter",
    description: "Convert AVIF images into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload AVIF images",
    accept: ["image/avif", ".avif"],
    uploadHelperText:
      "You can select multiple AVIF images. Max file size 100 MB each (up to 30 images).",
  },
  "heic-to-pdf": {
    title: "HEIC to PDF Converter",
    description:
      "Convert iPhone HEIC/HEIF photos into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload HEIC/HEIF images",
    accept: ["image/heic", "image/heif", ".heic", ".heif"],
    uploadHelperText:
      "You can select multiple HEIC/HEIF images. Max file size 100 MB each (up to 30 images).",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF Converter",
    description: "Convert JPG and JPEG images into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload JPG/JPEG images",
    accept: ["image/jpeg", ".jpg", ".jpeg"],
    uploadHelperText:
      "You can select multiple JPG/JPEG images. Max file size 100 MB each (up to 30 images).",
  },
  "png-to-pdf": {
    title: "PNG to PDF Converter",
    description: "Convert PNG images into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload PNG images",
    accept: ["image/png", ".png"],
    uploadHelperText:
      "You can select multiple PNG images. Max file size 100 MB each (up to 30 images).",
  },
  "webp-to-pdf": {
    title: "WebP to PDF Converter",
    description: "Convert WebP images into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload WebP images",
    accept: ["image/webp", ".webp"],
    uploadHelperText:
      "You can select multiple WebP images. Max file size 100 MB each (up to 30 images).",
  },
} as const satisfies Record<string, PdfToolPageConfig>;

export type FormatToolPageSlug = keyof typeof FORMAT_TOOL_PAGE_CONFIGS;
export type PdfToolPageSlug = keyof typeof PDF_TOOL_PAGE_CONFIGS;
