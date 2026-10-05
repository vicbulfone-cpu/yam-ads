import Link from "next/link";
import { ctaLabel, navItems, QUESTIONNAIRE_URL } from "@/config/site.config";
import HeaderLogo from "./HeaderLogo";
import { Button } from "../ui/Button";
import MobileMenu from "./MobileMenu";

/**
 * Sticky header: logo · navigation · primary CTA (owner's design, 4 Oct 2026).
 *  - Phones/tablets: logo + menu button (sheet opens below the bar).
 *  - Desktop (1280px+): plain text links in the middle of the bar, green button with an arrow on the right.
 */
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white">
      <div className="container-wide flex h-[var(--header-h)] items-center justify-between gap-6 xl:px-[max(var(--gutter),4.5vw)]">
        <Link href="/" aria-label="Your Accountant Match — Home" className="flex shrink-0 items-center scale-120 origin-left">
          <HeaderLogo className="h-auto w-[min(210px,calc(100vw-6.5rem))] md:w-[300px] xl:w-[clamp(300px,21.5vw,430px)]" />
        </Link>

        <nav aria-label="Main" className="ml-auto mr-6 hidden items-center gap-[clamp(1.75rem,2.6vw,3.25rem)] xl:flex">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="flex min-h-11 items-center whitespace-nowrap text-[1rem] font-medium text-navy-900 transition-colors duration-200 hover:text-green-700"
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href={QUESTIONNAIRE_URL} className="header-cta hidden !min-h-12 whitespace-nowrap !px-7 !py-2.5 !text-[1.05rem] transition-all duration-200 hover:![background:linear-gradient(135deg,#1a5aa6_0%,#0b3d78_100%)] hover:!shadow-[0_16px_36px_-8px_rgba(26,90,166,0.6)] sm:inline-flex">
            {ctaLabel}
          </Button>
          <MobileMenu items={navItems} cta={{ label: ctaLabel, href: QUESTIONNAIRE_URL }} />
        </div>
      </div>
    </header>
  );
}
