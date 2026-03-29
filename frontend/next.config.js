/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  compress: true,
  poweredByHeader: false,
  async headers() {
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      ...(isProd ? [] : ["'unsafe-eval'"]),
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ].join(' ')

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      `script-src ${scriptSrc}`,
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/jpeg-to-pdf', destination: '/jpg-to-pdf', permanent: true },
      { source: '/compress-jpeg', destination: '/compress-jpg', permanent: true },
      { source: '/resize-jpeg', destination: '/resize-jpg', permanent: true },
      { source: '/pdf-to-jpeg', destination: '/pdf-to-jpg', permanent: true },
      { source: '/heif-to-jpg', destination: '/heic-to-jpg', permanent: true },
      { source: '/heif-to-png', destination: '/heic-to-png', permanent: true },
      { source: '/heif-to-pdf', destination: '/heic-to-pdf', permanent: true },
      { source: '/heif-to-avif', destination: '/heic-to-avif', permanent: true },
      { source: '/heif-to-webp', destination: '/heic-to-webp', permanent: true },
      { source: '/compress-heif', destination: '/compress-heic', permanent: true },
      { source: '/resize-heif', destination: '/resize-heic', permanent: true },
    ]
  },
}

module.exports = nextConfig
