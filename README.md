# util.oa.gg — free browser-based tools

An English-default utility hub with Korean support with 13 tools: image compression, text counting, file size conversion, monthly calendar, date calculations, percentages, physical unit conversion, random passwords, timer/stopwatch, JSON formatting, URL encoding, Base64 and colors. All tool inputs remain in the browser. No signup, payment, external fonts or analytics SDK is required. AdSense ownership is verified and site review is underway; ads are not enabled.

Open https://util.oa.gg/tools/ for the English directory or https://util.oa.gg/ko/tools/ for Korean. The language switch opens the same tool in the other language. English remains the default, with no automatic language redirects. Ten dedicated tool subdomains redirect to canonical main-host pages. `tool-catalog.cjs` defines the additional tools, `utility-tools.js` implements their local behavior, and `entry-worker.mjs` routes their entry URLs. The current local and production suites pass 42 tests; `node scripts/utility-domain-smoke.cjs` checks all ten dedicated entry domains on desktop and mobile.

## Run locally

With Node.js 20 or later, run `npm start` and open http://127.0.0.1:4173. The loopback server serves an allowlist of pages and assets with no upload endpoint. `index.html` supplies the compressor template; `render-pages.cjs` generates shared navigation and static English and Korean SEO content. Open through the server rather than double-clicking HTML.

## Image processing contract

- Static JPEG, PNG and WebP only. Byte headers and dimensions are checked before decoding. SVG, GIF, HEIC and animated PNG/WebP are rejected.
- Limits: 20,000,000 bytes, 24 million pixels, 8,192 pixels per side. Dimensions are checked again after decoding. These limits cannot guarantee protection from every damaged file or memory shortage.
- Targets: 1 byte through 20 MB; 1 KB = 1,000 bytes and 1 MB = 1,000,000 bytes. Fractional targets are rounded down to whole bytes.
- JPEG/WebP quality settings range from 0.60 to 0.95. PNG uses dimension reduction. Resizing keeps each dimension at least 25% of its original value and can be disabled.
- Actual Blob bytes determine success. Unreachable targets are labeled honestly. The search is a practical approximation rather than a guarantee of optimal visual quality.
- Already-small inputs in the selected format are preserved. Larger conversion results are disclosed. JPG flattens transparency to white; PNG/WebP can retain alpha.

Canvas re-encoding may remove EXIF and other metadata; colors and encoded size can vary by browser. The original file is never overwritten. Check output quality, dimensions and destination requirements before use.

## Verify and deploy

Run `npm ci`, `npx playwright install chromium`, then `npm test`. The 36 desktop/mobile checks cover actual downloaded files, alpha, limits, honest failures and the full utility set. The real photo fixture is [MDN rhino.jpg](https://mdn.github.io/shared-assets/images/examples/rhino.jpg). Actual phones, Safari/Firefox and low-memory devices remain unverified.

Run `npm run deploy` to deploy the existing Cloudflare Worker. Build-time checks reject Korean text in public HTML/JS and unexpected assets. Documentation, tests, configuration and secrets are not published as assets.

[Public repository](https://github.com/jhs512/util.oa.gg). See [deployment status](DEPLOYMENT.md), [verification](VERIFICATION.md), [SEO operations](SEO.md), [advertising readiness](ADVERTISING.md) and [research](RESEARCH.md).
