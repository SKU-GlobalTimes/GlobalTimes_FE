import { authAPI } from "./authAPI";

// 스크랩 토글 (로그인 필요) → { scrapped: true/false }
export const toggleScrap = async (articleId) => {
    const response = await authAPI.post(`/api/articles/${articleId}/scrap`);
    return response.data?.data?.scrapped ?? false;
};

// 내 스크랩 목록 (로그인 필요) → ScrapListResDTO[]
export const getMyScrapList = async () => {
    const response = await authAPI.get("/api/user/scraps");
    return response.data?.data ?? [];
};

// 특정 기사 스크랩 여부 (로그인 필요) → true/false
export const getScrapStatus = async (articleId) => {
    const response = await authAPI.get(`/api/articles/${articleId}/scrap/status`);
    return response.data?.data?.scrapped ?? false;
};
