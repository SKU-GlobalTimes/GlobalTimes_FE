import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../../util/AuthContext.jsx";
import { getChatList } from "../../api/chatAPI.js";
import styles from "./ChatHistoryButton.module.css";

export default function ChatHistoryButton() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const popupRef = useRef(null);

    // 로그인 상태에서 팝업 열 때 히스토리 불러오기
    useEffect(() => {
        if (!isOpen || !token) return;
        const fetchList = async () => {
            setIsLoading(true);
            const data = await getChatList();
            setChatList(data);
            setIsLoading(false);
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

    return (
        <div className={styles.wrapper} ref={popupRef}>
            {/* 팝업 */}
            {isOpen && (
                <div className={styles.popup}>
                    <div className={styles.popupHeader}>
                        <span>채팅 히스토리</span>
                        <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                            <X size={16} />
                        </button>
                    </div>
                    <div className={styles.popupBody}>
                        {/* 비로그인 안내 */}
                        {!token && (
                            <div className={styles.loginPrompt}>
                                <MessageSquare size={36} className={styles.promptIcon} />
                                <p className={styles.promptText}>
                                    로그인하면 기사별 AI 대화 내역을<br />언제든지 다시 볼 수 있어요.
                                </p>
                                <button
                                    className={styles.loginBtn}
                                    onClick={() => {
                                        setIsOpen(false);
                                        window.location.href = "/oauth2/authorization/google";
                                    }}
                                >
                                    Google로 로그인
                                </button>
                            </div>
                        )}

                        {/* 로그인 상태 */}
                        {token && isLoading && <p className={styles.empty}>불러오는 중...</p>}
                        {token && !isLoading && chatList.length === 0 && (
                            <p className={styles.empty}>저장된 대화 내역이 없습니다.</p>
                        )}
                        {token && !isLoading && chatList.map((item) => (
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
                                        {new Date(item.lastChatAt).toLocaleString("ko-KR")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 플로팅 버튼 */}
            <button
                className={styles.fab}
                onClick={() => setIsOpen((prev) => !prev)}
                title="채팅 히스토리"
            >
                <MessageSquare size={22} />
            </button>
        </div>
    );
}
