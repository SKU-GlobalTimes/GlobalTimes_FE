import { useState, useEffect, useRef } from "react";
import styles from "./Chatbot.module.css";
import { Send } from "lucide-react";
import { getNewsDetailsAsk } from "../../api/detailsAPI.js";

//번역 컴포넌트
import TranslatedText from "../../api/TranslatedText.jsx";
//번역 함수 (text반환)
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";
//전역 현재 사용자 언어
import { useLanguage } from "../../util/LanguageContext.jsx";

export default function Chatbot({ articleId }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { type: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }
    ]);
    const chatRef = useRef(null);

    // 전역 현재 사용자 언어
    const { language } = useLanguage();

    // placeholder 변수
    const [placeholder, setPlaceholder] = useState("질문을 입력하세요...");

    useEffect(() => {
        const getTranslation = async () => {
            const translatedText = await fetchTranslatedText("안녕하세요! 무엇을 도와드릴까요?", language)
            const translatedPlaceholder = await fetchTranslatedText("질문을 입력하세요...", language);
            setMessages([{ type: "bot", text: translatedText }]);
            setPlaceholder(translatedPlaceholder);
        }
        getTranslation();
    }, [articleId, language]);
    

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { type: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        // 봇의 응답을 빈 문자열로 추가
        const botMsg = { type: "bot", text: "" };
        setMessages([...newMessages, botMsg]);

        getNewsDetailsAsk(
            articleId,
            input,
            (chunk) => {
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].text += chunk; // 새 글자만 추가
                    return updated;
                });
            },
            (error) => console.error("스트리밍 에러:", error)
        );
    };

    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    return (
        <div className={styles.chatbot}>
            <div className={styles.chatHeader}>Global AI</div>
            <div className={styles.chatBody} ref={chatRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.type === "bot" ? styles.botMessage : styles.userMessage}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className={styles.chatInput}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
