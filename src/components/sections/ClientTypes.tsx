import Image from "next/image";

/** Home page: "Matching accountants to every kind of client" — ten illustrative cards (not links, per the owner). */

const clients = [
  { name: "Families & Individuals", image: "/images/home/family-walk.webp", alt: "Family walking their dog together in a park", position: "50% 30%" },
  { name: "Small Business Owners", image: "/images/home/cafe-owner-man.webp", alt: "Smiling cafe owner in an apron behind his counter", position: "55% 30%" },
  { name: "Rural & Regional", image: "/images/home/rural-couple-fence.webp", alt: "Farmer in a hat leaning on a fence on his property", position: "30% 30%" },
  { name: "Retirees & SMSF", image: "/images/home/retirees-coast.webp", alt: "Retired couple walking along a coastal path", position: "50% 25%" },
  { name: "Professionals & Consultants", image: "/images/stock/general-woman-professional.webp", alt: "Professional woman in a suit standing outdoors", position: "50% 25%" },
  { name: "Tradies & Contractors", image: "/images/stock/industry-construction.webp", alt: "Tradies in hi-vis and hard hats on a building site", position: "40% 30%" },
  { name: "Health Professionals", image: "/images/stock/industry-medical.webp", alt: "Health professional reviewing notes on a tablet", position: "65% 30%" },
  { name: "Property Investors", image: "/images/home/couple-house.webp", alt: "Couple standing in front of their investment property", position: "50% 30%" },
  { name: "First-Time Taxpayers", image: "/images/stock/general-handshake.webp", alt: "Young man smiling as he shakes hands at a meeting", position: "70% 30%" },
  { name: "New Business Owners", image: "/images/home/cafe-owner-woman.webp", alt: "Smiling new business owner in an apron in her cafe", position: "50% 25%" },
];

export default function ClientTypes() {
  return (
    <section className="bg-[#fdfcf8] py-16 md:py-20">
      <div className="container-page home-wide">
        <div className="grid gap-4 md:grid-cols-2 md:items-start md:gap-10 lg:gap-[3vw]">
          <h2 className="text-[1.85rem] leading-[1.1]! text-navy-900 sm:text-[2.1rem] lg:text-[2.3rem] fs-h2">
            Matching accountants to{" "}
            <br className="hidden sm:inline" />
            <span className="text-green-700">every kind of client</span>
          </h2>
          <p className="max-w-md text-[0.98rem] leading-relaxed text-navy-900/85 md:pt-2 lg:max-w-[34vw] fs-body">
            We connect Australians from all walks of life with an accountant who understands their needs.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-[1.4vw]">
          {clients.map((c) => (
            <li
              key={c.name}
              className="overflow-hidden rounded-[1rem] bg-white shadow-[0_10px_28px_-14px_rgba(7,50,101,0.3)] transition duration-300 motion-reduce:transition-none hoverable:hover:-translate-y-1 hoverable:hover:shadow-[0_18px_36px_-14px_rgba(7,50,101,0.35)]"
            >
              <div className="relative aspect-[1.55/1]">
                <Image src={c.image} alt={c.alt} fill sizes="(min-width:1024px) 17vw, (min-width:640px) 31vw, 47vw" className="object-cover" style={{ objectPosition: c.position }} />
              </div>
              <div className="flex min-h-12 items-center justify-between gap-2 px-3 py-2.5 lg:px-[0.9vw] lg:py-[0.8vw]">
                <span className="text-[0.8rem] font-bold leading-tight text-navy-900 sm:text-[0.82rem] lg:whitespace-nowrap lg:text-[clamp(0.74rem,0.8vw,1.2rem)]">{c.name}</span>
                <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-green-600 text-white lg:h-[clamp(1.75rem,1.9vw,2.8rem)] lg:w-[clamp(1.75rem,1.9vw,2.8rem)]">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
