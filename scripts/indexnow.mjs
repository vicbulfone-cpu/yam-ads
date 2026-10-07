// Submits indexable public URLs to IndexNow after Vercel Production reports a successful deployment.
// Use --force to resubmit manually after deployment, or --dry-run to validate the list without a request.
// The key file lives at public/<key>.txt (served at https://youraccountantmatch.com.au/<key>.txt). It is a public ownership check, not a secret.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://youraccountantmatch.com.au").replace(/\/+$/, "");
const KEY = "3a81b6cd6a1b7fad384d8f16789b0fb3";
const SKIP_TYPES = new Set(["admin (not rebuilt)", "questionnaire", "retired location (redirect)"]);
const PRIVATE_PREFIXES = ["/api", "/match", "/questionnaire"];
const isPrivatePath = (route) => PRIVATE_PREFIXES.some((prefix) => route === prefix || route.startsWith(`${prefix}/`));

function indexablePaths() {
  const rows = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "extracted", "page-types.json"), "utf8"));
  const paths = rows
    .filter((row) => !SKIP_TYPES.has(row.type) && row.path !== "/how-we-select-accountants" && !isPrivatePath(row.path))
    .filter((row) => {
      const slug = row.path === "/" ? "_home" : row.path.replace(/^\/|\/$/g, "").replace(/[\/?=&]/g, "__");
      const file = path.join(ROOT, "data", "extracted", "pages", `${slug}.json`);
      if (!fs.existsSync(file)) return false;
      const page = JSON.parse(fs.readFileSync(file, "utf8"));
      return !page.robots?.some((value) => /noindex/i.test(value));
    })
    .map((row) => row.path);
  const specialPage = path.join(ROOT, "data", "extracted", "pages", "how-we-select-accountants.json");
  if (fs.existsSync(specialPage)) {
    const page = JSON.parse(fs.readFileSync(specialPage, "utf8"));
    if (!isPrivatePath("/how-we-select-accountants") && !page.robots?.some((value) => /noindex/i.test(value))) paths.push("/how-we-select-accountants");
  }
  return [...new Set(paths)];
}

async function submit() {
  const dryRun = process.argv.includes("--dry-run");
  if (process.env.VERCEL_ENV !== "production" && !process.argv.includes("--force")) {
    if (!dryRun) {
      console.info("IndexNow is submitted by the deployment workflow. Use `node scripts/indexnow.mjs --force` to resubmit manually after a production deployment.");
      return;
    }
  }
  const keyFile = path.join(ROOT, "public", `${KEY}.txt`);
  if (!fs.existsSync(keyFile) || fs.readFileSync(keyFile, "utf8").trim() !== KEY) {
    throw new Error("IndexNow key file is missing from /public or does not match the configured key.");
  }
  const urlList = indexablePaths().map((route) => new URL(route, `${SITE}/`).toString());
  if (urlList.length === 0) throw new Error("No indexable public URLs were found for IndexNow.");
  if (dryRun) {
    console.info(`IndexNow dry run: ${urlList.length} public URLs; no request sent.`);
    return;
  }

  let response;
  try {
    response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (error) {
    console.error("IndexNow could not be reached. Resubmit with `node scripts/indexnow.mjs --force` after deployment.", error);
    return;
  }

  const detail = await response.text();
  if (!response.ok) {
    console.error(`IndexNow rejected the URL submission (HTTP ${response.status}): ${detail || "no response body"}`);
    return;
  }
  console.log(`IndexNow accepted ${urlList.length} public URLs (HTTP ${response.status}).`);
}

await submit();
