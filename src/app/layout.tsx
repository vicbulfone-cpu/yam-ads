import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Caveat, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import SiteHeader from "@/components/layout/SiteHeader";
import StickyCta from "@/components/layout/StickyCta";
import ReturnToTop from "@/components/layout/ReturnToTop";
import ScrollToTop from "@/components/layout/ScrollToTop";
import FaqReset from "@/components/layout/FaqReset";
import LazyQuestionnaireModal from "@/components/layout/LazyQuestionnaireModal";
import QuestionnaireAutoOpen from "@/components/layout/QuestionnaireAutoOpen";
import { getHomeMatchCard } from "@/components/sections/MatchCard";
import { SITE_URL } from "@/config/site.config";
import "./globals.css";
import "./ads.css";

// Headings: Fraunces (elegant serif). Body/UI: Plus Jakarta Sans. Same families the old site used.
// Page speed (owner, 11 Oct 2026): only Plus Jakarta Sans is preloaded. Every page's first screen uses it alone;
// Fraunces (About page, some popups) and Caveat (popup handwriting) are fetched only when a page shows them.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz"], display: "swap", preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Your Accountant Match",
  // Search Console / Bing Webmaster verification (set the two env vars; nothing is output when empty)
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined,
  },
};

// Google Analytics 4 and Google Ads (IDs from env). Loaded after the page is usable, and only when an ID is set.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export const viewport: Viewport = { themeColor: "#073265", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${fraunces.variable} ${jakarta.variable} ${caveat.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <div id="main">{children}</div>
        <StickyCta />
        <ReturnToTop />
        <ScrollToTop />
        <FaqReset />
        <LazyQuestionnaireModal card={getHomeMatchCard()} />
        <QuestionnaireAutoOpen />
        {(GA4_ID || GADS_ID) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID || GADS_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${GA4_ID ? `gtag('config','${GA4_ID}');` : ""}${GADS_ID ? `gtag('config','${GADS_ID}');` : ""}`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
