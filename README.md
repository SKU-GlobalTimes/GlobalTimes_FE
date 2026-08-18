# GlobalTimes_FE



## 랜딩 (지구본)
<img width="500" height="250" alt="Landing Page" src="https://github.com/user-attachments/assets/7bf2c0fd-7394-4e42-8bd9-37d9541c9d55" />

- **cobe 교체 및 마커 클릭 기능** 구현
- 기존 **RSS 피드** 정상 동작
- **전체 반응형 컴포넌트** 추가
- **질의 플로팅 버튼** 추가





## 카드 컴포넌트 수정
<img width="600" alt="Card Component 1" src="https://github.com/user-attachments/assets/2088fad3-098b-4c17-a654-fe21faa48d5d" />
<br><br>
<img width="600" alt="Card Component 2" src="https://github.com/user-attachments/assets/4859f80b-e14a-46ed-901e-9364a83f2818" />

각종 **카드 컴포넌트** 디자인 및 기능 수정





## 기사 필터링
<img width="500" height="250" alt="Article Filtering" src="https://github.com/user-attachments/assets/327b8c9b-8403-4841-8622-be0db79173a8" />

기사의 세부적인 **필터링 기능**을 추가하여 사용자 맞춤형 정보 제공





## 탐색 결과 UI 개선
<img width="100%" alt="Search Results UI" src="https://github.com/user-attachments/assets/76ead4b9-f0e6-4739-b04c-0c698c40865b" />

탐색 이후의 결과를 사용자가 직관적으로 인지할 수 있도록 별도로 구분하여 디자인 수정





## 사용자 편의성 제공 및 인증
<img width="100%" alt="User Convenience" src="https://github.com/user-attachments/assets/230d1e2f-e15c-44cd-adfc-493f964423b8" />

**비로그인 상태**에서도 제한 없이 Context 확인 가능
우측 **플로팅 버튼**을 통해 이전 탐색 히스토리 유지
**구글 로그인 지원(OAuth)**





## 다양한 툴팁 팝업
<img width="250" height="200" alt="Tooltip Left" src="https://github.com/user-attachments/assets/7aabf5e7-94b8-4313-bedc-0265a17f4b43" /> <img width="250" height="200" alt="Tooltip Right" src="https://github.com/user-attachments/assets/f8a79d9b-fba9-4653-8e60-faf9ef0fc44e" />

다양한 **툴팁 팝업 디자인** 추가





## 키워드 기반 국가별 유사한 기사 제공

### 🌐 영어 버전 (English Ver.)
<img width="600" alt="Keyword-based Articles English" src="https://github.com/user-attachments/assets/9ed5bc75-ce99-4598-8c74-425ede69c8ca" />

### 🇰🇷 한국어 버전 (Korean Ver.)
<img width="600" alt="Keyword-based Articles Korean" src="https://github.com/user-attachments/assets/e9643eff-8078-4300-8c29-a4fb20e128fa" />


## Frontend-Backend 실행 및 E2E 테스트

### 사전 준비

- JDK 17
- Node.js `20.19+` 또는 `22.12+`
- Docker Desktop
- Frontend와 Backend 저장소를 같은 상위 경로에 배치

```text
workspace/
├─ GlobalTimes_BeSide/
└─ GlobalTimes_FE/
```

### 최초 설치

```powershell
cd GlobalTimes_FE\FrontEnd
npm ci
```

### Mock Full-stack E2E 실행

```powershell
cd GlobalTimes_FE
.\scripts\run-full-stack-e2e.cmd
```

Playwright Chromium이 이미 설치돼 있다면:

```powershell
.\scripts\run-full-stack-e2e.cmd -SkipBrowserInstall
```

Docker MySQL·Redis, Backend, Frontend, Mock 서버와 Playwright를 함께 실행하고 테스트 종료 후 자동 정리합니다. 실제 외부 API는 호출하지 않습니다.

### 실제 외부 API 제한 Smoke

Backend `.env`에 실제 `NEWS_API_KEY`, `GOOGLE_API_KEY`, `GEMINI_API_KEY`가 있어야 합니다.

```powershell
cd GlobalTimes_FE
.\scripts\run-external-smoke-e2e.cmd -SkipBrowserInstall
```

실제 News API·RSS·Google Trends 수집과 Backend Translation·Gemini를 제한적으로 호출하므로 필요할 때만 수동 실행합니다. Google OAuth 대신 fixture JWT를 사용하지만 Backend 인증 필터와 MySQL 사용자 데이터 저장 경로는 실제로 통과합니다.

### E2E 결과 확인

```powershell
cd GlobalTimes_FE\FrontEnd
npm run e2e:report
```

```text
FrontEnd/playwright-report/
FrontEnd/test-results/
FrontEnd/e2e-artifacts/
```

### 주요 E2E 파일

```text
scripts/run-full-stack-e2e.cmd
scripts/run-external-smoke-e2e.cmd
scripts/run-full-stack-e2e.ps1

FrontEnd/e2e/
├─ full-stack.spec.js
├─ authenticated-user.spec.js
├─ public-browsing.spec.js
├─ search-perspectives.spec.js
├─ landing-trends.spec.js
├─ external-api-smoke.spec.js
├─ fixtures/
└─ support/
```

Playwright 시나리오는 `FrontEnd/e2e/*.spec.js`, 테스트 데이터는 `fixtures`, Mock과 JWT 보조 코드는 `support`에 있습니다.

### 개선 작업 문서

- [Frontend 개선 작업 진척](docs/frontend-improvement/WORK_PROGRESS.md)
- [Frontend-Backend Full-stack E2E](docs/frontend-improvement/full-stack-e2e.md)
- [Frontend-Backend 연동 후속 Phase 로드맵](docs/frontend-improvement/full-stack-next-phase-roadmap.md)


## 직접 서버 실행

### Backend

```powershell
cd GlobalTimes_BeSide
docker compose -f docker-compose.dev.yml up -d
.\gradlew.bat bootRun
```

### Frontend

```powershell
cd GlobalTimes_FE\FrontEnd
npm run dev
```
