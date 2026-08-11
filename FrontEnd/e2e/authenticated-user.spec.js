import { expect, test } from "@playwright/test";
import { createE2eJwt, E2E_USER } from "./support/auth-token.js";

const ARTICLE_ID = 990_096;
const ARTICLE_TITLE = "Full-stack E2E verification article";
const ANSWER = "Backend SSE integration verified";

test("인증 사용자의 스크랩과 채팅을 실제 Backend와 MySQL에 저장한다", async ({
  page,
}) => {
  test.setTimeout(60_000);
  const token = createE2eJwt();
  const authorization = { Authorization: `Bearer ${token}` };
  const question = `Authenticated E2E question ${Date.now()}`;

  await page.addInitScript((jwt) => {
    window.localStorage.setItem("token", jwt);
  }, token);

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

  await page.route("**/api/news/*/perspectives", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ isSuccess: true, message: "success", data: {} }),
    });
  });

  const initialStatus = await page.request.get(
    `/api/articles/${ARTICLE_ID}/scrap/status`,
    { headers: authorization },
  );
  expect(initialStatus.status()).toBe(200);
  if ((await initialStatus.json()).data.scrapped) {
    const resetResponse = await page.request.post(
      `/api/articles/${ARTICLE_ID}/scrap`,
      { headers: authorization },
    );
    expect((await resetResponse.json()).data.scrapped).toBe(false);
  }

  const userResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/user/me"),
  );
  const scrapStatusPromise = page.waitForResponse((response) =>
    response.url().includes(`/api/articles/${ARTICLE_ID}/scrap/status`),
  );
  await page.goto(`/detail/${ARTICLE_ID}`);

  const [userResponse, scrapStatusResponse] = await Promise.all([
    userResponsePromise,
    scrapStatusPromise,
  ]);
  expect(userResponse.status()).toBe(200);
  expect((await userResponse.json()).data.nickname).toBe(E2E_USER.nickname);
  expect(scrapStatusResponse.status()).toBe(200);
  await expect(
    page.getByText(E2E_USER.nickname, { exact: false }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "스크랩", exact: true }).click();
  const toggleResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().includes(`/api/articles/${ARTICLE_ID}/scrap`),
  );
  await page
    .getByRole("button", { name: "스크랩", exact: true })
    .first()
    .click();
  const toggleResponse = await toggleResponsePromise;
  expect(toggleResponse.status()).toBe(200);
  expect((await toggleResponse.json()).data.scrapped).toBe(true);
  await expect(
    page.getByRole("button", { name: "스크랩됨", exact: true }),
  ).toBeVisible();

  const scrapListResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/user/scraps"),
  );
  await page.getByText("마이스크랩", { exact: true }).first().click();
  expect((await scrapListResponsePromise).status()).toBe(200);
  await expect(page.getByText(ARTICLE_TITLE, { exact: true })).toBeVisible();

  await page.goto(`/detail/${ARTICLE_ID}`);
  const input = page.getByPlaceholder("질문을 입력하세요...");
  const sendButton = page.getByRole("button", { name: "질문 보내기" });
  await input.fill(question);

  const askResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/ai/${ARTICLE_ID}/ask?`),
  );
  await sendButton.click();
  const askResponse = await askResponsePromise;
  expect(askResponse.status()).toBe(200);
  expect(askResponse.headers()["content-type"]).toContain("text/event-stream");
  await expect(page.getByText(ANSWER, { exact: true })).toBeVisible();
  await expect(sendButton).toBeEnabled();

  await expect
    .poll(async () => {
      const response = await page.request.get(
        `/api/articles/${ARTICLE_ID}/chat-history`,
        { headers: authorization },
      );
      if (!response.ok()) return false;
      const history = (await response.json()).data;
      return history.some(
        (chat) => chat.question === question && chat.answer === ANSWER,
      );
    })
    .toBe(true);

  const chatListResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/user/chat-history"),
  );
  await page.getByRole("button", { name: "채팅 히스토리" }).click();
  expect((await chatListResponsePromise).status()).toBe(200);
  await expect(page.getByText(`Q: ${question}`, { exact: true })).toBeVisible();
});
