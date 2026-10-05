import Image from "next/image";
import { Pin } from "../ui/Icons";

/**
 * Full-width skyline panel for the city pages: the city's landmark picture shown at full strength in a rounded frame,
 * with a soft navy fade at the bottom and a glass label carrying the city name (the page's own wording, no new text).
 */
export default function CityShowcase({ city, image }: { city: string; image: { src: string; srcSmall: string; width: number; height: number } }) {
  return (
    <section aria-label={`${city} skyline`} className="px-4 py-6 md:py-10">
      <div className="group relative mx-auto h-[15rem] max-w-[1240px] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lg)] ring-1 ring-navy-900/10 sm:h-[20rem] md:h-[26rem] md:rounded-[2.5rem]">
        <Image
          src={image.src}
          alt={`${city} skyline and landmarks`}
          fill
          sizes="(min-width:1240px) 1240px, 100vw"
          className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/10 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-500 via-green-400 to-navy-500" />
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 md:bottom-8 md:left-8 md:right-8">
          <p className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/15 py-2 pl-2 pr-5 text-white shadow-lg backdrop-blur-md md:gap-4 md:py-2.5 md:pl-2.5 md:pr-7">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-green-600 text-white md:h-12 md:w-12">
              <Pin width={22} height={22} />
            </span>
            <span className="font-serif text-2xl font-semibold leading-none tracking-tight md:text-4xl">{city}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
