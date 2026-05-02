import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: [
        "*.vercel.run",
        "*.vusercontent.net",
        "*.v0.app",
        "*.v0.dev",
        "*.vercel.app",
        "localhost:3000"
      ]
    }
  },
  turbopack: {
    root: __dirname
  }
};

export default nextConfig;
