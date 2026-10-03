# International SEO operations

## Ten-tool release update — October 1, 2026

The hub now contains 13 real tools and a `/tools/` directory. Calendar, date calculation, percentages, physical unit conversion, random passwords, timer/stopwatch, JSON formatting, URL encoding, UTF-8 Base64 and color conversion each have one unique English page with practical instructions and explicit limitations. Their canonical paths match the sitemap and discovery links. Ten dedicated custom domains permanently redirect their entry URLs to those main-host pages; aliases do not add duplicate sitemap entries.

Search Console ownership of the canonical URL-prefix property was verified in the signed-in account using the HTML tag published by this project. The 16-URL sitemap (13 tools, directory, about and privacy) was submitted on October 1, 2026. The initial status was "Couldn't fetch" with zero discovered pages. Public checks returned HTTP 200, valid XML and an allowing robots.txt, so Google crawler processing still needs a later successful status. No indexing, ranking or traffic outcome is claimed.

English remains the default at existing URLs. The user requested Korean support on October 1, 2026, superseding the earlier English-only publishing rule. All 16 pages now have Korean equivalents under `/ko/` with `lang="ko"`, translated metadata, guides, navigation, accessibility labels and runtime messages. Each language uses a self-canonical URL and reciprocal `en`, `ko` and `x-default` alternate links. English is the x-default target. The sitemap lists 32 URLs and omits entry-host aliases. Language links open the same tool; no automatic language redirect or stored preference is used. See Google’s [localized-version guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).

## Search intent and canonical URLs

| Tool | Primary intent | Canonical URL |
|---|---|---|
| Image compressor | Compress image to target KB/MB, 100 KB or 200 KB | https://util.oa.gg/ |
| Text counter | Character count, word count, UTF-8 byte count | https://util.oa.gg/text-counter/ |
| File size converter | Bytes/KB/MB/KiB/MiB conversion | https://util.oa.gg/data-size/ |

Each working tool has a unique English title, description, H1 and practical explanations of its use and limitations. These are included in static HTML before JavaScript execution. Shared navigation and contextual links connect the real tools. Open Graph and Twitter summary metadata describe each page.

The image hostname, legacy compress hostname and Worker default URL provide the same shared content with the main host as canonical. Sitemap entries and production internal links use only canonical URLs. No duplicate pages are created for individual target sizes. The build rejects Korean characters in shipped HTML and JavaScript; tests verify language, metadata, canonical links, internal destinations and horizontal overflow.

[Google title guidance](https://developers.google.com/search/docs/appearance/title-link) recommends concise, descriptive titles consistent with the page language. [Google developer guidance](https://developers.google.com/search/docs/fundamentals/get-started-developers) recommends reachable pages, descriptive metadata and sitemaps. [Canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) informs alias handling; canonical hints do not guarantee Google's selection or ranking.

## Operational priorities

1. Verify public HTTPS on the main host and every required entry hostname. Resolve any certificate issue before declaring deployment complete.
2. Verify site ownership in Google Search Console and submit https://util.oa.gg/sitemap.xml. No verification token or authorized Search Console connection has been confirmed; submission is not claimed.
3. Inspect canonical selection, index coverage and mobile rendering. Check all three tool pages rather than only the homepage.
4. Observe international search impressions, queries, clicks and actual user feedback. Improve explanations around demonstrated needs. Competition exists; traffic and rankings are unproven.
5. Use relevant English demonstrations and tool-specific landing URLs for overseas marketing. Any external posting, outreach or paid campaign needs a separate explicit request. Do not collect image files, filenames or pasted text for measurement.

Search exposure and revenue are not guaranteed. Indexing, qualified traffic and successful tool use are separate outcomes.

Google live URL inspection of https://util.oa.gg/calendar/ passed on October 1, 2026 (KST): "URL is available to Google" and "Page can be indexed". This confirms live Google access to the calendar, while sitemap processing and actual indexing remain separate pending outcomes.

The calendar indexing request was accepted into Google's priority crawl queue. This is a submitted request, not proof that the page is already indexed.

The canonical homepage indexing request was also accepted into Google's priority crawl queue.

Google live URL inspection of https://util.oa.gg/sitemap.xml also succeeded on October 1, 2026 (KST): crawling allowed, page fetch successful, and indexing allowed. This verifies actual Google smartphone inspection access to the XML; sitemap-report processing remains a separate outcome.

After the successful live XML fetch, the same sitemap URL was resubmitted. Submission was accepted, but the report still showed Couldn't fetch with zero discovered pages at the final check. No duplicate sitemap URL was created.
