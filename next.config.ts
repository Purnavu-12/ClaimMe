import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  experimental: { optimizePackageImports: ["@phosphor-icons/react"] },
};
export default config;
