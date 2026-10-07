import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site.config";
import { NOINDEX_PATHS } from "@/lib/pages";

const AI_BOTS = [
  "OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot",
  "Amazonbot", "Applebot", "DuckAssistBot", "Meta-ExternalAgent", "MistralAI-User", "CCBot", // CCBot feeds many AI models: delete it here to block it
];
const DISALLOWED = [...new Set([
  "/api/",
  "/match",
  "/accountant-demo-x7k2",
  "/questionnaire",
  // the ad landing pages are NOT blocked (owner, 7 Oct 2026): search engines must be able to visit them to read their
  // "noindex, follow" tag and follow their footer links (e.g. How we select accountants); they stay out of search results
  ...NOINDEX_PATHS.filter((p) => !/^\/ad-\d+$/.test(p)),
])];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOWED },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOWED })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
