import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Public imagery uploaded from the admin panel (never medical reports — those live in private Spaces).
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }],
  },
};

export default nextConfig;
