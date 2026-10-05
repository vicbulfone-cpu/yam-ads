// Rebuilds docs/image-credits-au.md from data/au-photos-*.json (run after adding or removing Australian photos).
import fs from "node:fs";

const rows = [];
for (const f of fs.readdirSync("data").filter((n) => /^au-photos-.*\.json$/.test(n)).sort()) {
  for (const x of JSON.parse(fs.readFileSync(`data/${f}`, "utf8"))) {
    rows.push(`| ${x.file.split("/").pop()} | ${x.photographer} | [${x.source}](${x.pageUrl}) | ${x.licence} | ${x.australianEvidence} |`);
  }
}
fs.writeFileSync(
  "docs/image-credits-au.md",
  `# Australian photos (home page below the hero)

Every photo was checked for positive evidence that it was taken in Australia (location tag or unmistakable Australian scene) and for an ordinary, approachable feel. All are free for commercial use (Pexels / Unsplash licences, no attribution required). Files are in public/images/au; details in data/au-photos-*.json. Rebuild this list with \`node scripts/build-au-credits.mjs\`.

**Rule: no photo is shown twice on one page** (src/components/sections/picture-registry.ts). When a page has used every unused photo, the remaining cards show a warm icon band instead of repeating one.

| File | Photographer | Source | Licence | Evidence it is Australian |
|---|---|---|---|---|
${rows.join("\n")}

Gaps: no verified-Australian photos were found of ordinary people indoors (couple at a kitchen table, family at home, home office, adviser meeting a client), nor of a florist, hairdresser, mechanic, nurse or fishing-boat operator. Owner-supplied photos (planned folder assets/photos) are the best way to fill them.
`,
);
console.log(rows.length, "photos listed");
