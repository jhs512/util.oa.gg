# Chronos-2 browser inference verification

Verified October 2, 2026 (Korea time). Scope: feasibility of real Chronos-2 forecasting in a desktop browser before adding a public utility. No production assets were changed and nothing was deployed.

## Result

**Passed:** the actual forecasting graph derived from `amazon/chronos-2` ran in Chrome and Edge using ONNX Runtime Web's single-thread WASM execution provider. It produced 64 future steps with 21 quantiles each, not embeddings or a substitute statistical forecast. After downloading the model and loading the runtime, the browser was explicitly switched offline; four inference calls still completed with no additional network requests.

This establishes local desktop browser execution. It does not establish Korean-stock prediction accuracy, API connectivity, mobile performance, Safari/Firefox compatibility, production memory limits or readiness to deploy.

## Model and source provenance

- Amazon's [official Chronos repository](https://github.com/amazon-science/chronos-forecasting) and [model](https://huggingface.co/amazon/chronos-2) describe Chronos-2 forecasting. Amazon does not supply this tested browser artifact directly.
- The independent [sktime export project](https://github.com/sktime/tsfm-onnx/tree/ada4262e90e707aa37980999baef78f4af8ec4ca) wraps `Chronos2Model.forward`, passes the context and group IDs, and transposes its quantile prediction tensor. [Exporter source](https://github.com/sktime/tsfm-onnx/blob/ada4262e90e707aa37980999baef78f4af8ec4ca/scripts/export_chronos2_onnx.py) documents its export-safe group-mask cast and export validation. This is a forecasting graph, unlike an embedding-only conversion.
- Tested [INT8 model](https://huggingface.co/sktime/chronos2-onnx-int8/tree/181457aad06ff127381195c62e58b73a397b42ea): `chronos2-ctx2048-h64-int8.onnx`, **131,271,973 bytes (131.27 decimal MB / 125.19 MiB)**. Browser-computed SHA-256 matched its [manifest](https://huggingface.co/sktime/chronos2-onnx-int8/blob/181457aad06ff127381195c62e58b73a397b42ea/manifest.json): `498b95c8902984ff4876dbd12f457163607a0ee1b1241024cefdce7104dd26c8`.
- Input contract: `context float32[batch,2048]` with NaN left-padding for shorter histories, `group_ids int64[batch]`. Output: `quantiles float32[batch,64,21]`. The tested graph has a fixed 64-step horizon and 2048-point context; known future covariates are not included in this artifact.
- Runtime: `onnxruntime-web@1.27.0`, downloaded from npm into the isolated verification folder. [Microsoft's browser documentation](https://onnxruntime.ai/docs/tutorials/web/) describes WASM and other browser providers. The test explicitly selected `executionProviders: ['wasm']` and `numThreads: 1`; WebGPU was available but **not used or tested**.

## Actual environment and measurements

Windows 10.0.26300, Intel Core i9-12900KF, 24 logical CPU cores, 34,141,790,208 bytes physical RAM. Playwright controlled installed browser channels in **headless** mode. These are measurements on this PC, not universal latency guarantees. Peak process/GPU memory was not measured.

| Measurement | Chrome, remote download | Edge, local model delivery |
| --- | ---: | ---: |
| Browser version | 154.0.8037.58 | 154.0.4258.48 |
| Model download/body read | 5,603 ms | 292 ms |
| Hash + runtime/session creation | 769 ms | 839 ms |
| Combined model fetch and session creation | 6,372 ms | 1,131 ms |
| First airline forecast | 475 ms | 475 ms |
| Temperature forecast | 404 ms | 406 ms |
| Airline shifted by +100 | 383 ms | 387 ms |
| Repeated airline forecast | 397 ms | 390 ms |
| Requests before / after all offline inference | 8 / 8 | 7 / 7 |

Chrome used a fresh browser context and directly fetched the pinned Hugging Face model URL, successfully following its CDN redirect under browser CORS rules. The 5.6-second number is this connection's observed download time, not a guaranteed cold CDN/network time. No model cache was implemented. Edge's model was served over localhost and its 292-ms number must **not** be described as Internet loading time. Runtime files, page and fixtures were served locally in both tests. The local HTTP server only served files; all forecast computation occurred inside the browser WASM runtime.

## Checks and evidence

1. Exact model hash and size matched the model publisher's manifest.
2. Direct `ort.InferenceSession.create` and `session.run` calls were used. The harness has no fallback, remote inference API or alternate forecaster.
3. Airline passengers and daily minimum temperatures were forecast separately from their held-out histories. Every run returned shape `[1,64,21]`, 1,344 finite float values. A third input shifted the airline history by +100; outputs changed accordingly. A repeated original call produced exactly the same outputs (`max difference = 0`).
4. After session/runtime/fixtures were loaded, Playwright set the browser context offline before all four inference runs. The recorded request count did not increase. Recorded requests contain only GETs for page, model, runtime and fixtures; no inference request or input upload.
5. Compared five displayed quantile levels against the upstream fixtures generated using Amazon's original `Chronos2Pipeline.predict` on identical NaN-padded context. Maximum absolute difference as a fraction of reference forecast spread was **2.9255% for airline** and **1.5161% for temperatures**. This is quantized-model/reference drift, **not forecast error against future actual observations**. The fixture generator and reference values were inspected and saved; the official PyTorch reference computation was not rerun independently on this PC.
6. The +100 input is a sensitivity/translation check, not a fresh PyTorch parity case. Its output differs from original output +100 by as much as 12.5851 units (quantization can depend on input scaling). Comparing to the original upstream reference +100 yields maximum 2.9345% of reference spread; no claim of exact translation invariance is made.
7. **Quantile crossing exists:** 9 adjacent-quantile inversions across the 64-step airline result, 0 for temperatures. Raw outputs were retained without sorting or changing them. A production confidence-band display must address/report crossing rather than assume every raw quantile is ordered.

Raw evidence is under `verification-artifacts/chronos-browser/` (already excluded from Git and the public asset allowlist):

- `evidence-chrome-remote.json`: final Chrome measurements, every output value and request list.
- `evidence-msedge-local.json`: final Edge measurements, output values and request list.
- `evidence.json`: initial local Chrome run, retained as historical raw evidence; the final files above supersede it. Its original shifted-input error compares against unshifted reference and must not be used as a parity claim.
- `browser-chrome-remote.png`, `browser-msedge-local.png`: browser result screenshots.
- `index.html`, `run.cjs`: minimal direct browser harness and Playwright runner.
- `manifest.json`, `hf-model-info.json`, `upstream-commit.json`: pinned model/repository provenance.
- `airline-passengers.json`, `daily-min-temperatures.json`, `upstream-demo-data.py`, `upstream-export.py`, `upstream-forecaster.js`: source fixtures and inspected upstream source snapshots.
- `chronos2-int8.onnx`: actual locally downloaded model; it is not a public asset.

## Reproduce

From `C:\works\low-involvement-app\verification-artifacts\chronos-browser`, with the saved model/fixtures and existing parent Playwright installation:

```powershell
npm ci
$env:CHRONOS_BROWSER_CHANNEL = 'chrome'
$env:CHRONOS_MODEL_SOURCE = 'remote'
node run.cjs
$env:CHRONOS_BROWSER_CHANNEL = 'msedge'
$env:CHRONOS_MODEL_SOURCE = 'local'
node run.cjs
```

The runner starts an isolated file server on `127.0.0.1:8923`, launches the selected browser, downloads/loads the model, switches offline, writes evidence and exits. No credentials are needed. To redownload the exact weights, use the pinned model URL saved in `evidence-chrome-remote.json`; compare its hash to `manifest.json` before use.

## Next decision

Browser-only prediction is technically feasible on the tested PC, and WASM is sufficient; a backend is not required for **inference**. The model's 131-MB initial transfer, CPU cost, browser memory behavior, download caching/worker packaging and quantization drift still need product engineering. Korean-stock history retrieval is a separate task. Before presenting forecasts as useful for trading, evaluate genuinely unseen stock periods against a simple last-price baseline and account for data leakage and uncertainty calibration. This verification alone supplies no evidence of profitable stock predictions.
