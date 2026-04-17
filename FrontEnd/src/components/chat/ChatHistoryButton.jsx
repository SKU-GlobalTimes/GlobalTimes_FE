import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../../util/AuthContext.jsx";
import { getAnonymousChatList, getChatList } from "../../api/chatAPI.js";
import { getOrCreateAnonymousSessionId } from "../../util/anonymousSession.js";
import styles from "./ChatHistoryButton.module.css";
import TranslatedText from "../../api/TranslatedText.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";
import { useTranslatedLabel } from "../../hooks/useTranslatedLabel.js";

export default function ChatHistoryButton() {
    const { token } = useAuth();
    const { language } = useLanguage();
    const fabLabel = useTranslatedLabel("채팅 히스토리");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const popupRef = useRef(null);

    // 팝업 열 때: 로그인 → DB 목록, 비로그인 → Redis 세션 목록
    useEffect(() => {
        if (!isOpen) return;
        const fetchList = async () => {
            setIsLoading(true);
            try {
                if (token) {
                    const data = await getChatList();
                    setChatList(data);
                } else {
                    const sid = getOrCreateAnonymousSessionId();
                    const data = await getAnonymousChatList(sid);
                    setChatList(data);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchList();
    }, [isOpen, token]);

    // 팝업 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const dateLocale =
        language === "ja" ? "ja-JP" : language === "ko" ? "ko-KR" : "en-US";

    return (
        <div className={styles.wrapper} ref={popupRef}>
            {isOpen && (
                <div className={styles.popup}>
                    <div className={styles.popupHeader}>
                        <span>
                            <TranslatedText text="채팅 히스토리" />
                        </span>
                        <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                            <X size={16} />
                        </button>
                    </div>
                    <div className={styles.popupBody}>
                        {isLoading && (
                            <p className={styles.empty}>
                                <TranslatedText text="불러오는 중..." />
                            </p>
                        )}
                        {!isLoading && chatList.length === 0 && (
                            <p className={styles.empty}>
                                <TranslatedText text="저장된 대화 내역이 없습니다." />
                            </p>
                        )}
                        {!isLoading &&
                            chatList.map((item) => (
                                <div
                                    key={item.articleId}
                                    className={styles.chatItem}
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate(`/detail/${item.articleId}`);
                                    }}
                                >
                                    <div
                                        className={styles.thumbnail}
                                        style={{
                                            backgroundImage: item.thumbnailUrl
                                                ? `url(${item.thumbnailUrl})`
                                                : undefined,
                                        }}
                                    />
                                    <div className={styles.chatInfo}>
                                        <p className={styles.articleTitle}>{item.articleTitle}</p>
                                        <p className={styles.lastQuestion}>Q: {item.lastQuestion}</p>
                                        <div className={styles.preview}>
                                            <ReactMarkdown>{item.lastAnswerPreview}</ReactMarkdown>
                                        </div>
                                        <p className={styles.time}>
                                            {new Date(item.lastChatAt).toLocaleString(dateLocale)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                    {!token && !isLoading && (
                        <div className={styles.anonFooter}>
                            {chatList.length > 0 && (
                                <p className={styles.anonHint}>
                                    <TranslatedText text="비로그인 대화는 일정 기간 후 자동 삭제됩니다." />
                                    <br />
                                    <TranslatedText text="로그인하면 계정에 보관됩니다." />
                                </p>
                            )}
                            <button
                                type="button"
                                className={styles.loginBtn}
                                onClick={() => {
                                    setIsOpen(false);
                                    window.location.href = "/oauth2/authorization/google";
                                }}
                            >
                                <TranslatedText text="Google로 로그인" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <button
                className={styles.fab}
                onClick={() => setIsOpen((prev) => !prev)}
                title={fabLabel}
                aria-label={fabLabel}
            >
                <MessageSquare size={22} />
            </button>
        </div>
    );
}
