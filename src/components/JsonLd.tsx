import { jsonLdFor } from "@/lib/seo";

/** Structured data for search and AI engines. Invisible to visitors. */
export default function JsonLd({ path }: { path: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFor(path)).replace(/</g, "\\u003c") }} />;
}
