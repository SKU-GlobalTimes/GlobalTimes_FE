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

- 실제: Flyway migration, 기사 fixture 저장, 상세·요약 Controller/Service/Repository, SSE 처리, 익명 Redis 대화 저장·조회
- Mock: Gemini 응답, 브라우저 Google Translation, 이 테스트 범위 밖의 Perspectives 응답
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

스크립트는 Docker Desktop이 정지돼 있으면 실행을 시도하고 daemon 준비를 기다린다. 기존 개발 DB와 충돌하지 않도록 별도 포트와 일회성 volume을 사용하며 종료 시 제거한다.

## GitHub Actions 실행

- Actions의 `Full Stack E2E`에서 `Run workflow`를 누르고 검증할 Backend branch, tag 또는 commit SHA를 입력한다.
- PR에서 필요할 때만 `full-stack-e2e` label을 붙이면 opt-in으로 실행된다. 일반 PR에는 자동 실행되지 않는다.
- Runner는 Frontend와 지정한 Backend를 checkout하고 같은 PowerShell orchestration과 Playwright 테스트를 실행한다.

실패 여부와 관계없이 다음 artifact를 14일간 보관한다.

- Playwright HTML report
- 실패 screenshot·video·trace
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
