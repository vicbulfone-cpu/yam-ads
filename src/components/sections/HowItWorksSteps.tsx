import Image from "next/image";
import Link from "next/link";
import { HOME_STEPS } from "./HomeMatchIntro";
import { Html } from "./Blocks";
import StartBar from "./StartBar";

export type HowStep = { title: string; html: string };

/**
 * How It Works page: the three steps, explained in full (owner, 7 Oct 2026: "combine the extra content with the home
 * page's How it works section"). Each step joins the home page's photo, "Step" badge and short line with this page's own
 * heading (kept as an H2, so the heading outline is unchanged) and its detailed paragraph. A numbered rail links the
 * steps; on laptops and desktops the photo and words alternate sides. The navy start bar closes the section.
 */
/** `crumbs`: on /how-it-works this section opens the page (owner, 7 Oct 2026: the old hero removed), so it carries the
 *  breadcrumb and its heading is the page's H1. */
export default function HowItWorksSteps({ steps, crumbs, intro }: { steps: HowStep[]; crumbs?: { label: string; href?: string }[]; /** the page's own intro paragraph (HTML), shown under the heading */ intro?: string }) {
  const Heading = crumbs ? "h1" : "p";
  return (
    <section aria-label="How it works, step by step" className="relative overflow-hidden bg-[#f7f9fb] pt-12 md:pt-16 lg:pt-[clamp(4rem,5vw,7rem)]">
      {/* soft green and navy glows behind the steps */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-green-500/[0.07] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-40 h-[30rem] w-[30rem] rounded-full bg-navy-900/[0.06] blur-3xl" />

      <div className="container-page relative">
        {/* breadcrumb: 1.5cm higher (1cm on phones, so it stays clear of the top bar); the heading below stays where it was (owner, 7 Oct 2026) */}
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="-mt-[1cm] mb-[calc(1.5rem+1cm)] md:-mt-[1.5cm] flex flex-wrap items-center gap-x-2 text-sm font-medium text-muted md:mb-[calc(2rem+1.5cm)]">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-line">/</span>}
                {c.href && i < crumbs.length - 1 ? <Link href={c.href} className="transition hover:text-green-700">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="max-w-3xl">
          {/* owner, 7 Oct 2026 (for SEO): replaces the "How it works" eyebrow and "Finding your accountant, made simple." */}
          <Heading className="font-sans! text-[2.1rem] font-extrabold! leading-[1.02]! tracking-[-0.04em]! sm:text-[2.6rem] lg:text-[clamp(2.6rem,3.4vw,4.8rem)]">
            <span className="block text-navy-900">How does it work?</span>{" "}
            <span className="block text-green-700">Finding your accountant is easy</span>
          </Heading>
          {/* intro to the three steps (owner, 7 Oct 2026): the page's own intro, moved here when the old hero was removed */}
          {intro && <Html html={intro} className="mt-5 max-w-[46rem] text-[1.05rem] leading-relaxed text-navy-900/85 lg:mt-[1.4vw] lg:text-[clamp(1.05rem,1.2vw,1.6rem)]" />}
        </div>

        {/* desktops (owner, 7 Oct 2026): the three step boxes at 75% of their size (everything in them scales together),
            lined up on the left with the heading (owner: centred, then back to the left) */}
        <ol className="hiw-steps relative mt-10 lg:mt-[clamp(3rem,4vw,5.5rem)] lg:w-[75%] lg:[zoom:0.75]">
          {steps.map((s, i) => {
            const home = HOME_STEPS[i];
            const flip = i % 2 === 1;
            return (
              <li key={s.title} className="hiw-step relative pb-10 pl-14 last:pb-0 sm:pl-20 lg:pb-[clamp(3rem,4vw,5rem)] lg:pl-[clamp(6rem,7vw,9rem)]">
                {/* numbered rail: a green disc per step, joined by a dashed line */}
                <span aria-hidden className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#0e8a3a] to-[#08602a] font-sans text-[1.1rem] font-extrabold text-white shadow-[0_0_0_5px_#f7f9fb,0_10px_20px_-8px_rgba(7,50,101,0.5)] sm:h-12 sm:w-12 sm:text-[1.3rem] lg:h-[clamp(3.25rem,3.6vw,4.75rem)] lg:w-[clamp(3.25rem,3.6vw,4.75rem)] lg:text-[clamp(1.4rem,1.6vw,2.1rem)]">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span aria-hidden className="absolute bottom-0 left-5 top-12 w-0 border-l-2 border-dashed border-green-700/35 sm:left-6 sm:top-14 lg:left-[clamp(1.625rem,1.8vw,2.375rem)] lg:top-[clamp(4rem,4.4vw,5.75rem)]" />
                )}

                <article className="hiw-card group grid overflow-hidden rounded-[1.4rem] border border-navy-900/10 bg-white shadow-[0_24px_50px_-30px_rgba(7,50,101,0.45)] transition duration-300 hoverable:hover:-translate-y-1 hoverable:hover:shadow-[0_30px_60px_-28px_rgba(7,50,101,0.5)] md:grid-cols-[0.85fr_1.15fr]">
                  {home && (
                    <div className={`relative aspect-[16/9] overflow-hidden bg-white md:aspect-auto md:min-h-[17rem] ${flip ? "md:order-2" : ""}`}>
                      <Image
                        src={home.image}
                        alt={home.alt}
                        fill
                        sizes="(min-width: 768px) 40vw, 92vw"
                        className="object-cover transition duration-700 hoverable:group-hover:scale-[1.04]"
                        style={{ objectPosition: home.position, transform: home.shift }}
                      />
                      <span aria-hidden className="step-badge absolute left-4 top-4">
                        <span className="step-badge-word">Step</span>
                        <span className="step-badge-num">{i + 1}</span>
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-[clamp(2rem,2.8vw,3.75rem)]">
                    <h2 className="font-sans text-[1.5rem] font-extrabold leading-tight tracking-[-0.02em] text-navy-900 sm:text-[1.75rem] lg:text-[clamp(1.75rem,2vw,2.75rem)]">
                      {s.title}
                    </h2>
                    {home && (
                      <p className="mt-3 flex items-start gap-2.5 text-[1.05rem] font-bold leading-snug text-green-700 lg:text-[clamp(1.05rem,1.2vw,1.6rem)]">
                        <span aria-hidden className="mt-[0.55em] h-[3px] w-6 shrink-0 rounded-full bg-green-600" />
                        {home.text}
                      </p>
                    )}
                    <Html html={s.html} className="mt-4 text-[1rem] leading-[1.65] text-body lg:text-[clamp(1rem,1.1vw,1.45rem)]" />
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-12 lg:mt-[clamp(3rem,4vw,5rem)]">
        <StartBar />
      </div>
    </section>
  );
}
