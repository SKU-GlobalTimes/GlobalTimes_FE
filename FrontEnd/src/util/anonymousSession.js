const STORAGE_KEY = "globalTimes_anonymous_chat_session_id";

/** 비로그인 기사 챗봇용 UUID. 없으면 생성해 localStorage에 둡니다. */
export function getOrCreateAnonymousSessionId() {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
}

/** 로그인 시 호출: 익명 세션 키 제거(Redis TTL은 서버에서 만료). */
export function clearAnonymousSessionId() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}
