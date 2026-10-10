"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { BIZ_MATCH_KEY } from "@/content/business-questionnaire";
import { ENQUIRY_SENT as E } from "@/content/enquiry-sent";
import { Bars, Check, ListCheck, Mail } from "../ui/Icons";

/**
 * The page after every questionnaire (/match), owner 11 Oct 2026: an honest "your enquiry has been sent" confirmation in
 * the match page's style (".mp-" in ads.css), in place of the sample accountant, until GoHighLevel sends the real match
 * back (BizMatchPage.tsx is kept for that). The customer's own answers come from this browser tab (saved by the
 * questionnaire); with none (page opened directly) it still reads well. Wording: src/content/enquiry-sent.ts.
 */
type Saved = {
  name: string; email: string; emailMe: boolean; mode: string;
  place: { postcode: string; suburb: string; state: string };
  services: { category: string; items: string[] }[];
};

const noSubscribe = () => () => {};
function readSaved() {
  try { return sessionStorage.getItem(BIZ_MATCH_KEY); } catch { return null; }
}
const FOOT_LINKS = [{ text: "Contact", href: "/contact" }, { text: "Privacy", href: "/privacy" }, { text: "Terms", href: "/terms" }];

export default function EnquirySentPage() {
  const raw = useSyncExternalStore(noSubscribe, readSaved, () => null);
  const saved = useMemo(() => {
    try { return raw ? (JSON.parse(raw) as Saved) : null; } catch { return null; }
  }, [raw]);

  const firstWord = saved?.name?.trim().split(/\s+/)[0] ?? "";
  const first = firstWord ? firstWord[0].toUpperCase() + firstWord.slice(1) : "";
  const area = saved?.place?.suburb || saved?.place?.postcode || "";
  const place = saved?.place ? [saved.place.suburb, saved.place.state, saved.place.postcode].filter(Boolean).join(" ") : "";
  const selected = saved?.services.flatMap((g) => g.items) ?? [];
  const details = [
    place && { label: E.details.area, value: place },
    saved?.mode && { label: E.details.meet, value: saved.mode },
    saved?.email && { label: E.details.email, value: saved.email },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="mp">
      <div className="bz-wrap mp-wrap">
        <header className="mp-head">
          <h1 className="mp-h1">{first ? E.titleLead.replace("{first}", first) : E.titleLeadNoName} <span className="text-[#0e7a32]">{E.titleEm}</span></h1>
          <p className="mp-sub">{area ? E.sub.replace("{area}", area) : E.subNoArea}</p>
          {saved?.emailMe && saved.email && <p className="mp-emailed"><Mail aria-hidden width={16} height={16} />{E.emailed.replace("{email}", saved.email)}</p>}
        </header>

        <div className="mp-grid">
          {/* what happens next */}
          <section className="mp-panel">
            <h2 className="mp-panel-title"><Bars aria-hidden width={26} height={26} className="text-[#0e7a32]" />{E.nextTitle}</h2>
            <ol className="mp-checks">
              {E.steps.map((s, i) => (
                <li key={s.title}>
                  <span aria-hidden className="mp-tick mp-step-no">{i + 1}</span>
                  <span><strong>{s.title}</strong><span className="block">{s.text}</span></span>
                </li>
              ))}
            </ol>
            <p className="mt-6"><Link href="/" className="mp-btn">{E.homeLabel}</Link></p>
          </section>

          <div className="mp-side">
            {selected.length > 0 && (
              <section className="mp-panel is-mint">
                <h2 className="mp-panel-title"><ListCheck aria-hidden width={26} height={26} className="text-[#0e7a32]" />{E.selectedTitle}</h2>
                <ul className="mp-checks">
                  {selected.map((s) => <li key={s}><span aria-hidden className="mp-tick"><Check width={14} height={14} strokeWidth={3.4} /></span><span>{s}</span></li>)}
                </ul>
              </section>
            )}
            {details.length > 0 && (
              <section className="mp-panel">
                <h2 className="mp-panel-title">{E.detailsTitle}</h2>
                <ul className="mp-checks">
                  {details.map((d) => <li key={d.label}><span><strong>{d.label}</strong><span className="block">{d.value}</span></span></li>)}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      <footer className="mp-foot">
        <div className="bz-wrap mp-foot-in">
          <p>{E.disclaimer}</p>
          <p className="mp-foot-links">
            <span>© {new Date().getFullYear()} Your Accountant Match</span>
            {FOOT_LINKS.map((l) => <a key={l.href} href={l.href} data-info="">{l.text}</a>)}
          </p>
        </div>
      </footer>
    </main>
  );
}
