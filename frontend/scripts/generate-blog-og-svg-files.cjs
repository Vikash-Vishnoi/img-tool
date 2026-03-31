/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const blogDir = path.resolve(__dirname, "..", "src", "lib", "blog");
const ogDir = path.resolve(__dirname, "..", "public", "og");
const blogOgDir = path.join(ogDir, "blog");

const BLOG_INDEX_COPY = {
  slug: "blog",
  title: "Image Tools Blog: Conversion, Compression and Resize Guides",
  description:
    "Actionable tutorials for image-to-PDF, compression, HEIC conversion, and resize workflows with practical checks for form uploads and sharing.",
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function extractField(source, field) {
  const pattern = new RegExp(`${field}:\\s*(?:\\n\\s*)?\"([^\"]+)\"`);
  const match = source.match(pattern);
  return match ? match[1].trim() : null;
}

function truncate(text, max) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, Math.max(0, max - 3)).trimEnd()}...`;
}

function normalizeOgTitle(title) {
  return String(title || "")
    .replace(/\s*[\-–—]\s*$/g, "")
    .trim();
}

function stripTrailingDash(text) {
  return String(text || "")
    .replace(/\s*[\-–—]\s*$/g, "")
    .trim();
}

function wrapText(input, maxCharsPerLine, maxLines) {
  const words = String(input || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
      current = word;
    } else {
      lines.push(word.slice(0, maxCharsPerLine));
      current = "";
    }

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  }

  if (lines.length === 0) {
    lines.push(truncate(input, maxCharsPerLine));
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  if (lines.length === maxLines) {
    lines[maxLines - 1] = truncate(lines[maxLines - 1], maxCharsPerLine);
  }

  return lines;
}

function createSvg({ title }) {
  const safeTitle = normalizeOgTitle(title);
  const titleLines = wrapText(safeTitle, 34, 2).map(stripTrailingDash);

  const titleYStart = titleLines.length > 1 ? 330 : 360;

  const titleText = titleLines
    .map((line, index) => {
      const y = titleYStart + index * 58;
      return `<text x=\"600\" y=\"${y}\" fill=\"#1c1a14\" font-size=\"52\" font-family=\"Syne, Georgia, serif\" font-weight=\"700\" text-anchor=\"middle\">${escapeXml(line)}</text>`;
    })
    .join("\n  ");

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1200\" height=\"630\" viewBox=\"0 0 1200 630\" role=\"img\" aria-label=\"${escapeXml(
  safeTitle
  )}\">
  <defs>
    <linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">
      <stop offset=\"0%\" stop-color=\"#fffdf9\" />
      <stop offset=\"100%\" stop-color=\"#f7f3ec\" />
    </linearGradient>
  </defs>

  <rect width=\"1200\" height=\"630\" fill=\"url(#bg)\" />
  <rect x=\"70\" y=\"70\" width=\"1060\" height=\"490\" rx=\"28\" fill=\"#ffffff\" stroke=\"#d4cfc4\" stroke-width=\"2\" />

  <text x=\"570\" y=\"248\" fill=\"#1c1a14\" font-size=\"104\" font-family=\"Arial Black, Syne, Arial, sans-serif\" font-weight=\"900\" letter-spacing=\"-2.4\" text-anchor=\"end\">image</text>
  <circle cx=\"600\" cy=\"216\" r=\"22\" fill=\"#e8672a\" />
  <text x=\"630\" y=\"248\" fill=\"#1c1a14\" font-size=\"104\" font-family=\"Arial Black, Syne, Arial, sans-serif\" font-weight=\"900\" letter-spacing=\"-2.4\" text-anchor=\"start\">tools</text>

  ${titleText}

  <rect x=\"395\" y=\"452\" width=\"230\" height=\"58\" rx=\"29\" fill=\"#ede8df\" stroke=\"#d4cfc4\" />
  <text x=\"510\" y=\"491\" fill=\"#6b6760\" font-size=\"26\" font-family=\"Syne, Georgia, serif\" font-weight=\"600\" text-anchor=\"middle\">Blog guide</text>

  <rect x=\"643\" y=\"452\" width=\"278\" height=\"58\" rx=\"29\" fill=\"#e8f5ee\" stroke=\"#b8ddc9\" />
  <text x=\"782\" y=\"491\" fill=\"#2a7a5e\" font-size=\"26\" font-family=\"Syne, Georgia, serif\" font-weight=\"600\" text-anchor=\"middle\">Practical steps</text>
</svg>`;
}

function getBlogPosts() {
  const entries = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts" && file !== "types.ts")
    .sort((a, b) => a.localeCompare(b));

  const posts = [];

  for (const file of entries) {
    const source = fs.readFileSync(path.join(blogDir, file), "utf8");
    const slug = extractField(source, "slug");
    const title = extractField(source, "title");
    const description = extractField(source, "description");

    if (!slug || !title || !description) {
      throw new Error(`Could not extract slug/title/description from ${file}`);
    }

    posts.push({ slug, title, description });
  }

  return posts;
}

async function writeSvgAndPng(fileName, copy) {
  const pngOutputPath = path.join(blogOgDir, fileName);
  const svg = createSvg(copy);
  await sharp(Buffer.from(svg)).png().toFile(pngOutputPath);
}

function cleanupLegacyRootBlogOgFiles() {
  const legacyFiles = fs
    .readdirSync(ogDir)
    .filter((name) => /^blog(?:-|\.|$).+\.(svg|png)$/i.test(name) || /^blog\.(svg|png)$/i.test(name));

  for (const fileName of legacyFiles) {
    fs.rmSync(path.join(ogDir, fileName), { force: true });
  }
}

function cleanupBlogFolderSvgFiles() {
  if (!fs.existsSync(blogOgDir)) return;

  const svgFiles = fs.readdirSync(blogOgDir).filter((name) => name.toLowerCase().endsWith(".svg"));
  for (const fileName of svgFiles) {
    fs.rmSync(path.join(blogOgDir, fileName), { force: true });
  }
}

async function main() {
  fs.mkdirSync(ogDir, { recursive: true });
  fs.mkdirSync(blogOgDir, { recursive: true });
  cleanupLegacyRootBlogOgFiles();
  cleanupBlogFolderSvgFiles();

  const posts = getBlogPosts();
  await writeSvgAndPng("index.png", BLOG_INDEX_COPY);

  for (const post of posts) {
    await writeSvgAndPng(`${post.slug}.png`, post);
  }

  console.log(`Generated ${posts.length + 1} blog OG PNG files in ${blogOgDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
