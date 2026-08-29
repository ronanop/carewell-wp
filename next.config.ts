import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev compiler cache separate from production builds. Running
  // `next build` while the dev server is active must not corrupt its chunks.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
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
