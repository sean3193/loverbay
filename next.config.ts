import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/loverbay",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: "/loverbay",
  },
};

export default nextConfig;
