import { expect, test } from "@playwright/test";

const COUNTRIES = [
  {
    code: "KR",
    name: "South Korea",
    keywords: ["Seoul technology summit", "Korea semiconductor exports"],
    title: "Korea hosts global technology summit",
    source: "Seoul Daily",
    articleUrl: "http://127.0.0.1:19099/publisher/kr-tech",
    verifyPopup: true,
  },
  {
    code: "US",
    name: "United States",
    keywords: ["US clean energy policy", "New York technology market"],
    title: "United States expands clean energy program",
    source: "American Current",
    articleUrl: "http://127.0.0.1:19099/publisher/us-energy",
  },
  {
    code: "GB",
    name: "United Kingdom",
    keywords: ["UK digital economy", "London climate forum"],
    title: "United Kingdom reports digital economy growth",
    source: "London Chronicle",
    articleUrl: "http://127.0.0.1:19099/publisher/gb-digital",
  },
];

async function countRenderedGlobePixels(page, canvas) {
  const box = await canvas.boundingBox();
  if (!box) return 0;
  const screenshot = await page.screenshot({
    clip: box,
    animations: "allow",
  });
  return page.evaluate(async (base64) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    const image = await createImageBitmap(new Blob([bytes], { type: "image/png" }));

    const sample = document.createElement("canvas");
    sample.width = image.width;
    sample.height = image.height;
    const context = sample.getContext("2d");
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, sample.width, sample.height).data;

    let rendered = 0;
    for (let i = 0; i < pixels.length; i += 4 * 128) {
      if (pixels[i] + pixels[i + 1] + pixels[i + 2] > 20) rendered += 1;
    }
    image.close();
    return rendered;
  }, screenshot.toString("base64"));
}

async function setupLandingRoutes(page, { mockGlobe = false } = {}) {
  if (mockGlobe) {
    await page.route("**/node_modules/.vite/deps/cobe.js*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `export default function createGlobe() {
          return { update() {}, destroy() {} };
        }`,
      });
    });
  }

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

  await page.goto("/");
}

for (const country of COUNTRIES) {
  test(`${country.name} Trend에서 언론사 기사 요약과 원문 링크 계약을 검증한다`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await setupLandingRoutes(page, { mockGlobe: true });

    const marker = page.getByRole("button", { name: `${country.name} trends` });
    await expect(marker).toContainText(country.name);
    await marker.evaluate((element) => element.focus({ preventScroll: true }));
    await expect(marker).toBeFocused();

    const trendResponsePromise = page.waitForResponse((response) => {
      const url = new URL(response.url());
      return url.pathname === "/api/trend" && url.searchParams.get("code") === country.code;
    });
    await marker.evaluate((element) => element.click());

    const trendResponse = await trendResponsePromise;
    expect(trendResponse.status()).toBe(200);
    const trendBody = await trendResponse.json();
    expect(trendBody.data.map(({ keyword }) => keyword)).toEqual(country.keywords);
    await expect(
      page.getByRole("heading", { name: `${country.name}의 실시간 트렌드` }),
    ).toBeVisible();
    for (const keyword of country.keywords) {
      await expect(page.getByText(keyword, { exact: true })).toBeVisible();
    }

    const summaryResponsePromise = page.waitForResponse((response) => {
      const url = new URL(response.url());
      return (
        url.pathname === "/api/trend/summary" &&
        url.searchParams.get("url") === country.articleUrl
      );
    });
    await page
      .getByText(country.keywords[0], { exact: true })
      .evaluate((element) => element.click());

    const summaryResponse = await summaryResponsePromise;
    expect(summaryResponse.status()).toBe(200);
    expect((await summaryResponse.json()).data).toBe("Mock summary");

    const newsDialog = page.getByRole("dialog", { name: country.title });
    await expect(newsDialog).toBeVisible();
    await expect(newsDialog.getByText(country.source, { exact: true })).toBeVisible();
    await expect(newsDialog.getByText("Mock summary", { exact: true })).toBeVisible();

    const articleLink = newsDialog.getByRole("link", { name: country.title });
    await expect(articleLink).toHaveAttribute("href", country.articleUrl);
    await expect(articleLink).toHaveAttribute("target", "_blank");
    await expect(articleLink).toHaveAttribute("rel", "noopener noreferrer");

    if (country.verifyPopup) {
      const popupPromise = page.waitForEvent("popup");
      await articleLink.evaluate((element) => element.click());
      const popup = await popupPromise;
      await popup.waitForLoadState("domcontentloaded");
      expect(popup.url()).toBe(country.articleUrl);
      await expect(popup.getByRole("heading", { name: "Mock publisher article" })).toBeVisible();
      await popup.close();
    }

    await newsDialog
      .getByRole("button", { name: "기사 닫기" })
      .evaluate((element) => element.click());
    await expect(newsDialog).toBeHidden();
  });
}

test("모바일에서도 지구본과 국가 마커를 렌더링한다", async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await setupLandingRoutes(page);

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(1_000);
  expect(await countRenderedGlobePixels(page, canvas)).toBeGreaterThan(20);

  const markers = page.getByRole("button", { name: / trends$/ });
  const visibleMarkerIndex = await markers.evaluateAll((elements) =>
    elements.findIndex((element) => {
      const rect = element.getBoundingClientRect();
      const opacity = Number.parseFloat(getComputedStyle(element).opacity);
      return (
        opacity >= 0.5 &&
        rect.width > 0 &&
        rect.height > 0 &&
        rect.right > 0 &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.top < window.innerHeight
      );
    }),
  );
  expect(visibleMarkerIndex).toBeGreaterThanOrEqual(0);

  const marker = markers.nth(visibleMarkerIndex);
  await marker.evaluate((element) => element.focus({ preventScroll: true }));
  await expect(marker).toBeInViewport();
  await expect(marker).not.toHaveText("");
  const flag = marker.locator("img");
  await expect(flag).toBeVisible();
  expect(
    await marker.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity)),
  ).toBeGreaterThanOrEqual(0.5);
  expect(
    await flag.evaluate((image) => ({
      cssWidth: Number.parseFloat(getComputedStyle(image).width),
      renderedWidth: image.getBoundingClientRect().width,
      opacity: Number.parseFloat(getComputedStyle(image).opacity),
      loaded: image.naturalWidth > 0,
    })),
  ).toEqual({ cssWidth: 16, renderedWidth: 20, opacity: 1, loaded: true });

  await page.screenshot({
    path: testInfo.outputPath("landing-mobile.png"),
    fullPage: true,
  });
});

test("마커 hover와 focus가 교차해도 상호작용 중 자동 회전을 멈춘다", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await setupLandingRoutes(page);
  await page.addStyleTag({ content: "* { transition: none !important; }" });

  const markers = page.getByRole("button", { name: / trends$/ });
  const visibleMarkerIndex = await markers.evaluateAll((elements) =>
    elements.findIndex((element) => {
      const rect = element.getBoundingClientRect();
      return Number.parseFloat(getComputedStyle(element).opacity) >= 0.5 && rect.width > 0;
    }),
  );
  expect(visibleMarkerIndex).toBeGreaterThanOrEqual(0);

  const result = await markers.nth(visibleMarkerIndex).evaluate(async (element) => {
    const wait = (milliseconds) =>
      new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    const position = () => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y };
    };
    const dispatchPointerTransition = (type, relatedTarget) => {
      element.dispatchEvent(
        new MouseEvent(type, { bubbles: true, relatedTarget }),
      );
    };
    const movement = async () => {
      await wait(300);
      const before = position();
      await wait(500);
      const after = position();
      return {
        x: Math.abs(after.x - before.x),
        y: Math.abs(after.y - before.y),
      };
    };

    dispatchPointerTransition("mouseover", null);
    element.focus({ preventScroll: true });
    dispatchPointerTransition("mouseout", document.body);
    const focusAfterPointerLeave = document.activeElement === element;
    const focusOnlyMovement = await movement();

    dispatchPointerTransition("mouseover", null);
    element.blur();
    const blurWithPointerHover = document.activeElement !== element;
    const hoverOnlyMovement = await movement();
    dispatchPointerTransition("mouseout", document.body);

    return {
      focusAfterPointerLeave,
      blurWithPointerHover,
      focusOnlyMovement,
      hoverOnlyMovement,
    };
  });

  expect(result.focusAfterPointerLeave).toBe(true);
  expect(result.blurWithPointerHover).toBe(true);
  expect(result.focusOnlyMovement.x).toBeLessThan(1);
  expect(result.focusOnlyMovement.y).toBeLessThan(1);
  expect(result.hoverOnlyMovement.x).toBeLessThan(1);
  expect(result.hoverOnlyMovement.y).toBeLessThan(1);
});
