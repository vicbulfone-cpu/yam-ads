// Header and footer of the ad pages (owner's "business" design picture): logo and "Free matching. No obligation." at the
// top; logo, trust note, information links and copyright at the bottom. The site's own header and phone CTA bar are
// hidden on pages that use these (".bz-page" in globals.css).
import Image from "next/image";
import Link from "next/link";
import { logo } from "@/config/site.config";
import { BIZ_LANDING as L } from "@/content/business-questionnaire";
import { CREDENTIAL } from "@/content/wording";
import { ShieldCheck } from "./BizIcons";
import AdInfoPopup from "./AdInfoPopup";
import HeaderLogo from "../layout/HeaderLogo";
import { Check } from "../ui/Icons";

/** Footer links (owner, 6 Oct 2026): "How it works" left out, as that section is now on every ad page. */
const FOOTER_LINKS = L.links.filter((l) => l.href !== "/how-it-works");
/** Footer links open in the popup over the ad page (AdInfoPopup.tsx). They are ordinary links in the page HTML, so search
 *  engines follow them to the real (indexed) pages; never a new tab (owner, 7 Oct 2026). Plain <a> links, not <Link>:
 *  Next.js's Link would take the click for its own page change before the popup can open it. */
const POPUP_LINK = { "data-info": "" } as const;

export function AdHeader({ className = "", complete }: { className?: string; /** match page: a green "Match complete" pill instead of the badge */ complete?: string }) {
  return (
    <header className={`bz-header ${className}`}>
      {/* the logo exactly as in the site header (owner, 7 Oct 2026: same size and position on every page) */}
      <div className="container-wide flex h-[var(--header-h)] items-center justify-between gap-4 xl:px-[max(var(--gutter),4.5vw)]">
        <Link href="/" aria-label="Your Accountant Match — Home" className="flex shrink-0 items-center scale-120 origin-left">
          <HeaderLogo className="h-auto w-[min(210px,calc(100vw-6.5rem))] md:w-[300px] xl:w-[clamp(300px,21.5vw,430px)]" />
        </Link>
        {complete ? (
          <p className="mp-complete"><Check width={18} height={18} strokeWidth={3.2} aria-hidden /> <span className="mp-complete-text">{complete}</span></p>
        ) : (
          <p className="bz-badge"><ShieldCheck className="bz-badge-icon" /> <span>{L.badge}</span></p>
        )}
      </div>
    </header>
  );
}

/** Trust note in every ad page footer (owner, 6 Oct 2026; Google Ads landing page transparency): the approved credential
 *  claim, the cost line and the referral-service disclaimer, all existing approved wording. */
function AdAssure() {
  return (
    <p className="bz-assure">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain link on purpose: AdInfoPopup opens it in a popup; <Link> would navigate before the popup catches the click */}
      <a href="/how-we-select-accountants" {...POPUP_LINK}>{CREDENTIAL}</a>{" "}
      <span>Matching is free. Your Accountant Match is a referral service. Accounting and advisory services are provided by your matched firm. Accountant fees are agreed separately.</span>
    </p>
  );
}

/**
 * Footer of every ad page and the shared /match page (owner, 6 Oct 2026: the three trust icons removed, a cleaner design).
 * Logo and the trust note on the left, the information links on the right (they open in a popup), then a thin copyright line.
 * All ad pages share this one footer. Styles: ".adf" in ads.css.
 */
export function AdFooter() {
  return (
    <footer className="adf">
      <div className="bz-wrap adf-main">
        <div className="adf-brand">
          <Link href="/" aria-label="Your Accountant Match — Home" className="inline-block">
            <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="adf-logo" />
          </Link>
          <AdAssure />
        </div>
        <nav aria-label="Information" className="adf-links">
          <ul>{FOOTER_LINKS.map((l) => <li key={l.href}><a href={l.href} {...POPUP_LINK}>{l.text}</a></li>)}</ul>
        </nav>
      </div>
      <div className="adf-base">
        <p className="bz-wrap">
          <span>© {new Date().getFullYear()} {L.copyright}</span>
          <span>{L.based[0]} <span aria-hidden>•</span> {L.based[1]}</span>
        </p>
      </div>
      <AdInfoPopup />
    </footer>
  );
}
