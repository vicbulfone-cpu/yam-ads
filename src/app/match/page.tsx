import type { Metadata } from "next";
import { AdFooter, AdHeader } from "@/components/ads/AdChrome";
import BizMatchPage from "@/components/ads/BizMatchPage";
import { SAMPLE_MATCH } from "@/content/sample-match";

// The customer's match page (owner, 6 Oct 2026). Every questionnaire (the site match box and the
// four ad questionnaires) finishes here with ?lead=<leadId>. Never indexed or followed: also an X-Robots-Tag header
// (next.config.ts), blocked in robots.txt and left out of the sitemap and llms.txt.
export const metadata: Metadata = {
  title: { absolute: "Your Accountant Match | Your Match Details" },
  robots: { index: false, follow: false },
};

export default function MatchPage() {
  // the sample accountant shows until GoHighLevel is connected (Stage 5 replaces it with the real match)
  const isSample = !process.env.GHL_INBOUND_WEBHOOK_URL || process.env.MOCK_GHL === "true";
  return (
    <div className="bz-page">
      <AdHeader />
      <BizMatchPage match={SAMPLE_MATCH} isSample={isSample} />
      <AdFooter />
    </div>
  );
}
