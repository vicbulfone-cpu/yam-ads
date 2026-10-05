import Image from "next/image";
import Link from "next/link";
import { QUESTIONNAIRE_URL, ctaLabel } from "@/config/site.config";
import { ArrowRight } from "../ui/Icons";

/** Full-width call-to-action panel. Words are passed in (existing site wording). */
export default function CtaBand({ title, text, label = ctaLabel, note, backdrop, asHeading = true }: { title?: string; text?: string; label?: string; note?: string; backdrop?: { src: string }; asHeading?: boolean }) {
  return (
    <section className="px-4 py-10 md:py-14">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[2rem] bg-navy-900 px-6 py-14 text-center text-white shadow-[var(--shadow-lg)] md:rounded-[2.5rem] md:px-16 md:py-20">
        {backdrop && (
          <>
            <Image src={backdrop.src} alt="" fill sizes="1240px" className="object-cover object-center opacity-45 mix-blend-luminosity" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/55 to-navy-900/90" />
          </>
        )}
        <div aria-hidden className="absolute inset-0 opacity-60 [background:radial-gradient(60%_80%_at_85%_0%,rgba(0,174,65,.45),transparent_60%),radial-gradient(50%_70%_at_0%_100%,rgba(26,90,166,.7),transparent_60%)]" />
        <div aria-hidden className="dots absolute inset-0 opacity-20 [filter:invert(1)]" />
        <div className="relative mx-auto max-w-2xl">
          {title && (asHeading ? <h2 className="h-section !text-white">{title}</h2> : <p className="h-section !text-white">{title}</p>)}
          {text && <p className="lead mt-4 !text-navy-100">{text}</p>}
          <div className="mt-8 flex justify-center">
            <Link href={QUESTIONNAIRE_URL} className="btn btn-light btn-lg">
              <span>{label}</span>
              <span className="btn-arrow !bg-green-600 !text-white"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
            </Link>
          </div>
          {note && <p className="mt-5 text-sm font-semibold text-green-200">{note}</p>}
        </div>
      </div>
    </section>
  );
}
