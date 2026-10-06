import Image from "next/image";
import { HERO_COPY } from "@/content/hero-copy";

/**
 * The three trust points with their round green icons ("Local accountants in your area", "Matched to your exact needs",
 * "Free and no obligation"). Shown under the home page headline (DeskHero.tsx) and under the headline on every ad
 * landing page (owner, 6 Oct 2026). Wording and icons: HERO_COPY.points in src/content/hero-copy.ts.
 * Styles: ".desk-hero-points" in globals.css; ad pages add ".bz-points" (ads.css).
 */
export default function HeroPoints({ className = "" }: { className?: string }) {
  return (
    <ul className={`desk-hero-points ${className}`}>
      {HERO_COPY.points.map((p) => (
        <li key={p.strong} className="flex items-center gap-3">
          <Image src={p.icon} alt="" width={160} height={160} className="h-11 w-11 shrink-0 2xl:h-[3.75rem] 2xl:w-[3.75rem]" />
          <span className="text-[0.95rem] leading-tight text-navy-900 2xl:text-[1.15rem]">
            <strong className="block font-extrabold">{p.strong}</strong> {p.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
