import { apiClient } from "./apiClient";

function safeParseDate(s) {
  if (!s) return null;
  try {
    const iso = s.includes("T") ? s : s.replace(" ", "T").split(".")[0];
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  } catch (e) {
    return null;
  }
}

function formatArticleDates(article) {
  const date = safeParseDate(article.publishedAt);
  if (!date) {
    return { ...article, year: "", month: "", day: "" };
  }
  return {
    ...article,
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    day: date.getDate().toString().padStart(2, "0"),
  };
}

// mainPage - Hot News Card //
// response.data.data.content[0].title
export async function getHot(page, size) {
  const response = await apiClient.get("/api/articles/popular", {
    params: { page, size },
  });

  if (response.data.isSuccess === true) {
    return response.data.data.content.map(formatArticleDates);
  }
  return [];
}

// mainPage - Latest News Card (cursor 기반 최신순, /api/articles/latest offset 대체)
/** @returns {{ articles: object[], nextCursor: string|null, hasNext: boolean }} */
export async function getLatestCursor(cursor, size) {
  const params = new URLSearchParams({ size: String(size) });
  if (cursor) params.set("cursor", cursor);
  const response = await apiClient.get(`/api/articles/cursor?${params}`);

  if (response.data.isSuccess === true && response.data.data) {
    const { articles, nextCursor, hasNext } = response.data.data;
    const formattedResults = (articles || []).map(formatArticleDates);
    return {
      articles: formattedResults,
      nextCursor: nextCursor ?? null,
      hasNext: Boolean(hasNext),
    };
  }
  return { articles: [], nextCursor: null, hasNext: false };
}

/** 국가·카테고리·날짜 필터 + 커서 (/api/articles/explore). 키워드 검색과는 별개 API. */
export async function getExploreArticles({
  country,
  category,
  date,
  cursor,
  size = 12,
}) {
  const params = new URLSearchParams({ size: String(size) });
  if (country) params.set("country", country);
  if (category) params.set("category", category);
  if (date) params.set("date", date);
  if (cursor) params.set("cursor", cursor);
  const response = await apiClient.get(`/api/articles/explore?${params}`);

  if (response.data.isSuccess === true && response.data.data) {
    const { articles, nextCursor, hasNext } = response.data.data;
    const formattedResults = (articles || []).map(formatArticleDates);
    return {
      articles: formattedResults,
      nextCursor: nextCursor ?? null,
      hasNext: Boolean(hasNext),
    };
  }
  return { articles: [], nextCursor: null, hasNext: false };
}

// mainPage - Search News Card //
// response.data.data.originalText
/** @param {string} input 검색어
 *  @param {{ country?: string, category?: string, date?: string }} [exploreFilters] 탐색과 동일 필터(BE /api/search 선택 파라미터) */
export async function getSearch(input, exploreFilters = {}) {
  const params = new URLSearchParams();
  params.set("text", input);
  if (exploreFilters.country) params.set("country", exploreFilters.country);
  if (exploreFilters.category) params.set("category", exploreFilters.category);
  if (exploreFilters.date) params.set("date", exploreFilters.date);
  const response = await apiClient.get(`/api/search?${params.toString()}`);

  if (response.data.isSuccess === true) {
    const originalText = response.data.data.originalText;
    const translatedText = response.data.data.translatedText;
    const formattedResults = response.data.data.searchArticles.map((article) => {
      const date = new Date(article.publishedAt);
      return {
        ...article,
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString().padStart(2, "0"),
        day: date.getDate().toString().padStart(2, "0"),
      };
    });

    return { results: formattedResults, originalText, translatedText };
  }
  return { results: [], translatedText: "" };
}

// scrapPage - Scrap News Card //
export async function getScrap(articleIds) {
  const storedScrapIds = articleIds ?? JSON.parse(localStorage.getItem("scrapIds")) ?? [];

  if (storedScrapIds.length === 0) return [];

  const queryString = storedScrapIds.map((id) => `id=${id}`).join("&");
  const response = await apiClient.get(`/api/scrap?${queryString}`);

  if (response.data.isSuccess) {
      // 날짜를 분리해서 새로운 객체 생성
      const formattedResults = response.data.data.map((article) => {
        if (!article.publishedAt) {
          console.warn("날짜 정보 없음:", article);
          return { ...article, year: "", month: "", day: "" }; // 날짜 없는 경우 빈 값 처리
        }

        const date = new Date(article.publishedAt); // 날짜 변환
        return {
          ...article,
          year: date.getFullYear().toString(),
          month: (date.getMonth() + 1).toString().padStart(2, "0"), // 두 자리수 맞춤
          day: date.getDate().toString().padStart(2, "0"), // 두 자리수 맞춤
        };
      });

    return formattedResults;
  }
  return [];
}
