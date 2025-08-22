import type { NextConfig } from 'next';

const webpack = (config: any) => {
  // Grab the existing rule that handles SVG imports
  const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'));

  config.module.rules.push(
    // Reapply the existing rule, but only for svg imports ending in ?url
    {
      ...fileLoaderRule,
      test: /\.svg$/i,
      resourceQuery: /url/, // *.svg?url
    },
    // Convert all other *.svg imports to React components
    {
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
      use: ['@svgr/webpack'],
    }
  );

  // Modify the file loader rule to ignore *.svg, since we have it handled now.
  fileLoaderRule.exclude = /\.svg$/i;

  return config;
};

const imageDomain = process.env.NEXT_PUBLIC_BASE_URL;

const nextConfig: NextConfig = {
  images: {
    domains: ['pbs.twimg.com', ...(imageDomain ? [imageDomain] : [])],
  },
  reactStrictMode: false,
  output: 'standalone',
  // Configure base path for static exports
  basePath: process.env.NODE_ENV === 'production' ? '' : undefined,
  // Configure asset prefix for static exports
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  experimental: {
    turbo: {
      // For development
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack: process.env.NODE_ENV === 'development' ? undefined : webpack,
};

export default nextConfig;
