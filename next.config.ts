import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match WordPress permalinks (trailing slash) for SEO continuity.
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.carewellmedicalcentre.com",
      },
      {
        protocol: "https",
        hostname: "carewellmedicalcentre.com",
      },
      {
        protocol: "https",
        hostname: "www.carewellmedicalcentre.in",
      },
      {
        protocol: "https",
        hostname: "carewellmedicalcentre.in",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
