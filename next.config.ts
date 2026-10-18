import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos will be served from Cloudinary once the backend is connected.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
