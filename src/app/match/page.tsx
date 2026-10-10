import type { Metadata } from "next";
import { AdHeader } from "@/components/ads/AdChrome";
import AdInfoPopup from "@/components/ads/AdInfoPopup";
import EnquirySentPage from "@/components/ads/EnquirySentPage";
import { ENQUIRY_SENT } from "@/content/enquiry-sent";

// The page every questionnaire (the site match box and the four ad questionnaires) finishes on, with ?lead=<leadId>.
// Owner, 11 Oct 2026: an honest "your enquiry has been sent" confirmation (EnquirySentPage) in place of the sample
// accountant, until GoHighLevel sends the real match back; BizMatchPage.tsx (the accountant's card) is kept for that.
// Never indexed or followed: also an X-Robots-Tag header (next.config.ts), blocked in robots.txt and left out of the
// sitemap and llms.txt.
export const metadata: Metadata = {
  title: { absolute: "Your Accountant Match | Enquiry Sent" },
  robots: { index: false, follow: false },
};

export default function MatchPage() {
  return (
    <div className="bz-page">
      <AdHeader complete={ENQUIRY_SENT.pill} />
      <EnquirySentPage />
      <AdInfoPopup />
    </div>
  );
}
