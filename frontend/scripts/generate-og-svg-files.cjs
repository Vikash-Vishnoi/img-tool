/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const repoRoot = path.resolve(__dirname, "..", "..");
const auditPath = path.join(repoRoot, "seo-audit", "seo-audit.js");
const seoSource = fs.readFileSync(path.join(repoRoot, "frontend", "src", "lib", "seo.ts"), "utf8");

const parseRoutesFromAuditSource = (auditSource) => {
  const routesMatch = auditSource.match(/const ROUTES = \[([\s\S]*?)\];/);
  if (!routesMatch) {
    throw new Error("Could not find ROUTES array in seo-audit.js");
  }

  return [...routesMatch[1].matchAll(/^(?!\s*\/\/)\s*"([^"]+)"\s*,?/gm)].map((m) => m[1]);
};

const discoverRoutesFromApp = () => {
  const appDir = path.join(repoRoot, "frontend", "src", "app");
  const routes = new Set();

  const walk = (dirPath, segments) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const hasPage = entries.some((entry) => entry.isFile() && entry.name === "page.tsx");

    if (hasPage) {
      const route = segments.length === 0 ? "/" : `/${segments.join("/")}`;
      routes.add(route);
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const name = entry.name;
      if (name === "api" || name.startsWith("[")) {
        continue;
      }

      const nextPath = path.join(dirPath, name);
      if (name.startsWith("(") && name.endsWith(")")) {
        walk(nextPath, segments);
        continue;
      }

      walk(nextPath, [...segments, name]);
    }
  };

  walk(appDir, []);
  return [...routes].sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });
};

const routes = fs.existsSync(auditPath)
  ? parseRoutesFromAuditSource(fs.readFileSync(auditPath, "utf8"))
  : discoverRoutesFromApp();
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
    .replace(/\s*[\-–—]\s*$/g, "")
    .trim();

const stripTrailingDash = (text) => String(text || "").replace(/\s*[\-–—]\s*$/g, "").trim();

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

const getBadgePairForSlug = (slug) => {
  if (slug === "home") return ["No upload", "Popular tools"];
  if (slug === "about") return ["Privacy-first", "Browser-only"];
  if (slug === "feedback") return ["Feature requests", "Fast support"];
  if (slug === "privacy-policy" || slug === "terms") return ["Trust & safety", "Policy details"];

  if (slug.startsWith("resize-")) return ["Preset sizes", "Exact dimensions"];
  if (slug.startsWith("compress-")) return ["Quality control", "Size target"];

  if (slug.startsWith("pdf-to-") || slug.includes("-to-pdf") || slug === "image-to-pdf") {
    return ["Document-ready", "Secure export"];
  }

  if (slug.includes("-to-")) return ["No upload", "Instant conversion"];

  return ["No upload", "Fast workflow"];
};

const getBadgeWidth = (text) => Math.max(190, Math.min(360, 140 + text.length * 9));

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
    const titleLine = stripTrailingDash(wrapText(copy.title, 34, 1)[0] || copy.title);
    const [primaryBadge, secondaryBadge] = getBadgePairForSlug(slug);
    const primaryBadgeWidth = getBadgeWidth(primaryBadge);
    const secondaryBadgeWidth = getBadgeWidth(secondaryBadge);
    const badgeGap = 18;
    const totalBadgeWidth = primaryBadgeWidth + badgeGap + secondaryBadgeWidth;
    const primaryBadgeX = Math.floor((1200 - totalBadgeWidth) / 2);
    const secondaryBadgeX = primaryBadgeX + primaryBadgeWidth + badgeGap;
    const primaryBadgeCenterX = primaryBadgeX + Math.floor(primaryBadgeWidth / 2);
    const secondaryBadgeCenterX = secondaryBadgeX + Math.floor(secondaryBadgeWidth / 2);

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

  <text x="570" y="248" fill="#1c1a14" font-size="104" font-family="Arial Black, Syne, Arial, sans-serif" font-weight="900" letter-spacing="-2.4" text-anchor="end">image</text>
  <circle cx="600" cy="216" r="22" fill="#e8672a" />
  <text x="630" y="248" fill="#1c1a14" font-size="104" font-family="Arial Black, Syne, Arial, sans-serif" font-weight="900" letter-spacing="-2.4" text-anchor="start">tools</text>

  <text x="600" y="350" fill="#1c1a14" font-size="52" font-family="Syne, Georgia, serif" font-weight="700" text-anchor="middle">${escapeXml(titleLine)}</text>

  <rect x="${primaryBadgeX}" y="430" width="${primaryBadgeWidth}" height="58" rx="29" fill="#ede8df" stroke="#d4cfc4" />
  <text x="${primaryBadgeCenterX}" y="469" fill="#6b6760" font-size="26" font-family="Syne, Georgia, serif" font-weight="600" text-anchor="middle">${escapeXml(
      primaryBadge
    )}</text>

  <rect x="${secondaryBadgeX}" y="430" width="${secondaryBadgeWidth}" height="58" rx="29" fill="#e8f5ee" stroke="#b8ddc9" />
  <text x="${secondaryBadgeCenterX}" y="469" fill="#2a7a5e" font-size="26" font-family="Syne, Georgia, serif" font-weight="600" text-anchor="middle">${escapeXml(
      secondaryBadge
    )}</text>
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
