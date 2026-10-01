# util.oa.gg 검색 구조

## 대표 URL

| 기능 | 대표 URL |
|---|---|
| 목표 용량 이미지 압축 | https://util.oa.gg/ |
| 글자 수·UTF-8 바이트 계산 | https://util.oa.gg/text-counter/ |
| 용량 단위 변환 | https://util.oa.gg/data-size/ |

`image-compressor.util.oa.gg/`, 기존 `compress.oa.gg/`와 Worker 기본 주소도 같은 이미지 압축 페이지를 제공한다. 요구된 여러 검색 입구를 리다이렉트로 없애지 않고, 서버가 제공하는 HTML의 canonical을 `https://util.oa.gg/`로 통일한다. 다른 페이지도 같은 경로의 util.oa.gg URL을 canonical로 사용한다.

대표 호스트의 sitemap만 URL 목록에 사용하고 내부 도구 링크도 해당 대표 주소로 연결한다. 각 실제 기능에 별도의 제목·설명·사용 방법·한계를 제공하며, 존재하지 않는 기능이나 단순 키워드 복제 페이지를 만들지 않는다. 기본 HTML에 메타데이터와 본문이 있어 JavaScript 실행 없이 읽을 수 있다.

[Google canonical 안내](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)에 따른 중복 신호 정리이며 Google이 선택한 canonical이나 순위·검색 노출을 보장하지 않는다. 공개 DNS/HTTPS가 완료된 뒤 Search Console에서 sitemap 제출·URL 검사·대표 URL 선택을 확인해야 한다. Search Console 등록/검증 토큰은 아직 확인하거나 연결하지 않았다.

다음 운영 실험은 도구별 실제 사용자 완료율·품질 피드백과 검색 노출·클릭을 관찰하는 것이다. 현재 입력을 수집하는 분석 SDK는 없으며 파일·텍스트 수집 없이 집계 방법을 따로 설계한다. 광고 승인과 매출은 검색 수요의 증명이 아니다.
