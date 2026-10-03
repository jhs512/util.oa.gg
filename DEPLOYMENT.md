# Cloudflare deployment

## Korean support — October 1, 2026

Deployed version: `f571a365-cb62-4132-9ca5-794d9dab9150`. English remains the default at existing entry URLs. All 13 tools, the directory, about and privacy pages have Korean equivalents under `/ko/`, with links to the matching English page. The user explicitly requested Korean support after the earlier English-only instruction. Both languages use self-canonical URLs and reciprocal `en`, `ko` and English `x-default` links. The sitemap contains 32 URLs. Translation dictionaries are compiled into an approved browser asset; source/configuration files remain private.

Use `node scripts/domain-smoke.cjs --korean` for actual Korean compression/download checks at the main and image domains. Use `node scripts/utility-domain-smoke.cjs --korean` to check all ten dedicated domains, then switch to their Korean tools. Both scripts preserve TLS validation and use Google DNS without changing system settings. `TEST_HOST_RESOLVER_RULES` can provide equivalent Chromium resolver rules for Playwright public tests.

## Ten-tool expansion — October 1, 2026

Deployed version: `77177a9d-7491-4cfa-8c9d-a41205b4a9d7`. The existing free Worker now serves 13 tools. Ten new custom domains are attached to that same Worker:

| Entry hostname | Canonical tool URL |
|---|---|
| calendar.util.oa.gg | https://util.oa.gg/calendar/ |
| date-calculator.util.oa.gg | https://util.oa.gg/date-calculator/ |
| percentage-calculator.util.oa.gg | https://util.oa.gg/percentage-calculator/ |
| unit-converter.util.oa.gg | https://util.oa.gg/unit-converter/ |
| password-generator.util.oa.gg | https://util.oa.gg/password-generator/ |
| timer.util.oa.gg | https://util.oa.gg/timer/ |
| json-formatter.util.oa.gg | https://util.oa.gg/json-formatter/ |
| url-encoder.util.oa.gg | https://util.oa.gg/url-encoder/ |
| base64.util.oa.gg | https://util.oa.gg/base64/ |
| color-picker.util.oa.gg | https://util.oa.gg/color-picker/ |

`entry-worker.mjs` redirects only the new domains' `/` and `/index.html` entry URLs to their canonical tools. `run_worker_first` is limited to these two paths; ordinary tool pages and assets use Workers Static Assets directly. The default Worker URL and three existing domains are preserved. No paid plan, certificate add-on or new hosting project was used.

Before deployment, the Cloudflare DNS UI showed all 11 existing records and no conflicting new hostname. Existing root, www, other apps and verification records were preserved. The current OAuth token cannot list ordinary DNS records, so the DNS UI was used for that audit; Worker domain bindings were also checked through the API.

All ten new hostnames passed valid HTTPS, canonical redirects, HTTP 200, working tool flows and width checks in desktop/mobile Chromium. `node scripts/utility-domain-smoke.cjs` reproduces these 20 checks using Google DNS without changing the system resolver or disabling certificate validation. Main and image entry hosts also passed actual compression/download on both viewports. The default URL passed all 36 Playwright tests. Reports and screenshots are kept outside public assets in ignored `verification-artifacts`.

Search Console ownership of `https://util.oa.gg/` was verified through the actual account's HTML meta tag. `https://util.oa.gg/sitemap.xml` was submitted; its first displayed status was "Couldn't fetch", so crawler processing remains unresolved. Googlebot-agent HTTPS requests returned HTTP 200 with valid XML and an allowing robots.txt during the public check. AdSense remains inactive pending Google review and consent readiness. The root ownership and ads.txt prerequisites were subsequently resolved as recorded below.

## Current configuration — October 1, 2026

This project owns the entire util.oa.gg hub. English is the default, with Korean pages under /ko/. The [GitHub repository](https://github.com/jhs512/util.oa.gg) is public on main. The existing `ddak-image-compressor` Worker serves image compression, text counting and file-unit conversion through Workers Static Assets on the confirmed free plan. No paid certificate or add-on was selected.

Entry points:

- https://util.oa.gg/ — canonical homepage.
- https://image-compressor.util.oa.gg/ — shared image page with canonical main-host URL.
- https://compress.oa.gg/ — preserved legacy entry.
- https://ddak-image-compressor.jangka512.workers.dev/ — preserved default URL.

Last deployment before the English release: `7a09eadb-1927-4cfc-9f55-9a6aab0dc519`. At that check, the image hostname passed valid TLS and actual desktop/mobile downloads; the main host still failed certificate handshakes. New release results will be recorded below. Cloudflare zone activation and record creation were confirmed by the DNS task. Root, www, other apps and mail records were preserved.

[Cloudflare Custom Domain documentation](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/#certificates) states that multilevel hostname certificates are issued automatically without a separate ACM subscription. Actual HTTPS success must still be verified. [Static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) documents free static requests/storage.

## Deploy and verify

Read this document before redeploying. Run `npm ci` and `npm run deploy`. `build-assets.cjs` publishes only approved HTML, JS, CSS, robots.txt, sitemap.xml, ads.txt and Cloudflare headers. It rejects unexpected public files, validates page languages, and rejects Korean content in default English pages. Only the approved translation assets and Korean pages contain Korean copy. Tests, documentation, secrets and configuration stay outside public assets.

Set `TEST_BASE_URL` to the public default URL and run `npm test`; remove the environment variable afterward. Run `node scripts/domain-smoke.cjs` to resolve dedicated domains using Google DNS without modifying system DNS or bypassing certificate checks. It opens desktop/mobile views and verifies a real image download with no uploads or external requests. Exit code 1 means at least one dedicated host failed.

`node scripts/capture.cjs` captures desktop/mobile results to ignored `verification-artifacts`. Keep reports and screenshots out of deployed assets.

CSP retains browser-local processing with `connect-src 'none'`. Responses use `Cache-Control: public, no-transform, max-age=0, must-revalidate` to prevent automatic analytics injection without changing other sites' settings; see the [Cloudflare analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/).

Completion requires valid HTTPS, HTTP 200 and working compression/download at the default and both required custom hosts. Pending certificates are incomplete. Each language has consistent self-canonical URLs and reciprocal hreflang links in a 32-URL sitemap. Search Console ownership and submission are confirmed; sitemap processing remains pending. AdSense is prepared but inactive pending site approval, root authorization and consent readiness; see [ADVERTISING.md](ADVERTISING.md).

## English release verified

Deployment version: `ea20386f-d361-4785-ab31-23dc42866dac`.

- Local Chromium desktop/mobile suite: **26 passed (10.7s)**.
- Public Worker default URL suite: **26 passed (17.8s)**.
- Both `util.oa.gg` and `image-compressor.util.oa.gg` passed valid TLS, HTTP 200 and real desktop/mobile compression/downloads using Google public DNS resolution with the original hostname and certificate checks enabled. Their image-page HTML matched exactly.
- Each custom-host view downloaded a 9,956-byte WebP under the 10 KB target. No uploads, external requests or blocked injected scripts were observed.
- Screenshots were reviewed for the English mobile layout. Public HTML/JS passed the English-only build gate; unique metadata, canonical URLs, links and page widths passed automated checks.

The earlier main-host certificate issue is resolved in these tests. Local or ISP DNS caches can still differ until refreshed. AdSense approval and Search Console ownership/submission remain outstanding.

Google live URL inspection of https://util.oa.gg/calendar/ passed on October 1, 2026 (KST): "URL is available to Google" and "Page can be indexed". This confirms live Google access to the calendar, while sitemap processing and actual indexing remain separate pending outcomes.

The calendar indexing request was accepted into Google's priority crawl queue. This is a submitted request, not proof that the page is already indexed.

The canonical homepage indexing request was also accepted into Google's priority crawl queue.

## Root advertising authorization deployment

The user supplied https://github.com/jhs512/oa.gg and C:/works/oa-gg for the root site. It was cloned into the existing empty folder. Its README identifies the existing oa-gg Pages project and www.oa.gg custom domain; these were confirmed through Wrangler. GitHub HTML, CSS and the OG image differ from the currently deployed site. To preserve production, a snapshot of the deployed public files was staged in ignored verification-artifacts/root-site-deploy, adding only the actual publisher meta tag and ads.txt. Source changes in the root repository are the same meta tag and new public/ads.txt. The existing project was deployed at https://29479762.oa-gg.pages.dev. Verification confirmed oa.gg still redirects to www.oa.gg, both ads.txt URLs return HTTP 200 and text/plain, and all seven pre-existing public files are identical after removing the new meta tag and normalizing HTML line endings. Existing root/www and unrelated DNS/site connections were not changed.

Google live URL inspection of https://util.oa.gg/sitemap.xml also succeeded on October 1, 2026 (KST): crawling allowed, page fetch successful, and indexing allowed. This verifies actual Google smartphone inspection access to the XML; sitemap-report processing remains a separate outcome.

AdSense root-site ownership verification and review submission both succeeded. The account now shows oa.gg as under review / preparing with review requested. Ads remain inactive pending approval and consent readiness.

The Korean release passed all 42 local tests and all 42 tests at the public Worker URL. All 20 dedicated-domain Korean flows and four main/image Korean downloads passed with valid TLS. Both language pages on the image entry hosts matched exactly. Mobile Korean screenshots were inspected.
