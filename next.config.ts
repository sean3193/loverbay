import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/loverbay",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
