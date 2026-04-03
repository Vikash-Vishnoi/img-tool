import type { BlogPost } from "./types";

export const post: BlogPost = {
  slug: "exam-form-photo-signature-size-guide-india",
  title: "Exam Form Photo and Signature Size Guide for India (SSC, Banking, State Portals)",
  description:
    "A practical India-focused workflow to prepare passport-style photo and signature files for exam portals with strict size, dimension, and format rules.",
  phase: 2,
  cluster: "Resize Image and Passport Hub",
  targetKeywords: [
    "exam form photo size india",
    "ssc photo and signature upload size",
    "banking exam signature size",
  ],
  hubToolPaths: [
    "/resize-image",
    "/resize-signature-upload",
    "/resize-image-to-200kb",
  ],
  readMinutes: 8,
  updatedAt: "2026-04-02",
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
    "Most Indian exam portals reject uploads for technical mismatches, not because the original photo is unusable.",
    "If you follow a sequence-first approach, you can prepare compliant photo and signature files in one pass and avoid repeated upload retries near deadlines.",
  ],
  sections: [
    {
      heading: "Why exam uploads fail even with a clear photo",
      bullets: [
        "Dimensions are wrong even when file size is under limit",
        "Signature uses the correct KB but wrong aspect ratio",
        "Portal expects JPG but candidate uploads PNG",
        "Aggressive compression makes face edges or signature strokes blurry",
      ],
    },
    {
      heading: "Portal-safe workflow for photo and signature",
      steps: [
        "Read the exact notice for photo size, signature size, allowed format, and max KB.",
        "Prepare photo and signature separately because most portals enforce different limits for each.",
        "Resize to required dimensions before touching compression settings.",
        "Compress in small steps and keep one buffer version slightly below the stated limit.",
        "Preview at full zoom and confirm readability before final upload.",
      ],
    },
    {
      heading: "Practical checklist before final submit",
      bullets: [
        "Keep filename simple and alphanumeric to avoid parser errors",
        "Store one approved backup copy on device and cloud",
        "Avoid re-editing already compressed files repeatedly",
        "Do one final upload test before peak traffic hours",
      ],
    },
  ],
  toolAnchors: [
    {
      label: "resize passport-style photo for exam forms",
      href: "/resize-passport-photo",
    },
    {
      label: "resize signature upload image under strict limits",
      href: "/resize-signature-upload",
    },
    {
      label: "resize image to 200KB for government and exam portals",
      href: "/resize-image-to-200kb",
    },
  ],
  relatedPosts: [
    "passport-photo-size-requirements-india",
    "aadhaar-photo-size-requirements",
    "resize-photo-for-online-application",
    "resize-signature-under-20kb-50kb-100kb",
  ],
};
