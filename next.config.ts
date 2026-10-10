import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi open the development site (http://<this computer's address>:3217).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],

  // Picture quality levels the site may serve: 75 for ordinary pictures, 85 for the phone hero, 92 for the hero photograph (kept sharp).
  // Page speed (owner, 11 Oct 2026, Lighthouse): AVIF first (much smaller at the same look; WebP for browsers without
  // it), and a 2560px width between 2048 and 3840 so phones showing the home hero at twice the screen width no longer
  // jump to the 3840px file (337 KB) when 2560px is plenty.
  images: {
    qualities: [75, 85, 92],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
  },

  // Removed pages keep their old address working with a permanent redirect (listed in docs/plan.md).
  async redirects() {
    return [
      // Melbourne city page removed (owner, 6 Oct 2026)
      { source: "/locations/melbourne", destination: "/", permanent: true },
    ];
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // never index the private routes (match results and API)
      { source: "/match/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/match", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // preview deployments and the *.vercel.app address must never be indexed
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      // long-lived caching for pictures (file names change when the picture changes)
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
