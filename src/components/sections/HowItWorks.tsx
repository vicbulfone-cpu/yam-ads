import Image from "next/image";
import Link from "next/link";

/** Home page: "Your accountant match, made simple" — three numbered photo cards joined by arrows. */

const steps = [
  {
    title: ["Tell us what", "you need"],
    text: "Complete our short 60-second questionnaire.",
    image: "/images/stock/general-home-office.webp",
    alt: "Woman smiling as she fills in a short questionnaire on her laptop",
    position: "50% 30%",
  },
  {
    title: ["We find", "your match"],
    text: "We connect you with one local accountant from our trusted network.",
    image: "/images/home/couple-laptop.webp",
    alt: "Man smiling at his laptop while reviewing his match",
    position: "85% 35%",
  },
  {
    title: ["You get", "in touch"],
    text: "The matched accountant will contact you directly to discuss your needs.",
    image: "/images/au/business-tradie-electricians.webp",
    alt: "Tradie in a hi-vis shirt at work on site",
    position: "65% 35%",
  },
];

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 32 16" width="32" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d="M2 8h27M22 2l7 6-7 6" />
  </svg>
);

export default function HowItWorks() {
  return (
    <section className="bg-[#f7f9fb] pt-[calc(4rem+2cm)] pb-16 md:pt-[calc(5rem+2cm)] md:pb-20">
      <div className="container-page home-wide grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-[3vw]">
        <div>
          <p className="inline-flex rounded-full bg-[#fde9d4] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#e07b1a] fs-eyebrow">How it works</p>
          <h2 className="mt-5 text-[1.85rem] leading-[1.1]! text-navy-900 sm:text-[2.1rem] lg:text-[2.3rem] fs-h2">
            Your accountant match,
            <br />
            <span className="text-green-700">made simple</span>
          </h2>
          <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-navy-900/85 lg:max-w-[30vw] fs-body">
            In just a few quick steps, we&rsquo;ll match you with a local accountant who has the right expertise for your needs.
          </p>
          <Link
            href="/how-it-works"
            className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-green-100 bg-white px-7 text-[0.95rem] font-bold text-green-700 fs-sm lg:min-h-[clamp(3rem,3.3vw,4.6rem)] lg:px-[clamp(1.75rem,1.9vw,2.8rem)] shadow-[0_6px_18px_-8px_rgba(7,50,101,0.25)] transition hoverable:hover:border-green-600"
          >
            See how it works <Arrow className="h-3.5 w-5" />
          </Link>
        </div>

        <ol className="grid gap-5 sm:grid-cols-3 sm:gap-0">
          {steps.map((s, i) => (
            <li key={s.title.join(" ")} className="relative flex sm:items-stretch">
              <div className="flex-1 rounded-[1.4rem] bg-white p-3 shadow-[0_14px_34px_-16px_rgba(7,50,101,0.28)] sm:mx-3 lg:mx-4">
                <div className="relative aspect-[1.7/1] sm:aspect-[1/0.95] overflow-hidden rounded-[1rem]">
                  <Image src={s.image} alt={s.alt} fill sizes="(min-width:1024px) 15vw, (min-width:640px) 30vw, 90vw" className="object-cover" style={{ objectPosition: s.position }} />
                </div>
                <span className="absolute left-1 top-1 grid h-11 w-11 place-items-center rounded-full bg-green-600 text-lg font-extrabold lg:h-[clamp(2.75rem,2.9vw,4.2rem)] lg:w-[clamp(2.75rem,2.9vw,4.2rem)] fs-card text-white ring-4 ring-white sm:left-3 lg:left-4" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-4 px-2 text-[1.1rem] leading-[1.15]! text-navy-900 fs-card">
                  {s.title[0]}
                  <br />
                  {s.title[1]}
                </h3>
                <p className="mt-2 px-2 pb-2 text-[0.85rem] leading-snug text-navy-900/80 fs-sm">{s.text}</p>
              </div>
              {i < steps.length - 1 && (
                <Arrow className="absolute -right-4 top-[30%] z-10 hidden h-4 w-8 text-green-600 sm:block lg:-right-[1.4vw] lg:w-[2.6vw]" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
