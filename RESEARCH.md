# Target-size image compression: evidence and next experiments

Research date: October 1, 2026. This document explains design choices, not proven demand or revenue. The product now targets international users in English.

## Existing competition and demand hypothesis

Public search results for target-KB compression contain existing tools. [imgbox](https://www.theimgbox.com/tools/compress-image-kb) offers target-KB compression. [PicsFit](https://picsfit.com/compress-image-to-kb/) describes KB/MB targets and quality/size priorities. [LocalTools](https://uselocaltools.com/en/tools/compress-to-target-kb) describes local processing, actual output bytes and nearest results when a target is unreachable. These are observed public feature descriptions, not comparative performance tests.

The hypothesis is that users facing upload limits want fewer cycles of adjusting quality and checking file size. Competitor pages establish that this problem is addressed by tools; they do not establish search volume, conversion, willingness to pay or revenue. Target-size compression is not claimed as unique.

## Browser API basis

[createImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap) decodes image blobs; support varies by options and browser. The input contract is narrower than everything the API might decode.

[canvas.toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) can return null, and unsupported output types can fall back to PNG. The implementation validates both output existence and MIME type. Quality settings apply to lossy formats such as JPEG/WebP, rather than PNG. The [HTML standard](https://html.spec.whatwg.org/multipage/canvas.html#dom-canvas-toblob-dev) defines serialization behavior.

Success is based on actual Blob bytes. Encoder quality values are not visual-quality scores. Results vary by browser; tiny targets can fail within the minimum quality and dimension constraints. JPG needs an explicit background for transparency, and canvas re-encoding may remove metadata.

## Next experiments

Observe a small set of international users completing a real target-size task. Manually record completion time, target failures and perceived quality without collecting their images. After Search Console ownership is verified, observe English search impressions and clicks over several weeks. Low impressions require checking indexing and ranking before inferring no demand.

Any later aggregate measurement must avoid images, filenames and pasted text and have appropriate disclosure. Download clicks do not prove successful submission elsewhere. Assess qualified traffic, repeated use and operating costs before revenue experiments; assumed traffic or ad rates are not revenue evidence.
