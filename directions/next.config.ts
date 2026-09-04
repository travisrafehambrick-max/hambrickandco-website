import type { NextConfig } from "next";

/** Static export for a draft preview host. `next start` stays the default. */
const exportPreview = process.env.DIRECTIONS_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(exportPreview
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
