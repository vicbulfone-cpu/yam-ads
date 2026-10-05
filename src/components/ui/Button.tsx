import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./Icons";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "navy" | "ghost" | "light";
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
};

/** Pill button. `arrow` adds the little circular arrow that nudges right on hover. */
export function Button({ href, children, variant = "primary", size = "md", arrow = true, className = "" }: Props) {
  return (
    <Link href={href} className={`btn btn-${variant} ${size === "lg" ? "btn-lg" : ""} ${className}`}>
      <span>{children}</span>
      {arrow && (
        <span className="btn-arrow">
          <ArrowRight width={16} height={16} strokeWidth={2.5} />
        </span>
      )}
    </Link>
  );
}
