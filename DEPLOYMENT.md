# Cloudflare deployment

## Current configuration — October 1, 2026

This project owns the entire English util.oa.gg hub. The [GitHub repository](https://github.com/jhs512/util.oa.gg) is public on main. The existing `ddak-image-compressor` Worker serves image compression, text counting and file-unit conversion through Workers Static Assets on the confirmed free plan. No paid certificate or add-on was selected.

Entry points:

- https://util.oa.gg/ — canonical homepage.
- https://image-compressor.util.oa.gg/ — shared image page with canonical main-host URL.
- https://compress.oa.gg/ — preserved legacy entry.
- https://ddak-image-compressor.jangka512.workers.dev/ — preserved default URL.

Last deployment before the English release: `7a09eadb-1927-4cfc-9f55-9a6aab0dc519`. At that check, the image hostname passed valid TLS and actual desktop/mobile downloads; the main host still failed certificate handshakes. New release results will be recorded below. Cloudflare zone activation and record creation were confirmed by the DNS task. Root, www, other apps and mail records were preserved.

[Cloudflare Custom Domain documentation](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/#certificates) states that multilevel hostname certificates are issued automatically without a separate ACM subscription. Actual HTTPS success must still be verified. [Static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) documents free static requests/storage.

## Deploy and verify

Read this document before redeploying. Run `npm ci` and `npm run deploy`. `build-assets.cjs` publishes only approved HTML, JS, CSS, robots.txt, sitemap.xml, ads.txt and Cloudflare headers. It rejects unexpected files and Korean characters in shipped HTML/JS. Tests, documentation, secrets and configuration stay outside public assets.

Set `TEST_BASE_URL` to the public default URL and run `npm test`; remove the environment variable afterward. Run `node scripts/domain-smoke.cjs` to resolve dedicated domains using Google DNS without modifying system DNS or bypassing certificate checks. It opens desktop/mobile views and verifies a real image download with no uploads or external requests. Exit code 1 means at least one dedicated host failed.

`node scripts/capture.cjs` captures desktop/mobile results to ignored `verification-artifacts`. Keep reports and screenshots out of deployed assets.

CSP retains browser-local processing with `connect-src 'none'`. Responses use `Cache-Control: public, no-transform, max-age=0, must-revalidate` to prevent automatic analytics injection without changing other sites' settings; see the [Cloudflare analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/).

Completion requires valid HTTPS, HTTP 200 and working compression/download at the default and both required custom hosts. Pending certificates are incomplete. Canonical URLs are English and consistent with the sitemap; Search Console ownership/submission remains unconfirmed. AdSense is prepared but inactive pending site approval, root authorization and consent readiness; see [ADVERTISING.md](ADVERTISING.md).

## English release verified

Deployment version: `ea20386f-d361-4785-ab31-23dc42866dac`.

- Local Chromium desktop/mobile suite: **26 passed (10.7s)**.
- Public Worker default URL suite: **26 passed (17.8s)**.
- Both `util.oa.gg` and `image-compressor.util.oa.gg` passed valid TLS, HTTP 200 and real desktop/mobile compression/downloads using Google public DNS resolution with the original hostname and certificate checks enabled. Their image-page HTML matched exactly.
- Each custom-host view downloaded a 9,956-byte WebP under the 10 KB target. No uploads, external requests or blocked injected scripts were observed.
- Screenshots were reviewed for the English mobile layout. Public HTML/JS passed the English-only build gate; unique metadata, canonical URLs, links and page widths passed automated checks.

The earlier main-host certificate issue is resolved in these tests. Local or ISP DNS caches can still differ until refreshed. AdSense approval and Search Console ownership/submission remain outstanding.
