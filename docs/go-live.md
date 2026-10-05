# Go-live plan, Vercel settings and "only Vic can do" list

Written alongside the SEO checklist (section 17 and 18). Plain English; tick items off as you go.

## 1. Switching the domain to Vercel (near-zero downtime)

**Before anything changes: send me (or paste here) every existing DNS record for youraccountantmatch.com.au.**
I can't see your DNS from here. In your domain registrar (or wherever DNS is managed), open the DNS page and copy or screenshot all rows (type, name, value, TTL). The records that must NOT change are the email ones (MX, SPF = a TXT starting `v=spf1`, DKIM, DMARC) and anything GoHighLevel asked you to add (email sending, domain verification, CNAMEs for tracking links).

Steps:
1. **A day before:** lower the TTL on the existing A and CNAME records for the website (not email) to 300 seconds (5 minutes). This makes the switch fast and easy to undo.
2. In Vercel: Project → Settings → Domains → add `youraccountantmatch.com.au` (and `www.youraccountantmatch.com.au`, set to redirect to the one you choose). Vercel then shows the exact records it needs.
3. Run the SEO audit against the Vercel preview first: `node scripts/seo-audit.mjs https://<your-preview>.vercel.app`. All old URLs must work.
4. **Change only the records Vercel asks for** (normally one A record for the root and one CNAME for `www`). Leave every other record exactly as it is.
5. After DNS updates (minutes to a few hours), check: the site loads over https, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, an old city URL that redirects (for example `/locations/dubbo`), and send yourself a test email and a test GoHighLevel message to confirm email still works.
6. Raise the TTL back to normal after a few days.
7. Then follow section 3 below (Search Console, Bing, IndexNow).

If anything looks wrong, change the A / CNAME records back to the old values (that is why the TTL was lowered).

## 2. Vercel settings to check (only you can open these)

- Project → Settings → **Deployment Protection**: set to **Disabled** for Production (otherwise Google sees a login page).
- Project → Firewall: leave "Attack Challenge Mode" **off**, and make sure no rule blocks Googlebot, Bingbot or the AI crawlers in `robots.txt`. After go-live, test with `node scripts/seo-audit.mjs https://youraccountantmatch.com.au` (it fetches a page as Googlebot and as Bingbot).
- Region: `vercel.json` already sets functions to **syd1** (Sydney).
- The production `*.vercel.app` address should redirect to the real domain: Project → Settings → Domains → set the real domain as **Primary**; Vercel then redirects the other addresses to it. Preview deployments are already sent a `noindex` header by `next.config.ts`.

## 3. After go-live (step by step)

1. **Google Search Console** (search.google.com/search-console) → Add property → Domain or URL prefix → choose "HTML tag" → copy the `content` value into the Vercel environment variable `NEXT_PUBLIC_GSC_VERIFICATION` → redeploy → click Verify.
2. Search Console → **Sitemaps** → enter `sitemap.xml` → Submit. Then URL Inspection → paste the home page and each of the 13 city pages → "Request indexing".
3. **Bing Webmaster Tools** (bing.com/webmasters) → Add site (you can import from Search Console) → verification code into `NEXT_PUBLIC_BING_VERIFICATION` → submit `sitemap.xml`.
4. **IndexNow:** GitHub Actions submits indexable public URLs after Vercel reports a successful **Production** deployment. The verification key is public and its matching file is already in `/public`; no GitHub or Vercel secret is needed. Make sure GitHub Actions is enabled and Vercel's GitHub integration is reporting deployment statuses. To resubmit manually after deployment, run `node scripts/indexnow.mjs --force` from the repository. Local builds do not notify Bing.
5. **Analytics:** put your GA4 measurement ID in `NEXT_PUBLIC_GA4_ID` and your Ads ID in `NEXT_PUBLIC_GADS_ID`.
6. **Uptime monitor (free):** create an account at uptimerobot.com → Add New Monitor → type HTTPS → URL `https://youraccountantmatch.com.au` → interval 5 minutes → add your email as the alert contact. You then get an email within minutes if the site goes down.
7. **First 4 weeks, watch in Search Console:** *Pages* (indexing) for "Not found (404)", "Crawled – currently not indexed" and "Duplicate" groups; *Core Web Vitals*; *Performance* (clicks and impressions should hold steady, a small dip in week 1 to 2 is normal after a move). If a group of old pages shows 404, send me the list and I'll add redirects. Re-run `scripts/seo-audit.mjs` before every future change goes live.

## 4. Questionnaire spam protection (Stage 4)

The questionnaire is built in Stage 4. It will include a hidden honeypot field (bots fill it in, people never see it) and, if you want a stronger shield, Cloudflare Turnstile (free). Fake leads then never reach GoHighLevel or your accountants.

## 5. Things only Vic can do (to-do list)

- [ ] Send me the list of existing DNS records (section 1).
- [ ] Create the Search Console and Bing accounts; paste the verification codes into Vercel environment variables.
- [ ] Confirm GitHub Actions is enabled and Vercel reports Production deployment statuses to the repository (needed for automatic IndexNow notifications).
- [ ] Create the GA4 and Google Ads IDs.
- [ ] Give me your social media and Google Business Profile links (for the Organization `sameAs` list).
- [ ] Google Business Profile (as a service-area business) and Bing Places listing, using exactly the same business name and details as the website.
- [ ] Consistent listings in Australian directories (same name, website, phone).
- [ ] A reviews and testimonials plan.
- [ ] Links from other reputable sites (accounting associations, local business groups, partner accountants).
- [ ] Decide on the wording issues in `docs/seo-report.md` ("Recommendations for Vic"): titles over 60 characters, descriptions over 160, and the home and privacy pages sharing one title.
- [ ] Tell me if the old site allowed upper-case URLs. The new site redirects them to lowercase, which is the safe default.
- [ ] Decide whether to block any crawler listed in `src/app/robots.ts` (for example CCBot, which feeds many AI models).
