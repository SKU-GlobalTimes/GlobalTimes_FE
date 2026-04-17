import axios from "axios";
import { authAPI } from "./authAPI";

const apiBase = () => import.meta.env.VITE_APP_API ?? "";

/** detailsAPI·SSE와 동일: 빈 문자열이면 상대 경로 `/api/...` (Vite 프록시) */
function historyUrl(articleId) {
    const base = apiBase();
    return base ? `${base}/api/ai/${articleId}/ask/history` : `/api/ai/${articleId}/ask/history`;
}

// 비로그인: Redis에 저장된 기사별 대화 (백엔드 GET /api/ai/{id}/ask/history)
export const getAnonymousChatsByArticle = async (articleId, sessionId) => {
    if (!sessionId || !articleId) return [];
    try {
        const response = await axios.get(historyUrl(articleId), {
            params: { anonymousSession: sessionId },
        });
        const raw = response.data?.data;
        const list = Array.isArray(raw) ? raw : [];
        return list.map((row) => ({
            question: row?.question ?? row?.q ?? "",
            answer: row?.answer ?? row?.a ?? "",
        }));
    } catch (error) {
        console.error("비로그인 채팅 히스토리 조회 실패:", error?.response?.status, error?.message);
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

// 기사별 마지막 대화 미리보기 목록 (플로팅 팝업, 로그인)
export const getChatList = async () => {
    try {
        const response = await authAPI.get("/api/user/chat-history");
        return response.data?.data ?? [];
    } catch (error) {
        console.error("채팅 히스토리 목록 조회 실패:", error);
        return [];
    }
};

function anonymousChatListUrl() {
    const base = apiBase();
    return base
        ? `${base}/api/ai/anonymous/chat-history`
        : `/api/ai/anonymous/chat-history`;
}

/** 비로그인: 세션별 대화한 기사 목록 (플로팅, BE GET /api/ai/anonymous/chat-history) */
export const getAnonymousChatList = async (sessionId) => {
    if (!sessionId) return [];
    try {
        const response = await axios.get(anonymousChatListUrl(), {
            params: { anonymousSession: sessionId },
        });
        return response.data?.data ?? [];
    } catch (error) {
        console.error(
            "비로그인 채팅 목록 조회 실패:",
            error?.response?.status,
            error?.message
        );
        return [];
    }
};
