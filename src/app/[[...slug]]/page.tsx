import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdPage from "@/components/AdPage";
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
  // ad landing pages are placeholders for now: kept out of search results
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
  if (AD_PAGES.includes(path)) return <AdPage />;
  return (
    <>
      <JsonLd path={path} />
      <ContentPage path={path} />
    </>
  );
}
