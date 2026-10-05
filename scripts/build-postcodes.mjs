// Builds public/data/au-postcodes.txt (one "postcode|suburb|state" line per place) for the postcode box in the business
// questionnaire. Source: GeoNames Australian postal codes (CC BY 4.0, https://download.geonames.org/export/zip/AU.zip),
// unzipped to .work/geonames-au/AU.txt. Run: node scripts/build-postcodes.mjs
import fs from "node:fs";
import path from "node:path";

const src = path.join(process.cwd(), ".work", "geonames-au", "AU.txt");
const out = path.join(process.cwd(), "public", "data", "au-postcodes.txt");

const seen = new Set();
const rows = [];
for (const line of fs.readFileSync(src, "utf8").split("\n")) {
  const [, postcode, place, , state] = line.split("\t");
  if (!/^\d{4}$/.test(postcode ?? "") || !place || !state) continue;
  // PO boxes, mail centres and the like are not places a visitor lives or works
  if (/\b(PO|Post Office|Mail Centre|Delivery Centre|BC|DC|LPO)\b/i.test(place)) continue;
  const key = `${postcode}|${place.toLowerCase()}`;
  if (seen.has(key)) continue;
  seen.add(key);
  rows.push([postcode, place.trim(), state]);
}
rows.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, rows.map((r) => r.join("|")).join("\n") + "\n");
console.log(`${rows.length} places written to ${path.relative(process.cwd(), out)}`);
