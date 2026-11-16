import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Hosts used by the gallery demos (components/examples).
  images: {
    // Demo images are tiny or SVG (avatar.vercel.sh); skip the optimizer, which rejects SVG.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "avatar.vercel.sh" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "github.com" },
    ],
  },
}

export default nextConfig
