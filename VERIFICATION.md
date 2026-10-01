# Verification

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
