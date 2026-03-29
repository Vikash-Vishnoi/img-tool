import type { BlogPost } from "./types";

export const post: BlogPost = {
    slug: "passport-photo-size-requirements-india",
    title: "Passport Photo Size Requirements in India (Latest Practical Guide)",
    description:
      "Exact passport photo dimensions in India, plus practical guidance to resize and prepare files correctly for online forms.",
    phase: 1,
    cluster: "Resize Image and Passport Hub",
    targetKeywords: [
      "passport photo requirements india",
      "passport photo dimensions india",
      "passport size photo online",
    ],
    hubToolPaths: ["/resize-passport-photo", "/resize-image"],
    readMinutes: 7,
        updatedAt: "2026-03-29",
    author: {
      name: "Image Tools Editorial Team",
      role: "Content Team",
      bio: "The Image Tools Editorial Team creates practical, tested guides for image conversion, compression, resizing, and submission workflows.",
      profilePath: "/about",
    },
    reviewer: {
      name: "Image Tools QA Team",
      role: "Technical Review Team",
      bio: "The Image Tools QA Team reviews each guide for technical accuracy, workflow clarity, and real-world upload reliability.",
      profilePath: "/about",
    },
    intro: [
      "A passport photo can be rejected even when the face looks correct. Most rejections happen because dimensions, background, or file specs do not match the form rules.",
      "This quick guide focuses on practical dimensions and upload-ready preparation for India-focused workflows.",
    ],
    sections: [
      {
        heading: "Common size requirements",
        bullets: [
          "35mm x 45mm physical size is widely used",
          "Digital equivalent often around 413 x 531 pixels",
          "Plain, light background with clear face visibility",
          "No heavy shadows, filters, or low-light blur",
        ],
      },
      {
        heading: "How to prepare a compliant image",
        steps: [
          "Crop to proper head and shoulder frame.",
          "Resize to exact passport dimensions required by the portal.",
          "Compress only enough to fit size limit while preserving facial clarity.",
          "Check final file format, usually JPG.",
          "Upload and keep backup copy for future forms.",
        ],
      },
      {
        heading: "Quick rejection-prevention checklist",
        bullets: [
          "Face centered and clearly visible",
          "No pixelation after compression",
          "File name is simple and alphanumeric",
          "Dimensions and KB limit both verified",
        ],
      },
    ],
    toolAnchors: [
      { label: "passport photo resizer", href: "/resize-passport-photo" },
      { label: "resize image for forms", href: "/resize-image" },
      { label: "compress final passport photo", href: "/compress-image" },
    ],
    relatedPosts: [
      "aadhaar-photo-size-requirements",
      "resize-photo-for-online-application",
      "compress-image-for-government-form",
    ],
  };







