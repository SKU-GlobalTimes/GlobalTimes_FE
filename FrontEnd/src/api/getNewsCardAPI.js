import axios from "axios";

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
  try {
    const baseUrl = `${import.meta.env.VITE_APP_API}/api/articles/popular?page=${page}&size=${size}`;
    const response = await axios.get(baseUrl);

    if (response.data.isSuccess === true) {
      const formattedResults =
        response.data.data.content.map(formatArticleDates);
      return formattedResults;
    } else {
      return [];
    }
  } catch (error) {
    console.error("인기 뉴스 데이터를 불러오는 데 실패했습니다:", error);
    return [];
  }
}

// mainPage - Latest News Card (cursor 기반 최신순, /api/articles/latest offset 대체)
/** @returns {{ articles: object[], nextCursor: string|null, hasNext: boolean }} */
export async function getLatestCursor(cursor, size) {
  try {
    const params = new URLSearchParams({ size: String(size) });
    if (cursor) params.set("cursor", cursor);
    const baseUrl = `${import.meta.env.VITE_APP_API}/api/articles/cursor?${params}`;
    const response = await axios.get(baseUrl);

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
  } catch (error) {
    console.error("최근 뉴스 데이터를 불러오는 데 실패했습니다:", error);
    return { articles: [], nextCursor: null, hasNext: false };
  }
}

/** 국가·카테고리·날짜 필터 + 커서 (/api/articles/explore). 키워드 검색과는 별개 API. */
export async function getExploreArticles({
  country,
  category,
  date,
  cursor,
  size = 12,
}) {
  try {
    const params = new URLSearchParams({ size: String(size) });
    if (country) params.set("country", country);
    if (category) params.set("category", category);
    if (date) params.set("date", date);
    if (cursor) params.set("cursor", cursor);
    const baseUrl = `${import.meta.env.VITE_APP_API}/api/articles/explore?${params}`;
    const response = await axios.get(baseUrl);

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
  } catch (error) {
    console.error("탐색 기사를 불러오는 데 실패했습니다:", error);
    return { articles: [], nextCursor: null, hasNext: false };
  }
}

// mainPage - Search News Card //
// response.data.data.originalText
/** @param {string} input 검색어
 *  @param {{ country?: string, category?: string, date?: string }} [exploreFilters] 탐색과 동일 필터(BE /api/search 선택 파라미터) */
export async function getSearch(input, exploreFilters = {}) {
  try {
    const params = new URLSearchParams();
    params.set("text", input);
    if (exploreFilters.country) params.set("country", exploreFilters.country);
    if (exploreFilters.category)
      params.set("category", exploreFilters.category);
    if (exploreFilters.date) params.set("date", exploreFilters.date);
    const baseUrl = `${import.meta.env.VITE_APP_API}/api/search?${params.toString()}`;
    const response = await axios.get(baseUrl);

    if (response.data.isSuccess === true) {
      const originalText = response.data.data.originalText;
      const translatedText = response.data.data.translatedText;
      // 날짜를 분리해서 새로운 객체 생성
      const formattedResults = response.data.data.searchArticles.map(
        (article) => {
          const date = new Date(article.publishedAt); // 문자열을 Date 객체로 변환
          return {
            ...article,
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, "0"), // 두 자리로 맞춤
            day: date.getDate().toString().padStart(2, "0"), // 두 자리로 맞춤
          };
        },
      );
      // console.log("원래 텍스트 " + originalText);

      return {
        results: formattedResults,
        originalText: originalText,
        translatedText: translatedText,
      };
    } else {
      return { results: [], translatedText: "" };
    }
  } catch (error) {
    console.error("검색 뉴스 결과 데이터를 불러오는 데 실패했습니다:", error);
    return { results: [], translatedText: "" };
  }
}

// scrapPage - Scrap News Card //
export async function getScrap() {
  try {
    const storedScrapIds = JSON.parse(localStorage.getItem("scrapIds")) || []; // 저장된 ID 가져오기

    if (storedScrapIds.length === 0) return [];

    const queryString = storedScrapIds.map((id) => `id=${id}`).join("&");
    const baseUrl = `${import.meta.env.VITE_APP_API}/api/scrap?${queryString}`;
    const response = await axios.get(baseUrl);

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
    } else {
      return [];
    }
  } catch (error) {
    console.error("스크랩 뉴스 데이터를 불러오는 데 실패했습니다:", error);
    return [];
  }
}
