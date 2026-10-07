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
import DataCredit from "../ui/DataCredit";
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
      <div className="bz-wrap flex items-center justify-between gap-4">
        <Link href="/" aria-label="Your Accountant Match — Home" className="shrink-0">
          <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} priority className="bz-logo" />
        </Link>
        {complete ? (
          <p className="mp-complete"><Check width={18} height={18} strokeWidth={3.2} aria-hidden /> {complete}</p>
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
          <span>© {new Date().getFullYear()} {L.copyright} <DataCredit className="ml-2 opacity-80" /></span>
          <span>{L.based[0]} <span aria-hidden>•</span> {L.based[1]}</span>
        </p>
      </div>
      <AdInfoPopup />
    </footer>
  );
}
