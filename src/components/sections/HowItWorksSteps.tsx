import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";
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
        {crumbs && <Breadcrumbs crumbs={crumbs} className="-mt-[1cm] mb-[calc(1.5rem+1cm)] md:-mt-[1.5cm] md:mb-[calc(2rem+1.5cm)]" />}
        <div className={`max-w-3xl ${intro ? "pb-[1cm]" : ""}`}>{/* 1cm extra under the intro (padding, so it adds to the gap above the steps) */}
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
              <li key={s.title} className="hiw-step relative pb-10 last:pb-0 sm:pl-28 lg:pb-[clamp(3rem,4vw,5rem)] lg:pl-[clamp(8.5rem,9.5vw,12rem)]">
                {/* step rail (owner, 7 Oct 2026): a green "STEP 1/2/3" pill per step (in place of the numbered discs and the
                    pills that sat on the photos), joined by a dashed line; phones show the pill above its box */}
                <div aria-hidden className="mb-3 sm:absolute sm:left-0 sm:top-0 sm:mb-0 sm:flex sm:w-24 sm:justify-center lg:w-[clamp(7rem,7.6vw,9.5rem)]">
                  <span className="step-badge sm:[zoom:1.15] lg:[zoom:1.5]">
                    <span className="step-badge-word">Step</span>
                    <span className="step-badge-num">{i + 1}</span>
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span aria-hidden className="absolute bottom-0 top-12 hidden w-0 border-l-2 border-dashed border-green-700/35 sm:left-12 sm:block lg:left-[clamp(3.5rem,3.8vw,4.75rem)] lg:top-[clamp(4rem,4.4vw,5.75rem)]" />
                )}

                <article className="hiw-card group grid overflow-hidden rounded-[1.4rem] border border-navy-900/10 bg-white shadow-[0_24px_50px_-30px_rgba(7,50,101,0.45)] transition duration-300 hoverable:hover:-translate-y-1 hoverable:hover:shadow-[0_30px_60px_-28px_rgba(7,50,101,0.5)] md:grid-cols-[0.85fr_1.15fr]">
                  {home && (
                    <div className={`relative aspect-[16/9] overflow-hidden bg-white md:aspect-auto md:min-h-[17rem] ${flip ? "md:order-2" : ""}`}>
                      <Image
                        // the map (step 2) uses a tightly trimmed copy, so it fills its box without being cropped
                        src={home.image.includes("map") ? "/images/home/australia-map-pin-tight.webp" : home.image}
                        alt={home.alt}
                        fill
                        sizes="(min-width: 768px) 40vw, 92vw"
                        className={`${home.image.includes("map") ? "object-contain" : "object-cover"} transition duration-700 hoverable:group-hover:scale-[1.04]`}
                        style={{ objectPosition: home.position, transform: home.shift }}
                      />
                    </div>
                  )}
                  {/* desktops (owner, 7 Oct 2026): the words in the step boxes at 140% of their earlier size */}
                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-[clamp(2rem,2.8vw,3.75rem)]">
                    <h2 className="font-sans text-[1.5rem] font-extrabold leading-tight tracking-[-0.02em] text-navy-900 sm:text-[1.75rem] lg:text-[clamp(2.45rem,2.8vw,3.85rem)]">
                      {s.title}
                    </h2>
                    {home && (
                      <p className="mt-3 flex items-start gap-2.5 text-[1.05rem] font-bold leading-snug text-green-700 lg:text-[clamp(1.47rem,1.68vw,2.24rem)]">
                        <span aria-hidden className="mt-[0.55em] h-[3px] w-6 shrink-0 rounded-full bg-green-600" />
                        {home.text}
                      </p>
                    )}
                    <Html html={s.html} className="mt-4 text-[1rem] leading-[1.65] text-body lg:text-[clamp(1.4rem,1.54vw,2.03rem)]" />
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
