import { apiClient } from "./apiClient";

export const getNewsDetails = async (articleId) => {
    const response = await apiClient.get("/api/news/detail", {
        params: { id: articleId },
    });
    return response.data;
};

export const getNewsDetailsSummary = async (articleId) => {
    const response = await apiClient.get(`/api/ai/${articleId}/summary`);
    return response.data;
};

/** 국가별 시각(Perspectives): 키워드 기반 유사 기사를 국가 코드별로 그룹 */
export const getNewsPerspectives = async (articleId) => {
    const response = await apiClient.get(`/api/news/${articleId}/perspectives`);
    return response.data;
};

export const getNewsDetailsAsk = (
    articleId,
    question,
    onMessage,
    onComplete,
    onError,
    token = null,
    anonymousSessionId = null
) => {
    const base = import.meta.env.VITE_APP_API ?? "";
    let url = `${base}/api/ai/${articleId}/ask?question=${encodeURIComponent(question)}`;
    // EventSource는 커스텀 헤더 미지원 → 로그인: token, 비로그인: anonymousSession (BE Redis 맥락)
    if (token) {
        url += `&token=${encodeURIComponent(token)}`;
    } else if (anonymousSessionId) {
        url += `&anonymousSession=${encodeURIComponent(anonymousSessionId)}`;
    }

    const eventSource = new EventSource(url);

    let previousText = "";
    let settled = false;

    eventSource.onmessage = (event) => {
        if (settled) return;
        const newText = event.data;
        const newChunk = newText.slice(previousText.length);
        previousText = newText;
        onMessage(newChunk);
    };

    eventSource.onerror = (error) => {
        if (settled) return;
        settled = true;
        console.error("SSE 연결 오류:", error);
        eventSource.close();
        if (onError) onError(error);
    };

    eventSource.addEventListener("end", () => {
        if (settled) return;
        settled = true;
        eventSource.close();
        if (onComplete) onComplete();
    });

    return () => {
        settled = true;
        eventSource.close();
    };
};
