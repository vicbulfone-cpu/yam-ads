"use client";

import Image from "next/image";
import { useMemo, useSyncExternalStore } from "react";
import { BIZ_MATCH, BIZ_MATCH_KEY } from "@/content/business-questionnaire";
import { PERSONAL_MATCH } from "@/content/personal-questionnaire";
import { SMSF_MATCH } from "@/content/smsf-questionnaire";
import { REG_MATCH } from "@/content/registration-questionnaire";
import { SAMPLE_MATCH_PERSONAL, SAMPLE_MATCH_REGISTRATION, SAMPLE_MATCH_SMSF, type MatchDetails } from "@/content/sample-match";
import { ArrowRight, Check, Mail, Phone, Pin, Sparkle } from "../ui/Icons";

/**
 * The customer's match page (/match), shown after every ad questionnaire (business, personal, ...). The accountant's details come from the
 * server (the sample accountant until GoHighLevel is connected); the customer's own answers come from this browser tab.
 * Empty fields are hidden. Wording is neutral (no claims about why this accountant was chosen).
 */
type Saved = {
  adType?: string; leadId: string; name: string; email: string; emailMe: boolean; mode: string;
  place: { postcode: string; suburb: string; state: string };
  services: { category: string; items: string[] }[];
};

const noSubscribe = () => () => {};
function readSaved() {
  try { return sessionStorage.getItem(BIZ_MATCH_KEY); } catch { return null; } // storage switched off: the match still shows
}
const tel = (p: string) => p.replace(/[^\d+]/g, "");
const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function BizMatchPage({ match: serverMatch, isSample }: { match: MatchDetails; isSample: boolean }) {
  // the customer's answers, saved in this browser tab by the questionnaire (nothing on the server render)
  const raw = useSyncExternalStore(noSubscribe, readSaved, () => null);
  const saved = useMemo(() => {
    try { return raw ? (JSON.parse(raw) as Saved) : null; } catch { return null; }
  }, [raw]);

  const firstWord = saved?.name.trim().split(/\s+/)[0];
  const firstName = firstWord ? firstWord[0].toUpperCase() + firstWord.slice(1) : undefined;
  // wording (and, until GoHighLevel is connected, the sample accountant) for the questionnaire the customer came from
  const adType = saved?.adType;
  const WORDS = { personal: PERSONAL_MATCH, smsf: SMSF_MATCH, registration: REG_MATCH } as const;
  const SAMPLES = { personal: SAMPLE_MATCH_PERSONAL, smsf: SAMPLE_MATCH_SMSF, registration: SAMPLE_MATCH_REGISTRATION } as const;
  const key = adType && adType in WORDS ? (adType as keyof typeof WORDS) : null;
  const M = key ? { ...BIZ_MATCH, ...WORDS[key] } : BIZ_MATCH;
  const match = isSample && key ? SAMPLES[key] : serverMatch;

  return (
    <main className="bz-match">
      <section className="bz-match-hero">
        <div aria-hidden className="absolute inset-0 opacity-70 [background:radial-gradient(55%_120%_at_90%_-10%,rgba(0,174,65,.5),transparent_60%),radial-gradient(45%_100%_at_0%_110%,rgba(26,90,166,.8),transparent_60%)]" />
        <div aria-hidden className="dots absolute inset-0 opacity-15 [filter:invert(1)]" />
        <div className="bz-wrap relative pb-28 pt-10 text-center text-white sm:pt-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-green-200">
            <Sparkle aria-hidden width={14} height={14} /> {M.eyebrow}
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-[3rem]">{M.title}</h1>
          {firstName && <p className="mt-3 text-lg font-semibold text-green-200 sm:text-xl">{M.hello.replace("{name}", firstName)}</p>}
          <p className="mx-auto mt-2 max-w-2xl text-[1.02rem] text-navy-100">{M.sub}</p>
          {saved?.emailMe && <p className="mx-auto mt-2 inline-flex items-center gap-2 text-sm text-white/85"><Mail aria-hidden width={16} height={16} />{M.emailed.replace("{email}", saved.email)}</p>}
        </div>
      </section>

      <div className="bz-wrap relative -mt-20 grid gap-6 pb-14 lg:grid-cols-[1.35fr_1fr]">
        {/* the accountant */}
        <article className="bz-match-card">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {match.photo && (
              <Image src={match.photo} alt={`${match.name}, ${match.firm}`} width={176} height={176} className="h-32 w-32 shrink-0 rounded-3xl object-cover shadow-[0_18px_40px_-18px_rgba(7,50,101,.55)] ring-4 ring-white sm:h-40 sm:w-40" />
            )}
            <div className="min-w-0">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-green-700">{M.aboutTitle}</p>
              <h2 className="mt-1 text-[1.9rem] font-extrabold leading-tight tracking-[-0.03em] text-navy-900">{match.name}</h2>
              <p className="text-lg font-semibold text-green-700">{match.firm}</p>
            </div>
          </div>
          {match.blurb && <p className="mt-5 text-[1.02rem] leading-relaxed text-ink/85">{match.blurb}</p>}

          {(match.phone || match.email || match.website) && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-navy-900">{M.contactTitle}</h3>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {match.phone && (
                  <a href={`tel:${tel(match.phone)}`} className="bz-contact is-primary"><Phone aria-hidden width={20} height={20} /><span><span className="bz-contact-k">{M.callLabel}</span>{match.phone}</span></a>
                )}
                {match.email && (
                  <a href={`mailto:${match.email}`} className="bz-contact"><Mail aria-hidden width={20} height={20} /><span><span className="bz-contact-k">{M.emailLabel}</span>{match.email}</span></a>
                )}
                {match.website && (
                  <a href={match.website} target="_blank" rel="noopener noreferrer" className="bz-contact"><ArrowRight aria-hidden width={20} height={20} /><span><span className="bz-contact-k">{M.webLabel}</span>{host(match.website)}</span></a>
                )}
              </div>
            </div>
          )}

          {!!match.services?.length && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-navy-900">{M.specialtiesTitle}</h3>
              <ul className="flex flex-wrap gap-2">
                {match.services.map((s) => <li key={s} className="rounded-full bg-green-50 px-3.5 py-1.5 text-sm font-semibold text-green-800 ring-1 ring-green-200">{s}</li>)}
              </ul>
            </div>
          )}
          {isSample && <p className="mt-6 rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900 ring-1 ring-amber-200">{M.sample}</p>}
        </article>

        <div className="grid content-start gap-6">
          {saved && (
            <section className="bz-match-side">
              <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy-900">{M.servicesTitle}</h2>
              <ul className="mt-3 space-y-3">
                {saved.services.map((g) => (
                  <li key={g.category}>
                    <p className="text-sm font-bold text-green-700">{g.category}</p>
                    <ul className="mt-1 space-y-1">
                      {g.items.map((it) => <li key={it} className="flex gap-2 text-[0.93rem] leading-snug text-ink/85"><Check aria-hidden width={16} height={16} strokeWidth={3} className="mt-0.5 shrink-0 text-green-600" />{it}</li>)}
                    </ul>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 grid gap-1.5 border-t border-line pt-3 text-sm">
                {saved.mode && <div className="flex gap-2"><dt className="font-semibold text-navy-900">{M.workMode}</dt><dd className="text-ink/80">{saved.mode}</dd></div>}
                <div className="flex gap-2"><dt className="font-semibold text-navy-900">{M.area}</dt><dd className="inline-flex items-center gap-1 text-ink/80"><Pin aria-hidden width={14} height={14} />{saved.place.suburb} {saved.place.state} {saved.place.postcode}</dd></div>
              </dl>
            </section>
          )}

          <section className="bz-match-side">
            <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy-900">{M.nextTitle}</h2>
            <ol className="mt-3 space-y-3">
              {M.next.map((n, i) => (
                <li key={n} className="flex gap-3 text-[0.95rem] leading-snug text-ink/85">
                  <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>{n}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <p className="text-center text-sm text-muted lg:col-span-2">{M.disclaimer}</p>
      </div>
    </main>
  );
}
