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

export const getNewsDetailsAsk = (articleId, question, onMessage, onComplete, onError, token = null) => {
    let url = `${import.meta.env.VITE_APP_API}/api/ai/${articleId}/ask?question=${encodeURIComponent(question)}`;
    // EventSource는 커스텀 헤더 미지원 → 로그인 시 쿼리 파라미터로 토큰 전달 (BE 인증 + 히스토리 저장)
    if (token) {
        url += `&token=${encodeURIComponent(token)}`;
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
