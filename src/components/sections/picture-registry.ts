// "No duplicate photos" rule: within one page render, a photo is shown only once.
// The registry is request-scoped (React cache), so every page starts with an empty list. A photo is identified by its
// stock-site id (read from data/*.json), so the same photo saved under two file names still counts as one.
import { cache } from "react";
import fs from "node:fs";
import path from "node:path";

const used = cache(() => new Set<string>());

let ids: Map<string, string> | null = null;
function idOf(file: string): string {
  if (!ids) {
    ids = new Map();
    const dir = path.join(process.cwd(), "data");
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n === "stock-images.json" || /^au-photos-.*\.json$/.test(n)) : [];
    for (const f of files) {
      for (const p of JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { file: string; pageUrl?: string }[]) {
        const m = p.pageUrl?.match(/(\d{5,})\/?$/) ?? p.pageUrl?.match(/-([A-Za-z0-9_-]{11})\/?$/);
        ids.set(p.file, m ? m[1] : p.file);
      }
    }
  }
  return ids.get(file) ?? file;
}

export const isUsed = (file: string) => used().has(idOf(file));

/** Returns the first candidate not yet shown on this page and marks it as shown; null when every candidate is taken. */
export function firstUnused(candidates: (string | null | undefined)[]): string | null {
  const set = used();
  for (const file of candidates) {
    if (!file) continue;
    const id = idOf(file);
    if (!set.has(id)) {
      set.add(id);
      return file;
    }
  }
  return null;
}
