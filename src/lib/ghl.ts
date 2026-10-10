// GoHighLevel (GHL) connection through a sub-account "Private Integration" token (owner, 10 Oct 2026).
// Server-only: the token is read from GHL_PRIVATE_TOKEN and never reaches visitors' browsers (no NEXT_PUBLIC_ prefix).
//
// For each lead it:
//   1. creates or updates the customer as a contact (matched by email/phone per the sub-account's duplicate setting),
//      with tags GHL workflows can trigger on: "yam-lead", "lead-organic" / "lead-paid", the questionnaire and each service;
//   2. adds a note with everything they answered (services, answers, preferences, source and tracking);
//   3. if GHL_PIPELINE_ID is set, opens an opportunity for them in that pipeline (first stage, or GHL_PIPELINE_STAGE_ID).
// Assigning the lead to an accountant (by postcode territory, or to the advertiser for paid leads) is done by GHL
// workflows, as before. API: https://marketplace.gohighlevel.com/docs/Authorization/PrivateIntegrationsToken

const BASE = "https://services.leadconnectorhq.com";

export type GhlLead = {
  leadId: string; name: string; phone: string; email: string; postcode: string; suburb: string; state: string;
  services: string[]; answers: unknown; workMode: string; emailMatchDetails: boolean; leadSource: "Paid" | "Organic";
  adType: string; questionnaire: string; campaign: string; gclid: string; gbraid: string; wbraid: string; ref: string;
  utm: Record<string, string>; submittedAt: string;
};

export const ghlConfigured = () => Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);

async function call<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
      Version: process.env.GHL_API_VERSION || "2021-07-28",
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`GHL ${method} ${path} replied ${res.status}: ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : {}) as T;
}

/** "0412 345 678" or "61412345678" → "+61412345678" (the form only accepts Australian mobiles) */
const e164 = (phone: string) => (phone.startsWith("+") ? phone : phone.startsWith("61") ? `+${phone}` : `+61${phone.replace(/^0/, "")}`);
/** tag-friendly: lower case, letters/numbers/dashes */
const tag = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

function noteFor(lead: GhlLead) {
  const lines = [
    `Website enquiry (${lead.leadSource}) — lead ${lead.leadId}`,
    `Submitted: ${lead.submittedAt}`,
    `Questionnaire: ${lead.questionnaire || "-"}${lead.adType ? ` (ad page: ${lead.adType})` : ""}`,
    `Location: ${[lead.suburb, lead.state, lead.postcode].filter(Boolean).join(" ")}`,
    `Prefers: ${lead.workMode || "-"}`,
    `Email the match details: ${lead.emailMatchDetails ? "yes" : "no"}`,
    "",
    "Services and answers:",
    ...(lead.services.length ? lead.services.map((s) => `- ${s}`) : ["- (none)"]),
  ];
  const tracking = { campaign: lead.campaign, gclid: lead.gclid, gbraid: lead.gbraid, wbraid: lead.wbraid, ref: lead.ref, ...lead.utm };
  const t = Object.entries(tracking).filter(([, v]) => v);
  if (t.length) lines.push("", "Tracking:", ...t.map(([k, v]) => `- ${k}: ${v}`));
  return lines.join("\n");
}

/** Sends one lead to the GHL sub-account. Returns the GHL contact id. Throws if GHL refuses. */
export async function sendLeadToGhl(lead: GhlLead): Promise<{ contactId: string; opportunityId?: string }> {
  const locationId = process.env.GHL_LOCATION_ID!;
  const [firstName, ...rest] = lead.name.split(/\s+/);
  const serviceTags = [...new Set(lead.services.map((s) => tag(`service-${s.split(":")[0]}`)))].slice(0, 20);
  const tags = ["yam-lead", lead.leadSource === "Paid" ? "lead-paid" : "lead-organic", lead.questionnaire && tag(`q-${lead.questionnaire}`), ...serviceTags]
    .filter(Boolean) as string[];

  const upsert = await call<{ contact?: { id?: string } }>("POST", "/contacts/upsert", {
    locationId,
    firstName,
    lastName: rest.join(" ") || undefined,
    name: lead.name,
    email: lead.email,
    phone: e164(lead.phone),
    postalCode: lead.postcode,
    city: lead.suburb || undefined,
    state: lead.state || undefined,
    country: "AU",
    source: `Website - ${lead.leadSource}`,
    tags,
  });
  const contactId = upsert.contact?.id;
  if (!contactId) throw new Error("GHL upsert returned no contact id");

  // the full answers as a note on the contact (best effort: the contact already exists if this fails)
  await call("POST", `/contacts/${contactId}/notes`, { body: noteFor(lead) }).catch((e) => console.error("[ghl] note failed:", e));

  let opportunityId: string | undefined;
  if (process.env.GHL_PIPELINE_ID) {
    try {
      const opp = await call<{ opportunity?: { id?: string } }>("POST", "/opportunities/", {
        locationId,
        pipelineId: process.env.GHL_PIPELINE_ID,
        ...(process.env.GHL_PIPELINE_STAGE_ID ? { pipelineStageId: process.env.GHL_PIPELINE_STAGE_ID } : {}),
        name: `${lead.name} - ${lead.questionnaire || "enquiry"} (${lead.leadSource})`,
        status: "open",
        contactId,
        source: `Website - ${lead.leadSource}`,
      });
      opportunityId = opp.opportunity?.id;
    } catch (e) {
      console.error("[ghl] opportunity failed:", e);
    }
  }
  return { contactId, opportunityId };
}

/** Connection check (scripts/ghl-check.mjs uses the same calls): the sub-account's name and its pipelines. */
export async function ghlCheck() {
  const id = process.env.GHL_LOCATION_ID!;
  const loc = await call<{ location?: { name?: string } }>("GET", `/locations/${id}`).catch((e) => ({ error: String(e) }));
  const pipes = await call<{ pipelines?: { id: string; name: string; stages?: { id: string; name: string }[] }[] }>("GET", `/opportunities/pipelines?locationId=${id}`)
    .catch((e) => ({ error: String(e) }));
  return { location: loc, pipelines: pipes };
}
