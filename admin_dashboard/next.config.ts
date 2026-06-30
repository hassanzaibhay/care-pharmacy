import type { NextConfig } from "next";

const BACKEND_URL = process.env.ADMIN_API_INTERNAL_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/admin/:path*",
        destination: `${BACKEND_URL}/api/admin/:path*`,
      },
      // Proxy uploaded assets so the dashboard never makes cross-origin requests.
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
