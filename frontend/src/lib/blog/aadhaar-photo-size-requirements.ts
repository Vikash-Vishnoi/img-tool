import type { BlogPost } from "./types";

export const post: BlogPost = {
    slug: "aadhaar-photo-size-requirements",
    title: "Aadhaar Card Photo Size Specifications for Online Upload",
    description:
      "A clear reference for Aadhaar photo dimensions, file size handling, and practical steps to avoid upload rejection.",
    phase: 1,
    cluster: "Resize Image and Passport Hub",
    targetKeywords: [
      "aadhaar card photo size specifications",
      "aadhaar photo dimensions",
      "aadhaar photo upload size",
    ],
    hubToolPaths: ["/resize-aadhar-photo", "/resize-image-to-200kb"],
    readMinutes: 6,
    updatedAt: "2026-03-29",
    intro: [
      "Aadhaar-related uploads often fail due to dimension mismatch or oversized files. Even small mistakes in file settings can force repeated attempts.",
      "Use this guide to prepare a valid photo once and submit without confusion.",
    ],
    sections: [
      {
        heading: "Typical Aadhaar photo expectations",
        bullets: [
          "Square-style dimensions may be required in some workflows",
          "Clear face visibility without over-editing",
          "Portal-specified maximum file size must be respected",
          "JPG format is usually the safest choice",
        ],
      },
      {
        heading: "Simple preparation workflow",
        steps: [
          "Resize image to required Aadhaar dimensions first.",
          "Compress only if file size exceeds limit.",
          "Check sharpness around eyes and facial outline.",
          "Save final version slightly under the max size for safety.",
        ],
      },
      {
        heading: "Quality do and do not",
        bullets: [
          "Do keep natural color and brightness",
          "Do avoid heavy smoothing filters",
          "Do not upscale low-resolution selfies aggressively",
        ],
      },
    ],
    toolAnchors: [
      { label: "Aadhaar photo size tool", href: "/resize-aadhar-photo" },
      { label: "resize image to 200KB", href: "/resize-image-to-200kb" },
      { label: "compress image for Aadhaar upload", href: "/compress-image" },
    ],
    relatedPosts: [
      "passport-photo-size-requirements-india",
      "resize-photo-for-online-application",
      "how-to-compress-image-under-200kb",
    ],
  };
