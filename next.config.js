/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'luckybox.su',
      },
      {
        protocol: 'https',
        hostname: 'luckybox.ru',
      },
    ],
    domains: ['luckybox.ru', 'luckybox.su'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    unoptimized: false,
    dangerouslyAllowSVG: true,
  },
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  devIndicators: {
    buildActivity: false
  },
  basePath: '',
  async headers() {
    return [
      {
        source: '/calculator-services.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Security-Policy',
            value: "upgrade-insecure-requests",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/(.*)\\.(js|css|svg|png|jpg|jpeg|gif|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  trailingSlash: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion'],
    optimisticClientCache: true,
    adjustFontFallbacks: true,
    adjustFontFallbacksWithSizeAdjust: true,
  },
}

module.exports = nextConfig 