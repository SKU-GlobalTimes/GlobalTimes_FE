# Frontend-Backend Full-stack E2E

## 목적

수동으로 각각 실행하던 Frontend, Backend, MySQL, Redis와 브라우저 검증을 한 명령과 GitHub Runner에서 재현한다.
Playwright가 실제 브라우저에서 사용자 입력과 화면을 검증하며, API 응답과 Redis 저장 결과도 함께 확인한다.

## 실제 경로와 Mock 경계

다음 경로는 실제 애플리케이션 코드와 일회성 인프라를 통과한다.

```text
Playwright Chromium
→ Frontend 5173
→ Vite /api proxy
→ Backend 8080
→ MySQL 13306 / Redis 16379
```

- 실제: Flyway migration, 기사 fixture 저장, 인기·cursor 최신·Explore·상세·요약·스크랩 Controller/Service/Repository, SSE 처리, 익명 Redis 대화 저장·조회
- Mock: Gemini 응답과 브라우저 Google Translation
- 실제 경로: Redis에 고정 번역 fixture를 넣은 Backend 다국어 검색, MySQL FULLTEXT, Perspectives 계산·Redis cache·국가별 기사 이동
- 비활성: News API·RSS scheduler, OAuth, 실제 외부 API 호출

Mock Gemini는 외부 비용을 제거하지만 Backend WebClient, SSE 누적 데이터, named `end` 이벤트와 Redis 저장은 실제 코드를 통과한다.

## 로컬 실행

Frontend와 Backend 저장소가 같은 상위 디렉터리에 있을 때 Frontend 저장소 루트에서 실행한다.

```powershell
.\scripts\run-full-stack-e2e.cmd
```

첫 실행은 Playwright Chromium을 내려받는다. 이후 설치를 생략하려면 다음 옵션을 사용한다.

```powershell
.\scripts\run-full-stack-e2e.cmd -SkipBrowserInstall
```

### 실제 외부 API Smoke

기존 결정적 E2E와 별도로 실제 RSS, Backend Translation, Gemini를 소수 호출하는 수동 Smoke를 실행합니다. Backend `.env`에 실제 `GOOGLE_API_KEY`, `GEMINI_API_KEY`가 있어야 하며 값은 report나 log에 기록하지 않습니다.

```powershell
.\scripts\run-external-smoke-e2e.cmd -SkipBrowserInstall
```

이 실행은 News API와 Trend를 끄고 무료 RSS·기사 HTML preflight를 통과한 국가의 첫 feed에서 기사 후보 1개만 적재합니다. 후보 기사에서 본문을 확보하지 못하면 유료 API 호출 전에 중단하며, 실제 언론사 응답 지연을 수용하기 위해 이 수동 Smoke에서만 crawler timeout을 15초로 설정합니다. 브라우저 UI 번역은 Mock으로 차단하며 Backend 검색·Perspectives Translation 최대 2회, Gemini 요약 1회, 익명·로그인 질의 각 1회만 허용합니다. 실패 시 자동 재시도하지 않고 서버를 종료하며, compose cleanup은 최대 3회 시도한 뒤 실패를 명시적으로 보고합니다.

External Smoke의 Backend·Frontend·container 로그는 종료 시 OS 환경변수와 Backend `.env` 양쪽의 실제 Google/Gemini key 값, `key=` query parameter를 `[REDACTED]`로 치환합니다. Playwright trace·screenshot·video도 비활성화해 실제 AI 응답과 요청 정보가 실패 artifact에 남는 범위를 줄입니다.

실시간 기사와 Gemini 응답은 비결정적이므로 정확한 문자열을 비교하지 않습니다. Perspectives도 기술 경로와 cache 생성만 확인하고 관련 기사 수, 국가 수, 의미적 관련성을 합격 조건으로 사용하지 않습니다. 이 결과는 Backend Issue #110의 근본 한계를 해결했다는 근거가 아닙니다.

최초 두 차례 수동 실행에서는 한국 기사 원문의 빈 stream과 영국 기사 원문의 5초 read timeout을 각각 확인했습니다. 두 실행 모두 검색·Perspectives Translation은 2회 성공했고 crawling 실패로 Gemini는 호출되지 않았으며 Backend `202` fallback과 전체 cleanup이 동작했습니다. 이 결과는 외부 기사 접근 성공을 fixture처럼 가정할 수 없다는 실행 경계로 보존합니다.

스크립트는 Docker Desktop이 정지돼 있으면 실행을 시도하고 daemon 준비를 기다린다. 기존 개발 DB와 충돌하지 않도록 별도 포트와 일회성 volume을 사용하며 종료 시 제거한다.

## GitHub Actions 실행

- Actions의 `Full Stack E2E`에서 `Run workflow`를 누르고 검증할 Backend branch, tag 또는 commit SHA를 입력한다.
- PR에서 필요할 때만 `full-stack-e2e` label을 붙이면 opt-in으로 실행된다. 일반 PR에는 자동 실행되지 않는다.
- Runner는 Frontend와 지정한 Backend를 checkout하고 같은 PowerShell orchestration과 Playwright 테스트를 실행한다.

실패 여부와 관계없이 다음 artifact를 14일간 보관한다.

- Playwright HTML report
- 실패 screenshot·trace
- Backend·Frontend·Gemini Mock·container 로그

## 검증 시나리오

1. Flyway가 적용된 MySQL에 기사 fixture를 저장한다.
2. 브라우저가 상세·요약 API의 HTTP 200과 응답 본문을 확인한다.
3. 제목과 요약이 화면에 렌더링되는지 확인한다.
4. 실제 빈 이력 응답 전달을 1.5초 늦춰 초기화 경쟁 조건을 만든다.
5. 사용자가 질문을 입력하고 전송한다.
6. Mock Gemini 응답이 실제 Backend SSE를 거쳐 화면에 표시되는지 확인한다.
7. named `end` 뒤 전송 버튼이 재활성화되고 질문이 한 번만 남는지 확인한다.
8. 동일 익명 세션의 Redis 이력 API에서 질문·답변이 저장됐는지 확인한다.

## 연동 중 발견한 회귀

이전 이력 조회가 끝나기 전에 질문을 보내면 늦은 초기화 응답이 진행 중 질문과 SSE 답변을 덮어쓸 수 있었다. `Chatbot`은 사용자 대화가 시작된 뒤 도착한 초기화 결과로 현재 메시지를 교체하지 않도록 변경했다. E2E는 실제 Backend 이력 응답을 의도적으로 늦춰 이 조건을 반복 검증한다.

Reviewer 검토에서 메시지 내용만으로 대화 시작 여부를 판별하면 기사 A에서 B로 이동했을 때 A의 메시지가 B의 history 반영을 막을 수 있다는 회귀가 확인되었다. 이를 초기화 시점의 conversation revision과 실제 질문 시작 시점의 revision 비교로 변경했다. 기사·언어·인증 identity가 바뀌면 기존 메시지를 비우고 새 history를 반영하되, 해당 초기화가 진행되는 동안 사용자가 질문했다면 늦은 history만 폐기한다. E2E는 새로고침 없이 두 번째 기사로 이동해 첫 기사 질문이 남지 않는 조건도 검증한다.

Compose project 이름은 실행 프로세스 ID를 포함해 실행별로 분리한다. 또한 해당 실행이 `docker compose up`을 시작한 경우에만 같은 project의 log 수집과 `down -v`를 수행한다. 따라서 이미 사용 중인 port를 발견해 두 번째 실행이 시작 전에 실패하더라도 먼저 실행 중인 E2E의 container와 volume을 제거하지 않는다.

## 인증 사용자 시나리오

실제 Google OAuth 로그인은 외부 계정과 redirect 정책에 의존하므로 E2E 범위에서 제외한다. 대신 fixture 사용자와 실행 시점의 E2E `JWT_SECRET`으로 10분 유효 JWT를 생성한다. 저장소에는 완성된 token을 기록하지 않는다.

브라우저가 localStorage의 token을 읽은 뒤 실제 Backend `JwtAuthenticationFilter`와 Security matcher를 통과한다. `/api/user/me` 인증, 기사 스크랩 저장과 `/api/user/scraps` 재조회, 로그인 AI SSE 질의, MySQL `chat_history` 조회와 채팅 히스토리 팝업 노출을 순서대로 검증한다. Gemini와 화면 번역 Mock 경계는 익명 시나리오와 동일하다.

## 공개 기사 탐색·비로그인 스크랩 시나리오

브라우저가 메인 화면에 진입하면 `/api/articles/popular?page=0&size=6`과 `/api/articles/cursor?size=8`의 실제 응답에 fixture 기사 ID가 포함되고 카드가 렌더링되는지 확인한다. 이후 사용자가 탐색 조건 UI에서 `US`와 `technology`를 선택해 `/api/articles/explore` query와 단일 fixture 결과를 검증한다.

Backend 인기 기사 조회는 실행 시각 기준 최근 30일 기사만 대상으로 한다. 따라서 공개 탐색 fixture의 발행 시각은 적재 시점의 1시간 전으로 설정하고 재실행 시에도 갱신해, 고정 날짜 만료로 제품 회귀 없이 E2E가 실패하지 않도록 한다.

Explore 카드에서 상세 화면으로 이동한 뒤 비로그인 스크랩을 선택하면 article ID가 localStorage `scrapIds`에 저장되는지 확인한다. 마이스크랩 화면은 이 ID를 `/api/scrap`에 전달하고 실제 MySQL 기사 데이터를 카드로 복원해야 한다. 이 시나리오에서 UI 번역과 Perspectives만 Mock하며 기사 목록·Explore·상세·요약·스크랩은 실제 Backend 경로를 사용한다.

Windows에서는 E2E artifact 아래의 임시 Docker config와 Docker Desktop Linux named pipe를 사용해 사용자 전역 Docker config 권한과 context 전환에 의존하지 않는다. readiness probe는 숨김 process로 실행하며 각 probe는 5초 timeout 뒤 종료 완료를 기다리고 process handle을 dispose한다. Windows와 Linux 모두 전체 준비 대기를 2분으로 제한한 bounded retry를 사용해 Docker daemon의 일시적인 준비 지연은 흡수하되 console 창·process 누적이나 무한 대기는 방지한다.

브라우저 base URL은 Backend CORS에 등록된 `http://localhost:5173`을 사용한다. 같은 로컬 서버라도 `127.0.0.1`은 다른 Origin이므로 GET에는 드러나지 않던 CORS 불일치가 Origin header를 포함한 스크랩 POST에서 403으로 나타날 수 있다.

## 랜딩 국가별 Trend·원문 이동 시나리오

Redis에 `KR`, `US`, `GB` 국가별 Trend fixture를 TTL과 함께 적재한 뒤 랜딩 지구본의 국가 마커를 선택한다. 브라우저는 실제 Backend `/api/trend` 응답의 국가 코드와 두 개 keyword를 확인하고 국가별 Trend panel이 렌더링되는지 검증한다.

대표 Trend를 선택하면 Backend `/api/trend/summary`가 실제 Service 경로에서 기사 원문을 crawling하고 Gemini 요약을 요청한다. 비용과 외부 장애 영향을 제거하기 위해 언론사 HTML과 Gemini만 로컬 Mock server가 제공하며, Backend HTTP client·crawler·summary 경로와 Frontend modal은 실제 코드를 통과한다.

기사 제목은 `target="_blank"`, `rel="noopener noreferrer"` 계약을 가져야 한다. Playwright는 실제 popup을 열어 fixture의 언론사 URL로 이동했는지와 새 문서의 제목까지 확인한다. 외부 언론사 운영 화면 자체는 계약 범위가 아니므로 로컬 HTML 경계까지만 검증한다.

국가 마커는 자동 회전하는 3D 좌표 위에 있어 pointer 좌표가 다른 마커와 겹칠 수 있다. 마커를 semantic button으로 제공하고 hover·focus 중 회전을 멈추며 keyboard activation으로 같은 선택 handler를 호출한다. 모바일 `390×844`에서는 canvas screenshot의 pixel을 표본 검사해 빈 WebGL frame이 아닌지 확인하고, 현재 앞면 국가 마커와 focus 국기가 viewport 안에 표시되는지 검증한다.

국가별 기능 테스트와 3D 시각 테스트는 분리한다. 각 국가는 Trend·요약·popup 계약을 독립적으로 완결하고, canvas pixel·국기 확장 검증은 모바일 시각 시나리오가 담당한다. hover와 focus가 교차할 때는 CSS transition을 끈 상태에서 marker anchor 좌표를 비교해 둘 중 하나가 활성인 동안 자동 회전이 멈추는지 별도 검증한다. 로컬 단일 worker 기준 기존 8개 시나리오가 약 7.6분 걸렸으며, 교차 회귀를 포함한 9개 시나리오는 GitHub Runner에서 1분 15초에 통과했다. 이 랜딩 검증을 마지막 E2E 범위 확장으로 삼고 이후에는 핵심 회귀 세트를 유지한다.
