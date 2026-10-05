import type { NextConfig } from "next";
import { REDIRECTS } from "./src/lib/pages";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi open the development site (http://<this computer's address>:3217).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],

  // Picture quality levels the site may serve: 75 for ordinary pictures, 92 for the hero photograph (kept sharp).
  images: { qualities: [75, 92] },

  // The 12 retired location pages go straight (one hop, permanent) to the city the old site sent them to.
  async redirects() {
    return REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // never index the private routes (match results, API, hidden accountants' demo page)
      { source: "/match/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/accountant-demo-x7k2", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
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
