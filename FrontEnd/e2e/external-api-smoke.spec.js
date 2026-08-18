import { expect, test } from "@playwright/test";
import { createE2eJwt, E2E_USER } from "./support/auth-token.js";

test.use({ trace: "off", screenshot: "off", video: "off" });

function searchToken(title) {
  const hangul = title.match(/[가-힣]{2,}/g)?.sort((a, b) => b.length - a.length)[0];
  if (hangul) return hangul;
  return title.split(/\s+/).find((word) => word.replace(/[^\p{L}\p{N}]/gu, "").length >= 4);
}

function normalizeRenderedText(text) {
  return String(text || "")
    .replaceAll("…", "...")
    .replace(/\s+/g, " ")
    .trim();
}

async function isolateBrowserOnlyExternals(page) {
  await page.route("**/node_modules/.vite/deps/cobe.js*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: `export default function createGlobe() {
        return { update() {}, destroy() {} };
      }`,
    });
  });

  await page.route("https://translation.googleapis.com/**", async (route) => {
    const body = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: { translations: [{ translatedText: body.q }] },
      }),
    });
  });

  await page.route("https://flagcdn.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="24"><rect width="40" height="24" fill="#f0c040"/></svg>',
    });
  });
}

test("실제 수집 기사에서 로그인 사용자의 요약·질의·스크랩과 KR Trend를 검증한다", async ({
  page,
}) => {
  test.skip(process.env.EXTERNAL_SMOKE !== "true", "수동 External Smoke에서만 실행합니다.");
  test.setTimeout(240_000);

  const articleId = Number(process.env.EXTERNAL_ARTICLE_ID);
  expect(articleId, "RSS preflight를 통과해 적재된 기사 ID가 필요합니다.").toBeGreaterThan(0);

  const jwt = createE2eJwt();
  const authorization = { Authorization: `Bearer ${jwt}` };
  const authenticatedQuestion = `로그인 상태에서 핵심 근거를 알려줘 ${Date.now()}`;
  await isolateBrowserOnlyExternals(page);
  await page.addInitScript((token) => {
    window.localStorage.setItem("token", token);
  }, jwt);

  const articleResponse = await page.request.get(`/api/news/detail?id=${articleId}`);
  expect(articleResponse.status()).toBe(200);
  const article = (await articleResponse.json()).data.newsDetail;
  expect(article?.title).toBeTruthy();

  const userResponse = await page.request.get("/api/user/me", { headers: authorization });
  expect(userResponse.status()).toBe(200);
  expect((await userResponse.json()).data.nickname).toBe(E2E_USER.nickname);

  const initialScrapStatus = await page.request.get(
    `/api/articles/${articleId}/scrap/status`,
    { headers: authorization },
  );
  expect(initialScrapStatus.status()).toBe(200);
  if ((await initialScrapStatus.json()).data.scrapped) {
    const resetResponse = await page.request.post(`/api/articles/${articleId}/scrap`, {
      headers: authorization,
    });
    expect((await resetResponse.json()).data.scrapped).toBe(false);
  }

  const token = searchToken(article.title);
  expect(token, "수집 기사 제목에서 검색 가능한 토큰을 선택해야 합니다.").toBeTruthy();

  const searchResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/search?"),
  );
  await page.goto(`/search/${encodeURIComponent(token)}`);
  const searchResponse = await searchResponsePromise;
  expect(searchResponse.status()).toBe(200);
  const searchBody = await searchResponse.json();
  expect(searchBody.data.translatedText).toBeTruthy();
  expect(searchBody.data.searchArticles.map((item) => item.id)).toContain(articleId);
  await expect(page.getByText(article.title, { exact: true }).first()).toBeVisible();

  const detailResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/news/detail?id=${articleId}`),
  );
  const summaryResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/ai/${articleId}/summary`),
  );
  const perspectivesResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/news/${articleId}/perspectives`),
  );
  const scrapStatusPromise = page.waitForResponse((response) =>
    response.url().includes(`/api/articles/${articleId}/scrap/status`),
  );
  await page.goto(`/detail/${articleId}`);
  const [detailResponse, summaryResponse, perspectivesResponse, scrapStatusResponse] =
    await Promise.all([
      detailResponsePromise,
      summaryResponsePromise,
      perspectivesResponsePromise,
      scrapStatusPromise,
    ]);

  expect(detailResponse.status()).toBe(200);
  expect(
    summaryResponse.status(),
    "실제 기사 원문 crawling이 실패하면 Backend가 202 fallback을 반환하며 Gemini는 호출하지 않습니다.",
  ).toBe(200);
  const summary = (await summaryResponse.json()).data;
  expect(summary).toEqual(expect.any(String));
  expect(summary.trim().length).toBeGreaterThan(0);
  expect(perspectivesResponse.status()).toBe(200);
  const perspectives = await perspectivesResponse.json();
  expect(perspectives.isSuccess).toBe(true);
  expect(perspectives.data).toEqual(expect.objectContaining({ perspectives: expect.any(Object) }));
  expect(scrapStatusResponse.status()).toBe(200);
  const detailHeading = page.getByRole("heading", { level: 1 });
  await expect(detailHeading).toBeVisible();
  expect(normalizeRenderedText(await detailHeading.textContent())).toBe(
    normalizeRenderedText(article.title),
  );
  await expect(page.getByText(E2E_USER.nickname, { exact: false }).first()).toBeVisible();

  await page.getByRole("button", { name: "스크랩", exact: true }).click();
  const toggleResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().includes(`/api/articles/${articleId}/scrap`),
  );
  await page.getByRole("button", { name: "스크랩", exact: true }).first().click();
  const toggleResponse = await toggleResponsePromise;
  expect(toggleResponse.status()).toBe(200);
  expect((await toggleResponse.json()).data.scrapped).toBe(true);
  await expect(page.getByRole("button", { name: "스크랩됨", exact: true })).toBeVisible();

  const input = page.getByPlaceholder("질문을 입력하세요...");
  const sendButton = page.getByRole("button", { name: "질문 보내기" });
  await input.fill(authenticatedQuestion);
  const authenticatedAskPromise = page.waitForResponse((response) =>
    response.url().includes(`/api/ai/${articleId}/ask?`),
  );
  await sendButton.click();
  const authenticatedAsk = await authenticatedAskPromise;
  expect(authenticatedAsk.status()).toBe(200);
  expect(authenticatedAsk.headers()["content-type"]).toContain("text/event-stream");
  await expect(sendButton).toBeEnabled({ timeout: 90_000 });

  await expect
    .poll(async () => {
      const response = await page.request.get(`/api/articles/${articleId}/chat-history`, {
        headers: authorization,
      });
      if (!response.ok()) return false;
      return (await response.json()).data.some(
        (turn) =>
          turn.question === authenticatedQuestion && String(turn.answer || "").trim().length > 0,
      );
    })
    .toBe(true);

  const scrapListResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/user/scraps"),
  );
  await page.getByText("마이스크랩", { exact: true }).first().click();
  const scrapListResponse = await scrapListResponsePromise;
  expect(scrapListResponse.status()).toBe(200);
  expect((await scrapListResponse.json()).data.map((item) => item.articleId)).toContain(articleId);
  expect(normalizeRenderedText(await page.locator("body").innerText())).toContain(
    normalizeRenderedText(article.title),
  );

  await page.goto("/");
  const marker = page.getByRole("button", { name: "South Korea trends" });
  const trendResponsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname === "/api/trend" && url.searchParams.get("code") === "KR";
  });
  await marker.evaluate((element) => element.click());
  const trendResponse = await trendResponsePromise;
  expect(trendResponse.status()).toBe(200);
  const trends = (await trendResponse.json()).data;
  expect(trends).toHaveLength(1);
  expect(trends[0].keyword).toBeTruthy();
  await expect(page.getByText(trends[0].keyword, { exact: true })).toBeVisible();
});
