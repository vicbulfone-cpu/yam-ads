// Lists every place where the OLD site showed different words on phones and on desktop.
// Writes docs/mobile-desktop-differences.md. Run after `node scripts/extract-structure.mjs`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(ROOT, "data", "structured");
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const texts = (nodes) =>
  nodes
    .filter((n) => ["h", "p", "text", "list", "faq", "link", "button"].includes(n.t))
    .flatMap((n) => (n.t === "list" ? n.items.map((i) => i.text) : n.t === "faq" ? [n.q, n.aText] : [n.text]))
    .filter(Boolean);

const onlyDesktop = new Map();
const onlyPhone = new Map();
let pages = 0;
for (const f of fs.readdirSync(dir)) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  if (d.error) continue;
  pages++;
  const dt = texts(d.nodes), mt = texts(d.mobile);
  const dc = norm(dt.join(" | ")), mc = norm(mt.join(" | "));
  for (const t of dt) if (t.length > 25 && !mc.includes(norm(t))) onlyDesktop.set(t, (onlyDesktop.get(t) || new Set()).add(d.path));
  for (const t of mt) if (t.length > 25 && !dc.includes(norm(t))) onlyPhone.set(t, (onlyPhone.get(t) || new Set()).add(d.path));
}
const row = ([t, set]) => `| ${set.size} | ${t.replace(/\|/g, "\|").slice(0, 400)} |`;
const sorted = (m) => [...m.entries()].sort((a, b) => b[1].size - a[1].size);
let md = "# Phone vs desktop wording on the OLD site\n\n";
md += "The old site showed slightly different words to phone and desktop visitors in a few places. The new site is one responsive page, so it needs ONE wording.\n\n";
md += "**Rule used in the new site:** phone wording (Google indexes the phone version first), plus any desktop-only text that is not just a re-wording. Review the lists below and tell me which wording you want in each place.\n\n";
md += `Pages compared: ${pages}.\n\n`;
md += `## Words only in the DESKTOP version (${onlyDesktop.size} different strings)\n\n| On pages | Text |\n|---:|---|\n${sorted(onlyDesktop).map(row).join("\n")}\n\n`;
md += `## Words only in the PHONE version (${onlyPhone.size} different strings)\n\n| On pages | Text |\n|---:|---|\n${sorted(onlyPhone).map(row).join("\n")}\n`;
fs.writeFileSync(path.join(ROOT, "docs", "mobile-desktop-differences.md"), md);
console.log("pages", pages, "desktop-only strings", onlyDesktop.size, "phone-only strings", onlyPhone.size);
