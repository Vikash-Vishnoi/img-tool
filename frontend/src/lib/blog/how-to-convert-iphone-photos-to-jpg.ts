import type { BlogPost } from "./types";

export const post: BlogPost = {
    slug: "how-to-convert-iphone-photos-to-jpg",
    title: "How to Convert iPhone Photos to JPG Quickly",
    description:
      "Convert iPhone HEIC photos to JPG for uploads, WhatsApp sharing, and compatibility with websites that do not accept HEIC.",
    phase: 1,
    cluster: "HEIC to JPG Hub",
    targetKeywords: [
      "how to convert iphone photos to jpg",
      "iphone heic to jpg",
      "convert iphone image format",
    ],
    hubToolPaths: ["/heic-to-jpg", "/compress-image"],
    readMinutes: 5,
    updatedAt: "2026-03-29",
    intro: [
      "iPhone photos are often saved as HEIC. That is efficient for storage, but many upload systems ask for JPG and reject HEIC files.",
      "A browser converter solves this in minutes and works on phone or desktop without complex setup.",
    ],
    sections: [
      {
        heading: "Fast conversion flow",
        steps: [
          "Select one or multiple HEIC photos from your iPhone export folder.",
          "Convert to JPG with high quality selected.",
          "Review output and keep original orientation.",
          "If needed, compress the JPG before portal upload.",
        ],
      },
      {
        heading: "Tips for best result",
        bullets: [
          "Start with original files, not forwarded copies",
          "Avoid repeated conversion loops",
          "Keep one high-quality JPG backup for future use",
        ],
      },
      {
        heading: "Best use cases",
        bullets: [
          "Government forms and exam applications",
          "Website uploads that allow only JPG",
          "Cross-platform sharing with Windows and Android users",
        ],
      },
    ],
    toolAnchors: [
      { label: "convert iPhone photos to JPG", href: "/heic-to-jpg" },
      { label: "HEIC to JPG online tool", href: "/heic-to-jpg" },
      { label: "compress converted JPG", href: "/compress-image" },
    ],
    relatedPosts: [
      "what-is-heic-file-how-to-open",
      "heic-vs-jpg-difference",
      "compress-image-for-whatsapp",
    ],
  };
