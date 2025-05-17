/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.herokuapp.com',
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Allow some caching in development for better performance
    if (dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        chunkIds: 'named',
        minimize: false,
      };
      config.stats = {
        errors: true,
        warnings: true,
        modules: false,
        chunks: false,
        assets: false,
      };
    }

    // Increase timeout and adjust watch options
    config.watchOptions = {
      aggregateTimeout: 1000, // Increased from 300
      poll: 2000, // Increased from 1000
      ignored: ['**/node_modules', '**/.git', '**/.next/cache/**'],
    };

    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
};

module.exports = nextConfig;