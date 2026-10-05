import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import JsonLd from "@/components/JsonLd";
import { PAGE_PATHS } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

// Only pages in the list are built; anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PAGE_PATHS.map((p) => ({ slug: p === "/" ? [] : p.split("/").filter(Boolean) }));
}

const toPath = (slug?: string[]) => "/" + (slug ?? []).join("/");

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(toPath(slug));
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = toPath(slug);
  if (!PAGE_PATHS.includes(path)) notFound();
  return (
    <>
      <JsonLd path={path} />
      <ContentPage path={path} />
    </>
  );
}
