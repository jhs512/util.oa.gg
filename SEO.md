# International SEO operations

English is the sole publishing language. Pages use `lang="en"`; titles, descriptions, visible headings, navigation, accessibility text and runtime messages are English. There are no alternate-language pages or unsupported hreflang declarations.

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
