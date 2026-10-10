// Receives a finished questionnaire, checks it, gives it a leadId and passes it to GoHighLevel: through the sub-account's
// Private Integration token (GHL_PRIVATE_TOKEN + GHL_LOCATION_ID, src/lib/ghl.ts) when set, otherwise its inbound webhook
// (GHL_INBOUND_WEBHOOK_URL). With neither, or MOCK_GHL=true, it only logs the lead so the flow works locally.
// Spam protection: a hidden "website" field that people never fill in, plus a per-visitor limit per minute.
import { ghlConfigured, sendLeadToGhl } from "@/lib/ghl";

const LIMIT = Number(process.env.LEAD_RATE_LIMIT_PER_MINUTE || 5);
const hits = new Map<string, number[]>(); // visitor address → times of recent submissions (per server instance)

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE = /^(?:\+?61|0)4\d{8}$/;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const leadId = crypto.randomUUID();
  // a bot filled the hidden field: pretend it worked, send nothing
  if (str(body.website)) return Response.json({ ok: true, leadId });

  const name = str(body.name, 120);
  const email = str(body.email, 200).toLowerCase();
  const phone = str(body.phone, 30).replace(/[\s()-]/g, "");
  const postcode = str(body.postcode, 4);
  if (!name || !EMAIL.test(email) || !MOBILE.test(phone) || !/^\d{4}$/.test(postcode)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const tracking = (body.tracking ?? {}) as Record<string, unknown>;
  // Paid only when the visit came from a Google Ads click (a gclid, or gbraid / wbraid on some iPhone traffic). A visitor
  // who reaches an ad page some other way (e.g. the home page footer links) stays Organic; adType still says which
  // questionnaire was used (owner, 7 Oct 2026).
  const paid = Boolean(str(tracking.gclid) || str(tracking.gbraid) || str(tracking.wbraid));
  const lead = {
    leadId,
    name,
    phone,
    email,
    postcode,
    suburb: str(body.suburb, 80),
    state: str(body.state, 3),
    services: Array.isArray(body.services) ? body.services.map((s) => str(s, 200)).filter(Boolean).slice(0, 60) : [],
    answers: body.answers ?? {},
    workMode: str(body.workMode, 40),
    emailMatchDetails: body.emailMatchDetails === true,
    matchPageUrl: str(body.matchPageUrl, 300),
    leadSource: (paid ? "Paid" : "Organic") as "Paid" | "Organic",
    adType: str(body.adType, 40),
    // which questionnaire was filled in (business, personal, smsf, registration), whether from an ad page or the main site
    questionnaire: str(body.questionnaire, 40),
    campaign: str(tracking.utm_campaign, 200),
    gclid: str(tracking.gclid, 300),
    gbraid: str(tracking.gbraid, 300),
    wbraid: str(tracking.wbraid, 300),
    ref: str(tracking.ref, 200),
    utm: Object.fromEntries(Object.entries(tracking).filter(([k]) => k.startsWith("utm_")).map(([k, v]) => [k, str(v, 200)])),
    visitor: body.visitor ?? null,
    submittedAt: new Date().toISOString(),
  };

  // GHL sub-account through its Private Integration token (owner, 10 Oct 2026); the inbound webhook below stays as a fallback
  if (ghlConfigured() && process.env.MOCK_GHL !== "true") {
    try {
      const { contactId, opportunityId } = await sendLeadToGhl(lead);
      console.log("[lead] sent to GHL:", JSON.stringify({ leadId, contactId, opportunityId, leadSource: lead.leadSource }));
    } catch (err) {
      console.error("[lead] could not send to GHL:", err);
      return Response.json({ ok: false, error: "upstream" }, { status: 502 });
    }
    return Response.json({ ok: true, leadId });
  }

  const webhook = process.env.GHL_INBOUND_WEBHOOK_URL;
  if (!webhook || process.env.MOCK_GHL === "true") {
    console.log("[lead] mock mode, not sent to GHL:", JSON.stringify({ ...lead, phone: "***", email: "***" }));
    return Response.json({ ok: true, leadId, mock: true });
  }

  try {
    const res = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    if (!res.ok) throw new Error(`GHL replied ${res.status}`);
  } catch (err) {
    console.error("[lead] could not reach GHL:", err);
    return Response.json({ ok: false, error: "upstream" }, { status: 502 });
  }
  return Response.json({ ok: true, leadId });
}
