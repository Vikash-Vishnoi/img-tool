/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  compress: true,
  poweredByHeader: false,
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
