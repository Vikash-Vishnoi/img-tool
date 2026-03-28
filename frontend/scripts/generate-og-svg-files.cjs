/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const repoRoot = path.resolve(__dirname, "..", "..");
const auditPath = path.join(repoRoot, "seo-audit", "seo-audit.js");
const auditSource = fs.readFileSync(auditPath, "utf8");
const seoSource = fs.readFileSync(path.join(repoRoot, "frontend", "src", "lib", "seo.ts"), "utf8");

const routesMatch = auditSource.match(/const ROUTES = \[([\s\S]*?)\];/);
if (!routesMatch) {
  throw new Error("Could not find ROUTES array in seo-audit.js");
}

const routes = [...routesMatch[1].matchAll(/^(?!\s*\/\/)\s*"([^"]+)"\s*,?/gm)].map((m) => m[1]);
const ogDir = path.join(repoRoot, "frontend", "public", "og");

fs.mkdirSync(ogDir, { recursive: true });

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatToken = (token) => {
  const lower = token.toLowerCase();
  const tokenMap = {
    jpg: "JPG",
    jpeg: "JPEG",
    png: "PNG",
    webp: "WebP",
    avif: "AVIF",
    heic: "HEIC",
    heif: "HEIF",
    pdf: "PDF",
    aadhar: "Aadhaar",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
  };

  if (tokenMap[lower]) {
    return tokenMap[lower];
  }

  if (/^\d+kb$/.test(lower)) {
    return `${lower.slice(0, -2)}KB`;
  }

  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const slugToTitleFallback = (slug) => {
  if (slug.includes("-to-")) {
    const [from, to] = slug.split("-to-");
    return `${formatToken(from)} to ${formatToken(to)} Converter`;
  }

  if (slug.startsWith("compress-")) {
    const tail = slug.replace(/^compress-/, "");
    return `Compress ${formatToken(tail)} Image`;
  }

  if (slug.startsWith("resize-")) {
    const tail = slug.replace(/^resize-/, "");
    return `Resize ${tail.split("-").map(formatToken).join(" ")}`;
  }

  return slug.split("-").map(formatToken).join(" ");
};

const normalizeTitle = (title) =>
  title
    .replace(/\s+[·-]\s+Image Tools$/i, "")
    .replace(/\s+-\s+Image Tools$/i, "")
    .trim();

const normalizeDescription = (description) =>
  description
    .replace(/\s+/g, " ")
    .replace(/[—-]\s*no upload[^.]*\.?/gi, "")
    .trim();

const staticCopy = {
  home: {
    title: "Image Tools",
    description: "Private browser-only image workflow",
  },
  about: {
    title: "About Image Tools",
    description: "Learn about the privacy-first image tools built for fast everyday workflows.",
  },
  feedback: {
    title: "Feedback",
    description: "Share feedback and feature requests for Image Tools.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Read how Image Tools handles privacy and data processing.",
  },
  terms: {
    title: "Terms of Use",
    description: "Read the terms and usage guidelines for Image Tools.",
  },
};

const getToolField = (slug, field) => {
  const slugRe = escapeRegExp(slug);
  const fieldRe = new RegExp(`slug:\\s*"${slugRe}"[\\s\\S]*?${field}:\\s*(?:\\n\\s*)?"([^\"]+)"`);
  return seoSource.match(fieldRe)?.[1] || null;
};

const getCopyForSlug = (slug) => {
  if (staticCopy[slug]) {
    return staticCopy[slug];
  }

  const rawTitle = getToolField(slug, "title");
  const rawDescription = getToolField(slug, "description");

  return {
    title: rawTitle ? normalizeTitle(rawTitle) : slugToTitleFallback(slug),
    description: rawDescription
      ? normalizeDescription(rawDescription)
      : "Free online tools to convert, compress, and resize images.",
  };
};

const getSecondaryBadge = (slug) => {
  if (slug === "home") return "Popular tools";
  if (slug.startsWith("resize-")) return "Preset sizes built-in";
  if (slug.startsWith("compress-")) return "Quality control";
  if (slug.startsWith("pdf-to-") || slug.includes("-to-pdf") || slug === "image-to-pdf") {
    return "Document-ready";
  }
  if (slug.includes("-to-")) return "Instant conversion";
  if (slug === "privacy-policy" || slug === "terms" || slug === "feedback") return "Trust & safety";
  return "Fast workflow";
};

const wrapText = (input, maxCharsPerLine, maxLines) => {
  const words = input.trim().split(/\s+/).filter(Boolean);
  const lines = [];
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

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    lines.push(input.slice(0, maxCharsPerLine));
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  return lines;
};

async function main() {
  for (const route of routes) {
    const slug = route === "/" ? "home" : route.replace(/^\//, "");

    const copy = getCopyForSlug(slug);
    const titleLine = wrapText(copy.title, 34, 1)[0] || copy.title;
    const subtitleLine = wrapText(copy.description, 58, 1)[0] || copy.description;
    const secondaryBadge = getSecondaryBadge(slug);
    const secondaryBadgeWidth = Math.max(225, Math.min(350, 170 + secondaryBadge.length * 8));
    const secondaryBadgeTextX = 350 + Math.floor((secondaryBadgeWidth - secondaryBadge.length * 13) / 2);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(copy.title)}">
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

    await sharp(Buffer.from(svg)).png().toFile(path.join(ogDir, `${slug}.png`));
  }

  const missing = routes
    .map((route) => (route === "/" ? "home" : route.replace(/^\//, "")))
    .filter((slug) => !fs.existsSync(path.join(ogDir, `${slug}.png`)));

  console.log(`Generated ${routes.length} PNG files in ${ogDir}`);
  console.log(`Missing files: ${missing.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
