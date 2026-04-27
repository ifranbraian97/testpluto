/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  productionBrowserSourceMaps: false,
  // Disable Turbopack to avoid module resolution issues
  experimental: {
    // Explicitly disable turbopack
  },
  images: {
    // Enable optimization to reduce Fast Data Transfer
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Image caching - 1 hour to reduce egress while allowing updates
    minimumCacheTTL: 3600, // 1 hour
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'blob.v0.app',
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ]
  },
  redirects: async () => {
    return []
  },
  rewrites: async () => {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },
  serverExternalPackages: ['nodemailer', 'pdfkit'],
  experimental: {
    // Enable for better performance
    optimizePackageImports: ['@radix-ui/*', 'lucide-react'],
  },
}

export default nextConfig

