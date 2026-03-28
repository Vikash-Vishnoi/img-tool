import type { Metadata } from "next";
import {
  compressImageFAQs,
  jpgToPdfFAQs,
  pngToWebpFAQs,
  resizeAadharPhotoFAQs,
  resizePassportPhotoFAQs,
  resizeTo200kbFAQs,
} from "@/lib/faqData";

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
  faqHeading?: string;
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
    ],
    related: ["heic-to-jpg", "compress-image", "resize-image"],
  },
  {
    slug: "heic-to-jpg",
    path: "/heic-to-jpg",
    title: "HEIC to JPG Converter — Free, Instant, No Upload",
    description:
      "Convert iPhone HEIC photos to JPG free in your browser. No upload needed. Works on mobile (Android/iPhone) and on Windows/Mac.",
    keywords: ["heic to jpg", "convert heic", "iphone photo converter"],
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
    slug: "heic-to-png",
    path: "/heic-to-png",
    title: "HEIC to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert iPhone HEIC and HEIF photos to PNG in your browser with no upload. Keeps transparency. Works on Android and iPhone instantly.",
    keywords: [
      "heic to png",
      "heif to png",
      "iphone photo to png",
      "convert heic",
      "no upload",
    ],
    related: ["heic-to-jpg", "png-to-jpg", "compress-image"],
  },
  {
    slug: "heic-to-webp",
    path: "/heic-to-webp",
    title: "HEIC to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert iPhone HEIC and HEIF photos to WebP in your browser with no upload. Fast, private, and mobile-friendly.",
    keywords: [
      "heic to webp",
      "heif to webp",
      "iphone photo to webp",
      "convert heic",
      "no upload",
    ],
    related: ["heic-to-jpg", "heic-to-png", "webp-to-jpg"],
  },
  {
    slug: "heic-to-avif",
    path: "/heic-to-avif",
    title: "HEIC to AVIF Converter — Free, No Upload, Smaller Files",
    description:
      "Convert iPhone HEIC and HEIF photos to AVIF in your browser with no upload. Smaller files at high quality. Works on Android and iPhone.",
    keywords: [
      "heic to avif",
      "heif to avif",
      "iphone photo to avif",
      "convert heic",
      "no upload",
    ],
    related: ["heic-to-jpg", "heic-to-png", "webp-to-avif"],
  },
  {
    slug: "heif-to-jpg",
    path: "/heif-to-jpg",
    title: "HEIF to JPG Converter — Free, No Upload, Files Stay Private",
    description:
      "Convert iPhone HEIF photos to JPG free in your browser. No upload needed and works on mobile.",
    keywords: ["heif to jpg", "convert heif", "iphone heif converter", "no upload"],
    related: ["heic-to-jpg", "heif-to-png", "compress-image"],
  },
  {
    slug: "heif-to-png",
    path: "/heif-to-png",
    title: "HEIF to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert iPhone HEIF photos to PNG in your browser with no upload. Files stay on your device.",
    keywords: ["heif to png", "convert heif", "iphone heif to png", "no upload"],
    related: ["heic-to-png", "heif-to-jpg", "png-to-jpg"],
  },
  {
    slug: "heif-to-webp",
    path: "/heif-to-webp",
    title: "HEIF to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert iPhone HEIF photos to WebP in your browser with no upload. Fast, private, and mobile-friendly.",
    keywords: ["heif to webp", "convert heif", "iphone heif to webp", "no upload"],
    related: ["heic-to-webp", "heif-to-jpg", "webp-to-jpg"],
  },
  {
    slug: "heif-to-avif",
    path: "/heif-to-avif",
    title: "HEIF to AVIF Converter — Free, No Upload, Smaller Files",
    description:
      "Convert iPhone HEIF photos to AVIF in your browser with no upload for modern compression.",
    keywords: ["heif to avif", "convert heif", "iphone heif to avif", "no upload"],
    related: ["heic-to-avif", "heif-to-jpg", "webp-to-avif"],
  },
  {
    slug: "heif-to-pdf",
    path: "/heif-to-pdf",
    title: "HEIF to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert iPhone HEIF photos to PDF in your browser. Files are processed on-device with no upload.",
    keywords: ["heif to pdf", "iphone heif to pdf", "pdf converter", "no upload"],
    related: ["heic-to-pdf", "image-to-pdf", "heif-to-jpg"],
  },
  {
    slug: "compress-image",
    path: "/compress-image",
    title: "Compress Image for WhatsApp — Reduce Size Free",
    description:
      "Compress JPG/PNG/WebP free in your browser—no upload needed. Works on mobile and helps meet government form upload limits.",
    keywords: [
      "compress image",
      "compress for whatsapp",
      "reduce image size",
      "no upload",
    ],
    faqs: compressImageFAQs,
    related: ["resize-image-to-200kb", "resize-image", "heic-to-jpg"],
  },
  {
    slug: "compress-jpg",
    path: "/compress-jpg",
    title: "Compress JPG Without Losing Quality — Free Online",
    description:
      "Compress JPG photos in your browser with no upload. Fast and private on mobile and desktop.",
    keywords: ["compress jpg", "jpg compressor", "reduce jpg size", "no upload"],
    related: ["compress-image", "compress-jpeg", "resize-jpg"],
  },
  {
    slug: "compress-jpeg",
    path: "/compress-jpeg",
    title: "Compress JPEG Image — Free, No Upload, Works on Mobile",
    description:
      "Compress JPEG photos in your browser with no upload. Fast and private on mobile and desktop.",
    keywords: ["compress jpeg", "jpeg compressor", "reduce jpeg size", "no upload"],
    related: ["compress-image", "compress-jpg", "resize-jpeg"],
  },
  {
    slug: "compress-png",
    path: "/compress-png",
    title: "Compress PNG File Size Online — Free, No Upload",
    description:
      "Compress PNG images in your browser with no upload. Keep quality while reducing file size for WhatsApp, email, and government portals. Works on mobile.",
    keywords: ["compress png", "png compressor", "reduce png size", "no upload"],
    related: ["compress-image", "resize-png", "png-to-jpg"],
  },
  {
    slug: "compress-webp",
    path: "/compress-webp",
    title: "Compress WebP Image — Free, No Upload, Works on Mobile",
    description:
      "Compress WebP images in your browser with no upload for smaller files and faster sharing. Works on Android and iPhone. Files stay on your device.",
    keywords: ["compress webp", "webp compressor", "reduce webp size", "no upload"],
    related: ["compress-image", "resize-webp", "webp-to-jpg"],
  },
  {
    slug: "compress-avif",
    path: "/compress-avif",
    title: "Compress AVIF Image — Free, No Upload, Works on Mobile",
    description:
      "Compress AVIF images in your browser with no upload. Files stay on your device—100% private. Works on Android and iPhone. Reduces size instantly.",
    keywords: ["compress avif", "avif compressor", "reduce avif size", "no upload"],
    related: ["compress-image", "resize-avif", "avif-to-jpg"],
  },
  {
    slug: "compress-heic",
    path: "/compress-heic",
    title: "Compress iPhone HEIC Photos — Reduce Size Free",
    description:
      "Compress iPhone HEIC photos in your browser with no upload—completely private. Reduce file size for WhatsApp, email, and government form uploads.",
    keywords: ["compress heic", "heic compressor", "reduce heic size", "no upload"],
    related: ["compress-image", "resize-heic", "heic-to-jpg"],
  },
  {
    slug: "compress-heif",
    path: "/compress-heif",
    title: "Compress HEIF Image — Free, No Upload, Works on Mobile",
    description:
      "Compress iPhone HEIC/HEIF photos in your browser with no upload—completely private. Reduce file size for WhatsApp, email, and government form uploads.",
    keywords: ["compress heif", "heif compressor", "reduce heif size", "no upload"],
    related: ["compress-image", "resize-heif", "heif-to-jpg"],
  },
  {
    slug: "png-to-webp",
    path: "/png-to-webp",
    title: "PNG to WebP Converter — Reduce Size 30%, Free",
    description:
      "Convert PNG to WebP free in your browser. No upload needed, works on mobile for faster websites and smaller files.",
    keywords: ["png to webp", "convert png", "webp converter", "no upload"],
    faqs: pngToWebpFAQs,
    related: ["webp-to-png", "webp-to-jpg", "compress-image"],
  },
  {
    slug: "jpg-to-png",
    path: "/jpg-to-png",
    title: "JPG to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG to PNG free in your browser—no upload needed. Works on Android, iPhone, Windows, and Mac. Supports transparent backgrounds automatically.",
    keywords: ["jpg to png", "convert jpg", "png converter", "no upload"],
    related: ["png-to-jpg", "jpg-to-webp", "compress-image"],
  },
  {
    slug: "png-to-jpg",
    path: "/png-to-jpg",
    title: "PNG to JPG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG to JPG free in your browser. No upload needed, works on mobile. White background applied to transparent PNGs automatically for clean output.",
    keywords: [
      "png to jpg",
      "png to jpeg",
      "convert png to jpg",
      "no upload",
    ],
    related: ["jpg-to-png", "compress-image", "resize-image"],
  },
  {
    slug: "jpg-to-webp",
    path: "/jpg-to-webp",
    title: "JPG to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG to WebP free in your browser. No upload needed. WebP files are 30% smaller than JPG. Works on mobile. Great for faster websites and apps.",
    keywords: ["jpg to webp", "convert jpg", "webp converter", "no upload"],
    related: ["png-to-webp", "compress-image", "resize-image"],
  },
  {
    slug: "webp-to-jpg",
    path: "/webp-to-jpg",
    title: "WebP to JPG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert WebP to JPG free in your browser—no upload needed. Useful when a website or app doesn't accept WebP. Works on Android and iPhone. Instant download.",
    keywords: [
      "webp to jpg",
      "webp to jpeg",
      "convert webp",
      "no upload",
    ],
    related: ["jpg-to-webp", "webp-to-png", "compress-image"],
  },
  {
    slug: "webp-to-png",
    path: "/webp-to-png",
    title: "WebP to PNG Converter — Transparent Background, Free",
    description:
      "Convert WebP to PNG free in your browser. No upload needed, works on mobile. Keeps transparent backgrounds. Supports Android, iPhone, Windows, and Mac.",
    keywords: ["webp to png", "convert webp", "png converter", "no upload"],
    related: ["png-to-webp", "jpg-to-png", "compress-image"],
  },
  {
    slug: "jpg-to-avif",
    path: "/jpg-to-avif",
    title: "JPG to AVIF Converter — Free, No Upload, Smaller Files",
    description:
      "Convert JPG to AVIF free in your browser. No upload needed. AVIF files are 30–50% smaller than JPG. Works on Android and iPhone without any app install.",
    keywords: ["jpg to avif", "convert jpg", "avif converter", "no upload"],
    related: ["png-to-avif", "webp-to-avif", "compress-image"],
  },
  {
    slug: "png-to-avif",
    path: "/png-to-avif",
    title: "PNG to AVIF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG to AVIF free in your browser. No upload needed, works on mobile. AVIF gives smaller files at the same visual quality as PNG. Instant download.",
    keywords: ["png to avif", "convert png", "avif converter", "no upload"],
    related: ["jpg-to-avif", "webp-to-avif", "compress-image"],
  },
  {
    slug: "webp-to-avif",
    path: "/webp-to-avif",
    title: "WebP to AVIF Converter — Free, No Upload, Smaller Files",
    description:
      "Convert WebP to AVIF free in your browser—no upload needed. AVIF gives maximum compression at the same quality. Works on Android and iPhone instantly.",
    keywords: ["webp to avif", "convert webp", "avif converter", "no upload"],
    related: ["jpg-to-avif", "png-to-avif", "compress-image"],
  },
  {
    slug: "avif-to-jpg",
    path: "/avif-to-jpg",
    title: "AVIF to JPG Converter — Free Online, No Install",
    description:
      "Convert AVIF to JPG free in your browser—no upload needed. Useful for compatibility with older apps and sites.",
    keywords: ["avif to jpg", "avif to jpeg", "convert avif", "no upload"],
    related: ["avif-to-png", "avif-to-webp", "compress-image"],
  },
  {
    slug: "avif-to-png",
    path: "/avif-to-png",
    title: "AVIF to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert AVIF to PNG free in your browser. No upload needed, works on mobile. Preserves transparency and supports Android, iPhone, Windows, and Mac.",
    keywords: ["avif to png", "convert avif", "png converter", "no upload"],
    related: ["avif-to-jpg", "avif-to-webp", "compress-image"],
  },
  {
    slug: "avif-to-webp",
    path: "/avif-to-webp",
    title: "AVIF to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert AVIF to WebP free in your browser—no upload needed. Useful when you need wide browser support and small files. Works on mobile instantly.",
    keywords: ["avif to webp", "convert avif", "webp converter", "no upload"],
    related: ["avif-to-jpg", "avif-to-png", "compress-image"],
  },
  {
    slug: "resize-image",
    path: "/resize-image",
    title: "Resize Image to Passport Size — Free Online",
    description:
      "Resize images to passport size, Aadhaar photo, WhatsApp DP, Instagram, and more—free, instant, no upload. Works on Android and iPhone.",
    keywords: [
      "resize image",
      "passport size photo",
      "passport photo 35x45mm",
      "413x531 passport photo",
      "aadhar photo size",
      "aadhar photo 35x35mm",
      "413x413 aadhar photo",
      "whatsapp dp size 500x500",
      "instagram post size 1080x1080",
      "facebook cover size 820x312",
      "resize online",
      "image resizer",
      "no upload",
    ],
    related: ["resize-image-to-200kb", "compress-image", "image-to-pdf"],
  },
  {
    slug: "resize-jpg",
    path: "/resize-jpg",
    title: "Resize JPG Image — Free, No Upload, Works on Mobile",
    description:
      "Resize JPG photos by pixels or preset sizes in your browser with no upload. Supports passport size, WhatsApp DP, Instagram, and custom dimensions. Works on mobile.",
    keywords: ["resize jpg", "jpg resizer", "resize photo", "no upload"],
    related: ["resize-image", "resize-jpeg", "compress-jpg"],
  },
  {
    slug: "resize-jpeg",
    path: "/resize-jpeg",
    title: "Resize JPEG Image — Free, No Upload, Works on Mobile",
    description:
      "Resize JPG/JPEG photos by pixels or preset sizes in your browser with no upload. Supports passport, WhatsApp DP, Instagram, and custom dimensions. Works on mobile.",
    keywords: ["resize jpeg", "jpeg resizer", "resize photo", "no upload"],
    related: ["resize-image", "resize-jpg", "compress-jpeg"],
  },
  {
    slug: "resize-png",
    path: "/resize-png",
    title: "Resize PNG Image — Free, No Upload, Works on Mobile",
    description:
      "Resize PNG images by pixels or preset sizes in your browser with no upload. Supports passport size, WhatsApp DP, Instagram, and custom dimensions. Works on mobile.",
    keywords: ["resize png", "png resizer", "resize image", "no upload"],
    related: ["resize-image", "compress-png", "png-to-jpg"],
  },
  {
    slug: "resize-webp",
    path: "/resize-webp",
    title: "Resize WebP Image — Free, No Upload, Works on Mobile",
    description:
      "Resize WebP images by pixels or preset sizes in your browser with no upload. Supports passport size, WhatsApp DP, Instagram, and custom dimensions. Works on mobile.",
    keywords: ["resize webp", "webp resizer", "resize image", "no upload"],
    related: ["resize-image", "compress-webp", "webp-to-jpg"],
  },
  {
    slug: "resize-avif",
    path: "/resize-avif",
    title: "Resize AVIF Image — Free, No Upload, Works on Mobile",
    description:
      "Resize AVIF images by pixels or preset sizes in your browser with no upload. Supports passport, WhatsApp DP, Instagram, and custom dimensions. Works on mobile.",
    keywords: ["resize avif", "avif resizer", "resize image", "no upload"],
    related: ["resize-image", "compress-avif", "avif-to-jpg"],
  },
  {
    slug: "resize-heic",
    path: "/resize-heic",
    title: "Resize HEIC Image — Free, No Upload, Works on Mobile",
    description:
      "Resize iPhone HEIC photos by pixels or presets in your browser with no upload. Supports passport size, WhatsApp DP, Instagram, and custom px. Works on mobile.",
    keywords: ["resize heic", "heic resizer", "iphone photo resize", "no upload"],
    related: ["resize-image", "compress-heic", "heic-to-jpg"],
  },
  {
    slug: "resize-heif",
    path: "/resize-heif",
    title: "Resize HEIF Image — Free, No Upload, Works on Mobile",
    description:
      "Resize iPhone HEIC/HEIF photos by pixels or presets in your browser with no upload. Supports passport size, WhatsApp DP, Instagram, and custom px. Works on mobile.",
    keywords: ["resize heif", "heif resizer", "iphone photo resize", "no upload"],
    related: ["resize-image", "compress-heif", "heif-to-jpg"],
  },
  {
    slug: "resize-passport-photo",
    path: "/resize-passport-photo",
    title: "Passport Size Photo Resize — 35x45mm Free",
    description:
      "Resize image to passport photo size 35x45mm (413x531 px at 300 DPI) in your browser with no upload.",
    keywords: ["passport photo 35x45mm", "413x531", "resize passport photo", "no upload"],
    faqs: resizePassportPhotoFAQs,
    faqHeading: "Passport photo size - common questions",
    related: ["resize-image", "resize-image-to-200kb", "resize-aadhar-photo"],
  },
  {
    slug: "resize-aadhar-photo",
    path: "/resize-aadhar-photo",
    title: "Resize Photo for Aadhaar — Under 200KB Free",
    description:
      "Resize image to Aadhaar card photo size 35x35mm (413x413 px at 300 DPI) in your browser with no upload.",
    keywords: ["aadhar photo 35x35mm", "413x413", "resize aadhar photo", "no upload"],
    faqs: resizeAadharPhotoFAQs,
    related: ["resize-image", "resize-passport-photo", "resize-image-to-200kb"],
  },
  {
    slug: "resize-whatsapp-dp",
    path: "/resize-whatsapp-dp",
    title: "Resize Image for WhatsApp DP — 500x500px Free",
    description:
      "Resize image to WhatsApp DP size 500×500 px in your browser with no upload. Free, instant, works on Android and iPhone. Perfect square crop for profile.",
    keywords: ["whatsapp dp size", "500x500", "resize whatsapp dp", "no upload"],
    related: ["resize-image", "resize-instagram-post", "compress-image"],
  },
  {
    slug: "resize-instagram-post",
    path: "/resize-instagram-post",
    title: "Resize Image for Instagram Post — 1080x1080 Free",
    description:
      "Resize image to Instagram post size 1080×1080 px in your browser with no upload. Free, instant, works on Android and iPhone. No app install needed.",
    keywords: ["instagram post size", "1080x1080", "resize instagram post", "no upload"],
    related: ["resize-image", "resize-instagram-story", "compress-image"],
  },
  {
    slug: "resize-instagram-story",
    path: "/resize-instagram-story",
    title: "Resize Instagram Story / Reel 1080x1920 px — Free Online",
    description:
      "Resize image to Instagram story and reel size 1080×1920 px in your browser with no upload. Free, instant, works on Android and iPhone. No install needed.",
    keywords: ["instagram story size", "1080x1920", "resize instagram reel", "no upload"],
    related: ["resize-image", "resize-instagram-post", "compress-image"],
  },
  {
    slug: "resize-youtube-thumbnail",
    path: "/resize-youtube-thumbnail",
    title: "YouTube Thumbnail Resize — 1280x720px Free",
    description:
      "Resize image to YouTube thumbnail size 1280x720 px in your browser with no upload.",
    keywords: ["youtube thumbnail size", "1280x720", "resize youtube thumbnail", "no upload"],
    related: ["resize-image", "resize-facebook-post", "compress-image"],
  },
  {
    slug: "resize-facebook-post",
    path: "/resize-facebook-post",
    title: "Resize Facebook Post 1200x630 px — Free Online",
    description:
      "Resize image to Facebook post size 1200x630 px in your browser with no upload.",
    keywords: ["facebook post size", "1200x630", "resize facebook post", "no upload"],
    related: ["resize-image", "resize-facebook-cover", "compress-image"],
  },
  {
    slug: "resize-facebook-cover",
    path: "/resize-facebook-cover",
    title: "Facebook Cover Photo Size — 820x312px Resizer Free",
    description:
      "Resize image to Facebook cover photo size 820×312 px in your browser with no upload. Free, instant, works on Android and iPhone. No app or software needed.",
    keywords: ["facebook cover size", "820x312", "resize facebook cover", "no upload"],
    related: ["resize-image", "resize-facebook-post", "compress-image"],
  },
  {
    slug: "resize-signature-upload",
    path: "/resize-signature-upload",
    title: "Resize Signature for Online Form — Under 10KB Free",
    description:
      "Resize signature image to 400×150 px for online form uploads in your browser—no upload needed. Under 10KB output. Works on Android and iPhone.",
    keywords: ["signature size 400x150", "resize signature", "signature upload", "no upload"],
    related: ["resize-image", "resize-image-to-200kb", "compress-image"],
  },
  {
    slug: "resize-2x2-photo",
    path: "/resize-2x2-photo",
    title: "Resize Photo to 2x2 Inch — US Visa & Passport",
    description:
      "Resize image to 2x2 inch photo size 600x600 px at 300 DPI in your browser with no upload.",
    keywords: ["2x2 inch photo", "600x600", "resize 2x2 photo", "no upload"],
    related: ["resize-image", "resize-passport-photo", "resize-aadhar-photo"],
  },
  {
    slug: "resize-product-square",
    path: "/resize-product-square",
    title: "Resize Product Image Square — Amazon Flipkart Size",
    description:
      "Resize product image to 1000×1000 px square in your browser with no upload. Ideal for Amazon, Flipkart, and Meesho product listings. Free, instant, works on mobile.",
    keywords: ["product image 1000x1000", "resize product image", "square image", "no upload"],
    related: ["resize-image", "resize-instagram-post", "compress-image"],
  },
  {
    slug: "resize-image-to-200kb",
    path: "/resize-image-to-200kb",
    title: "Resize Image to 200KB — For Govt Form Uploads",
    description:
      "Resize and compress an image to a target size like 200KB for government form uploads—free, instant, no upload, works on mobile.",
    keywords: [
      "resize image to 200kb",
      "compress to 200kb",
      "under 200kb",
      "resize photo to 200kb",
      "government form upload",
      "no upload",
    ],
    faqs: resizeTo200kbFAQs,
    related: ["resize-image", "compress-image", "heic-to-jpg"],
  },
  {
    slug: "image-to-pdf",
    path: "/image-to-pdf",
    title: "Image to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG, PNG, WebP images to a single PDF free in your browser—no upload needed. Works on mobile. Perfect for government form document submissions.",
    keywords: ["image to pdf", "jpg to pdf", "pdf converter", "no upload"],
    related: ["jpg-to-pdf", "png-to-pdf", "heic-to-pdf", "pdf-to-image"],
  },
  {
    slug: "pdf-to-image",
    path: "/pdf-to-image",
    title: "PDF to Image Converter — JPG, PNG, WebP, AVIF",
    description:
      "Convert PDF pages to images in your browser with no upload. Choose JPG, PNG, WebP, or AVIF and download one-by-one or all at once.",
    keywords: [
      "pdf to image",
      "pdf to jpg",
      "pdf to png",
      "pdf to webp",
      "pdf to avif",
      "no upload",
    ],
    related: ["image-to-pdf", "jpg-to-pdf", "png-to-pdf", "compress-image"],
  },
  {
    slug: "pdf-to-jpg",
    path: "/pdf-to-jpg",
    title: "PDF to JPG Converter — Free, No Upload",
    description:
      "Convert PDF pages to JPG in your browser with no upload. Download each page one-by-one or all at once.",
    keywords: ["pdf to jpg", "pdf to image", "no upload"],
    related: ["pdf-to-image", "pdf-to-jpeg", "jpg-to-pdf"],
  },
  {
    slug: "pdf-to-jpeg",
    path: "/pdf-to-jpeg",
    title: "PDF to JPEG Converter — Free, No Upload",
    description:
      "Convert PDF pages to JPEG in your browser with no upload. Download each page one-by-one or all at once.",
    keywords: ["pdf to jpeg", "pdf to image", "no upload"],
    related: ["pdf-to-image", "pdf-to-jpg", "jpeg-to-pdf"],
  },
  {
    slug: "pdf-to-png",
    path: "/pdf-to-png",
    title: "PDF to PNG Converter — Free, No Upload",
    description:
      "Convert PDF pages to PNG in your browser with no upload. Download each page one-by-one or all at once.",
    keywords: ["pdf to png", "pdf to image", "no upload"],
    related: ["pdf-to-image", "png-to-pdf", "compress-png"],
  },
  {
    slug: "pdf-to-webp",
    path: "/pdf-to-webp",
    title: "PDF to WebP Converter — Free, No Upload",
    description:
      "Convert PDF pages to WebP in your browser with no upload. Download each page one-by-one or all at once.",
    keywords: ["pdf to webp", "pdf to image", "no upload"],
    related: ["pdf-to-image", "webp-to-pdf", "compress-webp"],
  },
  {
    slug: "pdf-to-avif",
    path: "/pdf-to-avif",
    title: "PDF to AVIF Converter — Free, No Upload",
    description:
      "Convert PDF pages to AVIF in your browser with no upload. Download each page one-by-one or all at once.",
    keywords: ["pdf to avif", "pdf to image", "no upload"],
    related: ["pdf-to-image", "avif-to-pdf", "compress-avif"],
  },
  {
    slug: "jpg-to-pdf",
    path: "/jpg-to-pdf",
    title: "JPG to PDF Converter — Free Online, No Watermark",
    description:
      "Convert JPG/JPEG photos into a single PDF in your browser with no upload. Free and private.",
    keywords: ["jpg to pdf", "jpeg to pdf", "image to pdf", "no upload"],
    faqs: jpgToPdfFAQs,
    related: ["image-to-pdf", "png-to-pdf", "compress-image"],
  },
  {
    slug: "jpeg-to-pdf",
    path: "/jpeg-to-pdf",
    title: "JPEG to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPEG images into one PDF in your browser with no upload. Free and private.",
    keywords: ["jpeg to pdf", "image to pdf", "pdf converter", "no upload"],
    related: ["jpg-to-pdf", "image-to-pdf", "compress-jpeg"],
  },
  {
    slug: "png-to-pdf",
    path: "/png-to-pdf",
    title: "PNG to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG images into a single PDF in your browser. No upload required, works on mobile. Ideal for government form submissions and document sharing.",
    keywords: ["png to pdf", "convert png to pdf", "pdf converter", "no upload"],
    related: ["image-to-pdf", "jpg-to-pdf", "webp-to-pdf"],
  },
  {
    slug: "webp-to-pdf",
    path: "/webp-to-pdf",
    title: "WebP to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert WebP images into a single PDF in your browser with no upload. Works on Android and iPhone. Ideal for document submissions and government portals.",
    keywords: ["webp to pdf", "convert webp to pdf", "pdf converter", "no upload"],
    related: ["image-to-pdf", "png-to-pdf", "jpg-to-pdf"],
  },
  {
    slug: "heic-to-pdf",
    path: "/heic-to-pdf",
    title: "HEIC to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert iPhone HEIC photos to PDF in your browser—files converted on-device with no upload. Works on Android and iPhone. Useful for document submissions.",
    keywords: ["heic to pdf", "iphone heic to pdf", "pdf converter", "no upload"],
    related: ["image-to-pdf", "heic-to-jpg", "jpg-to-pdf"],
  },
  {
    slug: "avif-to-pdf",
    path: "/avif-to-pdf",
    title: "AVIF to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert AVIF images to a single PDF free in your browser—no upload needed. Works on Android and iPhone. Ideal for government document submissions.",
    keywords: ["avif to pdf", "convert avif to pdf", "pdf converter", "no upload"],
    related: ["image-to-pdf", "avif-to-jpg", "png-to-pdf"],
  },
] as const satisfies readonly ToolDefinition[];

export function getTool(slug: ToolDefinition["slug"]): ToolDefinition {
  const found = (TOOLS as readonly ToolDefinition[]).find((t) => t.slug === slug);
  if (!found) throw new Error(`Unknown tool slug: ${slug}`);
  return found;
}

function normalizeToolNameForFaq(title: string): string {
  return title.replace(/\s+[—-]\s+.*$/, "").trim();
}

function buildDefaultFaqs(tool: ToolDefinition): FaqItem[] {
  const toolName = normalizeToolNameForFaq(tool.title);

  return [
    {
      question: `How do I use the ${toolName}?`,
      answer:
        `Open the tool, upload your file, choose your preferred settings, and download the result. ${tool.description}`,
    },
    {
      question: "Are my files uploaded to a server?",
      answer:
        "This tool is designed to process files directly in your browser, so your files stay on your device during conversion or compression.",
    },
    {
      question: "Does this tool work on Android and iPhone?",
      answer:
        "Yes. The tool works in modern mobile browsers on Android and iPhone, and it also works on desktop browsers.",
    },
    {
      question: "Do I need to install an app to use this tool?",
      answer:
        "No app installation is required. You can use the tool directly in your browser and download the output instantly.",
    },
  ];
}

export function getToolFaqs(tool: ToolDefinition): FaqItem[] {
  if (tool.faqs && tool.faqs.length > 0) {
    return tool.faqs;
  }

  return buildDefaultFaqs(tool);
}

type ToolMetadataOverride = {
  title?: string;
  canonicalPath?: `/${string}`;
};

export function getOgSvgPath(slug: string): `/${string}` {
  return `/og/${slug}.png`;
}

const TOOL_METADATA_OVERRIDES: Record<string, ToolMetadataOverride> = {
  "avif-to-jpg": { title: "AVIF to JPG Converter — Free, No Install" },
  "avif-to-pdf": { title: "AVIF to PDF Converter — Free, No Upload" },
  "avif-to-png": { title: "AVIF to PNG Converter — Free, No Upload" },
  "avif-to-webp": { title: "AVIF to WebP Converter — Free, No Upload" },
  "compress-avif": { title: "Compress AVIF Image — Free, No Upload" },
  "compress-heic": { title: "Compress iPhone HEIC Photos — Reduce Size Free" },
  "compress-image": { title: "Compress Image for WhatsApp — Free" },
  "compress-jpg": { title: "Compress JPG Without Losing Quality — Free" },
  "compress-png": { title: "Compress PNG File Size Online — Free" },
  "compress-webp": { title: "Compress WebP Image — Free, No Upload" },
  "heic-to-avif": { title: "HEIC to AVIF Converter — Free, Smaller Files" },
  "heic-to-jpg": { title: "HEIC to JPG Converter — Free, Instant, No Upload" },
  "heic-to-pdf": { title: "HEIC to PDF Converter — Free, No Upload" },
  "heic-to-png": { title: "HEIC to PNG Converter — Free, No Upload" },
  "heic-to-webp": { title: "HEIC to WebP Converter — Free, No Upload" },
  "image-converter": { title: "Universal Image Converter — Free Online" },
  "image-to-pdf": { title: "Image to PDF Converter — Free, No Upload" },
  "jpeg-to-pdf": { title: "JPG to PDF Converter — Free, No Watermark" },
  "jpg-to-avif": { title: "JPG to AVIF Converter — Free, No Upload" },
  "jpg-to-pdf": { title: "JPG to PDF Converter — Free, No Watermark" },
  "jpg-to-png": { title: "JPG to PNG Converter — Free, No Upload" },
  "jpg-to-webp": { title: "JPG to WebP Converter — Free, No Upload" },
  "png-to-avif": { title: "PNG to AVIF Converter — Free, No Upload" },
  "png-to-jpg": { title: "PNG to JPG Converter — Free, No Upload" },
  "png-to-pdf": { title: "PNG to PDF Converter — Free, No Upload" },
  "resize-avif": { title: "Resize AVIF Image — Free, No Upload" },
  "resize-facebook-cover": {
    title: "Facebook Cover Photo Size — 820x312 Resizer Free",
  },
  "resize-heic": { title: "Resize HEIC Image — Free, No Upload" },
  "resize-heif": {
    title: "Resize HEIC Image — Free, No Upload",
    canonicalPath: "/resize-heic",
  },
  "resize-image": { title: "Resize Image — Passport, WhatsApp, Instagram Free" },
  "resize-instagram-post": {
    title: "Resize for Instagram Post — 1080x1080 Free",
  },
  "resize-instagram-story": {
    title: "Instagram Story Resize — 1080x1920 Free",
  },
  "resize-jpg": { title: "Resize JPG Image — Free, No Upload" },
  "resize-png": { title: "Resize PNG Image — Free, No Upload" },
  "resize-product-square": {
    title: "Resize Product Image Square — Amazon Flipkart",
  },
  "resize-signature-upload": {
    title: "Resize Signature for Online Form — Under 10KB",
  },
  "resize-webp": { title: "Resize WebP Image — Free, No Upload" },
  "webp-to-avif": { title: "WebP to AVIF Converter — Free, Smaller Files" },
  "webp-to-jpg": { title: "WebP to JPG Converter — Free, No Upload" },
  "webp-to-pdf": { title: "WebP to PDF Converter — Free, No Upload" },
  "webp-to-png": { title: "WebP to PNG Converter — Transparent BG, Free" },
};

export function generateToolMetadata(tool: ToolDefinition): Metadata {
  const override = TOOL_METADATA_OVERRIDES[tool.slug];
  const title = override?.title ?? tool.title;
  const description = tool.description;
  const canonicalPath = override?.canonicalPath ?? tool.path;
  const ogImage = getOgSvgPath(tool.slug);

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalPath,
      locale: "en",
      siteName: "Image Tools",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
