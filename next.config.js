// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
    // If placeholder not replaced, fall back to localhost
    if (backendUrl.includes("<") || backendUrl.includes(">")) {
      console.warn("NEXT_PUBLIC_API_URL contains placeholder – falling back to http://127.0.0.1:5000");
      backendUrl = "http://127.0.0.1:5000";
    }
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};
module.exports = nextConfig;
