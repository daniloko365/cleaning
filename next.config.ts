import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Source assets are already cropped, color-graded and compressed as WebP.
    // Serving them directly also keeps local/preview rendering independent of
    // Cloudflare Images, while production still benefits from immutable assets.
    unoptimized: true,
  },
};

export default nextConfig;
