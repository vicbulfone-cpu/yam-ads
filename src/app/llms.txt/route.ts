import { SITE_URL } from "@/config/site.config";
import { INDEXABLE_PATHS } from "@/lib/pages";
import { oldPage, pageUrl } from "@/lib/seo";

export const dynamic = "force-static";

// Plain-text guide for AI engines: concise service facts and only indexable public URLs.
export function GET() {
  const home = oldPage("/");
  const line = (p: string) => {
    const m = oldPage(p);
    return `- [${m?.title ?? p}](${pageUrl(p)})${m?.metaDescription ? `: ${m.metaDescription}` : ""}`;
  };
  const body = `# Your Accountant Match

> ${home?.metaDescription ?? "Free accountant matching service."}

Your Accountant Match (${SITE_URL}) is a national accountant matching and referral service, based in Melbourne and serving people and businesses across Australia. We are not an accounting firm. The website does not publish individual accountants' names or contact details.

People looking for personal tax, business and sole-trader accounting, bookkeeping and BAS, SMSF, registrations or related accounting help can share their postcode and service needs through the questionnaire. We use those requirements and location to match them with one of our partner accountants serving their area.

## Areas served
Australia-wide.

## Key services and information
${[
  "/", "/accountant/small-business-accountant", "/accountant/personal-tax-support",
  "/accountant/tax-accountant", "/accountant/smsf-accountant", "/accountant/bookkeeping-bas",
  "/locations", "/how-it-works", "/how-we-select-accountants", "/about", "/contact",
].filter((p) => INDEXABLE_PATHS.includes(p)).map(line).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
