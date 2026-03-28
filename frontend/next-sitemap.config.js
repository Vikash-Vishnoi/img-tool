/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://image-tools.tech',
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
    const isBlogIndex = path === '/blog';
    const isBlogPost = path.startsWith('/blog/');
    const isCoreTool =
      path === '/image-converter' ||
      path === '/compress-image' ||
      path === '/resize-image' ||
      path === '/image-to-pdf' ||
      path === '/pdf-to-image';

    return {
      loc: path,
      changefreq:
        isHome || isCoreTool || isBlogIndex
          ? 'weekly'
          : isBlogPost
            ? 'monthly'
            : isPolicyPage
              ? 'yearly'
              : 'monthly',
      priority: isHome
        ? 1.0
        : isCoreTool
          ? 0.9
          : isBlogIndex
            ? 0.85
            : isBlogPost
              ? 0.8
              : isPolicyPage
                ? 0.3
                : 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
}
