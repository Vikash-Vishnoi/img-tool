import type { Metadata } from "next";

export type FaqItem = {
  question: string;
  answer: string;
};

export type ToolDefinition = {
  slug: string;
  path: `/${string}`;
  title: string;
  description: string;
  keywords: string[];
  faqs?: FaqItem[];
  related?: Array<ToolDefinition["slug"]>;
};

export const TOOLS = [
  {
    slug: "image-converter",
    path: "/image-converter",
    title: "Universal Image Converter — Convert Any Image Extension Online",
    description:
      "Upload JPG, JPEG, PNG, WebP, AVIF, or HEIC/HEIF and convert to your chosen output extension in your browser with no upload.",
    keywords: [
      "image converter",
      "convert image extension",
      "jpg png webp avif heic converter",
      "universal image converter",
      "no upload",
      "india",
    ],
    related: ["heic-to-jpg", "compress-image", "resize-image"],
  },
  {
    slug: "heic-to-jpg",
    path: "/heic-to-jpg",
    title: "HEIC to JPG Converter — Free, No Install, Files Stay Private",
    description:
      "Convert iPhone HEIC photos to JPG free in your browser. No upload needed. Works on mobile in India (Android/iPhone) and on Windows/Mac.",
    keywords: ["heic to jpg", "convert heic", "iphone photo converter", "india"],
    faqs: [
      {
        question: "Is it safe to convert HEIC online?",
        answer:
          "Yes. This converter runs in your browser, so your photos are not uploaded to any server.",
      },
      {
        question: "Why can't I open HEIC files on Windows?",
        answer:
          "Many Windows PCs don't have HEIC support enabled by default. Converting to JPG makes the photo compatible with any app and helps when uploading to government forms.",
      },
      {
        question: "Does HEIC to JPG work on Android?",
        answer:
          "Yes. It works on Android browsers that support the required features, and your files stay on-device.",
      },
      {
        question: "Will I lose quality converting HEIC to JPG?",
        answer:
          "JPG is a lossy format, so some quality loss is possible. At high quality, the result is usually visually very close to the original.",
      },
      {
        question: "How large a HEIC file can I convert?",
        answer:
          "Limits depend on your device and browser memory. For best results on mobile, try to keep files under ~30 MB each.",
      },
    ],
    related: ["compress-image", "resize-image", "resize-image-to-200kb"],
  },
  {
    slug: "compress-image",
    path: "/compress-image",
    title: "Compress Image for WhatsApp — Reduce Size Without Quality Loss",
    description:
      "Compress JPG/PNG/WebP free in your browser—no upload needed. Works on mobile in India and helps meet government form upload limits.",
    keywords: [
      "compress image",
      "compress for whatsapp",
      "reduce image size",
      "no upload",
      "india",
    ],
    related: ["resize-image-to-200kb", "resize-image", "heic-to-jpg"],
  },
  {
    slug: "png-to-webp",
    path: "/png-to-webp",
    title: "PNG to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG to WebP free in your browser. No upload needed, works on mobile in India for faster websites and smaller files.",
    keywords: ["png to webp", "convert png", "webp converter", "india", "no upload"],
    related: ["webp-to-png", "webp-to-jpg", "compress-image"],
  },
  {
    slug: "jpg-to-png",
    path: "/jpg-to-png",
    title: "JPG to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG to PNG free in your browser—no upload needed. Works on Android/iPhone and Windows/Mac in India.",
    keywords: ["jpg to png", "convert jpg", "png converter", "india", "no upload"],
    related: ["png-to-jpg", "jpg-to-webp", "compress-image"],
  },
  {
    slug: "png-to-jpg",
    path: "/png-to-jpg",
    title: "PNG to JPG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG to JPG free in your browser. No upload needed, works on mobile in India. Includes a white-background option for transparent PNGs.",
    keywords: [
      "png to jpg",
      "png to jpeg",
      "convert png to jpg",
      "india",
      "no upload",
    ],
    related: ["jpg-to-png", "compress-image", "resize-image"],
  },
  {
    slug: "jpg-to-webp",
    path: "/jpg-to-webp",
    title: "JPG to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG to WebP free in your browser. No upload needed. Great for faster websites and smaller images in India.",
    keywords: ["jpg to webp", "convert jpg", "webp converter", "india", "no upload"],
    related: ["png-to-webp", "compress-image", "resize-image"],
  },
  {
    slug: "webp-to-jpg",
    path: "/webp-to-jpg",
    title: "WebP to JPG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert WebP to JPG free in your browser—no upload needed. Useful when a website/app doesn’t accept WebP.",
    keywords: [
      "webp to jpg",
      "webp to jpeg",
      "convert webp",
      "india",
      "no upload",
    ],
    related: ["jpg-to-webp", "webp-to-png", "compress-image"],
  },
  {
    slug: "webp-to-png",
    path: "/webp-to-png",
    title: "WebP to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert WebP to PNG free in your browser. No upload needed, works on mobile in India.",
    keywords: ["webp to png", "convert webp", "png converter", "india", "no upload"],
    related: ["png-to-webp", "jpg-to-png", "compress-image"],
  },
  {
    slug: "jpg-to-avif",
    path: "/jpg-to-avif",
    title: "JPG to AVIF Converter — Free, No Upload, Smaller Files",
    description:
      "Convert JPG to AVIF free in your browser. No upload needed. AVIF often gives smaller files for the same visual quality.",
    keywords: ["jpg to avif", "convert jpg", "avif converter", "india", "no upload"],
    related: ["png-to-avif", "webp-to-avif", "compress-image"],
  },
  {
    slug: "png-to-avif",
    path: "/png-to-avif",
    title: "PNG to AVIF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG to AVIF free in your browser. No upload needed, works on mobile in India.",
    keywords: ["png to avif", "convert png", "avif converter", "india", "no upload"],
    related: ["jpg-to-avif", "webp-to-avif", "compress-image"],
  },
  {
    slug: "webp-to-avif",
    path: "/webp-to-avif",
    title: "WebP to AVIF Converter — Free, No Upload, Smaller Files",
    description:
      "Convert WebP to AVIF free in your browser. No upload needed. Useful when you want maximum compression.",
    keywords: ["webp to avif", "convert webp", "avif converter", "india", "no upload"],
    related: ["jpg-to-avif", "png-to-avif", "compress-image"],
  },
  {
    slug: "avif-to-jpg",
    path: "/avif-to-jpg",
    title: "AVIF to JPG Converter — Free, No Upload, Works Anywhere",
    description:
      "Convert AVIF to JPG free in your browser—no upload needed. Useful for compatibility with older apps and sites.",
    keywords: ["avif to jpg", "avif to jpeg", "convert avif", "india", "no upload"],
    related: ["avif-to-png", "avif-to-webp", "compress-image"],
  },
  {
    slug: "avif-to-png",
    path: "/avif-to-png",
    title: "AVIF to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert AVIF to PNG free in your browser. No upload needed, works on mobile in India.",
    keywords: ["avif to png", "convert avif", "png converter", "india", "no upload"],
    related: ["avif-to-jpg", "avif-to-webp", "compress-image"],
  },
  {
    slug: "avif-to-webp",
    path: "/avif-to-webp",
    title: "AVIF to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert AVIF to WebP free in your browser—no upload needed. Useful when you want wide support and small files.",
    keywords: ["avif to webp", "convert avif", "webp converter", "india", "no upload"],
    related: ["avif-to-jpg", "avif-to-png", "compress-image"],
  },
  {
    slug: "resize-image",
    path: "/resize-image",
    title: "Resize Image to Passport Size — Free Online India",
    description:
      "Resize images to India passport photo size, Aadhaar photo, WhatsApp DP, Instagram, and more—free, instant, no upload, works on mobile.",
    keywords: [
      "resize image",
      "passport size photo india",
      "passport photo 35x45mm",
      "413x531 passport photo",
      "aadhar photo size",
      "aadhar photo 35x35mm",
      "413x413 aadhar photo",
      "whatsapp dp size 500x500",
      "instagram post size 1080x1080",
      "facebook cover size 820x312",
      "resize online",
      "image resizer india",
      "no upload",
    ],
    related: ["resize-image-to-200kb", "compress-image", "image-to-pdf"],
  },
  {
    slug: "resize-image-to-200kb",
    path: "/resize-image-to-200kb",
    title: "Resize Image to 200KB — For Government Form Uploads",
    description:
      "Resize and compress an image to a target size like 200KB for government form uploads in India—free, instant, no upload, works on mobile.",
    keywords: [
      "resize image to 200kb",
      "compress to 200kb",
      "under 200kb",
      "resize photo to 200kb",
      "government form upload",
      "india",
      "no upload",
    ],
    related: ["resize-image", "compress-image", "heic-to-jpg"],
  },
  {
    slug: "image-to-pdf",
    path: "/image-to-pdf",
    title: "Image to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert images to a single PDF free in your browser—no upload needed. Useful for government form documents in India.",
    keywords: ["image to pdf", "jpg to pdf", "pdf converter", "india", "no upload"],
    related: ["jpg-to-pdf", "png-to-pdf", "heic-to-pdf"],
  },
  {
    slug: "jpg-to-pdf",
    path: "/jpg-to-pdf",
    title: "JPG to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG/JPEG photos into a single PDF in your browser with no upload. Free and private.",
    keywords: ["jpg to pdf", "jpeg to pdf", "image to pdf", "india", "no upload"],
    related: ["image-to-pdf", "png-to-pdf", "compress-image"],
  },
  {
    slug: "png-to-pdf",
    path: "/png-to-pdf",
    title: "PNG to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG images into one PDF in your browser. No upload required and works on mobile.",
    keywords: ["png to pdf", "convert png to pdf", "pdf converter", "india", "no upload"],
    related: ["image-to-pdf", "jpg-to-pdf", "webp-to-pdf"],
  },
  {
    slug: "webp-to-pdf",
    path: "/webp-to-pdf",
    title: "WebP to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert WebP images into a single PDF in your browser with no upload.",
    keywords: ["webp to pdf", "convert webp to pdf", "pdf converter", "india", "no upload"],
    related: ["image-to-pdf", "png-to-pdf", "jpg-to-pdf"],
  },
  {
    slug: "heic-to-pdf",
    path: "/heic-to-pdf",
    title: "HEIC to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert iPhone HEIC photos to PDF in your browser. HEIC files are converted on-device with no upload.",
    keywords: ["heic to pdf", "iphone heic to pdf", "pdf converter", "india", "no upload"],
    related: ["image-to-pdf", "heic-to-jpg", "jpg-to-pdf"],
  },
  {
    slug: "avif-to-pdf",
    path: "/avif-to-pdf",
    title: "AVIF to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert AVIF images into one PDF directly in your browser with no upload.",
    keywords: ["avif to pdf", "convert avif to pdf", "pdf converter", "india", "no upload"],
    related: ["image-to-pdf", "avif-to-jpg", "png-to-pdf"],
  },
] as const satisfies readonly ToolDefinition[];

export function getTool(slug: ToolDefinition["slug"]): ToolDefinition {
  const found = (TOOLS as readonly ToolDefinition[]).find((t) => t.slug === slug);
  if (!found) throw new Error(`Unknown tool slug: ${slug}`);
  return found;
}

export function generateToolMetadata(tool: ToolDefinition): Metadata {
  const title = tool.title;
  const description = tool.description;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: tool.path,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: tool.path,
      locale: "en_IN",
      siteName: "ImgTools",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
