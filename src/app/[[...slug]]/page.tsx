import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BusinessAdPage from "@/components/ads/BusinessAdPage";
import PersonalAdPage from "@/components/ads/PersonalAdPage";
import SmsfAdPage from "@/components/ads/SmsfAdPage";
import RegistrationAdPage from "@/components/ads/RegistrationAdPage";
import ContentPage from "@/components/ContentPage";
import JsonLd from "@/components/JsonLd";
import { PAGE_PATHS, adPageName } from "@/lib/pages";
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
      title: { absolute: `${adPageName("/ad-1")} | Your Accountant Match` },
      description: "Tell us what your business needs and get matched with one local accountant. Free matching, no obligation.",
      alternates: { canonical: pageUrl(path) },
      robots: { index: false, follow: true },
    };
  }
  if (path === "/ad-2") {
    return {
      title: { absolute: `${adPageName("/ad-2")} | Your Accountant Match` },
      description: "Tell us what you need help with and get matched with one local tax accountant. Free matching, no obligation.",
      alternates: { canonical: pageUrl(path) },
      robots: { index: false, follow: true },
    };
  }
  if (path === "/ad-3") {
    return {
      title: { absolute: `${adPageName("/ad-3")} | Your Accountant Match` },
      description: "Tell us about your SMSF, super or investment needs and get matched with one local accountant. Free matching, no obligation.",
      alternates: { canonical: pageUrl(path) },
      robots: { index: false, follow: true },
    };
  }
  if (path === "/ad-4") {
    return {
      title: { absolute: `${adPageName("/ad-4")} | Your Accountant Match` },
      description: "Starting a business or need ABN, GST, company or business name registrations? Get matched with one local accountant. Free matching.",
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
  return (
    <>
      <JsonLd path={path} />
      <ContentPage path={path} />
    </>
  );
}
