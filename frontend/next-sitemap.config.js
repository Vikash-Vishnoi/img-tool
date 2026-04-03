/** @type {import('next-sitemap').IConfig} */
const SITE_URL = 'https://image-tools.tech';

const HIGH_INTENT_TOOL_PATHS = new Set([
  '/resize-passport-photo',
  '/resize-aadhar-photo',
  '/heic-to-jpg',
]);

function getOgImageForPath(path) {
  if (path === '/') {
    return `${SITE_URL}/og/home.png`;
  }

  if (path === '/blog') {
    return `${SITE_URL}/og/blog/index.png`;
  }

  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length);
    return `${SITE_URL}/og/blog/${slug}.png`;
  }

  if (path.startsWith('/_')) {
    return undefined;
  }

  return `${SITE_URL}/og/${path.slice(1)}.png`;
}

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.8,
  sitemapSize: 7000,
  exclude: [
    '/icon.png',
    '/file.png',
    '/globe.png',
    '/og/*',
    '/og-image.png',
    '/og-image-*.png',
    '/next.png',
    '/vercel.png',
    '/window.png',
  ],
  transform: async (config, path) => {
    const isHome = path === '/';
    const isPolicyPage =
      path === '/privacy-policy' || path === '/terms' || path === '/disclaimer';
    const isFeedbackPage = path === '/feedback';
    const isBlogIndex = path === '/blog';
    const isBlogPost = path.startsWith('/blog/');
    const isHighIntentTool = HIGH_INTENT_TOOL_PATHS.has(path);
    const isCoreTool =
      path === '/image-converter' ||
      path === '/compress-image' ||
      path === '/resize-image' ||
      path === '/image-to-pdf' ||
      path === '/pdf-to-image';

    const ogImage = getOgImageForPath(path);

    return {
      loc: path,
      changefreq:
        isHome || isCoreTool || isHighIntentTool || isBlogIndex
          ? 'weekly'
          : isBlogPost
            ? 'monthly'
            : isPolicyPage || isFeedbackPage
              ? 'yearly'
              : 'monthly',
      priority: isHome
        ? 1.0
        : isHighIntentTool
          ? 0.95
        : isCoreTool
          ? 0.9
          : isBlogIndex
            ? 0.9
            : isBlogPost
              ? 0.8
              : isPolicyPage || isFeedbackPage
                ? 0.3
                : 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
      images: ogImage ? [{ loc: new URL(ogImage) }] : undefined,
    };
  },
}
