import type { BlogPost } from "./types";

export const post: BlogPost = {
    slug: "how-to-compress-image-under-200kb",
    title: "How to Compress Image Under 200KB for Form Uploads",
    description:
      "A practical method to reduce file size under 200KB while preserving enough quality for IDs, forms, and online applications.",
    phase: 1,
    cluster: "Compress Image Hub",
    targetKeywords: [
      "how to compress image under 200kb",
      "resize image under 200kb",
      "photo under 200kb",
    ],
    hubToolPaths: ["/compress-image", "/resize-image-to-200kb"],
    readMinutes: 6,
    updatedAt: "2026-03-29",
    intro: [
      "Many Indian portals reject files that are even slightly above the size limit. A 218KB photo can fail when the requirement is 200KB max.",
      "The fastest approach is controlled compression: reduce quality gradually, keep dimensions practical, and verify clarity before upload.",
    ],
    sections: [
      {
        heading: "Why files stay too large",
        bullets: [
          "Phone cameras create high-resolution images by default",
          "Screenshots may include extra background and metadata",
          "Repeated editing and sharing can bloat file size",
        ],
      },
      {
        heading: "Step-by-step to hit 200KB",
        steps: [
          "Upload the image and set a medium compression level first.",
          "If still above 200KB, reduce dimensions slightly (for example 20%).",
          "Export and check readability of face, text, and signature.",
          "Repeat once more only if needed, to avoid over-compression.",
          "Save final file with clear name like photo-under-200kb.jpg.",
        ],
      },
      {
        heading: "Safe quality targets",
        bullets: [
          "Profile photos: keep facial details clear at 100% zoom",
          "Documents: text should remain legible without blur",
          "Signatures: edges should not break into pixel blocks",
        ],
      },
    ],
    toolAnchors: [
      { label: "compress image online", href: "/compress-image" },
      { label: "reduce image size to target kb", href: "/resize-image-to-200kb" },
      { label: "compress image for upload", href: "/compress-image" },
    ],
    relatedPosts: [
      "compress-image-for-government-form",
      "reduce-image-size-without-losing-quality",
      "resize-photo-for-online-application",
    ],
    faq: [
      {
        question: "How many times should I recompress one image?",
        answer:
          "Try to keep recompression rounds low. One or two controlled passes are usually enough and preserve better quality.",
      },
      {
        question: "Should I resize dimensions before compression?",
        answer:
          "If the image is very high resolution, a small dimension reduction helps achieve 200KB with less visible quality loss.",
      },
    ],
  };
