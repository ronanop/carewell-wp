import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
