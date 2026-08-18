# Frontend-Backend 연동 후속 Phase 로드맵

## 1. 문서 목적

이 문서는 Backend Phase 1과 Frontend 연동 작업 이후 무엇을 어떤 근거로 진행할지 정하는 진입점이다. 기술 목록을 순서대로 구현하는 계획이 아니라, 현재 확인된 문제와 측정 신호가 다음 Issue로 이어지도록 기준을 남긴다.

Backend의 상세 구현·수치·학습 순서는 기존 문서를 기준으로 한다.

- [Backend Phase 1 구조·근거 맵](https://github.com/SKU-GlobalTimes/GlobalTimes_BeSide/blob/develop/docs/backend-improvement/backend-phase1-evidence-map.md)
- [Backend Phase 1 작업·학습 여정](https://github.com/SKU-GlobalTimes/GlobalTimes_BeSide/blob/develop/docs/backend-improvement/backend-phase1-learning-journey.md)
- [Backend 개선 정량 근거 인덱스](https://github.com/SKU-GlobalTimes/GlobalTimes_BeSide/blob/develop/docs/backend-improvement/backend-improvement-quantitative-index.md)
- [Backend BACKLOG](https://github.com/SKU-GlobalTimes/GlobalTimes_BeSide/blob/develop/docs/backend-improvement/BACKLOG.md)
- [Frontend WORK_PROGRESS](WORK_PROGRESS.md)
- [Frontend-Backend Full-stack E2E](full-stack-e2e.md)

## 2. 현재 기준선

Backend Phase 1은 단일 instance의 주요 문제를 코드·테스트·수치·문서로 설명할 수 있는 상태를 완료 기준으로 삼았다. 이후 Frontend 연동에서는 개선된 API 계약을 실제 사용자 화면과 연결하고 Mock·실호출 E2E로 대표 흐름을 확인했다.

| 축 | 현재 확인한 범위 | 남은 경계 |
| --- | --- | --- |
| 기사 탐색 | 최신·인기·cursor·Explore·검색·상세 API와 화면 연결 | 운영 장기 데이터에서의 사용자 행동 지표 |
| Perspectives | 번역·FULLTEXT·국가 그룹·Redis cache 응답과 화면 이동 | 의미적으로 같은 사건인지에 대한 품질 보장 |
| 인증·사용자 데이터 | JWT 인증, 로그인·비로그인 채팅과 스크랩 분기 | 실제 Google OAuth redirect와 운영 secret 관리 |
| AI·SSE | Mock Gemini 결정적 회귀와 실제 Gemini 요약·로그인 질의 | 실제 provider SLA와 장시간 장애 복구 정책 |
| 수집·Trend | 제한된 News API·RSS·KR Trend 실제 적재와 화면 표시 | 모든 feed·26개국 공급자의 지속 가용성 |
| 자동 검증 | Frontend CI, Backend CI, Mock Full Stack E2E, 수동 External Smoke | 실제 staging·production 배포 환경 |

이 기준선은 모든 외부 데이터와 운영 규모를 검증했다는 뜻이 아니다. 현재 구조의 대표 기능이 Backend에서 Frontend까지 연결되고, 반복 검증할 경로가 준비됐다는 의미다.

### 2.1 연동 작업의 주요 전환점

| 단계 | Issue / PR | 다음 단계로 이어진 이유 |
| --- | --- | --- |
| Backend API 화면 연결 | Frontend #67~#91 | AI SSE, 채팅 이력, 로그인·비로그인 스크랩, cursor·Explore·검색 조건, Perspectives를 화면에 연결해 API별 사용자 경로를 만들었다. |
| API 주소·인증·오류 처리 통합 | [#92](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/92) / [PR #93](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/93) | 흩어진 요청 설정과 성공·실패 판단을 통합해 이후 E2E가 같은 오류 계약을 검증할 수 있게 했다. |
| AI 완료·실패 UX | [#94](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/94) / [PR #95](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/95) | Backend SSE 종료 event와 queue·upstream 오류를 Frontend 상태로 구분해 자동 연동 검증 대상이 명확해졌다. |
| Full Stack E2E 기반 | [#96](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/96) / [PR #97](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/97) | Docker MySQL·Redis, Backend·Frontend와 Playwright를 한 실행으로 묶어 수동 클릭 중심 검증을 반복 가능한 시나리오로 전환했다. |
| 인증 사용자 데이터 E2E | [#98](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/98) / [PR #99](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/99) | fixture JWT가 실제 인증 필터를 통과하고 스크랩·채팅이 MySQL에 저장되는 경로를 고정했다. |
| 검색·Perspectives E2E | [#102](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/102) / [PR #103](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/103) | 번역 cache, FULLTEXT, 국가 그룹과 관련 기사 이동을 화면까지 연결하되 의미 품질은 별도 문제로 남겼다. |
| Frontend 품질 자동화 | [#104](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/104)~[#107](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/107) | ESLint 기준선을 정상화하고 PR build·lint CI를 추가해 연동 변경의 기본 회귀를 자동 검증했다. |
| 공개 탐색·Trend E2E | [#108](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/108)~[PR #111](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/111) | 비로그인 탐색·스크랩과 국가별 Trend·기사 원문 이동까지 대표 공개 사용자 흐름을 확장했다. 여기의 Frontend Issue #110은 Backend 장기 Issue #110과 별개다. |
| 실제 외부 호출 경계 | [#114](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/114) / [PR #115](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/115) | 실제 RSS·Translation·Gemini를 최소 호출해 외부 기사 stream·timeout 같은 비결정적 경계를 확인했다. |
| 결정적 Trend 기능 검증 | [#116](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/116) / [PR #117](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/117) | 기능 검증과 3D 회전·pixel 검증을 분리해 Mock Full Stack E2E를 retry 없이 반복 가능한 수준으로 단축했다. |
| 실제 대표 사이클 완료 | [#118](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/118) / [PR #119](https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/119) | 제한된 News API·RSS·KR Trend 적재부터 실제 요약·로그인 질의·스크랩까지 성공해 연동 확대를 종료하고 성능 단계로 전환할 근거를 마련했다. |

정확한 개별 변경과 검증 수치는 [Frontend WORK_PROGRESS](WORK_PROGRESS.md)를 기준으로 한다. 이 표는 commit 전체 목록이 아니라 다음 작업 선택에 영향을 준 전환점을 보여준다.

## 3. 공통 작업 원칙

후속 Issue는 다음 순서를 따른다.

1. 실제 코드와 현재 build·runtime·데이터 규모를 확인한다.
2. 측정값 또는 재현 가능한 실패를 남긴다.
3. 문서화, 설정 조정, 기존 도구 활용 같은 작은 대안을 먼저 비교한다.
4. 가장 작은 변경으로 문제를 해결한다.
5. 개선 전후 수치 또는 회귀 테스트로 결과를 고정한다.
6. 측정하지 않은 사용자 규모·운영 안정성·검색 품질은 주장하지 않는다.
7. 신규 기술은 현재 해법으로 해결하기 어려운 신호가 반복될 때 ADR에서 비교한다.

기준선만 별도 Issue로 만들지 않는다. 안전하게 측정과 개선을 함께 수행할 수 있으면 한 Issue에서 `기준선 → 변경 → 비교 → 회귀 검증`까지 완료한다.

## 4. Phase 2: 측정 기반 전달 성능

Phase 2의 우선순위는 신규 프레임워크 도입이 아니라 현재 Frontend build에서 이미 보이는 전달 비용을 줄이는 것이다. Backend Phase 2 후보는 기존 진입 조건을 유지하며 별도 지시와 근거 없이 구현하지 않는다.

### 4.1 Frontend 후보

| 순서 | 후보 Issue | 현재 근거 | 수행 범위 | 완료 근거 |
| --- | --- | --- | --- | --- |
| 1 | 초기 JavaScript route 분할 | production build의 초기 JS `633.86 kB`, Vite 500 kB 경고 | route별 import 구조 조사, 비초기 화면 dynamic import, fallback UI, 기존 E2E | 초기 chunk 전후 크기, build·lint·대표 E2E 통과 |
| 2 | 대용량 정적 이미지 최적화 | build 산출물에 약 `1.25~3.28 MB` 이미지 존재 | 실제 표시 크기·첫 viewport 사용 여부 조사 후 필요한 파일만 포맷·해상도·lazy loading 조정 | 전송 크기와 화면 품질 전후 비교, desktop/mobile 확인 |
| 3 | 초기 렌더링 기준선 | bundle과 이미지 중 사용자 체감 병목이 분리되지 않음 | 동일 환경에서 Lighthouse 또는 Web Vitals로 LCP·INP·CLS 측정 | 실행 조건과 대표 route 결과, 후속 병목 선택 근거 |

첫 후보는 route 분할이다. 이미 build 경고와 수치가 있고 React의 기존 dynamic import로 좁게 해결할 수 있어 현재 단계에서 과하지 않다. React Query, 전역 상태 관리 재작성, 전체 component memoization은 실제 중복 요청이나 render 병목을 측정하기 전까지 보류한다.

### 4.2 Backend Phase 2 연결 후보

| 후보 | 현재 신호 | 먼저 할 일 | 기술 비교 조건 |
| --- | --- | --- | --- |
| Perspectives 품질 | 6개 표본 strict Precision@5 `0.267`, candidate 0 사례 | labeled sample 확대, collection·retrieval·ranking 원인 분리 | DB에 관련 기사가 있는데 FULLTEXT가 반복 누락될 때 embedding·Vector DB 비교 |
| 고정 자원 capacity | 로컬 100 RPS부터 DB CPU·Hikari pressure | CPU·memory가 고정된 container 또는 instance에서 재현 | 단일 capacity 확정 뒤에만 다중 instance 효율 비교 |

Perspectives 의미 품질은 Backend Issue #110과 가까운 장기 문제다. 사용자가 별도로 지시하기 전까지 Issue #110을 수정하거나 Phase 2 구현 범위에 포함하지 않는다.

## 5. Phase 3: 회귀 방지 자동화

Phase 3은 Phase 2에서 안정된 수치만 자동 기준으로 승격한다. 기준이 없는 상태에서 CI 제한부터 추가하지 않는다.

| 후보 Issue | 진입 신호 | 작은 시작점 | 보류 조건 |
| --- | --- | --- | --- |
| Frontend 성능 예산 | route 분할·asset 개선 후 안정된 build 결과 확보 | 초기 chunk와 주요 asset 크기 report를 CI artifact로 남김 | dependency update마다 흔들리는 임의의 엄격한 threshold만 설정할 경우 |
| 대표 route 성능 회귀 | 동일 환경에서 반복 가능한 LCP 등 기준선 확보 | 랜딩·검색·상세 중 병목이 확인된 route만 비교 | GitHub Runner 편차가 개선 폭보다 클 경우 |
| 인증·SSE 복구 회귀 | token 만료, 연결 중단, 중복 전송 문제가 재현됨 | Mock server로 실패 상태를 고정한 Playwright 시나리오 | 가능한 모든 오류 조합을 사전에 E2E로 열거하는 경우 |

기능 E2E와 성능 검증은 분리한다. 기존 Mock Full Stack E2E는 API 계약과 사용자 흐름을 결정적으로 확인하고, 실제 외부 API Smoke는 수동 최소 호출을 유지한다. 모든 RSS·Trend 공급자를 PR마다 호출하지 않는다.

## 6. Phase 4: 배포·운영 관측 준비

현재 대상 EC2는 삭제됐고 CI 성공은 배포 성공을 의미하지 않는다. Phase 4는 실제 배포 환경이나 운영 요구가 생길 때 시작한다.

| 후보 Issue | 진입 조건 | 수행 방향 |
| --- | --- | --- |
| staging smoke | 접근 가능한 배포 환경과 secret 운영 방식 확정 | 공개 탐색·인증·대표 AI 흐름의 최소 smoke, 실제 데이터 변경 범위 제한 |
| 외부 공급자 health check | 전체 feed 상태를 운영 중 확인할 필요 발생 | 제품 E2E와 분리한 수동 또는 scheduled 상태 점검, 공급자별 실패 보고 |
| Frontend 오류 관측 | 실제 사용자의 JS·API 오류를 수집할 환경 마련 | 개인정보·token 제외 기준을 먼저 정하고 오류 그룹화 도구 비교 |
| Backend 운영 관측 | 고정 instance에서 latency·resource 상관분석 필요 | Actuator, application log, MySQL, container/instance metric을 같은 구간에서 수집 |

Sentry, Prometheus, Grafana 같은 도구 이름이 Phase 시작 조건은 아니다. 어떤 장애를 어느 시간 안에 발견하고 구분해야 하는지 먼저 정의한다.

## 7. Phase 5: 근거 기반 아키텍처 확장

Phase 5는 어려운 기술을 추가하는 단계가 아니라 기존 구조로 감당하기 어려운 신호가 확인됐을 때 대안을 비교하는 단계다.

| 기술 후보 | 필요한 선행 신호 | 먼저 비교할 단순 대안 | Frontend 영향 |
| --- | --- | --- | --- |
| Kafka·durable queue | 수집 backlog, replay, 독립 consumer, 장시간 source 지연이 scheduler 주기를 침범 | 현재 batch 재실행, DB 상태 기록, bounded executor | 비동기 작업 상태를 사용자에게 보여줄 필요가 있을 때만 상태 API·UI 추가 |
| Vector DB·embedding | DB에 관련 기사가 존재하지만 표현 차이로 FULLTEXT가 반복 누락 | labeled sample 확대, keyword·FULLTEXT·ranking 개선 | Perspectives 응답 계약과 품질 설명 변경 가능성 |
| retry·circuit breaker | 외부 API 실패율과 복구 목표, idempotent 재시도 경계가 정의됨 | timeout·오류 분리·수동 재시도 | retry 가능 여부, 대기·실패 상태와 사용자 재시도 UI |
| 분산 락·Redis Lua | multi-instance 경쟁과 Redis 다중 명령 부분 실패가 재현됨 | DB UNIQUE·row lock·Redis 단일 명령 | 일반적으로 API 계약 변화 없음 |
| scale-out | 고정 자원 단일 instance capacity와 병목이 확정됨 | query·pool·thread 설정 개선과 vertical resource 비교 | sticky session 또는 상태 저장 방식이 바뀔 때만 영향 |

기술 도입 ADR에는 최소한 다음을 포함한다.

- 현재 문제와 재현 조건
- 기존 방식의 한계 수치
- 가장 단순한 대안
- 후보 기술의 운영 비용과 실패 방식
- 성공·중단 기준
- Backend API 계약과 Frontend UX 변경 여부
- 도입하지 않을 때의 판단

## 8. 후보 Issue 진행 순서

현재 근거만으로 바로 시작할 수 있는 순서는 다음과 같다.

1. `[PERF] 초기 JavaScript bundle route 단위 분할 및 크기 비교`
2. route 분할 결과를 보고 `[PERF] 대용량 정적 이미지 전달 비용 개선` 여부 판단
3. 사용자 체감 병목이 남으면 `[PERF] 주요 route Web Vitals 기준선 및 병목 분리`
4. 안정된 수치가 확보되면 `[CI] Frontend 성능 결과 자동 기록 및 예산 검토`
5. 배포 환경이 생기면 Phase 4의 staging·관측 후보 조사
6. Backend Phase 2·5 후보는 각 표의 선행 신호가 확인될 때 별도 Issue·ADR로 시작

개발 과정에서 별도의 오류나 데이터 계약 문제가 재현되면 위 순서를 고집하지 않는다. 사용자 영향과 회귀 위험이 큰 문제를 먼저 독립 Issue로 처리한다.

## 9. 완료·제외 경계

이 로드맵 작성으로 다음이 구현됐다고 주장하지 않는다.

- 전체 RSS·26개국 Google Trends의 지속 가용성
- 실제 Google OAuth 로그인과 운영 secret 관리
- Perspectives 의미적 관련성 개선
- production capacity 또는 대규모 트래픽 처리량
- multi-instance·Pod scale-out
- Kafka, Vector DB, circuit breaker, 분산 락

로드맵은 위 작업의 필요성을 미리 확정하지 않는다. 측정 신호가 생겼을 때 같은 기준으로 조사와 ADR을 시작할 수 있도록 경계를 고정한다.
