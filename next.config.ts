import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
  
  poweredByHeader: false,
  staticPageGenerationTimeout: 60,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true, // ← add this
  },
};

export default nextConfig;