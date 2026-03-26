/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://image-tools.tech',
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.8,
  sitemapSize: 7000,
  exclude: [
    '/icon.svg',
    '/file.svg',
    '/globe.svg',
    '/og-image.svg',
    '/og-image-*.svg',
    '/next.svg',
    '/vercel.svg',
    '/window.svg',
  ],
  transform: async (config, path) => {
    const isHome = path === '/';
    const isPolicyPage = path === '/privacy-policy' || path === '/terms';
    const isCoreTool =
      path === '/image-converter' ||
      path === '/compress-image' ||
      path === '/resize-image' ||
      path === '/image-to-pdf' ||
      path === '/pdf-to-image';

    return {
      loc: path,
      changefreq: isHome || isCoreTool ? 'weekly' : isPolicyPage ? 'yearly' : 'monthly',
      priority: isHome ? 1.0 : isCoreTool ? 0.9 : isPolicyPage ? 0.3 : 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
}
