import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev compiler cache separate from production builds. Running
  // `next build` while the dev server is active must not corrupt its chunks.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Match WordPress permalinks (trailing slash) for SEO continuity.
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Studio preview embeds the public site. frame-ancestors replaces
          // X-Frame-Options so carewellcms.sanity.studio can show the real page.
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://www.sanity.io https://*.sanity.studio http://localhost:3333",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            // Deny device/local probes so page scripts never trigger Chrome's
            // "Access other apps and services on this device" prompt.
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), local-network-access=(), local-network=(), loopback-network=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
