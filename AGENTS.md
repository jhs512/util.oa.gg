# util.oa.gg utility hub

- This project owns the hub and all its utilities. Keep work in this project; do not create a separate Codex project for the same site.
- English only: write all site copy, metadata, accessibility labels, runtime messages, new documentation and marketing material in English. Set every page to `lang="en"`. Do not introduce Korean text. User-provided inputs may contain any language.
- SEO is a core operating objective for international audiences. Give each real tool unique, useful English descriptions, concise titles and crawlable internal links. Align canonical URLs, sitemap and internal links with one representative URL per tool. Avoid duplicate keyword pages and ranking guarantees.
- Show the tool immediately at each search entry point, with shared navigation to other working tools. Keep use free of signup and lengthy introductory steps.
- The site name is `util.oa.gg`. `util.oa.gg` and `image-compressor.util.oa.gg` serve the same compressor page from shared code and content.
- Prepare Google AdSense monetization. Enable ads only after verifying the actual publisher ID, site approval, consent and privacy requirements. Avoid placeholder IDs, click incentives, revenue guarantees and ads that obstruct tools.

## Deployment policy

- Work within the app and deployment scope requested by the user. This policy does not authorize unrelated apps or additional deployments.
- Use suitable free Cloudflare static hosting: Workers Static Assets or Pages. Paid plans and extra-cost options require explicit user instructions.
- For a new entry hostname, check conflicts and existing services before connecting it. Preserve `compress.oa.gg` and the Worker default URL as compatible entry points. Verify certificate issuance and actual HTTPS for multilevel subdomains.
- Preserve root, www, other app DNS/site connections and mail records. Coordinate connection targets and methods with a separate DNS task when applicable.
- Completion requires opening the real app over HTTPS at the public default URL and dedicated domains, then checking the core flow. Record pending DNS, propagation or certificates as incomplete.
- Image compression and previews stay in the browser. Preserve the no-upload contract and CSP. Exclude tests, reports, configuration and secrets from public assets.

Before deployment or redeployment, read `DEPLOYMENT.md` for current hosting and verification methods.
