import { authAPI } from "./authAPI";
import { apiClient } from "./apiClient";

// 비로그인: Redis에 저장된 기사별 대화 (백엔드 GET /api/ai/{id}/ask/history)
export const getAnonymousChatsByArticle = async (articleId, sessionId) => {
    if (!sessionId || !articleId) return [];
    const response = await apiClient.get(`/api/ai/${articleId}/ask/history`, {
        params: { anonymousSession: sessionId },
    });
    const raw = response.data?.data;
    const list = Array.isArray(raw) ? raw : [];
    return list.map((row) => ({
        question: row?.question ?? row?.q ?? "",
        answer: row?.answer ?? row?.a ?? "",
    }));
};

// 기사별 전체 대화 내역 (상세 페이지 챗봇)
export const getChatsByArticle = async (articleId) => {
    const response = await authAPI.get(`/api/articles/${articleId}/chat-history`);
    return response.data?.data ?? [];
};

// 기사별 마지막 대화 미리보기 목록 (플로팅 팝업, 로그인)
export const getChatList = async () => {
    const response = await authAPI.get("/api/user/chat-history");
    return response.data?.data ?? [];
};

/** 비로그인: 세션별 대화한 기사 목록 (플로팅, BE GET /api/ai/anonymous/chat-history) */
export const getAnonymousChatList = async (sessionId) => {
    if (!sessionId) return [];
    const response = await apiClient.get("/api/ai/anonymous/chat-history", {
        params: { anonymousSession: sessionId },
    });
    return response.data?.data ?? [];
};
