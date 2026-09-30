import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  async redirects() {
    return [
      { source: "/login", destination: "/", permanent: false },
      { source: "/register", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;