import Image from "next/image";
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
export default function HowItWorksSteps({ steps }: { steps: HowStep[] }) {
  return (
    // laptops/desktops (owner, 7 Oct 2026): the whole section 7cm higher, into the empty space under the intro beside the
    // match box (4cm on very wide screens, where the bigger match box reaches lower, so the heading never runs under it).
    // The grey background starts where the hero ends, so the hero and its match box are never covered, and the section
    // ignores clicks except on the steps and the bar, so the match box stays usable.
    <section aria-label="How it works, step by step" className="relative overflow-hidden pt-12 md:pt-16 lg:pointer-events-none lg:-mt-[7cm] lg:pt-[clamp(4rem,5vw,7rem)] 2xl:-mt-[4cm]">
      <div aria-hidden className="absolute inset-x-0 bottom-0 top-0 bg-[#f7f9fb] lg:top-[7cm] 2xl:top-[4cm]" />
      {/* soft green and navy glows behind the steps */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-green-500/[0.07] blur-3xl lg:top-[calc(7cm+2.5rem)] 2xl:top-[calc(4cm+2.5rem)]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-40 h-[30rem] w-[30rem] rounded-full bg-navy-900/[0.06] blur-3xl" />

      <div className="container-page relative">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700 fs-eyebrow">
            How it works
            <span aria-hidden className="h-px w-16 bg-green-700" />
          </p>
          <p className="mt-2 font-sans text-[2.1rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[2.6rem] lg:text-[clamp(2.6rem,3.4vw,4.8rem)]">
            <span className="block text-navy-900">Finding your accountant,</span>
            <span className="block text-green-700">made simple.</span>
          </p>
        </div>

        <ol className="hiw-steps relative mt-10 lg:pointer-events-auto lg:mt-[clamp(3rem,4vw,5.5rem)]">
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

      <div className="relative mt-12 lg:pointer-events-auto lg:mt-[clamp(3rem,4vw,5rem)]">
        <StartBar />
      </div>
    </section>
  );
}
