import Image from "next/image";
import Link from "next/link";
import type { Node } from "@/lib/content";
import { BUSINESS, REQUIRED_FOOTER_LINKS } from "@/content/business";
import { isLivePage } from "@/lib/pages";
import { Pin } from "../ui/Icons";

/** Pulls the footer section out of a page's extracted nodes. */
export function footerNodes(nodes: Node[]): Node[] {
  const out: Node[] = [];
  let inFooter = false;
  for (const n of nodes) {
    if (n.t === "sec") { inFooter = n.tag === "footer"; continue; }
    if (inFooter) out.push(n);
  }
  return out;
}

/**
 * Footer. Every word comes from the page's own old-site footer (address block, links,
 * "All cities we service", disclaimer, copyright), so each page keeps the footer variant it had.
 */
const HOME_FOOTER_COLUMNS: { title: string; links: { text: string; href?: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { text: "About", href: "/about" },
      { text: "How It Works", href: "/how-it-works" },
      { text: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Locations",
    links: [
      { text: "Melbourne", href: "/locations/melbourne" },
    ],
  },
  {
    title: "Information",
    links: [
      { text: "Privacy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
      { text: "How We Select Accountants", href: "/how-we-select-accountants" },
    ],
  },
];

/** Home page footer, laid out as in the owner's "home page 2" picture. */
function HomeFooter() {
  return (
    <footer className="border-t border-line bg-[#f7f9fb]">
      <div className="container-page pb-6 pt-12 md:pt-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_1.3fr_1fr]">
          <div>
            <p className="text-[1.45rem] font-extrabold tracking-tight text-navy-900">
              Your Accountant <span className="text-green-700">Match</span>
            </p>
            <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.32em] text-navy-900/70">Smarter matching. Better outcomes.</p>
            <p className="mt-4 max-w-[17rem] text-[0.88rem] leading-relaxed text-body">Connecting Australians with one local accountant who suits their needs.</p>
            <p className="mt-3 text-[0.88rem]">
              <a href={`mailto:${BUSINESS.email}`} className="font-semibold text-navy-900 transition hover:text-green-700">{BUSINESS.email}</a>
              {BUSINESS.phone && <><br /><a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`} className="font-semibold text-navy-900 transition hover:text-green-700">{BUSINESS.phone}</a></>}
            </p>
          </div>
          {HOME_FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[0.85rem] font-extrabold text-navy-900">{col.title}</p>
              <ul className={`mt-2 ${col.title === "Locations" ? "grid grid-flow-col grid-rows-7 gap-x-6" : ""}`}>
                {col.links.map((l) => (
                  <li key={l.text}>
                    {l.href ? (
                      <Link href={l.href} className="inline-flex min-h-9 items-center text-[0.86rem] text-body transition hover:text-green-700 md:min-h-7">{l.text}</Link>
                    ) : (
                      <span className="inline-flex min-h-9 items-center text-[0.86rem] text-body md:min-h-7">{l.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-5 text-[0.78rem] text-muted md:flex-row md:justify-between">
          <p>&copy; Your Accountant Match. All rights reserved.</p>
          <p>Your Accountant Match is a referral service. Accounting and advisory services are provided by your matched firm.</p>
        </div>
      </div>
    </footer>
  );
}

export default function SiteFooter({ nodes, variant }: { nodes: Node[]; variant?: "home" }) {
  if (variant === "home") return <HomeFooter />;
  const f = footerNodes(nodes);
  const cityHeadingIdx = f.findIndex((n) => n.t === "h");
  const before = cityHeadingIdx === -1 ? f : f.slice(0, cityHeadingIdx);
  const after = cityHeadingIdx === -1 ? [] : f.slice(cityHeadingIdx + 1);
  const heading = cityHeadingIdx === -1 ? null : (f[cityHeadingIdx] as Extract<Node, { t: "h" }>);

  const address = before.find((n) => n.t === "text") as Extract<Node, { t: "text" }> | undefined;
  // links to pages removed from this scaled-back site are left out
  const ownLinks = before.filter((n): n is Extract<Node, { t: "link" }> => n.t === "link" && isLivePage(n.href));
  // every footer carries About, Contact and the policy links, even where the page's old footer had fewer
  const have = new Set(ownLinks.map((l) => l.href.replace(/\/$/, "")));
  const navLinks = [...ownLinks, ...REQUIRED_FOOTER_LINKS.filter((l) => !have.has(l.href)).map((l) => ({ t: "link" as const, ...l }))];
  const cities = after.filter((n): n is Extract<Node, { t: "link" }> => n.t === "link" && isLivePage(n.href));
  const paras = [...before, ...after].filter((n): n is Extract<Node, { t: "p" }> => n.t === "p");
  const copyright = paras.length ? paras[paras.length - 1] : undefined;
  const notes = paras.slice(0, -1);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page pb-8 pt-14 md:pt-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            {address && (
              <p
                className="text-[0.95rem] leading-relaxed text-muted [&_strong]:text-navy-900"
                dangerouslySetInnerHTML={{ __html: address.html }}
              />
            )}
            <p className="mt-3 text-[0.95rem]">
              <a href={`mailto:${BUSINESS.email}`} className="font-semibold text-navy-900 transition hover:text-green-700">{BUSINESS.email}</a>
              {BUSINESS.phone && <><br /><a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`} className="font-semibold text-navy-900 transition hover:text-green-700">{BUSINESS.phone}</a></>}
              {BUSINESS.abn && <><br /><span className="text-muted">ABN {BUSINESS.abn}</span></>}
            </p>
          </div>

          {navLinks.length > 0 && (
            <nav aria-label="Footer" className="md:col-span-3">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 md:grid-cols-1">
                {navLinks.map((l) => (
                  <li key={l.href + l.text}>
                    <Link href={l.href} className="inline-flex min-h-11 items-center text-[0.95rem] font-semibold text-ink transition hover:text-green-700">
                      {l.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {cities.length > 0 && (
            <div className={navLinks.length > 0 ? "md:col-span-5" : "md:col-span-8"}>
              {heading && <h2 className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-muted">{heading.text}</h2>}
              <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-0.5 min-[420px]:grid-cols-2">
                {cities.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="group inline-flex min-h-10 items-center gap-2 text-[0.92rem] text-body transition hover:text-green-700">
                      <Pin width={15} height={15} className="text-green-500 transition group-hover:scale-110" />
                      {c.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {notes.length > 0 && (
          <div className="mt-12 space-y-3 border-t border-line pt-8 text-xs leading-relaxed text-muted">
            {notes.map((p, i) => (<p key={i} dangerouslySetInnerHTML={{ __html: p.html }} />))}
          </div>
        )}
        {copyright && (
          <p className="mt-6 text-sm font-medium text-muted" dangerouslySetInnerHTML={{ __html: copyright.html }} />
        )}
      </div>
    </footer>
  );
}
