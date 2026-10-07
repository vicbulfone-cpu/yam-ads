import Link from "next/link";

/** Visible "Home / Page" breadcrumb (How It Works and About pages). `className` sets the spacing around it. */
export default function Breadcrumbs({ crumbs, className = "" }: { crumbs: { label: string; href?: string }[]; className?: string }) {
  if (crumbs.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-x-2 text-sm font-medium text-muted ${className}`}>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="text-line">/</span>}
          {c.href && i < crumbs.length - 1 ? <Link href={c.href} className="transition hover:text-green-700">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}
