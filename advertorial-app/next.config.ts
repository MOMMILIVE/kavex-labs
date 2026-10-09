import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: process.cwd(),
  assetPrefix: "/advertorial",
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
