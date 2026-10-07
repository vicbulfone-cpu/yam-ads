/**
 * Home page — "Why it matters" band.
 * Deep navy band with an eyebrow pill, a two-line heading (green emphasis)
 * and four translucent benefit cards, each with a green line icon.
 *
 * Note: global h2/h3 rules are serif and unlayered, so heading font/colour
 * utilities use the Tailwind 4 important suffix (`!`) to win.
 */
import type { ReactNode } from "react";
import WimReveal from "./WimReveal";

/* ---------- Inline line icons (stroke = currentColor) ---------- */
const iconProps = {
  width: 46,
  height: 46,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ClockIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const CoinsIcon = () => (
  <svg {...iconProps}>
    <ellipse cx="9" cy="6" rx="6" ry="2.5" />
    <path d="M3 6v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6" />
    <path d="M3 10v4c0 1.4 2.7 2.5 6 2.5" />
    <path d="M3 14v4c0 1.4 2.7 2.5 6 2.5" />
    <ellipse cx="15" cy="14" rx="6" ry="2.5" />
    <path d="M9 14v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
  </svg>
);

const PeopleIcon = () => (
  <svg {...iconProps}>
    <circle cx="8.5" cy="8" r="3" />
    <circle cx="16" cy="8.5" r="2.6" />
    <path d="M2.5 19.5c.4-3.4 2.9-5.5 6-5.5s5.6 2.1 6 5.5" />
    <path d="M15 14.1c.3 0 .6-.1 1-.1 2.7 0 4.9 1.9 5.3 4.9" />
  </svg>
);

const ChartIcon = () => (
  <svg {...iconProps}>
    <path d="M4 20h16" />
    <rect x="5" y="13" width="3" height="5" rx="0.6" />
    <rect x="10.5" y="10" width="3" height="8" rx="0.6" />
    <rect x="16" y="7" width="3" height="11" rx="0.6" />
    <path d="M4 10l5-4 4 2 6-5" />
    <path d="M16 3h3v3" />
  </svg>
);

type Benefit = { icon: ReactNode; title: string; description: string };

const benefits: Benefit[] = [
  {
    icon: <ClockIcon />,
    title: "More time for what matters",
    description: "Get the right advice and support so you can focus on your work, family and goals.",
  },
  {
    icon: <CoinsIcon />,
    title: "Save money",
    description: "A good accountant can help you legally minimise tax and make smarter financial decisions.",
  },
  {
    icon: <PeopleIcon />,
    title: "Less stress",
    description: "Have confidence knowing you're working with an accountant who understands your situation.",
  },
  {
    icon: <ChartIcon />,
    title: "Better outcomes",
    description: "Get proactive accountants to help you grow, plan for the future and achieve your financial goals.",
  },
];

export default function WhyItMatters() {
  return (
    // no space above: the trust points strip above has equal space above and below its icons (owner, 6 Oct 2026)
    <section className="relative overflow-hidden bg-navy-900 py-16 text-white md:py-20">
      {/* Soft lighting so the band is not a flat block of colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_0%,rgba(26,90,166,0.45),transparent_70%),radial-gradient(50%_70%_at_0%_100%,rgba(3,26,61,0.6),transparent_70%)]"
      />
      <div className="container-page home-wide relative">
        <p className="mb-5 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-green-200 fs-eyebrow">
          Why it matters
        </p>
        <h2 className="mb-10 max-w-3xl font-sans! text-[1.85rem] leading-[1.12]! font-extrabold tracking-tight! text-white! sm:text-4xl md:mb-12 lg:mb-[3vw] lg:max-w-none lg:text-[2.75rem] fs-h2">
          Choosing the right accountant <br className="hidden sm:inline" />
          saves you <span className="text-[#4fd06a]">time, money and stress.</span>
        </h2>

        <WimReveal />
        <ul className="wim-cards grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-[1.6vw]">
          {benefits.map((b, i) => (
            <li
              key={b.title}
              style={{ "--i": i } as React.CSSProperties}
              className="wim-card rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm transition duration-300 motion-reduce:transition-none hoverable:hover:-translate-y-1 hoverable:hover:border-white/30 hoverable:hover:bg-white/[0.09] lg:p-[clamp(1.75rem,2vw,3rem)]"
            >
              <span className="wim-icon mb-4 inline-flex h-14 items-center text-[#3cc35a] lg:h-auto lg:[&_svg]:h-auto lg:[&_svg]:w-[clamp(2.9rem,3vw,4.4rem)] drop-shadow-[0_0_10px_rgba(0,174,65,0.35)]">
                {b.icon}
              </span>
              <h3 className="mb-2 font-sans! text-lg leading-snug! font-bold tracking-tight! text-white! lg:text-xl fs-card">
                {b.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-navy-100 fs-body">{b.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
