import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  basePath: isGitHubPages ? basePath : undefined,
  assetPrefix: isGitHubPages && basePath ? `${basePath}/` : undefined,
  trailingSlash: isGitHubPages ? true : false,
  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  ...(!isGitHubPages
    ? {
        async headers() {
          return [
            {
              // Cache all local images in /public/images for 1 year (immutable)
              source: '/images/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, stale-while-revalidate=86400, immutable',
                },
              ],
            },
            {
              // Cache all Next.js self-hosted Google Fonts (.woff2) & static media for 1 year
              source: '/_next/static/media/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              // Cache all static image and font extensions across the application
              source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|ttf|otf)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, stale-while-revalidate=86400, immutable',
                },
              ],
            },
            {
              // Service worker script must always be checked freshly
              source: '/sw-cache.js',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=0, must-revalidate',
                },
              ],
            },
          ];
        },
      }
    : {}),
  output: isGitHubPages ? 'export' : 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
