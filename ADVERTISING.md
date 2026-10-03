# Google AdSense readiness

## Current state — review requested on October 1, 2026

The user supplied the root-site repository https://github.com/jhs512/oa.gg and local path C:/works/oa-gg. The existing oa-gg Cloudflare Pages site now publishes the actual publisher meta tag and ads.txt with the Google seller entry and subdomain=util.oa.gg. oa.gg still redirects to www.oa.gg; both ads.txt URLs return HTTP 200 and text/plain. Existing deployed portal HTML, styles, scripts and images were preserved. The same minimal source additions are in the cloned root repository.

AdSense ownership verification succeeded. The site review request was submitted and the signed-in account now shows oa.gg as preparing / under review with review requested. Google approval has not yet been granted. No ad scripts or slots are active. Applicable certified consent management and the necessary privacy/CSP changes must be verified before activating ads after approval. Root ads.txt recognition may take additional crawler processing.


## Before root authorization — October 1, 2026, ten-tool release

The actual account still lists `oa.gg` as needing review and ads.txt as not found. The review request is disabled until ownership verification is complete. This utility hub publishes the correct AdSense meta tag and ads.txt at `util.oa.gg`, but the separately hosted `oa.gg` redirects to `www.oa.gg`, where neither the publisher tag nor a real ads.txt is available. `/ads.txt` currently returns the root site's HTML fallback rather than an ads.txt document.

The utility release preserved root/www DNS and site connections. It did not falsely attest that a verification tag was inserted into that separate site's homepage. The root source/deployment location was requested so the missing verification tag and additive ads.txt authorization can be coordinated. Site review, certified consent setup and actual ad activation remain incomplete. No ad resources are loaded, and the local-processing CSP is intact.

On October 1, 2026, the signed-in account's actual publisher ID was confirmed as `pub-8194376114167709`. No unrelated earnings or balances were saved. The site list showed oa.gg as requiring review and ads.txt as missing. This does not establish approval for the utility hub.

Pages contain the actual `google-adsense-account` verification meta tag. `/ads.txt` contains:

```text
google.com, pub-8194376114167709, DIRECT, f08c47fec0942fa0
```

No ad scripts or ad slots run. CSP retains `connect-src 'none'`. The English privacy page discloses browser-local processing, Cloudflare hosting requests and current advertising status.

## Before activating ads

1. Verify public HTTPS and crawler access to the canonical host.
2. Confirm ownership and the review of the existing oa.gg site. [Google's site management rules](https://support.google.com/adsense/answer/12170421) do not treat ordinary subdomains as independently managed sites.
3. Coordinate root ads.txt authorization with the root-site owner, preserving existing sellers and unrelated site configuration. [Google's ads.txt FAQ](https://support.google.com/adsense/answer/9785052) requires subdomain references when sellers differ; explicit references may also be used for separate subdomain files. Prepared references are `subdomain=util.oa.gg` and `subdomain=image-compressor.util.oa.gg`. The root authorization file was subsequently deployed with the user-supplied root repository; verify crawler recognition before activating ads.
4. Confirm Google's site approval. The review request was submitted successfully on October 1, 2026 and remains under review.
5. Establish applicable consent management, including a Google-certified CMP where required, update the English privacy policy and review narrowly necessary CSP changes before loading ad resources.

[Google's connection instructions](https://support.google.com/adsense/answer/7584263) support the verification meta tag used here. Advertising and revenue remain unverified; ads must not block tool use or solicit clicks.

The account already has a published European regulations message named European regulations message - oa.gg, covering English and 31 additional languages (last modified August 20, 2026). Its site association, English default language, consent, do-not-consent and manage-options choices were confirmed. Existing slog.gg messages were not changed. Message publication alone does not confirm the future browser integration, consent choices or all applicable regional handling.

The oa.gg message's privacy link was corrected from http://oa.gg (the homepage) to the real HTTPS policy at https://util.oa.gg/privacy/. That change was saved and published in the existing oa.gg message. Consent, do-not-consent and manage-options choices and the existing other-site messages were preserved. No AdSense scripts were added to the tools during this pending review.
