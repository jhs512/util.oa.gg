# Google AdSense readiness

On October 1, 2026, the signed-in account's actual publisher ID was confirmed as `pub-8194376114167709`. No unrelated earnings or balances were saved. The site list showed oa.gg as requiring review and ads.txt as missing. This does not establish approval for the utility hub.

Pages contain the actual `google-adsense-account` verification meta tag. `/ads.txt` contains:

```text
google.com, pub-8194376114167709, DIRECT, f08c47fec0942fa0
```

No ad scripts or ad slots run. CSP retains `connect-src 'none'`. The English privacy page discloses browser-local processing, Cloudflare hosting requests and current advertising status.

## Before activating ads

1. Verify public HTTPS and crawler access to the canonical host.
2. Confirm ownership and the review of the existing oa.gg site. [Google's site management rules](https://support.google.com/adsense/answer/12170421) do not treat ordinary subdomains as independently managed sites.
3. Coordinate root ads.txt authorization with the root-site owner, preserving existing sellers and unrelated site configuration. [Google's ads.txt FAQ](https://support.google.com/adsense/answer/9785052) requires subdomain references when sellers differ; explicit references may also be used for separate subdomain files. Prepared references are `subdomain=util.oa.gg` and `subdomain=image-compressor.util.oa.gg`. This project has not changed root ads.txt.
4. Confirm Google's site approval. A review request has not been submitted by this project.
5. Establish applicable consent management, including a Google-certified CMP where required, update the English privacy policy and review narrowly necessary CSP changes before loading ad resources.

[Google's connection instructions](https://support.google.com/adsense/answer/7584263) support the verification meta tag used here. Advertising and revenue remain unverified; ads must not block tool use or solicit clicks.
