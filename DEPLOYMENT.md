# Cloudflare 공개 배포

## 최신: util.oa.gg 허브 (2026-10-01)

- 이 기존 프로젝트가 허브 전체를 소유하며 별도 프로젝트는 만들지 않았다. 저장소는 **https://github.com/jhs512/util.oa.gg (공개, main)**이며 생성·push를 확인했다.
- 기존 Worker `ddak-image-compressor`를 유지해 이미지 압축, 글자 수·UTF-8 바이트 계산, 파일 용량 단위 변환을 배포했다. **https://ddak-image-compressor.jangka512.workers.dev**에서 사용할 수 있다.
- 현재 배포 버전은 `7a09eadb-1927-4cfc-9f55-9a6aab0dc519`다. Workers 무료 플랜을 유지하고 유료 인증서·add-on·결제를 선택하지 않았다.
- 같은 Worker에 `util.oa.gg`, `image-compressor.util.oa.gg`, 기존 `compress.oa.gg` Custom Domain을 연결했다. 새 두 호스트는 충돌이 없었고 Cloudflare 권한 DNS에서 실제 A/AAAA 레코드 생성을 확인했다. 기존 root/www/다른 앱/MX는 변경하지 않았다.
- DNS 담당이 Cloudflare zone 활성화를 확인했다. Google DNS(8.8.8.8)는 새 호스트 주소를 반환하지만 일부 캐시는 이전 이름 서버를 사용한다. **image-compressor.util.oa.gg는 정상 TLS와 실제 PC/모바일 압축·다운로드를 확인했다. util.oa.gg는 마지막 검사에서 인증서 handshake 실패로 대기 중이다. 주 주소의 접속 완료로 표시하지 않는다.**
- [Cloudflare 공식 문서](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/#certificates)에 따르면 Custom Domain은 여러 단계의 서브도메인 인증서를 자동 생성하고 별도 ACM 구독이 필요 없다. 실제 공개 TLS 성공은 별도 검증해야 한다.
- 대표 이미지 페이지 canonical은 `https://util.oa.gg/`이고 이미지 전용/기존 호스트는 동일 HTML을 제공한다. sitemap과 공개 내부 링크를 대표 주소에 맞췄다. 독립 도구는 독립 콘텐츠와 경로를 제공한다. [SEO.md](SEO.md)를 참조한다.
- 실제 AdSense 게시자 메타 태그와 `/ads.txt`를 준비했다. oa.gg의 승인 상태는 검토 필요이므로 광고를 실행하지 않는다. 루트 ads.txt와 소유권 확인·Google 검토·동의 준비는 [ADVERTISING.md](ADVERTISING.md)에 기록했다.

### 최신 검증

로컬 PC/모바일 **24 passed (10.5s)**, 공개 기본 URL **24 passed (17.9s)**. 마지막 공개 탐색 링크 수정 후 관련 허브 검증 **6 passed (4.8s)**, 로컬 내부 링크 수정 후 **6 passed (1.1s)**. 기존 실제 사진·다운로드·투명도·실패 테스트를 유지했다. 새 도구는 한국어/이모지/공백/UTF-8와 십진/이진 단위·음수 거부를 확인했다. 공개 canonical·sitemap·개인정보 페이지·광고 스크립트 비활성을 검사했다.

`node scripts/capture.cjs`로 공개 실제 사진 결과의 PC·모바일 스크린샷을 재현할 수 있다. 결과는 `verification-artifacts`에만 저장되고 git 및 공개 assets에서 제외한다. `TEST_BASE_URL`로 검증할 주소를 지정할 수 있다.

`node scripts/domain-smoke.cjs`는 Google 공개 DNS로 두 전용 호스트를 해석하고 인증서를 정상 검증하며 실제 다운로드를 검사한다. 시스템 DNS나 인증서 검증 설정은 바꾸지 않는다. 이미지 전용 주소의 PC·모바일 결과는 각각 **9,956 B**, 서버 업로드·외부 요청 0, 정상 WebP였다. `util.oa.gg` 인증서가 준비되지 않아 전체 스크립트의 종료 코드는 1이다. 이는 주 주소가 아직 미완료라는 결과를 유지하기 위한 동작이다.

Custom Domain을 실제 검사하면서 Cloudflare 분석 스크립트 자동 삽입을 발견했다. [공식 FAQ](https://developers.cloudflare.com/web-analytics/faq/#my-website-is-proxied-through-cloudflare-but-web-analytics-automatic-setup-is-not-working)에 따라 앱 응답에 `Cache-Control: public, no-transform`을 추가했다. CSP를 완화하거나 다른 사이트의 분석 설정을 변경하지 않았다. 재검증에서는 삽입된 외부 스크립트 요청도 없었다.

사용자 공개 저장소 답변에 따라 GitHub 공개 전환과 사이트의 소스 코드·오류 제보 링크 복원을 완료했다. 재배포 후 공개 허브 관련 검증 **6 passed (4.3s)**, 실제 공개 소스 링크를 확인했다.

### 다음 완료 기준

두 전용 호스트에서 **정상 인증서(검증 우회 없음)·HTTP 200·동일 이미지 페이지·실제 압축/다운로드**를 확인한다. 구성은 이미 완료됐으므로 도메인을 다시 추가하거나 원래 DNS를 덮어쓰지 않는다. 전파 후 canonical 주소로 Search Console 확인을 진행하고 AdSense는 승인/동의 조건이 준비된 뒤 활성화한다. 매출·검색 순위는 보장하지 않는다.

아래는 초기 압축기 배포 이력이며 현재 상태는 위 최신 보고를 기준으로 한다.

## 초기 배포 이력

2026-10-01 배포·검증. 승인된 첫 이미지 압축기만 배포했다.

## 확인된 상태

- **공개 기본 URL:** https://ddak-image-compressor.jangka512.workers.dev — 정상 HTTPS, HTTP 200.
- **호스팅:** Cloudflare Workers Static Assets. Worker 이름 `ddak-image-compressor`, 계정 `94c70c86e43f500a7ce46e85347e8d5e`. Workers 요금제 화면에서 **무료 US$0 / 현재 요금제**를 직접 확인했다. 앱 처리용 서버 스크립트·DB·KV·업로드 API·유료 add-on은 없다.
- **버전:** `b1532b9c-7ac7-4222-b373-515aebcdaf7a`, 100% 배포. 게시 시각 2026-10-01 10:28 KST.
- **전용 도메인 구성 완료 / 접속 대기:** DNS 담당 완료 보고에 따르면 `compress.oa.gg`를 이 Worker production의 Custom Domain으로 등록했고 자동 DNS 레코드가 생성됐다. 기존 8개 DNS 레코드는 보존했다. 마지막 확인에서는 oa.gg zone pending과 공개 NS의 DNSZi 응답이 유지되어 전용 도메인 인증서·HTTPS 접속 성공은 아직 확인하지 않았다. 도메인 추가 작업을 반복하지 않는다.
- 기존 root/www/다른 호스트/MX/프록시 설정은 이 배포 작업에서 변경하지 않았다. nameserver 이전은 별도 DNS 담당 작업이다.

[공식 정적 assets 요금 문서](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)상 정적 파일 요청은 무료이고 저장 비용도 없다. 이 앱은 정적 assets만 사용하며 유료 플랜·결제·추가 상품을 선택하지 않았다. API/SSR 같은 기능을 추가하면 비용 구조를 다시 확인해야 한다.

## 공개 검증

공개 기본 URL에서 `TEST_BASE_URL`로 기존 PC·모바일 에뮬레이션 검증을 실행했다. **18 passed (19.1s)**, 실패·스킵 0. 실제 사진: JPEG 17,994 B → WebP 9,956 B, 10 KB 목표 달성. 실제 파일 다운로드와 재디코딩, 알파 유지, JPG 흰 배경, PNG 축소, 목표 미달, 형식/손상/애니메이션 거부, 드롭·키보드 확인을 포함한다.

PC 1280×960 및 모바일 390×844의 공개 결과 화면을 직접 확인했다. 실제 스마트폰/Safari/Firefox는 기존과 동일하게 미검증이다. 이미지 처리 중 외부 요청 또는 POST 업로드가 관찰되지 않았고, 공개 HTTP 응답에 `connect-src 'none'` CSP가 적용된다. 호스팅에 대한 일반 페이지 요청은 Cloudflare를 거친다.

공개 assets는 allowlist로 `index.html`, `style.css`, `app.js`, `compressor.js` 네 파일과 응답 정책 `_headers`만 준비한다. `_headers`는 Cloudflare가 처리하고 공개 파일로 제공하지 않는다. 다음 경로는 실제 **404** 확인: README/RESEARCH/VERIFICATION/AGENTS 문서, package.json, wrangler.jsonc, 테스트 사진, 테스트 스크린샷, server.cjs, `_headers`.

## 재배포

```powershell
npm ci
npm run deploy
```

`build-assets.cjs`는 승인한 파일만 `dist`에 복사하며 예상 밖 파일이 있으면 중단한다. 공개 사이트에서 재검증:

```powershell
$env:TEST_BASE_URL='https://ddak-image-compressor.jangka512.workers.dev'
npm test
Remove-Item Env:TEST_BASE_URL
```

Wrangler OAuth 로그인은 기존 사용자 계정을 사용한다. 자격 증명은 프로젝트에 복사하거나 게시하지 않는다.

## 전용 도메인과 남은 검증

DNS 담당이 `ddak-image-compressor` Worker의 **Custom Domain**으로 `compress.oa.gg` 등록을 마쳤다. [공식 Custom Domain 문서](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)상 동작에는 active zone이 필요하며 이 방식은 Cloudflare가 DNS 레코드와 인증서를 관리한다. workers.dev 주소를 향하는 수동 CNAME을 추가하지 않는다.

대시보드의 연결이 후속 배포에서 유지되도록 `wrangler.jsonc`에 아래 routes를 기록했다. 이 설정 기록 후 추가 배포나 DNS 변경은 하지 않았다. pending 동안에는 불필요한 재배포를 반복하지 않는다.

```json
"routes": [{ "pattern": "compress.oa.gg", "custom_domain": true }]
```

남은 작업은 zone 활성화/전파 후 공개 DNS·정상 인증서·HTTP 200과 `TEST_BASE_URL=https://compress.oa.gg`의 압축/다운로드를 확인하고 이 문서와 전달 보고서를 갱신하는 것이다. 구성은 이미 완료되었으므로 같은 Custom Domain을 다시 추가할 필요가 없다. 필요한 범위는 이 새 호스트의 관리뿐이며 기존 DNS를 변경할 필요는 없다. OAuth 권한 오류가 나오면 기존 로그인 브라우저의 공식 UI로 작업하며 쿠키/토큰을 추출하지 않는다.
