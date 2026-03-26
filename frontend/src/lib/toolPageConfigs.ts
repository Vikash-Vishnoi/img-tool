import type { FormatConvertClientProps } from "@/components/FormatConvertClient";
import type { ImageToPdfClientProps } from "@/app/image-to-pdf/ImageToPdfClient";
import type { CompressImageClientProps } from "@/app/compress-image/CompressImageClient";
import type { ResizeImageClientProps } from "@/app/resize-image/ResizeImageClient";
import type { RasterFormat } from "@/lib/formatConvert";

export type FormatToolPageConfig = {
  from: RasterFormat | "heic";
  to: RasterFormat;
  title: FormatConvertClientProps["title"];
  description?: string;
  inputLabel?: string;
  allowOutputSourceFormat?: boolean;
};

export type PdfToolPageConfig = Partial<ImageToPdfClientProps>;
export type CompressToolPageConfig = Partial<CompressImageClientProps>;
export type ResizeToolPageConfig = Partial<ResizeImageClientProps>;

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
  "heic-to-jpg": {
    from: "heic",
    to: "jpg",
    title: "HEIC to JPG Converter",
    description:
      "Convert iPhone HEIC photos to JPG in your browser with no upload. Files stay on your device. Also works with .heif files.",
    inputLabel: "Upload HEIC/HEIF images",
  },
  "heic-to-png": {
    from: "heic",
    to: "png",
    title: "HEIC to PNG Converter",
    description:
      "Convert iPhone HEIC photos to PNG in your browser with no upload. Files stay on your device. Also works with .heif files.",
    inputLabel: "Upload HEIC/HEIF images",
  },
  "heic-to-webp": {
    from: "heic",
    to: "webp",
    title: "HEIC to WebP Converter",
    description:
      "Convert iPhone HEIC photos to WebP in your browser with no upload. Files stay on your device. Also works with .heif files.",
    inputLabel: "Upload HEIC/HEIF images",
  },
  "heic-to-avif": {
    from: "heic",
    to: "avif",
    title: "HEIC to AVIF Converter",
    description:
      "Convert iPhone HEIC photos to AVIF in your browser with no upload. Files stay on your device. Also works with .heif files.",
    inputLabel: "Upload HEIC/HEIF images",
  },
  "heif-to-jpg": {
    from: "heic",
    to: "jpg",
    title: "HEIF to JPG Converter",
    description:
      "Convert iPhone HEIF/HEIC photos to JPG in your browser with no upload. Files stay on your device.",
    inputLabel: "Upload HEIF/HEIC images",
  },
  "heif-to-png": {
    from: "heic",
    to: "png",
    title: "HEIF to PNG Converter",
    description:
      "Convert iPhone HEIF/HEIC photos to PNG in your browser with no upload. Files stay on your device.",
    inputLabel: "Upload HEIF/HEIC images",
  },
  "heif-to-webp": {
    from: "heic",
    to: "webp",
    title: "HEIF to WebP Converter",
    description:
      "Convert iPhone HEIF/HEIC photos to WebP in your browser with no upload. Files stay on your device.",
    inputLabel: "Upload HEIF/HEIC images",
  },
  "heif-to-avif": {
    from: "heic",
    to: "avif",
    title: "HEIF to AVIF Converter",
    description:
      "Convert iPhone HEIF/HEIC photos to AVIF in your browser with no upload. Files stay on your device.",
    inputLabel: "Upload HEIF/HEIC images",
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
    inputLabel: "Upload images",
    uploadHelperText:
      "You can select multiple AVIF images. Max file size 100 MB each (up to 30 images).",
  },
  "heic-to-pdf": {
    title: "HEIC to PDF Converter",
    description:
      "Convert iPhone HEIC photos into one PDF in your browser. Files stay on your device. Also works with .heif files.",
    inputLabel: "Upload images",
    uploadHelperText:
      "You can select multiple HEIC/HEIF images. Max file size 100 MB each (up to 30 images).",
  },
  "heif-to-pdf": {
    title: "HEIF to PDF Converter",
    description:
      "Convert iPhone HEIF/HEIC photos into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload images",
    uploadHelperText:
      "You can select multiple HEIF/HEIC images. Max file size 100 MB each (up to 30 images).",
  },
  "jpeg-to-pdf": {
    title: "JPEG to PDF Converter",
    description: "Convert JPEG images into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload images",
    uploadHelperText:
      "You can select multiple JPEG images. Max file size 100 MB each (up to 30 images).",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF Converter",
    description: "Convert JPG and JPEG images into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload images",
    uploadHelperText:
      "You can select multiple JPG/JPEG images. Max file size 100 MB each (up to 30 images).",
  },
  "png-to-pdf": {
    title: "PNG to PDF Converter",
    description: "Convert PNG images into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload images",
    uploadHelperText:
      "You can select multiple PNG images. Max file size 100 MB each (up to 30 images).",
  },
  "webp-to-pdf": {
    title: "WebP to PDF Converter",
    description: "Convert WebP images into one PDF in your browser. Files stay on your device.",
    inputLabel: "Upload images",
    uploadHelperText:
      "You can select multiple WebP images. Max file size 100 MB each (up to 30 images).",
  },
} as const satisfies Record<string, PdfToolPageConfig>;

export const COMPRESS_TOOL_PAGE_CONFIGS = {
  "compress-image": {},
  "compress-jpg": {
    title: "Compress JPG Image",
    description: "Compress JPG photos in your browser with no upload. Fast, private, and mobile-friendly.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload one JPG/JPEG image (up to 100 MB).",
  },
  "compress-jpeg": {
    title: "Compress JPEG Image",
    description: "Compress JPEG photos in your browser with no upload. Fast, private, and mobile-friendly.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload one JPEG/JPG image (up to 100 MB).",
  },
  "compress-png": {
    title: "Compress PNG Image",
    description: "Compress PNG images in your browser with no upload while keeping visual quality.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload one PNG image (up to 100 MB).",
  },
  "compress-webp": {
    title: "Compress WebP Image",
    description: "Compress WebP images in your browser with no upload for smaller file size.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload one WebP image (up to 100 MB).",
  },
  "compress-avif": {
    title: "Compress AVIF Image",
    description: "Compress AVIF images in your browser with no upload. Files stay on your device.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload one AVIF image (up to 100 MB).",
  },
  "compress-heic": {
    title: "Compress HEIC Image",
    description:
      "Compress iPhone HEIC photos in your browser with no upload. Files stay private. Also works with .heif files.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload one HEIC/HEIF image (up to 100 MB).",
  },
  "compress-heif": {
    title: "Compress HEIF Image",
    description: "Compress iPhone HEIF photos in your browser with no upload. Files stay private.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload one HEIF/HEIC image (up to 100 MB).",
  },
} as const satisfies Record<string, CompressToolPageConfig>;

export const RESIZE_TOOL_PAGE_CONFIGS = {
  "resize-image": {},
  "resize-image-to-200kb": {
    fixedTargetKb: 200,
    hideTargetSizeBox: true,
    defaultPresetKey: "passport-india",
  },
  "resize-jpg": {
    title: "Resize JPG Image",
    description: "Resize JPG photos by pixels or presets in your browser with no upload.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload JPG/JPEG images (max 100 MB each).",
  },
  "resize-jpeg": {
    title: "Resize JPEG Image",
    description: "Resize JPEG photos by pixels or presets in your browser with no upload.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload JPEG/JPG images (max 100 MB each).",
  },
  "resize-png": {
    title: "Resize PNG Image",
    description: "Resize PNG images by pixels or presets in your browser with no upload.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload PNG images (max 100 MB each).",
  },
  "resize-webp": {
    title: "Resize WebP Image",
    description: "Resize WebP images by pixels or presets in your browser with no upload.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload WebP images (max 100 MB each).",
  },
  "resize-avif": {
    title: "Resize AVIF Image",
    description: "Resize AVIF images by pixels or presets in your browser with no upload.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload AVIF images (max 100 MB each).",
  },
  "resize-heic": {
    title: "Resize HEIC Image",
    description:
      "Resize iPhone HEIC photos by pixels or presets in your browser with no upload. Also works with .heif files.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload HEIC/HEIF images (max 100 MB each).",
  },
  "resize-heif": {
    title: "Resize HEIF Image",
    description: "Resize iPhone HEIF photos by pixels or presets in your browser with no upload.",
    inputLabel: "Upload images",
    uploadHelperText: "Upload HEIF/HEIC images (max 100 MB each).",
  },
  "resize-passport-photo": {
    title: "Resize Passport Photo 35x45mm (413x531 px)",
    description: "Resize photo to passport size 35x45mm (413x531 px at 300 DPI) in your browser.",
    defaultPresetKey: "passport-india",
  },
  "resize-aadhar-photo": {
    title: "Resize Aadhaar Card Photo 35x35mm (413x413 px)",
    description: "Resize photo to Aadhaar size 35x35mm (413x413 px at 300 DPI) in your browser.",
    defaultPresetKey: "aadhar",
  },
  "resize-whatsapp-dp": {
    title: "Resize WhatsApp DP 500x500 px",
    description: "Resize image to WhatsApp DP size 500x500 px in your browser.",
    defaultPresetKey: "whatsapp-dp",
  },
  "resize-instagram-post": {
    title: "Resize Instagram Post 1080x1080 px",
    description: "Resize image to Instagram post size 1080x1080 px in your browser.",
    defaultPresetKey: "instagram",
  },
  "resize-instagram-story": {
    title: "Resize Instagram Story / Reel 1080x1920 px",
    description: "Resize image to Instagram story and reel size 1080x1920 px in your browser.",
    defaultPresetKey: "instagram-story",
  },
  "resize-youtube-thumbnail": {
    title: "Resize YouTube Thumbnail 1280x720 px",
    description: "Resize image to YouTube thumbnail size 1280x720 px in your browser.",
    defaultPresetKey: "youtube-thumbnail",
  },
  "resize-facebook-post": {
    title: "Resize Facebook Post 1200x630 px",
    description: "Resize image to Facebook post size 1200x630 px in your browser.",
    defaultPresetKey: "facebook-post",
  },
  "resize-facebook-cover": {
    title: "Resize Facebook Cover 820x312 px",
    description: "Resize image to Facebook cover size 820x312 px in your browser.",
    defaultPresetKey: "facebook-cover",
  },
  "resize-signature-upload": {
    title: "Resize Signature Upload 400x150 px",
    description: "Resize image to signature upload size 400x150 px in your browser.",
    defaultPresetKey: "signature",
  },
  "resize-2x2-photo": {
    title: "Resize 2x2 Inch Photo 600x600 px",
    description: "Resize image to 2x2 inch photo size 600x600 px at 300 DPI in your browser.",
    defaultPresetKey: "photo-2x2",
  },
  "resize-product-square": {
    title: "Resize Product Image Square 1000x1000 px",
    description: "Resize image to product square size 1000x1000 px in your browser.",
    defaultPresetKey: "product-square",
  },
} as const satisfies Record<string, ResizeToolPageConfig>;

export type FormatToolPageSlug = keyof typeof FORMAT_TOOL_PAGE_CONFIGS;
export type PdfToolPageSlug = keyof typeof PDF_TOOL_PAGE_CONFIGS;
export type CompressToolPageSlug = keyof typeof COMPRESS_TOOL_PAGE_CONFIGS;
export type ResizeToolPageSlug = keyof typeof RESIZE_TOOL_PAGE_CONFIGS;
