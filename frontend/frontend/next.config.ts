import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      }
    ],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
