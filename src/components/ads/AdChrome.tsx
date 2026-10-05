// Header and footer of the ad pages (owner's "business" design picture): logo and "Free matching. No obligation." at the
// top; trust strip, copyright and the information links at the bottom. The site's own header and phone CTA bar are
// hidden on pages that use these (".bz-page" in globals.css).
import Image from "next/image";
import Link from "next/link";
import { logo } from "@/config/site.config";
import { BIZ_LANDING as L } from "@/content/business-questionnaire";
import { PeopleSolid, ShieldCheck, ThumbSolid } from "./BizIcons";

export function AdHeader() {
  return (
    <header className="bz-header">
      <div className="bz-wrap flex items-center justify-between gap-4">
        <Link href="/" aria-label="Your Accountant Match — Home" className="shrink-0">
          <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} priority className="bz-logo" />
        </Link>
        <p className="bz-badge"><ShieldCheck className="bz-badge-icon" /> <span>{L.badge}</span></p>
      </div>
    </header>
  );
}

const TRUST_ICONS = { shield: ShieldCheck, people: PeopleSolid, thumb: ThumbSolid };

export function AdFooter() {
  return (
    <footer className="bz-footer">
      <div className="bz-wrap grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <ul className="bz-trust">
            {L.trust.map((t) => {
              const Icon = TRUST_ICONS[t.icon as keyof typeof TRUST_ICONS];
              return <li key={t.text}><Icon className="bz-trust-icon" /><span>{t.text}</span></li>;
            })}
          </ul>
          <p className="mt-4 text-[0.82rem] leading-snug text-navy-900">
            <strong className="font-bold">© {new Date().getFullYear()} {L.copyright}</strong>
            <span className="block text-muted">{L.based[0]} <span aria-hidden>•</span> {L.based[1]}</span>
          </p>
        </div>
        <nav aria-label="Information" className="bz-links">
          {/* two rows of three, as in the design */}
          {[L.links.slice(0, 3), L.links.slice(3)].map((row, i) => (
            <p key={i}>{row.map((l) => <Link key={l.href} href={l.href}>{l.text}</Link>)}</p>
          ))}
        </nav>
      </div>
    </footer>
  );
}
