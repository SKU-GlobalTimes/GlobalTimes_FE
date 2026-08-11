import { expect, test } from "@playwright/test";

const SEARCH_TEXT = "루나리스 정상회담";
const TRANSLATED_TEXT = "Lunaris summit";
const BASE_ARTICLE_ID = 990_102;
const BASE_ARTICLE_TITLE = "루나리스 정상회담 공동성명 발표";
const US_ARTICLE_ID = 990_103;
const US_ARTICLE_TITLE = "Lunaris summit joint statement draws US response";
const JP_ARTICLE_ID = 990_104;
const JP_ARTICLE_TITLE = "Japan reviews Lunaris summit joint statement";

test("다국어 검색과 국가별 Perspectives를 실제 Backend 경로로 검증한다", async ({ page }) => {
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

  await page.goto("/main");

  const searchInput = page.getByRole("textbox").first();
  await searchInput.fill(SEARCH_TEXT);

  const searchResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/search?") &&
    new URL(response.url()).searchParams.get("text") === SEARCH_TEXT,
  );
  await searchInput.press("Enter");

  const searchResponse = await searchResponsePromise;
  expect(searchResponse.status()).toBe(200);
  const searchPayload = await searchResponse.json();
  expect(searchPayload.data.originalText).toBe(SEARCH_TEXT);
  expect(searchPayload.data.translatedText).toBe(TRANSLATED_TEXT);
  expect(searchPayload.data.searchArticles.map(({ id }) => id)).toEqual(
    expect.arrayContaining([BASE_ARTICLE_ID, US_ARTICLE_ID, JP_ARTICLE_ID]),
  );

  await expect(page).toHaveURL(new RegExp(`/search/${encodeURIComponent(SEARCH_TEXT)}`));
  await expect(page.getByText(BASE_ARTICLE_TITLE, { exact: true })).toBeVisible();
  await expect(page.getByText(US_ARTICLE_TITLE, { exact: true })).toBeVisible();
  await expect(page.getByText(JP_ARTICLE_TITLE, { exact: true })).toBeVisible();

  const perspectivesResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/news/${BASE_ARTICLE_ID}/perspectives`),
  );
  await page.getByText(BASE_ARTICLE_TITLE, { exact: true }).click();

  const perspectivesResponse = await perspectivesResponsePromise;
  expect(perspectivesResponse.status()).toBe(200);
  const perspectivesPayload = await perspectivesResponse.json();
  expect(perspectivesPayload.data.keyword).toBe("루나리스 정상회담 공동성명");
  expect(perspectivesPayload.data.perspectives.US).toEqual([
    expect.objectContaining({ id: US_ARTICLE_ID, title: US_ARTICLE_TITLE }),
  ]);
  expect(perspectivesPayload.data.perspectives.JP).toEqual([
    expect.objectContaining({ id: JP_ARTICLE_ID, title: JP_ARTICLE_TITLE }),
  ]);

  await expect(page.getByText(/탐색 키워드:/)).toBeVisible();
  const usPerspectiveCard = page.getByRole("button").filter({ hasText: US_ARTICLE_TITLE });
  const jpPerspectiveCard = page.getByRole("button").filter({ hasText: JP_ARTICLE_TITLE });
  await expect(usPerspectiveCard).toBeVisible();
  await expect(jpPerspectiveCard).toBeVisible();

  const warmResponse = await page.request.get(`/api/news/${BASE_ARTICLE_ID}/perspectives`);
  expect(warmResponse.status()).toBe(200);
  expect((await warmResponse.json()).data).toEqual(perspectivesPayload.data);

  const relatedDetailResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/news/detail?id=${US_ARTICLE_ID}`),
  );
  await usPerspectiveCard.click();
  expect((await relatedDetailResponsePromise).status()).toBe(200);
  await expect(page).toHaveURL(`/detail/${US_ARTICLE_ID}`);
  await expect(page.getByRole("heading", { name: US_ARTICLE_TITLE })).toBeVisible();
});
