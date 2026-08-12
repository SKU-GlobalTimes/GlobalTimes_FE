import { expect, test } from "@playwright/test";

const ARTICLE_ID = 990_097;
const ARTICLE_TITLE = "Second full-stack E2E article";

test("공개 기사 탐색부터 비로그인 스크랩 조회까지 실제 Backend 경로를 검증한다", async ({
  page,
}) => {
  test.setTimeout(60_000);

  await page.addInitScript(() => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("scrapIds");
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

  await page.route("**/api/news/*/perspectives", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ isSuccess: true, message: "success", data: {} }),
    });
  });

  const popularResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/articles/popular?page=0&size=6"),
  );
  const latestResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/articles/cursor?size=8"),
  );

  await page.goto("/main");

  const [popularResponse, latestResponse] = await Promise.all([
    popularResponsePromise,
    latestResponsePromise,
  ]);
  expect(popularResponse.status()).toBe(200);
  expect(latestResponse.status()).toBe(200);

  const popularBody = await popularResponse.json();
  const latestBody = await latestResponse.json();
  expect(popularBody.data.content.map(({ id }) => id)).toContain(ARTICLE_ID);
  expect(latestBody.data.articles.map(({ id }) => id)).toContain(ARTICLE_ID);
  await expect(page.getByText(ARTICLE_TITLE, { exact: true }).first()).toBeVisible();

  await page
    .getByRole("button", { name: /탐색 조건 열기/ })
    .click();
  await page.getByRole("button", { name: "국가", exact: true }).click();
  await page.getByRole("option", { name: "US", exact: true }).click();
  await page.getByRole("button", { name: "카테고리", exact: true }).click();
  await page.getByRole("option", { name: "technology", exact: true }).click();

  const exploreResponsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      url.pathname === "/api/articles/explore" &&
      url.searchParams.get("country") === "US" &&
      url.searchParams.get("category") === "technology" &&
      url.searchParams.get("size") === "12"
    );
  });
  await page.getByRole("button", { name: "이 조건으로 보기" }).click();

  const exploreResponse = await exploreResponsePromise;
  expect(exploreResponse.status()).toBe(200);
  const exploreBody = await exploreResponse.json();
  expect(exploreBody.data.articles.map(({ id }) => id)).toEqual([ARTICLE_ID]);

  const exploreSection = page.getByRole("region", { name: "탐색 결과" });
  const exploreCard = exploreSection
    .getByRole("button")
    .filter({ hasText: ARTICLE_TITLE });
  await expect(exploreCard).toBeVisible();

  const detailResponsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/news/detail?id=${ARTICLE_ID}`),
  );
  await exploreCard.click();
  expect((await detailResponsePromise).status()).toBe(200);
  await expect(page).toHaveURL(new RegExp(`/detail/${ARTICLE_ID}$`));

  await page.getByRole("button", { name: "스크랩", exact: true }).click();
  await page
    .getByRole("button", { name: "스크랩", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "스크랩됨", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem("scrapIds") || "[]")),
    )
    .toEqual([ARTICLE_ID]);

  const scrapResponsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      url.pathname === "/api/scrap" &&
      url.searchParams.getAll("id").includes(String(ARTICLE_ID))
    );
  });
  await page.getByText("마이스크랩", { exact: true }).first().click();

  const scrapResponse = await scrapResponsePromise;
  expect(scrapResponse.status()).toBe(200);
  const scrapBody = await scrapResponse.json();
  expect(scrapBody.data.map(({ id }) => id)).toContain(ARTICLE_ID);
  await expect(page.getByText(ARTICLE_TITLE, { exact: true })).toBeVisible();
});
