import { useState, useEffect, useRef } from "react";
import styles from "./Chatbot.module.css";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getNewsDetailsAsk } from "../../api/detailsAPI.js";

import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";
import { useAuth } from "../../util/AuthContext.jsx";

export default function Chatbot({ articleId }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { type: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }
    ]);
    const [isStreaming, setIsStreaming] = useState(false);
    const chatRef = useRef(null);
    const closeEventSourceRef = useRef(null);

    const { language } = useLanguage();
    const { token } = useAuth();

    const [placeholder, setPlaceholder] = useState("질문을 입력하세요...");

    useEffect(() => {
        const getTranslation = async () => {
            const translatedText = await fetchTranslatedText("안녕하세요! 무엇을 도와드릴까요?", language);
            const translatedPlaceholder = await fetchTranslatedText("질문을 입력하세요...", language);
            setMessages([{ type: "bot", text: translatedText }]);
            setPlaceholder(translatedPlaceholder);
        };
        getTranslation();
    }, [articleId, language]);

    // 언마운트 시 SSE 연결 종료
    useEffect(() => {
        return () => {
            if (closeEventSourceRef.current) closeEventSourceRef.current();
        };
    }, []);

    const handleSend = () => {
        if (!input.trim() || isStreaming) return;

        const userText = input;
        const newMessages = [...messages, { type: "user", text: userText }];
        setMessages([...newMessages, { type: "bot", text: "" }]);
        setInput("");
        setIsStreaming(true);

        const close = getNewsDetailsAsk(
            articleId,
            userText,
            (chunk) => {
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        text: updated[updated.length - 1].text + chunk,
                    };
                    return updated;
                });
            },
            () => {
                setIsStreaming(false);
            },
            (error) => {
                console.error("스트리밍 에러:", error);
                setIsStreaming(false);
                setMessages((prev) => {
                    const updated = [...prev];
                    if (updated[updated.length - 1].text === "") {
                        updated[updated.length - 1] = { type: "bot", text: "응답을 가져오는 데 실패했습니다." };
                    }
                    return updated;
                });
            },
            token
        );

        closeEventSourceRef.current = close;
    };

    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    return (
        <div className={styles.chatbot}>
            <div className={styles.chatHeader}>Global AI</div>
            {!token && (
                <div className={styles.loginNotice}>
                    💡 로그인하면 대화 내역이 저장되고 문맥이 이어집니다.
                </div>
            )}
            <div className={styles.chatBody} ref={chatRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.type === "bot" ? styles.botMessage : styles.userMessage}>
                        {msg.type === "bot"
                            ? <div className={styles.markdown}><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                            : msg.text
                        }
                    </div>
                ))}
                {isStreaming && messages[messages.length - 1]?.text === "" && (
                    <div className={styles.botMessage}>
                        <span className={styles.typingIndicator}>
                            <span /><span /><span />
                        </span>
                    </div>
                )}
            </div>
            <div className={styles.chatInput}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    disabled={isStreaming}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} disabled={isStreaming}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
