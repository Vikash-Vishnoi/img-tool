import type { BlogPost } from "./types";

export const post: BlogPost = {
    slug: "resize-photo-for-online-application",
    title: "How to Resize Photo for Online Application Form in India",
    description:
      "Step-by-step method to prepare photos for online application forms with the right dimensions, size limits, and format.",
    phase: 2,
    cluster: "Resize Image and Passport Hub",
    targetKeywords: [
      "how to resize photo for online application form india",
      "online form photo resize",
      "photo upload size limit",
    ],
    hubToolPaths: ["/resize-image", "/resize-image-to-200kb"],
    readMinutes: 6,
    updatedAt: "2026-03-29",
    intro: [
      "Application portals usually have strict image rules. If your image fails once, repeated trial and error costs time and often reduces quality.",
      "A structured resize flow helps you meet requirements in one attempt.",
    ],
    sections: [
      {
        heading: "Read these 3 fields first",
        bullets: [
          "Required dimensions (px or mm)",
          "Maximum file size (for example 50KB, 100KB, 200KB)",
          "Allowed format (usually JPG)",
        ],
      },
      {
        heading: "Reliable workflow",
        steps: [
          "Resize to exact dimensions first.",
          "Compress to size limit second.",
          "Check clarity of face, text, and signature areas.",
          "Keep final file slightly under the allowed max.",
          "Upload and verify preview on portal if available.",
        ],
      },
      {
        heading: "Quick troubleshooting",
        bullets: [
          "If blurry: reduce compression and adjust dimensions again",
          "If rejected: re-check format requirements",
          "If oversized: reduce dimensions slightly before next compression pass",
        ],
      },
    ],
    toolAnchors: [
      { label: "resize image for online forms", href: "/resize-image" },
      { label: "fit photo under required kb", href: "/resize-image-to-200kb" },
      { label: "compress resized photo", href: "/compress-image" },
    ],
    relatedPosts: [
      "passport-photo-size-requirements-india",
      "aadhaar-photo-size-requirements",
      "compress-image-for-government-form",
    ],
  };
