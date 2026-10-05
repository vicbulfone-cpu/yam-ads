// Decorative pieces for the home page below the hero (tablet and desktop only). They hold pictures and shapes only,
// never copy, so every word on the page still comes from the old site's content.
import Image from "next/image";
import Link from "next/link";
import { QUESTIONNAIRE_URL, ctaLabel } from "@/config/site.config";
import { getCtaBandWords } from "@/lib/site-data";
import { auFind, auGroupPhotos } from "./au-media";
import { ArrowRight, Check, Shield, Sparkle, Users } from "../ui/Icons";

/** Soft warm blobs and a dotted patch behind a section. */
export function WarmBlobs({ flip = false }: { flip?: boolean }) {
  return (
    <>
      <span aria-hidden className={`pointer-events-none absolute hidden h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgba(255,196,120,.32),transparent)] md:block ${flip ? "-left-40 top-10" : "-right-40 top-10"}`} />
      <span aria-hidden className={`pointer-events-none absolute hidden h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(closest-side,rgba(0,174,65,.12),transparent)] md:block ${flip ? "-right-32 bottom-0" : "-left-32 bottom-0"}`} />
    </>
  );
}

/** Three overlapping Australian photos with a few small floating icon badges (the "What is Your Accountant Match?" section). */
export function PhotoCollage() {
  const main = auFind(/family-beach/)?.file;
  const second = auFind(/tradie/)?.file;
  const third = auFind(/barista|cafe owner/)?.file;
  if (!main) return null;
  return (
    <div aria-hidden className="relative mx-auto hidden aspect-[5/6] w-full max-w-[30rem] md:block">
      <span className="absolute -right-6 top-8 h-[88%] w-[88%] rounded-[3rem] bg-gradient-to-br from-green-100 to-amber-100" />
      <div className="dots absolute -left-6 bottom-6 h-32 w-32 opacity-50" />
      <div className="absolute right-0 top-0 h-[78%] w-[80%] overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-[0_30px_60px_-22px_rgba(7,50,101,.5)]">
        <Image src={main} alt="" fill sizes="(min-width:1024px) 400px, 45vw" className="object-cover" />
      </div>
      {second && (
        <div className="absolute bottom-0 left-0 h-[44%] w-[52%] -rotate-3 overflow-hidden rounded-[2rem] border-[6px] border-white shadow-[0_24px_46px_-18px_rgba(7,50,101,.5)]">
          <Image src={second} alt="" fill sizes="260px" className="object-cover" />
        </div>
      )}
      {third && (
        <div className="absolute -top-4 left-2 h-24 w-24 overflow-hidden rounded-full border-[5px] border-white shadow-[0_16px_30px_-12px_rgba(7,50,101,.5)] lg:h-28 lg:w-28">
          <Image src={third} alt="" fill sizes="120px" className="object-cover" />
        </div>
      )}
      <span className="absolute bottom-[38%] right-[-0.75rem] grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white shadow-[0_14px_28px_-8px_rgba(0,135,58,.7)] ring-4 ring-white"><Check width={26} height={26} strokeWidth={3} /></span>
      <span className="absolute bottom-6 right-6 grid h-12 w-12 place-items-center rounded-full bg-navy-900 text-white shadow-lg ring-4 ring-white"><Shield width={22} height={22} /></span>
      <span className="absolute right-[44%] top-[2%] grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-white shadow-lg ring-4 ring-white"><Users width={20} height={20} /></span>
    </div>
  );
}

/**
 * A photo pair that sits BESIDE a section heading (tablet and desktop), in normal page flow so it can never overlap
 * the text or the content below. Takes unused photos from the "home" and "desk" groups first, then any unused Australian photo.
 * Renders nothing if no unused photo is left, so it can never repeat a picture.
 */
export function SideCollage({ flip = false, badge = "check", prefer = ["home", "desk"], tall = false }: { flip?: boolean; badge?: "check" | "shield" | "users"; prefer?: string[]; tall?: boolean }) {
  const photos = auGroupPhotos(prefer, 2);
  if (photos.length === 0) return null;
  const [main, second] = photos;
  const Badge = badge === "shield" ? Shield : badge === "users" ? Users : Check;
  return (
    <div aria-hidden className={`relative hidden w-full lg:block ${tall ? "mx-auto aspect-[4/5] max-w-[25rem]" : "aspect-[16/11] max-w-[27rem]"}`}>
      <span className={`absolute top-5 h-[86%] w-[80%] rounded-[2.25rem] bg-gradient-to-br from-amber-100 to-green-100 ${flip ? "left-0" : "right-0"}`} />
      <div className={`absolute top-0 h-[88%] w-[78%] overflow-hidden rounded-[2rem] border-[6px] border-white shadow-[0_26px_50px_-22px_rgba(7,50,101,.5)] ${flip ? "right-0" : "right-3"}`}>
        <Image src={main} alt="" fill sizes="(min-width:1280px) 340px, 30vw" className="object-cover" />
      </div>
      {second && (
        <div className={`absolute bottom-0 h-[50%] w-[40%] overflow-hidden rounded-[1.5rem] border-[5px] border-white shadow-[0_20px_40px_-16px_rgba(7,50,101,.5)] ${flip ? "left-0 rotate-2" : "left-0 -rotate-3"}`}>
          <Image src={second} alt="" fill sizes="180px" className="object-cover" />
        </div>
      )}
      <span className={`absolute bottom-3 grid h-11 w-11 place-items-center rounded-full bg-green-600 text-white shadow-[0_12px_24px_-8px_rgba(0,135,58,.7)] ring-4 ring-white ${flip ? "left-[38%]" : "left-[40%]"}`}><Badge width={20} height={20} strokeWidth={2.6} /></span>
    </div>
  );
}

/**
 * Fills the empty space under the match box on the home page (desktop): three photos in a tidy mosaic, nothing overlapping.
 * Renders nothing if fewer than two unused photos are left.
 */
export function HeroPeople() {
  const photos = auGroupPhotos(["home", "desk", "life"], 3);
  if (photos.length < 2) return null;
  const [a, b, c] = photos;
  return (
    <div aria-hidden className="relative mt-9 hidden lg:block">
      <span className="absolute -inset-x-3 -inset-y-3 rounded-[2.5rem] bg-gradient-to-br from-amber-100/80 via-amber-50 to-green-100/70" />
      <div className="relative grid grid-cols-[1.1fr_1fr] gap-3.5">
        <div className="relative row-span-2 min-h-[18rem] overflow-hidden rounded-[1.75rem] border-[5px] border-white shadow-[0_22px_44px_-20px_rgba(7,50,101,.5)]">
          <Image src={a} alt="" fill sizes="(min-width:1280px) 290px, 26vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border-[5px] border-white shadow-[0_18px_36px_-18px_rgba(7,50,101,.5)]">
          <Image src={b} alt="" fill sizes="(min-width:1280px) 250px, 22vw" className="object-cover" />
        </div>
        {c ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border-[5px] border-white shadow-[0_18px_36px_-18px_rgba(7,50,101,.5)]">
            <Image src={c} alt="" fill sizes="(min-width:1280px) 250px, 22vw" className="object-cover" />
          </div>
        ) : (
          <span />
        )}
      </div>
      <span className="absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full bg-green-600 text-white shadow-[0_10px_20px_-8px_rgba(0,135,58,.7)] ring-4 ring-white"><Check width={18} height={18} strokeWidth={2.8} /></span>
      <span className="absolute -bottom-3 left-8 grid h-10 w-10 place-items-center rounded-full bg-navy-900 text-white shadow-lg ring-4 ring-white"><Shield width={18} height={18} /></span>
    </div>
  );
}

/**
 * A warm, slim call-to-action strip in the middle of the home page (tablet and desktop). Uses the site's existing
 * "Ready to find your accountant?" wording; the goal of the page is to get visitors into the questionnaire.
 */
export function MidCta() {
  const w = getCtaBandWords();
  if (!w?.title) return null;
  return (
    <section className="relative hidden overflow-hidden bg-white py-4 md:block">
      <div className="container-page">
        <div className="relative flex items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-navy-900 via-navy-800 to-[#0b5a63] px-10 py-9 text-white shadow-[0_30px_60px_-28px_rgba(7,50,101,.7)] lg:px-14">
          <span aria-hidden className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-green-500/30 blur-3xl" />
          <span aria-hidden className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
          <span aria-hidden className="relative hidden h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/25 lg:grid"><Sparkle width={30} height={30} className="text-green-300" /></span>
          <div className="relative flex-1">
            <p className="font-serif text-[1.65rem] font-semibold leading-tight lg:text-[1.9rem]">{w.title}</p>
            {w.text && <p className="mt-1.5 text-[1.02rem] text-navy-100">{w.text}</p>}
          </div>
          <div className="relative flex shrink-0 flex-col items-center gap-2">
            <Link href={QUESTIONNAIRE_URL} className="btn btn-light btn-lg">
              <span>{w.label ?? ctaLabel}</span>
              <span className="btn-arrow !bg-green-600 !text-white"><ArrowRight width={16} height={16} strokeWidth={2.5} /></span>
            </Link>
            {w.note && <span className="text-[0.8rem] font-semibold text-green-200">{w.note}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
