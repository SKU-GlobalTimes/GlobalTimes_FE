# Frontend Improvement Work Progress

프론트엔드 개인 검증 작업의 현재 상태와 다음 세션 기준을 기록합니다.

## 작업 절차

`Issue → Branch → 조사 → 계획 → 승인 → 구현 → Build/Lint/API/브라우저 검증 → PR → AI Reviewer → Blocking 확인 → 사용자 승인 → squash merge`

- Issue와 PR 본문은 저장소 템플릿을 읽고 `--body-file`로 작성합니다.
- Reviewer Agent는 별도 대화에서 PR diff만 검토하고 `## AI Reviewer 검토 결과` 제목으로 comment를 남깁니다.
- `MERGE_READY`이고 Blocking이 없어도 사용자 승인 후 merge합니다.
- 구현, 검증 보조 코드와 작업 진척 문서는 가능한 한 하나의 squash commit으로 정리합니다.

## In Progress

### #108 공개 기사 탐색·비로그인 스크랩 실제 Backend 연동 E2E

- Issue: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/108
- PR: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/109
- 목적: 공개 사용자의 메인 기사 탐색부터 비로그인 스크랩 목록 복원까지 실제 Frontend → Backend → MySQL 계약을 자동 검증합니다.
- 기존 공백: 상세·익명 SSE, 인증 스크랩·채팅, 검색·Perspectives E2E는 있지만 인기·cursor 최신·Explore·비로그인 `/api/scrap`의 브라우저 검증은 없습니다.
- Overengineering 판단: 기존 Playwright·MySQL fixture·Full Stack E2E orchestration만 확장하며 신규 Backend API·프레임워크·외부 API 실호출은 추가하지 않습니다.
- 검증 범위:
  - 메인 화면 `/api/articles/popular`와 `/api/articles/cursor` 실제 응답·카드 렌더링
  - `US + technology` Explore UI 조작과 `/api/articles/explore` query·fixture 결과
  - Explore 카드 상세 이동과 비로그인 localStorage 스크랩 저장
  - 마이스크랩 진입 후 `/api/scrap` 실제 조회와 카드 복원
- Mock 경계: UI 번역과 이 시나리오 범위 밖의 Perspectives만 Mock하며 기사 목록·Explore·상세·요약·스크랩은 실제 Backend 경로를 사용합니다.
- 검증 결과:
  - 전체 ESLint 통과 (`0 errors / 0 warnings`)
  - Vite 7 Production build 통과 (`2,339 modules`, `21.20s`)
  - 로컬 Full Stack E2E 4개 시나리오 통과 (브라우저 `39.4s`, 전체 orchestration `231.2s`)
  - MySQL·Redis container와 network cleanup 완료
  - 첫 sandbox 실행은 Docker named pipe 접근 거부로 readiness 실패했으며, 권한이 적용된 동일 스크립트 재실행으로 코드와 환경 원인을 분리해 통과
  - Reviewer Blocking: popular API의 최근 30일 조건 때문에 고정 발행일 fixture가 만료되는 문제를 실행 시각 1시간 전 발행일과 재실행 갱신으로 보완
  - Blocking 반영 후 로컬 Full Stack E2E 4개 재통과 (브라우저 `37.5s`, 전체 orchestration `167.2s`)
  - GitHub Ubuntu Runner 검증 예정

## Recently Merged

### #106/#107 Frontend Build·Lint PR 자동 검증 구축

- Issue: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/106
- PR: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/107
- Squash commit: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/commit/8f9f5156c9e941b00c4eb2bf12ba7549f75575cd
- 목적: #104에서 정상화한 ESLint 기준선과 production build를 모든 `develop` 대상 PR에서 자동 검증합니다.
- 구현 범위:
  - Node `20.19.0`, npm cache, `npm ci` 기반 재현 가능한 의존성 설치
  - `npm run lint`와 `npm run build` 순차 실행
  - `contents: read` 최소 권한, 10분 timeout, 동일 PR 이전 실행 취소 적용
  - Docker·Backend가 필요한 opt-in Full Stack E2E와 빠른 Frontend 기본 CI 분리
- 검증 결과:
  - 로컬 전체 ESLint 통과 (`0 errors / 0 warnings`)
  - Vite 7 Production build 통과 (`2,339 modules`, `20.41s`)
  - 신규 Frontend CI가 PR 생성·최신 HEAD에서 자동 실행되어 성공 (`26s`, run `31569913642`)
  - AI Reviewer `MERGE_READY`, Blocking 없음 확인 후 사용자 승인으로 squash merge

### #104/#105 Frontend ESLint 오류·경고 해소 및 품질 기준선 정상화

- Issue: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/104
- PR: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/105
- Squash commit: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/commit/b8547b1d912f2456813b0639af2a796298666719
- 목적: 기존 ESLint 위반을 해소해 이후 PR 단위 Build·Lint 자동 검증을 적용할 수 있는 정적 분석 기준선을 만들었습니다.
- 초기 기준선: 전체 ESLint `17 errors / 4 warnings`
- Overengineering 판단: ESLint 메이저 업그레이드나 신규 규칙 도입 없이 기존 설정에서 확인된 위반만 해소했습니다.
- 변경 범위:
  - 번역·언어 선택·최근 기사·인트로 컴포넌트의 PropTypes 계약 보완
  - 검색·스크랩 컴포넌트의 사용하지 않는 props와 호출부 전달값 제거
  - 날짜 선택·검색 카드 번역·OAuth callback effect 의존성 정합화
  - 인증 함수를 `useCallback`으로 안정화하고 Language context와 Provider 책임 분리
- 검증 결과:
  - 전체 ESLint `17 errors / 4 warnings → 0` (`--max-warnings 0` 통과)
  - Vite 7 Production build 통과 (`2,339 modules`, `34.72s`)
  - `git diff --check` 통과
  - 로컬 Full Stack E2E는 Docker Desktop Engine 미준비로 보류했으나 동일 HEAD의 GitHub Ubuntu Runner에서 성공 (`1m 23s`, run `31568873810`)
  - AI Reviewer `MERGE_READY`, Blocking 없음 확인 후 사용자 승인으로 squash merge

### #102/#103 다국어 검색·Perspectives 실제 Backend 연동 E2E

- Issue: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/102
- PR: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/103
- Squash commit: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/commit/37be0ee5407f13e0256d46b8b6ac657544d073b5
- 목적: Backend Phase 1의 번역 cache·MySQL FULLTEXT·Perspectives 국가 그룹·Redis cache 계약을 실제 Frontend 화면까지 자동 검증합니다.
- 실제 경로:
  - 한국어 검색 입력 → Backend `/api/search` → Redis 번역 cache hit → MySQL FULLTEXT 원문·번역어 검색
  - 한국 기준 기사 상세 → Backend `/api/news/{id}/perspectives` → 국가별 관련 기사 계산·Redis cache 저장과 warm 재조회
  - Perspectives 미국 기사 카드 → 실제 상세 API와 client-side route 이동
- Fixture·Mock 경계:
  - MySQL에 동일 이슈의 한국·미국·일본 기사와 언론사 fixture를 적재합니다.
  - Backend 번역은 Redis에 미리 넣은 고정 결과를 사용해 실제 `TranslationService` cache 경로를 통과하며 Google Translation API는 호출하지 않습니다.
  - 브라우저 UI 번역과 Gemini upstream만 기존처럼 Mock하고 검색·FULLTEXT·Perspectives·Redis는 실제 경로를 사용합니다.
- Overengineering 판단: 신규 Backend API나 테스트 프레임워크 없이 기존 Playwright·MySQL·Redis orchestration을 확장했습니다.
- 연동 중 발견한 문제:
  - Windows PowerShell native stdin으로 SQL을 전달하면 한글이 `????`로 손상되어 `docker compose cp` 후 container 내부 mysql client로 적재하도록 변경했습니다.
  - CSS animated placeholder는 실제 input `placeholder` 속성이 아니므로 Playwright textbox role을 사용했습니다.
  - 같은 관련 기사가 Perspectives와 최근기사에 함께 노출되어 strict locator를 button 카드로 한정했습니다.
  - 첫 Ubuntu Runner에서 Docker probe가 순간 실패하자 Linux는 재시도 없이 종료되어, Windows·Linux 모두 최대 120초 bounded readiness retry를 사용하도록 보완했습니다.
- 검증 결과:
  - 익명·인증·검색/Perspectives Playwright 3개 시나리오 통과 (`13.6s`)
  - 전체 Backend·MySQL·Redis orchestration과 cache key 확인·cleanup 완료 (`71.0s`)
  - Vite 7 Production build 통과 (`2,338 modules`, `7.09s`)
  - 신규 E2E ESLint, PowerShell parser와 `git diff --check` 통과
  - 최종 HEAD GitHub Full Stack E2E 성공 (`1m 32s`, run `31524168174`)
  - AI Reviewer `MERGE_READY`, Blocking 없음 확인 후 사용자 승인으로 squash merge

### #100/#101 Frontend 취약 의존성 단계적 업데이트 및 E2E 회귀 검증

- Issue: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/100
- PR: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/101
- Squash commit: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/commit/5210004b85f337c22d6902745007f3090a92e709
- 목적: 오래된 npm 의존성에 누적된 수정 가능한 보안 경고를 제거하고, 업데이트 이후 기존 Frontend-Backend 연동에 회귀가 없는지 검증합니다.
- 초기 기준선:
  - GitHub Dependabot: Critical 1, High 35, Medium 37, Low 4
  - 로컬 `npm audit`: Critical 1, High 13, Moderate 5, Low 1로 취약 패키지 20개
  - Critical 경로: `axios 1.8.4 → form-data 4.0.2`
- 변경 범위:
  - Axios `1.8.4 → 1.19.0`, React Router DOM `7.4.0 → 7.18.2`
  - Vite `5.4.15 → 7.3.6`, React plugin `4.3.4 → 5.1.4`
  - Vite 7 요구사항에 맞춰 프로젝트 Node 범위를 `^20.19.0 || >=22.12.0`, GitHub Actions를 `20.19.0`으로 정렬
  - `react-loader-spinner`의 취약 PostCSS 전이 경로는 허용 범위의 `styled-components 6.5.2` override로 제거
- Overengineering 판단: 보안 수정과 무관한 React 19, ESLint 10, Vite 8 및 전체 의존성 최신화는 제외했습니다.
- 검증 결과:
  - `npm ci` 재현 설치 및 `npm audit --audit-level=low` 통과 (`20 → 0`)
  - Vite 7 Production build 통과 (`2,338 modules`, `14.09s`)
  - 전체 lint는 변경 전과 동일한 기존 기준선 `17 errors / 4 warnings`이며 신규 회귀 없음
  - 실제 Frontend → Backend → MySQL/Redis 익명·인증 Playwright 2개 시나리오 통과 (`36.7s`)
  - Full-stack orchestration과 container/network cleanup 완료 (`106.9s`)
  - 최종 HEAD GitHub `ubuntu-latest` Node `20.19.0` Full Stack E2E 성공 (`1m 11s`, run `31520997000`)
  - AI Reviewer `MERGE_READY`, Blocking 없음 확인 후 사용자 승인으로 squash merge

### #98/#99 인증 사용자 스크랩·채팅 실제 연동 E2E

- Issue: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/98
- PR: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/99
- Squash commit: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/commit/30fad8da8ccd42bfad035b81f89ecc702632a4c1
- 목적: OAuth 성공 이후 JWT 인증 사용자의 스크랩·AI 채팅 핵심 흐름을 실제 Frontend → Backend → MySQL 경로로 자동 검증합니다.
- 범위:
  - E2E user fixture와 실행 시점 JWT 생성
  - `/api/user/me`와 Backend JWT filter 실제 통과
  - 기사 스크랩 저장·상태 조회·마이 스크랩 화면 반영
  - 로그인 SSE 질의·DB 채팅 history 저장·히스토리 팝업 노출
- Mock 경계: 실제 Google OAuth와 Gemini·화면 번역·Perspectives 품질 검증은 제외합니다.
- Overengineering 판단: 기존 #96 Playwright orchestration을 확장하며 테스트 전용 Backend endpoint나 신규 인증 도구를 추가하지 않았습니다.
- 연동 중 발견한 문제:
  - Windows Docker readiness probe가 반복적으로 console 창을 생성해 hidden process, timeout wait, dispose 경계를 보강했습니다.
  - E2E `127.0.0.1` Origin과 Backend 허용 `localhost` Origin 불일치로 스크랩 POST가 403을 반환해 브라우저 base URL을 `localhost:5173`으로 정렬했습니다.
- 검증 결과:
  - 인증·익명 Playwright 2개 시나리오 통과 (`11.1s`)
  - 전체 Backend·MySQL·Redis orchestration과 cleanup 완료 (`71.3s`)
  - JWT `/api/user/me`, 스크랩 저장·목록 재조회, 로그인 SSE·DB chat history·히스토리 팝업 노출 확인
  - Docker readiness console 창 및 CLI process 누적 없이 완료
  - Production build, 변경 E2E 파일 ESLint, PowerShell parser와 `git diff --check` 통과
  - 최신 HEAD GitHub `ubuntu-latest` Full Stack E2E 성공 (`1m 25s`, run `31517998965`)
  - AI Reviewer `MERGE_READY`, Blocking 없음 확인 후 사용자 승인으로 squash merge

### #96/#97 Frontend-Backend 실제 연동 Playwright 자동화

- Issue: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/96
- PR: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/97
- Squash commit: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/commit/cc8f31146b07105f9d0b195b511dab9df549a3cf
- 목적: 수동 Frontend `5173` → Backend `8080` → MySQL/Redis 검증을 로컬 한 명령과 GitHub Runner에서 재현합니다.
- 실제 경로:
  - 별도 MySQL `13306`·Redis `16379`와 일회성 volume
  - Backend Flyway migration과 기사 fixture
  - 상세·요약 응답, 익명 AI SSE와 Redis 이력 저장·조회
- Mock 경계: Gemini, 브라우저 번역과 범위 밖 Perspectives만 대체하고 실제 외부 API·OAuth·수집 scheduler는 호출하지 않습니다.
- 연동 중 발견한 Frontend 문제:
  - 초기 채팅 이력 응답이 늦게 도착하면 이미 시작된 질문과 SSE 답변 상태를 덮어쓸 수 있었습니다.
  - 초기화 시점과 질문 시작 시점의 conversation revision을 비교해 늦은 동일 초기화 응답만 폐기하고, 기사·언어·인증 identity 변경 시에는 새 history를 반영하도록 보완했습니다.
  - Reviewer 검토에서 발견한 기사 전환 history 잔존 회귀도 함께 수정했습니다.
- E2E 격리 보완:
  - Compose project 이름을 실행 PID별로 분리했습니다.
  - 이 실행이 `docker compose up`을 시작한 경우에만 동일 project의 container와 volume을 cleanup하도록 ownership guard를 적용했습니다.
  - 새로고침 없는 기사 A→B 이동 시 이전 질문이 남지 않는 Playwright 회귀 시나리오를 추가했습니다.
- 자동화:
  - 로컬 `scripts/run-full-stack-e2e.cmd`
  - GitHub Actions `workflow_dispatch` 및 `full-stack-e2e` label 기반 opt-in PR 실행
  - 실패 시 report·screenshot·video·trace와 서버·컨테이너 로그 artifact 보관
- 검증 결과:
  - 결정적 1.5초 history 지연과 기사 A→B 전환을 포함한 Playwright 시나리오 통과
  - `npm run build`, 변경 파일 ESLint, PowerShell parser와 `git diff --check` 통과
  - Blocking 반영 후 `ubuntu-latest` Full Stack E2E 성공 (`1m 18s`, run `31490194111`)
  - 전체 lint는 변경과 무관한 기존 기준선 `17 errors / 4 warnings`로 실패
- 범위 제외: 실제 외부 API, 전체 사용자 흐름, 매 PR 자동 실행, Backend production code·schema 변경

### #94/#95 Backend AI 요약·질의 종료 및 실패 재시도 UX 연동

- Issue: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/issues/94
- PR: https://github.com/SKU-GlobalTimes/GlobalTimes_FE/pull/95
- Backend 연동:
  - Backend #245/PR #246에서 추가한 named SSE `end` 이벤트를 정상 완료 신호로 소비합니다.
  - Backend 요약 API의 `502/503/504` 메시지를 유지하면서 사용자가 직접 재시도할 수 있게 연결합니다.
- 연동 중 발견한 Frontend 문제:
  - 완료·오류 뒤 EventSource 참조가 정리되지 않았습니다.
  - 요약 오류 UI에 재시도 동작이 없었습니다.
  - SSE 실패 질문이 답변 상태에 보존되지 않아 같은 질문을 다시 입력해야 했습니다.
- 해결 범위:
  - SSE 완료·오류·재요청의 단일 종료 처리와 오래된 callback 차단
  - 요약 수동 재시도와 실패 질문의 위치 기반 재시도
  - Mock API/SSE 브라우저 검증과 가능한 경우 실제 Backend 연동 확인
- 검증 결과:
  - Mock 요약 `503 → 수동 재시도 200`과 오류 UI 제거 확인
  - Mock SSE `503 → 동일 질문 재시도 → data chunk → event: end` 정상 완료 확인
  - 재시도 후 사용자 질문 DOM 1건 유지, 입력 버튼 재활성화, 실패 버튼 제거 확인
  - `npm run build`와 변경 JavaScript·JSX ESLint 통과
  - 전체 `npm run lint`는 변경 파일과 무관한 기존 기준선 `17 errors / 4 warnings`로 실패
  - Docker Desktop의 `desktop-linux` context에서 MySQL·Redis를 기동하고 Frontend `5173` proxy → Backend `8080` → 실제 DB/Redis 경로 확인
  - 실제 기사 상세·요약·최근 기사 응답이 화면 DOM에 렌더링되는지 확인
  - Gemini만 로컬 Mock으로 대체한 실제 Backend SSE에서 `data` → named `event: end`, `data: completed` wire 응답 확인
  - 동일 익명 세션의 Redis 이력 조회에서 질의·응답 저장 결과 확인
- 범위 제외: 신규 AI 기능, 자동 무한 재시도, React Query·전역 상태, 신규 SSE 라이브러리와 Backend API 추가 변경

### #92/#93 Backend API 주소·인증·오류 응답 처리 통합

- 공통 Axios base URL과 JWT 요청 처리를 통합했습니다.
- 빈 결과로 소실되던 HTTP 오류와 실패 envelope를 화면까지 전달했습니다.
- 기사·검색·Explore·Trend·Scrap·Chat의 실패 상태를 기존 성공 흐름과 분리했습니다.
- `401`, `403`, `502`, `503`, `504` Backend 응답을 사용자 상태로 표현할 기반을 마련했습니다.
- 검증 결과:
  - `npm run build` 성공
  - 변경된 JavaScript·JSX 파일 ESLint 성공 (`--max-warnings 0`)
  - Frontend `5173` proxy를 통한 cursor 기사·상세·공개 스크랩·익명 이력 실제 API 성공
  - 인증 없이 `/api/user/me` 요청 시 `401` 유지 확인
  - Backend 중단 시 검색 결과 0건과 연결 실패 UI가 구분되는지 확인
  - HTTP 200 응답의 `isSuccess: false`도 빈 결과가 아닌 Backend 오류 메시지로 전달
  - Mock Backend `503` 응답이 기사 요약 영역에 queue 포화 메시지로 표시되는지 확인
  - 데스크톱 렌더링 및 제한된 모바일 viewport에서 오류 안내가 화면을 침범하지 않는지 확인

- #90/#91: 카드 컴포넌트 날짜 `NaN` 표기 수정
- #87/#88: 상세 페이지 Perspectives API와 UI 연동
- #85/#86: 비로그인 Redis 익명 세션 기반 기사 대화 Context 연동
- #83/#84: 검색 API에 국가·카테고리·날짜 탐색 조건 연동
- #79/#80: 기사 Explore API와 커서 탐색 UI 연동
- #77/#78: 최신 기사 목록을 cursor pagination으로 전환
- #71/#72: 로그인 DB·비로그인 localStorage 스크랩 분기 연동
- #69/#70: 로그인 사용자 채팅 히스토리 조회 연동
- #67/#68: 기사 AI SSE 질의와 스트리밍 UI 연동

## Next Candidates

1. 공개 기사 탐색의 인기·cursor 최신·Explore 및 비로그인 스크랩 실제 Backend 연동 E2E
2. 랜딩 Google Trends 조회·요약의 Frontend-Backend 계약과 E2E 경계 검증
3. 연동 완료 후 미사용 legacy API·Frontend 번역 컴포넌트 제거 여부 판단
4. 연동 완료 이후 Frontend 성능 후보: 초기 JS bundle `633.31 kB` 측정 및 라우트 단위 Code Splitting

## Guardrail

- 현재 Backend 규모에서 필요한 연동·회귀 방지부터 처리합니다.
- React Query, 전역 상태 관리, 대규모 API 계층 재작성은 실제 중복과 상태 복잡성이 근거로 확인되기 전까지 도입하지 않습니다.
- 번들 분할과 렌더링 최적화는 Backend 연동 완료 후 실제 초기 chunk·로딩 측정을 근거로 진행합니다.
