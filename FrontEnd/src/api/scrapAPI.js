import { authAPI } from "./authAPI";

// 스크랩 토글 (로그인 필요) → { scrapped: true/false }
export const toggleScrap = async (articleId) => {
    try {
        const response = await authAPI.post(`/api/articles/${articleId}/scrap`);
        return response.data?.data?.scrapped ?? false;
    } catch (error) {
        console.error("스크랩 토글 실패:", error);
        return null;
    }
};

// 내 스크랩 목록 (로그인 필요) → ScrapListResDTO[]
export const getMyScrapList = async () => {
    try {
        const response = await authAPI.get("/api/user/scraps");
        return response.data?.data ?? [];
    } catch (error) {
        console.error("스크랩 목록 조회 실패:", error);
        return [];
    }
};

// 특정 기사 스크랩 여부 (로그인 필요) → true/false
export const getScrapStatus = async (articleId) => {
    try {
        const response = await authAPI.get(`/api/articles/${articleId}/scrap/status`);
        return response.data?.data?.scrapped ?? false;
    } catch (error) {
        console.error("스크랩 상태 조회 실패:", error);
        return false;
    }
};
