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
    related: ["compress-image", "jpg-to-png", "resize-image"],
  },
  {
    slug: "jpg-to-png",
    path: "/jpg-to-png",
    title: "JPG to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG to PNG free in your browser—no upload needed. Works on Android/iPhone and Windows/Mac in India.",
    keywords: ["jpg to png", "convert jpg", "png converter", "india", "no upload"],
    related: ["png-to-webp", "compress-image", "resize-image"],
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
      "aadhar photo size",
      "resize online",
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
    related: ["compress-image", "resize-image", "resize-image-to-200kb"],
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
