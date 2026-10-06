import Image from "next/image";
import Link from "next/link";
import { QUESTIONNAIRE_URL } from "@/config/site.config";
import HeroGap from "./HeroGap";
import StartBar from "./StartBar";

/**
 * Home page, straight under the hero (owner's "example 1" picture, 5 Oct 2026):
 * 1. "Finding your accountant, made simple." — three numbered photo steps joined by curved arrows, then a navy
 *    "Ready to meet your accountant?" bar with the start button.
 * 2. "A local accountant. A better match." — words and button on the left, photo on the right with a handwritten
 *    note and a navy badge, then the navy bar without a button, touching the photo and ending the section.
 * (Order swapped by the owner, 6 Oct 2026.)
 * Phones and tablets stack everything in one column; the photo moves under the button.
 */

const steps: { title: string; text: string; image: string; alt: string; position: string; shift?: string }[] = [
  {
    title: "Tell us what you need",
    text: "Complete our short 60-second questionnaire.",
    image: "/images/home/woman-phone-sofa.webp",
    alt: "Woman relaxing on her sofa as she fills in the short questionnaire on her phone",
    position: "50% 0%",
  },
  {
    title: "We find your match",
    text: "Your postcode connects you with one local accountant from our partner network.",
    image: "/images/home/australia-map-pin.webp",
    alt: "Map of Australia with a green location pin marking a local match",
    position: "50% 50%",
    shift: "translateY(-2mm) scale(0.92)", // map sits 2mm higher in its white card, a touch smaller so its top is never cut off (owner, 5 Oct 2026)
  },
  {
    title: "Connect and get started",
    text: "Your match calls you, or you call for immediate assistance.",
    image: "/images/home/accountant-client-desk.webp",
    alt: "Accountant talking through paperwork with a new client at his desk",
    position: "50% 0%",
  },
];

const ArrowRight = () => (
  <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-[1.1em] w-[1.1em]">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Hand-drawn curved arrow between the step photos */
const StepArrow = () => (
  <svg viewBox="0 0 60 40" aria-hidden fill="none" stroke="#0e7a32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[clamp(2.5rem,3.6vw,5rem)]">
    <path d="M4 33C16 18 32 12 54 12" />
    <path d="M44 4l10 8-11 6" />
  </svg>
);

/** Eyebrow with a short rule after it */
const Eyebrow = ({ children }: { children: string }) => (
  <p className="flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700 fs-eyebrow">
    {children}
    <span aria-hidden className="h-px w-16 bg-green-700 lg:w-[clamp(4rem,6vw,9rem)]" />
  </p>
);

/** `startHref`: where the Start buttons go (ad pages pass their own match box, so ad leads stay with the ad questionnaire). */
export default function HomeMatchIntro({ startHref = QUESTIONNAIRE_URL }: { startHref?: string }) {
  return (
    <section aria-labelledby="home-match-intro" className="relative overflow-hidden bg-white pt-[calc(3rem+0.5cm)] lg:pt-[clamp(2.5rem,2.6vw,4rem)]">
      {/* starts 0.5cm lower than the usual 2.5cm under the hero (owner, 5 Oct 2026: 2cm lower, then 1.5cm back up);
          phones/tablets get the 0.5cm in the padding above */}
      <HeroGap cm={3} />
      <div>

        {/* 1 — how it works (owner, 6 Oct 2026: swapped with "Meet your accountant match", which now follows it;
            the spacing between the blocks is unchanged) */}
        <div className="container-page home-wide">
          <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-[4vw]">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-2 font-sans text-[2.1rem] font-extrabold leading-[1.02]! tracking-[-0.04em] sm:text-[2.6rem] lg:text-[clamp(2.6rem,3.75vw,5.7rem)]">
                <span className="block text-navy-900">Finding your accountant,</span>
                <span className="block text-green-700">made simple.</span>
              </h2>
            </div>
            <p className="text-[1.05rem] leading-snug text-navy-900/85 lg:mt-[1.2vw] lg:self-start lg:border-l lg:border-navy-900/25 lg:py-[0.4vw] lg:pl-[3.5vw] lg:text-[clamp(1.05rem,1.3vw,1.95rem)]">
              About 60 seconds to get started.
              <br />
              Three simple steps to your local match.
            </p>
          </div>

          <ol className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:mt-[1.4vw] lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-[1.2vw]">
            {steps.flatMap((s, i) => [
              <li key={s.title} className="relative">
                <div className="relative ml-1 mt-4 aspect-[2.35/1] overflow-hidden rounded-[1.1rem] bg-white shadow-[0_14px_30px_-16px_rgba(7,50,101,0.35)] sm:aspect-[1.6/1] lg:aspect-[2.35/1]">
                  <Image src={s.image} alt={s.alt} fill sizes="(min-width: 640px) 28vw, 92vw" className="object-cover" style={{ objectPosition: s.position, transform: s.shift }} />
                </div>
                <span
                  aria-hidden
                  className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full bg-green-700 font-sans text-[1.4rem] font-extrabold text-white ring-[5px] ring-white lg:h-[clamp(3rem,3.6vw,5.2rem)] lg:w-[clamp(3rem,3.6vw,5.2rem)] lg:text-[clamp(1.4rem,1.9vw,2.8rem)]"
                >
                  {i + 1}
                </span>
                <h3 className="mt-3 font-sans text-[1.3rem] font-extrabold tracking-[-0.02em] text-navy-900 lg:mt-[0.9vw] lg:text-[clamp(1.3rem,1.75vw,2.6rem)]">{s.title}</h3>
                <p className="mt-1 text-[0.98rem] leading-snug text-navy-900/80 lg:text-[clamp(0.98rem,1.2vw,1.8rem)]">{s.text}</p>
              </li>,
              i < steps.length - 1 && (
                <li key={`arrow-${i}`} aria-hidden className="hidden pt-[6.5vw] lg:block">
                  <StepArrow />
                </li>
              ),
            ])}
          </ol>
        </div>

        {/* navy start bar under the steps: full screen width (owner, 5 Oct 2026: 1cm extra space above it;
            6 Oct 2026: moved up 1cm, so none; later 6 Oct 2026: moved down 1cm again, everything below follows) */}
        <div className="mt-[calc(2.5rem+1cm)] lg:mt-[calc(1.4vw+1cm)]">
          {/* words start in line with "How it works" on laptops and desktops (owner, 6 Oct 2026) */}
          <StartBar startHref={startHref} buttonOnPhone={false} className="bar-align-how-row" />
        </div>

        {/* 2 — words and photo (1.85cm extra space above, owner 5 Oct 2026: 3.1cm, then 1.25cm back up) */}
        <div className="container-page home-wide grid items-center gap-8 pt-[calc(2.5rem+1.85cm)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-0 lg:pt-[calc(2vw+1.85cm)]">
          {/* lg:mb-[1cm] balances the photo's 1cm top margin, so the words stay where they were (owner, 6 Oct 2026) */}
          <div className="relative z-10 lg:mb-[1cm] lg:py-[1vw]">
            <Eyebrow>Meet Your Accountant Match</Eyebrow>
            <h2
              id="home-match-intro"
              className="mt-3 font-sans text-[2.35rem] font-extrabold leading-[1.02]! tracking-[-0.04em] sm:text-[3rem] lg:mt-[0.9vw] lg:whitespace-nowrap lg:text-[clamp(2.8rem,3.9vw,6rem)]"
            >
              <span className="block text-navy-900">A local accountant.</span>
              <span className="block text-green-700">A better match.</span>
            </h2>
            <p className="mt-3 text-[1.2rem] font-extrabold leading-snug tracking-[-0.02em] text-navy-900 lg:mt-[0.9vw] lg:text-[clamp(1.25rem,1.75vw,2.6rem)]">
              Your needs. Your area. Your accountant.
            </p>
            <p className="mt-3 max-w-[36rem] text-[1rem] leading-[1.55] text-navy-900/85 lg:mt-[0.8vw] lg:max-w-[38vw] lg:text-[clamp(1rem,1.15vw,1.7rem)]">
              We take the guesswork out of finding an accountant. Tell us your postcode and what you need help with, and we
              connect you with one local accountant from our Australia-wide partner network.
            </p>
            <div className="mt-6 inline-flex flex-col items-center lg:mt-[1.8vw]">
              <Link href={startHref} className="btn btn-primary min-w-[16rem] rounded-full px-8 text-[1.05rem] btn-fluid lg:min-w-[clamp(16rem,22vw,32rem)]">
                Get Matched Now <ArrowRight />
              </Link>
              <p className="mt-2.5 text-[0.82rem] text-navy-900/80 fs-xs">
                Free matching <span aria-hidden className="mx-1.5">&bull;</span> No obligation
              </p>
            </div>
          </div>

          {/* photo: bleeds to the right edge of the screen on laptops and desktops, fading into the white on its left */}
          {/* laptops/desktops: shifted 0.5cm to the left (owner, 5 Oct 2026: 2.5cm right, then 3cm left) */}
          {/* laptops/desktops: sits on the bottom of the row, so the navy bar below always touches it (owner, 6 Oct 2026) */}
          {/* owner, 6 Oct 2026: photo (and the bar on it) 1cm lower; everything below follows */}
          <div className="relative -mx-[var(--gutter)] mt-[1cm] aspect-[4/3] sm:aspect-[3/2] lg:self-end lg:-ml-[6vw] lg:-mr-[7.5vw] lg:aspect-[1.95/1] lg:-translate-x-[0.5cm]">
            <Image
              src="/images/home/tradie-drill-ute.webp"
              alt="Smiling tradesman holding a drill and tool bag beside his ute in a driveway"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="intro-photo object-cover object-[50%_6%] lg:object-contain lg:object-right"
            />
            {/* handwritten note with a curved arrow pointing at the badge */}
            {/* laptops/desktops: nudged 0.5cm right and 0.5cm down (owner, 5 Oct 2026) */}
            <div aria-hidden className="absolute left-[5%] top-[10%] lg:left-[3%] lg:top-[22%] lg:translate-x-[0.5cm] lg:translate-y-[0.5cm]">
              <p className="-rotate-[12deg] [text-shadow:0_0_10px_#fff,0_0_4px_#fff] lg:[text-shadow:none] font-[family-name:var(--font-script)] text-[1.55rem] font-semibold leading-[1.05] text-green-700 sm:text-[2rem] lg:text-[clamp(1.6rem,2.2vw,3.3rem)]">
                Real people.
                <br />
                <span className="pl-3">Local accountants.</span>
              </p>
              <svg viewBox="0 0 70 60" fill="none" stroke="#0e7a32" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="absolute left-1/2 top-[92%] hidden w-12 sm:block lg:w-[clamp(3rem,4.4vw,6.5rem)]">
                <path d="M4 8c22-4 46 6 56 40" />
                <path d="M50 42l10 8 4-12" />
              </svg>
            </div>
            {/* navy badge */}
            {/* drawn at 70% size (owner, 5 Oct 2026), anchored at its left edge so it stays in the same spot;
                laptops/desktops: 0.5cm right of and 0.55cm below its frame position (owner, 5 Oct 2026) */}
            <div className="absolute bottom-[8%] left-[5%] origin-bottom-left -rotate-[6deg] scale-[0.7] lg:bottom-auto lg:left-[9%] lg:top-[52%] lg:origin-top-left intro-badge">
              <p className="flex items-center gap-3 rounded-[1rem] bg-[#041f42] py-3 pl-4 pr-6 text-white shadow-[0_18px_36px_-14px_rgba(7,50,101,0.6)] lg:gap-[1.2vw] lg:rounded-[1.1vw] lg:py-[1vw] lg:pl-[1.4vw] lg:pr-[1.8vw]">
                <svg viewBox="0 0 24 24" aria-hidden className="h-8 w-8 shrink-0 lg:h-[clamp(2rem,2.6vw,3.8rem)] lg:w-[clamp(2rem,2.6vw,3.8rem)]">
                  <path d="M12 1.8c-4.4 0-7.9 3.4-7.9 7.7 0 5.6 7.9 13.3 7.9 13.3s7.9-7.7 7.9-13.3c0-4.3-3.5-7.7-7.9-7.7Z" fill="#fff" />
                  <circle cx="12" cy="9.5" r="3.1" fill="var(--navy-900)" />
                </svg>
                <span className="leading-tight">
                  <strong className="block text-[1.05rem] font-extrabold tracking-[-0.01em] lg:text-[clamp(1.05rem,1.45vw,2.15rem)]">One local accountant.</strong>
                  <span className="block text-[0.98rem] lg:text-[clamp(0.98rem,1.35vw,2rem)]">Matched to your needs.</span>
                  <span aria-hidden className="mt-1.5 block h-[3px] w-[70%] rounded-full bg-[#22d36b]" />
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* navy start bar straight under the words and photo (owner, 5 Oct 2026: replaces the three reassurance points);
            sits right against the bottom of the photo with no gap (owner, 6 Oct 2026); it overlaps the photo by 2px so
            no thin line of white shows at the seam, and has no button, just the two lines centred (owner, 6 Oct 2026) */}
        {/* (its extra 3mm top and bottom was taken off again, owner 6 Oct 2026: same height as the other bar) */}
        {/* owner, 6 Oct 2026: its bold words read "Less searching, a better match." */}
        {/* owner, 6 Oct 2026: on laptops and desktops the words start at the same left edge as "How it works"
            (".bar-align-how-row" in globals.css), like the other two navy bars; "Your needs, your area, your accountant." sits
            centred under the man in the photo above (".bar-sub-under-man", owner 6 Oct 2026) */}
        <StartBar button={false} title="Less searching, a better match." className="bar-align-how-row bar-sub-under-man relative z-10 -mt-[2px]" />
      </div>
    </section>
  );
}
