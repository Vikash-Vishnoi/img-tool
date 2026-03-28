import { ImageResponse } from "next/og";
import { TOOLS, generateToolMetadata, type ToolDefinition } from "@/lib/seo";

export const runtime = "edge";

const STATIC_PAGE_COPY: Record<string, { title: string; description: string }> = {
  home: {
    title: "Image Tools - Free Image Converter",
    description:
      "Convert, compress, and resize images with no upload. Fast tools for JPG, PNG, WebP, AVIF, HEIC, and PDF.",
  },
  about: {
    title: "About Image Tools",
    description: "Learn about the privacy-first image tools built for fast everyday workflows.",
  },
  feedback: {
    title: "Feedback - Image Tools",
    description: "Share feedback and feature requests for Image Tools.",
  },
  blog: {
    title: "Image Tools Blog",
    description: "Guides for image conversion, compression, resize, and PDF workflows.",
  },
  "privacy-policy": {
    title: "Privacy Policy - Image Tools",
    description: "Read how Image Tools handles privacy and data processing.",
  },
  terms: {
    title: "Terms of Use - Image Tools",
    description: "Read the terms and usage guidelines for Image Tools.",
  },
  disclaimer: {
    title: "Disclaimer - Image Tools",
    description: "Read the disclaimer for Image Tools.",
  },
};

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3).trimEnd() + "...";
}

function getCopyForSlug(slug: string): { title: string; description: string } {
  const tool = (TOOLS as readonly ToolDefinition[]).find((item) => item.slug === slug);

  if (tool) {
    const metadata = generateToolMetadata(tool);
    const title = typeof metadata.title === "string" ? metadata.title : tool.title;
    const description =
      typeof metadata.description === "string" && metadata.description.trim().length > 0
        ? metadata.description
        : tool.description;
    return { title, description };
  }

  const staticCopy = STATIC_PAGE_COPY[slug];
  if (staticCopy) return staticCopy;

  return {
    title: `${humanizeSlug(slug)} - Image Tools`,
    description: "Free online tools to convert, compress, and resize images.",
  };
}

function normalizeTitle(title: string): string {
  return title
    .replace(/\s+[·-]\s+Image Tools$/i, "")
    .replace(/\s+-\s+Image Tools$/i, "")
    .trim();
}

function normalizeDescription(description: string): string {
  return description
    .replace(/\s+/g, " ")
    .replace(/[—-]\s*no upload[^.]*\.?/gi, "")
    .trim();
}

function getSecondaryBadge(slug: string): string {
  if (slug === "home") return "Popular tools";
  if (slug.startsWith("resize-")) return "Preset sizes built-in";
  if (slug.startsWith("compress-")) return "Quality control";
  if (slug.startsWith("pdf-to-") || slug.includes("-to-pdf") || slug === "image-to-pdf") {
    return "Document-ready";
  }
  if (slug.includes("-to-")) return "Instant conversion";
  if (slug === "privacy-policy" || slug === "terms" || slug === "feedback") return "Trust & safety";
  return "Fast workflow";
}

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const resolvedParams = await context.params;
  const rawSlug = resolvedParams.slug || "home";
  const slugWithExtension = decodeURIComponent(rawSlug).trim().toLowerCase() || "home";
  // Strip .png or .svg extensions that callers may append
  const slug = slugWithExtension.replace(/\.(png|svg)$/i, "") || "home";

  const copy = getCopyForSlug(slug);
  const title = slug === "home" ? "Image Tools" : normalizeTitle(copy.title);
  const subtitleSource =
    slug === "home"
      ? "Private browser-only image workflow"
      : normalizeDescription(copy.description);

  const titleDisplay = truncate(title, 36);
  const subtitleDisplay = truncate(subtitleSource, 62);
  const secondaryBadge = getSecondaryBadge(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "linear-gradient(135deg, #fffdf9 0%, #f7f3ec 100%)",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Inner card */}
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 70,
            right: 70,
            bottom: 70,
            borderRadius: 28,
            background: "#ffffff",
            border: "2px solid #d4cfc4",
            display: "flex",
            flexDirection: "column",
            padding: "48px 56px",
          }}
        >
          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#e8672a",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: "#1c1a14",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              image tools
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#1c1a14",
              letterSpacing: "-1px",
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            {titleDisplay}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 30,
              color: "#6b6760",
              lineHeight: 1.4,
              marginBottom: "auto",
              fontStyle: "italic",
            }}
          >
            {subtitleDisplay}
          </div>

          {/* Badges row */}
          <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
            <div
              style={{
                background: "#ede8df",
                border: "1.5px solid #d4cfc4",
                borderRadius: 29,
                padding: "10px 26px",
                fontSize: 24,
                fontWeight: 600,
                color: "#6b6760",
                display: "flex",
              }}
            >
              No upload
            </div>
            <div
              style={{
                background: "#e8f5ee",
                border: "1.5px solid #b8ddc9",
                borderRadius: 29,
                padding: "10px 26px",
                fontSize: 24,
                fontWeight: 600,
                color: "#2a7a5e",
                display: "flex",
              }}
            >
              {secondaryBadge}
            </div>
            <div
              style={{
                background: "#fff7f2",
                border: "1.5px solid #edcfbe",
                borderRadius: 29,
                padding: "10px 26px",
                fontSize: 24,
                fontWeight: 600,
                color: "#a34a24",
                display: "flex",
              }}
            >
              100% Free
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
