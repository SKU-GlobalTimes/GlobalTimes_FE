import { expect, test } from "@playwright/test";

const ARTICLE_ID = 990_096;
const ARTICLE_TITLE = "Full-stack E2E verification article";
const ARTICLE_SUMMARY = "This summary passed through the real backend and database.";
const SECOND_ARTICLE_ID = 990_097;
const SECOND_ARTICLE_TITLE = "Second full-stack E2E article";
const QUESTION = "What is the key point of this article?";
const ANSWER = "Backend SSE integration verified";
const SESSION_ID = "00000000-0000-4000-8000-000000000096";

test("기사 상세부터 익명 SSE 저장까지 실제 Backend 경로를 검증한다", async ({ page }) => {
  await page.addInitScript(([key, value]) => {
    window.localStorage.setItem(key, value);
  }, ["globalTimes_anonymous_chat_session_id", SESSION_ID]);

  // UI translation is outside this E2E scope; preserve English fixture text without a real API call.
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

  // Deliver the real empty-history response late to reproduce the initialization race deterministically.
  await page.route(`**/api/ai/${ARTICLE_ID}/ask/history?*`, async (route) => {
    const response = await route.fetch();
    const status = response.status();
    const headers = response.headers();
    const body = await response.body();
    await new Promise((resolve) => setTimeout(resolve, 1_500));
    await route.fulfill({ status, headers, body });
  });

  // Perspectives 품질은 별도 Backend 검증 범위다. 이 smoke test는 상세·요약·질의 경로에 집중한다.
  await page.route("**/api/news/*/perspectives", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ isSuccess: true, message: "success", data: {} }),
    });
  });

  const detailResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/news/detail?id=${ARTICLE_ID}`),
  );
  const summaryResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/ai/${ARTICLE_ID}/summary`),
  );

  await page.goto(`/detail/${ARTICLE_ID}`);

  const [detailResponse, summaryResponse] = await Promise.all([
    detailResponsePromise,
    summaryResponsePromise,
  ]);

  expect(detailResponse.status()).toBe(200);
  expect(summaryResponse.status()).toBe(200);
  expect((await detailResponse.json()).data.newsDetail.title).toBe(ARTICLE_TITLE);
  expect((await summaryResponse.json()).data).toBe(ARTICLE_SUMMARY);

  await expect(page.getByRole("heading", { name: ARTICLE_TITLE })).toBeVisible();
  await expect(page.getByText(ARTICLE_SUMMARY, { exact: true })).toBeVisible();

  const input = page.getByPlaceholder("질문을 입력하세요...");
  const sendButton = page.getByRole("button", { name: "질문 보내기" });
  await input.fill(QUESTION);

  const askResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/ai/${ARTICLE_ID}/ask?`),
  );
  await sendButton.click();

  const askResponse = await askResponsePromise;
  expect(askResponse.status()).toBe(200);
  expect(askResponse.headers()["content-type"]).toContain("text/event-stream");
  await expect(page.getByText(ANSWER, { exact: true })).toBeVisible();
  await expect(sendButton).toBeEnabled();
  await expect(page.getByText(QUESTION, { exact: true })).toHaveCount(1);

  const historyResponse = await page.request.get(
    `/api/ai/${ARTICLE_ID}/ask/history`,
    { params: { anonymousSession: SESSION_ID } },
  );
  expect(historyResponse.status()).toBe(200);
  const history = await historyResponse.json();
  expect(history.data).toEqual([
    expect.objectContaining({ question: QUESTION, answer: ANSWER }),
  ]);

  const secondDetailResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/news/detail?id=${SECOND_ARTICLE_ID}`),
  );
  await page.evaluate((articleId) => {
    window.history.pushState({}, "", `/detail/${articleId}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, SECOND_ARTICLE_ID);

  expect((await secondDetailResponsePromise).status()).toBe(200);
  await expect(page.getByRole("heading", { name: SECOND_ARTICLE_TITLE })).toBeVisible();
  await expect(page.getByText(QUESTION, { exact: true })).toHaveCount(0);
});
