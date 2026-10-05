import Image from "next/image";
import Link from "next/link";
import { QUESTIONNAIRE_URL } from "@/config/site.config";
import HeroGap from "./HeroGap";

/**
 * Home page: "What is Your Accountant Match?"
 * Left: heading, subtitle, two paragraphs and the main call to action.
 * Right: an overlapping collage of three photos with soft decorative shapes and dots.
 * Positions in the collage are percentages so it scales with the column width.
 */

/** One collage photo: rounded, white border, soft shadow. */
function CollagePhoto({
  src,
  alt,
  className,
  sizes,
  position = "center",
}: {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  position?: string;
}) {
  return (
    <div
      className={`absolute overflow-hidden rounded-[1.25rem] border-[5px] border-white bg-white shadow-[0_18px_40px_-14px_rgba(7,50,101,0.35)] ${className}`}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: position }} />
    </div>
  );
}

export default function WhatIsYAM() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fb_100%)] pt-16 pb-[calc(4rem+1cm)] md:pt-20 md:pb-[calc(5rem+1cm)] lg:pt-[clamp(5rem,5.5vw,8rem)] lg:pb-[calc(clamp(5rem,5.5vw,8rem)+1cm)]">
      <HeroGap />
      {/* laptop and desktop: the section fills 85% of the screen width (owner, 4 Oct 2026) */}
      <div className="container-page grid items-center gap-12 lg:w-[85vw] lg:max-w-none lg:grid-cols-[1.12fr_1fr] lg:gap-[3vw] lg:px-0">
        {/* Text column */}
        <div>
          <h2 className="text-[1.85rem] leading-[1.1]! text-navy-900 sm:text-[2.1rem] xl:whitespace-nowrap lg:text-[clamp(2.2rem,2.75vw,4.2rem)]">
            What is <span className="text-green-700">Your Accountant Match?</span>
          </h2>
          <p className="mt-2 text-[1rem] font-bold leading-snug text-navy-900 lg:mt-[0.6vw] lg:text-[clamp(1.05rem,1.3vw,1.95rem)]">
            A simple way to connect with a local accountant who&rsquo;s right for you.
          </p>
          <p className="mt-6 lg:mt-[1.8vw] max-w-[34rem] text-[1rem] leading-[1.7] text-body lg:max-w-[40vw] lg:text-[clamp(1.05rem,1.18vw,1.75rem)]">
            Your Accountant Match takes the guesswork out of finding the right accountant. We match you with one
            trusted local accountant based on your location and specific needs &mdash; not a list of firms.
          </p>
          <p className="mt-5 lg:mt-[1.4vw] max-w-[34rem] text-[1rem] leading-[1.7] text-body lg:max-w-[40vw] lg:text-[clamp(1.05rem,1.18vw,1.75rem)]">
            Whether you need help with your personal tax return, business accounting, SMSF or setting up a new
            company, we&rsquo;ll connect you with an accountant from our national partner network who understands
            your situation.
          </p>
          <div className="mt-8 lg:mt-[2.4vw]">
            <Link href={QUESTIONNAIRE_URL} className="btn btn-primary btn-lg lg:min-h-[clamp(3.5rem,3.6vw,5rem)] lg:px-[clamp(1.9rem,2.1vw,3rem)] lg:text-[clamp(1.0625rem,1.15vw,1.6rem)]">
              Find My Accountant
              <span className="btn-arrow" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Photo collage */}
        <div className="relative mx-auto aspect-[660/580] w-[65%] max-w-[390px] lg:max-w-none" aria-label="People who have been matched with an accountant" role="group">
          {/* two photos: the larger one top left, the smaller one overlapping its bottom right corner */}
          <CollagePhoto
            src="/images/home/tradie-van.webp"
            alt="Smiling tradesman standing at the side door of his work van"
            className="left-0 top-0 h-[76%] w-[74%]"
            sizes="(min-width: 1024px) 20vw, 47vw"
            position="50% 35%"
          />
          <CollagePhoto
            src="/images/home/woman-laptop-home.webp"
            alt="Smiling woman working on her laptop at home"
            className="bottom-0 right-0 z-10 h-[50%] w-[50%]"
            sizes="(min-width: 1024px) 13vw, 31vw"
            position="40% 30%"
          />
        </div>
      </div>
    </section>
  );
}
