import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FIXED: ignoreBuildErrors must be inside the typescript object
  typescript: {
    // ignoreBuildErrors: true,
  },

  // Ignores ESLint during builds
  eslint: {
    // ignoreDuringBuilds: true,
  },

  experimental: {
    reactCompiler: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "api.normah.ai",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "images.normah.ai",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "devapi.normah.ai",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.normah.ai",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.normah.ai",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "devapi.normah.ai",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
