import { expect, test } from "@playwright/test";
import { createE2eJwt } from "./support/auth-token.js";

const SESSION_ID = "00000000-0000-4000-8000-000000000114";

test.use({ trace: "off", screenshot: "off", video: "off" });

function searchToken(title) {
  const hangul = title.match(/[가-힣]{2,}/g)?.sort((a, b) => b.length - a.length)[0];
  if (hangul) return hangul;
  return title.split(/\s+/).find((word) => word.replace(/[^\p{L}\p{N}]/gu, "").length >= 4);
}

async function preserveBrowserTranslations(page) {
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
}

test("실제 RSS 기사에서 번역 검색·Gemini 요약·익명/로그인 질의를 검증한다", async ({ page }) => {
  test.skip(process.env.EXTERNAL_SMOKE !== "true", "수동 External Smoke에서만 실행합니다.");
  test.setTimeout(180_000);
  await preserveBrowserTranslations(page);
  await page.addInitScript(([key, value]) => {
    window.localStorage.removeItem("token");
    window.localStorage.setItem(key, value);
  }, ["globalTimes_anonymous_chat_session_id", SESSION_ID]);

  const latestResponse = await page.request.get("/api/articles/latest", {
    params: { page: 0, size: 1 },
  });
  expect(latestResponse.status()).toBe(200);
  const latestBody = await latestResponse.json();
  const article = latestBody.data.content[0];
  expect(article?.id).toBeTruthy();
  expect(article?.title).toBeTruthy();

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
  expect(searchBody.data.searchArticles.map((item) => item.id)).toContain(article.id);
  await expect(page.getByText(article.title, { exact: true }).first()).toBeVisible();

  const detailResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/news/detail?id=${article.id}`),
  );
  const summaryResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/ai/${article.id}/summary`),
  );
  const perspectivesResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/news/${article.id}/perspectives`),
  );
  await page.goto(`/detail/${article.id}`);
  const [detailResponse, summaryResponse, perspectivesResponse] = await Promise.all([
    detailResponsePromise,
    summaryResponsePromise,
    perspectivesResponsePromise,
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
  await expect(page.getByRole("heading", { name: article.title })).toBeVisible();

  const anonymousQuestion = `이 기사의 핵심을 한 문장으로 알려줘 ${Date.now()}`;
  const input = page.getByPlaceholder("질문을 입력하세요...");
  const sendButton = page.getByRole("button", { name: "질문 보내기" });
  await input.fill(anonymousQuestion);
  const anonymousAskPromise = page.waitForResponse((response) =>
    response.url().includes(`/api/ai/${article.id}/ask?`),
  );
  await sendButton.click();
  const anonymousAsk = await anonymousAskPromise;
  expect(anonymousAsk.status()).toBe(200);
  expect(anonymousAsk.headers()["content-type"]).toContain("text/event-stream");
  await expect(sendButton).toBeEnabled({ timeout: 90_000 });

  await expect.poll(async () => {
    const response = await page.request.get(`/api/ai/${article.id}/ask/history`, {
      params: { anonymousSession: SESSION_ID },
    });
    if (!response.ok()) return false;
    return (await response.json()).data.some((turn) =>
      turn.question === anonymousQuestion && String(turn.answer || "").trim().length > 0,
    );
  }).toBe(true);

  const jwt = createE2eJwt();
  await page.evaluate((value) => window.localStorage.setItem("token", value), jwt);
  const authenticatedQuestion = `로그인 상태에서 핵심 근거를 알려줘 ${Date.now()}`;

  const cachedSummaryPromise = page.waitForResponse((response) =>
    response.url().includes(`/api/ai/${article.id}/summary`),
  );
  await page.reload();
  const cachedSummaryResponse = await cachedSummaryPromise;
  expect(cachedSummaryResponse.status()).toBe(200);
  const cachedSummary = (await cachedSummaryResponse.json()).data;
  expect(cachedSummary).toEqual(expect.any(String));
  expect(cachedSummary.trim().length).toBeGreaterThan(0);

  await input.fill(authenticatedQuestion);
  const authenticatedAskPromise = page.waitForResponse((response) =>
    response.url().includes(`/api/ai/${article.id}/ask?`),
  );
  await sendButton.click();
  const authenticatedAsk = await authenticatedAskPromise;
  expect(authenticatedAsk.status()).toBe(200);
  expect(authenticatedAsk.headers()["content-type"]).toContain("text/event-stream");
  await expect(sendButton).toBeEnabled({ timeout: 90_000 });

  await expect.poll(async () => {
    const response = await page.request.get(`/api/articles/${article.id}/chat-history`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!response.ok()) return false;
    return (await response.json()).data.some((turn) =>
      turn.question === authenticatedQuestion && String(turn.answer || "").trim().length > 0,
    );
  }).toBe(true);
});
