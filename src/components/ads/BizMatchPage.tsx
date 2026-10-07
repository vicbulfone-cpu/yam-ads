"use client";

import Image from "next/image";
import { useMemo, useSyncExternalStore } from "react";
import { BIZ_MATCH, BIZ_MATCH_KEY } from "@/content/business-questionnaire";
import { PERSONAL_MATCH } from "@/content/personal-questionnaire";
import { SMSF_MATCH } from "@/content/smsf-questionnaire";
import { REG_MATCH } from "@/content/registration-questionnaire";
import { SAMPLE_MATCH_PERSONAL, SAMPLE_MATCH_REGISTRATION, SAMPLE_MATCH_SMSF, type MatchDetails } from "@/content/sample-match";
import DataCredit from "../ui/DataCredit";
import { Bars, Check, Clock, External, Globe, Handshake, ListCheck, Mail, Phone, Pin } from "../ui/Icons";

/**
 * The customer's match page (/match), shown after every questionnaire. Laid out as the owner's "match page" design
 * (7 Oct 2026): headline, the accountant's card (photo, details, contact buttons, service chips) beside "Your selected
 * services" and "Why this looks like a good fit", then a "Ready to take the next step?" band. The accountant's details
 * come from the server (the sample accountant until GoHighLevel is connected); the customer's own answers come from
 * this browser tab. Empty fields are hidden. Styles: ".mp-" in ads.css.
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
const FOOT_LINKS = [{ text: "Contact", href: "/contact" }, { text: "Privacy", href: "/privacy" }, { text: "Terms", href: "/terms" }];
const tel = (p: string) => p.replace(/[^\d+]/g, "");
const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function BizMatchPage({ match: serverMatch, isSample }: { match: MatchDetails; isSample: boolean }) {
  // the customer's answers, saved in this browser tab by the questionnaire (nothing on the server render)
  const raw = useSyncExternalStore(noSubscribe, readSaved, () => null);
  const saved = useMemo(() => {
    try { return raw ? (JSON.parse(raw) as Saved) : null; } catch { return null; }
  }, [raw]);

  // wording (and, until GoHighLevel is connected, the sample accountant) for the questionnaire the customer came from
  const adType = saved?.adType;
  const WORDS = { personal: PERSONAL_MATCH, smsf: SMSF_MATCH, registration: REG_MATCH } as const;
  const SAMPLES = { personal: SAMPLE_MATCH_PERSONAL, smsf: SAMPLE_MATCH_SMSF, registration: SAMPLE_MATCH_REGISTRATION } as const;
  const key = adType && adType in WORDS ? (adType as keyof typeof WORDS) : null;
  const M = key ? { ...BIZ_MATCH, ...WORDS[key] } : BIZ_MATCH;
  const match = isSample && key ? SAMPLES[key] : serverMatch;

  const first = match.name.trim().split(/\s+/)[0];
  const fill = (t: string) => t.replaceAll("{first}", first).replaceAll("{years}", String(match.years ?? ""));
  const selected = saved?.services.flatMap((g) => g.items) ?? [];
  const contactHref = match.phone ? `tel:${tel(match.phone)}` : match.email ? `mailto:${match.email}` : null;

  return (
    <main className="mp">
      <div className="bz-wrap mp-wrap">
        <header className="mp-head">
          {isSample && <p className="mp-tag">{M.sampleTag[0]} <span aria-hidden>•</span> {M.sampleTag[1]}</p>}
          <h1 className="mp-h1">{M.titleLead} <span className="text-[#0e7a32]">{M.titleEm}</span></h1>
          <p className="mp-sub">{M.sub}</p>
          {saved?.emailMe && <p className="mp-emailed"><Mail aria-hidden width={16} height={16} />{M.emailed.replace("{email}", saved.email)}</p>}
        </header>

        <div className="mp-grid">
          {/* the accountant */}
          <article className="mp-card">
            <div className="mp-card-top">
              {match.photo && (
                <div className="mp-photo">
                  <Image src={match.photo} alt={`${match.name}, ${match.firm}`} fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 40vw, 90vw" className="object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="mp-name">{match.name}</h2>
                <p className="mp-firm">{match.firm}</p>
                {(match.specialty || match.location) && (
                  <p className="mp-meta">{[match.specialty, match.location].filter(Boolean).join(" • ")}</p>
                )}
                {match.years != null && (
                  <p className="mp-exp-row">
                    <span className="mp-exp">{fill(M.experience)}</span>
                    {isSample && <span className="mp-claim">{M.sampleClaim}</span>}
                  </p>
                )}
                {match.blurb && <p className="mp-blurb">{match.blurb}</p>}

                <ul className="mp-contact">
                  {match.phone && <li><Phone aria-hidden width={19} height={19} /><a href={`tel:${tel(match.phone)}`} className="font-bold">{match.phone}</a></li>}
                  {match.email && <li><Mail aria-hidden width={19} height={19} /><a href={`mailto:${match.email}`}>{match.email}</a></li>}
                  {match.website && <li><Globe aria-hidden width={19} height={19} /><a href={match.website} target="_blank" rel="noopener noreferrer">{host(match.website)}</a></li>}
                  {match.address && <li><Pin aria-hidden width={19} height={19} /><span>{match.address}</span></li>}
                  {match.hours && <li><Clock aria-hidden width={19} height={19} /><span>{match.hours}</span></li>}
                </ul>

                {(match.phone || match.email) && (
                  <div className="mp-buttons">
                    {match.phone && <a href={`tel:${tel(match.phone)}`} className="mp-btn is-primary"><Phone aria-hidden width={20} height={20} />{fill(M.callLabel)}</a>}
                    {match.email && <a href={`mailto:${match.email}`} className="mp-btn"><Mail aria-hidden width={20} height={20} />{fill(M.emailLabel)}</a>}
                  </div>
                )}
                {match.website && (
                  <a href={match.website} target="_blank" rel="noopener noreferrer" className="mp-web">{M.webLabel}<External aria-hidden width={16} height={16} /></a>
                )}
              </div>
            </div>

            {!!match.services?.length && (
              <ul className="mp-chips">{match.services.map((s) => <li key={s}>{s}</li>)}</ul>
            )}
            {isSample && <p className="mp-sample">{M.sample}</p>}
          </article>

          <div className="mp-side">
            {selected.length > 0 && (
              <section className="mp-panel is-mint">
                <h2 className="mp-panel-title"><ListCheck aria-hidden width={26} height={26} className="text-[#0e7a32]" />{M.selectedTitle}</h2>
                <ul className="mp-checks">
                  {selected.map((s) => <li key={s}><span aria-hidden className="mp-tick"><Check width={14} height={14} strokeWidth={3.4} /></span><span>{s}</span></li>)}
                </ul>
              </section>
            )}

            <section className="mp-panel">
              <h2 className="mp-panel-title"><Bars aria-hidden width={26} height={26} className="text-[#0e7a32]" />{M.fitTitle}</h2>
              <ul className="mp-checks">
                {[M.fit.area, M.fit.services, ...(match.years != null ? [M.fit.experience] : [])].map((f) => (
                  <li key={f.title}><span aria-hidden className="mp-tick"><Check width={14} height={14} strokeWidth={3.4} /></span><span><strong>{f.title}</strong><span className="block">{fill(f.text)}</span></span></li>
                ))}
              </ul>
              <p className="mp-note">{M.fitNote}</p>
            </section>
          </div>
        </div>

        {/* next step band */}
        <section className="mp-next">
          <span aria-hidden className="mp-next-icon"><Handshake width={46} height={46} strokeWidth={1.6} /></span>
          <div className="mp-next-text">
            <h2>{M.nextTitle}</h2>
            <p className="font-semibold text-navy-900">{M.nextLead}</p>
            <p>{M.nextText}</p>
          </div>
          {contactHref && <a href={contactHref} className="mp-btn is-primary mp-next-btn"><Phone aria-hidden width={20} height={20} />{fill(M.contactDirect)}</a>}
        </section>
      </div>

      {/* slim footer line (owner's design): the disclaimer on the left, © and the information links (they open in the popup) on the right */}
      <footer className="mp-foot">
        <div className="bz-wrap mp-foot-in">
          <p>{M.disclaimer}</p>
          <p className="mp-foot-links">
            <span>© {new Date().getFullYear()} Your Accountant Match</span>
            {FOOT_LINKS.map((l) => <a key={l.href} href={l.href} data-info="">{l.text}</a>)}
          </p>
        </div>
        <p className="bz-wrap mp-credit"><DataCredit /></p>
      </footer>
    </main>
  );
}

