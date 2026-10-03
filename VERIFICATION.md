# Verification

## English default and Korean support — October 1, 2026

Production version: `f571a365-cb62-4132-9ca5-794d9dab9150`. All 13 tools plus the directory, about and privacy pages now have English and Korean variants (32 URLs). Existing entry URLs remain English by default. Korean navigation stays under `/ko/`, while language links target the same tool. Metadata and runtime messages are localized; text inputs, generated values and filenames remain unchanged. Each page has a self-canonical URL and reciprocal en/ko/x-default alternates.

- Local desktop/mobile suite: **42 passed (18.0s)**.
- Public Worker desktop/mobile suite after deployment: **42 passed (1.4m)**.
- All ten dedicated domains: **20 successful Korean core-flow checks** after switching from their English entries.
- Main and image-compressor domains: valid TLS, HTTP 200 and real Korean compression/downloads on both viewports. Each result was a 9,956-byte WebP under a 10 KB target, with no uploads or external requests.
- Korean mobile screenshots were visually inspected, and word wrapping was adjusted to keep Korean words together.

Verification keeps certificate checks enabled and uses Google DNS resolution without modifying system DNS. An initial domain test clicked language links before module loading completed; waiting for page load resolved the test timing issue. The public link test also avoids repeatedly fetching identical destinations across pages, retaining coverage while avoiding network-driven timeouts. No advertising scripts were enabled.

## Ten additional utilities — October 1, 2026

The local suite passed **36 tests (11.0s)**. The production default Worker URL passed **36 tests (21.7s)**. New checks cover all ten pages' titles, canonical URLs, discovery links, mobile widths, leap-year calendars, DST-independent date arithmetic, percentage zero denominators, temperature limits, password group coverage, countdown completion, JSON errors, URL encoding and Unicode Base64 round trips.

All ten dedicated domains passed HTTPS and real core flows on desktop and mobile: **20 successful entry checks**. Their roots redirect to the canonical tool paths. Main/image-compressor hosts also passed all four real image downloads at 9,956 bytes with no upload or external requests. Certificate verification remained enabled throughout. Calendar mobile rendering was visually inspected.

Search Console HTML-tag ownership verification succeeded. Sitemap submission succeeded, but the initial crawler status was "Couldn't fetch"; indexing and successful sitemap processing are not claimed. The canonical XML and robots.txt returned HTTP 200 to a Googlebot user agent through public DNS.

## English-only release — October 1, 2026

The site templates, generated pages, accessibility labels and compressor/converter runtime messages are English. All pages use `lang="en"`. Tool pages have unique English titles, descriptions, guidance and canonical URLs. Source and issue links use the public GitHub repository.

Local desktop/mobile functional suite: **24 passed (10.8s)** after conversion. It covers real compression downloads, transparent output, JPG white backgrounds, unreachable targets, changed settings, malformed/animated/oversized input rejection, encoder failures, keyboard preview, text counts and file-unit conversion.

The real JPEG fixture is 17,994 bytes. Its 10 KB WebP result is 9,956 bytes at 240 × 182 pixels. Downloaded data is decoded again to inspect size, pixels and alpha. 

## Limits

Mobile validation uses a Chromium viewport, not a physical phone. Safari, Firefox and low-memory devices have not been tested. Search indexing, rankings, international demand and revenue remain unverified. Normal TLS verification is required for every deployment check.

## Final release results

The complete local suite passed **26 tests (10.7s)** and the public default URL passed **26 tests (17.8s)**. Added checks cover every page's English language declaration, absence of Korean text, unique title, meaningful description, single H1, canonical URL, working internal destinations and desktop/mobile width.

Both required custom hosts passed valid TLS and the actual compression/download flow on desktop and mobile. Google DNS was used without changing the system resolver or bypassing certificate validation. Both served identical homepage HTML. All four downloads were 9,956-byte WebP results, with zero uploads or external requests. The previous main-domain TLS issue is resolved in this verification.

English desktop/mobile screenshots are stored only in ignored verification-artifacts. The mobile compressor result was visually reviewed. All files changed in this release use English; Unicode user input remains supported.

Google live URL inspection of https://util.oa.gg/calendar/ passed on October 1, 2026 (KST): "URL is available to Google" and "Page can be indexed". This confirms live Google access to the calendar, while sitemap processing and actual indexing remain separate pending outcomes.

The calendar indexing request was accepted into Google's priority crawl queue. This is a submitted request, not proof that the page is already indexed.

The canonical homepage indexing request was also accepted into Google's priority crawl queue.

Google live URL inspection of https://util.oa.gg/sitemap.xml also succeeded on October 1, 2026 (KST): crawling allowed, page fetch successful, and indexing allowed. This verifies actual Google smartphone inspection access to the XML; sitemap-report processing remains a separate outcome.

AdSense root-site ownership verification and review submission both succeeded. The account now shows oa.gg as under review / preparing with review requested. Ads remain inactive pending approval and consent readiness.

After the successful live XML fetch, the same sitemap URL was resubmitted. Submission was accepted, but the report still showed Couldn't fetch with zero discovered pages at the final check. No duplicate sitemap URL was created.

The existing oa.gg European consent message was republished successfully with its privacy URL corrected to the real HTTPS utility privacy page. The message list shows October 1, 2026 and Published for oa.gg, while slog.gg remains unchanged. Browser ad integration, non-obstructive placement, final privacy disclosures and CSP review still await site approval before activation.
