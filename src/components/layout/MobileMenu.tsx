"use client";
// Phone/tablet navigation: a full-screen sheet. This is the only client code in the header.
import Link from "next/link";
import { useEffect, useState } from "react";
import { Close, Menu, ArrowRight } from "../ui/Icons";

type Item = { label: string; href: string };

export default function MobileMenu({ items, cta }: { items: Item[]; cta: { label: string; href: string } }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="grid h-12 w-12 place-items-center rounded-full text-navy-900 transition hover:bg-navy-50"
      >
        {open ? <Close width={26} height={26} /> : <Menu width={26} height={26} />}
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-white/95 px-4 pb-10 pt-4 backdrop-blur-xl"
      >
        <nav aria-label="Main">
          <ul className="divide-y divide-line">
            {items.map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center justify-between py-3 font-serif text-xl font-semibold text-ink"
                >
                  {it.label}
                  <ArrowRight width={20} height={20} className="text-green-600" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={cta.href} onClick={() => setOpen(false)} className="btn btn-primary btn-lg mt-6 w-full">
          <span>{cta.label}</span>
          <span className="btn-arrow"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
        </Link>
      </div>
    </div>
  );
}
