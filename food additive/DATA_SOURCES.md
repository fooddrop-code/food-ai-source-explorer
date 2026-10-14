# 제품 데이터와 성분 설명의 근거

자료 확인일: **2026-10-14**. 자동 갱신 시스템은 아직 없습니다. 아래 링크는 확인한 원문입니다. 출시 전 개별 성분 설명과 국내 최신 사용기준을 다시 검토해야 합니다.

## 제품 데이터

### 식품안전나라 — 국내 공식 데이터 연결

- [식품안전나라 데이터활용서비스](https://www.foodsafetykorea.go.kr/api/main.do)
- [I1250: 식품(첨가물) 품목제조보고](https://www.foodsafetykorea.go.kr/api/openApiInfo.do?svc_no=I1250)
- [C002: 식품(첨가물) 품목제조보고(원재료)](https://www.foodsafetykorea.go.kr/api/openApiInfo.do?menu_grp=MENU_GRP31&menu_no=661&show_cnt=10&start_idx=1&svc_no=C002)

연결 코드: `server/server.mjs`. I1250에서 제품명으로 검색한 뒤 품목제조보고번호로 C002 원재료를 조회합니다. 인증키는 서버 환경변수 `MFDS_API_KEY`에만 넣습니다. 앱에 키를 넣거나 GitHub에 올리지 않습니다.

공식 문서와 샘플 응답은 확인했습니다. 발급된 사용자 키를 이용한 제품 검색·상세 조회는 아직 검증하지 못했습니다. 서비스 이용 변경 공지가 있어 현재 권한·호출 제한을 확인해야 합니다. 품목제조보고 데이터가 모든 판매 제품의 현재 라벨과 일치한다는 보장은 하지 않습니다.

### Open Food Facts — 현재 작동하는 공개 제품 검색

- [제품 데이터와 이용 조건](https://world.openfoodfacts.org/data)
- [제품명 검색 서비스의 공식 API 문서](https://openfoodfacts.github.io/search-a-licious/users/ref-openapi/)
- [제품 상세 조회 문서](https://openfoodfacts.github.io/documentation/docs/Product-Opener/v2/products/get-product-by-code/)

검색 대상은 `countries_tags:"en:south-korea"`로 제한합니다. 이는 데이터에 한국 판매로 등록되어 있다는 의미이며, 현재 판매 여부를 보장하지 않습니다. 한글 브랜드명이 검색되도록 일부 브랜드 검색어에 영문 대응어를 제공합니다. 대응어는 검색 편의 기능이며 성분 정보를 만드는 데 사용하지 않습니다.

제품 정보는 공개 기여 데이터입니다. 최신성·완전성을 보장하지 않습니다. 각 제품에 원문 링크와 데이터 변경일을 표시합니다. 데이터에는 ODbL 등의 이용 조건이 있으므로, 제품 데이터를 재배포하거나 상용 서비스를 준비할 때 공식 안내를 확인하세요.

## 첨가물의 역할

[식품안전나라: 식품첨가물이란?](https://www.foodsafetykorea.go.kr/portal/board/boardDetail.do?bbs_no=bbs430&menu_grp=MENU_NEW01&menu_no=3725&ntctxt_no=1069700)의 용도별 분류를 참고했습니다.

현재 도감은 레시틴, 구연산, 펙틴, 탄산수소나트륨, L-글루탐산나트륨, 소브산, 안식향산, 이산화규소, 아세설팜칼륨, 아스파탐, 수크랄로스, 이산화티타늄의 12개 설명을 제공합니다. 이산화티타늄과 일부 감미료 설명은 아래 기관 자료를 함께 사용합니다.

이름 탐지는 등록된 별칭·E번호와 제공된 첨가물 분류를 사용합니다. 염류와 모체 성분을 임의로 동일하게 취급하지 않습니다. 등록되지 않은 성분은 누락될 수 있고, 분류 오류가 있을 수 있습니다.

## 평가 자료

| 자료 | 앱에서 사용하는 범위 |
| --- | --- |
| [WHO, Food additives, 2023](https://www.who.int/en/news-room/fact-sheets/detail/food-additives) | 안전성 평가에서 사용 조건과 노출량을 고려한다는 일반 설명 |
| [FDA, Aspartame and Other Sweeteners in Food](https://www.fda.gov/food/food-additives-petitions/aspartame-and-other-sweeteners-food) | 승인된 사용 조건의 감미료 설명, 아스파탐의 PKU 관련 주의 |
| [EFSA, Re-evaluation of lecithins (E322), 2017; amended 2021](https://efsa.onlinelibrary.wiley.com/doi/abs/10.2903/j.efsa.2017.4742) | 보고된 사용·노출 평가 조건에서 만 1세 초과 일반 인구에 관한 결론 |
| [EFSA, Titanium dioxide E171 evaluation, 2021](https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive) | 유전독성 우려를 배제하지 못했다는 유럽 평가 |

미국·유럽 평가를 국내 제품의 적법성이나 개인의 섭취 가능 여부로 바꾸지 않습니다. 도감에서 개별 평가 요약이 준비되지 않은 성분은 **해설 준비중**으로 표시합니다. 이는 안전하다는 뜻도, 위험하다는 뜻도 아닙니다.

## 성분 설명 수정 절차

1. 성분을 정확하게 특정한다. 유사 명칭과 염류를 구분한다.
2. 기관 원문에서 역할, 평가 지역, 시점, 대상 인구, 노출 조건을 확인한다.
3. `src/domain.mjs`의 해당 항목을 수정한다.
4. `assessment`, `caveat`, `sources`, `reviewedAt`을 함께 수정한다.
5. 쉬운 설명 `child`가 원문보다 강한 안전성 주장을 하지 않는지 확인한다.
6. 탐지 별칭을 바꾸면 `tests/domain.test.mjs`에서 오탐·누락을 확인한다.
7. 이 문서의 자료 목록과 검토일을 갱신한다.
