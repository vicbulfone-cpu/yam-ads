// Checks the GoHighLevel Private Integration connection (owner, 10 Oct 2026): reads GHL_PRIVATE_TOKEN and GHL_LOCATION_ID
// from .env.local, then shows the sub-account's name and its pipelines with their ids (for GHL_PIPELINE_ID and
// GHL_PIPELINE_STAGE_ID). Never prints the token. Run: node scripts/ghl-check.mjs
import fs from "node:fs";

const env = Object.fromEntries(
  (fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "").split(/\r?\n/)
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);
const token = process.env.GHL_PRIVATE_TOKEN || env.GHL_PRIVATE_TOKEN;
const loc = process.env.GHL_LOCATION_ID || env.GHL_LOCATION_ID;
const version = process.env.GHL_API_VERSION || env.GHL_API_VERSION || "2021-07-28";
if (!token || !loc) { console.log("Missing GHL_PRIVATE_TOKEN or GHL_LOCATION_ID in .env.local"); process.exit(1); }

const get = async (path) => {
  const res = await fetch(`https://services.leadconnectorhq.com${path}`, { headers: { Authorization: `Bearer ${token}`, Version: version, Accept: "application/json" } });
  const text = await res.text();
  return { status: res.status, data: (() => { try { return JSON.parse(text); } catch { return text.slice(0, 200); } })() };
};

const l = await get(`/locations/${loc}`);
console.log(`Sub-account: ${l.status === 200 ? `OK, "${l.data.location?.name}"` : `failed (${l.status}) ${JSON.stringify(l.data).slice(0, 200)}`}`);
const p = await get(`/opportunities/pipelines?locationId=${loc}`);
if (p.status !== 200) console.log(`Pipelines: failed (${p.status}) ${JSON.stringify(p.data).slice(0, 200)}`);
else for (const pipe of p.data.pipelines ?? []) {
  console.log(`Pipeline "${pipe.name}"  GHL_PIPELINE_ID=${pipe.id}`);
  for (const s of pipe.stages ?? []) console.log(`   stage "${s.name}"  GHL_PIPELINE_STAGE_ID=${s.id}`);
}
const c = await get(`/contacts/?locationId=${loc}&limit=1`);
console.log(`Contacts access: ${c.status === 200 ? "OK" : `failed (${c.status})`}`);
