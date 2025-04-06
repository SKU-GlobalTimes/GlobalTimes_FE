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

export const getNewsDetailsAsk = (articleId, question, onMessage, onComplete, onError) => {
    const eventSource = new EventSource(
        `${import.meta.env.VITE_APP_API}/api/ai/${articleId}/ask?question=${encodeURIComponent(question)}`
    );

    let previousText = ""; // 이전까지 받은 전체 데이터 저장

    eventSource.onmessage = (event) => {
        const newText = event.data; // 서버에서 받은 전체 문장
        const newChunk = newText.slice(previousText.length); // 기존 데이터와 비교해 새로운 부분만 추출
        previousText = newText; // 기존 데이터를 최신 상태로 업데이트

        onMessage(newChunk); // 새 글자만 추가
    };

    eventSource.onerror = (error) => {
        console.error("SSE 연결 오류:", error);
        eventSource.close();
        onError(error);
    };

    eventSource.addEventListener("end", () => {
        eventSource.close();
        onComplete();
    });

    return () => eventSource.close(); // 컴포넌트 언마운트 시 연결 종료
};
