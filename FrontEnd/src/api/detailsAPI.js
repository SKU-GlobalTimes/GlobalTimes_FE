import axios from "axios";

export const getNewsDetails = async (articleId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/news/detail?id=${articleId}`);
        return response.data;
    } catch (error) {
        console.error("뉴스 상세 정보를 불러오는 데 실패했습니다.", error);
        return null;
    }
};

export const getNewsDetailsSummary = async (articleId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/ai/${articleId}/summary`);
        return response.data;
    } catch (error) {
        console.error("뉴스 요약본을 불러오는 데 실패했습니다.", error);
        return null;
    }
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

    eventSource.onmessage = (event) => {
        const newText = event.data;
        const newChunk = newText.slice(previousText.length);
        previousText = newText;
        onMessage(newChunk);
    };

    eventSource.onerror = (error) => {
        console.error("SSE 연결 오류:", error);
        eventSource.close();
        if (onError) onError(error);
    };

    eventSource.addEventListener("end", () => {
        eventSource.close();
        if (onComplete) onComplete();
    });

    return () => eventSource.close();
};
