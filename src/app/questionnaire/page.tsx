import type { Metadata } from "next";
import { redirect } from "next/navigation";

// There is no standalone questionnaire page: the questionnaire is the popup. Every questionnaire link still points at this
// address (so it works with no JavaScript, in a new tab, or from an ad), and it sends the visitor to the home page with the
// popup opened. All query parameters (category, postcode, utm_*, gclid, ref) are carried across.
export const metadata: Metadata = { title: "Your Accountant Match", robots: { index: false, follow: false } };

export default async function QuestionnairePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = new URLSearchParams({ start: "1" });
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const v of Array.isArray(value) ? value : value === undefined ? [] : [value]) params.append(key, v);
  }
  redirect(`/?${params.toString()}`);
}
