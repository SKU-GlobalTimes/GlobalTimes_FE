import axios from "axios";
import { authAPI } from "./authAPI";

const apiBase = () => import.meta.env.VITE_APP_API ?? "";

// 비로그인: Redis에 저장된 기사별 대화 (백엔드 GET /api/ai/{id}/ask/history)
export const getAnonymousChatsByArticle = async (articleId, sessionId) => {
    if (!sessionId || !articleId) return [];
    try {
        const response = await axios.get(`${apiBase()}/api/ai/${articleId}/ask/history`, {
            params: { anonymousSession: sessionId },
        });
        return response.data?.data ?? [];
    } catch (error) {
        console.error("비로그인 채팅 히스토리 조회 실패:", error);
        return [];
    }
};

// 기사별 전체 대화 내역 (상세 페이지 챗봇)
export const getChatsByArticle = async (articleId) => {
    try {
        const response = await authAPI.get(`/api/articles/${articleId}/chat-history`);
        return response.data?.data ?? [];
    } catch (error) {
        console.error("채팅 히스토리 조회 실패:", error);
        return [];
    }
};

// 기사별 마지막 대화 미리보기 목록 (플로팅 팝업)
export const getChatList = async () => {
    try {
        const response = await authAPI.get("/api/user/chat-history");
        return response.data?.data ?? [];
    } catch (error) {
        console.error("채팅 히스토리 목록 조회 실패:", error);
        return [];
    }
};
