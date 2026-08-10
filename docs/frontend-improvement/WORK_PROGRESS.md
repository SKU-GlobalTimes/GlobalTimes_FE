# Frontend Improvement Work Progress

프론트엔드 개인 검증 작업의 현재 상태와 다음 세션 기준을 기록합니다.

## 작업 절차

`Issue → Branch → 조사 → 계획 → 승인 → 구현 → Build/Lint/API/브라우저 검증 → PR → AI Reviewer → Blocking 확인 → 사용자 승인 → squash merge`

- Issue와 PR 본문은 저장소 템플릿을 읽고 `--body-file`로 작성합니다.
- Reviewer Agent는 별도 대화에서 PR diff만 검토하고 `## AI Reviewer 검토 결과` 제목으로 comment를 남깁니다.
- `MERGE_READY`이고 Blocking이 없어도 사용자 승인 후 merge합니다.
- 구현, 검증 보조 코드와 작업 진척 문서는 가능한 한 하나의 squash commit으로 정리합니다.

## In Progress

없음

## Recently Merged

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

1. 기사 요약·SSE 정상 종료와 `502/503/504` 실패 상태별 재시도 UX 검증
2. 핵심 사용자 흐름 브라우저 회귀 테스트와 Frontend CI 구축
3. 기존 전체 ESLint 오류 기준선 정리 (`17 errors / 4 warnings`, #92 변경 파일 제외)

## Guardrail

- 현재 Backend 규모에서 필요한 연동·회귀 방지부터 처리합니다.
- React Query, 전역 상태 관리, 대규모 API 계층 재작성은 실제 중복과 상태 복잡성이 근거로 확인되기 전까지 도입하지 않습니다.
- 번들 분할과 렌더링 최적화는 측정 결과가 없는 상태에서 선행하지 않습니다.
