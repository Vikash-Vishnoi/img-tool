import { TOOLS, generateToolMetadata } from "@/lib/seo";

const STATIC_PAGE_COPY: Record<string, { title: string; description: string }> = {
  home: {
    title: "Image Tools - Free Image Converter India",
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
  "privacy-policy": {
    title: "Privacy Policy - Image Tools",
    description: "Read how Image Tools handles privacy and data processing.",
  },
  terms: {
    title: "Terms of Use - Image Tools",
    description: "Read the terms and usage guidelines for Image Tools.",
  },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function wrapText(input: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = input.trim().split(/\s+/);

  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(word.slice(0, maxCharsPerLine));
      currentLine = "";
    }

    if (lines.length === maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  const joined = words.join(" ");
  const rendered = lines.join(" ");

  if (joined.length > rendered.length && lines.length > 0) {
    const lastIndex = lines.length - 1;
    const maxSlice = Math.max(0, maxCharsPerLine - 3);
    lines[lastIndex] = `${lines[lastIndex].slice(0, maxSlice)}...`;
  }

  return lines;
}

function getCopyForSlug(slug: string): { title: string; description: string } {
  const tool = TOOLS.find((item) => item.slug === slug);

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
  if (staticCopy) {
    return staticCopy;
  }

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
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const resolvedParams = await context.params;
  const rawSlug = resolvedParams.slug || "home";
  const slugWithExtension = decodeURIComponent(rawSlug).trim().toLowerCase() || "home";
  const slug = slugWithExtension.replace(/\.svg$/i, "") || "home";

  const copy = getCopyForSlug(slug);
  const title = slug === "home" ? "Image Tools" : normalizeTitle(copy.title);
  const subtitleSource =
    slug === "home"
      ? "Private browser-only image workflow"
      : normalizeDescription(copy.description);
  const titleLine = wrapText(title, 34, 1)[0] ?? title;
  const subtitleLine = wrapText(subtitleSource, 58, 1)[0] ?? subtitleSource;
  const secondaryBadge = getSecondaryBadge(slug);
  const secondaryBadgeWidth = Math.max(225, Math.min(350, 170 + secondaryBadge.length * 8));
  const secondaryBadgeTextX = 350 + Math.floor((secondaryBadgeWidth - secondaryBadge.length * 13) / 2);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fffdf9" />
      <stop offset="100%" stop-color="#f7f3ec" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)" />
  <rect x="70" y="70" width="1060" height="490" rx="28" fill="#ffffff" stroke="#d4cfc4" stroke-width="2" />

  <circle cx="195" cy="165" r="22" fill="#e8672a" />
  <text x="240" y="180" fill="#1c1a14" font-size="62" font-family="Syne, Georgia, serif" font-weight="700">image tools</text>

  <text x="120" y="300" fill="#1c1a14" font-size="52" font-family="Syne, Georgia, serif" font-weight="700">${escapeXml(titleLine)}</text>
  <text x="120" y="360" fill="#6b6760" font-size="32" font-family="Georgia, 'Times New Roman', serif">${escapeXml(subtitleLine)}</text>

  <rect x="120" y="410" width="210" height="58" rx="29" fill="#ede8df" stroke="#d4cfc4" />
  <text x="150" y="449" fill="#6b6760" font-size="26" font-family="Syne, Georgia, serif" font-weight="600">No upload</text>

  <rect x="350" y="410" width="${secondaryBadgeWidth}" height="58" rx="29" fill="#e8f5ee" stroke="#b8ddc9" />
  <text x="${secondaryBadgeTextX}" y="449" fill="#2a7a5e" font-size="26" font-family="Syne, Georgia, serif" font-weight="600">${escapeXml(secondaryBadge)}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
