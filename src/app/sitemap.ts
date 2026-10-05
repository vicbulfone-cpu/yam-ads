import type { MetadataRoute } from "next";
import { INDEXABLE_PATHS } from "@/lib/pages";
import { oldPage, pageUrl } from "@/lib/seo";

// Every indexable page, absolute URLs. Admin, redirected and noindex pages are not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PATHS.map((p) => {
      const at = oldPage(p)?.extractedAt;
      return { url: pageUrl(p), lastModified: at ? new Date(at) : undefined };
    });
}
