// Header and footer of the ad pages (owner's "business" design picture): logo and "Free matching. No obligation." at the
// top; trust strip, copyright and the information links at the bottom. The site's own header and phone CTA bar are
// hidden on pages that use these (".bz-page" in globals.css).
import Image from "next/image";
import Link from "next/link";
import { logo } from "@/config/site.config";
import { BIZ_LANDING as L } from "@/content/business-questionnaire";
import { HandshakeSolid, LockIcon, PeopleOutline, PeopleSolid, PinSolid, ShieldCheck, ThumbSolid } from "./BizIcons";

export function AdHeader({ className = "" }: { className?: string }) {
  return (
    <header className={`bz-header ${className}`}>
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
// owner's "personal" design picture: padlock, people outline and handshake
const PERSONAL_TRUST_ICONS = [LockIcon, PeopleOutline, HandshakeSolid];
// owner's "smsf" design picture: padlock, people and map pin
const SMSF_TRUST_ICONS = [LockIcon, PeopleSolid, PinSolid];

export function AdFooter({ variant = "business" }: { variant?: "business" | "personal" | "smsf" }) {
  if (variant !== "business") {
    const icons = variant === "smsf" ? SMSF_TRUST_ICONS : PERSONAL_TRUST_ICONS;
    // trust strip across the page, then one line: copyright on the left, information links on the right
    return (
      <footer className="bz-footer pz-footer">
        <div className="bz-wrap">
          <ul className="bz-trust pz-trust">
            {L.trust.map((t, i) => {
              const Icon = icons[i];
              return <li key={t.text}><Icon className="bz-trust-icon" /><span>{t.text}</span></li>;
            })}
          </ul>
        </div>
        <div className="pz-footer-line">
          <div className="bz-wrap flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[0.82rem] leading-snug text-navy-900">
              © {new Date().getFullYear()} {L.copyright}.<span className="ml-2">{L.based[0]} <span aria-hidden>•</span> {L.based[1]}.</span>
            </p>
            <nav aria-label="Information" className="bz-links pz-links">
              <p>{L.links.map((l) => <Link key={l.href} href={l.href}>{l.text}</Link>)}</p>
            </nav>
          </div>
        </div>
      </footer>
    );
  }
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
