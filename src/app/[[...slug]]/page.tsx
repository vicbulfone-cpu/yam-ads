import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdPage from "@/components/AdPage";
import { AdFooter, AdHeader } from "@/components/ads/AdChrome";
import BizMatchPage from "@/components/ads/BizMatchPage";
import BusinessAdPage from "@/components/ads/BusinessAdPage";
import PersonalAdPage from "@/components/ads/PersonalAdPage";
import SmsfAdPage from "@/components/ads/SmsfAdPage";
import RegistrationAdPage from "@/components/ads/RegistrationAdPage";
import { SAMPLE_MATCH } from "@/content/sample-match";
import ContentPage from "@/components/ContentPage";
import JsonLd from "@/components/JsonLd";
import { AD_PAGES, PAGE_PATHS } from "@/lib/pages";
import { pageMetadata, pageUrl } from "@/lib/seo";

// Only pages in the list are built; anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PAGE_PATHS.map((p) => ({ slug: p === "/" ? [] : p.split("/").filter(Boolean) }));
}

const toPath = (slug?: string[]) => "/" + (slug ?? []).join("/");

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = toPath(slug);
  // ad landing pages: kept out of search results (ad traffic only)
  if (path === "/ad-1") {
    return {
      title: { absolute: "Find a Business Accountant Near You | Your Accountant Match" },
      description: "Tell us what your business needs and get matched with one local accountant. Free matching, no obligation.",
      alternates: { canonical: pageUrl(path) },
      robots: { index: false, follow: true },
    };
  }
  if (path === "/ad-2") {
    return {
      title: { absolute: "Personal Tax Accountant Near You | Your Accountant Match" },
      description: "Tell us what you need help with and get matched with one local tax accountant. Free matching, no obligation.",
      alternates: { canonical: pageUrl(path) },
      robots: { index: false, follow: true },
    };
  }
  if (path === "/ad-3") {
    return {
      title: { absolute: "SMSF & Wealth Accountant Near You | Your Accountant Match" },
      description: "Tell us about your SMSF, super or investment needs and get matched with one local accountant. Free matching, no obligation.",
      alternates: { canonical: pageUrl(path) },
      robots: { index: false, follow: true },
    };
  }
  if (path === "/ad-4") {
    return {
      title: { absolute: "Business & Company Registration Help | Your Accountant Match" },
      description: "Starting a business or need ABN, GST, company or business name registrations? Get matched with one local accountant. Free matching.",
      alternates: { canonical: pageUrl(path) },
      robots: { index: false, follow: true },
    };
  }
  // the customer's match page: never indexed or followed
  if (path === "/ad-6") {
    return { title: { absolute: "Your Accountant Match | Your Match Details" }, robots: { index: false, follow: false } };
  }
  if (AD_PAGES.includes(path)) {
    return {
      title: `Ad ${path.slice(4)} | Your Accountant Match`,
      alternates: { canonical: pageUrl(path) },
      robots: { index: false, follow: true },
    };
  }
  return pageMetadata(path);
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = toPath(slug);
  if (!PAGE_PATHS.includes(path)) notFound();
  if (path === "/ad-1") return <BusinessAdPage />;
  if (path === "/ad-2") return <PersonalAdPage />;
  if (path === "/ad-3") return <SmsfAdPage />;
  if (path === "/ad-4") return <RegistrationAdPage />;
  if (path === "/ad-6") {
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
  if (AD_PAGES.includes(path)) return <AdPage />;
  return (
    <>
      <JsonLd path={path} />
      <ContentPage path={path} />
    </>
  );
}
